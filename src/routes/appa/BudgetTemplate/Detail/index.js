/**
 * BudgetTemplate - 预算模板-详细页面
 * @date: 2019-4-18
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Spin, Row, Col, Modal } from 'hzero-ui';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { connect } from 'dva';
import { HALM_PPM } from '@/utils/config';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import classNames from 'classnames';
import ExcelExport from 'components/ExcelExport';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import InfoExhibit from './InfoExhibit';
import FullTextSearch from './FullTextSearch';
import styles from './index.less';
import AssetModal from './AssetModal';

@connect(({ budgetTemplate, loading }) => ({
  budgetTemplate,
  loading: {
    detail:
      loading.effects['budgetTemplate/fetchHistoryDetail'] ||
      loading.effects['budgetTemplate/fetchBudgetTemplateDetail'],
    save: loading.effects['budgetTemplate/saveBudgetTemplate'],
    submit: loading.effects['budgetTemplate/submitBudgetTemplate'],
    fullTextSearch: loading.effects['budgetTemplate/searchFullText'],
    searchAsset: loading.effects['budgetTemplate/fetchBudgetItemAssetList'],
    saveAsset: loading.effects['budgetTemplate/saveBudgetItemAsset'],
    searchAssetSet: loading.effects['budgetTemplate/fetchAssetSet'],
    dynamicFields:
      loading.effects['budgetTemplate/fetchAssetSetList'] ||
      loading.effects['budgetTemplate/fetchAttributeList'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      defaultItem: {
        enabledFlag: 1, // 是否启用
        templateStatus: 'PRESET', // 模板状态
      },
      assetModalVisible: false,
      productTypeFlag: 0, // 是否启用产品类型
      assetSetFlag: 0, // 是否启用资产组
      selectedRowKeys: [], // 产品类别/资产组选中的key
      selectedRows: [], // 产品类别/资产组选中的行
      productCategoryName: {},
      templateFlag: false, // 是否选择前序模板
      tempId: -100000, // 临时id
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({ type: 'budgetTemplate/fetchLov', payload: { tenantId } });
  }

  /**
   * @param {object} ref - Form对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 保存
   */
  @Bind()
  save() {
    const {
      tenantId,
      dispatch,
      match,
      budgetTemplate: { detail, budgetItemList },
    } = this.props;
    const { templateCode } = match.params;
    const { templateFlag } = this.state;
    let saveData = [];
    let saveFlag = false;
    const flags = this.findUpdateData(budgetItemList, []);
    const params = getEditTableData(budgetItemList, ['children', 'templateItemId']);
    saveData = this.handleSetUpdatedTree();
    // if (!isEmpty(saveData)) {
    //   if (saveData[0].templateItemId < 0) {
    //     const { templateItemId, ...other } = saveData[0];
    //     saveData[0] = other;
    //     if (saveData[0].children) {
    //       saveData[0].children.forEach(item => {
    //         const temp = item;
    //         temp.parentTemplateItemId = 1;
    //       });
    //     }
    //   }
    // }
    this.form.validateFields((err, values) => {
      if (!err) {
        // saveFlag当行校验不通过时不允许保存
        saveFlag = true;
        let flag = false;
        flags.forEach(item => {
          flag = item || flag;
        });
        if (flag) {
          saveFlag = saveFlag && false;
        }
        if (Array.isArray(params) && params.length > 0) {
          saveFlag = saveFlag || true;
        }
        if (saveFlag) {
          if (templateFlag) {
            const { treeList } = this.formatTemplateData(budgetItemList);
            if (treeList[0].children) {
              treeList[0].children.forEach(i => {
                const temp = i;
                temp.parentTemplateItemId = 1;
              });
            }
            saveData = treeList;
          }
          if (isUndefined(templateCode)) {
            // 新增
            dispatch({
              type: 'budgetTemplate/saveBudgetTemplate',
              payload: {
                tenantId,
                data: {
                  ...values,
                  tenantId,
                  budgetTemplateItemList: saveData,
                },
              },
            }).then(res => {
              if (res) {
                notification.success();
                dispatch(
                  routerRedux.push({
                    pathname: `/appa/budget-template/new-detail/${res.templateCode}`,
                  })
                );
              }
            });
          } else {
            // 编辑
            dispatch({
              type: 'budgetTemplate/saveBudgetTemplate',
              payload: {
                tenantId,
                data: {
                  ...detail,
                  ...values,
                  budgetTemplateItemList: saveData,
                },
              },
            }).then(res => {
              if (res) {
                notification.success();
                dispatch({
                  type: 'budgetTemplate/updateState',
                  payload: {
                    budgetItemList: [],
                  },
                });
                this.handleSearch(1);
              }
            });
          }
        }
      }
    });
  }

  /**
   * 从前序预算模板带出数据时，
   * 需把templateItemId删除
   */
  @Bind()
  formatTemplateData(collections = []) {
    const treeList = collections.map(item => {
      const temp = item;
      delete temp.templateItemId;
      delete temp.objectVersionNumber;
      delete temp._token;
      delete temp.levelPath;
      delete temp.levelNumber;
      delete temp.templateId;
      if (temp.children) {
        temp.children = [...this.formatTemplateData(temp.children || []).treeList];
      }
      return temp;
    });
    return { treeList };
  }

  /**
   * 把修改的数据刷到树中
   */
  @Bind()
  handleSetUpdatedTree() {
    const {
      budgetTemplate: { budgetItemList },
    } = this.props;
    const data = getEditTableData(budgetItemList, []);
    let newList = JSON.parse(JSON.stringify(budgetItemList));
    data.forEach(item => {
      const temp = item;
      let node = this.recursion(newList, temp.templateItemId);
      if (node) {
        if (node._status === 'create') {
          const { templateItemId, ...other } = node;
          node = other;
        }
        node.reportRequirement = temp.reportRequirement;
        node.budgetStandard = temp.budgetStandard;
        node.fixedBudget = temp.fixedBudget;
      }
      newList = this.renderTreeData(newList, node, item.templateItemId).treeList;
    });
    return newList;
  }

  renderTreeData(collections = [], node = {}, templateItemId) {
    const treeList = collections.map(item => {
      const temp = item;
      if (temp.children) {
        temp.children = [
          ...this.renderTreeData(temp.children || [], node, templateItemId).treeList,
        ];
      }
      return temp.templateItemId === templateItemId ? node : temp;
    });
    return {
      treeList,
    };
  }

  /**
   * 根据templateItemId找到指定节点
   */
  recursion(list, current) {
    if (!list) {
      return;
    }
    let result = null;
    // eslint-disable-next-line guard-for-in
    for (const i in list) {
      const item = list[i];
      if (item.templateItemId === current) {
        result = item;
        break;
      } else if (item.children && item.children.length > 0) {
        result = this.recursion(item.children, current);
      }
    }
    return result;
  }

  /**
   * 获取预算类型
   */
  @Bind()
  handleSearchBudgetType(budgetTypeId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'budgetTemplate/fetchBudgetType',
      payload: {
        tenantId,
        budgetTypeId,
      },
    }).then(res => {
      if (res) {
        const { thinWbsFlag, thinBudgetItemFlag } = res.content[0];
        this.handleSetFlag(thinWbsFlag, thinBudgetItemFlag);
      }
    });
  }

  /**
   * 根据thinWbsFlag、thinBudgetItemFlag设置disabledFlag
   */
  @Bind()
  handleSetFlag(thinWbsFlag, thinBudgetItemFlag) {
    const disabledFlag = thinWbsFlag === 0 && thinBudgetItemFlag === 0;
    this.props.dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        disabledFlag,
      },
    });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch(flag = 0) {
    const { dispatch, tenantId, match } = this.props;
    const { templateCode, templateVersion } = match.params;
    const { url } = match;
    let dispatchType = {};
    if (url.indexOf('history') === -1) {
      dispatchType = {
        type: 'budgetTemplate/fetchBudgetTemplateDetail',
        payload: {
          tenantId,
          templateCode,
          latestFlag: flag,
        },
      };
    } else {
      dispatchType = {
        type: 'budgetTemplate/fetchHistoryDetail',
        payload: {
          tenantId,
          templateCode,
          templateVersion,
        },
      };
    }
    dispatch(dispatchType).then(res => {
      this.handleSearchBudgetType(res.budgetTypeId);
      if (res && isEmpty(res.budgetTemplateItemList)) {
        this.handleInitEmptyList();
      }
    });
  }

  /**
   * 预算列表为空时，塞入一条数据
   */
  @Bind()
  handleInitEmptyList() {
    const { dispatch, tenantId } = this.props;
    const { tempId } = this.state;
    const templateItemId = tempId;
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        budgetItemList: [
          // 预算项列表
          {
            tenantId,
            templateItemId,
            levelNumber: 0,
            itemName: '项目总预算',
            nodeType: 'ROOT',
            _status: 'create',
          },
        ],
        pathMap: { [templateItemId]: [templateItemId] },
      },
    });
    this.setState({ tempId: +tempId });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearchBudgetItems(value, templateCode) {
    const { dispatch, tenantId } = this.props;
    if (!isUndefined(value)) {
      dispatch({
        type: 'budgetTemplate/fetchBudgetTemplateItem',
        payload: {
          tenantId,
          templateCode,
          latestFlag: 0,
        },
      }).then(res => {
        this.setState({ templateFlag: true });
        if (res && isEmpty(res.budgetTemplateItemList)) {
          this.handleInitEmptyList();
        }
      });
    }
  }

  /**
   * 明细页-数据检索
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'budgetTemplate/searchFullText',
      payload: {
        tenantId,
        page,
        condition,
      },
    });
  }

  /**
   * 跳转到明细页
   * @param {string} templateCode - 项目模板编码templateCode
   */
  @Bind()
  handleGotoDetail(templateCode) {
    const {
      dispatch,
      budgetTemplate: { detail },
    } = this.props;
    let path = '';
    if (detail.templateStatus === 'PRESET') {
      path = 'new-detail';
    } else {
      path = 'detail';
    }
    dispatch(
      routerRedux.push({
        pathname: `/appa/budget-template/${path}/${templateCode}`,
      })
    );
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 预算行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      budgetTemplate: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.templateItemId]
      : expandedRowKeys.filter(item => item !== record.templateItemId);
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 删除预算项
   */
  @Bind()
  handleDeleteBudgetItem(record) {
    const { dispatch, tenantId } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl.get('appa.common.view.message.confirm.budget.delete').d('是否删除预算项/节点'),
      onOk: () => {
        dispatch({
          type: 'budgetTemplate/deleteBudgetItem',
          payload: {
            tenantId,
            templateId: record.templateId,
            data: record,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch(1);
          }
        });
      },
    });
  }

  /**
   * 添加下级节点
   * @param {Object} record  操作对象
   */
  @Bind()
  handleAddBudgetItemNode(record = {}) {
    const {
      dispatch,
      tenantId,
      budgetTemplate: { budgetItemList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const { tempId } = this.state;
    this.setState({ tempId: +tempId });
    const templateItemId = tempId;
    const newItem = {
      tenantId,
      templateItemId,
      nodeType: 'NODE',
      _status: 'create',
      parentTemplateItemId: record.templateItemId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.templateItemId],
      newChildren
    );
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        budgetItemList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.templateItemId],
      },
    });
  }

  /**
   * 新增节点下的预算项
   */
  @Bind()
  handleAddBudgetItem(record = {}) {
    const {
      dispatch,
      tenantId,
      budgetTemplate: { budgetItemList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const { tempId } = this.state;
    this.setState({ tempId: +tempId });
    const templateItemId = tempId;
    const newItem = {
      tenantId,
      templateItemId,
      nodeType: 'BUDGET',
      _status: 'create',
      parentTemplateItemId: record.templateItemId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.templateItemId],
      newChildren
    );
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        budgetItemList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.templateItemId],
      },
    });
  }

  /**
   * 清除
   * @param {Object} record 清除新增预算行对象
   */
  @Bind()
  handleCancelLine(record = {}) {
    const {
      dispatch,
      budgetTemplate: { budgetItemList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentTemplateItemId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(
        budgetItemList,
        pathMap[record.parentTemplateItemId],
        'templateItemId'
      );
      const newChildren = node.children.filter(
        item => item.templateItemId !== record.templateItemId
      );
      newTreeList = this.findAndSetNodeProps(
        budgetItemList,
        pathMap[record.parentTemplateItemId],
        newChildren
      );
    } else {
      newTreeList = budgetItemList.filter(item => item.templateItemId !== record.templateItemId);
    }
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        budgetItemList: newTreeList,
      },
    });
  }

  /**
   * 编辑/取消
   * @param {Object} record 新增预算行对象
   * @param {Boolean} flag 新增/取消预算行对象
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      budgetTemplate: { budgetItemList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(
      budgetItemList,
      pathMap[record.templateItemId],
      'templateItemId'
    );
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...budgetItemList];
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        budgetItemList: newTreeList,
      },
    });
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
      if (m.templateItemId === cursor) {
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
   * 预算项是否存在变更
   */
  @Bind()
  findUpdateData(collections, flags = []) {
    const temp = flags;
    // eslint-disable-next-line guard-for-in
    for (const i in collections) {
      const item = collections[i];
      temp.push(!isUndefined(item._status));
      if (item.children) {
        this.findUpdateData(item.children, temp);
      }
    }
    return temp;
  }

  /**
   * 选择预算项/节点后更新整棵树
   */
  @Bind()
  handleRebuildTree(record, lovRecord) {
    const {
      dispatch,
      budgetTemplate: { budgetItemList = [], pathMap = {} },
    } = this.props;
    const node = this.findNode(
      budgetItemList,
      pathMap[record.parentTemplateItemId],
      'templateItemId'
    );
    const children = node.children.map(item =>
      item.templateItemId === record.templateItemId
        ? {
            ...this.formatChildren([lovRecord]).treeList[0],
            // templateItemId: record.templateItemId,
            parentTemplateItemId: record.parentTemplateItemId,
            _status: record._status,
            levelNumber: record.levelNumber,
            _token: record._token,
            objectVersionNumber: record.objectVersionNumber,
          }
        : item
    );
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.parentTemplateItemId],
      children
    );
    const { treeList, newPathMap } = this.formatTree(newTreeList, {});
    const newExpandedRowKeys = Object.keys(newPathMap).map(item => +item);
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        pathMap: newPathMap,
        budgetItemList: [...treeList],
        expandedRowKeys: newExpandedRowKeys,
      },
    });
  }

  /**
   * 格式化Lov带出来的数据
   * @param {Array} children lov带出的数据
   */
  formatChildren(collections = []) {
    const treeList = collections.map(item => {
      const temp = item;
      temp.templateItemId = temp.itemId;
      temp.parentTemplateItemId = temp.parentItemId;
      delete temp.objectVersionNumber;
      delete temp._token;
      delete temp.levelPath;
      delete temp.levelNumber;
      if (temp.children) {
        temp.children = [...this.formatChildren(temp.children || []).treeList];
      }
      return {
        ...temp,
        itemTypeCode: temp.reportRequirement,
        itemTypeMeaning: temp.reportRequirementMeaning,
        _status: 'create',
      };
    });
    return { treeList };
  }

  /**
   * 根据Lov带出来的数据重新生成树和路径
   */
  formatTree(collections = [], levelPath = {}) {
    const newPathMap = levelPath;
    const treeList = collections.map(item => {
      const temp = item;
      newPathMap[temp.templateItemId] = [
        ...(newPathMap[temp.parentTemplateItemId] || []),
        temp.templateItemId,
      ];
      if (temp.children) {
        temp.children = [...this.formatTree(temp.children || [], newPathMap).treeList];
      }
      return temp;
    });
    return {
      treeList,
      newPathMap,
    };
  }

  /**
   * 打开设备资产弹窗
   */
  @Bind()
  handleShowModal(record) {
    this.handleSearchProductAssets(record.templateItemId);
    const {
      budgetTemplate: { budgetItemList = [] },
    } = this.props;
    if (!isUndefined(record._status)) {
      const list = getEditTableData(budgetItemList, ['children']);
      const temp = list.filter(item => item.templateItemId === record.templateItemId);
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
        templateItemId: record.templateItemId,
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
      budgetTemplate: { productAssetList = [] },
    } = this.props;
    const { templateItemId } = this.state;
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        productAssetList: [
          {
            tenantId,
            templateItemId,
            templateToAssetId: uuidv4(),
            productCategoryId: '', // 产品类别
            assetSetId: '', // 资产组
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
      budgetTemplate: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.filter(
      item => item.templateToAssetId !== record.templateToAssetId
    );
    dispatch({
      type: 'budgetTemplate/updateState',
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
      budgetTemplate: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.map(item =>
      item.templateToAssetId === record.templateToAssetId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        productAssetList: [...newList],
      },
    });
  }

  /**
   * 获取预算关联的产品类别/资产组列表
   */
  @Bind()
  handleSearchProductAssets(templateItemId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'budgetTemplate/fetchBudgetItemAssetList',
      payload: {
        tenantId,
        templateItemId,
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
      budgetTemplate: { detail, productAssetList = [] },
    } = this.props;
    const { templateItemId } = this.state;
    const tempList = [];
    productAssetList.forEach(item => {
      if (['create', 'update'].includes(item._status)) {
        tempList.push(item);
      }
    });
    const params = (tempList.length && getEditTableData(tempList, ['templateToAssetId'])) || [];
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'budgetTemplate/saveBudgetItemAsset',
        payload: {
          tenantId,
          templateItemId,
          templateId: detail.templateId,
          data: params.map(i => ({
            ...i,
            attributeDes: JSON.stringify(i._attributeFields),
          })),
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchProductAssets(res[0].templateItemId);
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
      type: 'budgetTemplate/fetchProductCategoryList',
      payload: {
        tenantId,
        productCategoryId: assetClassId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          productCategoryName: {
            ...productCategoryName,
            [record.templateToAssetId]: res.content[0].productCategoryName,
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
      type: 'budgetTemplate/fetchAssetSetList',
      payload: {
        tenantId,
        assetsSetId: record.$form.getFieldValue('assetSetId'),
      },
    }).then(res => {
      if (res) {
        if (!isUndefined(res.content[0].attributeSetId) && !isNull(res.content[0].attributeSetId)) {
          dispatch({
            type: 'budgetTemplate/fetchAttributeList',
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
      budgetTemplate: { detail, productAssetList = [] },
    } = this.props;
    const { templateItemId } = this.state;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appa.common.view.message.confirm.delete').d('是否删除产品/资产组'),
      onOk: () => {
        dispatch({
          type: 'budgetTemplate/deleteBudgetItemAsset',
          payload: {
            tenantId,
            templateItemId,
            templateId: detail.templateId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearchProductAssets(productAssetList[0].templateItemId);
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
   * 模板提交
   */
  @Bind()
  handleSubmit() {
    const {
      tenantId,
      dispatch,
      budgetTemplate: { detail, budgetItemList },
    } = this.props;
    const flags = this.findUpdateData(budgetItemList, []);
    let saveFlag = false;
    const params = getEditTableData(budgetItemList, ['children', 'templateItemId']);
    this.form.validateFields((err, values) => {
      if (!err) {
        // saveFlag当行校验不通过时不允许保存
        saveFlag = true;
        let flag = false;
        flags.forEach(item => {
          flag = item || flag;
        });
        if (flag) {
          saveFlag = saveFlag && false;
        }
        if (Array.isArray(params) && params.length > 0) {
          saveFlag = saveFlag || true;
        }
        if (saveFlag) {
          dispatch({
            type: 'budgetTemplate/submitBudgetTemplate',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                budgetTemplateItemList: params,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 点击预算项/节点Lov时，获取已选的预算项/节点
   */
  @Bind()
  handleSelectedNodes(dataSource = []) {
    const {
      budgetTemplate: { budgetItemList },
    } = this.props;
    const { selectedNodes } = this.getNode(budgetItemList, []);
    const list = getEditTableData(dataSource, []);
    list.forEach(item => selectedNodes.push(item.itemId));
    // selectedNodes数组去重
    const tempList = Array.from(new Set(selectedNodes));
    return tempList;
  }
  /**
   * 提取后台返回数据中预算项/节点id
   */
  getNode(collections = [], selectedList = []) {
    const selectedNodes = selectedList;
    const treeList = collections.map(item => {
      const temp = item;
      if (!isUndefined(item.itemId)) {
        selectedNodes.push(item.itemId);
      }
      if (temp.children) {
        temp.children = [...this.getNode(temp.children || [], selectedNodes).treeList];
      }
      return temp;
    });
    return {
      treeList,
      selectedNodes,
    };
  }

  /**
   * 获取已选的资产组
   */
  @Bind()
  handleSelectedAssetSet(value) {
    const {
      dispatch,
      budgetTemplate: { selectedAssetSet },
    } = this.props;
    selectedAssetSet.push(value);
    // selectedAssetSet数组去重
    const tempList = Array.from(new Set(selectedAssetSet));
    dispatch({
      type: 'budgetTemplate/updateState',
      payload: {
        selectedAssetSet: tempList,
      },
    });
  }

  render() {
    const { loading, match, tenantId, budgetTemplate } = this.props;
    const {
      defaultItem,
      assetModalVisible,
      productTypeFlag,
      assetSetFlag,
      selectedRowKeys,
      productCategoryName,
      templateItemId,
    } = this.state;
    const {
      detail,
      disabledFlag,
      fullPagination = {},
      fullList = [],
      budgetItemList = [],
      expandedRowKeys = [],
      reportRequirements = [],
      productAssetList = [],
      attributeList = [],
      assetPagination = {},
      selectedAssetSet = [],
    } = budgetTemplate;
    const { templateCode } = match.params;
    const infoProps = {
      tenantId,
      disabledFlag,
      budgetItemList,
      expandedRowKeys,
      reportRequirements,
      url: match.url,
      dataSource: isUndefined(templateCode) ? defaultItem : detail,
      isNew: isUndefined(templateCode),
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onAddNode: this.handleAddBudgetItemNode,
      onAddBudgetItem: this.handleAddBudgetItem,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onShowModal: this.handleShowModal,
      onRebuildTree: this.handleRebuildTree,
      onExpand: this.handleExpandSubLine,
      onDeleteBudgetItem: this.handleDeleteBudgetItem,
      onSearchBudgetItems: this.handleSearchBudgetItems,
      onSelectedNode: this.handleSelectedNodes,
      onInitEmptyList: this.handleInitEmptyList,
      onSetFlag: this.handleSetFlag,
      key: templateCode,
    };
    const fullTextSearchProps = {
      templateCode,
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const assetModalProps = {
      selectedAssetSet,
      tenantId,
      templateItemId,
      productTypeFlag,
      assetSetFlag,
      attributeList,
      selectedRowKeys,
      productCategoryName,
      templateStatus: detail.templateStatus,
      pagination: assetPagination,
      dynamicFields: loading.dynamicFields,
      loading: loading.searchAsset,
      saveLoading: loading.saveAsset,
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
      <React.Fragment>
        <Header
          title={intl.get('appa.budgetTemplate.view.message.detail').d('预算模板明细')}
          backPath="/appa/budget-template"
        >
          <Button loading={loading.save} icon="save" type="primary" onClick={this.save}>
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
          <Button
            loading={loading.submit}
            icon="check"
            onClick={this.handleSubmit}
            style={{ display: detail.templateStatus === 'PRESET' ? 'inline' : 'none' }}
          >
            {intl.get(`hero.common.button.submit`).d('提交')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/budget-template/template-item-export/${
              detail.templateId
            }`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <div className={classNames(styles['budget-template-detail'])}>
            <Row>
              <Col span={isUndefined(templateCode) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col
                span={isUndefined(templateCode) ? 24 : 17}
                offset={isUndefined(templateCode) ? 0 : 1}
              >
                <Spin spinning={isUndefined(templateCode) ? false : loading.detail}>
                  <InfoExhibit {...infoProps} />
                </Spin>
              </Col>
            </Row>
            <AssetModal {...assetModalProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
