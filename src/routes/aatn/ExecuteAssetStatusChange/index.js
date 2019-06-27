/**
 * ExecuteAssetStatusChange - 资产状态信息变更单-处理
 * @date: 2019-3-28
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import TransactionDrawer from './TransactionDrawer';

@connect(({ executeAssetStatusChange, loading }) => ({
  executeAssetStatusChange,
  loading: {
    fetch: loading.effects['executeAssetStatusChange/fetchLineList'],
    execute: loading.effects['executeAssetStatusChange/execute'],
    detail: loading.effects['executeAssetStatusChange/fetchDynamicFields'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class ExecuteAssetStatusChange extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      lineDetail: {},
      drawerVisible: false,
      dynamicFields: [], // 需要展示的动态字段
      valuesList: [], // 下拉列表值集列表
    };
  }
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch();
    dispatch({ type: 'executeAssetStatusChange/fetchLov', payload: { tenantId } });
  }
  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'executeAssetStatusChange/fetchLineList',
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
        lineProcessStatus: 'UNPROCESSED',
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'executeAssetStatusChange/fetchTransactionTypeLine',
          payload: {
            tenantId,
            transactionTypeId: res.content[0].transactionTypeId,
          },
        });
      }
    });
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
      executeAssetStatusChange: { transferType },
    } = this.props;
    dispatch({
      type: 'executeAssetStatusChange/fetchDynamicFields',
      payload: {
        tenantId,
        orderHeaderId: record.changeHeaderId,
        orderLineId: record.changeLineId,
        orderTypeCode: transferType.basicTypeCode,
      },
    }).then(res => {
      if (res) {
        this.setState({
          drawerVisible: true,
          lineDetail: { ...record, dynamicColumnList: res },
        });
      } else {
        this.setState({
          drawerVisible: true,
          lineDetail: record,
        });
      }
    });

    this.handleGetFields();
  }
  /**
   * 滑窗关闭
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false });
  }
  /**
   * 获取动态字段
   */
  @Bind()
  handleGetFields() {
    const {
      dispatch,
      tenantId,
      executeAssetStatusChange: { transferType = {} },
    } = this.props;
    const { basicAssetColumnList = [], trackingManagementColumnList = [] } = transferType;
    const tempBasicList = isNull(basicAssetColumnList) ? [] : basicAssetColumnList;
    const tempTrackList = isNull(trackingManagementColumnList) ? [] : trackingManagementColumnList;
    const tempList = [...tempBasicList, ...tempTrackList];
    const submitList = [];
    const newList = [];
    tempList.forEach(item => {
      if (item.lovType === 'Lov') {
        dispatch({
          type: 'executeAssetStatusChange/fetchDynamicLov',
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
          type: 'executeAssetStatusChange/fetchDynamicValueList',
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
      this.setState({ dynamicFields: newList });
      submitList.push({
        currentTableName: 'aafm_asset',
        currentColumnName: item.fieldColumn,
        currentColumnValue: '',
        targetColumnType: item.lovType,
        targetColumnValue: '',
        orderTypeCode: transferType.basicTypeCode,
        _tag: item.fieldId,
      });
    });
  }

  /**
   * 执行处理
   */
  @Bind()
  handleExecute(current) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'executeAssetStatusChange/execute',
      payload: {
        tenantId,
        data: { ...current },
      },
    }).then(res => {
      if (res) {
        this.setState({
          lineDetail: res,
        });
        notification.success();
        this.handleSearch();
      }
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
   * @param {string} id - 头id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-status-change/detail/${id}`,
      })
    );
  }

  render() {
    const promptCode = 'aatn.executeAssetStatusChange';
    const {
      loading,
      tenantId,
      executeAssetStatusChange: {
        pagination = {},
        list = [],
        processStatusHeaderMap = [],
        processStatusLineMap = [],
        fieldTypeMap = [],
        dynamicFieldsData = [],
      },
    } = this.props;
    const { drawerVisible, dynamicFields, lineDetail, valuesList } = this.state;
    const filterProps = {
      tenantId,
      processStatusHeaderMap,
      processStatusLineMap,
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
      drawerVisible,
      dynamicFields,
      processStatusLineMap,
      fieldTypeMap,
      valuesList,
      dynamicFieldsData,
      dataSource: lineDetail,
      loading: loading.execute,
      detailLoading: loading.detail,
      title: intl.get('aatn.executeAssetStatusChange.view.drawerTitle').d('事务处理行'),
      onCancel: this.handleDrawerCancel,
      onExecute: this.handleExecute,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产状态信息变更')}>
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
export default ExecuteAssetStatusChange;
