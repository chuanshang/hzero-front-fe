/**
 * ExecuteAssetHandover - 资产移出归还单- 处理
 * @date: 2019-3-21
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import TransactionDrawer from './TransactionDrawer';

@connect(({ executeAssetHandover, loading }) => ({
  executeAssetHandover,
  loading: {
    fetch: loading.effects['executeAssetHandover/fetchAssetHandover'],
    line:
      loading.effects['executeAssetHandover/fetchAssetHandoverDetail'] ||
      loading.effects['executeAssetHandover/fetchDynamicFields'] ||
      loading.effects['executeAssetHandover/fetchTransactionTypeLine'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class ExecuteAssetHandover extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      lineDetail: {},
      drawerVisible: false,
      dynamicFields: [], // 需要展示的动态字段
      executeData: {}, // 执行处理提交的数据
      returnFlag: false, // 移交归还flag
    };
  }
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      executeAssetHandover: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({ type: 'executeAssetHandover/fetchLov', payload: { tenantId } });
  }
  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    // states 初始化
    this.setState({
      lineDetail: {},
      drawerVisible: false,
      dynamicFields: [], // 需要展示的动态字段
      executeData: {}, // 执行处理提交的数据
      returnFlag: false, // 移交归还flag
    });
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'executeAssetHandover/fetchAssetHandover',
      payload: {
        tenantId,
        ...filterValues,
        planStartDateFrom: filterValues.planStartDateFrom
          ? moment(filterValues.planStartDateFrom).format(getDateTimeFormat())
          : null,
        planStartDateTo: filterValues.planStartDateTo
          ? moment(filterValues.planStartDateTo).format(getDateTimeFormat())
          : null,
        planEndDateFrom: filterValues.planEndDateFrom
          ? moment(filterValues.planEndDateFrom).format(getDateTimeFormat())
          : null,
        planEndDateTo: filterValues.planEndDateTo
          ? moment(filterValues.planEndDateTo).format(getDateTimeFormat())
          : null,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 弹出行明细滑窗
   * @param {object} record 行记录
   */
  @Bind()
  handleShowDrawer(record) {
    this.setState({ drawerVisible: true });
    const { tenantId, dispatch } = this.props;
    let lineData = record;
    // 查询事务类型
    dispatch({
      type: 'executeAssetHandover/fetchTransactionTypeLine',
      payload: {
        tenantId,
        transactionTypeId: record.transactionTypeId,
      },
    }).then(transferType => {
      if (transferType) {
        // 查询需要展示的动态字段 dynamicFields
        const { basicAssetColumnList = [], trackingManagementColumnList = [] } = transferType;
        const tempBasicList = isNull(basicAssetColumnList) ? [] : basicAssetColumnList;
        const tempTrackList = isNull(trackingManagementColumnList)
          ? []
          : trackingManagementColumnList;
        const tempList = [...tempBasicList, ...tempTrackList];
        // 通过行中的 handoverHeaderId 获取明细信息并通过 handoverLineId 从中筛选当前行
        dispatch({
          type: 'executeAssetHandover/fetchAssetHandoverDetail',
          payload: {
            tenantId,
            handoverHeaderId: record.handoverHeaderId,
          },
        }).then(headerDetail => {
          if (headerDetail) {
            lineData =
              headerDetail.lineList.filter(
                item => item.handoverLineId === record.handoverLineId
              )[0] || record;
          }
          // 查询动态字段
          if (!isNull(lineData.detailList)) {
            dispatch({
              type: 'executeAssetHandover/fetchDynamicFields',
              payload: {
                tenantId,
                orderHeaderId: lineData.handoverLineId,
                orderLineId: lineData.detailList[0].handoverDetailId,
                orderTypeCode: transferType.basicTypeCode,
              },
            }).then(dynamicFieldsData => {
              let newDetailList = lineData.detailList;
              if (dynamicFieldsData) {
                // 往lineDetail里插入动态字段数据
                newDetailList = lineData.detailList.map(item => {
                  const dynamicColumnList = [];
                  dynamicFieldsData.forEach(element => {
                    if (item.handoverDetailId === element.orderLineId) {
                      dynamicColumnList.push(element);
                    }
                  });
                  return { ...item, dynamicColumnList };
                });
              }
              this.setState({
                dynamicFields: tempList,
                lineDetail: newDetailList,
                executeData: { ...lineData, detailList: newDetailList },
              });
            });
          } else {
            this.setState({
              dynamicFields: tempList,
              lineDetail: lineData.detailList,
              executeData: lineData,
            });
          }
        });
      }
    });
  }
  /**
   * 滑窗关闭
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({
      drawerVisible: false,
      lineDetail: {},
      dynamicFields: [], // 需要展示的动态字段
      executeData: {}, // 执行处理提交的数据
      returnFlag: false, // 移交归还flag
    });
  }

  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  /**
   * 页面跳转
   * @param {string} id - 移交归还单头id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
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
      type: 'executeAssetHandover/executeAssetHandover',
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
  handleHandoverReturn(dynamicFieldsData) {
    // const {
    //   dispatch,
    //   executeAssetHandover: { lineList },
    // } = this.props;
    const { lineDetail, executeData } = this.state;
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
    // const newList = lineList.map(
    //   i => (lineDetail[0].handoverLineId === i.handoverLineId ? { ...i, detailList: data } : i)
    // );
    // dispatch({
    //   type: 'executeAssetHandover/updateState',
    //   payload: {
    //     lineList: newList,
    //   },
    // });
    this.setState({
      lineDetail: [...data],
      executeData: { ...executeData, detailList: [...data] },
      returnFlag: true,
    });
  }
  render() {
    const promptCode = 'aatn.executeAssetHandover';
    const { drawerVisible, dynamicFields, lineDetail, returnFlag } = this.state;
    const {
      loading,
      tenantId,
      executeAssetHandover: {
        pagination = {},
        list = [],
        processStatusHeaderMap = [],
        processStatusLineMap = [],
        dynamicFieldsData = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      processStatusLineMap,
      processStatusHeaderMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: loading.fetch,
      dataSource: list,
      onSearch: this.handleSearch,
      onShowDrawer: this.handleShowDrawer,
      onGotoDetail: this.handleGotoDetail,
    };
    const transactionDrawerProps = {
      tenantId,
      returnFlag,
      drawerVisible,
      dynamicFields,
      processStatusLineMap,
      lineDetail,
      dynamicFieldsData,
      lineLoading: loading.line,
      loading: loading.execute,
      title: intl.get('aatn.assetStatusChange.view.drawerTitle').d('事务处理行'),
      onCancel: this.handleDrawerCancel,
      onExecute: this.handleExecute,
      onHandoverReturn: this.handleHandoverReturn,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产移交归还单')}>
          <React.Fragment />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <TransactionDrawer {...transactionDrawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default ExecuteAssetHandover;
