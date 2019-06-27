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
  searchAssetHandoverDetail,
  saveAssetHandover,
  searchEquipmentAsset,
  executeAssetHandover,
  fetchTransactionTypeLine,
  fetchDynamicFields,
  fetchDynamicLov,
  submitAssetHandover,
  deleteAssetHandover,
} from '../../services/aatn/assetHandoverService';

export default {
  namespace: 'assetHandover',
  state: {
    list: [], // 资产移交归还单头列表
    pagination: {}, // 分页参数
    detail: {}, // 资产移交归还单详情
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    assetList: [], // 设备资产列表
    assetPagination: {}, // 设备资产分页信息
    processStatusHeaderMap: [], // 头处理状态
    lineList: [], // 资产移交归还单行列表
    transferType: {}, // 事务类型
    dynamicFieldsData: [], // 动态字段数据
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
    },
    // 获取资产移交归还单明细
    *fetchAssetHandoverDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetHandoverDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            lineList: result.lineList,
          },
        });
      }
      return result;
    },
    // 提交资产移交归还单
    *submitAssetHandover({ payload }, { call }) {
      const result = yield call(submitAssetHandover, payload);
      return getResponse(result);
    },
    // 保存资产移交归还单
    *saveAssetHandover({ payload }, { call }) {
      const result = yield call(saveAssetHandover, payload);
      return getResponse(result);
    },
    // 删除资产移交归还单
    *deleteAssetHandover({ payload }, { call }) {
      const result = yield call(deleteAssetHandover, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetHandover, payload));
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
    // 获取设备资产列表
    *fetchEquipmentAsset({ payload }, { call, put }) {
      const result = getResponse(yield call(searchEquipmentAsset, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetList: result.content,
            assetPagination: createPagination(result),
          },
        });
      }
    },
    // 保存资产移交归还单
    *executeAssetHandover({ payload }, { call }) {
      const result = yield call(executeAssetHandover, payload);
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
        return result;
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
        return result;
      }
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
