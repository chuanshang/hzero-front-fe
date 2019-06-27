/**
 * model - 项目模板
 * @date: 2019-3-6
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { isNull } from 'lodash';
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  saveTemplate,
  removeTemplate,
  submitTemplate,
  fetchProjectTemplate,
  fetchTemplateDetail,
  searchProjectRole,
  searchHistory,
} from '../../services/appm/projectTemplateService';

export default {
  namespace: 'projectTemplate',
  state: {
    templateDetail: {}, // 模板明细
    templateList: [], // 模板列表
    pagination: {}, // 列表页-分页
    fullList: [], // 明细页-数据检索列表
    fullPagination: [], // 明细页-数据检索分页
    limitTimeUom: [], // 工期单位
    templateStatus: [], // 模板状态
    projectRole: [], // 项目角色
    historyList: [], // 历史版本
    pmoRole: [], // PMO列表
    proManageRole: [], // 项目经理列表
  },
  effects: {
    // 页面值集查询
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          templateStatus: 'APPM.VERSION_STATUS',
          limitTimeUom: 'HALM.LIMIT_TIME_UOM',
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
      const result = getResponse(yield call(searchProjectRole, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            projectRole: result.content // 过滤PMO和项目经理角色
              .filter(i => i.roleType !== 'PMO' && i.roleType !== 'PROJECT_MANAGER')
              .map(i => ({ value: i.proRoleId, meaning: i.roleCode })),
            pmoRole: result.content // 提取PMO
              .filter(i => i.roleType === 'PMO')
              .map(i => ({ value: i.proRoleId, meaning: i.roleCode })),
            proManageRole: result.content // 提取项目经理角色
              .filter(i => i.roleType === 'PROJECT_MANAGER')
              .map(i => ({ value: i.proRoleId, meaning: i.roleCode })),
          },
        });
      }
    },
    // 模板列表查询
    *fetchTemplate({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectTemplate, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templateList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 模板明细查询
    *fetchTemplateDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTemplateDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            templateDetail: {
              ...result,
              otherRoles: isNull(result.otherRoles) ? [] : JSON.parse(result.otherRoles),
            },
          },
        });
      }
      return result;
    },
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectTemplate, payload));
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
    // 模板保存
    *saveTemplate({ payload }, { call }) {
      const result = yield call(saveTemplate, payload);
      return getResponse(result);
    },
    // 模板删除
    *removeTemplate({ payload }, { call }) {
      const result = yield call(removeTemplate, payload);
      return getResponse(result);
    },
    // 模板提交
    *submitTemplate({ payload }, { call }) {
      const result = yield call(submitTemplate, payload);
      return getResponse(result);
    },
    // 模板列表查询
    *fetchHistory({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHistory, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: result.content,
          },
        });
      }
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
