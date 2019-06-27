/*
 * model - 项目基础信息
 * @date: 2019-2-25
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { isUndefined } from 'lodash';
import { queryMapIdpValue } from 'services/api';
import {
  searchProBasicInfo,
  deleteProBasicInfo,
  searchProBasicInfoDetail,
  addProBasicInfo,
  updateProBasicInfo,
  submitProBasicInfo,
  searchProjectSourceInfo,
  deleteProjectSource,
  searchWBSPlan,
  searchProjectStatus,
  searchProjectBudgets,
  initProjectBudget,
} from '../../services/appm/proBasicInfoService';

export default {
  namespace: 'proBasicInfo',
  state: {
    wbsPlanList: [], // wbs计划头列表
    list: [], // 项目基础信息列表
    pagination: {}, // 分页参数
    detail: {}, // 项目基础信息详情
    projectSourceList: [], // 项目基础信息详情中的项目资源列表
    proSourcePagination: {}, // 项目资源列表分页参数
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    modalVisible: false, // 控制模态框显示
    priorityMap: [], // 优先级
    heathMap: [], // 健康状态
    projectStatus: [], // 项目状态
    proBudgetList: [], // 项目预算列表
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          priorityMap: 'HALM.PRIORITY', // 优先级
          heathMap: 'APPM.HEALTH', // 健康状态
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
    // 获取WBS计划头列表
    *fetchWbsPain({ payload }, { call, put }) {
      const result = getResponse(yield call(searchWBSPlan, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            wbsPlanList: result,
          },
        });
      }
    },
    // 获取项目基础信息列表
    *fetchPropBasicInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProBasicInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取项目资源信息列表
    *fetchProjectSourceInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProjectSourceInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectSourceList: isUndefined(result.content) ? [] : result.content,
            proSourcePagination: createPagination(result),
          },
        });
      }
      return result.content;
    },
    // 获取项目基础信息明细
    *fetchPropBasicInfoDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProBasicInfoDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
      return result;
    },
    // 获取项目状态列表
    *fetchProjectStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProjectStatus, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectStatus: result.content,
          },
        });
      }
      return result.content;
    },
    // 新增项目基础信息
    *addProBasicInfo({ payload }, { call }) {
      const result = yield call(addProBasicInfo, payload);
      return getResponse(result);
    },
    // 编辑项目基础信息
    *updateProBasicInfo({ payload }, { call }) {
      const result = yield call(updateProBasicInfo, payload);
      return getResponse(result);
    },
    // 提交项目基础信息审批
    *submitProBasicInfo({ payload }, { call }) {
      const result = yield call(submitProBasicInfo, payload);
      return getResponse(result);
    },
    // 删除项目基础信息
    *deletePropBasicInfo({ payload }, { call }) {
      const result = yield call(deleteProBasicInfo, payload);
      return getResponse(result);
    },
    // 删除项目资源信息
    *deleteProjectSourceInfo({ payload }, { call }) {
      const result = yield call(deleteProjectSource, payload);
      return getResponse(result);
    },
    // 明细页数据检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProBasicInfo, payload));
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
    // 获取项目预算头列表
    *fetchProjectBudgets({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProjectBudgets, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            proBudgetList: result,
          },
        });
      }
    },
    // 初始化拟定版本项目预算
    *initProjectBudget({ payload }, { call }) {
      const result = getResponse(yield call(initProjectBudget, payload));
      return result;
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
