/**
 * model - 资产处置单
 * @date: 2019-03-20
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchDisposeOrder,
  fetchDisposeOrderDetail,
  fetchDisposeOrderLine,
  addDisposeOrder,
  updateDisposeOrder,
  deleteDisposeOrder,
  searchFullText,
  searchEquipmentAsset,
  disposeOrderConfirm,
  fetchTransactionTypeLine,
  searchEquipmentAssetDetail,
  fetchAssetStatus,
  fetchDynamicColumnLine,
  fetchDynamicLov,
  commitDisposeOrder,
} from '../../services/aatn/disposeOrderService';

export default {
  namespace: 'disposeOrder',
  state: {
    approveStatus: [], // 处理状态值集
    disposeLineStatus: [], // 行处理状态值集
    list: [], // 资产处置单列表
    pagination: {}, // 分页参数
    detail: {}, // 资产处置单详情
    detailList: [], // 明细页行数据列表
    detailPagination: {}, // 明细页行数据分页信息
    fullList: [], // 明细页数据检索数据列表
    fullPagination: {}, // 明细页数据检索分页信息
    assetDetail: {}, // 资产数据明细
    assetList: [], // 资产数据列表
    assetPagination: {}, // 资产数据分页信息
    disposeTypeList: [], // 事务处理行数据列表
    assetStatus: {}, // 资产状态
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          approveStatus: 'HALM.APPROVE_STATUS',
          disposeLineStatus: 'AATN.DISPOSE_LINE_STATUS',
          disposeType: 'AATN.DISPOSE_TYPE', // 资产处置类型
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
    // 获取资产处置单
    *fetchDisposeOrder({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDisposeOrder, payload));
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
    // 获取资产处置单明细
    *fetchDisposeOrderDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDisposeOrderDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            detailList: result.disposeOrderLines,
          },
        });
      }
      return result;
    },
    // 获取资产处置单明细
    *fetchDisposeOrderLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDisposeOrderLine, payload));
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
    // 新增资产处置单
    *addDisposeOrder({ payload }, { call }) {
      const result = yield call(addDisposeOrder, payload);
      return getResponse(result);
    },
    // 编辑资产处置单
    *updateDisposeOrder({ payload }, { call }) {
      const result = yield call(updateDisposeOrder, payload);
      return getResponse(result);
    },
    // 删除资产处置单
    *deleteDisposeOrder({ payload }, { call }) {
      const result = yield call(deleteDisposeOrder, payload);
      return getResponse(result);
    },
    // 行数据 处置
    *disposeOrderConfirm({ payload }, { call }) {
      const result = yield call(disposeOrderConfirm, payload);
      return getResponse(result);
    },
    // 处置单提交
    *commitDisposeOrder({ payload }, { call }) {
      const result = yield call(commitDisposeOrder, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchFullText, payload));
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
            transferTypeList: dynamicFields,
          },
        });
      }
      return dynamicFields;
    },
    // 获取资产状态 (目标资产状态默认值)
    *fetchAssetStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAssetStatus, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetStatus: result.content[0],
          },
        });
      }
    },
    // 获取行动态字段
    *fetchDynamicColumnLine({ payload }, { call }) {
      const result = getResponse(yield call(fetchDynamicColumnLine, payload));
      return result;
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
