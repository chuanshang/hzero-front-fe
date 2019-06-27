import React, { Component, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Collapse,
  Icon,
  DatePicker,
  Button,
  Divider,
  Tabs,
  Select,
} from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import {
  DEFAULT_DATE_FORMAT,
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
import { getDateFormat } from 'utils/utils';
import { dateRender } from 'utils/renderer';
import { isNull } from 'lodash';
import moment from 'moment';
import TransactionList from './TransactionList';
import TransactionDrawer from './TransactionDrawer';
import AssetModal from './AssetModal';

const { Panel } = Collapse;

@Form.create({ fieldNameProp: null })
class TransferOrderDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
      item: {},
      codeRule: '', // 自动编号规则
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 新增行信息
   */
  @Bind
  handleAddLine(record) {
    const { onDrawerOk } = this.props;
    const { item } = this.state;
    const temp = {
      currentAssetStatusId: item.assetStatusId,
      currentAssetStatusName: item.sysStatusName,
      currentOwningOrg: item.owningOrgId,
      currentOwningOrgName: item.owningOrgIdName,
      currentCostCenter: item.currentCostCenter,
      targetAssetStatusId: item.targetAssetStatusId,
      targetAssetStatusName: item.targetAssetStatusName,
      targetOwningOrg: record.targetOwningOrg,
      targetOwningOrgName: record.targetOwningOrgName,
      targetCostCenter: item.targetCostCenter,
    };
    const description = this.handleMakeDescription(temp);
    onDrawerOk({ ...item, ...record, ...temp, description });
    this.setState({ drawerVisible: false, item: record });
  }

  /**
   * 拼接描述字段
   */
  @Bind()
  handleMakeDescription(temp) {
    const {
      currentAssetStatusName,
      currentOwningOrgName,
      currentCostCenter,
      targetAssetStatusName,
      targetOwningOrgName,
      targetCostCenter,
    } = temp;
    const contentStatus =
      currentAssetStatusName === targetAssetStatusName
        ? ' '
        : `资产状态由${currentAssetStatusName}变为${targetAssetStatusName}; `;
    const contentOrg =
      currentOwningOrgName === targetOwningOrgName
        ? ' '
        : `所属组织由${currentOwningOrgName}变为${targetOwningOrgName}; `;
    const contentCostCenter =
      currentCostCenter === targetCostCenter
        ? ' '
        : `成本中心由${currentCostCenter}变为${targetCostCenter}; `;
    const content = contentStatus + contentOrg + contentCostCenter;
    const message = intl.get('aatn.transferOrder.view.message').d(content);
    return message;
  }

  /**
   * 编辑行信息
   */
  @Bind()
  handleEditLine(record, clickFlag) {
    const { dispatch, tenantId, dataSource, transactionTypeList } = this.props;
    const { assetId, description } = record;
    let temp = {};
    dispatch({
      type: 'transferOrder/searchEquipmentAssetDetail',
      payload: {
        tenantId,
        assetId,
      },
    }).then(res => {
      if (res) {
        temp = {
          ...record,
          ...res,
          clickFlag,
          description,
          _token: record._token,
          objectVersionNumber: record.objectVersionNumber,
          currentAssetStatusId: res.assetStatusId,
          currentAssetStatusName: res.sysStatusName,
          targetAssetStatusId: transactionTypeList.targetAssetStatusId,
          targetAssetStatusName: transactionTypeList.targetAssetStatusName,
        };
      } else {
        temp = {
          ...record,
          clickFlag,
          description,
          targetAssetStatusId: transactionTypeList.targetAssetStatusId,
          targetAssetStatusName: transactionTypeList.targetAssetStatusName,
        };
      }
      if (record.transferHeaderId && record.transferLineId) {
        let currentListItem = {};
        dataSource.forEach(i => {
          if (i.transferLineId === record.transferLineId) {
            currentListItem = i;
          }
        });
        dispatch({
          type: 'transferOrder/fetchDynamicColumnLine',
          payload: {
            tenantId,
            orderLineId: record.transferLineId,
            orderHeaderId: record.transferHeaderId,
            orderTypeCode: 'TRANSFER',
          },
        }).then(result => {
          temp = { ...temp, orderDynamicColumnList: result, ...currentListItem };
          this.setState({ drawerVisible: true, item: temp });
        });
      } else {
        this.setState({ drawerVisible: true, item: temp });
      }
    });
  }

  /**
   * Drawer close
   */
  @Bind()
  handleDrawerLine() {
    this.setState({ drawerVisible: false, item: {} });
  }

  @Bind()
  transactionTypeFuc(value, record) {
    const { onSearchTransactionTypeLine } = this.props;
    const { transactionTypeId } = record;
    this.setState({
      codeRule: record.codeRule,
    });
    onSearchTransactionTypeLine(transactionTypeId);
  }

  // 弹出日历
  @Bind()
  onOpenChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        planEndDate: getFieldValue('planStartDate'),
      });
    }
  }

  render() {
    const commonPromptCode = 'aatn.transferOrder.model.transferOrder';
    const {
      isNew,
      detail,
      isMulti,
      tenantId,
      dispatch,
      editControl,
      loading,
      equipmentAssetLoading,
      equipmentAssetDetailLoading,
      modalVisible,
      assetList,
      approveStatus,
      assetPagination,
      fieldTypeMap,
      onRef,
      onDelete,
      onSelectRow,
      onAssetModalOk,
      onModalCancel,
      onAddDetailLine,
      onCleanLine,
      onSearchAsset,
      onChangeLineStatus,
      selectedRowKeys,
      transferTypeList,
      dynamicLovDisplayFieldList,
      dynamicSelectLovList,
      dataSource,
      fieldTypes,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { collapseKeys = [], drawerVisible = false, codeRule, item } = this.state;
    const editFlag = detail.processStatus !== 'NEW' && !isNew;
    const dateFormat = getDateFormat();
    const transactionListProps = {
      isNew,
      loading,
      editFlag,
      editControl,
      tenantId,
      fieldTypes,
      dataSource,
      onDelete,
      onCleanLine,
      onEditLine: this.handleEditLine,
    };
    const transactionDrawerProps = {
      isNew,
      dispatch,
      editFlag,
      editControl,
      transferTypeList,
      dynamicLovDisplayFieldList,
      dynamicSelectLovList,
      drawerVisible,
      fieldTypeMap,
      onChangeLineStatus,
      loading: equipmentAssetDetailLoading,
      dataSource: item,
      detailList: dataSource,
      onOk: this.handleAddLine,
      onCancel: this.handleDrawerLine,
    };
    const assetModalProps = {
      isMulti,
      onRef,
      onSearchAsset,
      selectedRowKeys,
      assetPagination,
      onSelectRow,
      onAssetModalOk,
      modalVisible,
      onCancel: onModalCancel,
      loading: equipmentAssetLoading,
      dataSource: assetList,
      pagination: assetPagination,
    };
    const displayFlag =
      isNew || editControl ? { display: 'block', margin: '10px' } : { display: 'none' };
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
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{detail.titleOverview}</span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.titleOverview`).d('标题概述')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{detail.titleOverview}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{detail.processStatusMeaning}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${commonPromptCode}.principalPerson`).d('负责人')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.principalPersonName}</Row>
                  </Col>
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
            tab={intl.get(`${commonPromptCode}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              className="form-collapse"
              defaultActiveKey={['A', 'B']}
              onChange={this.handleChangeKey.bind(this)}
            >
              <Panel
                showArrow={false}
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
                key="A"
              >
                <Form>
                  <Row
                    className={editControl ? 'inclusion-row' : 'read-row'}
                    {...EDIT_FORM_ROW_LAYOUT}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.transactionType`).d('事务类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('transactionTypeId', {
                            initialValue: detail.transactionTypeId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.transactionType`)
                                    .d('事务类型'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={editFlag}
                              code="AAFM.TRANSACTION_TYPES"
                              onChange={this.transactionTypeFuc}
                              textValue={detail.transactionName}
                              queryParams={{ organizationId: tenantId, basicTypeCode: 'TRANSFER' }}
                            />
                          )
                        ) : (
                          <span>{detail.transactionName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.processStatus`).d('处理状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('processStatus', {
                            initialValue: isNew ? `NEW` : detail.processStatus,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.processStatus`).d('处理状态'),
                                }),
                              },
                            ],
                          })(
                            <Select disabled>
                              {approveStatus.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detail.processStatusMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.principalPerson`).d('负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('principalPersonId', {
                            initialValue: detail.principalPersonId,
                          })(
                            <Lov
                              code="HALM.EMPLOYEE"
                              disabled={editFlag}
                              queryParams={{ tenantId }}
                              textValue={detail.principalPersonName}
                            />
                          )
                        ) : (
                          <span>{detail.principalPersonName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    className={editControl ? 'inclusion-row' : 'read-row'}
                    {...EDIT_FORM_ROW_LAYOUT}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.transferNum`).d('事务处理编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || isNull(codeRule) ? (
                          getFieldDecorator('transferNum', {
                            rules: [
                              {
                                required: isNull(codeRule),
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.transferNum`)
                                    .d('事务处理编号'),
                                }),
                              },
                            ],
                            initialValue: detail.transferNum,
                          })(<Input inputChinese={false} />)
                        ) : (
                          <span>{detail.transferNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.titleOverview`).d('标题概述')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('titleOverview', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.titleOverview`).d('标题概述'),
                                }),
                              },
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                            initialValue: detail.titleOverview,
                          })(<Input disabled={editFlag} />)
                        ) : (
                          <span>{detail.titleOverview}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    className={editControl ? 'inclusion-row' : 'read-row'}
                    {...EDIT_FORM_ROW_LAYOUT}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.planStartDate`).d('执行日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('planStartDate', {
                            initialValue: detail.planStartDate
                              ? moment(detail.planStartDate, DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              disabled={editFlag}
                              style={{ width: '100%' }}
                              format={dateFormat}
                              disabledDate={currentDate =>
                                (getFieldValue('planEndDate') &&
                                  moment(getFieldValue('planEndDate')).isBefore(
                                    currentDate,
                                    'day'
                                  )) ||
                                moment(new Date()).isAfter(currentDate, 'day')
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(detail.planStartDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.planEndDate`).d('完成日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('planEndDate', {
                            initialValue: detail.planEndDate
                              ? moment(detail.planEndDate, DEFAULT_DATE_FORMAT)
                              : getFieldValue('planStartDate')
                              ? moment(getFieldValue('planStartDate'), DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              disabled={editFlag}
                              style={{ width: '100%' }}
                              format={dateFormat}
                              onOpenChange={this.onOpenChange}
                              disabledDate={currentDate =>
                                (getFieldValue('planStartDate') &&
                                  moment(getFieldValue('planStartDate')).isAfter(
                                    currentDate,
                                    'day'
                                  )) ||
                                moment(new Date()).isAfter(currentDate, 'day')
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(detail.planEndDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    className={editControl ? 'inclusion-row' : 'read-row'}
                    {...EDIT_FORM_ROW_LAYOUT}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.description`).d('理由')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {isNew || editControl ? (
                          getFieldDecorator('description', {
                            initialValue: detail.description,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input.TextArea disabled={editFlag} rows={3} />)
                        ) : (
                          <span>{detail.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Panel>
              <Collapse.Panel
                showArrow={false}
                key="B"
                header={
                  <Fragment>
                    <h3>{intl.get(`${commonPromptCode}.transferOrderLine`).d('事务处理行信息')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Row style={displayFlag}>
                  <Col className="search-btn-more">
                    <Button
                      disabled={editFlag}
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 10 }}
                      onClick={() => onAddDetailLine(true)}
                    >
                      {intl.get(`aatn.assetHandover.view.button.multiAdd`).d('选择资产')}
                    </Button>
                  </Col>
                </Row>
                <TransactionList {...transactionListProps} />
                <TransactionDrawer {...transactionDrawerProps} />
                <AssetModal {...assetModalProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default TransferOrderDetail;
