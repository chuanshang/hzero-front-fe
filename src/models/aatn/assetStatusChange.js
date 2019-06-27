/**
 * service - 资产状态变更单
 * @date: 2019-3-28
 * @author: HBT <baitao.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchHeaderList,
  searchLineList,
  addAssetStatusChange,
  updateAssetStatusChange,
  executeAssetStatusChange,
  deleteAssetStatusChange,
  searchEquipmentAsset,
  fetchTransactionTypeLine,
  fetchDynamicFields,
  fetchDynamicLov,
  submitAssetStatusChange,
} from '../../services/aatn/assetStatusChangeService';

export default {
  namespace: 'assetStatusChange',
  state: {
    list: [], // 资产状态变更单头列表
    pagination: {}, // 分页参数
    detail: {}, // 资产状态变更单详情
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    assetList: [], // 设备资产列表
    assetPagination: {}, // 设备资产分页信息
    processStatusHeaderMap: [], // 头处理状态
    changeOrderLines: [], // 资产状态变更单行列表
    linePagination: {}, // 行分页
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
    // 获取资产状态变更单头数据列表
    *fetchHeaderList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHeaderList, payload));
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
    // 获取资产状态变更单行数据列表
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            changeOrderLines: result.content,
            linePagination: createPagination(result),
          },
        });
      }
    },
    // 获取资产状态变更单明细
    *fetchHeaderDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHeaderList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result.content[0],
          },
        });
      }
      return result;
    },
    // 新建资产状态变更单
    *addAssetStatusChange({ payload }, { call }) {
      const result = yield call(addAssetStatusChange, payload);
      return getResponse(result);
    },
    // 编辑资产状态变更单
    *updateAssetStatusChange({ payload }, { call }) {
      const result = yield call(updateAssetStatusChange, payload);
      return getResponse(result);
    },
    // 提交资产状态变更单
    *submitAssetStatusChange({ payload }, { call }) {
      const result = yield call(submitAssetStatusChange, payload);
      return getResponse(result);
    },
    // 删除资产状态变更单
    *deleteAssetStatusChange({ payload }, { call }) {
      const result = yield call(deleteAssetStatusChange, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHeaderList, payload));
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
    // 执行处理
    *executeAssetStatusChange({ payload }, { call }) {
      const result = yield call(executeAssetStatusChange, payload);
      return getResponse(result);
    },
    // 获取事务类型信息
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
