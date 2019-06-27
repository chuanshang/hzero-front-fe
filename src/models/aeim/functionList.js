/**
 * functionList - 功能清单
 * @date: 2019-04-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryFunctionList, saveData } from '../../services/aeim/functionListService';

export default {
  namespace: 'functionList',

  state: {
    list: [], // 功能清单列表
    pagination: {}, // 分页信息
    functionModuleMap: [], // 功能模块
    enableFlags: [], // 状态
  },
  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          functionModuleMap: 'AEIM.FUNCTION_MODULE', // 功能模块
          enableFlags: 'AMTC.ENABLE_FLAG', // 状态
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
    // 列表查询
    *queryFunctionList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryFunctionList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: {
              ...result,
            },
          },
        });
      }
      return result;
    },
    // 保存新增信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
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
