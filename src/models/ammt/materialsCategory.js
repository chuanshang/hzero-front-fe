/**
 * model - 物料类别
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */

import { getResponse } from 'utils/utils';
import {
  renderTreeData,
  queryMaterialsCategoryList,
  saveData,
  forbidLine,
  enabledLine,
} from '../../services/ammt/materialsCategoryService';

export default {
  namespace: 'materialsCategory',

  state: {
    treeList: [],
    pathMap: {},
    expandedRowKeys: [],
  },

  effects: {
    *queryMaterialsCategoryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMaterialsCategoryList, payload));
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

    // 保存新增或编辑的物料信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 禁用“物料行”
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 启用“物料行”
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
