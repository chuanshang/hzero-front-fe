/*
 * organization - 资产事务处理类型
 * @date: 2019-02-25
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { queryMapIdpValue } from 'services/api';
import { createPagination, getResponse } from 'utils/utils';
import {
  queryFixedAssetsList,
  saveData,
  deleteData,
  fetchDetailInfo,
  searchByFullText,
  searchChangeLines,
  deleteChangeLines,
} from '../../services/afam/fixedAssetsService';

export default {
  namespace: 'fixedAssets',

  state: {
    isCreateFlag: false, // 用于标识是否新增下级
    modalVisible: false, // 控制模态框显示
    dataList: [], // 列表
    pagination: {},
    detail: {},
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    changeLines: [],
    depreciationTypeCodeMap: [], // 折旧类型值集
    changeTypeCodeMap: [], // 价值变动类型值集
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          depreciationTypeCodeMap: 'AFAM.DEPRECIATION_TYPE', // 折旧类型
          changeTypeCodeMap: 'AFAM.ASSET_CHANGE_TYPE',
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
    *queryFixedAssetsList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryFixedAssetsList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },

    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: {
              ...result,
            },
          },
        });
      }
      return result;
    },
    // 明细页全文检索
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
    // 保存信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 删除
    *deleteFixedAssets({ payload }, { call }) {
      const result = yield call(deleteData, payload);
      return getResponse(result);
    },
    // 行
    *searchChangeLines({ payload }, { call, put }) {
      const result = getResponse(yield call(searchChangeLines, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            changeLines: result,
          },
        });
      }
    },
    // 删除行
    *deleteChangeLines({ payload }, { call }) {
      const result = yield call(deleteChangeLines, payload);
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
