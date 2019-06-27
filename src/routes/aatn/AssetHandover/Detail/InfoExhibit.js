import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Select,
  DatePicker,
  Divider,
  Tabs,
  Spin,
} from 'hzero-ui';
import intl from 'utils/intl';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import moment from 'moment';
import { dateRender } from 'utils/renderer';
import { isNull } from 'lodash';
import Lov from 'components/Lov';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import TransactionList from './TransactionList';
import TransactionDrawer from './TransactionDrawer';
import AssetModal from './AssetModal';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B'],
      statusScope: '', // 资产状态范围
      codeRule: '', // 自动编号规则
    };
  }
  componentDidMount() {
    this.props.onRefresh();
  }
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  handleGetTransaction(val, record) {
    if (!isNull(record.codeRule)) {
      this.props.form.setFieldsValue({ changeNum: '' });
    }
    this.setState({
      statusScope: record.statusScope,
      codeRule: record.codeRule,
    });
    this.props.dispatch({
      type: 'assetHandover/updateState',
      payload: {
        transferType: record,
        targetAssetStatusId: record.targetAssetStatusId,
        targetAssetStatusName: record.targetAssetStatusName,
      },
    });
    this.props.onGetFieldsByTransactionType(val);
  }

  render() {
    const {
      tenantId,
      loading,
      valuesList,
      dataSource,
      isNew,
      editControl,
      dynamicFields,
      processStatusHeaderMap,
      processStatusLineMap,
      fieldTypes,
      detailLineListLoading,
      assetList,
      assetPagination,
      modalVisible,
      drawerVisible,
      selectedRowKeys,
      isMulti,
      returnFlag,
      lineDetail,
      lineList,
      dynamicFieldsData,
      onCleanLine,
      onDrawerCancel,
      onEdit,
      onShowAssetModal,
      onSearchAsset,
      onModalCancel,
      onSelectRow,
      onDrawerOk,
      onExecute,
      onDelete,
      onAssetModalOk,
      onHandoverReturn,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { statusScope, codeRule, collapseKeys = [] } = this.state;
    const longFormLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const modelPrompt = 'aatn.assetHandover.model.assetHandover';
    const transactionListProps = {
      isNew,
      tenantId,
      editControl,
      fieldTypes,
      onCleanLine,
      onEdit,
      onDelete,
      handoverNum: dataSource.handoverNum,
      dataSource: lineList,
      loading: detailLineListLoading,
    };
    const transactionDrawerProps = {
      isNew,
      tenantId,
      editControl,
      drawerVisible,
      lineDetail,
      returnFlag,
      dynamicFields,
      statusScope,
      dynamicFieldsData,
      valuesList,
      processStatusLineMap,
      onExecute,
      onHandoverReturn,
      loading: loading.execute,
      title: intl.get('aatn.assetHandover.view.drawerTitle').d('事务处理行'),
      onOk: onDrawerOk,
      onCancel: onDrawerCancel,
    };
    const assetModalProps = {
      isMulti,
      selectedRowKeys,
      assetPagination,
      modalVisible,
      onSelectRow,
      onAssetModalOk,
      onSearchAsset,
      loading: loading.equipmentAsset,
      dataSource: assetList,
      onCancel: onModalCancel,
    };
    const displayFlag =
      !isNew || editControl ? { display: 'block', margin: '10px' } : { display: 'none' };
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
                    {dataSource.titleOverview}
                  </span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.titleOverview`).d('标题概述')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.titleOverview}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.processStatus`).d('处理状态')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.processStatusMeaning}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${modelPrompt}.principalPerson`).d('负责人')}</span>
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
            tab={intl.get(`${modelPrompt}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
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
                    className={editControl ? 'inclusion-row' : 'read-row'}
                    {...EDIT_FORM_ROW_LAYOUT}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.transactionType`).d('事务类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('transactionTypeId', {
                            initialValue: dataSource.transactionTypeId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.transactionType`).d('事务类型'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={!!isNew}
                              onChange={this.handleGetTransaction}
                              code="AAFM.TRANSACTION_TYPES"
                              queryParams={{ organization: tenantId, basicTypeCode: 'RETURN' }}
                              textValue={dataSource.transactionTypeMeaning}
                            />
                          )
                        ) : (
                          <span>{dataSource.transactionTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.processStatus`).d('处理状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('processStatus', {
                            initialValue: dataSource.processStatus,
                          })(
                            <Select disabled>
                              {processStatusHeaderMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.processStatusMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.principalPerson`).d('负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('principalPersonId', {
                            initialValue: dataSource.principalPersonId,
                          })(
                            <Lov
                              code="HALM.EMPLOYEE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.principalPersonName}
                            />
                          )
                        ) : (
                          <span>{dataSource.principalPersonName}</span>
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
                        label={intl.get(`${modelPrompt}.handoverNum`).d('事务处理编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('handoverNum', {
                            initialValue: dataSource.handoverNum,
                            rules: isNull(codeRule)
                              ? [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl
                                        .get(`${modelPrompt}.handoverNum`)
                                        .d('事务处理编号'),
                                    }),
                                  },
                                ]
                              : [],
                          })(<Input disabled={!isNull(codeRule)} inputChinese={false} />)
                        ) : (
                          <span>{dataSource.handoverNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.titleOverview`).d('标题概述')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('titleOverview', {
                            initialValue: dataSource.titleOverview,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.titleOverview}</span>
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
                        label={intl.get(`${modelPrompt}.planStartDate`).d('执行日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('planStartDate', {
                            initialValue: dataSource.planStartDate
                              ? moment(dataSource.planStartDate, getDateTimeFormat())
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
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
                          <span>{dateRender(dataSource.planStartDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.planEndDate`).d('完成日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('planEndDate', {
                            initialValue: dataSource.planEndDate
                              ? moment(dataSource.planEndDate, getDateTimeFormat())
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                              disabledDate={currentDate =>
                                //日期加减
                                getFieldValue('planStartDate') &&
                                moment(getFieldValue('planStartDate')).isAfter(currentDate, 'day')
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.planEndDate)}</span>
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
                        label={intl.get(`${modelPrompt}.description`).d('理由')}
                        {...longFormLayout}
                      >
                        {!isNew || editControl ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
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
                    <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
                    <h3>{intl.get(`${modelPrompt}.panel.b`).d('事务处理行信息')}</h3>
                  </Fragment>
                }
              >
                <Row style={displayFlag}>
                  <Col className="search-btn-more">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 10 }}
                      onClick={() => onShowAssetModal(true)}
                    >
                      {intl.get(`aatn.assetHandover.view.button.multiAdd`).d('选择资产')}
                    </Button>
                  </Col>
                </Row>
                <TransactionList {...transactionListProps} />
                <Spin spinning={isNew && drawerVisible && loading.fetchDynamicFields}>
                  <TransactionDrawer {...transactionDrawerProps} />
                </Spin>
                <AssetModal {...assetModalProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
