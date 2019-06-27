/*
 * WoChecklistGroups - 检查组
 * @date: 2019-05-31
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWoChecklistGroupsList,
  fetchWoChecklistGroupsDetail,
  saveEditData,
  deleteWoChecklistGroups,
} from '../../services/amtc/woChecklistGroupsService';
import { fetchWoChecklistsList, renderTreeData } from '../../services/amtc/woChecklistsService';

export default {
  namespace: 'woChecklistGroups',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 标准检查组明细
    detailList: [],
    pathMap: {},
    parentTypeMap: [],
    expandedRowKeys: [],
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
    // 查询标准检查组列表信息
    *fetchWoChecklistGroupsList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWoChecklistGroupsList, payload));
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

    // 查询标准检查组详细信息
    *fetchWoChecklistGroupsDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWoChecklistGroupsDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
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
          detailList: treeList,
          pathMap,
          expandedRowKeys,
        },
      });
    },

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },

    // 删除信息
    *deleteWoChecklistGroups({ payload }, { call }) {
      const result = yield call(deleteWoChecklistGroups, payload);
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
