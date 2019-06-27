/**
 * model - 预算项设置
 * @date: 2019-03-06
 * @author: QZQ <zhiqiang.quan  @hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  renderTreeData,
  queryBudgetItemSettingList,
  saveData,
  forbidLine,
  enabledLine,
  queryBudgetItemAssetList,
  queryAttributeList,
  saveBudgetItemAsset,
  queryAssetSetList,
  deleteBudgetItemAsset,
  queryProductCategoryList,
} from '../../services/appa/budgetItemSettingService';

export default {
  namespace: 'budgetItemSetting',

  state: {
    treeList: [], // 列表页面数据集合
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [], // 可展开的行数据key集合
    budgetItemType: [], // 类型下拉值集
    reportRequirements: [], // 填报要求
    productAssetList: [], // 资产列表
    pagination: {}, // 资产列表分页
    attributeList: [], // 属性组行列表
    selectedAssetSet: [], // 已选资产组
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          budgetItemType: 'APPA.BUDGET_ITEM_TYPE',
          reportRequirements: 'APPM.REPORT_REQUIREMENT', // 填报要求
          enumMap: 'HPFM.FLAG', // 是/否
          ...payload,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    *queryBudgetItemSettingList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBudgetItemSettingList, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      yield put({
        type: 'updateState',
        payload: {
          treeList,
          pathMap,
          expandedRowKeys,
        },
      });
    },

    // 保存新增或编辑的预算项
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 禁用“预算项”
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 启用“预算项”
    *enabledLine({ payload }, { call }) {
      const result = yield call(enabledLine, payload);
      return getResponse(result);
    },
    // 查询预算关联资产列表
    *fetchBudgetItemAssetList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBudgetItemAssetList, payload));
      yield put({
        type: 'updateState',
        payload: {
          productAssetList: result.content,
          selectedAssetSet: result.content.map(item => item.assetSetId),
          pagination: createPagination(result),
        },
      });
    },
    // 获取资产组关联属性组的行列表
    *fetchAttributeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryAttributeList, payload));
      yield put({
        type: 'updateState',
        payload: {
          attributeList: result.content,
        },
      });
    },
    // 获取资产组列表
    *fetchAssetSetList({ payload }, { call }) {
      const result = getResponse(yield call(queryAssetSetList, payload));
      return result;
    },
    // 获取产品类别列表
    *fetchProductCategoryList({ payload }, { call }) {
      const result = getResponse(yield call(queryProductCategoryList, payload));
      return result;
    },
    // 保存预算关联的资产
    *saveBudgetItemAsset({ payload }, { call }) {
      const result = getResponse(yield call(saveBudgetItemAsset, payload));
      return result;
    },
    // 删除预算关联的资产
    *deleteBudgetItemAsset({ payload }, { call }) {
      const result = getResponse(yield call(deleteBudgetItemAsset, payload));
      return result;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
