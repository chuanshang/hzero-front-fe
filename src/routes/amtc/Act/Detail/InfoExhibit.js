import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Select, DatePicker, Tabs, Divider } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import { FORM_COL_1_LAYOUT } from '@/utils/constants';
import { yesOrNoRender, dateRender } from 'utils/renderer';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';

import TransactionList from './TransactionList';
import TransactionDrawer from './TransactionDrawer';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C', 'D', 'E', 'F'],
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  handleTransationTypeField(_, record) {
    this.props.onTransationTypeField(_, record);
  }

  render() {
    const {
      isNew,
      editFlag,
      tenantId,
      form,
      detailSource,
      loading,
      pagination,
      drawerVisible,
      currentLineData,
      lineDeleteButtonStyle,
      lineList,
      WoActivityTypeMap,
      JobDutiesSpecifiedMap,
      WorkOrderStatusMap,
      WoDurationRule,
      DurationUnitMap,
      ActOpStatusMap,
      ActOpDefJobCodeMap,
      onAddLine,
      onEdit,
      onDrawerDelete,
      onDeleteFromDB,
      onDrawerOk,
      onDrawerCancel,
      jobSpecifiedCode,
      onJobSpecifiedChange,
    } = this.props;
    const { getFieldDecorator } = form;
    const { collapseKeys = [] } = this.state;
    const transactionListProps = {
      isNew,
      editFlag,
      loading,
      tenantId,
      pagination,
      lineDeleteButtonStyle,
      dataSource: lineList,
      onEdit,
      onAddLine,
      onDelete: onDrawerDelete,
      onDeleteFromDB,
    };
    const transactionDrawerProps = {
      isNew,
      loading,
      tenantId,
      editFlag,
      drawerVisible,
      dataSource: currentLineData,
      ActOpStatusMap,
      ActOpDefJobCodeMap,
      jobSpecifiedCode,
      onOk: onDrawerOk,
      onCancel: onDrawerCancel,
    };
    const modelPrompt = 'amtc.act.model.act';
    return (
      <React.Fragment>
        {!isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{detailSource.actName}</span>
                </Row>
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
              defaultActiveKey={['A', 'B', 'C', 'D', 'E', 'F']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.A`).d('基础信息')}</h3>
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
                        label={intl.get(`${modelPrompt}.maintSites`).d('服务区域')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('maintSitesId', {
                            initialValue: detailSource.maintSitesId,
                          })(
                            <Lov
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.maintSitesName}
                            />
                          )
                        ) : (
                          <span>{detailSource.maintSitesName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.actName`).d('标准作业名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actName', {
                            initialValue: detailSource.actName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.actName`).d('标准作业名称'),
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{detailSource.actName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.actType`).d('标准作业类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actTypeCode', {
                            initialValue: detailSource.actTypeCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.actType`).d('标准作业类型'),
                                }),
                              },
                            ],
                          })(
                            <Select>
                              {WoActivityTypeMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailSource.actTypeCodeMeaning}</span>
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
                        label={intl.get(`${modelPrompt}.wprevFlag`).d('等待前序')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('wprevFlag', {
                            initialValue: detailSource.wprevFlag || 0,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(detailSource.wprevFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.jobSpecified`).d('工作职责指定方式')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('jobSpecifiedCode', {
                            initialValue: detailSource.jobSpecifiedCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${modelPrompt}.jobSpecified`)
                                    .d('工作职责指定方式'),
                                }),
                              },
                            ],
                          })(
                            <Select
                              onChange={val => {
                                onJobSpecifiedChange(val);
                              }}
                            >
                              {JobDutiesSpecifiedMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailSource.jobSpecifiedCodeMeaning}</span>
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
                    <h3>{intl.get(`${modelPrompt}.panel.B`).d('作业对象')}</h3>
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
                        label={intl.get(`${modelPrompt}.assetLocation`).d('适用位置')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetLocationId', {
                            initialValue: detailSource.assetLocationId,
                          })(
                            <Lov
                              code="AMDM.LOCATIONS"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.assetLocationName}
                            />
                          )
                        ) : (
                          <span>{detailSource.assetLocationName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.assetGroup`).d('适用资产组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetGroupId', {
                            initialValue: detailSource.assetGroupId,
                          })(
                            <Lov
                              code="AAFM.ASSET_SET"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.assetGroupName}
                            />
                          )
                        ) : (
                          <span>{detailSource.assetGroupName}</span>
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
                        label={intl.get(`${modelPrompt}.asset`).d('适用设备/编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetId', {
                            initialValue: detailSource.assetId,
                          })(
                            <Lov
                              code="AAFM.ASSET_NUMBER"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.assetName}
                            />
                          )
                        ) : (
                          <span>{detailSource.assetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.route`).d('适用资产路线')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('routeId', {
                            initialValue: detailSource.routeId,
                          })(
                            <Lov
                              code="AMTC.ASSET_AOUNT"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.routeName}
                            />
                          )
                        ) : (
                          <span>{detailSource.routeName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="C"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.C`).d('工单信息')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
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
                        label={intl.get(`${modelPrompt}.actStatus`).d('工单状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actStatus', {
                            initialValue: detailSource.actStatus,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.actStatus`).d('工单状态'),
                                }),
                              },
                            ],
                          })(
                            <Select>
                              {WorkOrderStatusMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailSource.actStatusMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.woType`).d('工单类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woTypeId', {
                            initialValue: detailSource.woTypeId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.woType`).d('工单类型'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMTC.WORKORDERTYPES"
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.woTypeName}
                            />
                          )
                        ) : (
                          <span>{detailSource.woTypeName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.woPriority`).d('工单优先级')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woPriorityId', {
                            initialValue: detailSource.woPriorityId || 0,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.woPriority`).d('工单优先级'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code=""
                              queryParams={{ organization: tenantId }}
                              textValue={detailSource.woPriorityName || `暂时还没有给个默认值`}
                            />
                          )
                        ) : (
                          <span>{detailSource.woPriorityName || `暂时还没有给个默认值`}</span>
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
                        label={intl.get(`${modelPrompt}.durationRuleCode`).d('工单工期规则')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('durationRuleCode', {
                            initialValue: detailSource.durationRuleCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${modelPrompt}.durationRuleCode`)
                                    .d('工单工期规则'),
                                }),
                              },
                            ],
                          })(
                            <Select>
                              {WoDurationRule.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailSource.durationRuleCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.durationUomCode`).d('工期单位')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('durationUomCode', {
                            initialValue: detailSource.durationUomCode,
                          })(
                            <Select>
                              {DurationUnitMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailSource.durationUomCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="D"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.D`).d('工作职责')}</h3>
                    <a>
                      {collapseKeys.includes('D')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  {jobSpecifiedCode === 'FROM_ACT' ? (
                    <div>
                      <Row
                        {...EDIT_FORM_ROW_LAYOUT}
                        className={editFlag ? 'inclusion-row' : 'read-row'}
                      >
                        <Col {...FORM_COL_3_LAYOUT}>
                          <Form.Item
                            label={intl.get(`${modelPrompt}.plannerGroup`).d('签派/计划员组')}
                            {...EDIT_FORM_ITEM_LAYOUT}
                          >
                            {isNew || editFlag ? (
                              getFieldDecorator('plannerGroupId', {
                                initialValue: detailSource.plannerGroupId,
                                rules: [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl
                                        .get(`${modelPrompt}.plannerGroup`)
                                        .d('签派/计划员组'),
                                    }),
                                  },
                                ],
                              })(
                                <Lov
                                  code="AMTC.SKILLTYPES"
                                  queryParams={{ organization: tenantId }}
                                  textValue={detailSource.plannerGroupName}
                                />
                              )
                            ) : (
                              <span>{detailSource.plannerGroupName}</span>
                            )}
                          </Form.Item>
                        </Col>
                        <Col {...FORM_COL_3_LAYOUT}>
                          <Form.Item
                            label={intl.get(`${modelPrompt}.planner`).d('签派/计划员')}
                            {...EDIT_FORM_ITEM_LAYOUT}
                          >
                            {isNew || editFlag ? (
                              getFieldDecorator('plannerId', {
                                initialValue: detailSource.plannerId,
                              })(
                                <Lov
                                  code="AMTC.WORKCENTERSTAFF"
                                  queryParams={{ organization: tenantId }}
                                  textValue={detailSource.plannerName}
                                />
                              )
                            ) : (
                              <span>{detailSource.plannerName}</span>
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
                            label={intl.get(`${modelPrompt}.ownerGroup`).d('负责人组(技能类型)')}
                            {...EDIT_FORM_ITEM_LAYOUT}
                          >
                            {isNew || editFlag ? (
                              getFieldDecorator('ownerGroupId', {
                                initialValue: detailSource.ownerGroupId,
                                rules: [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl
                                        .get(`${modelPrompt}.ownerGroup`)
                                        .d('负责人组(技能类型)'),
                                    }),
                                  },
                                ],
                              })(
                                <Lov
                                  code="AMTC.SKILLTYPES"
                                  queryParams={{ organization: tenantId }}
                                  textValue={detailSource.ownerGroupName}
                                />
                              )
                            ) : (
                              <span>{detailSource.ownerGroupName}</span>
                            )}
                          </Form.Item>
                        </Col>
                        <Col {...FORM_COL_3_LAYOUT}>
                          <Form.Item
                            label={intl.get(`${modelPrompt}.owner`).d('负责人')}
                            {...EDIT_FORM_ITEM_LAYOUT}
                          >
                            {isNew || editFlag ? (
                              getFieldDecorator('ownerId', {
                                initialValue: detailSource.ownerId,
                              })(
                                <Lov
                                  code="AMTC.WORKCENTERSTAFF"
                                  queryParams={{ organization: tenantId }}
                                  textValue={detailSource.ownerName}
                                />
                              )
                            ) : (
                              <span>{detailSource.ownerName}</span>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${modelPrompt}.waitingOwnerFlag`)
                          .d('允许自行接单来明确负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('waitingOwnerFlag', {
                            initialValue: detailSource.waitingOwnerFlag || 0,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(detailSource.waitingOwnerFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${modelPrompt}.firstOwnerFlag`)
                          .d('将负责人定为首个任务负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('firstOwnerFlag', {
                            initialValue: detailSource.firstOwnerFlag || 0,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(detailSource.firstOwnerFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${modelPrompt}.ownerConfirmFlag`)
                          .d('需要工单负责人做最后确认')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('ownerConfirmFlag', {
                            initialValue: detailSource.ownerConfirmFlag || 0,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(detailSource.ownerConfirmFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="E"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.E`).d('附加信息')}</h3>
                    <a>
                      {collapseKeys.includes('E')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('E') ? 'up' : 'down'} />
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
                        label={intl.get(`${modelPrompt}.effectiveEndDate`).d('失效日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('effectiveEndDate', {
                            initialValue: detailSource.effectiveEndDate
                              ? moment(detailSource.effectiveEndDate, getDateFormat())
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                            />
                          )
                        ) : (
                          <span>{dateRender(detailSource.effectiveEndDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_1_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.description`).d('描述')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: detailSource.description,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input.TextArea rows={3} />)
                        ) : (
                          <span>{detailSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="F"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.F`).d('工作任务')}</h3>
                    <a>
                      {collapseKeys.includes('F')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('F') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <TransactionList {...transactionListProps} />
                <TransactionDrawer {...transactionDrawerProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
