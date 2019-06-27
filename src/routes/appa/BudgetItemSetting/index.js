/**
 * 预算项设置创建/编辑-列表
 * @date: 2019-3-6
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Modal } from 'hzero-ui';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { HALM_PPM } from '@/utils/config';
import { isUndefined, isEmpty } from 'lodash';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import './index.less';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import AssetModal from './AssetModal';

@connect(({ budgetItemSetting, loading }) => ({
  budgetItemSetting,
  loading: {
    listLoading: loading.effects['budgetItemSetting/queryBudgetItemSettingList'],
    saveLoading: loading.effects['budgetItemSetting/saveData'],
    searchAsset: loading.effects['budgetItemSetting/fetchBudgetItemAssetList'],
    saveAsset: loading.effects['budgetItemSetting/saveBudgetItemAsset'],
    searchAssetSet: loading.effects['budgetItemSetting/fetchAssetSet'],
    dynamicFields:
      loading.effects['budgetItemSetting/fetchAssetSetList'] ||
      loading.effects['budgetItemSetting/fetchAttributeList'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['appa.BudgetItemSetting', 'appa.common'] })
class BudgetItemSetting extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      assetModalVisible: false,
      productTypeFlag: 0, // 是否启用产品类型
      assetSetFlag: 0, // 是否启用资产组
      selectedRowKeys: [],
      selectedRows: [],
      productCategoryName: {},
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch();
    dispatch({ type: 'budgetItemSetting/fetchLov', payload: { tenantId } });
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
      if (m.itemId === cursor) {
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
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'budgetItemSetting/queryBudgetItemSettingList',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }

  /**
   * 添加预算项设置
   */
  @Bind()
  handleAddItem() {
    const {
      dispatch,
      tenantId,
      budgetItemSetting: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const itemId = uuidv4();
    const newItem = {
      itemId,
      tenantId,
      levelNumber: 0,
      nodeType: 'NODE',
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        treeList: [newItem, ...treeList],
        expandedRowKeys: [...expandedRowKeys, itemId],
      },
    });
  }

  /**
   * 特定节点添加下级预算项设置
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddLineItem(record = {}) {
    const {
      dispatch,
      tenantId,
      budgetItemSetting: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const itemId = uuidv4();
    const newItem = {
      tenantId,
      itemId,
      ensureProductTypeFlag: 0,
      ensureAssetSetFlag: 0,
      itemTypeCode: record.itemTypeCode,
      enabledFlag: 1,
      nodeType: 'BUDGET',
      _status: 'create',
      parentItemId: record.itemId,
    };
    const newChildren = [newItem, ...(record.children || [])];
    const newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.itemId], newChildren);
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.itemId],
      },
    });
  }
  /**
   * 特定节点新建节点
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddLineNode(record = {}) {
    const {
      dispatch,
      tenantId,
      budgetItemSetting: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const itemId = uuidv4();
    const newItem = {
      tenantId,
      itemId,
      enabledFlag: 1,
      levelNumber: record.levelNumber + 1,
      itemTypeCode: record.itemTypeCode,
      nodeType: 'NODE',
      _status: 'create',
      parentItemId: record.itemId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.itemId], newChildren);
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.itemId],
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
      budgetItemSetting: { treeList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(treeList, ['children', 'itemId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'budgetItemSetting/saveData',
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
      budgetItemSetting: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentItemId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[record.parentItemId], 'itemId');
      const newChildren = node.children.filter(item => item.itemId !== record.itemId);
      newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.parentItemId], newChildren);
    } else {
      newTreeList = treeList.filter(item => item.itemId !== record.itemId);
    }
    dispatch({
      type: 'budgetItemSetting/updateState',
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
      budgetItemSetting: { treeList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(treeList, pathMap[record.itemId], 'itemId');
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...treeList];
    dispatch({
      type: 'budgetItemSetting/updateState',
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
      budgetItemSetting: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.itemId]
      : expandedRowKeys.filter(item => item !== record.itemId);
    dispatch({
      type: 'budgetItemSetting/updateState',
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
      budgetItemSetting: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'budgetItemSetting/updateState',
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
      type: 'budgetItemSetting/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  /**
   * 启用 - 启用某预算项设置，如果有下级预算项设置则同时启用所有下属预算项设置
   * @param {Object} item 预算项设置行信息
   */
  @Bind()
  handleEnabledLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { itemId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'budgetItemSetting/enabledLine',
      payload: {
        tenantId,
        itemId,
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
   *  禁用 - 禁用特定预算项设置，同时禁用所有下属预算项设置
   * @param {Object} item 预算项设置行信息
   */
  @Bind()
  handleForbidLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { itemId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'budgetItemSetting/forbidLine',
      payload: {
        tenantId,
        itemId,
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
  /**
   * 打开设备资产弹窗
   */
  @Bind()
  handleShowModal(record) {
    this.handleSearchProductAssets(record.itemId);
    const {
      budgetItemSetting: { treeList = [] },
    } = this.props;
    if (!isUndefined(record._status)) {
      const list = getEditTableData(treeList, ['children']);
      const temp = list.filter(item => item.itemId === record.itemId);
      if (!isEmpty(temp)) {
        this.setState({
          assetModalVisible: true,
          productTypeFlag: temp[0].ensureProductTypeFlag,
          assetSetFlag: temp[0].ensureAssetSetFlag,
        });
      }
    } else {
      this.setState({
        assetModalVisible: true,
        productTypeFlag: record.ensureProductTypeFlag,
        assetSetFlag: record.ensureAssetSetFlag,
        itemId: record.itemId,
      });
    }
  }
  /**
   * 关闭设备资产弹窗
   */
  @Bind()
  handleCloseModal() {
    this.setState({ assetModalVisible: false });
  }
  /**
   * 新增关联的资产
   */
  @Bind()
  handleAddAsset() {
    const {
      dispatch,
      tenantId,
      budgetItemSetting: { productAssetList = [] },
    } = this.props;
    const { itemId } = this.state;
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        productAssetList: [
          {
            tenantId,
            itemId,
            itemToAssetId: uuidv4(),
            productCategoryId: '', // 产品类别
            assetSetId: null, // 资产组
            brand: '', // 品牌/厂商
            specifications: '', // 规格型号
            attributeDes: '', // 补充描述
            name: '', // 名称
            assetQuantity: '', // 数量
            uomCode: '', // 单位
            assetPrice: '', // 单价
            price: '', // 金额
            _status: 'create',
          },
          ...productAssetList,
        ],
      },
    });
  }
  /**
   * 关联的资产-清除行数据
   */
  @Bind()
  handleCleanAsset(record) {
    const {
      dispatch,
      budgetItemSetting: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.filter(item => item.itemToAssetId !== record.itemToAssetId);
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        productAssetList: [...newList],
      },
    });
  }
  /**
   * 关联的资产-编辑行数据
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditAsset(record, flag) {
    const {
      dispatch,
      budgetItemSetting: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.map(item =>
      item.itemToAssetId === record.itemToAssetId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        productAssetList: [...newList],
      },
    });
  }
  /**
   * 获取预算关联的产品类别/资产组列表
   */
  @Bind()
  handleSearchProductAssets(itemId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'budgetItemSetting/fetchBudgetItemAssetList',
      payload: {
        tenantId,
        itemId,
      },
    });
  }
  /**
   * 保存预算关联的产品类别/资产组
   */
  @Bind()
  handleSaveProductAsset() {
    const {
      tenantId,
      dispatch,
      budgetItemSetting: { productAssetList = [] },
    } = this.props;
    const tempList = [];
    productAssetList.forEach(item => {
      if (['create', 'update'].includes(item._status)) {
        tempList.push(item);
      }
    });
    const params = (tempList.length && getEditTableData(tempList, ['itemToAssetId'])) || [];
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'budgetItemSetting/saveBudgetItemAsset',
        payload: {
          tenantId,
          data: params.map(i => ({ ...i, attributeDes: JSON.stringify(i._attributeFields) })),
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchProductAssets(res[0].itemId);
        }
      });
    }
  }
  /**
   * 获取产品类别
   */
  @Bind()
  handleGetProductCategory(assetClassId, record) {
    const { tenantId, dispatch } = this.props;
    const { productCategoryName } = this.state;
    dispatch({
      type: 'budgetItemSetting/fetchProductCategoryList',
      payload: {
        tenantId,
        productCategoryId: assetClassId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          productCategoryName: {
            ...productCategoryName,
            [record.itemToAssetId]: res[0].productCategoryName,
          },
        });
      }
    });
  }
  /**
   * 获取属性组行列表
   */
  @Bind()
  handleGetAttributeSets(record) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'budgetItemSetting/fetchAssetSetList',
      payload: {
        tenantId,
        assetsSetId: record.$form.getFieldValue('assetSetId'),
      },
    }).then(res => {
      if (res) {
        if (!isUndefined(res.content[0].attributeSetId)) {
          dispatch({
            type: 'budgetItemSetting/fetchAttributeList',
            payload: {
              tenantId,
              enabledFlag: 1,
              attributeSetId: res.content[0].attributeSetId,
            },
          });
        }
      }
    });
  }
  /**
   * 删除关联的资产
   */
  @Bind()
  handleDeleteBudgetItemAsset() {
    const {
      dispatch,
      tenantId,
      budgetItemSetting: { productAssetList = [] },
    } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appa.common.view.message.confirm.delete').d('是否删除产品/资产组'),
      onOk: () => {
        dispatch({
          type: 'budgetItemSetting/deleteBudgetItemAsset',
          payload: {
            tenantId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearchProductAssets(productAssetList[0].itemId);
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
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 获取已选的资产组
   */
  @Bind()
  handleSelectedAssetSet(value) {
    const {
      dispatch,
      budgetItemSetting: { selectedAssetSet },
    } = this.props;
    selectedAssetSet.push(value);
    // selectedAssetSet数组去重
    const tempList = Array.from(new Set(selectedAssetSet));
    dispatch({
      type: 'budgetItemSetting/updateState',
      payload: {
        selectedAssetSet: tempList,
      },
    });
  }

  render() {
    const {
      assetModalVisible,
      productTypeFlag,
      assetSetFlag,
      selectedRowKeys,
      productCategoryName,
    } = this.state;
    const { loading, budgetItemSetting, tenantId } = this.props;
    const { listLoading, saveLoading, searchAsset, saveAsset, dynamicFields } = loading;
    const {
      reportRequirements,
      budgetItemType,
      pagination = {},
      expandedRowKeys = [],
      treeList = [],
      enumMap = [],
      productAssetList = [],
      attributeList = [],
      selectedAssetSet = [],
    } = budgetItemSetting;
    const filterProps = {
      enumMap,
      budgetItemType,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      tenantId,
      budgetItemType,
      expandedRowKeys,
      reportRequirements,
      loading: listLoading,
      dataSource: treeList,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleAddLineItem,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onShowModal: this.handleShowModal,
      onAddNode: this.handleAddLineNode,
    };
    const assetModalProps = {
      selectedAssetSet,
      tenantId,
      productTypeFlag,
      assetSetFlag,
      pagination,
      attributeList,
      dynamicFields,
      selectedRowKeys,
      productCategoryName,
      loading: searchAsset,
      saveLoading: saveAsset,
      dataSource: productAssetList,
      modalVisible: assetModalVisible,
      onCancel: this.handleCloseModal,
      onNew: this.handleAddAsset,
      onCleanLine: this.handleCleanAsset,
      onEditLine: this.handleEditAsset,
      onSave: this.handleSaveProductAsset,
      onSearch: this.handleSearchProductAssets,
      onSearchAttributeSets: this.handleGetAttributeSets,
      onSelectRow: this.handleSelectRow,
      onDelete: this.handleDeleteBudgetItemAsset,
      onSearchProductCategory: this.handleGetProductCategory,
      onSelectedAssetSet: this.handleSelectedAssetSet,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('appa.budgetItemSetting.view.message.title').d('预算项设置')}>
          <Button type="primary" icon="plus" onClick={this.handleAddItem}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="save" onClick={this.handleSaveItem} loading={saveLoading}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/budget-item/export`}
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
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
          <AssetModal {...assetModalProps} />
        </Content>
      </Fragment>
    );
  }
}
export default BudgetItemSetting;
