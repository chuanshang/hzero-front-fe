/**
 * model - 预算控制期间
 * @date: 2019/03/06 19:35:09
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchList, saveList } from '../../services/appa/budgetPeriodService';

export default {
  namespace: 'budgetPeriod',
  state: {
    list: [],
    pagination: {},
  },
  effects: {
    /**
     * 查询
     * @param {*} { payload }
     * @param {*} { call, put}
     */
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    /**
     * 保存
     * @param {*} { payload }
     * @param {*} { call }
     * @returns
     */
    *saveList({ payload }, { call }) {
      const res = getResponse(yield call(saveList, payload));
      return res;
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
