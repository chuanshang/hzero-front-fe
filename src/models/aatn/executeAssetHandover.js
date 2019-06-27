/**
 * service - 资产移交归还单
 * @date: 2019-3-21
 * @author: HBT <baitao.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchAssetHandover,
  executeAssetHandover,
  fetchTransactionTypeLine,
  fetchDynamicFields,
  fetchDynamicLov,
  searchAssetHandoverLines,
  searchAssetHandoverDetail,
} from '../../services/aatn/executeAssetHandoverService';

export default {
  namespace: 'executeAssetHandover',
  state: {
    list: [], // 资产移交归还单头列表
    pagination: {}, // 分页参数
    processStatusHeaderMap: [], // 头处理状态
    processStatusLineMap: [], // 行处理状态
    dynamicFieldsData: [], // 动态字段数据
    lineList: [], // 行列表
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          processStatusHeaderMap: 'HALM.APPROVE_STATUS',
          processStatusLineMap: 'AATN.HANDOVER_LINE_STATUS',
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
    // 动态获取页面下拉列表显示值集
    *fetchDynamicValueList({ payload }, { call }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          ...payload,
        })
      );
      return result;
    },
    // 获取资产移交归还单数据列表
    *fetchAssetHandover({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetHandover, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取资产移交归还单数据列表
    *fetchAssetHandoverLines({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetHandoverLines, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result,
          },
        });
      }
      return result;
    },
    // 处理资产移交归还单
    *executeAssetHandover({ payload }, { call }) {
      const result = yield call(executeAssetHandover, payload);
      return getResponse(result);
    },
    // 获取事务处理行列表
    *fetchTransactionTypeLine({ payload }, { call }) {
      const result = yield call(fetchTransactionTypeLine, payload);
      return result;
    },
    // 获取动态字段对应的数据
    *fetchDynamicFields({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDynamicFields, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dynamicFieldsData: result,
          },
        });
        return result;
      }
    },
    // 获取动态字段中文名
    *fetchDynamicLov({ payload }, { call }) {
      const result = yield call(fetchDynamicLov, payload);
      return getResponse(result);
    },
    // 获取资产移交归还单明细
    *fetchAssetHandoverDetail({ payload }, { call }) {
      const result = getResponse(yield call(searchAssetHandoverDetail, payload));
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
