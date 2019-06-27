/*
 * 物料
 * @date: 2019/4/28
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
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import { isUndefined } from 'lodash';

import ListTable from './ListTable';

import FilterForm from './FilterForm';

// dva连接
@connect(({ materialTsType, loading }) => ({
  materialTsType,
  tenantId: getCurrentOrganizationId(),
  materialTsTypeListLoading: loading.effects['materialTsType/fetchMaterialTsTypeList'],
  createOrUpdateMaterialTsTypeLoading:
    loading.effects['materialTsType/createOrUpdateMaterialTsType'],
  toggleMaterialTsTypeLoading: loading.effects['materialTsType/toggleMaterialTsType'],
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
      materialTsType: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? { page: pagination } : {};
    this.fetchMaterialTsTypeList(page);
  }

  @Bind()
  handleRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  fetchMaterialTsTypeList(params = {}) {
    const {
      materialTsType: { pagination = {} },
    } = this.props;
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'materialTsType/fetchMaterialTsTypeList',
      payload: {
        tenantId,
        ...filterValues,
        page: pagination,
        ...params,
      },
    });
  }

  /**
   * 启用禁用
   */
  @Bind()
  handleToggleMaterialTsType({ enabledFlag, productId }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialTsType/toggleMaterialTsType',
      payload: {
        enabledFlag,
        productId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchMaterialsList();
      }
    });
  }

  /**
   * 分页
   */
  @Bind()
  handleStandardTableChange(pagination) {
    this.fetchMaterialsList({
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
    dispatch(routerRedux.push({ pathname: `/ammt/material_ts_type/create` }));
  }

  /**
   * 编辑
   * 跳转到编辑页面
   */
  @Bind()
  handleEditMaterialTsType(id) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/ammt/material_ts_type/detail/${id}` }));
  }

  render() {
    const {
      materialTsType: { materialTsTypeList, pagination = {} },
      materialTsTypeListLoading,
    } = this.props;
    const listProp = {
      loading: materialTsTypeListLoading,
      pagination: { ...pagination, pageSizeOptions: ['5', '10', '15', '20'] },
      dataSource: materialTsTypeList,
      onToggleMaterialTsType: this.handleToggleMaterialTsType,
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
              <FilterForm onRef={this.handleRef} onSearch={this.fetchMaterialTsTypeList} />
            </div>
            <ListTable {...listProp} />
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
