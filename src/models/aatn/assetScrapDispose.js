/**
 * Service - 资产报废单处理
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  listAssetScrapDispose,
  confirmAssetScrapLine,
} from '../../services/aatn/assetScrapDisposeService';

export default {
  namespace: 'assetScrapDispose',
  state: {
    list: [], // 列表
    pagination: {}, // 分页参数
    processStatusHeaderMap: [], // 头处理状态
    scrapLineProcessStatusMap: [], // 行处理状态
    scrapTypeMap: [],
    disposeTypeLovMap: [],
  },
  effects: {
    // 获取资产报废类型LOV
    *fetchScrapTypeLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          scrapTypeMap: 'AATN.ASSET_SCRAP_TYPE',
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
    // 获取资产处置类型下拉列表显示值集
    *fetchDisposeTypeLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          disposeTypeLovMap: 'AATN.DISPOSE_TYPE',
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
    // 获取页面下拉列表显示值集
    *fetchProcessStatusLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          processStatusHeaderMap: 'HALM.APPROVE_STATUS',
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
    // 获取行处理状态显示值集
    *fetchScrapLineProcessStatusLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          scrapLineProcessStatusMap: 'AATN.SCRAP_ORDER_LINE_STATUS',
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
    // list查询
    *listAssetScrapDispose({ payload }, { call, put }) {
      const result = yield call(listAssetScrapDispose, payload);
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
    // 资产报废行确认
    *confirmAssetScrapLine({ payload }, { call }) {
      const result = yield call(confirmAssetScrapLine, payload);
      return getResponse(result);
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
