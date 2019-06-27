/*
 * model - 预算模板
 * @date: 2019-4-17
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchBudgetTemplates,
  saveBudgetTemplate,
  searchBudgetItems,
  renderTreeData,
  queryBudgetItemAssetList,
  queryAttributeList,
  queryAssetSetList,
  queryProductCategoryList,
  saveBudgetItemAsset,
  deleteBudgetItemAsset,
  submitBudgetTemplate,
  deleteBudgetTemplate,
  deleteBudgetItem,
  queryBudgetType,
  searchHistoryVersions,
  searchHistoryDetail,
  renderUpdatedTreeData,
} from '../../services/appa/budgetTemplateService';

export default {
  namespace: 'budgetTemplate',
  state: {
    templateList: [], // 模板头列表
    pagination: {}, // 分页参数
    versionStatusMap: [], // 版本状态
    fullList: [], // 全文检索列表
    fullPagination: {}, // 全文检索分页
    detail: {}, // 预算模板明细
    budgetItemList: [], // 预算项列表
    productAssetList: [], // 资产列表
    assetPagination: {}, // 资产列表分页
    attributeList: [], // 属性组行列表
    historyList: [], // 历史版本
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
    // 获取预算模板头列表
    *fetchBudgetTemplates({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetTemplates, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templateList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 获取历史版本列表
    *fetchHistoryVersions({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHistoryVersions, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: result,
          },
        });
      }
    },
    // 获取历史版本明细
    *fetchHistoryDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHistoryDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },
    // 获取预算模板明细
    *fetchBudgetTemplateDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetItems, payload));
      const { treeList, pathMap } = renderTreeData(result.budgetTemplateItemList, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pathMap,
            expandedRowKeys,
            detail: result,
            budgetItemList: treeList,
          },
        });
      }
      return result;
    },
    // 获取预算项列表
    *fetchBudgetTemplateItem({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetItems, payload));
      const { treeList, pathMap } = renderUpdatedTreeData(result.budgetTemplateItemList, {});
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
    // 提交预算模板
    *submitBudgetTemplate({ payload }, { call }) {
      const result = yield call(submitBudgetTemplate, payload);
      return getResponse(result);
    },
    // 保存预算模板
    *saveBudgetTemplate({ payload }, { call }) {
      const result = yield call(saveBudgetTemplate, payload);
      return getResponse(result);
    },
    // 删除预算模板
    *deleteBudgetTemplate({ payload }, { call }) {
      const result = yield call(deleteBudgetTemplate, payload);
      return getResponse(result);
    },
    // 删除预算项
    *deleteBudgetItem({ payload }, { call }) {
      const result = yield call(deleteBudgetItem, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchBudgetTemplates, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fullList: result.content,
            fullPagination: createPagination(result),
          },
        });
      }
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
