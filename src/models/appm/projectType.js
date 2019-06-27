/**
 * model - 项目类型
 * @date: 2019-02-19
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import {
  renderTreeData,
  queryProjectType,
  saveProjectType,
  forbidLine,
  enabledLine,
} from '../../services/appm/projectTypeService';

export default {
  namespace: 'projectType',
  state: {
    treeList: [], // 项目类型列表
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [],
  },
  effects: {
    // 获取项目类型数据列表
    *fetchProjectType({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProjectType, payload));
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
    // 数据保存
    *saveProjectType({ payload }, { call }) {
      const result = yield call(saveProjectType, payload);
      return getResponse(result);
    },
    // 行 - 禁用
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 行 - 启用
    *enabledLine({ payload }, { call }) {
      const result = yield call(enabledLine, payload);
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
