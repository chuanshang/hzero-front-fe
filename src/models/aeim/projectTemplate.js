/*
 * projectTemplate - 故障缺陷
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryProjectTemplateList,
  queryTaskTemplateList,
  queryRelsList,
  queryProjectTemplateDetail,
  queryTaskTemplateDetail,
  deleteProjectTemplate,
  deleteTaskTemplate,
  deleteRels,
  saveAddProjectTemplate,
  saveEditProjectTemplate,
  saveAddTaskTemplate,
  saveEditTaskTemplate,
} from '../../services/aeim/projectTemplateService';

export default {
  namespace: 'projectTemplate',
  state: {
    projectTemplateList: [], // 项目模版
    projectTemplatePagination: {}, // 分页信息
    projectTemplateDeatil: {}, // 详细信息
    taskTemplateList: [], // 项目任务模版
    taskTemplatePagination: {}, // 分页信息
    taskTemplateDeatil: {}, // 详细信息
    relsList: [], // 项目关系
    relsPagination: {}, // 分页信息
    projectTemplateStatusMap: [], // 项目模版状态
  },
  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          projectTemplateStatusMap: 'APPM.PROJECT_TEMPLATE_STATUS',
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

    // 查询项目模版列表信息
    *queryProjectTemplateList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProjectTemplateList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectTemplateList: result.content,
            projectTemplatePagination: createPagination(result),
          },
        });
      }
    },

    // 查询项目任务模版列表信息
    *queryTaskTemplateList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTaskTemplateList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            taskTemplateList: result.content,
            taskTemplatePagination: createPagination(result),
          },
        });
      }
    },

    // 查询任务关系列表信息
    *queryRelsList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryRelsList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            relsList: result.content,
            relsPagination: createPagination(result),
          },
        });
      }
    },

    // 查询项目模版详细信息
    *queryProjectTemplateDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProjectTemplateDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectTemplateDeatil: result,
          },
        });
      }
    },

    // 查询项目模版详细信息
    *queryTaskTemplateDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTaskTemplateDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            taskTemplateDeatil: result,
          },
        });
      }
    },

    // 删除
    *deleteProjectTemplate({ payload }, { call }) {
      const result = yield call(deleteProjectTemplate, payload);
      return getResponse(result);
    },

    // 删除
    *deleteTaskTemplate({ payload }, { call }) {
      const result = yield call(deleteTaskTemplate, payload);
      return getResponse(result);
    },

    // 删除
    *deleteRels({ payload }, { call }) {
      const result = yield call(deleteRels, payload);
      return getResponse(result);
    },

    // 保存新增信息
    *saveAddProjectTemplate({ payload }, { call }) {
      const result = yield call(saveAddProjectTemplate, payload);
      return getResponse(result);
    },

    // 保存编辑信息
    *saveEditProjectTemplate({ payload }, { call }) {
      const result = yield call(saveEditProjectTemplate, payload);
      return getResponse(result);
    },

    // 保存新增信息
    *saveAddTaskTemplate({ payload }, { call }) {
      const result = yield call(saveAddTaskTemplate, payload);
      return getResponse(result);
    },
    // 保存编辑信息
    *saveEditTaskTemplate({ payload }, { call }) {
      const result = yield call(saveEditTaskTemplate, payload);
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
