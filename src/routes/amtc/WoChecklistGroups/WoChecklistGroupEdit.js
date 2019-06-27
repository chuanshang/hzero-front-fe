import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, InputNumber, Select, Modal, Spin } from 'hzero-ui';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';
import classNames from 'classnames';
import Lov from 'components/Lov';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
  DETAIL_DEFAULT_CLASSNAME,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import WoChecklistList from '../WoChecklists/WoChecklistList';
import styles from './index.less';

@Form.create({ fieldNameProp: null })
class WoChecklistGroupEdit extends Component {
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
    const { form, dataSource, onConfirm } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onConfirm({ ...dataSource, ...values });
      }
    });
  }
  @Bind()
  handleParentTypeChange(value) {
    let key = '';
    if (value === 'WO') {
      key = 'AMTC.WORK_ORDER';
    } else {
      key = 'AMTC.WOOP';
    }
    this.setState({
      parentTypeChangeCode: key,
    });
  }
  @Bind()
  actChecklistChange(value, record) {
    const { form } = this.props;
    form.setFieldsValue({
      groupName: record.groupName,
      groupClassCode: record.groupClassCode,
      groupSeq: record.groupSeq,
      standardTotalScore: record.standardTotalScore,
    });
  }

  render() {
    const prefix = `amtc.checkLists.view.message`;
    const modelPrompt = 'amtc.checkLists.model.checkLists';
    const {
      anchor,
      title,
      dispatch,
      editVisible,
      loading,
      isNew,
      editFlag,
      parentId,
      parentType,
      tenantId,
      parentTypeMap,
      detailList,
      dataSource = {},
      form,
      onCancel,
    } = this.props;
    const { getFieldDecorator } = form;
    const { collapseKeys = [], parentTypeChangeCode } = this.state;
    const woChecklistListProps = {
      isNew,
      editFlag,
      tenantId,
      loading,
      dispatch,
      detailList,
      parentTypeMap,
      parentId: dataSource.checklistGroupId,
      parentType: 'CHECKLIST_GROUPS',
    };
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
          onCancel={onCancel}
          cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        >
          <Spin
            spinning={isUndefined(dataSource.checklistGroupId) ? false : loading.listLoading}
            wrapperClassName={classNames(
              styles['wo-checklist-group-detail'],
              DETAIL_DEFAULT_CLASSNAME
            )}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get('hzero.common.view.baseInfo').d('基本信息')}</h3>
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
                                  code={parentTypeChangeCode || 'AMTC.WORK_ORDER'}
                                  queryParams={{ organizationId: tenantId, woId: parentId }}
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
                        label={intl.get(`${modelPrompt}.actChecklistGroup`).d('标准检查组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('actChecklistGroupId', {
                            initialValue: dataSource.actChecklistGroupId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${modelPrompt}.actChecklistGroup`)
                                    .d('标准检查组'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMTC.INSPECT_GROUP"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.actChecklistGroupMeaning}
                              onChange={this.actChecklistChange}
                            />
                          )
                        ) : (
                          <span>{dataSource.actChecklistGroupMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.groupClassCode`).d('组类别')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupClassCode', {
                            initialValue: dataSource.groupClassCodeMeaning,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.groupClassCodeMeaning}</span>
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
                        label={intl.get(`${modelPrompt}.groupSeq`).d('序号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupSeq', {
                            initialValue: dataSource.groupSeq,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.groupSeq`).d('序号'),
                                }),
                              },
                            ],
                          })(<InputNumber min={0} />)
                        ) : (
                          <span>{dataSource.groupSeq}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.groupName`).d('名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('groupName', {
                            initialValue: dataSource.groupName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.groupName`).d('名称'),
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.groupName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.gradingId`).d('等级评定(暂无)')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('gradingId', {
                            initialValue: dataSource.gradingId,
                          })(
                            <Lov
                              code=""
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.gradingName}
                            />
                          )
                        ) : (
                          <span>{dataSource.gradingName}</span>
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
                        label={intl.get(`${modelPrompt}.standardTotalScore`).d('标准总分')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('standardTotalScore', {
                            initialValue: dataSource.standardTotalScore,
                          })(<InputNumber />)
                        ) : (
                          <span>{dataSource.standardTotalScore}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.deductionValue`).d('扣分')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('deductionValue', {
                            initialValue: dataSource.deductionValue,
                          })(<InputNumber />)
                        ) : (
                          <span>{dataSource.deductionValue}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.actualValue`).d('得分')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('actualValue', {
                            initialValue: dataSource.actualValue,
                          })(<InputNumber />)
                        ) : (
                          <span>{dataSource.actualValue}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.description`).d('描述')}
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
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="B"
                header={
                  <Fragment>
                    <h3>{intl.get('hzero.common.view.panel.b').d('检查项')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                {!isUndefined(dataSource.checklistGroupId) ? (
                  <WoChecklistList {...woChecklistListProps} />
                ) : (
                  ''
                )}
              </Collapse.Panel>
            </Collapse>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}
export default WoChecklistGroupEdit;
