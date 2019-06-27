/*
 * workCenterRes - 技能类型
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import {
  queryWorkCenterResList,
  fetchDetailInfo,
  fetchDetailListInfo,
  saveEditData,
  saveAddData,
  createOrUpdatePeople,
} from '../../services/amtc/workCenterResService';

export default {
  namespace: 'workCenterRes',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 技能类型明细
    detailList: [], // 技能类型行列表
    detailListPagination: [],
  },

  effects: {
    // 查询技能类型列表信息
    *queryWorkCenterResList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWorkCenterResList, payload));
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

    // 查询技能类型详细信息
    *fetchWorkCenterResDetail({ payload }, { call, put }) {
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

    // 查询技能类型行列表
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
    // 保存新增信息
    *createOrUpdatePeople({ payload }, { call }) {
      const result = yield call(createOrUpdatePeople, payload);
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
