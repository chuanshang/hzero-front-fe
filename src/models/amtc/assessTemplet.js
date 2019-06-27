/*
 * assessTemplet - 服务评价
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryAssessTempletList,
  queryTempletItemsList,
  queryProblemList,
  fetchDetailInfo,
  fetchTempletItemsDetailInfo,
  saveEditData,
  saveAddData,
  saveTempletItemsEditData,
  saveTempletItemsAddData,
  enabledAssessTemplet,
  disabledAssessTemplet,
  deleteTempletItems,
  deleteProblem,
} from '../../services/amtc/assessTempletService';

export default {
  namespace: 'assessTemplet',
  state: {
    assessTempletList: [], // 服务评价
    assessTempletPagination: {},
    assessTempletDetail: {}, // 服务评价详细信息
    templetItemsList: [], // 评估项
    templetItemsPagination: {},
    templetItemsDetail: {}, // 评估项详情
    templetProblems: [], // 问题清单
    problemPagination: {},
    evaluationPointMap: [], // 评价时点
    enableFlags: [], // 状态
    relateObjectCodeMap: [], // 关联对象值
    valueTypeCodeMap: [], // 字段类型
    yesOrNoMap: [], // 是否
    startMap: [], // 最高星级
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          evaluationPointMap: 'AMTC.EVALUATION_POINT', // 评价时点
          enableFlags: 'AMTC.ENABLE_FLAG', // 状态
          relateObjectCodeMap: 'HPFM.FLAG', // 关联对象值
          valueTypeCodeMap: 'AMTC.FIELD_TYPE',
          yesOrNoMap: 'HPFM.FLAG', // 是否
          startMap: 'AMTC.STAR_CODES', // 最高星级
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

    // 查询服务评级模板列表信息
    *queryAssessTempletList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryAssessTempletList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assessTempletList: result.content,
            assessTempletPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估项关联对象列表信息
    *queryTempletItemsList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTempletItemsList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templetItemsList: result.content,
            templetItemsPagination: createPagination(result),
          },
        });
      }
    },

    // 查询评估项关联对象列表信息
    *queryTempletProblems({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProblemList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templetProblems: result.content,
            problemPagination: createPagination(result),
          },
        });
      }
    },

    // 查询故障缺陷评估项详细信息
    *fetchAssessTempletDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assessTempletDetail: result,
          },
        });
      }
    },

    // 查询故障缺陷评估项详细信息
    *fetchTempletItemsDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTempletItemsDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templetItemsDetail: result,
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
    // 保存编辑信息
    *saveTempletItemsEditData({ payload }, { call }) {
      const result = yield call(saveTempletItemsEditData, payload);
      return getResponse(result);
    },

    // 保存新增信息
    *saveTempletItemsAddData({ payload }, { call }) {
      const result = yield call(saveTempletItemsAddData, payload);
      return getResponse(result);
    },

    // 禁用
    *disabledAssessTemplet({ payload }, { call }) {
      const result = yield call(disabledAssessTemplet, payload);
      return getResponse(result);
    },
    // 启用
    *enabledAssessTemplet({ payload }, { call }) {
      const result = yield call(enabledAssessTemplet, payload);
      return getResponse(result);
    },
    // 删除
    *deleteTempletItems({ payload }, { call }) {
      const result = yield call(deleteTempletItems, payload);
      return getResponse(result);
    },
    // 删除
    *deleteProblem({ payload }, { call }) {
      const result = yield call(deleteProblem, payload);
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
