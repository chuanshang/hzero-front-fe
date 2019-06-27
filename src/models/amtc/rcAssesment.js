/*
 * rcSystem - 故障缺陷
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryRcSystemList,
  queryEvaluateObjectsList,
  queryEvaluateCodesList,
  fetchDetailInfo,
  saveEditData,
  saveAddData,
  enabledRcSystem,
  disabledRcSystem,
  renderTreeData,
  deleteEvaluateObjects,
  deleteEvaluateCodes,
} from '../../services/amtc/rcAssesmentService';

export default {
  namespace: 'rcAssesment',
  state: {
    rcAssesmentList: [], // 故障缺陷评估项
    rcAssesmentPagination: {},
    detail: {}, // 故障缺陷评估项详细信息
    evaluateObjectsList: [], // 评估项关联对象
    evaluateObjectsPagination: {},
    evaluateCodesTreeList: [], // 评估对象代码
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [], // 可展开的行数据key集合
    objectTypeCodeMap: [], // 对象类型
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          objectTypeCodeMap: 'AMTC.FAULTDEFECT_OBJECTTYPE', // 计算公式
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

    // 查询故障缺陷评估项列表信息
    *queryRcSystemList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryRcSystemList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rcAssesmentList: result.content,
            rcAssesmentPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估项关联对象列表信息
    *queryEvaluateObjectsList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryEvaluateObjectsList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            evaluateObjectsList: result.content,
            evaluateObjectsPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估对象代码列表信息
    *queryEvaluateCodesList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryEvaluateCodesList, payload));
      const { evaluateCodesTreeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            evaluateCodesTreeList,
            pathMap,
            expandedRowKeys,
          },
        });
      }
    },

    // 查询故障缺陷评估项详细信息
    *fetchRcSystemDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
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

    // 保存新增信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
      return getResponse(result);
    },

    // 禁用
    *disabledRcSystem({ payload }, { call }) {
      const result = yield call(disabledRcSystem, payload);
      return getResponse(result);
    },
    // 启用
    *enabledRcSystem({ payload }, { call }) {
      const result = yield call(enabledRcSystem, payload);
      return getResponse(result);
    },
    // 删除
    *deleteEvaluateObjects({ payload }, { call }) {
      const result = yield call(deleteEvaluateObjects, payload);
      return getResponse(result);
    },
    // 删除
    *deleteEvaluateCodes({ payload }, { call }) {
      const result = yield call(deleteEvaluateCodes, payload);
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
