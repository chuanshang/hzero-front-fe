/**
 * model - 资产专业管理
 * @date: 2019-02-25
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  searchAssetSpecialty,
  searchAssetSpecialtyDetail,
  addAssetSpecialty,
  updateAssetSpecialty,
  searchByFullText,
} from '../../services/aafm/assetSpecialtyService';

export default {
  namespace: 'assetSpecialty',
  state: {
    list: [], // 资产专业管理列表
    pagination: {}, // 分页参数
    detail: {}, // 资产专业管理详情
    detailList: [], // 明细页行数据列表
    detailPagination: {}, // 明细页行数据分页信息
    fullList: [], // 明细页数据检索数据列表
    fullPagination: {}, // 明细页数据检索分页信息
  },
  effects: {
    // 获取资产专业管理数据列表
    *fetchAssetSpecialty({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetSpecialty, payload));
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
    // 获取资产专业管理明细
    *fetchAssetSpecialtyDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetSpecialtyDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            detailList: result.assetToOrgList.content,
            detailPagination: createPagination(result),
          },
        });
      }
    },
    // 新增资产专业管理
    *addAssetSpecialty({ payload }, { call }) {
      const result = yield call(addAssetSpecialty, payload);
      return getResponse(result);
    },
    // 编辑资产专业管理
    *updateAssetSpecialty({ payload }, { call }) {
      const result = yield call(updateAssetSpecialty, payload);
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
