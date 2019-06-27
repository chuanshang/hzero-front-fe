/**
 * AssetScop - 资产报废单
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
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
import intl from 'utils/intl';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getDateFormat } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ assetScrap, loading }) => ({
  assetScrap,
  loading: {
    fetch: loading.effects['assetScrap/fetchEquipmentAsset'],
    list: loading.effects['assetScrap/listAssetScrap'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class AssetScrap extends Component {
  form;
  componentDidMount() {
    const {
      tenantId,
      // location: { state: { _back } = {} },
      dispatch,
    } = this.props;
    this.handleSearch();
    dispatch({ type: 'assetScrap/fetchProcessStatusLov', payload: { tenantId } });
    dispatch({
      type: 'assetScrap/updateState',
      payload: {
        lineList: [],
      },
    });
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
      type: 'assetScrap/listAssetScrap',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
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
    const promptCode = 'aatn.assetScrap';
    const {
      loading,
      tenantId,
      assetScrap: { pagination = {}, list = [], processStatusHeaderMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      processStatusHeaderMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: loading.list,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleGotoDetail,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产报废单')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/scrap/export`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default AssetScrap;
