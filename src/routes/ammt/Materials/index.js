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
@connect(({ materials, loading }) => ({
  materials,
  tenantId: getCurrentOrganizationId(),
  materialsListLoading: loading.effects['materials/fetchMaterialList'],
  toggleMaterialsLoading: loading.effects['materials/toggleMaterial'],
}))
export default class Materials extends Component {
  form;
  constructor(props) {
    super(props);
    // 父组件给子组件使用
    this.state = {
      modalVisible: false,
      StuffFormData: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    const {
      materials: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? { page: pagination } : {};
    this.fetchMaterialsList(page);
  }

  @Bind()
  handleRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  @Bind()
  fetchMaterialsList(params = {}) {
    const {
      materials: { pagination = {} },
    } = this.props;
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'materials/fetchMaterialList',
      payload: {
        tenantId,
        ...filterValues,
        page: pagination,
        ...params,
      },
    });
  }

  /**
   * 启用禁用物料
   */
  @Bind()
  handleToggleMaterial({ enabledFlag, itemId }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/toggleMaterial',
      payload: {
        enabledFlag,
        itemId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchMaterialsList();
      }
    });
  }
  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ ...this.state, selectedRowKeys, selectedRows });
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
    dispatch(routerRedux.push({ pathname: `/ammt/materials/create` }));
  }

  /**
   * 编辑
   * 跳转到编辑页面
   */
  @Bind()
  handleEditMaterials(id) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/ammt/materials/detail/${id}` }));
  }

  render() {
    const {
      materials: { materialsList, pagination = {} },
      materialsListLoading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const listProp = {
      selectedRowKeys,
      loading: materialsListLoading,
      pagination: { ...pagination, pageSizeOptions: ['5', '10', '15', '20'] },
      dataSource: materialsList,
      onSelectRow: this.handleSelectRow,
      onToggleMaterial: this.handleToggleMaterial,
      handleStandardTableChange: this.handleStandardTableChange,
      onEditMaterials: this.handleEditMaterials,
    };
    return (
      <Fragment>
        <Header title="物料">
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Spin
            spinning={
              isUndefined(this.props.toggleMaterialsLoading)
                ? false
                : this.props.toggleMaterialsLoading
            }
          >
            <div className="table-list-search">
              <FilterForm onRef={this.handleRef} onSearch={this.fetchMaterialsList} />
            </div>
            <ListTable {...listProp} />
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
