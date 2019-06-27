/**
 * FunctionList - 功能清单
 * @date: 2019-2-20
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import { isEmpty, isUndefined } from 'lodash';
import { Button, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ functionList, loading }) => ({
  functionList,
  tenantId: getCurrentOrganizationId(),
  loading: {
    searchLoading: loading.effects['functionList/queryFunctionList'],
    saveLoading: loading.effects['functionList/saveData'],
  },
}))
class FunctionList extends Component {
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
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'functionList/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch();
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'functionList/queryFunctionList',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * 保存
   */
  @Bind()
  handleDataSave() {
    const {
      dispatch,
      tenantId,
      functionList: { list },
    } = this.props;
    const functionLines = list.filter(i => ['update', 'create'].includes(i._status));
    const data = getEditTableData(functionLines, ['functionId']);
    if (Array.isArray(data) && data.length > 0) {
      dispatch({
        type: 'functionList/saveData',
        payload: {
          tenantId,
          data,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current, flag) {
    const {
      dispatch,
      functionList: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.functionId === current.functionId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'functionList/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 行 - 新增
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleAddLine() {
    const {
      dispatch,
      tenantId,
      functionList: { list },
    } = this.props;
    const newItem = {
      columnId: uuidv4(),
      tenantId,
      columnCode: '',
      _status: 'create',
    };
    dispatch({
      type: 'functionList/updateState',
      payload: {
        list: [newItem, ...list],
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const { dispatch, list } = this.props;
    const newList = list.filter(item => item.functionId !== current.functionId);
    dispatch({
      type: 'functionList/updateState',
      payload: {
        list: newList,
      },
    });
  }

  render() {
    const {
      loading,
      functionList: { list = [] },
      pagination = {},
      functionModuleMap = [],
      enableFlags = [],
    } = this.props;
    const filterProps = {
      functionModuleMap,
      enableFlags,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      functionModuleMap,
      loading: loading.saveLoading,
      dataSource: list,
      onEdit: this.handleEditLine,
      onCancel: this.handleCancelLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`aafm.assetStatus.view.message.title`).d('功能清单')}>
          <Button type="primary" icon="plus" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="primary" icon="save" loading={loading.save} onClick={this.handleDataSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Spin spinning={loading.searchLoading}>
            <ListTable {...listProps} />
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}

export default FunctionList;
