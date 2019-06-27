/**
 * ProjectBudget - 项目预算
 * @date: 2019-5-5
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Spin, Modal, Row } from 'hzero-ui';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { connect } from 'dva';
import { HALM_PPM } from '@/utils/config';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import classNames from 'classnames';
import ExcelExport from 'components/ExcelExport';
import uuidv4 from 'uuid/v4';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';
import AssetModal from './AssetModal';
import TemplateModal from './TemplateModal';
import HistoryModal from './HistoryModal';
import CompareModal from './CompareModal';

@connect(({ projectBudget, loading }) => ({
  projectBudget,
  loading: {
    detail:
      loading.effects['projectBudget/fetchBudgetItems'] ||
      loading.effects['projectBudget/fetchPropBasicInfoDetail'] ||
      loading.effects['projectBudget/fetchBudgetDetail'],
    save: loading.effects['projectBudget/saveProjectBudget'],
    submit: loading.effects['projectBudget/submitProjectBudget'],
    searchAsset: loading.effects['projectBudget/fetchBudgetItemAssetList'],
    saveAsset: loading.effects['projectBudget/saveBudgetItemAsset'],
    searchAssetSet: loading.effects['projectBudget/fetchAssetSet'],
    budgetTemplate: loading.effects['projectBudget/fetchBudgetTemplates'],
    copyTemplate: loading.effects['projectBudget/copyProjectBudget'],
    copyHistory: loading.effects['projectBudget/copyHistory'],
    compare: loading.effects['projectBudget/fetchCompareList'],
    dynamicFields:
      loading.effects['projectBudget/fetchAssetSetList'] ||
      loading.effects['projectBudget/fetchAttributeList'],
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
        versionStatus: 'PRESET', // 模板状态
      },
      assetModalVisible: false,
      productTypeFlag: 0, // 是否启用产品类型
      assetSetFlag: 0, // 是否启用资产组
      selectedRowKeys: [], // 产品类别/资产组选中的key
      selectedRows: [], // 产品类别/资产组选中的行
      productCategoryName: {},
      templateSelectedRowKeys: [], // 预算模板选择的key
      templateSelectedRows: [], // 预算模板选择的行
      templateModalVisible: false,
      historySelectedRowKeys: [], // 历史版本选择的key
      historySelectedRows: [], // 历史版本选择的行
      historyModalVisible: false,
      compareModalVisible: false,
      compareFlag: false,
      compareFields: [], // 对比的版本字段
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({ type: 'projectBudget/fetchLov', payload: { tenantId } });
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
      projectBudget: { budgetDetail, budgetItemList },
    } = this.props;
    const { proBudgetId, projectId } = match.params;
    let saveData = [];
    let saveFlag = false;
    const flags = this.findUpdateData(budgetItemList, []);
    const params = getEditTableData(budgetItemList, ['children', 'proBudgetItemId']);
    saveData = this.handleSetUpdatedTree();
    if (!isEmpty(saveData)) {
      if (!Number.isInteger(saveData[0].proBudgetItemId)) {
        const { proBudgetItemId, ...other } = saveData[0];
        saveData[0] = other;
        if (saveData[0].children) {
          saveData[0].children.forEach(item => {
            const temp = item;
            delete temp.parentProBudgetItemId;
            temp.parentProBudgetItemId = 1;
          });
        }
      }
    }
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
          const { treeList } = this.formatTemplateData(budgetItemList);
          if (treeList[0].children) {
            treeList[0].children.forEach(i => {
              const temp = i;
              temp.parentProBudgetItemId = 1;
            });
          }
          saveData = treeList;
          dispatch({
            type: 'projectBudget/saveProjectBudget',
            payload: {
              tenantId,
              proBudgetId,
              data: {
                ...values,
                projectId,
                tenantId,
                proBudgetId: Number(proBudgetId),
                budgetTypeId: budgetDetail.budgetTypeId,
                budgetTypeName: budgetDetail.budgetTypeName,
                versionStatus: budgetDetail.versionStatus,
                versionNumber: budgetDetail.versionNumber,
                objectVersionNumber: budgetDetail.objectVersionNumber,
                _token: budgetDetail._token,
                projectBudgetItemDTOS: saveData,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch({
                type: 'projectBudget/updateState',
                payload: {
                  budgetItemList: [],
                },
              });
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 复制自标准时，
   * 需把proBudgetItemId删除
   */
  @Bind()
  formatTemplateData(collections = []) {
    const treeList = collections.map(item => {
      const temp = item;
      if (temp._status === 'create') {
        delete temp.proBudgetItemId;
        delete temp.objectVersionNumber;
        delete temp._token;
        delete temp.levelPath;
        delete temp.levelNumber;
      }
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
      match,
      projectBudget: { budgetItemList },
    } = this.props;
    const { proBudgetId } = match.params;
    // 深拷贝，避免操作newList数组改变budgetItemList的内容
    const newList = JSON.parse(JSON.stringify(budgetItemList));
    const data = getEditTableData(budgetItemList, []);
    data.forEach(item => {
      const temp = item;
      let node = this.recursion(newList, temp.proBudgetItemId);
      if (!Number.isInteger(node.proBudgetItemId)) {
        const { proBudgetItemId, ...other } = node;
        node = other;
      }
      node.reportRequirement = temp.reportRequirement;
      node.budgetStandard = temp.budgetStandard;
      node.fixedBudget = temp.fixedBudget;
      node.proBudgetId = proBudgetId;
      node.projectBudgetPeriodList = this.handlePeriodList(item);
    });
    return newList;
  }
  /**
   * 修改后的数据刷到projectBudgetPeriodList中
   */
  @Bind()
  handlePeriodList(item) {
    const {
      tenantId,
      projectBudget: { periodList },
    } = this.props;
    const { projectBudgetPeriodList = [] } = item;
    let tempList = [];
    tempList = periodList.map(e => {
      let tempPeriod = {};
      let periods = [];
      if (!isNull(projectBudgetPeriodList)) {
        periods = projectBudgetPeriodList.filter(i => i.budgetPeriodName === e.periodName);
        if (!isEmpty(periods)) {
          // eslint-disable-next-line prefer-destructuring
          tempPeriod = periods[0];
        }
      }
      const period = {
        tenantId,
        budgetPeriodAmount: item.nodeType === 'BUDGET' ? item[e.periodName] : 0,
        budgetPeriodId: e.periodId,
        budgetPeriodName: e.periodName,
      };
      if (tempPeriod) {
        // 修改时添加token和版本号
        period.proBudgetPeriodId = tempPeriod.proBudgetPeriodId;
        period._token = tempPeriod._token;
        period.objectVersionNumber = tempPeriod.objectVersionNumber;
      }
      return period;
    });
    return tempList;
  }
  /**
   * 期间编制存在时，往节点塞入projectBudgetPeriodList
   */
  setPeriodList(collections = []) {
    const treeList = collections.map(item => {
      const temp = item;
      if (temp.nodeType !== 'BUDGET') {
        temp.projectBudgetPeriodList = this.handlePeriodList(item);
      }
      if (temp.children) {
        temp.children = [...this.setPeriodList(temp.children || []).treeList];
      }
      return temp;
    });
    return { treeList };
  }

  /**
   * 根据proBudgetItemId找到指定节点
   */
  recursion(list, current) {
    if (!list) {
      return;
    }
    let result = null;
    // eslint-disable-next-line guard-for-in
    for (const i in list) {
      const item = list[i];
      if (item.proBudgetItemId === current) {
        result = item;
        break;
      } else if (item.children && item.children.length > 0) {
        result = this.recursion(item.children, current);
      }
    }
    return result;
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { projectId, proBudgetId } = match.params;
    dispatch({
      type: 'projectBudget/fetchPropBasicInfoDetail',
      payload: {
        tenantId,
        projectId,
      },
    }).then(result => {
      dispatch({
        type: 'projectBudget/fetchBudgetDetail',
        payload: {
          tenantId,
          projectId,
          proBudgetId,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'projectBudget/fetchBudgetType',
            payload: {
              tenantId,
              budgetTypeId: res.budgetTypeId,
            },
          }).then(r => {
            if (r) {
              dispatch({
                // 保存是否明细到期间编制flag
                type: 'projectBudget/updateState',
                payload: {
                  thinPeriodFlag: r.content[0].thinPeriodFlag,
                },
              });
            }
          });
          dispatch({
            // 获取项目期间包含的预算期间
            type: 'projectBudget/fetchBudgetPeriod',
            payload: {
              tenantId,
              periodStartDateFrom: result.startDate,
              periodEndDateTo: result.endDate,
            },
          }).then(r => {
            dispatch({
              // 保存是否明细到期间编制flag
              type: 'projectBudget/updateState',
              payload: {
                periodList: r.content,
              },
            });
          });
        }
      });
    });
    dispatch({
      type: 'projectBudget/fetchBudgetItems',
      payload: {
        tenantId,
        proBudgetId,
      },
    }).then(res => {
      if (isEmpty(res)) {
        const proBudgetItemId = uuidv4();
        dispatch({
          type: 'projectBudget/updateState',
          payload: {
            budgetItemList: [
              // 预算项列表
              {
                tenantId,
                proBudgetItemId,
                levelNumber: 0,
                itemName: '项目总预算',
                nodeType: 'ROOT',
                _status: 'create',
                proBudgetId: Number(proBudgetId),
              },
            ],
            pathMap: { [proBudgetItemId]: [proBudgetItemId] },
          },
        });
      }
    });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearchBudgetItems(value, templateCode) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { proBudgetId },
      },
    } = this.props;
    if (!isUndefined(value)) {
      dispatch({
        type: 'projectBudget/fetchBudgetTemplateItem',
        payload: {
          tenantId,
          templateCode,
          latestFlag: 0,
        },
      }).then(res => {
        if (res && isEmpty(res.projectBudgetItemList)) {
          const proBudgetItemId = uuidv4();
          dispatch({
            type: 'projectBudget/updateState',
            payload: {
              budgetItemList: [
                // 预算项列表
                {
                  tenantId,
                  proBudgetId: Number(proBudgetId),
                  proBudgetItemId,
                  levelNumber: 0,
                  itemName: '项目总预算',
                  _status: 'create',
                  nodeType: 'ROOT',
                },
              ],
              pathMap: { [proBudgetItemId]: [proBudgetItemId] },
            },
          });
        }
      });
    }
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
      projectBudget: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.proBudgetItemId]
      : expandedRowKeys.filter(item => item !== record.proBudgetItemId);
    dispatch({
      type: 'projectBudget/updateState',
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
    const { dispatch, tenantId, match } = this.props;
    const { proBudgetId } = match.params;
    Modal.confirm({
      iconType: '',
      content: intl.get('appm.common.view.message.confirm.budget.delete').d('是否删除预算项/节点'),
      onOk: () => {
        dispatch({
          type: 'projectBudget/deleteBudgetItem',
          payload: {
            tenantId,
            proBudgetId,
            data: record,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
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
      projectBudget: { budgetItemList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const proBudgetItemId = uuidv4();
    const newItem = {
      tenantId,
      proBudgetItemId,
      nodeType: 'NODE',
      _status: 'create',
      parentProBudgetItemId: record.proBudgetItemId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.proBudgetItemId],
      newChildren
    );
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
        budgetItemList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.proBudgetItemId],
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
      projectBudget: { budgetItemList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const proBudgetItemId = uuidv4();
    const newItem = {
      tenantId,
      proBudgetItemId,
      nodeType: 'BUDGET',
      _status: 'create',
      parentProBudgetItemId: record.proBudgetItemId,
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.proBudgetItemId],
      newChildren
    );
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
        budgetItemList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.proBudgetItemId],
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
      projectBudget: { budgetItemList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentProBudgetItemId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(
        budgetItemList,
        pathMap[record.parentProBudgetItemId],
        'proBudgetItemId'
      );
      const newChildren = node.children.filter(
        item => item.proBudgetItemId !== record.proBudgetItemId
      );
      newTreeList = this.findAndSetNodeProps(
        budgetItemList,
        pathMap[record.parentProBudgetItemId],
        newChildren
      );
    } else {
      newTreeList = budgetItemList.filter(item => item.proBudgetItemId !== record.proBudgetItemId);
    }
    dispatch({
      type: 'projectBudget/updateState',
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
      projectBudget: { budgetItemList = [], pathMap = {} },
    } = this.props;
    const currentNode = this.findNode(
      budgetItemList,
      pathMap[record.proBudgetItemId],
      'proBudgetItemId'
    );
    currentNode._status = flag ? 'update' : '';
    const newTreeList = [...budgetItemList];
    dispatch({
      type: 'projectBudget/updateState',
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
      if (m.proBudgetItemId === cursor) {
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
      projectBudget: { budgetItemList = [], pathMap = {} },
    } = this.props;
    const node = this.findNode(
      budgetItemList,
      pathMap[record.parentProBudgetItemId],
      'proBudgetItemId'
    );
    const children = node.children.map(item =>
      item.proBudgetItemId === record.proBudgetItemId
        ? {
            ...this.formatChildren([lovRecord]).treeList[0],
            parentProBudgetItemId: record.parentProBudgetItemId,
            _status: record._status,
            levelNumber: record.levelNumber,
            _token: record._token,
            objectVersionNumber: record.objectVersionNumber,
          }
        : item
    );
    const newTreeList = this.findAndSetNodeProps(
      budgetItemList,
      pathMap[record.parentProBudgetItemId],
      children
    );
    const { treeList, newPathMap } = this.formatTree(newTreeList, {});
    const newExpandedRowKeys = Object.keys(newPathMap).map(item => +item);
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
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
    const {
      match: {
        params: { proBudgetId },
      },
    } = this.props;
    const treeList = collections.map(item => {
      const temp = item;
      delete temp.objectVersionNumber;
      delete temp._token;
      delete temp.levelPath;
      delete temp.levelNumber;
      if (temp.children) {
        temp.children = [...this.formatChildren(temp.children || []).treeList];
      }
      return {
        ...temp,
        proBudgetId: Number(proBudgetId),
        proBudgetItemId: temp.itemId,
        budgetItemId: temp.itemId,
        parentProBudgetItemId: temp.parentItemId,
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
      newPathMap[temp.proBudgetItemId] = [
        ...(newPathMap[temp.parentProBudgetItemId] || []),
        temp.proBudgetItemId,
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
  handleShowAssetModal(record) {
    this.handleSearchProductAssets(record.proBudgetItemId);
    const {
      projectBudget: { budgetItemList = [] },
    } = this.props;
    if (!isUndefined(record._status)) {
      const list = getEditTableData(budgetItemList, ['children']);
      const temp = list.filter(item => item.proBudgetItemId === record.proBudgetItemId);
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
        proBudgetItemId: record.proBudgetItemId,
      });
    }
  }

  /**
   * 关闭设备资产弹窗
   */
  @Bind()
  handleCloseModal() {
    this.setState({
      assetModalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
  }

  /**
   * 新增关联的资产
   */
  @Bind()
  handleAddAsset() {
    const {
      dispatch,
      tenantId,
      projectBudget: { productAssetList = [] },
    } = this.props;
    const { proBudgetItemId } = this.state;
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
        productAssetList: [
          {
            tenantId,
            proBudgetItemId,
            proAssetId: uuidv4(),
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
      projectBudget: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.filter(item => item.proAssetId !== record.proAssetId);
    dispatch({
      type: 'projectBudget/updateState',
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
      projectBudget: { productAssetList = [] },
    } = this.props;
    const newList = productAssetList.map(item =>
      item.proAssetId === record.proAssetId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
        productAssetList: [...newList],
      },
    });
  }

  /**
   * 获取预算关联的产品类别/资产组列表
   */
  @Bind()
  handleSearchProductAssets(proBudgetItemId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'projectBudget/fetchBudgetItemAssetList',
      payload: {
        tenantId,
        proBudgetItemId,
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
      projectBudget: { productAssetList = [] },
    } = this.props;
    const { productTypeFlag, assetSetFlag } = this.state;
    const tempList = [];
    productAssetList.forEach(item => {
      if (['create', 'update'].includes(item._status)) {
        tempList.push({
          ...item,
          thinProductFlag: productTypeFlag,
          thinAssetFlag: assetSetFlag,
        });
      }
    });
    const params = (tempList.length && getEditTableData(tempList, ['proAssetId'])) || [];
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'projectBudget/saveBudgetItemAsset',
        payload: {
          tenantId,
          data: params.map(i => ({
            ...i,
            attributeDes: JSON.stringify(i._attributeFields),
          })),
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchProductAssets(res[0].proBudgetItemId);
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
      type: 'projectBudget/fetchProductCategoryList',
      payload: {
        tenantId,
        productCategoryId: assetClassId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          productCategoryName: {
            ...productCategoryName,
            [record.proAssetId]: res.content[0].productCategoryName,
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
      type: 'projectBudget/fetchAssetSetList',
      payload: {
        tenantId,
        assetsSetId: record.$form.getFieldValue('assetSetId'),
      },
    }).then(res => {
      if (res) {
        if (!isUndefined(res.content[0].attributeSetId) && !isNull(res.content[0].attributeSetId)) {
          dispatch({
            type: 'projectBudget/fetchAttributeList',
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
      projectBudget: { productAssetList = [] },
    } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appm.common.view.message.confirm.delete').d('是否删除产品/资产组'),
      onOk: () => {
        dispatch({
          type: 'projectBudget/deleteBudgetItemAsset',
          payload: {
            tenantId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearchProductAssets(productAssetList[0].proBudgetItemId);
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
   * 项目预算提交
   */
  @Bind()
  handleSubmit() {
    const {
      tenantId,
      dispatch,
      match,
      projectBudget: { budgetDetail, budgetItemList },
    } = this.props;
    const { proBudgetId } = match.params;
    const flags = this.findUpdateData(budgetItemList, []);
    let saveFlag = false;
    const params = getEditTableData(budgetItemList, ['children', 'proBudgetItemId']);
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
            type: 'projectBudget/submitProjectBudget',
            payload: {
              tenantId,
              proBudgetId: Number(proBudgetId),
              data: {
                ...budgetDetail,
                description: values.description,
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
   * 预算模板弹窗
   */
  @Bind()
  handleShowTemplateModal() {
    this.setState({ templateModalVisible: true });
  }

  /**
   * 关闭预算模板弹窗
   */
  @Bind()
  handleCloseTemplateModal() {
    this.setState({
      templateModalVisible: false,
      templateSelectedRowKeys: [],
      templateSelectedRows: [],
    });
  }

  /**
   * 预算模板数据行选中操作
   */
  @Bind()
  handleTemplateSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ templateSelectedRowKeys: selectedRowKeys, templateSelectedRows: selectedRows });
  }

  /**
   * 预算模板模态框确认操作
   */
  @Bind()
  handleTemplateModalOk() {
    const { templateSelectedRows } = this.state;
    const { dispatch, tenantId, match } = this.props;
    const { proBudgetId } = match.params;
    dispatch({
      type: 'projectBudget/copyProjectBudget',
      payload: {
        tenantId,
        proBudgetId,
        data: {
          templateCode: templateSelectedRows[0].templateCode,
        },
      },
    }).then(res => {
      if (res) {
        this.handleSearch();
        this.setState({
          templateModalVisible: false,
          templateSelectedRowKeys: [],
          templateSelectedRows: [],
        });
      }
    });
  }

  /**
   * 预算模板列表查询
   */
  @Bind()
  handleSearchBudgetTemplate() {
    const {
      dispatch,
      tenantId,
      projectBudget: { proDetail, budgetDetail },
    } = this.props;
    dispatch({
      type: 'projectBudget/fetchBudgetTemplates',
      payload: {
        tenantId,
        templateStatus: 'FORMAL',
        budgetTypeId: budgetDetail.budgetTypeId,
        proTypeId: proDetail.proTypeId,
        enabledFlag: 1,
      },
    }).then(res => {
      if (res) {
        if (res.content.length === 1) {
          this.handleSingeTemplate(res.content[0].templateCode);
        } else if (res.content.length > 1) {
          this.handleShowTemplateModal();
        }
      }
    });
  }
  /**
   * 复制自标准时，如果只有一条标准则提示是否复制自标准
   */
  @Bind()
  handleSingeTemplate(templateCode) {
    const { dispatch, tenantId, match, loading } = this.props;
    const { proBudgetId } = match.params;
    Modal.confirm({
      iconType: '',
      content: intl.get('appm.common.view.message.copyTemplate').d('是否复制模板数据'),
      confirmLoading: loading.copyTemplate,
      onOk: () => {
        dispatch({
          type: 'projectBudget/copyProjectBudget',
          payload: {
            tenantId,
            proBudgetId,
            data: {
              templateCode,
            },
          },
        }).then(res => {
          if (res) {
            this.handleSearch();
          }
        });
      },
    });
  }
  /**
   * 复制自历史版本
   */
  @Bind()
  handleCopyHistory() {
    const {
      dispatch,
      loading,
      tenantId,
      match,
      projectBudget: { historyList },
    } = this.props;
    const { proBudgetId } = match.params;
    if (historyList.length === 1) {
      // 只有一个历史版本时弹窗提示是否复制自历史版本
      Modal.confirm({
        iconType: '',
        content: intl.get('appm.common.view.message.copyHistory').d('是否复制历史版本'),
        confirmLoading: loading.copyHistory,
        onOk: () => {
          dispatch({
            type: 'projectBudget/copyHistory',
            payload: {
              tenantId,
              proBudgetId,
              data: {
                versionNumber: historyList[0],
              },
            },
          }).then(res => {
            if (res) {
              this.handleSearch();
            }
          });
        },
      });
    }
    if (historyList.length > 1) {
      // 存在多个历史版本时弹窗让用户选择
      this.handleShowHistoryModal();
    }
  }
  /**
   * 历史版本模态框确认操作
   */
  @Bind()
  handleHistoryModalOk() {
    const { historySelectedRows } = this.state;
    const { dispatch, tenantId, match } = this.props;
    const { proBudgetId } = match.params;
    dispatch({
      type: 'projectBudget/copyHistory',
      payload: {
        tenantId,
        proBudgetId,
        data: {
          versionNumber: historySelectedRows[0].versionNumber,
        },
      },
    }).then(res => {
      if (res) {
        this.handleSearch();
        this.setState({
          historyModalVisible: false,
          historySelectedRowKeys: [],
          historySelectedRows: [],
        });
      }
    });
  }

  /**
   * 历史版本数据行选中操作
   */
  @Bind()
  handleHistorySelectRow(selectedRowKeys, selectedRows) {
    this.setState({ historySelectedRowKeys: selectedRowKeys, historySelectedRows: selectedRows });
  }

  /**
   * 历史版本弹窗
   */
  @Bind()
  handleShowHistoryModal() {
    this.setState({ historyModalVisible: true });
  }

  /**
   * 关闭历史版本弹窗
   */
  @Bind()
  handleCloseHistoryModal() {
    this.setState({
      historyModalVisible: false,
      historySelectedRowKeys: [],
      historySelectedRows: [],
    });
  }
  /**
   * 打开对比弹窗
   */
  @Bind()
  handleShowCompareModal() {
    this.setState({ compareModalVisible: true });
  }
  /**
   * 关闭对比弹窗
   */
  @Bind()
  handleCloseCompareModal() {
    this.setState({ compareModalVisible: false });
  }
  /**
   * 对比弹窗中确认操作
   */
  @Bind()
  handleCompareModalOk(fields = {}) {
    const {
      projectBudget: { budgetDetail },
    } = this.props;
    const { standardTemplate, preVersion, otherVersion, versionNumber } = fields;
    const versions = [];
    const compareFields = [];
    if (standardTemplate === 1) {
      versions.push(0);
      compareFields.push({ type: 'standardTemplate', version: '0' });
    }
    if (preVersion === 1) {
      versions.push(budgetDetail.versionNumber - 1);
      compareFields.push({ type: 'preVersion', version: String(budgetDetail.versionNumber - 1) });
    }
    if (otherVersion === 1 && !isUndefined(versionNumber)) {
      versions.push(versionNumber);
      compareFields.push({ type: 'otherVersion', version: String(versionNumber) });
    }
    if (!isEmpty(versions)) {
      this.setState({ compareFields });
      this.handleSearchCompareList(versions);
    }
  }
  /**
   * 获取对比列表
   * @param {Array} versions 需要对比的版本
   */
  @Bind()
  handleSearchCompareList(versions) {
    const {
      dispatch,
      tenantId,
      match,
      projectBudget: { budgetDetail, backupBudgetItemList },
    } = this.props;
    const { projectId, proBudgetId } = match.params;
    dispatch({
      type: 'projectBudget/fetchCompareList',
      payload: {
        tenantId,
        projectId,
        proBudgetId,
        versions,
        budgetTypeId: budgetDetail.budgetTypeId,
        proBudgetItemList: backupBudgetItemList,
      },
    }).then(res => {
      if (res) {
        this.handleCloseCompareModal();
        this.setState({ compareFlag: true });
      }
    });
  }
  /**
   * 点击预算项/节点Lov时，获取已选的预算项/节点
   */
  @Bind()
  handleSelectedNodes(dataSource = []) {
    const {
      projectBudget: { budgetItemList },
    } = this.props;
    const { selectedNodes } = this.getNode(budgetItemList, []);
    const list = getEditTableData(dataSource, []);
    list.forEach(item => selectedNodes.push(item.budgetItemId));
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
      if (!isUndefined(temp.budgetItemId)) {
        selectedNodes.push(temp.budgetItemId);
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
      projectBudget: { selectedAssetSet },
    } = this.props;
    selectedAssetSet.push(value);
    // selectedAssetSet数组去重
    const tempList = Array.from(new Set(selectedAssetSet));
    dispatch({
      type: 'projectBudget/updateState',
      payload: {
        selectedAssetSet: tempList,
      },
    });
  }
  render() {
    const { loading, match, tenantId, projectBudget } = this.props;
    const {
      defaultItem,
      assetModalVisible,
      productTypeFlag,
      assetSetFlag,
      selectedRowKeys,
      productCategoryName,
      proBudgetItemId,
      templateSelectedRowKeys,
      templateModalVisible,
      historySelectedRowKeys,
      historyModalVisible,
      compareModalVisible,
      compareFlag,
      compareFields,
    } = this.state;
    const {
      proDetail = {},
      budgetDetail = {},
      budgetItemList = [],
      expandedRowKeys = [],
      reportRequirements = [],
      productAssetList = [],
      attributeList = [],
      assetPagination = {},
      templateList = [],
      templatePagination = {},
      historyList = [],
      historyPagination = {},
      thinPeriodFlag = 0,
      periodList = [],
      selectedAssetSet = [],
    } = projectBudget;
    const { proBudgetId } = match.params;
    const infoProps = {
      tenantId,
      proDetail,
      budgetDetail,
      budgetItemList,
      expandedRowKeys,
      reportRequirements,
      thinPeriodFlag,
      periodList,
      compareFlag,
      compareFields,
      templateLoading: loading.budgetTemplate,
      uomName: budgetDetail.uomName,
      dataSource: isUndefined(proBudgetId) ? defaultItem : budgetDetail,
      isNew: isUndefined(proBudgetId),
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onAddNode: this.handleAddBudgetItemNode,
      onAddBudgetItem: this.handleAddBudgetItem,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onShowModal: this.handleShowAssetModal,
      onRebuildTree: this.handleRebuildTree,
      onExpand: this.handleExpandSubLine,
      onDeleteBudgetItem: this.handleDeleteBudgetItem,
      onSearchBudgetItems: this.handleSearchBudgetItems,
      onSearchTemplate: this.handleSearchBudgetTemplate,
      onShowTemplateModal: this.handleShowTemplateModal,
      onShowCompareModal: this.handleShowCompareModal,
      onCopyHistory: this.handleCopyHistory,
      onSelectedNode: this.handleSelectedNodes,
      key: proBudgetId,
    };
    const assetModalProps = {
      selectedAssetSet,
      tenantId,
      proBudgetItemId,
      productTypeFlag,
      assetSetFlag,
      attributeList,
      selectedRowKeys,
      productCategoryName,
      versionStatus: budgetDetail.versionStatus,
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
    const templateModalProps = {
      selectedRowKeys: templateSelectedRowKeys,
      pagination: templatePagination,
      modalVisible: templateModalVisible,
      loading: loading.budgetTemplate,
      copyLoading: loading.copyTemplate,
      dataSource: templateList,
      onSelectRow: this.handleTemplateSelectRow,
      onOk: this.handleTemplateModalOk,
      onCancel: this.handleCloseTemplateModal,
    };
    const historyModalProps = {
      selectedRowKeys: historySelectedRowKeys,
      pagination: historyPagination,
      modalVisible: historyModalVisible,
      loading: loading.history,
      detailLoading: loading.historyDetail,
      dataSource: historyList,
      onSelectRow: this.handleHistorySelectRow,
      onOk: this.handleHistoryModalOk,
      onSearch: this.handleSearchBudgetTemplate,
      onCancel: this.handleCloseHistoryModal,
    };
    const compareModalProps = {
      tenantId,
      historyList,
      loading: loading.compare,
      modalVisible: compareModalVisible,
      onOk: this.handleCompareModalOk,
      onCancel: this.handleCloseCompareModal,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header
          title={intl.get('appm.projectBudget.view.message.detail').d('项目预算')}
          backPath={`/appm/pro-basic-info/detail/${proDetail.projectId}`}
        >
          <Button loading={loading.save} icon="save" type="primary" onClick={this.save}>
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
          <Button
            loading={loading.submit}
            icon="check"
            onClick={this.handleSubmit}
            style={{ display: budgetDetail.versionStatus === 'PRESET' ? 'inline' : 'none' }}
          >
            {intl.get(`hero.common.button.submit`).d('提交')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/project-budget-item/${proBudgetId}/export`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <div className={classNames(styles['project-budget'])}>
            <Row>
              <Spin spinning={isUndefined(proBudgetId) ? false : loading.detail}>
                <InfoExhibit {...infoProps} />
              </Spin>
            </Row>
            <AssetModal {...assetModalProps} />
            <TemplateModal {...templateModalProps} />
            <HistoryModal {...historyModalProps} />
            <CompareModal {...compareModalProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
