/**
 * AssetStatusChange - 资产状态信息变更单
 * @date: 2019-3-28
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ assetStatusChange, loading }) => ({
  assetStatusChange,
  loading: {
    fetch: loading.effects['assetStatusChange/fetchHeaderList'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class AssetStatusChange extends Component {
  form;
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      assetStatusChange: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({ type: 'assetStatusChange/fetchLov', payload: { tenantId } });
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
      type: 'assetStatusChange/fetchHeaderList',
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
   * 页面跳转
   * @param {string} id - 头id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    if (isUndefined(id)) {
      dispatch({
        type: 'assetStatusChange/updateState',
        payload: {
          changeOrderLines: [],
        },
      });
    }
    dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-status-change/${linkUrl}`,
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
    const promptCode = 'aatn.assetStatusChange';
    const {
      loading,
      tenantId,
      assetStatusChange: { pagination = {}, list = [], processStatusHeaderMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      processStatusHeaderMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: loading.fetch,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleGotoDetail,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产状态信息变更')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/change/export`}
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
export default AssetStatusChange;
