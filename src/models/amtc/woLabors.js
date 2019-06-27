/*
 * WoLabors - 人员
 * @date: 2019-06-13
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWoLaborsList,
  fetchWoLaborsDetail,
  saveAddData,
  saveEditData,
  deleteWoLabors,
} from '../../services/amtc/woLaborsService';

export default {
  namespace: 'woLabors',
  state: {
    detail: {}, // 人员明细
    list: [], // 人员列表
    pagination: {},
    limitTimeUom: [],
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          limitTimeUom: 'HALM.LIMIT_TIME_UOM',
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
    // 查询人员列表信息
    *fetchWoLaborsList({ payload }, { call, put }) {
      const result = yield call(fetchWoLaborsList, payload);
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

    // 查询人员详细信息
    *fetchWoLaborsDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWoLaborsDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },

    // 保存新增信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
      return getResponse(result);
    },

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },

    // 删除信息
    *deleteWoLabors({ payload }, { call }) {
      const result = yield call(deleteWoLabors, payload);
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
