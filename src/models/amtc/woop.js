/*
 * woop - 工单类型
 * @date: 2019-04-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWorkProcessDetailInfo,
  fetchWorkProcessListInfo,
  saveEditData,
  saveAddData,
  deleteData,
} from '../../services/amtc/woopService';
import { fetchDetailInfo } from '../../services/amtc/workOrderService';

export default {
  namespace: 'woop',

  state: {
    workOrderDetail: {}, // 工单详情
    woopDetail: {}, // 工序详情
    woopList: [], // 工序详情行列表
    woopPagination: {}, // 工序详情行列表分页
    woopStatusMap: [], // 状态
    durationUnitMap: [], // 工期单位
    mapSourceCodeMap: [], // 地图来源
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woopStatusMap: 'AMTC.WORKPROCESS_STATUS', // 状态
          durationUnitMap: 'AFAM.DEPRECIATION_TYPE', // 工期单位
          mapSourceCodeMap: 'AFAM.DEPRECIATION_TYPE', // 地图来源
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
    // 获取工序明细数据
    *fetchWorkProcessDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWorkProcessDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            woopDetail: {
              ...result,
            },
          },
        });
      }
      return result;
    },

    // 查询工序详情列表信息
    *fetchWorkProcessListInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWorkProcessListInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            woopList: result.content,
            woopPagination: createPagination(result),
          },
        });
      }
    },

    // 获取工单明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            workOrderDetail: {
              ...result,
            },
          },
        });
      }
      return result;
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
    // 删除信息
    *deleteData({ payload }, { call }) {
      const result = yield call(deleteData, payload);
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
