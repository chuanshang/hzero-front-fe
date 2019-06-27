/**
 * model - 位置
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  renderTreeData,
  queryLocationList,
  saveAddData,
  saveEditData,
  forbidLine,
  enabledLine,
  queryProvinceCity,
  fetchDetailInfo,
} from '../../services/amdm/locationService';

export default {
  namespace: 'location',

  state: {
    treeList: [],
    // addAndEditData: [],
    pathMap: {},
    expandedRowKeys: [],
    detail: {}, // 位置详情页数据
    cityList: [],
  },

  effects: {
    // 位置列表查询
    *queryLocationList({ payload }, { call, put }) {
      // let result = {};
      // let expandedRow = {};
      const result = getResponse(yield call(queryLocationList, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      // if (!expandFlag) {
      //   expandedRow = {
      //     expandedRowKeys: Object.keys(pathMap).map(item => +item),
      //   };
      // } else {
      //   const locationIdList = result.map(item => item.assetLocationId) || [];
      //   expandedRow = {
      //     expandedRowKeys: Array.from(new Set([...expandedRowKeys, ...locationIdList])),
      //   };
      // }
      yield put({
        type: 'updateState',
        payload: {
          treeList,
          pathMap,
          expandedRowKeys,
          // addAndEditData: [],
          // ...expandedRow,
          // ...others,
        },
      });
      return result;
    },
    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
      }
      return result;
    },
    // 获取父级信息
    *fetchParentLocation({ payload }, { call }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        return result.locationName;
      } else {
        return '';
      }
    },
    // 查询值集
    *init({ payload }, { call, put }) {
      const enumMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'HPFM.FLAG',
          // idd: 'SMDM.IDD', // 国际化手机号前缀
          locationTypes: 'AMDM.ASSET_LOCATION_TYPE',
          ...payload,
        })
      );
      yield put({
        type: 'updateState',
        payload: {
          enumMap: enumMap || {},
        },
      });
    },

    //  查询省市
    *queryProvinceCity({ payload }, { call, put }) {
      const cityList = yield call(queryProvinceCity, payload);
      if (cityList) {
        yield put({
          type: 'updateState',
          payload: {
            cityList,
          },
        });
      }
    },

    // 保存编辑位置信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },
    // 保存新增位置信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
      return getResponse(result);
    },
    // 禁用“位置行”
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 启用“位置行”
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
