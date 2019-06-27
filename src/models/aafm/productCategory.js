/**
 * model - 产品类别
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import {
  renderTreeData,
  queryProductCategoryList,
  saveData,
  forbidLine,
  enabledLine,
} from '../../services/aafm/productCategoryService';

export default {
  namespace: 'productCategory',

  state: {
    treeList: [],
    pathMap: {},
    expandedRowKeys: [],
  },

  effects: {
    *queryProductCategoryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProductCategoryList, payload));
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

    // 保存新增或编辑的产品信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 禁用“产品行”
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 启用“产品行”
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
