/*
 * WoChecklists - 检查项
 * @date: 2019-05-31
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWoChecklistsList,
  fetchWoChecklistsDetail,
  saveEditData,
  deleteWoChecklists,
  renderTreeData,
} from '../../services/amtc/woChecklistsService';

export default {
  namespace: 'woChecklists',
  state: {
    detail: {}, // 标准检查项明细
    parentTypeMap: [],
    fieldTypeList: [],
    businessScenarioList: [],
    treeList: [],
    pathMap: {},
    expandedRowKeys: [],
    detailList: [],
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          parentTypeMap: 'AMTC.WO_RELATION_PARENT_TYPE',
          fieldTypeList: 'AMTC.FIELD_TYPE',
          businessScenarioList: 'AMTC.BUSINESS_SCENARIO',
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
    // 查询标准检查项列表信息
    *fetchWoChecklistsList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWoChecklistsList, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      yield put({
        type: 'updateState',
        payload: {
          treeList,
          pathMap,
          expandedRowKeys,
        },
      });
    },

    // 查询标准检查项详细信息
    *fetchWoChecklistsDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWoChecklistsDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
    },

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },

    // 删除信息
    *deleteWoChecklists({ payload }, { call }) {
      const result = yield call(deleteWoChecklists, payload);
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
