/**
 * TransferOrder - 调拨转移单 入口&&处理
 * @date: 2019-04-02
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import { Spin } from 'hzero-ui';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import { routerRedux } from 'dva/router';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

@connect(({ transferOrder, loading }) => ({
  transferOrder,
  loading: loading.effects['transferOrder/fetchTransferOrderLine'],
  drawerLoading:
    loading.effects['transferOrder/fetchTransactionTypeLine'] ||
    loading.effects['transferOrder/fetchDynamicValueListLov'] ||
    loading.effects['transferOrder/fetchDynamicLov'] ||
    loading.effects['transferOrder/searchEquipmentAssetDetail'],
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
      dynamicLovDisplayFieldList: [], // lov显示字段描述名
      dynamicSelectLovList: [], // 动态字段下拉列表值集数组
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      location: { state: { _back } = {} },
      transferOrder: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({ type: 'transferOrder/fetchLov', payload: { tenantId } });
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
      type: 'transferOrder/fetchTransferOrderLine',
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
  handleTransferOrderDetail(transferHeaderId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/aatn/transfer-order/detail/${transferHeaderId}` }));
  }

  /**
   * 调入/调出
   */
  @Bind()
  handleChangeLineStatus(current = {}) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'transferOrder/confirmTransferOrderLine',
      payload: {
        tenantId,
        data: { tenantId, ...current },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }
  /**
   * 查询事务处理行
   */
  @Bind()
  fetchTransactionTypeLine(transactionTypeId) {
    const { tenantId, dispatch } = this.props;
    if (transactionTypeId) {
      dispatch({
        type: 'transferOrder/fetchTransactionTypeLine',
        payload: {
          tenantId,
          transactionTypeId,
        },
      }).then(r => {
        r.forEach(item => {
          if (item.lovType === `Lov` || item.lovType === `ValueList`) {
            this.selectLovDisplayField(item.lovName, item.lovType);
          }
        });
      });
    }
  }

  /**
   * 查询Lov的显示描述值 dynamicLovDisplayFieldList
   */
  @Bind()
  selectLovDisplayField(lovCode, lovType) {
    const { dispatch, tenantId } = this.props;
    const { dynamicLovDisplayFieldList = [] } = this.state;

    // 如果为列表值集，查询所有数据保存在dynamicSelectLovList中
    if (lovType === `ValueList`) {
      dispatch({
        type: 'transferOrder/fetchDynamicValueListLov',
        payload: { lovCode, tenantId },
      }).then(res => {
        if (res) {
          const { dynamicSelectLovList = [] } = this.state;
          const newValueList = {
            lovCode,
            lovList: res.lovCode,
          };
          this.setState({ dynamicSelectLovList: [...dynamicSelectLovList, newValueList] });
        }
      });
    } else {
      // 查询Lov的显示字段名等信息
      dispatch({
        type: 'transferOrder/fetchDynamicLov',
        payload: {
          viewCode: lovCode,
        },
      }).then(res => {
        if (res) {
          const currentLovList = dynamicLovDisplayFieldList.filter(
            item => item.lovCode !== res.lovCode
          );
          this.setState({ dynamicLovDisplayFieldList: [...currentLovList, res] });
        }
      });
    }
  }
  /**
   * 编辑行信息
   */
  @Bind()
  handleEditLine(record, clickFlag) {
    const { dispatch, tenantId } = this.props;
    const { assetId, description } = record;
    let temp = {};
    // 增加动态字段展示
    this.fetchTransactionTypeLine(record.transactionTypeId);
    // 查询已经保存的动态字段
    dispatch({
      type: 'transferOrder/fetchDynamicColumnLine',
      payload: {
        tenantId,
        orderLineId: record.transferLineId,
        orderHeaderId: record.transferHeaderId,
        orderTypeCode: 'TRANSFER',
      },
    });
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
    const promptCode = 'aatn.transferOrder';
    const {
      drawerLoading,
      loading,
      tenantId,
      transferOrder: {
        detailList = [],
        approveStatus = [],
        detailPagination = {},
        transferOrderLineStatus = [],
        transferTypeList,
        transactionTypeList,
        dynamicColumn,
      },
    } = this.props;
    const { drawerVisible, item, dynamicLovDisplayFieldList, dynamicSelectLovList } = this.state;
    const filterProps = {
      tenantId,
      approveStatus,
      transferOrderLineStatus,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      loading,
      dataSource: detailList,
      pagination: detailPagination,
      onSearch: this.handleSearch,
      onEditLine: this.handleEditLine,
      onCheckLine: this.handleCheckLine,
      onLinkToDetail: this.handleTransferOrderDetail,
      onChangeLineStatus: this.handleChangeLineStatus,
    };
    const drawerProps = {
      tenantId,
      drawerVisible,
      lineDetail: item,
      dynamicLovDisplayFieldList,
      dynamicSelectLovList,
      transferTypeList,
      transactionTypeList,
      dynamicColumn,
      onCancel: this.handleCloseDrawer,
      onChangeLineStatus: this.handleChangeLineStatus,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('调拨转移单-处理')}>
          <React.Fragment />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <Spin spinning={drawerVisible && drawerLoading}>
            <Drawer {...drawerProps} />
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
export default List;
