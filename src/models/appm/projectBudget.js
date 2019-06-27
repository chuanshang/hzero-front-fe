/*
 * model - 项目预算
 * @date: 2019-5-5
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  saveProjectBudget,
  searchBudgetItems,
  renderTreeData,
  renderCreatedTreeData,
  queryBudgetItemAssetList,
  queryAttributeList,
  queryAssetSetList,
  queryProductCategoryList,
  saveBudgetItemAsset,
  deleteBudgetItemAsset,
  submitProjectBudget,
  deleteBudgetItem,
  queryBudgetType,
  searchProBasicInfoDetail,
  searchBudgetDetail,
  searchBudgetTemplates,
  searchTemplateBudgetItems,
  copyProjectBudget,
  copyHistory,
  queryBudgetPeriod,
  searchCompareList,
} from '../../services/appm/projectBudgetService';

export default {
  namespace: 'projectBudget',
  state: {
    versionStatusMap: [], // 版本状态
    budgetDetail: {}, // 预算明细
    historyList: [], // 历史版本
    proDetail: {}, // 项目基本信息
    budgetItemList: [], // 预算项列表
    backupBudgetItemList: [], // 备份预算项列表
    productAssetList: [], // 资产列表
    assetPagination: {}, // 资产列表分页
    attributeList: [], // 属性组行列表
    selectedAssetSet: [], // 已选资产组
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          reportRequirements: 'APPM.REPORT_REQUIREMENT', // 填报要求
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
    // 获取项目基础信息明细
    *fetchPropBasicInfoDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProBasicInfoDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            proDetail: result,
          },
        });
      }
      return result;
    },
    // 获取预算明细
    *fetchBudgetDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            budgetDetail: result,
            historyList: result.historyVersionNumSet.filter(item => item !== result.versionNumber),
          },
        });
      }
      return result;
    },
    // 获取项目预算明细
    *fetchBudgetItems({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetItems, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pathMap,
            expandedRowKeys,
            budgetItemList: treeList,
            backupBudgetItemList: treeList, // 用于对比
          },
        });
      }
      return result;
    },
    // 获取对比列表
    *fetchCompareList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchCompareList, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pathMap,
            expandedRowKeys,
            budgetItemList: treeList,
          },
        });
      }
      return result;
    },
    // 提交项目预算
    *submitProjectBudget({ payload }, { call }) {
      const result = yield call(submitProjectBudget, payload);
      return getResponse(result);
    },
    // 保存项目预算
    *saveProjectBudget({ payload }, { call }) {
      const result = yield call(saveProjectBudget, payload);
      return getResponse(result);
    },
    // 删除预算项
    *deleteBudgetItem({ payload }, { call }) {
      const result = yield call(deleteBudgetItem, payload);
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
          assetPagination: createPagination(result),
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
    // 获取预算类型
    *fetchBudgetType({ payload }, { call }) {
      const result = getResponse(yield call(queryBudgetType, payload));
      return result;
    },
    // 获取预算模板头列表
    *fetchBudgetTemplates({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetTemplates, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templateList: result.content,
            templatePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取预算模板明细
    *fetchBudgetTemplateDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTemplateBudgetItems, payload));
      const { treeList, pathMap } = renderCreatedTreeData(result.budgetTemplateItemList, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pathMap,
            expandedRowKeys,
            budgetItemList: treeList,
          },
        });
      }
      return result;
    },
    // 复制自标准
    *copyProjectBudget({ payload }, { call }) {
      const result = getResponse(yield call(copyProjectBudget, payload));
      return result;
    },
    // 复制自历史版本
    *copyHistory({ payload }, { call }) {
      const result = getResponse(yield call(copyHistory, payload));
      return result;
    },
    // 查询项目周期包含的预算期间
    *fetchBudgetPeriod({ payload }, { call }) {
      const result = getResponse(yield call(queryBudgetPeriod, payload));
      return result;
    },
  },
  reducers: {
    // 合并state状态数据,生成新的state
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
