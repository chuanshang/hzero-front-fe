import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  createOrUpdateMaterials,
  fetchMaterialList,
  enabledMaterial,
  fetchMaterialById,
  deleteMaterial,
  deleteMaterialRow,
  selectMaterialRow,
} from '../../services/ammt/materialsService';

export default {
  namespace: 'materials',

  state: {
    materialsList: [],
    pagination: {},
    innerpagination: {},
    productTypeMap: [],
    uomConversionMap: [],
    trackingUsedMap: [],
    pricingUsedMap: [],
    auxiliaryqtymethodMap: [],
    innerList: [],
  },

  effects: {
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          productTypeMap: 'AAFM.ASSET_TYPE', // 需要两步处理
          uomConversionMap: 'AMMT.UOM_CONVERSION',
          trackingUsedMap: 'AMMT.TRACKING_USED',
          pricingUsedMap: 'AMMT.PRICING_USED',
          auxiliaryqtymethodMap: 'AMMT.AUXILIARY_QTY_METHOD',
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
    // 新增或者修改
    *createOrUpdateMaterials({ payload }, { call }) {
      const res = yield call(createOrUpdateMaterials, payload);
      return getResponse(res);
    },
    *fetchMaterialList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialList, payload));
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
    *fetchMaterialById({ payload }, { call }) {
      const result = getResponse(yield call(fetchMaterialById, payload));
      if (result) {
        return result;
      }
    },
    // 启用禁用Material
    *toggleMaterial({ payload }, { call }) {
      const res = yield call(enabledMaterial, payload);
      return getResponse(res);
    },
    //  删除物料
    *deletematerials({ payload }, { call }) {
      const res = yield call(deleteMaterial, payload);
      return getResponse(res);
    },
    //  删除物料行
    *deleteMaterialRow({ payload }, { call }) {
      const res = yield call(deleteMaterialRow, payload);
      return getResponse(res);
    },
    //  查询物料行
    *selectMaterialRow({ payload }, { call, put }) {
      const res = yield call(selectMaterialRow, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            innerList: res.content,
            innerpagination: createPagination(res),
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
