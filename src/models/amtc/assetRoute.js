/*
 * assetRoute - 资产路线
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryAssetRouteList,
  fetchDetailInfo,
  fetchDetailListInfo,
  saveEditData,
  saveAddData,
  enabledAssetRoute,
  disabledAssetRoute,
  deleteAssetRouteLine,
} from '../../services/amtc/assetRouteService';

export default {
  namespace: 'assetRoute',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 资产路线明细
    detailList: [], // 资产路线行列表
    detailListPagination: [],
    referenceModeMap: [], // 引用模式
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          referenceModeMap: 'AMTC.REFERENCEMODE', // 引用模式
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

    // 查询工作中心列表信息
    *queryAssetRouteList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryAssetRouteList, payload));
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
    *fetchAssetRouteDetail({ payload }, { call, put }) {
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
    *disabledAssetRoute({ payload }, { call }) {
      const result = yield call(disabledAssetRoute, payload);
      return getResponse(result);
    },
    // 启用
    *enabledAssetRoute({ payload }, { call }) {
      const result = yield call(enabledAssetRoute, payload);
      return getResponse(result);
    },
    // 删除行信息
    *deleteAssetRouteLine({ payload }, { call }) {
      const result = yield call(deleteAssetRouteLine, payload);
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
