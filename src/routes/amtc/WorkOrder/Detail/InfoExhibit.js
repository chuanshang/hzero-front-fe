import React, { Component, Fragment } from 'react';
import {
  Form,
  Tabs,
  Row,
  Col,
  Input,
  Collapse,
  Icon,
  Select,
  DatePicker,
  // Button，
} from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import { getDateTimeFormat, getDateFormat } from 'utils/utils';
import moment from 'moment';
import {
  DEFAULT_DATETIME_FORMAT,
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
// import notification from 'utils/notification';

// import WOOPList from './WOOPList';
// import WoLaborsList from '../../WoLabors/WoLaborsList';
// import WoMalfunctionList from '../../WoMalfunction/WoMalfunctionList';
// import WoAssessList from '../../WoAssess/WoAssessList';
// import WoChecklistGroupList from '../../WoChecklistGroups/WoChecklistGroupList';
// import WoChecklistList from '../../WoChecklists/WoChecklistList';
// import MaterialList from './MaterialList';
// import MaterialDetailDrawer from './MaterialDetailDrawer';
// import MaterialTreeModal from './MaterialTreeModal';
import WrdModal from './WrdModal';

@Form.create({ fieldNameProp: null })
class Detail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      // proSourceDetail: {},
      collapseKeys: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  // 弹出日历
  @Bind()
  onOpenPlanChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        scheduledFinishDate: getFieldValue('scheduledStartDate'),
      });
    }
  }

  @Bind()
  onPlanChange(date) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (date) {
      const day = getFieldValue('durationScheduled');
      const durationUom = getFieldValue('durationUom');
      const newDate = moment(date.format(getDateTimeFormat()));
      const addType = durationUom === 'DAY' ? 'd' : durationUom === 'HOUR' ? 'h' : 'm';
      setFieldsValue({
        scheduledFinishDate: newDate.add(day, addType),
        targetStartDate: date,
        targetFinishDate: newDate.add(day, addType),
      });
    } else {
      setFieldsValue({
        scheduledFinishDate: null,
        targetStartDate: null,
        targetFinishDate: null,
      });
    }
  }

  // 弹出日历
  @Bind()
  onOpenTargetChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        targetFinishDate: getFieldValue('targetStartDate'),
      });
    }
  }

  @Bind()
  onTargetChange(date) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const day = getFieldValue('durationScheduled');
    const durationUom = getFieldValue('durationUom');
    const newDate = moment(date.format(getDateTimeFormat()));
    const addType = durationUom === 'DAY' ? 'd' : durationUom === 'HOUR' ? 'h' : 'm';
    setFieldsValue({
      targetFinishDate: newDate.add(day, addType),
    });
  }

  // 弹出日历
  @Bind()
  onOpenActualChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        actualFinishDate: getFieldValue('actualStartDate'),
      });
    }
  }

  @Bind()
  onActualChange(date) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const day = getFieldValue('durationActual');
    const durationUom = getFieldValue('durationUom');
    const newDate = moment(date.format(getDateTimeFormat()));
    const addType = durationUom === 'DAY' ? 'd' : durationUom === 'HOUR' ? 'h' : 'm';
    setFieldsValue({
      actualFinishDate: newDate.add(day, addType),
    });
  }

  /**
   * 跳转到工序
   * @param {string} id id
   */
  @Bind()
  handleLinkToWoopDetail(woopId) {
    const { dispatch, woId } = this.props;
    const linkUrl = isUndefined(woopId) ? 'create' : `detail/${woopId}`;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/work-order/${woId}/woop/${linkUrl}`,
      })
    );
  }

  /**
   * 创建工序
   * @param {string} id id
   */
  @Bind()
  handleCreateWoop() {
    const { dispatch, woId } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/work-order/${woId}/woop/create`,
      })
    );
  }
  /**
   *  @function showEditDrawer - 显示编辑modal
   */
  // @Bind()
  // showEditDrawer(record) {
  //   this.setState({ drawerVisible: true, proSourceDetail: record, param: record.processType });
  // }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  // @Bind()
  // handleDetailDrawerOk(values = {}) {
  //   const { woMaterialId, ...other } = values;
  //   if (values._status !== 'create') {
  //     other.woMaterialId = woMaterialId;
  //   }
  //   const { dispatch, tenantId, woId } = this.props;
  //   const { param } = this.state;
  //   dispatch({
  //     type: 'workOrder/saveMaterialData',
  //     payload: {
  //       tenantId,
  //       data: [{ ...other, tenantId, woId: Number(woId), processType: param }],
  //     },
  //   }).then(res => {
  //     if (res) {
  //       notification.success();
  //       dispatch({
  //         type: 'workOrder/queryMaterialList',
  //         payload: {
  //           tenantId,
  //           woId,
  //         },
  //       });
  //       dispatch({
  //         type: 'workOrder/queryMaterialReturnList',
  //         payload: {
  //           tenantId,
  //           woId,
  //         },
  //       });
  //       this.setState({ proSourceDetail: {}, drawerVisible: false });
  //     }
  //   });
  // }
  // @Bind()
  // handleDetailDrawerCancel() {
  //   this.setState({ drawerVisible: false, proSourceDetail: {} });
  // }
  /**
   * 新增备件耗材投入tree
   */
  @Bind()
  handleAddTreeMaterial() {
    const { dispatch, tenantId, woId } = this.props;
    dispatch({
      type: 'workOrder/queryItemsTreeMaterial',
      payload: {
        tenantId,
        woId,
      },
    });
  }

  render() {
    const commonPromptCode = 'amtc.workOrder.model.workOrder';
    const {
      // woId,
      isNew,
      editFlag,
      // dispatch,
      // woMalfuction,
      // woAssess,
      // loading,
      selectMaps,
      dataSource,
      form: { getFieldDecorator, getFieldValue },
      tenantId,
      woopList,
      // woopPagination,
      // onWoopSearch,
      // onDeleteWoop,
      // materialList,
      // materialPagination,
      // materialReturnList,
      // materialReturnPagination,
      // treeList,
      // treeHisList,
      // selectedRowKeys,
      // selectedRowHisKeys,
      // modalVisible,
      wrdModalDisplay,
      itemProperty,
      tabPaneHeight,
      // onSelectRow,
      // onSelectHisRow,
      // onModalCancel,
      // onAssetModalOk,
      // onShowAssetModal,
      // onMaterialSearch,
      // onMaterialReturnSearch,
      // onDeleteMaterial,
      onWrdModalOk,
      onWrdCancel,
      // assessTime,
      // assessStatus,
    } = this.props;
    const { woStatusMap, mapSourceCodeMap, durationUomMap } = selectMaps;
    const {
      // proSourceDetail,
      // drawerVisible = false,
      // isMulti = false,
      collapseKeys = [],
    } = this.state;
    // const woopListProps = {
    //   loading: loading.queryWorkProcessList,
    //   dataSource: woopList,
    //   pagination: woopPagination,
    //   onLinkToWOOPDetail: this.handleLinkToWoopDetail,
    //   onSearch: onWoopSearch,
    //   onDeleteWoop,
    // };
    // const woMalfunctionListProps = {
    //   isNew,
    //   editFlag,
    //   woId,
    //   woName: dataSource.woName,
    //   tenantId,
    //   dispatch,
    //   loading,
    //   woMalfuction,
    // };
    // const woAssessListProps = {
    //   isNew,
    //   editFlag,
    //   woId,
    //   woName: dataSource.woName,
    //   tenantId,
    //   dispatch,
    //   loading,
    //   woAssess,
    //   assessTime,
    //   assessStatus,
    // };
    // const woChecklistGroupsListProps = {
    //   isNew,
    //   editFlag,
    //   dispatch,
    //   parentId: woId,
    //   parentType: 'WO',
    // };
    // const woChecklistListProps = {
    //   isNew,
    //   editFlag,
    //   tenantId,
    //   dispatch,
    //   parentId: woId,
    //   parentType: 'WO',
    // };
    // const woLaborsListProps = {
    //   isNew,
    //   editFlag,
    //   tenantId,
    //   dispatch,
    //   parentId: woId,
    //   parentType: 'WO',
    // };
    // const drawerDetailProps = {
    //   tenantId,
    //   dataSource: { ...proSourceDetail, woId },
    //   title: intl.get(`amtc.workCenter.view.message.drawer`).d('编辑备件耗材'),
    //   anchor: 'right',
    //   maskClosable: false,
    //   visible: drawerVisible,
    //   onCancel: this.handleDetailDrawerCancel,
    //   onOk: this.handleDetailDrawerOk,
    // };
    // const materialModalProps = {
    //   isMulti,
    //   treeList,
    //   treeHisList,
    //   selectedRowKeys,
    //   selectedRowHisKeys,
    //   modalVisible,
    //   onSelectRow,
    //   onSelectHisRow,
    //   onAssetModalOk,
    //   onSearchAsset: this.handleAddTreeMaterial,
    //   loading: loading.equipmentAsset,
    //   onCancel: onModalCancel,
    // };
    // const materialListProps = {
    //   loading: loading.queryMaterialList,
    //   dataSource: materialList,
    //   pagination: materialPagination,
    //   onSearch: onMaterialSearch,
    //   onEditLine: this.showEditDrawer,
    //   onDeleteMaterial,
    // };
    // const materialReturnListProps = {
    //   loading: loading.queryMaterialReturnList,
    //   dataSource: materialReturnList,
    //   pagination: materialReturnPagination,
    //   onSearch: onMaterialReturnSearch,
    //   onEditLine: this.showEditDrawer,
    //   onDeleteMaterial,
    // };
    const wrdModalProps = {
      tenantId,
      wrdModalDisplay,
      headerData: dataSource,
      woopList: woopList.map(item => {
        return { ...item, _status: 'update' };
      }),
      onWrdModalOk,
      onCancel: onWrdCancel,
    };

    const formLongLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    // const woopPanel = !isUndefined(woId) ? { display: 'block' } : { display: 'none' };
    return (
      <React.Fragment>
        {!isNew ? (
          <React.Fragment>
            <Row>
              <Col span={24}>
                <Row className="object-title">
                  <h1>{`${dataSource.woName}`}</h1>
                  <h2>{/** 副标题加在此处 */}</h2>
                </Row>
                <Row className="object-header">{/** 其余展示字段加在此处 */}</Row>
              </Col>
            </Row>
            <WrdModal {...wrdModalProps} />
          </React.Fragment>
        ) : (
            ''
          )}
        <Tabs defaultActiveKey="basicTab">
          <Tabs.TabPane
            tab={intl.get(`${commonPromptCode}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: tabPaneHeight, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C', 'D', 'E', 'F', 'G']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('A') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get('hzero.common.view.baseInfo').d('基本信息')}
                    </h3>
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
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.woNum`).d('工单编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woNum', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.woNum`).d('工单编号'),
                                }),
                              },
                            ],
                            initialValue: dataSource.woNum,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.woNum}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.maintSitesId`).d('服务区域')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('maintSitesId', {
                            initialValue: dataSource.maintSitesId,
                            rules: [
                              {
                                required: itemProperty.maintSitesId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.maintSitesId`).d('服务区域'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.maintSitesId.disabled}
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.maintSitesName}
                            />
                          )
                        ) : (
                          <span>{dataSource.maintSitesName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.woTypeId`).d('工单类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woTypeId', {
                            initialValue: dataSource.woTypeId,
                            rules: [
                              {
                                required: itemProperty.woTypeId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.woTypeId`).d('工单类型'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.woTypeId.disabled}
                              code="AMTC.WORKORDERTYPES"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.woTypeName}
                            />
                          )
                        ) : (
                          <span>{dataSource.woTypeName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.woName`).d('工单概述')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woName', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.woName`).d('工单概述'),
                                }),
                              },
                            ],
                            initialValue: dataSource.woName,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.woName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.woStatus`).d('工单状态')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woStatus', {
                            initialValue: dataSource.woStatus,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.woStatus`).d('工单状态'),
                                }),
                              },
                            ],
                          })(
                            <Select>
                              {woStatusMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.woStatusMeaning}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.actId`).d('标准作业活动')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actId', {
                            initialValue: dataSource.actId,
                            rules: [
                              {
                                required: itemProperty.actId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.actId`).d('标准作业活动'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.actId.disabled}
                              code="AMTC.ACT"
                              queryParams={{ tenantId }}
                              textValue={dataSource.actName}
                            />
                          )
                        ) : (
                          <span>{dataSource.actName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={14}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.description`).d('描述')}
                        {...formLongLayout}
                      >
                        {isNew || editFlag ? (
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
                    <h3 style={collapseKeys.includes('B') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.B`).d('工作对象')}
                    </h3>
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
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.orgId`).d('客户/需求组织')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('orgId', {
                            initialValue: dataSource.orgId,
                            rules: [
                              {
                                required: itemProperty.orgId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.orgId`).d('客户/需求组织'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.orgId.disabled}
                              code="AMDM.ORGANIZATION"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.orgName}
                            />
                          )
                        ) : (
                          <span>{dataSource.orgName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.contactId`).d('需求方联系人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('contactId', {
                            initialValue: dataSource.contactId,
                            rules: [
                              {
                                required: itemProperty.contactId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.contactId`).d('需求方联系人'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.contactId.disabled}
                              code="HALM.EMPLOYEE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.contactName}
                            />
                          )
                        ) : (
                          <span>{dataSource.contactName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.contactDesc`).d('联系人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('contactDesc', {
                            rules: [],
                            initialValue: dataSource.contactDesc,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.contactDesc}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.phone`).d('联系电话')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('phone', {
                            rules: [],
                            initialValue: dataSource.phone,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.phone}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.assetLocationId`).d('位置')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetLocationId', {
                            initialValue: dataSource.assetLocationId,
                            rules: [
                              {
                                required: itemProperty.assetLocationId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.assetLocationId`).d('位置'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.assetLocationId.disabled}
                              code="AMDM.LOCATIONS"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetLocationName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetLocationName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.assetRouteId`).d('资产路线')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetRouteId', {
                            initialValue: dataSource.assetRouteId,
                            rules: [
                              {
                                required: itemProperty.assetRouteId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.assetRouteId`).d('资产路线'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.assetRouteId.disabled}
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.assetRouteName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetRouteName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.locationDesc`).d('位置补充说明')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('locationDesc', {
                            rules: [],
                            initialValue: dataSource.locationDesc,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.locationDesc}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.assetId`).d('设备/资产')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('assetId', {
                            initialValue: dataSource.assetId,
                            rules: [
                              {
                                required: itemProperty.assetId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.assetId`).d('设备/资产'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.assetId.disabled}
                              code="AAFM.ASSETS"
                              queryParams={{ tenantId }}
                              textValue={dataSource.assetName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.mapSourceCode`).d('地图来源')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('mapSourceCode', {
                            initialValue: dataSource.mapSourceCode,
                            rules: [],
                          })(
                            <Select>
                              {mapSourceCodeMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.mapSourceMeaing}</span>
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
                    <h3 style={collapseKeys.includes('C') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.C`).d('工作职责及权限控制')}
                    </h3>
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
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.plannerGroupId`).d('签派/计划员组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('plannerGroupId', {
                            initialValue: dataSource.plannerGroupId,
                            rules: [
                              {
                                required: itemProperty.plannerGroupId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.plannerGroupId`)
                                    .d('签派/计划员组'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.plannerGroupId.disabled}
                              code="AMTC.SKILLTYPES"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.plannerGroupName}
                            />
                          )
                        ) : (
                          <span>{dataSource.plannerGroupName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.plannerId`).d('签派/计划员')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('plannerId', {
                            initialValue: dataSource.plannerId,
                            rules: [
                              {
                                required: itemProperty.plannerId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.plannerId`).d('签派/计划员'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.plannerId.disabled}
                              code="AMTC.WORKCENTERSTAFF"
                              queryParams={{
                                organizationId: tenantId,
                                skilltypeId: getFieldValue('plannerGroupId'),
                              }}
                              textValue={dataSource.plannerName}
                            />
                          )
                        ) : (
                          <span>{dataSource.plannerName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.ownerGroupId`).d('负责人组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('ownerGroupId', {
                            initialValue: dataSource.ownerGroupId,
                            rules: [
                              {
                                required: itemProperty.ownerGroupId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.ownerGroupId`).d('负责人组'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.ownerGroupId.disabled}
                              code="AMTC.SKILLTYPES"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.ownerGroupName}
                            />
                          )
                        ) : (
                          <span>{dataSource.ownerGroupName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.ownerId`).d('负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('ownerId', {
                            initialValue: dataSource.ownerId,
                            rules: [
                              {
                                required: itemProperty.ownerId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.ownerId`).d('负责人'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.ownerId.disabled}
                              code="AMTC.WORKCENTERSTAFF"
                              queryParams={{
                                organizationId: tenantId,
                                skilltypeId: getFieldValue('ownerGroupId'),
                              }}
                              textValue={dataSource.ownerName}
                            />
                          )
                        ) : (
                          <span>{dataSource.ownerName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.woopOwnerGroupId`)
                          .d('首个工序负责人组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woopOwnerGroupId', {
                            initialValue: dataSource.woopOwnerGroupId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.woopOwnerGroupId`)
                                    .d('首个工序负责人组'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMTC.SKILLTYPES"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.woopOwnerGroupName}
                            />
                          )
                        ) : (
                          <span>{dataSource.woopOwnerGroupName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.woopOwnerId`).d('首个工序负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('woopOwnerId', {
                            initialValue: dataSource.woopOwnerId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.woopOwnerId`)
                                    .d('首个工序负责人'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMTC.WORKCENTERSTAFF"
                              queryParams={{
                                organizationId: tenantId,
                                skilltypeId: getFieldValue('woopOwnerGroupId'),
                              }}
                              textValue={dataSource.woopOwnerName}
                            />
                          )
                        ) : (
                          <span>{dataSource.woopOwnerName}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.waitingWoopownerFlag`)
                          .d('允许自行接单来明确负责人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('waitingWoopownerFlag', {
                            initialValue: dataSource.waitingWoopownerFlag,
                          })(<Switch disabled={itemProperty.waitingWoopownerFlag.disabled} />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.waitingWoopownerFlag)}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.ownerConfirmFlag`)
                          .d('需要工单负责人做最后确认')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('ownerConfirmFlag', {
                            initialValue: dataSource.ownerConfirmFlag,
                          })(<Switch disabled={itemProperty.ownerConfirmFlag.disabled} />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.ownerConfirmFlag)}</span>
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
                    <h3 style={collapseKeys.includes('D') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.D`).d('工单计划及排程')}
                    </h3>
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
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.priorityId`).d('计划优先级')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('priorityId', {
                            initialValue: dataSource.priorityId,
                            rules: [],
                          })(
                            <Lov
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.priorityName}
                            />
                          )
                        ) : (
                          <span>{dataSource.priorityName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.durationScheduled`).d('计划工期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('durationScheduled', {
                            initialValue: dataSource.durationScheduled,
                            rules: [],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.durationScheduled}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.durationUom`).d('工期单位')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('durationUom', {
                            initialValue: dataSource.durationUom || 'HOUR',
                            rules: [],
                          })(
                            <Select>
                              {durationUomMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.durationUomMeaning}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.scheduledStartDate`).d('计划开始时间')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('scheduledStartDate', {
                            initialValue: dataSource.scheduledStartDate
                              ? moment(dataSource.scheduledStartDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.scheduledStartDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.scheduledStartDate`)
                                    .d('计划开始时间'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.scheduledStartDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              onChange={this.onPlanChange}
                              disabledDate={currentDate =>
                                getFieldValue('scheduledFinishDate') &&
                                moment(getFieldValue('scheduledFinishDate')).isBefore(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.scheduledStartDate)}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl
                          .get(`${commonPromptCode}.scheduledFinishDate`)
                          .d('计划完成时间')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('scheduledFinishDate', {
                            initialValue: dataSource.scheduledFinishDate
                              ? moment(dataSource.scheduledFinishDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.scheduledFinishDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.scheduledFinishDate`)
                                    .d('计划完成时间'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.scheduledFinishDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              onChange={val => {
                                this.props.form.setFieldsValue({ targetFinishDate: val });
                              }}
                              // onOpenChange={this.onOpenPlanChange}
                              disabledDate={currentDate =>
                                getFieldValue('scheduledStartDate') &&
                                moment(getFieldValue('scheduledStartDate')).isAfter(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.scheduledFinishDate)}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.planFixedFlag`).d('计划已确定')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('planFixedFlag', {
                            initialValue: dataSource.planFixedFlag,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.planFixedFlag)}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.targetStartDate`).d('目标开始日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('targetStartDate', {
                            initialValue: dataSource.targetStartDate
                              ? moment(dataSource.targetStartDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.targetStartDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.targetStartDate`)
                                    .d('目标开始日期'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.targetStartDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              onChange={this.onTargetChange}
                              disabledDate={currentDate =>
                                getFieldValue('targetFinishDate') &&
                                moment(getFieldValue('targetFinishDate')).isBefore(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.targetStartDate)}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.targetFinishDate`).d('目标完成日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('targetFinishDate', {
                            initialValue: dataSource.targetFinishDate
                              ? moment(dataSource.targetFinishDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.targetFinishDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.targetFinishDate`)
                                    .d('目标完成日期'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.targetFinishDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              // onOpenChange={this.onOpenTargetChange}
                              disabledDate={currentDate =>
                                getFieldValue('targetStartDate') &&
                                moment(getFieldValue('targetStartDate')).isAfter(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.targetFinishDate)}</span>
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
                    <h3 style={collapseKeys.includes('E') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.E`).d('实际执行')}
                    </h3>
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
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.durationActual`).d('实际工期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('durationActual', {
                            initialValue: dataSource.durationActual,
                            rules: [],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.durationActual}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.actualStartDate`).d('实际开始时间')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actualStartDate', {
                            initialValue: dataSource.actualStartDate
                              ? moment(dataSource.actualStartDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.actualStartDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.actualStartDate`)
                                    .d('实际开始时间'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.actualStartDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              onChange={this.onActualChange}
                              disabledDate={currentDate =>
                                getFieldValue('actualFinishDate') &&
                                moment(getFieldValue('actualFinishDate')).isBefore(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.actualStartDate)}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.actualFinishDate`).d('实际完成时间')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('actualFinishDate', {
                            initialValue: dataSource.actualFinishDate
                              ? moment(dataSource.actualFinishDate, DEFAULT_DATETIME_FORMAT)
                              : null,
                            rules: [
                              {
                                required: itemProperty.actualFinishDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.actualFinishDate`)
                                    .d('实际完成时间'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.actualFinishDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateTimeFormat()}
                              showTime
                              // onOpenChange={this.onOpenActualChange}
                              disabledDate={currentDate =>
                                getFieldValue('actualStartDate') &&
                                moment(getFieldValue('actualStartDate')).isAfter(
                                  currentDate,
                                  'second'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.actualFinishDate)}</span>
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
                    <h3 style={collapseKeys.includes('F') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.F`).d('工单来源信息')}
                    </h3>
                    <a>
                      {collapseKeys.includes('F')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('F') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.reportOrgId`).d('报告人所在组织')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('reportOrgId', {
                            initialValue: dataSource.reportOrgId,
                            rules: [
                              {
                                required: itemProperty.reportOrgId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.reportOrgId`)
                                    .d('报告人所在组织'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.reportOrgId.disabled}
                              code="AMDM.ORGANIZATION"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.reportOrgName}
                            />
                          )
                        ) : (
                          <span>{dataSource.reportOrgName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.reporterId`).d('报告人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('reporterId', {
                            initialValue: dataSource.reporterId,
                            rules: [
                              {
                                required: itemProperty.reporterId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.reporterId`).d('报告人'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.reporterId.disabled}
                              code="HALM.EMPLOYEE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.reporterName}
                            />
                          )
                        ) : (
                          <span>{dataSource.reporterName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.reportDate`).d('报告时间')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('reportDate', {
                            initialValue: dataSource.reportDate
                              ? moment(dataSource.reportDate, getDateFormat())
                              : null,
                            rules: [
                              {
                                required: itemProperty.reportDate.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${commonPromptCode}.reportDate`).d('报告时间'),
                                }),
                              },
                            ],
                          })(
                            <DatePicker
                              disabled={itemProperty.reportDate.disabled}
                              placeholder=""
                              style={{ width: '100%' }}
                              format={getDateFormat()}
                              showTime
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.reportDate)}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.reportPriorityId`).d('报告的优先级')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('reportPriorityId', {
                            initialValue: dataSource.reportPriorityId,
                            rules: [
                              {
                                required: itemProperty.reportPriorityId.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.reportPriorityId`)
                                    .d('报告的优先级'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              disabled={itemProperty.reportPriorityId.disabled}
                              code="AMDM.ASSET_MAINT_SITE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.reportPriorityName}
                            />
                          )
                        ) : (
                          <span>{dataSource.reportPriorityName}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.sourceTypeCode`).d('工单来源')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('sourceTypeCode', {
                            initialValue: dataSource.sourceTypeCode,
                            rules: [
                              {
                                required: itemProperty.sourceTypeCode.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.sourceTypeCode`)
                                    .d('工单来源'),
                                }),
                              },
                            ],
                          })(<Input disabled={itemProperty.sourceTypeCode.disabled} />)
                        ) : (
                          <span>{dataSource.sourceTypeCode}</span>
                          )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${commonPromptCode}.sourceReference`).d('来源单据号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {isNew || editFlag ? (
                          getFieldDecorator('sourceReference', {
                            initialValue: dataSource.sourceReference,
                            rules: [
                              {
                                required: itemProperty.sourceReference.required,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${commonPromptCode}.sourceReference`)
                                    .d('来源单据号'),
                                }),
                              },
                            ],
                          })(<Input disabled={itemProperty.sourceReference.disabled} />)
                        ) : (
                          <span>{dataSource.sourceReference}</span>
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              {/* <Collapse.Panel
                showArrow={false}
                key="F"
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('G') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.G`).d('工单任务')}
                    </h3>
                    <a>
                      {collapseKeys.includes('G')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('G') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Row style={{ margin: '10px' }}>
                  <Col>
                    <Button icon="plus" type="primary" onClick={this.handleCreateWoop}>
                      {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
                    </Button>
                  </Col>
                </Row>
                <WOOPList {...woopListProps} />
              </Collapse.Panel> */}
            </Collapse>
          </Tabs.TabPane>
          {/* {isNew ? (
            ''
          ) : (
            <Tabs.TabPane
              tab={intl.get(`${commonPromptCode}.tab.malfunction`).d('故障/缺陷信息')}
              key="malfunction"
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            >
              <WoMalfunctionList {...woMalfunctionListProps} />
            </Tabs.TabPane>
          )}
          {isNew ? (
            ''
          ) : (
            <Tabs.TabPane
              tab={intl.get(`${commonPromptCode}.tab.assess`).d('服务评价')}
              key="assess"
              style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
            >
              <WoAssessList {...woAssessListProps} />
            </Tabs.TabPane>
          )}
          {isNew ? (
            ''
          ) : (
            <Tabs.TabPane
              tab={intl.get(`${commonPromptCode}.tab.material`).d('备件耗材')}
              key="material"
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            >
              <Row style={{ margin: '10px' }}>
                <Col>
                  <h3>备件耗材投入</h3>
                </Col>
              </Row>
              <Row style={{ margin: '10px' }}>
                <Col>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => onShowAssetModal(true, 'INVEST')}
                  >
                    {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
                  </Button>
                </Col>
              </Row>
              <MaterialList {...materialListProps} />
              <MaterialDetailDrawer {...drawerDetailProps} />
              <MaterialTreeModal {...materialModalProps} />
              <Row style={{ margin: '10px' }}>
                <h3>备件耗材退回</h3>
              </Row>
              <Row style={{ margin: '10px' }}>
                <Col>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => onShowAssetModal(true, 'RETURN')}
                  >
                    {intl.get(`amtc.workCenter.view.button.add`).d('新增')}
                  </Button>
                </Col>
              </Row>
              <MaterialList {...materialReturnListProps} />
              <MaterialDetailDrawer {...drawerDetailProps} />
              <MaterialTreeModal {...materialModalProps} />
            </Tabs.TabPane>
          )}
          {isNew ? (
            ''
          ) : (
            <Tabs.TabPane
              tab={intl.get(`${commonPromptCode}.tab.checklist`).d('检查项')}
              key="checklist"
              style={{ height: tabPaneHeight, overflow: 'auto' }}
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
                      <h3 style={collapseKeys.includes('A') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                        {intl.get(`${commonPromptCode}.panel.a`).d('实际检查项')}
                      </h3>
                      <a>
                        {collapseKeys.includes('A')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <WoChecklistList {...woChecklistListProps} />
                </Collapse.Panel>
                <Collapse.Panel
                  showArrow={false}
                  key="B"
                  header={
                    <Fragment>
                      <h3 style={collapseKeys.includes('B') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                        {intl.get(`${commonPromptCode}.panel.b`).d('实际检查组')}
                      </h3>
                      <a>
                        {collapseKeys.includes('B')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                    </Fragment>
                  }
                >
                  <WoChecklistGroupList {...woChecklistGroupsListProps} />
                </Collapse.Panel>
              </Collapse>
            </Tabs.TabPane>
          )}
          <Tabs.TabPane
            tab={intl.get(`${commonPromptCode}.tab.labor`).d('人员')}
            key="labor"
            style={{ height: tabPaneHeight, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('A') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${commonPromptCode}.panel.a`).d('人工')}
                    </h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <WoLaborsList {...woLaborsListProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane> */}
        </Tabs>
      </React.Fragment>
    );
  }
}
export default Detail;
