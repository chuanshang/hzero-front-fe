import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  createOrUpdateMaterialTsType,
  fetchMaterialTsTypeList,
  toggleMaterialTsType,
  fetchMaterialTsTypeById,
} from '../../services/ammt/materialsTsTypeService';

export default {
  namespace: 'materialTsType',

  state: {
    materialTsTypeList: [],
    pagination: {},
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
    *createOrUpdateMaterialTsType({ payload }, { call }) {
      const res = yield call(createOrUpdateMaterialTsType, payload);
      return getResponse(res);
    },
    *fetchMaterialTsTypeList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialTsTypeList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialsList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 根据Id获取
    *fetchMaterialTsTypeById({ payload }, { call }) {
      const result = getResponse(yield call(fetchMaterialTsTypeById, payload));
      if (result) {
        return result;
      }
    },
    // 启用禁用
    *toggleMaterialTsType({ payload }, { call }) {
      const res = yield call(toggleMaterialTsType, payload);
      return getResponse(res);
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
