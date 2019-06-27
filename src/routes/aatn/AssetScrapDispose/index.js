/**
 * AssetScopDispose - 资产报废单-处理
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import moment from 'moment';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getDateFormat } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import TransactionDrawer from './TransactionDrawer';

@connect(({ assetScrapDispose, loading }) => ({
  assetScrapDispose,
  loading: {
    list: loading.effects['assetScrapDispose/listAssetScrapDispose'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class AssetScrapDispose extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      lineData: [], // 当前行数据
      drawerVisible: false,
    };
  }

  componentDidMount() {
    const { tenantId } = this.props;
    this.props.dispatch({ type: 'assetScrapDispose/fetchProcessStatusLov', payload: { tenantId } });
    this.props.dispatch({
      type: 'assetScrapDispose/fetchScrapLineProcessStatusLov',
      payload: { tenantId },
    });
    this.props.dispatch({ type: 'assetScrapDispose/fetchDisposeTypeLov', payload: { tenantId } });
    this.props.dispatch({ type: 'assetScrapDispose/fetchScrapTypeLov', payload: { tenantId } });
    this.handleSearch();
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
      if (!isUndefined(filterValues.planStartDateFrom)) {
        filterValues = {
          ...filterValues,
          planStartDateFrom: moment(filterValues.planStartDateFrom).format(getDateFormat()),
        };
      }
      if (!isUndefined(filterValues.planStartDateTo)) {
        filterValues = {
          ...filterValues,
          planStartDateTo: moment(filterValues.planStartDateTo).format(getDateFormat()),
        };
      }
      if (!isUndefined(filterValues.planEndDateFrom)) {
        filterValues = {
          ...filterValues,
          planEndDateFrom: moment(filterValues.planEndDateFrom).format(getDateFormat()),
        };
      }
      if (!isUndefined(filterValues.planEndDateTo)) {
        filterValues = {
          ...filterValues,
          planEndDateTo: moment(filterValues.planEndDateTo).format(getDateFormat()),
        };
      }
    }
    dispatch({
      type: 'assetScrapDispose/listAssetScrapDispose',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }

  /**
   * 处理行
   */
  @Bind()
  handDisposeLine(lineId) {
    const {
      assetScrapDispose: { list = [] },
    } = this.props;
    const currentLineData = list.filter(item => item.scrapLineId === lineId)[0];
    this.setState({ lineData: currentLineData });
    this.setState({ drawerVisible: true });
  }

  /**
   * 处理侧滑窗关闭
   */
  @Bind()
  cancelDrawer() {
    this.setState({ drawerVisible: false });
  }

  /**
   * 报废处理行
   */
  @Bind()
  ConformLineDrawer(current = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetScrapDispose/confirmAssetScrapLine',
      payload: {
        tenantId,
        data: {
          ...current,
        },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.cancelDrawer();
        this.handleSearch();
      }
    });
  }

  /**
   * 页面跳转
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-scrap/${linkUrl}`,
      })
    );
  }

  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'aatn.assetScrapDispose';
    const {
      loading,
      tenantId,
      assetScrapDispose: {
        pagination = {},
        list = [],
        processStatusHeaderMap,
        scrapLineProcessStatusMap,
        scrapTypeMap = [],
        disposeTypeLovMap = [],
      },
    } = this.props;
    const { drawerVisible, lineData } = this.state;
    const filterProps = {
      processStatusHeaderMap,
      scrapLineProcessStatusMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      loading: loading.list,
      dataSource: list,
      pagination,
      onSearch: this.handleSearch,
      onDeal: this.handDisposeLine,
      onEdit: this.handleGotoDetail,
    };
    const transactionDrawerProps = {
      tenantId,
      lineData,
      drawerVisible,
      scrapTypeMap,
      disposeTypeLovMap,
      onCancel: this.cancelDrawer,
      onConformLine: this.ConformLineDrawer,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产报废单处理')} />
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <TransactionDrawer {...transactionDrawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default AssetScrapDispose;
