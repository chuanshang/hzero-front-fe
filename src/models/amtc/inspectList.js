/*
 * inspectList - 标准检查项
 * @date: 2019-05-17
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchInspectListList,
  fetchInspectListDetail,
  fetchProblemList,
  saveEditData,
  deleteInspectList,
  deleteProblems,
} from '../../services/amtc/inspectListService';

export default {
  namespace: 'inspectList',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 标准检查组明细
    problemsList: [], // 问题清单行
    problemPagination: {}, // 问题清单分页信息
    businessScenarioList: [], // 业务场景
    fieldTypeList: [], // 字段类型
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          businessScenarioList: 'AMTC.BUSINESS_SCENARIO',
          fieldTypeList: 'AMTC.FIELD_TYPE',
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
    // 查询标准检查组列表信息
    *fetchInspectListList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectListList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },

    // 查询问题清单列表信息
    *fetchProblemList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProblemList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            problemsList: result.content,
            problemPagination: createPagination(result),
          },
        });
      }
    },

    // 查询标准检查组详细信息
    *fetchInspectListDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectListDetail, payload));
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

    // 删除信息
    *deleteInspectList({ payload }, { call }) {
      const result = yield call(deleteInspectList, payload);
      return getResponse(result);
    },

    // 删除问题清单信息
    *deleteProblems({ payload }, { call }) {
      const result = yield call(deleteProblems, payload);
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
