/**
 * model - 资产组
 * @date: 2019-1-14
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  searchAssetSet,
  searchAssetSetDetail,
  addAssetSet,
  updateAssetSet,
  searchByFullText,
} from '../../services/aafm/assetSetService';

export default {
  namespace: 'assetSet',
  state: {
    list: [], // 资产组列表
    pagination: {}, // 分页参数
    specialAsset: [], // 特殊资产类型
    detail: {}, // 资产组详情
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          specialAsset: 'AAFM.SPECIAL_ASSET',
          nameplateRule: 'AAFM.NAMEPLATE_RULE',
          assetCriticality: 'AAFM.ASSET_CRITICALITY',
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
    // 获取资产组数据列表
    *fetchAssetSet({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetSet, payload));
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
    // 获取资产组明细
    *fetchAssetSetDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetSetDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },
    // 新增资产组
    *addAssetSet({ payload }, { call }) {
      const result = yield call(addAssetSet, payload);
      return getResponse(result);
    },
    // 编辑资产组
    *updateAssetSet({ payload }, { call }) {
      const result = yield call(updateAssetSet, payload);
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
