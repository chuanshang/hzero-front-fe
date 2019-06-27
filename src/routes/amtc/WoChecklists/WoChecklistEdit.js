import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, InputNumber, Select, Modal, Spin } from 'hzero-ui';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';
import classNames from 'classnames';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
  DETAIL_DEFAULT_CLASSNAME,
} from 'utils/constants';
import { yesOrNoRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';
import styles from './index.less';

@Form.create({ fieldNameProp: null })
class WoChecklistEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseKeys: ['A'],
      parentTypeChangeCode: '',
    };
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  /**
   * 保存
   */
  @Bind()
  handleSave() {
    const { form, dataSource, onConfirmLine } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onConfirmLine({ ...dataSource, ...values });
      }
    });
  }
  @Bind()
  handleParentTypeChange(value) {
    let key = '';
    if (value === 'WO') {
      key = 'AMTC.WO';
    } else {
      key = 'AMTC.WOOP';
    }
    this.setState({
      parentTypeChangeCode: key,
    });
  }
  render() {
    const prefix = `amtc.checkLists.view.message`;
    const modelPrompt = 'amtc.checkLists.model.checkLists';
    const {
      anchor,
      title,
      isNew,
      loading,
      editFlag,
      editVisible,
      parentId,
      parentType,
      tenantId,
      parentTypeMap,
      dataSource = {},
      form,
      fieldTypeList,
      businessScenarioList,
      onCancelLine,
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { collapseKeys = [], parentTypeChangeCode } = this.state;
    return (
      <React.Fragment>
        <Modal
          maskClosable
          destroyOnClose
          title={title}
          width={1200}
          wrapClassName={`ant-modal-sidebar-${anchor}`}
          transitionName={`move-${anchor}`}
          visible={editVisible}
          // confirmLoading={loading}
          onOk={this.handleSave}
          okText={intl.get('hzero.common.button.sure').d('确认')}
          onCancel={onCancelLine}
          cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        >
          <Spin
            spinning={isUndefined(dataSource.checklistId) ? false : loading.listLoading}
            wrapperClassName={classNames(
              styles['wo-checklist-group-detail'],
              DETAIL_DEFAULT_CLASSNAME
            )}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.basicInfo`).d('基础信息')}</h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.parentTypeCode`).d('对象')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          <Fragment>
                            <Col span={9}>
                              {getFieldDecorator('parentTypeCode', {
                                initialValue: parentId ? parentType : dataSource.parentTypeCode,
                                rules: [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl.get(`${prefix}.parentTypeCode`).d('对象'),
                                    }),
                                  },
                                ],
                              })(
                                <Select onChange={this.handleParentTypeChange}>
                                  {parentTypeMap.map(i => (
                                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                                  ))}
                                </Select>
                              )}
                            </Col>
                            <Col span={14} offset={1}>
                              {getFieldDecorator('parentId', {
                                initialValue: parentId || dataSource.parentId,
                                rules: [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl.get(`${prefix}.parentId`).d('对象'),
                                    }),
                                  },
                                ],
                              })(
                                <Lov
                                  code={parentTypeChangeCode || 'WO'}
                                  queryParams={{ organizationId: tenantId }}
                                  textValue={dataSource.parentName}
                                />
                              )}
                            </Col>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <Col span={9}>
                              <span>{dataSource.parentTypeMeaning}</span>
                            </Col>
                            <Col span={14} offset={1}>
                              <span>{dataSource.parentName}</span>
                            </Col>
                          </Fragment>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.businessScenarioCode`).d('业务场景')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('businessScenarioCode', {
                            initialValue: dataSource.businessScenarioCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${modelPrompt}.businessScenarioCode`)
                                    .d('业务场景'),
                                }),
                              },
                            ],
                          })(
                            <Select allowClear>
                              {businessScenarioList.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.businessScenarioMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.itemSeq`).d('序号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('itemSeq', {
                            initialValue: dataSource.itemSeq,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.itemSeq`).d('序号'),
                                }),
                              },
                            ],
                          })(<InputNumber min={0} />)
                        ) : (
                          <span>{dataSource.itemSeq}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.checklistName`).d('检查组名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('checklistName', {
                            initialValue: dataSource.checklistName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.checklistName`).d('检查组名称'),
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.checklistName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.methodCode`).d('检测方式')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('methodCode', {
                            initialValue: dataSource.methodCode,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.methodCode}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.standardReference`).d('参考标准')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('standardReference', {
                            initialValue: dataSource.standardReference,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.standardReference}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.columnTypeCode`).d('字段类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('columnTypeCode', {
                            initialValue: dataSource.columnTypeCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.columnTypeCode`).d('字段类型'),
                                }),
                              },
                            ],
                          })(
                            <Select allowClear>
                              {fieldTypeList.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.columnTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.parentChecklist`).d('父项')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('parentChecklistId', {
                            initialValue: dataSource.parentChecklistId,
                          })(
                            <Lov
                              code=""
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.parentChecklistId}
                            />
                          )
                        ) : (
                          <span>{dataSource.parentChecklistId}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.mustCheckFlag`).d('是否必检')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('mustCheckFlag', {
                            initialValue: dataSource.mustCheckFlag,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.mustCheckFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.showTableFlag`).d('是否展示在表头')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('showTableFlag', {
                            initialValue: dataSource.showTableFlag,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.showTableFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    {getFieldsValue().columnTypeCode === 'YESORNO' ? (
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.defaultShowFlag`).d('默认拍照类型')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('defaultShowFlag', {
                              initialValue: dataSource.defaultShowFlag,
                            })(<Switch />)
                          ) : (
                            <span>{yesOrNoRender(dataSource.defaultShowFlag)}</span>
                          )}
                        </Form.Item>
                      </Col>
                    ) : (
                      ''
                    )}
                    {getFieldsValue().columnTypeCode === 'TEXT' ? (
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.minimumWordLimit`).d('最低字数限制')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('minimumWordLimit', {
                              initialValue: dataSource.minimumWordLimit,
                            })(<InputNumber min={0} />)
                          ) : (
                            <span>{dataSource.minimumWordLimit}</span>
                          )}
                        </Form.Item>
                      </Col>
                    ) : (
                      ''
                    )}
                    {getFieldsValue().columnTypeCode === 'LISTOFVALUE' ? (
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.listValueCode`).d('值列表')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('listValueCode', {
                              initialValue: dataSource.listValueCode,
                            })(<Select allowClear />)
                          ) : (
                            <span>{dataSource.listValueMeaning}</span>
                          )}
                        </Form.Item>
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                </Form>
              </Collapse.Panel>
              {getFieldsValue().columnTypeCode === 'NUMBER' ? (
                <Collapse.Panel
                  showArrow={false}
                  key="B"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${prefix}.panel.B`).d('数值型字段参数')}</h3>
                      <a>
                        {collapseKeys.includes('B')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <Form>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.minStandardValue`).d('标准最小值')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('minStandardValue', {
                              initialValue: dataSource.minStandardValue,
                            })(<InputNumber precision={3} />)
                          ) : (
                            <span>{dataSource.minStandardValue}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.maxStandardValue`).d('标准最大值')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('maxStandardValue', {
                              initialValue: dataSource.maxStandardValue,
                            })(<InputNumber precision={3} />)
                          ) : (
                            <span>{dataSource.maxStandardValue}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.targetValue`).d('目标值')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('targetValue', {
                              initialValue: dataSource.targetValue,
                            })(<InputNumber precision={3} />)
                          ) : (
                            <span>{dataSource.targetValue}</span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.minReasonableValue`).d('合理最小值')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('minReasonableValue', {
                              initialValue: dataSource.minReasonableValue,
                            })(<InputNumber precision={3} />)
                          ) : (
                            <span>{dataSource.minReasonableValue}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.maxReasonableValue`).d('合理最大值')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('maxReasonableValue', {
                              initialValue: dataSource.maxReasonableValue,
                            })(<InputNumber precision={3} />)
                          ) : (
                            <span>{dataSource.maxReasonableValue}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${modelPrompt}.valueUom`).d('数值单位')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('valueUomId', {
                              initialValue: dataSource.valueUomId,
                            })(
                              <Lov
                                code="AMTC.UOM"
                                queryParams={{ organizationId: tenantId }}
                                textValue={dataSource.valueUomMeaning}
                              />
                            )
                          ) : (
                            <span>{dataSource.valueUomMeaning}</span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Collapse.Panel>
              ) : (
                ''
              )}
              <Collapse.Panel
                showArrow={false}
                key="C"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.C`).d('实际值')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              />
              <Form>
                <Row {...EDIT_FORM_ROW_LAYOUT} className={editFlag ? 'inclusion-row' : 'read-row'}>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${modelPrompt}.actValue`).d('实际值')}
                      {...EDIT_FORM_ITEM_LAYOUT}
                    >
                      {!isNew || editFlag ? (
                        getFieldDecorator('actValue', {
                          initialValue: dataSource.actValue,
                        })(<Input />)
                      ) : (
                        <span>{dataSource.actValue}</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row {...EDIT_FORM_ROW_LAYOUT} className={editFlag ? 'inclusion-row' : 'read-row'}>
                  <Col span={22}>
                    <Form.Item
                      label={intl.get(`${modelPrompt}.description`).d('记录备注')}
                      {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                    >
                      {!isNew || editFlag ? (
                        getFieldDecorator('description', {
                          initialValue: dataSource.description,
                        })(<Input.TextArea rows={2} />)
                      ) : (
                        <span>{dataSource.description}</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Collapse>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}
export default WoChecklistEdit;
