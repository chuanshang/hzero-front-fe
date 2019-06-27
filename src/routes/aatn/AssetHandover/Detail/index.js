/**
 * 资产移出归还单 创建/编辑 明细
 * @date: 2019-3-21
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button, Spin, Row, Col, Modal, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { isUndefined, isEmpty, omit, isNull } from 'lodash';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ assetHandover, loading }) => ({
  assetHandover,
  loading: {
    detail: loading.effects['assetHandover/fetchAssetHandoverDetail'],
    fullTextSearch: loading.effects['assetHandover/searchFullText'],
    save: loading.effects['assetHandover/saveAssetHandover'],
    equipmentAsset: loading.effects['assetHandover/fetchEquipmentAsset'],
    execute: loading.effects['assetHandover/executeAssetHandover'],
    submit: loading.effects['assetHandover/submitAssetHandover'],
    fetchDynamicFields: loading.effects['assetHandover/fetchDynamicFields'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aatn.common', 'aatn.assetHandover'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editControl: false,
      showSearchFlag: true,
      isMulti: false,
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      drawerVisible: false,
      lineDetail: [],
      executeData: {}, // 执行处理提交的数据
      returnFlag: false, // 移交归还flag
      dynamicFields: [], // 需要展示的动态字段
      submitDynamics: [], // 需提交的动态数据列表
      valuesList: [], // 下拉列表值集列表
      defaultItem: {
        processStatus: 'NEW',
        processStatusMeaning: '新建',
      },
    };
  }

  componentDidMount() {
    const { match, tenantId } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
    this.props.dispatch({ type: 'assetHandover/fetchLov', payload: { tenantId } });
  }

  /**
   * 设备资产列表查询
   */
  @Bind()
  handleSearchAsset(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetDesc } = fields;
    dispatch({
      type: 'assetHandover/fetchEquipmentAsset',
      payload: {
        tenantId,
        detailCondition: assetDesc,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 打开设备资产模态框
   */
  @Bind()
  handleShowAssetModal(flag) {
    this.handleSearchAsset();
    this.setState({ modalVisible: true, isMulti: flag });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleModalCancel() {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
  }

  /**
   * 设备资产模态框确认操作
   */
  @Bind()
  handleAssetModalOk() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      assetHandover: { lineList, transferType },
    } = this.props;
    const { targetAssetStatusId, targetAssetStatusName } = transferType;
    let newSelectedRows = [];
    if (!isEmpty(selectedRows)) {
      newSelectedRows = selectedRows.map(item => {
        const { name, assetId, assetStatus, assetDesc } = item;
        const id = uuidv4();
        const temp = {
          ...item,
          targetAssetStatusId,
          targetAssetStatusName,
          currentAssetStatusId: item.assetStatusId,
          currentAssetStatusName: item.assetStatusName,
          currentOwningPersonId: item.owningPersonId,
          currentOwningPersonName: item.owningPersonName,
          currentUsingPersonId: item.userPersonId,
          currentUsingPersonName: item.userPersonName,
          processStatus: 'NEW',
          handoverLineId: id,
          _status: 'create',
        };
        return {
          name,
          assetId,
          assetStatus,
          assetDesc,
          detailList: [omit(temp, ['description', '_token', 'objectVersionNumber'])],
          processStatus: 'NEW',
          processStatusMeaning: '新建',
          handoverLineId: id,
          _status: 'create',
        };
      });
    }
    dispatch({
      type: 'assetHandover/updateState',
      payload: {
        lineList: [...lineList, ...newSelectedRows],
      },
    });
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
  }

  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 弹出行明细滑窗
   * @param {object} record 行记录
   */
  @Bind()
  handleShowDrawer(record) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { id },
      },
      assetHandover: { transferType },
    } = this.props;

    if (record._status !== 'create') {
      if (!isUndefined(id)) {
        dispatch({
          type: 'assetHandover/fetchDynamicFields',
          payload: {
            tenantId,
            orderHeaderId: record.handoverLineId,
            orderLineId: record.detailList[0].handoverDetailId,
            orderTypeCode: transferType.basicTypeCode,
          },
        }).then(res => {
          if (res) {
            // 为record.detailList下的对象插入dynamicColumnList
            const { detailList } = record;
            let newDetailList = detailList;
            if (!isUndefined(detailList) && !isEmpty(detailList)) {
              newDetailList = detailList.map(item => {
                const dynamicColumnList = [];
                res.forEach(element => {
                  if (item.handoverDetailId === element.orderLineId) {
                    dynamicColumnList.push(element);
                  }
                });
                return { ...item, dynamicColumnList };
              });
            }
            this.setState({
              drawerVisible: true,
              lineDetail: newDetailList,
              executeData: { ...record, detailList: newDetailList },
            });
          } else {
            this.setState({
              drawerVisible: true,
              lineDetail: record.detailList,
              executeData: record,
            });
          }
        });
      }
    } else {
      this.setState({
        drawerVisible: true,
        lineDetail: record.detailList,
        executeData: record,
      });
    }
  }

  /**
   * 滑窗关闭
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false });
  }

  /**
   * 滑窗的确认操作
   * @param {object} current 当前编辑的行记录
   */
  @Bind()
  handleDrawerOk(current = {}) {
    const { submitDynamics } = this.state;
    const {
      dispatch,
      tenantId,
      assetHandover: { lineList },
    } = this.props;
    const tempList = lineList.filter(item => item.handoverLineId === current.handoverLineId);
    const { detailList = [] } = tempList[0];
    let newList = [];
    const submitList = [];
    const { description, lineDescription, processStatus } = current;
    if (current._status === 'create') {
      // 新添加的行数据
      submitDynamics.forEach(item => {
        if (!isUndefined(current[`target#${item._tag}`])) {
          submitList.push({
            ...item,
            tenantId,
            currentColumnValue: current[`current#${item._tag}`],
            targetColumnValue: current[`target#${item._tag}`],
            targetColumnDesc: current[`targetName#${item._tag}`],
            currentColumnDesc: current[`currentName#${item._tag}`],
          });
        }
      });
      detailList[0] = {
        ...detailList[0],
        ...current,
        description: lineDescription,
        handoverTypeCode: 'NEW', // 移交确认/移交归还
        dynamicColumnList: submitList,
      };
      newList = lineList.map(item =>
        item.handoverLineId === current.handoverLineId
          ? {
              ...item,
              description,
              processStatus,
              detailList,
            }
          : item
      );
    } else {
      // 编辑
      submitDynamics.forEach(item => {
        if (!isUndefined(current[`target#${item._tag}`])) {
          submitList.push({
            ...item,
            tenantId,
            handoverLineId: current.handoverLineId,
            currentColumnValue: current[`current#${item._tag}`],
            targetColumnValue: current[`target#${item._tag}`],
            targetColumnDesc: current[`targetName#${item._tag}`],
            currentColumnDesc: current[`currentName#${item._tag}`],
          });
        }
      });
      detailList[0] = {
        ...detailList[0],
        ...current,
        description: lineDescription,
        dynamicColumnList: submitList,
      };
      newList = lineList.map(item =>
        item.handoverLineId === current.handoverLineId
          ? {
              ...item,
              processStatus,
              description,
              detailList,
              _status: 'update',
            }
          : item
      );
    }
    dispatch({
      type: 'assetHandover/updateState',
      payload: {
        lineList: newList,
      },
    });
    this.setState({ drawerVisible: false });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'assetHandover/fetchAssetHandoverDetail',
        payload: {
          tenantId,
          handoverHeaderId: id,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'assetHandover/fetchTransactionTypeLine',
            payload: {
              tenantId,
              transactionTypeId: res.transactionTypeId,
            },
          }).then(transferType => {
            if (transferType) {
              this.handleGetFields(transferType);
            }
          });
        }
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSave() {
    const { editControl } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      assetHandover: { detail, lineList },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newList = [];
        lineList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        const newLineList = newList.map(item =>
          item._status === 'create'
            ? omit(item, ['_status', 'handoverLineId'])
            : omit(item, ['_status'])
        );
        let temp = {};
        const data = newLineList.map(item => {
          if (item.detailList) {
            const {
              // detailList无用数据太多，只提取需要的数据保存
              assetId,
              processStatus,
              currentAssetStatusId,
              targetAssetStatusId,
              currentOwningPersonId,
              targetOwningPersonId,
              currentUsingPersonId,
              targetUsingPersonId,
              description,
              handoverTypeCode,
              handoverLineId,
              _status,
              _token,
              objectVersionNumber,
              dynamicColumnList,
            } = item.detailList[0];
            temp = {
              assetId,
              processStatus,
              currentAssetStatusId,
              targetAssetStatusId,
              currentOwningPersonId,
              targetOwningPersonId,
              currentUsingPersonId,
              targetUsingPersonId,
              description,
              handoverTypeCode,
              handoverLineId,
              _status,
              _token,
              objectVersionNumber,
              dynamicColumnList,
            };
          }
          if (temp && temp._status === 'create') {
            delete temp.handoverLineId;
            delete temp._token;
            delete temp.objectVersionNumber;
          }
          return { ...item, detailList: [temp] };
        });
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'assetHandover/saveAssetHandover',
            payload: {
              tenantId,
              data: {
                tenantId,
                ...values,
                lineList: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/asset-handover/detail/${res.handoverHeaderId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'assetHandover/saveAssetHandover',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                lineList: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editControl: !editControl });
              this.handleSearch();
            }
          });
        }
      }
    });
  }
  /**
   * 行记录删除
   * @param {object} record - 行记录
   */
  @Bind()
  handleDelete(record) {
    const {
      dispatch,
      tenantId,
      assetHandover: { lineList },
    } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl.get('aatn.assetHandover.view.message.delete').d('是否删除资产行？'),
      onOk: () => {
        let newList = [];
        newList = lineList.filter(item => item.handoverLineId !== record.handoverLineId);
        if (record._status === 'create') {
          // 未保存的数据，从页面上删除
          dispatch({
            type: 'assetHandover/updateState',
            payload: {
              lineList: newList,
            },
          });
        } else {
          // 数据库中删除
          const deleteRow = lineList.filter(item => item.handoverLineId === record.handoverLineId);
          dispatch({
            type: 'assetHandover/deleteAssetHandover',
            payload: {
              tenantId,
              data: deleteRow,
            },
          }).then(res => {
            if (res) {
              this.handleSearch();
              notification.success();
              dispatch({
                type: 'assetHandover/updateState',
                payload: {
                  lineList: newList,
                },
              });
            }
          });
        }
      },
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - assetModal中的form对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 明细页-数据检索
   * @param {string} [condition = ''] - 查询条件
   * @param {object} [page = {}] - 分页参数
   * @param {Number} page.current - 当前页码
   * @param {Number} page.pageSize - 分页大小
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    // 初始化states
    this.setState({
      lineDetail: [],
      executeData: {}, // 执行处理提交的数据
      returnFlag: false, // 移交归还flag
      dynamicFields: [], // 需要展示的动态字段
      submitDynamics: [], // 需提交的动态数据列表
    });
    const { dispatch, tenantId } = this.props;
    this.setState({});
    dispatch({
      type: 'assetHandover/searchFullText',
      payload: {
        tenantId,
        page,
        detailCondition: condition,
      },
    });
  }

  /**
   * 资产移交归还单明细查询
   * @param {string} id - 资产移交归还单头Id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-handover/detail/${id}`,
      })
    );
  }

  /**
   * 执行处理
   */
  @Bind()
  handleExecute() {
    const { executeData } = this.state;
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'assetHandover/executeAssetHandover',
      payload: {
        tenantId,
        data: executeData,
      },
    }).then(res => {
      if (res) {
        const newList = res.detailList.map(item => ({ ...item, processStatus: res.processStatus }));
        this.setState({
          lineDetail: newList,
          executeData: res,
        });
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 移交归还生成确认信息
   */
  @Bind()
  handleHandoverReturn() {
    const {
      dispatch,
      assetHandover: { lineList, dynamicFieldsData },
    } = this.props;
    // 将目标值和当前值交换，组成一个新的动态字段数组
    const exchangedDynamicFieldsData = dynamicFieldsData.map(item => {
      const { currentColumnName, currentTableName, orderTypeCode, targetColumnType } = item;
      return {
        currentColumnName,
        currentTableName,
        orderTypeCode,
        targetColumnType,
        // 以下是需要交换的值
        currentColumnValue: item.targetColumnValue,
        currentColumnDesc: item.targetColumnDesc,
        targetColumnValue: item.currentColumnValue,
        targetColumnDesc: item.currentColumnDesc,
      };
    });
    const { lineDetail, executeData } = this.state;
    const item = lineDetail[0];
    const {
      currentOwningPersonId,
      targetOwningPersonId,
      currentUsingPersonId,
      targetUsingPersonId,
      currentOwningPersonName,
      targetOwningPersonName,
      currentUsingPersonName,
      targetUsingPersonName,
    } = item;
    const exchangedItem = {
      ...item,
      dynamicColumnList: exchangedDynamicFieldsData,
      currentOwningPersonId: targetOwningPersonId,
      targetOwningPersonId: currentOwningPersonId,
      currentUsingPersonId: targetUsingPersonId,
      targetUsingPersonId: currentUsingPersonId,
      currentOwningPersonName: targetOwningPersonName,
      targetOwningPersonName: currentOwningPersonName,
      currentUsingPersonName: targetUsingPersonName,
      targetUsingPersonName: currentUsingPersonName,
    };
    const data = [item, exchangedItem];
    delete data[1].handoverDetailId;
    const newList = lineList.map(i =>
      lineDetail[0].handoverLineId === i.handoverLineId ? { ...i, detailList: data } : i
    );
    dispatch({
      type: 'assetHandover/updateState',
      payload: {
        lineList: newList,
      },
    });
    this.setState({
      lineDetail: [...data],
      executeData: { ...executeData, detailList: [...data] },
      returnFlag: true,
    });
  }

  /**
   * 获取动态字段
   */
  @Bind()
  handleGetFields(transferTypeRes) {
    const {
      dispatch,
      tenantId,
      assetHandover: { transferType = {} },
    } = this.props;
    const { basicAssetColumnList = [], trackingManagementColumnList = [] } =
      transferTypeRes || transferType;
    const tempBasicList = isNull(basicAssetColumnList) ? [] : basicAssetColumnList;
    const tempTrackList = isNull(trackingManagementColumnList) ? [] : trackingManagementColumnList;
    const tempList = [...tempBasicList, ...tempTrackList];
    const submitList = [];
    const newList = [];
    tempList.forEach(item => {
      if (item.lovType === 'Lov') {
        dispatch({
          type: 'assetHandover/fetchDynamicLov',
          payload: {
            viewCode: item.lovName,
          },
        }).then(res => {
          if (res) {
            newList.push({ ...item, displayField: res.displayField });
          } else {
            newList.push(item);
          }
        });
      } else if (item.lovType === 'ValueList') {
        const { valuesList } = this.state;
        dispatch({
          type: 'assetHandover/fetchDynamicValueList',
          payload: {
            tenantId,
            lovCode: item.lovName,
          },
        }).then(res => {
          if (res) {
            const newValueList = {
              tag: item.fieldColumn,
              lovList: res.lovCode,
            };
            this.setState({ valuesList: [...valuesList, newValueList] });
          }
        });
        newList.push(item);
      } else {
        newList.push(item);
      }
      submitList.push({
        fieldType: item.fieldType,
        currentTableName: 'aafm_asset',
        currentColumnName: item.fieldColumn,
        currentColumnValue: null,
        targetColumnType: item.lovType,
        targetColumnValue: null,
        orderTypeCode: transferType.basicTypeCode,
        _tag: item.fieldId,
      });
    });
    this.setState({
      dynamicFields: newList,
      submitDynamics: submitList,
    });
  }
  /**
   * 通过事物类型id查询动态字段
   */
  @Bind()
  handleGetFieldsByTransactionType(transactionTypeId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetHandover/fetchTransactionTypeLine',
      payload: {
        tenantId,
        transactionTypeId,
      },
    }).then(res => {
      this.handleGetFields(res);
    });
  }

  /**
   * 提交
   */
  @Bind()
  handleSubmit() {
    const {
      dispatch,
      tenantId,
      match,
      assetHandover: { detail, lineList },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newList = [];
        lineList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        const newLineList = newList.map(item =>
          item._status === 'create'
            ? omit(item, ['_status', 'handoverLineId'])
            : omit(item, ['_status'])
        );
        let temp = {};
        const data = newLineList.map(item => {
          if (item.detailList) {
            const {
              // detailList无用数据太多，只提取需要的数据保存
              assetId,
              processStatus,
              currentAssetStatusId,
              targetAssetStatusId,
              currentOwningPersonId,
              targetOwningPersonId,
              currentUsingPersonId,
              targetUsingPersonId,
              description,
              handoverTypeCode,
              handoverLineId,
              _status,
              _token,
              objectVersionNumber,
              dynamicColumnList,
            } = item.detailList[0];
            temp = {
              assetId,
              processStatus,
              currentAssetStatusId,
              targetAssetStatusId,
              currentOwningPersonId,
              targetOwningPersonId,
              currentUsingPersonId,
              targetUsingPersonId,
              description,
              handoverTypeCode,
              handoverLineId,
              _status,
              _token,
              objectVersionNumber,
              dynamicColumnList,
            };
          }
          if (temp && temp._status === 'create') {
            delete temp.handoverLineId;
            delete temp._token;
            delete temp.objectVersionNumber;
          }
          return { ...item, detailList: [temp] };
        });
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'assetHandover/submitAssetHandover',
            payload: {
              tenantId,
              data: {
                tenantId,
                ...values,
                lineList: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/asset-handover/detail/${res.handoverHeaderId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'assetHandover/submitAssetHandover',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                lineList: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
            }
          });
        }
      }
    });
  }
  /**
   * 编辑
   */
  @Bind()
  handleEdit() {
    const { editControl } = this.state;
    this.setState({ editControl: !editControl });
  }
  /**
   * 搜索区域隐藏显示
   */
  @Bind()
  setShowSearchFlag() {
    const { showSearchFlag } = this.state;
    const reShowSearchFlag = !showSearchFlag;
    this.setState({ showSearchFlag: reShowSearchFlag });
  }

  render() {
    const {
      editControl,
      showSearchFlag,
      defaultItem,
      modalVisible,
      drawerVisible,
      isMulti,
      lineDetail,
      returnFlag,
      dynamicFields,
      valuesList,
      selectedRowKeys = [],
    } = this.state;
    const { loading, match, tenantId, assetHandover, dispatch } = this.props;
    const { id } = match.params;
    const isNew = !isUndefined(id);
    const {
      detail,
      fullList,
      fullPagination,
      processStatusHeaderMap = [],
      processStatusLineMap = [],
      assetList = [],
      assetPagination = {},
      lineList = [],
      dynamicFieldsData = [],
    } = assetHandover;
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      isNew,
      tenantId,
      loading,
      isMulti,
      dispatch,
      editControl,
      dynamicFields,
      selectedRowKeys,
      modalVisible,
      drawerVisible,
      processStatusHeaderMap,
      assetList,
      assetPagination,
      lineList,
      lineDetail,
      returnFlag,
      valuesList,
      processStatusLineMap,
      dynamicFieldsData,
      dataSource: isUndefined(id) ? defaultItem : detail,
      onSelectRow: this.handleSelectRow,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onShowAssetModal: this.handleShowAssetModal,
      onSearchAsset: this.handleSearchAsset,
      onModalCancel: this.handleModalCancel,
      onAssetModalOk: this.handleAssetModalOk,
      onDrawerCancel: this.handleDrawerCancel,
      onEdit: this.handleShowDrawer,
      onDrawerOk: this.handleDrawerOk,
      onExecute: this.handleExecute,
      onDelete: this.handleDelete,
      onHandoverReturn: this.handleHandoverReturn,
      onGetFieldsByTransactionType: this.handleGetFieldsByTransactionType,
      key: id,
    };
    const editFlag = detail.processStatus !== 'NEW' && !isUndefined(id);
    const displayFlag = !isNew || editControl ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editControl || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editControl ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editControl ? { display: 'none' } : { display: 'block' };
    const displayCommitBtn = editControl ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`aatn.assetHandover.view.message.detail.title`).d('资产移交归还单明细')}
          backPath="/aatn/asset-handover/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            disabled={editFlag}
            loading={loading.save}
            onClick={this.handleSave}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button
            icon="select"
            style={displayCommitBtn}
            disabled={editFlag}
            loading={loading.submit}
            onClick={this.handleSubmit}
          >
            {intl.get('hzero.common.button.post').d('提交')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['asset-handover-detail'])}>
            <Row>
              <Col style={displayFullFlag} span={isUndefined(id) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col style={displayFlag} span={isUndefined(id) ? 0 : 1}>
                <Icon
                  type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                  onClick={this.setShowSearchFlag}
                  style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                >
                  {intl.get(`hero.common.click.menu`).d('')}
                </Icon>
              </Col>
              <Col span={isUndefined(id) ? 24 : editControl ? 23 : showSearchFlag ? 17 : 23}>
                <Spin
                  spinning={isUndefined(id) ? false : loading.detail}
                  wrapperClassName={classNames(
                    styles['asset-handover-detail'],
                    DETAIL_DEFAULT_CLASSNAME
                  )}
                >
                  <InfoExhibit {...infoProps} />
                </Spin>
              </Col>
            </Row>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
