/*
 * 物料
 * @date: 2019/5/13
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Spin } from 'hzero-ui';
import { connect } from 'dva/index';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { routerRedux } from 'dva/router';
import { isUndefined } from 'lodash';

import ListTable from './ListTable';

import FilterForm from './FilterForm';

// dva连接
@connect(({ materialTsMulti, loading }) => ({
  materialTsMulti,
  tenantId: getCurrentOrganizationId(),
  materialTsMultiListLoading: loading.effects['materialTsMulti/fetchMaterialsTsMultiList'],
  createOrUpdateMaterialTsMultiLoading:
    loading.effects['materialTsMulti/createOrUpdateMaterialTsMulti'],
  toggleMaterialTsMultiLoading: loading.effects['materialTsMulti/toggleMaterialTsMulti'],
}))
export default class materialTsType extends Component {
  form;
  constructor(props) {
    super(props);
    // 父组件给子组件使用
    this.state = {};
  }

  componentDidMount() {
    const {
      materialTsMulti: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? { page: pagination } : {};
    this.fetchMaterialTsMultiList(page);
  }

  @Bind()
  handleRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  fetchMaterialTsMultiList(params = {}) {
    const {
      materialTsMulti: { pagination = {} },
    } = this.props;
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'materialTsMulti/fetchMaterialsTsMultiList',
      payload: {
        tenantId,
        ...filterValues,
        page: pagination,
        ...params,
      },
    });
  }

  /**
   * 分页
   */
  @Bind()
  handleStandardTableChange(pagination) {
    this.fetchMaterialTsMultiList({
      page: pagination,
    });
  }
  /**
   * 新增
   * 跳转到新增明细页
   */
  @Bind()
  handleAdd() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/ammt/material_ts_Multi/create` }));
  }

  /**
   * 编辑
   * 跳转到编辑页面
   */
  @Bind()
  handleEditMaterialTsType(id) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/ammt/material_ts_Multi/detail/${id}` }));
  }

  render() {
    const {
      materialTsMulti: { materialTsMultiList, pagination = {} },
      materialTsMultiListLoading,
    } = this.props;
    const listProp = {
      loading: materialTsMultiListLoading,
      pagination: { ...pagination, pageSizeOptions: ['10', '20', '50', '100'] },
      dataSource: materialTsMultiList,
      handleStandardTableChange: this.handleStandardTableChange,
      onEditMaterialTsType: this.handleEditMaterialTsType,
    };
    return (
      <Fragment>
        <Header title="物料事务类型">
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Spin
            spinning={
              isUndefined(this.props.toggleMaterialTsTypeLoading)
                ? false
                : this.props.toggleMaterialTsTypeLoading
            }
          >
            <div className="table-list-search">
              <FilterForm onRef={this.handleRef} onSearch={this.fetchMaterialTsMultiList} />
            </div>
            <ListTable {...listProp} />
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
