/**
 * model - 调拨转移单
 * @date: 2019-03-20
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchTransferOrder,
  fetchTransferOrderDetail,
  addTransferOrder,
  updateTransferOrder,
  searchByFullText,
  fetchTransferOrderLine,
  searchEquipmentAsset,
  confirmTransferOrderLine,
  fetchTransactionTypeLine,
  searchEquipmentAssetDetail,
  fetchDynamicColumnLine,
  fetchDynamicLov,
  commitTransferOrder,
} from '../../services/aatn/transferOrderService';

export default {
  namespace: 'transferOrder',
  state: {
    approveStatus: [], // 处理状态值集
    transferOrderLineStatus: [], // 行处理状态值集
    list: [], // 调拨转移单列表
    pagination: {}, // 分页参数
    detail: {}, // 调拨转移单详情
    detailList: [], // 明细页行数据列表
    detailPagination: {}, // 明细页行数据分页信息
    fullList: [], // 明细页数据检索数据列表
    fullPagination: {}, // 明细页数据检索分页信息
    assetDetail: {}, // 资产数据明细
    assetList: [], // 资产数据列表
    assetPagination: {}, // 资产数据分页信息
    transactionTypeList: [], // 事务处理行数据列表
    transferTypeList: [], // 动态列表行
    dynamicColumn: [], // 已经保存的动态字段
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          approveStatus: 'HALM.APPROVE_STATUS',
          transferOrderLineStatus: 'AATN.TRANSFER_ORDER_LINE_STATUS',
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
    // 动态获取Lov信息
    *fetchDynamicLov({ payload }, { call }) {
      const result = getResponse(yield call(fetchDynamicLov, payload));
      return result;
    },
    // 动态获取页面下拉列表显示值集
    *fetchDynamicValueListLov({ payload }, { call }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          ...payload,
        })
      );
      return result;
    },
    // 获取调拨转移单
    *fetchTransferOrder({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTransferOrder, payload));
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
    // 获取调拨转移单明细
    *fetchTransferOrderDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTransferOrderDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result.content[0],
          },
        });
      }
      return result.content[0];
    },
    // 获取调拨转移单明细
    *fetchTransferOrderLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTransferOrderLine, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailPagination: createPagination(result),
          },
        });
      }
    },
    // 新增调拨转移单
    *addTransferOrder({ payload }, { call }) {
      const result = yield call(addTransferOrder, payload);
      return getResponse(result);
    },
    // 编辑调拨转移单
    *updateTransferOrder({ payload }, { call }) {
      const result = yield call(updateTransferOrder, payload);
      return getResponse(result);
    },
    // 行数据 调入/调出
    *confirmTransferOrderLine({ payload }, { call }) {
      const result = yield call(confirmTransferOrderLine, payload);
      return getResponse(result);
    },
    // 调拨单提交
    *commitTransferOrder({ payload }, { call }) {
      const result = yield call(commitTransferOrder, payload);
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
    // 获取设备资产列表
    *searchEquipmentAssetDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchEquipmentAssetDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetDetail: result,
          },
        });
      }
      return result;
    },
    // 获取事务处理行列表
    *fetchTransactionTypeLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTransactionTypeLine, payload));
      const { basicAssetColumnList = [], trackingManagementColumnList = [] } = result;
      const columnListAsset = basicAssetColumnList === null ? [] : basicAssetColumnList;
      const columnListTracking =
        trackingManagementColumnList === null ? [] : trackingManagementColumnList;
      const dynamicFields = [...columnListAsset, ...columnListTracking];
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            transactionTypeList: result,
            transferTypeList: dynamicFields,
          },
        });
      }
      return dynamicFields;
    },
    // 获取行动态字段
    *fetchDynamicColumnLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDynamicColumnLine, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dynamicColumn: result,
          },
        });
        return result;
      }
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
