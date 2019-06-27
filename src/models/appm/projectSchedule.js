/*
 * model - 项目进度
 * @date: 2019-3-11
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { isNull } from 'lodash';
import { queryMapIdpValue } from 'services/api';
import {
  fetchProjectSchedule,
  fetchProjectScheduleHistory,
  saveData,
  submitData,
  searchWorkList,
  operateWorkList,
  completeSchedule,
  resetSchedule,
  uploadAttachment,
} from '../../services/appm/projectScheduleService';

export default {
  namespace: 'projectSchedule',
  state: {
    listMap: new Map(),
    historyList: [],
    list: [], // 项目进度列表
    pagination: {}, // 分页参数
    priorityMap: [], // 优先级
    riskLevelMap: [], // 风险等级
    taskTypeMap: [], // 任务类型
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          priorityMap: 'HALM.PRIORITY', // 优先级
          riskLevelMap: 'APPM.WBS.RISK_LEVEL', // 风险等级
          taskTypeMap: 'APPM.WBS.TASK_TYPE', // 任务类型
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
    // 获取项目进度列表
    *fetchProjectSchedule({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectSchedule, payload));
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
    // 获取项目历史进度列表
    *fetchProjectScheduleHistory({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectScheduleHistory, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: result,
          },
        });
      }
      return result;
    },
    // 新增项目基础信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 编辑项目基础信息
    *submitData({ payload }, { call }) {
      const result = yield call(submitData, payload);
      return getResponse(result);
    },
    // 查询工作清单列表
    *fetchWorkList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchWorkList, payload));
      if (result) {
        let fileMap = {};
        result.content.forEach(item => {
          const list = isNull(item.workListItems) ? [] : item.workListItems;
          fileMap = { ...fileMap, [item.workListId]: list };
        });
        yield put({
          type: 'updateState',
          payload: {
            fileMap,
            workList: result.content,
          },
        });
      }
    },
    // 工作清单操作
    *operateWorkList({ payload }, { call }) {
      const result = yield call(operateWorkList, payload);
      return getResponse(result);
    },
    // 完成进度
    *completeSchedule({ payload }, { call }) {
      const result = yield call(completeSchedule, payload);
      return getResponse(result);
    },
    // 取消完成进度
    *resetSchedule({ payload }, { call }) {
      const result = yield call(resetSchedule, payload);
      return getResponse(result);
    },
    // 交付物上传
    *uploadAttachment({ payload }, { call }) {
      const result = yield call(uploadAttachment, payload);
      return getResponse(result);
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
