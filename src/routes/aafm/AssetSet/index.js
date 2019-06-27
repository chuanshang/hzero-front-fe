/**
 * AssetSet - 资产组
 * @date: 2019-1-7
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 资产组列表页面入口
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {!Object} assetSet - 数据源
 * @reactProps {!object} loading - 数据加载是否完成
 * @reactProps {Function} [dispatch= e => e] - redux dispatch方法
 * @return React.element
 */
@connect(({ assetSet, loading }) => ({
  assetSet,
  loading: {
    fetch: loading.effects['assetSet/fetchAssetSet'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aafm.common', 'aafm.assetSet'],
})
class AssetSet extends Component {
  form;
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      assetSet: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = isUndefined(_back) ? {} : pagination;
    this.handleSearch(page);
    dispatch({ type: 'assetSet/fetchLov', payload: { tenantId } });
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
      type: 'assetSet/fetchAssetSet',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }
  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  /**
   * 创建
   */
  @Bind()
  handleAssetSet() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/assetSet/create`,
      })
    );
  }
  /**
   * 获取form数据
   */
  @Bind()
  handleGetFormValue() {
    const filterForm = this.form;
    const filterValues = isUndefined(filterForm)
      ? {}
      : filterNullValueObject(filterForm.getFieldsValue());
    return filterValues;
  }
  /**
   * 页面跳转
   * @param {string} assetsSetId - 资产组ID
   */
  @Bind()
  handleGoToDetail(assetsSetId) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/assetSet/detail/${assetsSetId}`,
      })
    );
  }
  render() {
    const {
      loading,
      tenantId,
      assetSet: { list = [], pagination = {}, specialAsset = [] },
    } = this.props;
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    const filterProps = {
      tenantId,
      specialAsset,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: loading.fetch,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleGoToDetail,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('aafm.assetSet.view.message.title').d('资产组')}>
          <Button icon="plus" type="primary" onClick={this.handleAssetSet}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/assets-set/export`}
            queryParams={exportParams}
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
export default AssetSet;
