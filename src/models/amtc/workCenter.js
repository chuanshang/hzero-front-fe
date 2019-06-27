/*
 * workCenter - 工作中心
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import {
  queryWorkCenterList,
  fetchDetailInfo,
  fetchDetailListInfo,
  saveEditData,
  saveAddData,
  enabledWorkCenter,
  disabledWorkCenter,
  saveWorkCenterResAddData,
  saveWorkCenterResEditData,
} from '../../services/amtc/workCenterService';

export default {
  namespace: 'workCenter',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 工作中心明细
    detailList: [], // 工作中心行列表
    detailListPagination: [],
  },

  effects: {
    // 查询工作中心列表信息
    *queryWorkCenterList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWorkCenterList, payload));
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

    // 查询工作中心详细信息
    *fetchWorkCenterDetail({ payload }, { call, put }) {
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

    // 查询工作中心行详细信息
    *fetchDetailListInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailListInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailListPagination: createPagination(result),
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
    *disabledWorkCenter({ payload }, { call }) {
      const result = yield call(disabledWorkCenter, payload);
      return getResponse(result);
    },
    // 启用
    *enabledWorkCenter({ payload }, { call }) {
      const result = yield call(enabledWorkCenter, payload);
      return getResponse(result);
    },
    // 保存技能类型新增信息
    *saveWorkCenterResAddData({ payload }, { call }) {
      const result = yield call(saveWorkCenterResAddData, payload);
      return getResponse(result);
    },
    // 保存技能类型更新信息
    *saveWorkCenterResEditData({ payload }, { call }) {
      const result = yield call(saveWorkCenterResEditData, payload);
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
