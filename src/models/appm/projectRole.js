/**
 * model - 项目角色
 * @date: 2019-02-21
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchProjectRole,
  saveProjectRole,
  queryRolePermission,
  updateRolePermission,
} from '../../services/appm/projectRoleService';

export default {
  namespace: 'projectRole',
  state: {
    roleList: [], // 角色列表
    pagination: {}, // 分页参数
    projectRoleType: [], // 角色类型
    planPermissions: [], // 计划权限
    changePermissions: [], // 变更权限
    flag: [], // 是否标记
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'HPFM.FLAG',
          projectRoleType: 'APPM.PROJECT_ROLE_TYPE',
          planPermissions: 'APPM.PLAN_PERMISSIONS',
          changePermissions: 'APPM.CHANGE_PERMISSIONS',
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
    // 获取项目角色
    *fetchProjectRole({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectRole, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            roleList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 更新项目角色
    *saveProjectRole({ payload }, { call }) {
      const result = yield call(saveProjectRole, payload);
      return getResponse(result);
    },
    // 获取角色管理的权限
    *fetchPermission({ payload }, { call }) {
      const result = yield call(queryRolePermission, payload);
      return getResponse(result);
    },
    *savePermission({ payload }, { call }) {
      const result = yield call(updateRolePermission, payload);
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
