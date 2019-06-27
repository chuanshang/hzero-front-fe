/**
 * EquipmentAsset - 设备资产
 * @date: 2019-1-23
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button, notification, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ equipmentAsset, loading }) => ({
  equipmentAsset,
  loading: {
    fetch: loading.effects['equipmentAsset/fetchEquipmentAsset'],
    delete: loading.effects['equipmentAsset/deleteEquipmentAsset'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class EquipmentAsset extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }
  componentDidMount() {
    const {
      dispatch,
      tenantId,
      equipmentAsset: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    if (_back) {
      dispatch({
        type: 'equipmentAsset/updateState',
        payload: {
          attributeInfo: [], // 属性行
        },
      });
    }
    this.handleSearch(page);
    dispatch({ type: 'equipmentAsset/fetchLov', payload: { tenantId } });
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
      type: 'equipmentAsset/fetchEquipmentAsset',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
      },
    });
  }
  /**
   * 删除设备资产信息
   */
  @Bind()
  handleDelete() {
    const { dispatch, tenantId } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('aafm.common.view.message.confirm.delete').d('是否删除设备资产记录'),
      onOk: () => {
        dispatch({
          type: 'equipmentAsset/deleteEquipmentAsset',
          payload: {
            tenantId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }
        });
      },
    });
  }
  /**
   * 页面跳转
   * @param {string} id - 设备资产id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/equipment-asset/${linkUrl}`,
      })
    );
  }
  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }
  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
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
  render() {
    const promptCode = 'aafm.equipmentAsset';
    const { selectedRowKeys = [] } = this.state;
    const {
      loading,
      tenantId,
      equipmentAsset: { pagination, list = [], specialAsset = [], enumMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      specialAsset,
      enumMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: loading.fetch,
      dataSource: list,
      onSearch: this.handleSearch,
      onEdit: this.handleGotoDetail,
      onSelectRow: this.handleSelectRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('设备/资产')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={loading.delete}
            onClick={this.handleDelete}
            disabled={isEmpty(selectedRowKeys)}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default EquipmentAsset;
