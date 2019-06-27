/*
 * model - wbs计划
 * @date: 2019-3-11
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { isEmpty, isNull } from 'lodash';
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  renderTreeData,
  queryWBSPlanMaintainList,
  fetchDetailInfo,
  saveData,
  searchWBSPlanHeader,
  queryUserList,
  submitWBS,
  deleteWBS,
  setLevel,
  queryDeleteList,
  searchWorkList,
  saveWorkList,
  deleteWorkList,
  deleteFile,
  fetchBaseLine,
  saveBaseLine,
  deleteRels,
} from '../../services/appm/wbsPlanMaintainService';

export default {
  namespace: 'wbsPlanMaintain',

  state: {
    projectWbsScheduleList: [], // 进度列表
    projectWbsRelsList: [], // 任务关系列表
    otherUsers: [], // 参与人
    otherRoles: [], // 参与角色
    deleteRows: [], // 需删除的任务列表
    treeList: [], // 任务列表
    taskRelationList: [], // 任务关系列表
    wbsPlanHeader: [], // 头内容信息
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [],
    detail: {}, // 组织详情页数据
    planModeMap: [], // 计划模式
    taskTypeMap: [], // 任务类型
    taskStatusMap: [], // 任务状态
    priorityMap: [], // 优先级
    riskLevelMap: [], // 风险等级
    relationTypeMap: [], // 关系类型
    levelMap: {}, // 层次编号
    workList: [], // 工作清单列表
    fileMap: {}, // 每个工作清单对应的fileList
    baseLines: [], // 基线列表
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          planModeMap: 'APPM.WBS.PLAN_MODE', // 计划模式
          taskTypeMap: 'APPM.WBS.TASK_TYPE', // 任务类型
          taskStatusMap: 'APPM.WBS.TASK_STATUS', // 任务状态
          priorityMap: 'HALM.PRIORITY', // 优先级
          riskLevelMap: 'APPM.WBS.RISK_LEVEL', // 风险等级
          relationTypeMap: 'APPM.WBS.RELATION_TYPE', // 关系类型
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
    *searchWBSPlanHeader({ payload }, { call, put }) {
      const result = getResponse(yield call(searchWBSPlanHeader, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            wbsPlanHeader: result[0],
          },
        });
      }
      return result;
    },
    // 任务列表查询
    *queryWBSPlanMaintainList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWBSPlanMaintainList, payload));
      const { treeList, pathMap, limitTime } = renderTreeData(result, {}, 0, {
        minStartDate: result.length > 1 ? result[1].startDate : null,
        maxEndDate: result.length > 1 ? result[1].endDate : null,
      });
      const levelMap = setLevel(treeList, {});
      let tempMap = {};
      // 编号第一个号码减一
      Object.keys(levelMap).forEach(item => {
        const temp = levelMap[item];
        temp[0] -= 1;
        tempMap = { ...tempMap, [item]: temp };
      });
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      yield put({
        type: 'updateState',
        payload: {
          treeList,
          pathMap,
          limitDate: limitTime,
          levelMap: tempMap,
          expandedRowKeys,
        },
      });
      return result;
    },
    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        const { otherPerson = '', otherRoles = '' } = result;
        yield put({
          type: 'updateState',
          payload: {
            detail: {
              ...result,
              otherPerson: isEmpty(otherPerson) ? [] : otherPerson.split(','),
              otherRoles: isEmpty(otherRoles) ? [] : otherRoles.split(','),
            },
            taskRelationList: result.projectWbsRelsList,
          },
        });
      }
      return result;
    },

    // 保存任务信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 提交任务信息
    *submitWBS({ payload }, { call }) {
      const result = yield call(submitWBS, payload);
      return getResponse(result);
    },
    // 删除任务信息
    *deleteWBS({ payload }, { call }) {
      const result = yield call(deleteWBS, payload);
      return getResponse(result);
    },
    // 删除任务间关系
    *deleteRels({ payload }, { call }) {
      const result = yield call(deleteRels, payload);
      return getResponse(result);
    },
    // 禁用“位置行”
    // *forbidLine({ payload }, { call }) {
    //   const result = yield call(forbidLine, payload);
    //   return getResponse(result);
    // },
    // 启用“位置行”
    // *enabledLine({ payload }, { call }) {
    //   const result = yield call(enabledLine, payload);
    //   return getResponse(result);
    // },
    *queryUserList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryUserList, payload));
      if (result) {
        const userList = result.content.map(item => ({
          value: item.staffId,
          meaning: item.staffName,
          proRoleId: item.proRoleId,
        }));
        const roleList = result.content.map(item => ({
          value: item.proRoleId,
          meaning: item.proRoleName,
          staffId: item.staffId,
        }));
        const userRes = new Map();
        const roleRes = new Map();
        yield put({
          type: 'updateState',
          payload: {
            otherUsers: userList.filter(a => !userRes.has(a.value) && userRes.set(a.value, 1)),
            otherRoles: roleList.filter(a => !roleRes.has(a.value) && roleRes.set(a.value, 1)),
          },
        });
      }
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
    // 获取基线列表
    *fetchBaseLine({ payload }, { call }) {
      const result = getResponse(yield call(fetchBaseLine, payload));
      return result;
    },
    // 保存基线
    *saveBaseLine({ payload }, { call }) {
      const result = getResponse(yield call(saveBaseLine, payload));
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
