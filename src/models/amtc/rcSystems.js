/*
 * rcSystem - 故障缺陷
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryRcSystemList,
  queryEvaluateCalcsList,
  queryEvaluateHierarchiesList,
  fetchDetailInfo,
  saveEditData,
  saveAddData,
  enabledRcSystemType,
  disabledRcSystemType,
  deleteEvaluateCalcs,
  deleteEvaluateHierarchies,
} from '../../services/amtc/rcSystemsService';

export default {
  namespace: 'rcSystem',
  state: {
    rcSystemList: [], // 故障缺陷
    rcSystemPagination: {},
    detail: {}, // 故障缺陷详细信息
    evaluateCalcsList: [], // 评估计算项
    evaluateCalcsPagination: {},
    evaluateHierarchiesList: [], // 评估字段层次
    evaluateHierarchiesPagination: {},
    faultdefectCalcFormulaMap: [], // 计算公式
    faultdefectBasetypeMap: [], // 基准类型
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          faultdefectCalcFormulaMap: 'AMTC.FAULTDEFECT_CALC_FORMULA', // 计算公式
          faultdefectBasetypeMap: 'AMTC.FAULTDEFECT_BASETYPE', // 基准类型
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

    // 查询故障缺陷列表信息
    *queryRcSystemList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryRcSystemList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rcSystemList: result.content,
            rcSystemPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估计算项列表信息
    *queryEvaluateCalcsList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryEvaluateCalcsList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            evaluateCalcsList: result.content,
            evaluateCalcsPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估字段层次列表信息
    *queryEvaluateHierarchiesList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryEvaluateHierarchiesList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            evaluateHierarchiesList: result.content,
            evaluateHierarchiesPagination: createPagination(result),
          },
        });
      }
    },

    // 查询故障缺陷详细信息
    *fetchRcSystemDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },
    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },

    // 保存新增信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
      return getResponse(result);
    },

    // 禁用
    *disabledRcSystem({ payload }, { call }) {
      const result = yield call(disabledRcSystemType, payload);
      return getResponse(result);
    },
    // 启用
    *enabledRcSystem({ payload }, { call }) {
      const result = yield call(enabledRcSystemType, payload);
      return getResponse(result);
    },
    // 删除
    *deleteEvaluateCalcs({ payload }, { call }) {
      const result = yield call(deleteEvaluateCalcs, payload);
      return getResponse(result);
    },
    // 删除
    *deleteEvaluateHierarchies({ payload }, { call }) {
      const result = yield call(deleteEvaluateHierarchies, payload);
      return getResponse(result);
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
