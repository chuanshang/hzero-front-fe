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
  Tabs,
  Divider,
} from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { dateRender } from 'utils/renderer';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import { FORM_COL_1_LAYOUT } from '@/utils/constants';
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
      tenantId,
      isNew,
      editFlag,
      loading,
      headerProcessStatus,
      detailDataSource,
      assetList,
      assetPagination,
      modalVisible,
      selectedRowKeys,
      isMulti,
      lineList,
      pagination,
      drawerVisible,
      scrapNumRequired,
      lineDetail, // 行编辑侧滑窗record
      drawerAssetSelectButtonStyle,
      lineDeleteButtonStyle,
      processStatusHeaderMap,
      scrapLineProcessStatusMap,
      disposeTypeLovMap,
      scrapTypeMap,
      form,
      onSearch,
      onEdit,
      onDynamicGetHtml,
      onShowAssetModal,
      onSearchAsset,
      onModalCancel,
      onDrawerDelete,
      onDrawerConfirm,
      onDrawerCancel,
      onSelectRow,
      onAssetModalOk,
      onDrawerOk,
      onDeleteFromDB,
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { collapseKeys = [] } = this.state;
    const modelPrompt = 'aatn.assetScrap.model.assetScrap';
    const transactionListProps = {
      isNew,
      editFlag,
      loading,
      tenantId,
      pagination,
      lineDeleteButtonStyle,
      onSearch,
      onEdit,
      dataSource: lineList,
      onDelete: onDrawerDelete,
      onDeleteFromDB,
    };
    const transactionDrawerProps = {
      isNew,
      editFlag,
      drawerVisible,
      headerProcessStatus,
      dataSource: lineList,
      loading,
      lineDetail, // 行编辑侧滑窗record
      tenantId,
      scrapLineProcessStatusMap,
      disposeTypeLovMap,
      scrapTypeMap,
      onDynamicGetHtml,
      onConformLine: onDrawerConfirm,
      onOk: onDrawerOk,
      onCancel: onDrawerCancel,
    };
    const assetModalProps = {
      isMulti,
      onSearchAsset,
      selectedRowKeys,
      assetPagination,
      onSelectRow,
      onAssetModalOk,
      modalVisible,
      onCancel: onModalCancel,
      loading: loading.equipmentAsset,
      dataSource: assetList,
    };
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
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {detailDataSource.titleOverview}
                  </span>
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
                        label={intl.get(`${modelPrompt}.transactionType`).d('事务类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('transactionTypeId', {
                            initialValue: detailDataSource.transactionTypeId,
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
                              onChange={this.handleTransationTypeField}
                              disabled={!isNew}
                              code="AAFM.TRANSACTION_TYPES"
                              queryParams={{ organization: tenantId, basicTypeCode: 'SCRAP' }}
                              textValue={detailDataSource.transactionTypeMeaning}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.transactionTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.processStatus`).d('处理状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('processStatus', {
                            initialValue: isNew ? `NEW` : detailDataSource.processStatus,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${modelPrompt}.processStatus`).d('处理状态'),
                                }),
                              },
                            ],
                          })(
                            <Select disabled>
                              {processStatusHeaderMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{detailDataSource.processStatusMeaning}</span>
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
                              textValue={detailDataSource.principalPersonName}
                            />
                          )
                        ) : (
                          <span>{detailDataSource.principalPersonName}</span>
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
                        label={intl.get(`${modelPrompt}.scrapNum`).d('报废单编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('scrapNum', {
                            initialValue: detailDataSource.scrapNum,
                            rules: scrapNumRequired
                              ? [
                                  {
                                    required: true,
                                    message: intl.get('hzero.common.validation.notNull', {
                                      name: intl.get(`${modelPrompt}.scrapNum`).d('报废单编号'),
                                    }),
                                  },
                                ]
                              : [],
                          })(<Input disabled={!scrapNumRequired} />)
                        ) : (
                          <span>{detailDataSource.scrapNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.titleOverview`).d('标题概述')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('titleOverview', {
                            initialValue: detailDataSource.titleOverview,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{detailDataSource.titleOverview}</span>
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
                        label={intl.get(`${modelPrompt}.planStartDate`).d('执行日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('planStartDate', {
                            initialValue: detailDataSource.planStartDate
                              ? moment(detailDataSource.planStartDate, getDateTimeFormat())
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                              disabledDate={currentDate => {
                                return (
                                  (getFieldValue('planEndDate') &&
                                    moment(getFieldValue('planEndDate')).isBefore(
                                      currentDate,
                                      'day'
                                    )) ||
                                  moment(new Date()).isAfter(currentDate, 'day')
                                );
                              }}
                            />
                          )
                        ) : (
                          <span>{dateRender(detailDataSource.planStartDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.planEndDate`).d('完成日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('planEndDate', {
                            initialValue: detailDataSource.planEndDate
                              ? moment(detailDataSource.planStartDate, getDateTimeFormat())
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                              disabledDate={currentDate =>
                                getFieldValue('planStartDate') &&
                                moment(getFieldValue('planStartDate')).isAfter(currentDate, 'day')
                              }
                              onOpenChange={status => {
                                if (status && getFieldValue('planEndDate') == null) {
                                  setFieldsValue({ planEndDate: getFieldValue('planStartDate') });
                                }
                              }}
                            />
                          )
                        ) : (
                          <span>{dateRender(detailDataSource.planStartDate)}</span>
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
                        label={intl.get(`${modelPrompt}.description`).d('理由')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: detailDataSource.description,
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
                          <span>{detailDataSource.description}</span>
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
                    <h3>{intl.get(`${modelPrompt}.panel.B`).d('事务处理行信息')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                {isNew || editFlag ? (
                  <Row>
                    <Col className="search-btn-more">
                      <Button
                        icon="plus"
                        type="primary"
                        style={drawerAssetSelectButtonStyle}
                        onClick={onShowAssetModal.bind(true)}
                      >
                        {intl.get(`aatn.assetScrap.view.button.multiAdd`).d('选择资产')}
                      </Button>
                    </Col>
                  </Row>
                ) : null}
                <AssetModal {...assetModalProps} />
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
