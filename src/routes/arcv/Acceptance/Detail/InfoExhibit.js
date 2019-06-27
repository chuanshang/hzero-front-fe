import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Select, DatePicker, Divider, Tabs } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';
import Lov from 'components/Lov';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';

import AcceptanceLineList from './AcceptanceLineList';
import AcceptanceLineDrawer from './AcceptanceLineDrawer';
import DeliveryListModal from './DeliveryListModal';
import AcceptanceRelationList from './AcceptanceRelationList';
import AcceptanceListModal from './AcceptanceListModal';
import AcceptanceAssetList from './AcceptanceAssetList';
import AcceptanceAssetDrawer from './AcceptanceAssetDrawer';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C', 'D'],
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 修改验收单类型
   */
  @Bind()
  handChangeAcceptanceType(val, record) {
    this.props.onControlAcceptanceLineItemsByType(val);
    this.props.onChangeAcceptanceType(record);
    this.props.onControlPanelByAcceptanceType(record.acceptanceTypeCode);
  }

  render() {
    const {
      tenantId,
      form,
      isNew,
      loading,
      isMulti,
      editFlag,
      currentWbsHeaderId,
      deliveryModalVisible,
      acceptanceModalVisible,
      acceptanceAssetListVisible,
      selectedDeliveryRowKeys,
      selectedAcceptanceRowKeys,
      acceptanceLineList,
      acceptanceAssetList,
      acceptanceRelationList,
      deliveryList,
      deliveryPagination,
      AcceptanceLineDrawerData,
      AcceptanceAssetDrawerData,
      acceptanceLineVisible,
      AcceptanceLinePanelVisible,
      AcceptanceRelationPanelVisible,
      AcceptanceAssetPanelVisible,
      AcceptanceLinePanelReadOnly,
      AcceptanceRelationPanelReadOnly,
      AcceptanceAssetPanelReadOnly,
      acceptanceNumRequired,
      assetNumRequired,
      detailDataSource,
      AcceptanceStatusLovMap,
      TranserFixedLovMap,
      acceptanceList,
      acceptancePagination,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
      getWbsHeader,
      onCancelAcceptanceLineDrawer,
      onAcceptanceLineListEdit,
      onAddLine,
      onSelectdeliveryList,
      onAcceptanceLineDrawerOK,
      onDeliveryModalCancel,
      onAcceptanceModalCancel,
      onSearchDeliveryList,
      onDeliveryListModalOk,
      onAcceptanceListModalOk,
      onSelectDeliveryRow,
      onSelectAcceptanceRow,
      onDeleteAcceptanceLine,
      onAcceptanceList,
      onSearchAcceptanceList,
      onAcceptanceAssetEdit,
      onCancelAcceptanceAssetDrawer,
      onAcceptanceAssetDrawerOK,
      onDeleteAcceptanceRelation,
    } = this.props;
    const { getFieldDecorator } = form;
    const { collapseKeys = [] } = this.state;
    const acceptanceLineListProps = {
      tenantId,
      isNew,
      editFlag,
      lineContractVisible,
      AcceptanceLinePanelReadOnly,
      dataSource: acceptanceLineList,
      onEdit: onAcceptanceLineListEdit,
      onAddLine,
      onSelectdeliveryList,
      onDelete: onDeleteAcceptanceLine,
    };
    const acceptanceLineDrawerProps = {
      tenantId,
      lineProjectVisible,
      lineProjectBudgetVisible,
      lineContractVisible,
      loading: loading.addAcceptanceLine || loading.updateAcceptanceLine,
      isNew,
      editFlag,
      AcceptanceLinePanelReadOnly,
      currentWbsHeaderId,
      dataSource: AcceptanceLineDrawerData, // 当前行的数据
      drawerVisible: acceptanceLineVisible,
      getWbsHeader,
      onCancel: onCancelAcceptanceLineDrawer,
      onAcceptanceLineDrawerOK,
    };
    const deliveryListModalProps = {
      isMulti,
      deliveryModalVisible,
      selectedDeliveryRowKeys,
      onCancel: onDeliveryModalCancel,
      onSearchDeliveryList,
      deliveryPagination,
      onSelectDeliveryRow,
      onDeliveryListModalOk,
      dataSource: deliveryList,
      loading: loading.searchDeliveryList,
    };
    const acceptanceListModalProps = {
      isMulti,
      acceptanceModalVisible,
      selectedAcceptanceRowKeys,
      onCancel: onAcceptanceModalCancel,
      onSearchAcceptanceList,
      acceptancePagination,
      onSelectAcceptanceRow,
      onAcceptanceListModalOk,
      dataSource: acceptanceList,
      loading: loading.list,
    };
    const acceptanceRelationListProps = {
      isNew,
      editFlag,
      AcceptanceRelationPanelReadOnly,
      dataSource: acceptanceRelationList, // 验收单关联行信息
      onDelete: onDeleteAcceptanceRelation,
      onAcceptanceList,
    };
    const acceptanceAssetListProps = {
      isNew,
      editFlag,
      dataSource: acceptanceAssetList,
      AcceptanceAssetPanelReadOnly,
      onEdit: onAcceptanceAssetEdit,
    };
    const acceptanceAssetDrawerProps = {
      isNew,
      editFlag,
      AcceptanceAssetPanelReadOnly,
      drawerVisible: acceptanceAssetListVisible,
      loading: loading.updateAcceptanceAsset,
      dataSource: AcceptanceAssetDrawerData, // 当前行list传进来的信息
      TranserFixedLovMap,
      tenantId,
      assetNumRequired,
      onCancel: onCancelAcceptanceAssetDrawer,
      onAcceptanceAssetDrawerOK,
    };
    const modelPrompt = 'arcv.acceptance.model.acceptance';
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
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{detailDataSource.title}</span>
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
              defaultActiveKey={['A', 'B', 'C', 'D']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.panel.A`).d('基本信息')}</h3>
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
                        label={intl.get(`${modelPrompt}.acceptanceType`).d('验收类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('acceptanceTypeId', {
                            initialValue: detailDataSource.acceptanceTypeId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.acceptanceType`).d('验收类型'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={!isNew}
                              code="ARCV.ACCEPTANCE_ORDER_TYPE"
                              onChange={this.handChangeAcceptanceType}
                              queryParams={{ organization: tenantId }}
                              textValue={detailDataSource.acceptanceTypeMeaning}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.acceptanceTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.acceptanceStatusCode`).d('验收状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('acceptanceStatusCode', {
                            initialValue: isNew ? `NEW` : detailDataSource.acceptanceStatusCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${modelPrompt}.acceptanceStatusCode`)
                                    .d('验收状态'),
                                }),
                              },
                            ],
                          })(
                            <Select disabled>
                              {AcceptanceStatusLovMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailDataSource.acceptanceStatusMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.principalPerson`).d('负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('principalPersonId', {
                            initialValue: detailDataSource.principalPersonId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.principalPerson`).d('负责人'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="HALM.EMPLOYEE"
                              queryParams={{ tenantId }}
                              textValue={detailDataSource.principalPersonMeaning}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.principalPersonMeaning}</span>
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
                        label={intl.get(`${modelPrompt}.acceptanceNum`).d('验收单编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('acceptanceNum', {
                            initialValue: detailDataSource.acceptanceNum,
                            rules: acceptanceNumRequired
                              ? [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl
                                        .get(`${modelPrompt}.acceptanceNum`)
                                        .d('验收单编号'),
                                    }),
                                  },
                                ]
                              : [],
                          })(<Input disabled={!acceptanceNumRequired} />)
                        ) : (
                          <span>{detailDataSource.acceptanceNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.title`).d('标题概述')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('title', {
                            initialValue: detailDataSource.title,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.title`).d('标题概述'),
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{detailDataSource.title}</span>
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
                        label={intl.get(`${modelPrompt}.submitDate`).d('提交日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('submitDate', {
                            initialValue: detailDataSource.submitDate
                              ? moment(detailDataSource.submitDate, getDateFormat())
                              : null,
                          })(
                            <DatePicker
                              disabled
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                            />
                          )
                        ) : (
                          <span>{dateRender(detailDataSource.submitDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.completeDate`).d('完成日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('completeDate', {
                            initialValue: detailDataSource.completeDate
                              ? moment(detailDataSource.completeDate, getDateFormat())
                              : null,
                          })(
                            <DatePicker
                              disabled
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                            />
                          )
                        ) : (
                          <span>{dateRender(detailDataSource.completeDate)}</span>
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
                        label={intl.get(`${modelPrompt}.requestDepartment`).d('申请部门')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('requestDepartmentId', {
                            initialValue: detailDataSource.requestDepartmentId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.requestDepartment`).d('申请部门'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              queryParams={{ organization: tenantId }}
                              textValue={detailDataSource.requestDepartmentMeaning}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.requestDepartmentMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.purchaseDepartment`).d('采购部门')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('purchaseDepartmentId', {
                            initialValue: detailDataSource.purchaseDepartmentId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.purchaseDepartment`).d('采购部门'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              queryParams={{ organization: tenantId }}
                              textValue={detailDataSource.purchaseDepartmentMeaning}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.purchaseDepartmentMeaning}</span>
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
                        {isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: detailDataSource.description,
                          })(<Input />)
                        ) : (
                          <span>{detailDataSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              {AcceptanceRelationPanelVisible ? (
                <Collapse.Panel
                  showArrow={false}
                  key="B"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${modelPrompt}.panel.B`).d('关联验收单')}</h3>
                      <a>
                        {collapseKeys.includes('B')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <AcceptanceListModal {...acceptanceListModalProps} />
                  <AcceptanceRelationList {...acceptanceRelationListProps} />
                </Collapse.Panel>
              ) : null}
              {AcceptanceLinePanelVisible ? (
                <Collapse.Panel
                  showArrow={false}
                  key="C"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${modelPrompt}.panel.C`).d('验收单行信息')}</h3>
                      <a>
                        {collapseKeys.includes('C')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <DeliveryListModal {...deliveryListModalProps} />
                  <AcceptanceLineList {...acceptanceLineListProps} />
                  <AcceptanceLineDrawer {...acceptanceLineDrawerProps} />
                </Collapse.Panel>
              ) : null}
              {AcceptanceAssetPanelVisible ? (
                <Collapse.Panel
                  showArrow={false}
                  key="D"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${modelPrompt}.panel.D`).d('资产明细行信息')}</h3>
                      <a>
                        {collapseKeys.includes('D')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <AcceptanceAssetList {...acceptanceAssetListProps} />
                  <AcceptanceAssetDrawer {...acceptanceAssetDrawerProps} />
                </Collapse.Panel>
              ) : null}
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
