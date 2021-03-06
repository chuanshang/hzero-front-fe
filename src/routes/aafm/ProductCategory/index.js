/**
 * ProductCategory - 产品类别/资产分类入口界面
 * @date: 2019-1-7
 * @author: 冯麒麟 <qilin.feng@hand-china.com>
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
import './index.less';
import Search from './Search';
import ListTable from './ListTable';

@connect(({ productCategory, loading }) => ({
  productCategory,
  loading: {
    listLoading: loading.effects['productCategory/queryProductCategoryList'],
    saveLoading: loading.effects['productCategory/saveData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['aafm.productCategory', 'aafm.common'] })
export default class ProductCategory extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleSearch();
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
      if (m.productCategoryId === cursor) {
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
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'productCategory/queryProductCategoryList',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }

  /**
   * 添加产品
   */
  @Bind()
  handleAddProduct() {
    const {
      dispatch,
      tenantId,
      productCategory: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const productCategoryId = uuidv4();
    const newItem = {
      productCategoryId,
      tenantId,
      productCategoryCodeEnable: 0,
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        treeList: [newItem, ...treeList],
        expandedRowKeys: [...expandedRowKeys, productCategoryId],
      },
    });
  }

  /**
   * 特定产品添加下级产品
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddLineProduct(record = {}) {
    const {
      dispatch,
      tenantId,
      productCategory: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const productCategoryId = uuidv4();
    const newItem = {
      tenantId,
      productCategoryId,
      productCategoryCodeEnable: 0,
      enabledFlag: 1,
      _status: 'create',
      parentCategoryId: record.productCategoryId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      treeList,
      pathMap[record.productCategoryId],
      newChildren
    );
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.productCategoryId],
      },
    });
  }

  /**
   * 按钮- 保存
   * 批量保存新增产品
   */
  @Bind()
  handleSaveProduct() {
    const {
      dispatch,
      tenantId,
      productCategory: { treeList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(treeList, ['children', 'productCategoryId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'productCategory/saveData',
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
   * 清除
   * @param {Object} record 清除新增组织行对象
   */
  @Bind()
  handleCancelLine(record = {}) {
    const {
      dispatch,
      productCategory: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentCategoryId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[record.parentCategoryId], 'productCategoryId');
      const newChildren = node.children.filter(
        item => item.productCategoryId !== record.productCategoryId
      );
      newTreeList = this.findAndSetNodeProps(
        treeList,
        pathMap[record.parentCategoryId],
        newChildren
      );
    } else {
      newTreeList = treeList.filter(item => item.productCategoryId !== record.productCategoryId);
    }
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        treeList: newTreeList,
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
      productCategory: { treeList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(
      treeList,
      pathMap[record.productCategoryId],
      'productCategoryId'
    );

    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...treeList];
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
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
      productCategory: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.productCategoryId]
      : expandedRowKeys.filter(item => item !== record.productCategoryId);
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 展开全部
   * 将页面展示的数据进行展开
   */
  @Bind()
  handleExpand() {
    const {
      dispatch,
      productCategory: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'productCategory/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap).map(item => +item),
      },
    });
  }

  /**
   * 收起全部
   * 页面顶部收起全部按钮，将内容树收起
   */
  @Bind()
  handleShrink() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productCategory/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  /**
   * 启用 - 启用某产品，如果有下级产品则同时启用所有下属产品
   * @param {Object} item 产品行信息
   */
  @Bind()
  handleEnabledLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { productCategoryId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'productCategory/enabledLine',
      payload: {
        tenantId,
        productCategoryId,
        objectVersionNumber,
        _token,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   *  禁用 - 禁用特定产品，同时禁用所有下属产品
   * @param {Object} item 产品行信息
   */
  @Bind()
  handleForbidLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { productCategoryId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'productCategory/forbidLine',
      payload: {
        tenantId,
        productCategoryId,
        objectVersionNumber,
        _token,
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
    const { loading, productCategory, tenantId } = this.props;
    const { listLoading, saveLoading } = loading;
    const { expandedRowKeys = [], treeList = [] } = productCategory;
    const searchProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      tenantId,
      expandedRowKeys,
      loading: listLoading,
      dataSource: treeList,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleAddLineProduct,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('aafm.productCategory.view.message.title').d('产品类别')}>
          <Button
            icon="save"
            type="primary"
            onClick={this.handleSaveProduct}
            loading={saveLoading || listLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="plus" onClick={this.handleAddProduct}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/product-categories/export`}
            queryParams={exportParams}
          />
          <Button icon="down" onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
          <Button icon="up" onClick={this.handleShrink}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <Search {...searchProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
