import { getResponse, createPagination, parseParameters } from 'utils/utils';

import { createOrUpdateStuff, fetchStuffList } from '../../services/amtc/workCenterStaffService';

export default {
  namespace: 'workCenterStaff',

  state: {
    stuffList: [],
    pagination: {},
  },

  effects: {
    // 新增或者修改
    *createOrUpdateStuff({ payload }, { call }) {
      const res = yield call(createOrUpdateStuff, payload);
      return getResponse(res);
    },
    // 查询
    *fetchStuffList({ payload }, { call, put }) {
      const res = yield call(fetchStuffList, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            stuffList: list.content,
            pagination: createPagination(list),
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
