/**
 * model - WBS结构模板
 * @date: 2019-3-11
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { isNull, isEmpty } from 'lodash';
import { queryMapIdpValue } from 'services/api';
import { getResponse } from 'utils/utils';
import {
  searchTaskTemplate,
  searchTaskDetail,
  searchTaskRelation,
  deleteTask,
  deleteTaskRelation,
  searchProjectTemplate,
  searchProjectRole,
  saveTaskLine,
  renderTreeData,
  setLevel,
  queryDeleteList,
  searchWorkList,
  saveWorkList,
  deleteWorkList,
  deleteFile,
  saveTaskLines,
} from '../../services/appm/taskTemplateService';

export default {
  namespace: 'taskTemplate',
  state: {
    projectTemplate: {}, // WBS关联项目模板信息
    taskList: [], // WBS任务列表
    pathMap: {}, // 层次结构路径
    levelMap: {}, // 层次编号
    expandedRowKeys: [], // 展开节点Id
    taskDetail: {}, // 任务明细
    taskRelation: [], // 任务间关系
    taskRelationModal: [], // 弹窗中的任务间关系
    projectRole: [], // 项目角色
    planMode: [], // 计划模式
    priority: [], // 优先级
    relationType: [], // 关系类型
    workList: [], // 工作清单
    fileMap: {}, // 每个工作清单对应的fileList
    roles: [], // 项目模板中的所有角色
  },
  effects: {
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          planMode: 'APPM.WBS.PLAN_MODE',
          priority: 'HALM.PRIORITY',
          relationType: 'APPM.WBS.RELATION_TYPE', // 关系类型
          taskType: 'APPM.WBS.TASK_TYPE', // 任务类型
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
    // 获取项目模板信息
    *fetchProjectTemplate({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProjectTemplate, payload));
      if (result) {
        // 提取项目模板中的所有角色
        const roles = [];
        roles.push(result.pmoRoleId);
        roles.push(result.picRoleId);
        const otherRoles = JSON.parse(result.otherRoles);
        otherRoles.forEach(item => {
          roles.push(Number(item));
        });
        yield put({
          type: 'updateState',
          payload: {
            roles,
            projectTemplate: {
              ...result,
              otherRoles: isNull(result.otherRoles) ? [] : JSON.parse(result.otherRoles),
            },
          },
        });
      }
    },
    // 获取WBS结构模板数据
    *fetchTaskTemplate({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTaskTemplate, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      let tempMap = {};
      const levelMap = setLevel(treeList, {});
      // 编号第一个号码减一
      Object.keys(levelMap).forEach(item => {
        const temp = levelMap[item];
        temp[0] -= 1;
        tempMap = { ...tempMap, [item]: temp };
      });
      if (result) {
        const expandedRowKeys = Object.keys(pathMap).map(item => +item);
        yield put({
          type: 'updateState',
          payload: {
            pathMap,
            levelMap: tempMap,
            expandedRowKeys,
            taskList: treeList,
          },
        });
      }
    },
    // 获取任务明细
    *fetchTaskDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTaskDetail, payload));
      if (result) {
        const { otherRoles = '' } = result;
        yield put({
          type: 'updateState',
          payload: {
            taskDetail: {
              ...result,
              otherRoles: isEmpty(otherRoles) ? [] : otherRoles.split(','),
              // taskRelation: result.taskTemplateRelsList,
            },
          },
        });
      }
    },
    // 获取任务间关系列表
    *fetchTaskRelation({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTaskRelation, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            taskRelation: result.content,
          },
        });
      }
    },
    // 获取任务间关系列表
    // 为了区分同时打开入口列表的关系弹窗的数据源以及右滑窗的数据源
    *fetchTaskRelationModal({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTaskRelation, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            taskRelationModal: result.content,
          },
        });
      }
    },
    // 获取项目角色
    *fetchProjectRole({ payload }, { call, put }) {
      const result = getResponse(yield call(searchProjectRole, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectRole: result.content.map(i => ({ value: i.proRoleId, meaning: i.roleCode })),
          },
        });
      }
    },
    // 保存WBS任务
    *saveTask({ payload }, { call }) {
      const result = yield call(saveTaskLine, payload);
      return getResponse(result);
    },
    // 批量保存WBS任务
    *saveTasks({ payload }, { call }) {
      const result = yield call(saveTaskLines, payload);
      return getResponse(result);
    },
    // 删除任务行
    *deleteTask({ payload }, { call }) {
      const result = yield call(deleteTask, payload);
      return getResponse(result);
    },
    // 删除任务间关系
    *deleteTaskRelation({ payload }, { call }) {
      const result = yield call(deleteTaskRelation, payload);
      return getResponse(result);
    },
    // 删除任务时查询受影响的任务
    *queryDeleteList({ payload }, { call }) {
      const result = getResponse(yield call(queryDeleteList, payload));
      return result;
    },
    // 查询工作清单列表
    *fetchWorkList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchWorkList, payload));
      if (result) {
        let fileMap = {};
        result.content.forEach(item => {
          const list = isNull(item.taskWorkListItemList) ? [] : item.taskWorkListItemList;
          fileMap = { ...fileMap, [item.taskListId]: list };
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
    // 保存工作清单
    *saveWorkList({ payload }, { call }) {
      const result = getResponse(yield call(saveWorkList, payload));
      return result;
    },
    // 删除工作清单
    *deleteWorkList({ payload }, { call }) {
      const result = getResponse(yield call(deleteWorkList, payload));
      return result;
    },
    // 删除文件
    *deleteFile({ payload }, { call }) {
      const result = getResponse(yield call(deleteFile, payload));
      return result;
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
