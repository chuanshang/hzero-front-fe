/**
 * model - 验收单类型
 * @date: 2019-04-18
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchAcceptanceType,
  searchAcceptanceTypeDetail,
  saveAcceptanceType,
  searchByFullText,
  disabledAcceptanceType,
  enabledAcceptanceType,
} from '../../services/arcv/acceptanceTypeService';

export default {
  namespace: 'acceptanceType',
  state: {
    list: [], // 验收单类型列表
    pagination: {}, // 分页参数
    detail: {}, // 验收单类型详情
    fullList: [], // 明细页数据检索数据列表
    fullPagination: {}, // 明细页数据检索分页信息
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          acceptanceType: 'ARCV.ACCEPTANCE_TYPE',
          transferFixed: 'ARCV.TRANSFER_FIXED',
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
    // 获取验收单类型数据列表
    *fetchAcceptanceType({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAcceptanceType, payload));
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
    // 获取验收单类型明细
    *fetchAcceptanceTypeDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAcceptanceTypeDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },
    // 保存验收单类型
    *saveAcceptanceType({ payload }, { call }) {
      const result = yield call(saveAcceptanceType, payload);
      return getResponse(result);
    },
    // 禁用
    *disabledAcceptanceType({ payload }, { call }) {
      const result = yield call(disabledAcceptanceType, payload);
      return getResponse(result);
    },
    // 启用
    *enabledAcceptanceType({ payload }, { call }) {
      const result = yield call(enabledAcceptanceType, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchByFullText, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fullList: result.content,
            fullPagination: createPagination(result),
          },
        });
      }
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
