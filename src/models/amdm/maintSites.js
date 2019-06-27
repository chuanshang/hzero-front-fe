/**
 * maintSite - 服务区域
 * @date: 2019-1-7
 * @author: HBT <baitao.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import {
  queryMaintSitesList,
  addMaintSites,
  queryDetail,
  saveDetail,
  searchByFullText,
} from '../../services/amdm/maintSitesService';

export default {
  namespace: 'maintSites',
  state: {
    maintSitesList: [],
    pagination: {},
    detail: {},
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
  },
  effects: {
    // 查询服务区域列表
    *queryMaintSitesList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMaintSitesList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            maintSitesList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 添加服务区域
    *addMaintSites({ payload }, { call }) {
      const result = yield call(addMaintSites, payload);
      return getResponse(result);
    },
    // 查询服务区域明细
    *queryDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDetail, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detail: res,
          },
        });
      }
      return res;
    },
    // 保存服务区域明细
    *saveDetail({ data }, { call }) {
      const res = getResponse(yield call(saveDetail, data));
      return res;
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
