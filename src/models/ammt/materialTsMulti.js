import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  createOrUpdateMaterialsTsMulti,
  fetchMaterialsTsMultiList,
  fetchMaterialsTsMultiById,
  fetchInnerRowById,
  deleteInnerRow,
} from '../../services/ammt/materialsTsMultiService';

export default {
  namespace: 'materialTsMulti',

  state: {
    materialTsMultiList: [],
    pagination: {},
    innerList: [],
    innerpagination: {},
  },

  effects: {
    *init(_, { call, put }) {
      const result = getResponse(yield call(queryMapIdpValue, {}));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 新增或者修改
    *createOrUpdateMaterialsTsMulti({ payload }, { call }) {
      const res = yield call(createOrUpdateMaterialsTsMulti, payload);
      return getResponse(res);
    },
    *fetchMaterialsTsMultiList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialsTsMultiList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialTsMultiList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 根据Id获取
    *fetchMaterialsTsMultiById({ payload }, { call }) {
      const result = getResponse(yield call(fetchMaterialsTsMultiById, payload));
      if (result) {
        return result;
      }
    },
    // 根据Id获取行列表
    *fetchInnerRowById({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInnerRowById, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            innerList: result.content,
            innerpagination: createPagination(result),
          },
        });
      }
    },
    // 删除行
    *deleteInnerRow({ payload }, { call, put, select }) {
      // const  result=yield select();
      // const  result1=yield select(({materialTsMulti, loading, user})=>({materialTsMulti, loading, user}));
      // console.log(result, result1);
      const result = yield call(deleteInnerRow, payload);
      if (result) {
        const { innerList, innerpagination } = yield select(
          ({ materialTsMulti }) => materialTsMulti
        );
        const newInnerList = innerList.filter(item => item.translineId !== payload.translineId);
        yield put({
          type: 'updateState',
          payload: {
            innerList: newInnerList,
            innerpagination: { ...innerpagination, total: innerpagination.total - 1 },
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
