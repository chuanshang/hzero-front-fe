/**
 * Service - 资产报废单
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchEquipmentAsset,
  fetchEquipmentAssetByParam,
  searchAssetStatus,
  addAssetScrap,
  updateAssetScrap,
  deleteAssetScrap,
  listAssetScrap,
  detailAssetScrap,
  fullTextSearch,
  confirmAssetScrapLine,
  selectTransationTypeField,
  fetchDynamicColumn,
  fetchDynamicLov,
  submitApprovalRequest,
} from '../../services/aatn/assetScrapService';

export default {
  namespace: 'assetScrap',
  state: {
    list: [], // 列表
    pagination: {}, // 分页参数
    fullPagination: {},
    fullList: [], // 明细页数据检索数据列表
    lineList: [], // 资产报废单行列表
    assetList: [], // 设备资产列表
    assetStatusList: [], // 资产状态
    processStatusHeaderMap: [], // 头处理状态
    scrapLineProcessStatusMap: [], // 行处理状态
    scrapTypeMap: [], // 资产报废类型LOV
    disposeTypeLovMap: [], // 资产处置类型下拉列表显示值集
    transationTypeFieldList: [], // 动态字段列表
    detail: {}, // 资产报废详情
  },
  effects: {
    // 动态获取Lov信息
    *fetchDynamicLov({ payload }, { call }) {
      const result = getResponse(yield call(fetchDynamicLov, payload));
      return result;
    },
    // 获取单据动态字段
    *fetchDynamicColumn({ payload }, { call }) {
      const result = getResponse(yield call(fetchDynamicColumn, payload));
      return result;
    },
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
    // 动态获取页面下拉列表显示值集
    *fetchDynamicValueListLov({ payload }, { call }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          ...payload,
        })
      );
      return result;
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
      return result.content;
    },
    // 通过各种参数查询资产
    *fetchEquipmentAssetByParam({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchEquipmentAssetByParam, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetList: result.content,
            assetPagination: createPagination(result),
          },
        });
      }
      return result.content;
    },
    // 资产报废全文搜索
    *fullTextSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(fullTextSearch, payload));
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
    // 获取资产状态
    *fetchAssetStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetStatus, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetStatusList: result.content,
            assetPagination: createPagination(result),
          },
        });
      }
    },
    // 新增资产报废数据
    *addAssetScrap({ payload }, { call }) {
      const result = yield call(addAssetScrap, payload);
      return getResponse(result);
    },
    // 删除资产报废数据
    *deleteAssetScrap({ payload }, { call }) {
      const result = yield call(deleteAssetScrap, payload);
      return getResponse(result);
    },
    // 更新资产报废数据
    *updateAssetScrap({ payload }, { call }) {
      const result = yield call(updateAssetScrap, payload);
      return getResponse(result);
    },
    // 资产报废行确认
    *confirmAssetScrapLine({ payload }, { call }) {
      const result = yield call(confirmAssetScrapLine, payload);
      return getResponse(result);
    },
    // 资产报废数据list界面查询
    *listAssetScrap({ payload }, { call, put }) {
      const result = yield call(listAssetScrap, payload);
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
    // 资产报废详细界面查询
    *detailAssetScrap({ payload }, { call, put }) {
      const result = yield call(detailAssetScrap, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            lineList: result.scrapOrderLines,
          },
        });
        return getResponse(result);
      }
    },
    // 事件类型动态字段查询
    *selectTransationTypeField({ payload }, { call, put }) {
      const result = yield call(selectTransationTypeField, payload);
      let basicAssetColumnList = [];
      let trackingManagementColumnList = [];
      if (result.basicAssetColumnList !== null) {
        basicAssetColumnList = [...result.basicAssetColumnList];
      }
      if (result.trackingManagementColumnList !== null) {
        trackingManagementColumnList = [...result.trackingManagementColumnList];
      }
      const filedResult = [...basicAssetColumnList, ...trackingManagementColumnList];
      if (filedResult) {
        yield put({
          type: 'updateState',
          payload: {
            transationTypeFieldList: filedResult,
          },
        });
      }
      return filedResult;
    },
    // 提交审批
    *submitApprovalRequest({ payload }, { call }) {
      const result = yield call(submitApprovalRequest, payload);
      if (result) {
        return getResponse(result);
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
