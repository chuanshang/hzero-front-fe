/*
 * inspectGroup - 标准检查组
 * @date: 2019-05-17
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchInspectGroupList,
  fetchInspectGroupDetail,
  saveEditData,
  enabledInspectGroup,
  disabledInspectGroup,
  deleteInspectGroup,
  deleteChecklist,
  renderTreeData,
  fetchActChecklistsList,
} from '../../services/amtc/inspectGroupService';

export default {
  namespace: 'inspectGroup',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 标准检查组明细
    treeList: [],
    pathMap: {},
    expandedRowKeys: [],
    problemsList: [], // 问题清单行
    checkGroupTypeList: [], // 检查组类型值集
    businessScenarioList: [], // 业务场景
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          checkGroupTypeList: 'AMTC.CHECK_GROUP_TYPE',
          businessScenarioList: 'AMTC.BUSINESS_SCENARIO',
          fieldTypeList: 'AMTC.FIELD_TYPE',
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
    *fetchInspectGroupList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectGroupList, payload));
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
    *fetchInspectGroupDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectGroupDetail, payload));
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
    *fetchActChecklistsList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchActChecklistsList, payload));
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

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },

    // 删除信息
    *deleteInspectGroup({ payload }, { call }) {
      const result = yield call(deleteInspectGroup, payload);
      return getResponse(result);
    },

    // 删除检查项
    *deleteChecklist({ payload }, { call }) {
      const result = yield call(deleteChecklist, payload);
      return getResponse(result);
    },

    // 禁用
    *disabledInspectGroup({ payload }, { call }) {
      const result = yield call(disabledInspectGroup, payload);
      return getResponse(result);
    },
    // 启用
    *enabledInspectGroup({ payload }, { call }) {
      const result = yield call(enabledInspectGroup, payload);
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
