/**
 * Act - 资产路线
 * @date: 2019-5-10
 * @author: zzs <zhisheng.zhang@hand-china.com>
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
import ExcelExport from 'components/ExcelExport';
import { HALM_MTC } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ act, loading }) => ({
  act,
  loading: {
    list: loading.effects['act/listAct'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Act extends Component {
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
      dispatch,
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    if (_back === -1) {
      dispatch({
        type: 'act/updateState',
        payload: {
          list: [],
          pagination: {},
          detail: {},
          lineList: [],
        },
      });
    }
    this.handleSearch();
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
      type: 'act/listAct',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
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
        pathname: `/amtc/act/${linkUrl}`,
      })
    );
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'amtc.act';
    const {
      loading,
      tenantId,
      act: { list = [], pagination = {} },
    } = this.props;
    const filterProps = {
      tenantId,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
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
        <Header title={intl.get(`${promptCode}.view.message.title`).d('标准作业')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/act/export`}
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
export default Act;
