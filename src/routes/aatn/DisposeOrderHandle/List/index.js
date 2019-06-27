/**
 * DisposeOrder - 资产处置单 入口&&处理
 * @date: 2019-04-03
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import { routerRedux } from 'dva/router';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

@connect(({ disposeOrder, loading }) => ({
  disposeOrder,
  loading: {
    fetchLoading: loading.effects['disposeOrder/fetchDisposeOrderLine'],
    confirmLoading: loading.effects['disposeOrder/disposeOrderConfirm'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class List extends Component {
  form;
  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {
      dateTimeFormat: getDateTimeFormat(),
      drawerVisible: false,
      item: {},
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      location: { state: { _back } = {} },
      disposeOrder: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({
      type: 'disposeOrder/fetchAssetStatus',
      payload: { tenantId, assetStatusCode: 'DISPOSED' },
    });
    dispatch({ type: 'disposeOrder/fetchLov', payload: { tenantId } });
  }

  /**
   * 数据查询
   * @param {object} page - 查询查询
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const { dateTimeFormat } = this.state;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'disposeOrder/fetchDisposeOrderLine',
      payload: {
        tenantId,
        ...fieldValues,
        planStartDateFrom: isUndefined(fieldValues.planStartDateFrom)
          ? ''
          : moment(fieldValues.planStartDateFrom).format(dateTimeFormat),
        planStartDateTo: isUndefined(fieldValues.planStartDateTo)
          ? ''
          : moment(fieldValues.planStartDateTo).format(dateTimeFormat),
        planEndDateFrom: isUndefined(fieldValues.planEndDateFrom)
          ? ''
          : moment(fieldValues.planEndDateFrom).format(dateTimeFormat),
        planEndDateTo: isUndefined(fieldValues.planEndDateTo)
          ? ''
          : moment(fieldValues.planEndDateTo).format(dateTimeFormat),
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  @Bind()
  handleDisposeOrderDetail(disposeHeaderId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/aatn/dispose-order/detail/${disposeHeaderId}` }));
  }

  /**
   * 处置
   */
  @Bind()
  handleChangeLineStatus(current = {}) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'disposeOrder/disposeOrderConfirm',
      payload: {
        tenantId,
        data: { tenantId, ...current },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
        this.setState({ drawerVisible: false });
      }
    });
  }
  /**
   * 编辑行信息
   */
  @Bind()
  handleEditLine(record, clickFlag) {
    const { dispatch, tenantId } = this.props;
    const { assetId, description } = record;
    let temp = {};
    dispatch({
      type: 'disposeOrder/searchEquipmentAssetDetail',
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
          targetAssetStatusId: record.targetAssetStatusId,
          targetAssetStatusName: record.targetAssetStatusName,
        };
      } else {
        temp = {
          ...record,
          targetAssetStatusId: record.targetAssetStatusId,
          targetAssetStatusName: record.targetAssetStatusName,
        };
      }
      this.setState({ drawerVisible: true, item: temp });
    });
  }

  /**
   * 关闭行信息
   */
  @Bind()
  handleCloseDrawer() {
    this.setState({ drawerVisible: false });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'aatn.disposeOrder';
    const {
      loading,
      tenantId,
      disposeOrder: {
        assetStatus = {},
        detailList = [],
        approveStatus = [],
        detailPagination = {},
        disposeLineStatus = [],
      },
    } = this.props;
    const { drawerVisible, item } = this.state;
    const filterProps = {
      tenantId,
      approveStatus,
      disposeLineStatus,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      loading: loading.fetchLoading,
      dataSource: detailList,
      pagination: detailPagination,
      onSearch: this.handleSearch,
      onEditLine: this.handleEditLine,
      onCheckLine: this.handleCheckLine,
      onLinkToDetail: this.handleDisposeOrderDetail,
      onChangeLineStatus: this.handleChangeLineStatus,
    };
    const drawerProps = {
      tenantId,
      drawerVisible,
      confirmLoading: loading.confirmLoading,
      lineDetail: item,
      defaultTargetAssetStatus: assetStatus,
      onCancel: this.handleCloseDrawer,
      onChangeLineStatus: this.handleChangeLineStatus,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产处置单-处理')}>
          <React.Fragment />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <Drawer {...drawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default List;
