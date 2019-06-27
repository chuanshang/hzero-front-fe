/**
 * DynamicColumn - 动态字段
 * @date: 2019-04-02
 * @author: DT <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';
import ListTable from './ListTable';

@formatterCollections({ code: ['aafm.dynamicColumn', 'aafm.common'] })
@connect(({ loading, dynamicColumn }) => ({
  dynamicColumn,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetch: loading.effects['dynamicColumn/fetchDynamicColumnList'],
    saveDynamicColumn: loading.effects['dynamicColumn/saveDynamicColumn'],
    deleteDynamicColumn: loading.effects['dynamicColumn/deleteDynamicColumn'],
  },
}))
class DynamicColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch(); // 初始数据加载
    dispatch({ type: 'dynamicColumn/fetchLov', payload: { tenantId } });
  }

  // 查询
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'dynamicColumn/fetchDynamicColumnList',
      payload: {
        tenantId,
      },
    });
  }
  // 新建
  @Bind()
  handleNewLine() {
    const { dispatch, tenantId, dynamicColumn } = this.props;
    const { list } = dynamicColumn;
    const newItem = {
      columnId: uuidv4(),
      tenantId,
      columnCode: '',
      columnName: '',
      columnClass: '',
      descCode: '',
      descSourceType: '',
      descSource: '',
      lovName: '',
      lovType: '',
      _status: 'create',
    };
    dispatch({
      type: 'dynamicColumn/updateState',
      payload: {
        list: [...list, newItem],
      },
    });
  }

  @Bind()
  handleSaveData() {
    const {
      dispatch,
      tenantId,
      dynamicColumn: { list = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(list, ['columnId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'dynamicColumn/saveDynamicColumn',
        payload: {
          tenantId,
          data: params,
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
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      dynamicColumn: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.columnId === current.columnId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'dynamicColumn/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      dynamicColumn: { list = [] },
    } = this.props;
    const newList = list.filter(item => item.columnId !== current.columnId);
    dispatch({
      type: 'dynamicColumn/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleDeleteContent(record) {
    const { dispatch, tenantId } = this.props;
    const { $form, _status, ...otherProps } = record;
    dispatch({
      type: 'dynamicColumn/deleteDynamicColumn',
      payload: { tenantId, ...otherProps },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  render() {
    const { loading, tenantId, dynamicColumn = [] } = this.props;
    const { list, pagination, descSourceTypeMap, columnClassMap, lovTypeMap } = dynamicColumn;
    const listProps = {
      tenantId,
      pagination,
      descSourceTypeMap,
      columnClassMap,
      lovTypeMap,
      loading: loading.fetch,
      dataSource: list,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onDeleteLine: this.handleDeleteContent,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('aafm.dynamicColumn.view.message.title.list').d('动态字段')}>
          <Button icon="plus" type="primary" onClick={this.handleNewLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="save" onClick={this.handleSaveData}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default DynamicColumn;
