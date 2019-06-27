/**
 * AssetRoute - 资产路线
 * @date: 2019-4-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { routerRedux } from 'dva/router';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { HALM_MTC } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ assetRoute, loading }) => ({
  assetRoute,
  loading: loading.effects['assetRoute/queryAssetRouteList'],
  tenantId: getCurrentOrganizationId(),
}))
class AssetRoute extends Component {
  form;

  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      tenantId,
      dispatch,
      location: { state: { _back } = {} },
      assetRoute: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    dispatch({
      type: 'assetRoute/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch(page);
  }

  /**
   * 数据查询
   * @param {object} page - 查询查询
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'assetRoute/queryAssetRouteList',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * 跳转详情页面
   * @param assetrouteId
   */
  @Bind()
  handleAssetRouteDetail(assetRouteId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/asset-route/detail/${assetRouteId}` }));
  }

  /**
   * 新增信息
   */
  @Bind()
  handleAddAssetRoute() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/asset-route/create` }));
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 启用资产路线
   * @param faultdefectId
   */
  @Bind()
  handleEnabled(assetRouteId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetRoute/enabledAssetRoute',
      payload: { tenantId, assetHeaderId: assetRouteId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 禁用资产路线
   * @param faultdefectId
   */
  @Bind()
  handleDisabled(assetRouteId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetRoute/disabledAssetRoute',
      payload: { tenantId, assetHeaderId: assetRouteId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  render() {
    const promptCode = 'amtc.assetRoute';
    const {
      loading,
      tenantId,
      assetRoute: { list = [], pagination = {}, referenceModeMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      referenceModeMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      dataSource: list,
      onSearch: this.handleSearch,
      onEditLine: this.handleAssetRouteDetail,
      onDisabledLine: this.handleDisabled,
      onEnabledLine: this.handleEnabled,
    };
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产路线')}>
          <Button icon="plus" type="primary" onClick={this.handleAddAssetRoute}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/assetroute/export`}
            queryParams={fieldValues}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default AssetRoute;
