/**
 * Acceptance - 验收单
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
import ExcelExport from 'components/ExcelExport';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ acceptance, loading }) => ({
  acceptance,
  loading: {
    list: loading.effects['acceptance/listAcceptance'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Acceptance extends Component {
  form;

  componentDidMount() {
    const {
      tenantId,
      dispatch,
      location: { state: { _back } = {} },
    } = this.props;
    this.handleSearch();
    dispatch({ type: 'acceptance/fetchAcceptanceStatusLov', payload: { tenantId } });
    if (_back === -1) {
      dispatch({
        type: 'acceptance/updateState',
        payload: {
          fullList: [],
          fullPagination: {},
          deliveryList: [],
          deliveryPagination: {},
          detail: {},
          acceptanceLineList: [], // 验收单行信息列表
          acceptanceRelationList: [], // 验收单关联验收单行信息列表
          acceptanceAssetList: [], // 验收单资产明细行列表
        },
      });
    }
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
      type: 'acceptance/listAcceptance',
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
        pathname: `/arcv/acceptance/${linkUrl}`,
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
    const promptCode = 'arcv.acceptance';
    const {
      loading,
      tenantId,
      acceptance: { pagination = {}, list = [], AcceptanceStatusLovMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      AcceptanceStatusLovMap,
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
        <Header title={intl.get(`${promptCode}.view.message.title`).d('验收单')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/acceptance-headers/export`}
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
export default Acceptance;
