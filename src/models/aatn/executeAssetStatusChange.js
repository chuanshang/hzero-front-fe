/**
 * service - 资产状态变更单-处理
 * @date: 2019-3-28
 * @author: HBT <baitao.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchLineList,
  executeAssetStatusChange,
  fetchTransactionTypeLine,
  fetchDynamicFields,
  fetchDynamicLov,
} from '../../services/aatn/executeAssetStatusChangeService';

export default {
  namespace: 'executeAssetStatusChange',
  state: {
    list: [], // 资产状态变更列表
    pagination: {}, // 分页参数
    processStatusHeaderMap: [], // 头处理状态
    processStatusLineMap: [], // 行处理状态
    transferType: {}, // 事务类型
    dynamicFieldsData: [], // 动态字段数据
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          processStatusHeaderMap: 'HALM.APPROVE_STATUS', // 头处理状态
          processStatusLineMap: 'AATN.PROCESS_STATUS', // 行处理状态
          fieldTypeMap: 'AATN.DYNAMIC_FIELD_LOV', // 字段类型
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
    // 获取资产状态变更单行数据列表
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchLineList, payload));
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
    // 执行处理
    *execute({ payload }, { call }) {
      const result = yield call(executeAssetStatusChange, payload);
      return getResponse(result);
    },
    // 获取事务处理行列表
    *fetchTransactionTypeLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTransactionTypeLine, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            transferType: result,
          },
        });
      }
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
      }
      return result;
    },
    // 获取动态字段中文名
    *fetchDynamicLov({ payload }, { call }) {
      const result = yield call(fetchDynamicLov, payload);
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
