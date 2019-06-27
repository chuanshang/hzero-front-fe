import React, { Component, Fragment } from 'react';
import {
  Modal,
  Form,
  Input,
  Collapse,
  Col,
  Button,
  Row,
  Icon,
  Tabs,
  Divider,
  InputNumber,
  Select,
} from 'hzero-ui';
import Switch from 'components/Switch';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import { yesOrNoRender } from 'utils/renderer';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';
import CheckLists from './CheckLists';
import ProblemDrawer from './ProblemDrawer';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      drawerVisible: false,
      defaultItem: {
        relateProblemFlag: 0,
      },
      collapseKeys: ['A', 'B', 'C'],
    };
  }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const { tenantId, dispatch, problemsList } = this.props;
    const newProblemsList = problemsList !== null ? problemsList : [];
    if (isUndefined(values.checklistProblemId)) {
      // 新建
      const id = uuidv4();
      dispatch({
        type: 'inspectList/updateState',
        payload: {
          problemsList: [
            { ...values, checklistProblemId: id, tenantId, _status: 'create' },
            ...newProblemsList,
          ],
        },
      });
    } else {
      // 编辑
      console.log(newProblemsList);
      const newList = newProblemsList.map(item =>
        item.checklistProblemId === values.checklistProblemId
          ? { ...item, ...values, tenantId, _status: 'update' }
          : item
      );
      dispatch({
        type: 'inspectList/updateState',
        payload: {
          problemsList: newList,
        },
      });
    }
    this.setState({ drawerVisible: false });
  }

  @Bind()
  handleAddProblem() {
    const { defaultItem } = this.state;
    this.setState({ drawerVisible: true, defaultItem });
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }
  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  @Bind()
  showEditDrawer(record) {
    this.setState({ drawerVisible: true, defaultItem: record });
  }
  /**
   *  @function closeDrawer - 关闭编辑modal
   */
  @Bind()
  closeDrawer() {
    this.setState({ drawerVisible: false });
  }
  /**
   * 清除行
   */
  @Bind()
  handleClearLine(record) {
    const { dispatch, problemsList } = this.props;
    const newList = problemsList.filter(
      item => item.checklistProblemId !== record.checklistProblemId
    );
    dispatch({
      type: 'inspectList/updateState',
      payload: {
        problemsList: newList,
      },
    });
  }
  /**
   * 删除行
   */
  @Bind()
  handleDeleteLine(record) {
    const { dispatch, problemsList } = this.props;
    const messagePrompt = 'amtc.inspectList.view.message';
    Modal.confirm({
      content: intl.get(`${messagePrompt}.title.content`).d('确定删除吗？'),
      onOk() {
        dispatch({
          type: 'inspectList/deleteProblems',
          payload: { ...record },
        }).then(res => {
          if (res) {
            notification.success();
            const newList = problemsList.filter(
              item => item.checklistProblemId !== record.checklistProblemId
            );
            dispatch({
              type: 'inspectList/updateState',
              payload: {
                problemsList: newList,
              },
            });
          }
        });
      },
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { defaultItem, collapseKeys, drawerVisible } = this.state;
    const modelPrompt = 'amtc.checkLists.model.checkLists';
    const prefix = `amtc.checkLists.view.message`;
    const {
      isNew,
      form,
      loading,
      tenantId,
      parentId,
      dataSource,
      editFlag,
      problemsList,
      fieldTypeList,
      businessScenarioList,
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const listProps = {
      loading,
      tenantId,
      editFlag,
      dataSource: problemsList,
      onEdit: this.showEditDrawer,
      onCancelLine: this.handleClearLine,
      onDeleteLine: this.handleDeleteLine,
    };
    const drawerProps = {
      isNew,
      editFlag,
      tenantId,
      drawerVisible,
      onOk: this.handleDrawerOk,
      onCancel: this.closeDrawer,
      dataSource: defaultItem,
    };
    const displayFlag = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    return (
      <React.Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {dataSource.checklistName}
                  </span>
                </Row>
                {/* <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.groupClassCode`).d('组类别')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.groupClassCode}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.maintSites`).d('服务区域')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.maintSitesMeaning}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.groupSeq`).d('序号')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.groupSeq}</Row>
                  </Col>
                </Row> */}
              </Col>
            </Row>
            <Divider style={{ marginTop: 5, marginBottom: 0 }} />
          </React.Fragment>
        ) : (
          ''
        )}
        <Tabs defaultActiveKey="basicTab">
          <Tabs.TabPane
            tab={intl.get(`${modelPrompt}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
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
                        label={intl.get(`${modelPrompt}.checklistName`).d('名称')}
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
                              code="AMTC.PARENT_ACT_CHECKLISTS"
                              queryParams={{
                                organizationId: tenantId,
                                columnTypeCode: 'INDEX',
                                parentId,
                              }}
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
                    <h3>{intl.get(`${prefix}.panel.C`).d('标准问题清单')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Row style={{ margin: '10px' }}>
                  <Col style={displayFlag}>
                    <Button icon="plus" type="primary" onClick={this.handleAddProblem}>
                      {intl.get(`amtc.checklist.view.button.add`).d('新增')}
                    </Button>
                  </Col>
                </Row>
                <CheckLists {...listProps} />
                <ProblemDrawer {...drawerProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
