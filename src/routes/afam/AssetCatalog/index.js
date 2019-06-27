/**
 * 资产目录创建/编辑-列表
 * @date: 2019-4-10
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { HALM_ATN } from '@/utils/config';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import { isUndefined } from 'lodash';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ assetCatalog, loading }) => ({
  assetCatalog,
  loading: {
    listLoading: loading.effects['assetCatalog/listAssetCatalog'],
    saveLoading: loading.effects['assetCatalog/saveAssetCatalog'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['afam.AssetCatalog', 'afam.common'] })
class AssetCatalog extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      isExpandAll: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleSearch();
    dispatch({ type: 'assetCatalog/fetchDepreciationTypeLov', payload: {} });
    dispatch({ type: 'assetCatalog/fetchAccountTypeLov', payload: {} });
  }
  /**
   * 根据节点路径，在树形结构树中的对应节点添加或替换children属性
   * @param {Array} collections 树形结构树
   * @param {Array} cursorPath 节点路径
   * @param {Array} data  追加或替换的children数据
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, cursorPath = [], data) {
    let newCursorList = cursorPath;
    const cursor = newCursorList[0];
    const tree = collections.map(n => {
      const m = n;
      if (m.assetCatalogId === cursor) {
        if (newCursorList[1]) {
          if (!m.children) {
            m.children = [];
          }
          newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
          m.children = this.findAndSetNodeProps(m.children, newCursorList, data);
        } else {
          m.children = [...data];
        }
        if (m.children.length === 0) {
          const { children, ...others } = m;
          return { ...others };
        } else {
          return m;
        }
      }
      return m;
    });
    return tree;
  }
  /**
   * 根据节点路径，在树形结构树中的对应节点
   * @param {Array} collection 树形结构树
   * @param {Array} cursorList 节点路径
   * @param {String} keyName 主键名称
   * @returns {Object} 节点信息
   */
  findNode(collection, cursorList = [], keyName) {
    let newCursorList = cursorList;
    const cursor = newCursorList[0];
    for (let i = 0; i < collection.length; i++) {
      if (collection[i][keyName] === cursor) {
        if (newCursorList[1]) {
          newCursorList = newCursorList.slice(1);
          return this.findNode(collection[i].children, newCursorList, keyName);
        }
        return collection[i];
      }
    }
  }
  /**
   * 全部层级展开/收起
   */
  @Bind()
  handleExpand() {
    const { isExpandAll } = this.state;
    const {
      dispatch,
      assetCatalog: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        expandedRowKeys: isExpandAll ? Object.keys(pathMap).map(item => +item) : [],
      },
    });
    this.setState({ isExpandAll: !isExpandAll });
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      assetCatalog: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.assetCatalogId]
      : expandedRowKeys.filter(item => item !== record.assetCatalogId);
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }
  /**
   * 列表查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'assetCatalog/listAssetCatalog',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }
  /**
   * 新建顶层
   */
  @Bind()
  handleAddItem() {
    const {
      dispatch,
      tenantId,
      assetCatalog: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const assetCatalogId = uuidv4();
    const newAssetCatalog = {
      assetCatalogId,
      enabledFlag: 1,
      tenantId,
      _status: 'create',
    };
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        treeList: [newAssetCatalog, ...treeList],
        expandedRowKeys: [...expandedRowKeys, assetCatalogId],
      },
    });
  }
  /**
   * 清除
   * @param {Object} record 清除新增组织行对象
   */
  @Bind()
  handleCancelLine(record = {}) {
    const {
      dispatch,
      assetCatalog: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentCatalogId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[record.parentCatalogId], 'assetCatalogId');
      const newChildren = node.children.filter(
        item => item.assetCatalogId !== record.assetCatalogId
      );
      newTreeList = this.findAndSetNodeProps(
        treeList,
        pathMap[record.parentCatalogId],
        newChildren
      );
    } else {
      newTreeList = treeList.filter(item => item.assetCatalogId !== record.assetCatalogId);
    }
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }
  /**
   * 按钮- 保存
   * 批量保存新增预算项设置
   */
  @Bind()
  handleSaveItem() {
    const {
      dispatch,
      tenantId,
      assetCatalog: { treeList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(treeList, ['children', 'assetCatalogId']).map(item =>
      isUndefined(item.enabledFlag) ? { ...item, enabledFlag: 0 } : item
    );
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'assetCatalog/saveAssetCatalog',
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
   * 新增下级
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddLineItem(record = {}) {
    const {
      dispatch,
      tenantId,
      assetCatalog: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const assetCatalogId = uuidv4();
    const newAssetCatalog = {
      tenantId,
      assetCatalogId,
      enabledFlag: 1,
      _status: 'create',
      parentCatalogId: record.assetCatalogId,
    };
    const newChildren = [...(record.children || []), newAssetCatalog];
    const newTreeList = this.findAndSetNodeProps(
      treeList,
      pathMap[record.assetCatalogId],
      newChildren
    );
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.assetCatalogId],
      },
    });
  }
  /**
   * 编辑/取消
   * @param {Object} record 新增组织行对象
   * @param {Boolean} flag 新增/取消组织行对象
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      assetCatalog: { treeList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(treeList, pathMap[record.assetCatalogId], 'assetCatalogId');
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...treeList];
    dispatch({
      type: 'assetCatalog/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }
  /**
   *  禁用当前记录及所有下级
   * @param {Object} current 当前记录
   */
  @Bind()
  handleForbidLine(current = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetCatalogId } = current;
    dispatch({
      type: 'assetCatalog/forbidLine',
      payload: {
        tenantId,
        assetCatalogId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }
  /**
   *  启用
   * @param {Object} current 当前记录
   */
  @Bind()
  handleEnabledLine(current = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetCatalogId } = current;
    dispatch({
      type: 'assetCatalog/enabledLine',
      payload: {
        tenantId,
        assetCatalogId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }
  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      tenantId,
      loading,
      assetCatalog: {
        expandedRowKeys,
        treeList,
        depreciationTypeMap = [], // 折旧类型值集
        accountTypeMap = [], // 资产入账会计科目类型值集
      },
    } = this.props;
    const { isExpandAll } = this.state;
    const { listLoading, saveLoading } = loading;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      tenantId,
      expandedRowKeys,
      loading: listLoading,
      dataSource: treeList,
      depreciationTypeMap,
      accountTypeMap,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleAddLineItem,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('afam.assetCatalog.view.message.title').d('资产目录')}>
          <Button type="primary" icon="plus" onClick={this.handleAddItem}>
            {intl.get('hzero.common.button.createTop').d('新建顶层')}
          </Button>
          <Button icon="save" onClick={this.handleSaveItem} loading={saveLoading}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/asset-catalog/export`}
            queryParams={exportParams}
          />
          <Button icon={isExpandAll ? `down` : `up`} onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandOrCollapseAll').d('全部展开/收起')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
export default AssetCatalog;
