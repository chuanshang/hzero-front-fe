/*
 * organization - 组织
 * @date: 2019-02-25
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  renderTreeData,
  queryOrganizationList,
  saveAddData,
  saveEditData,
  forbidLine,
  enabledLine,
  queryProvinceCity,
  fetchDetailInfo,
} from '../../services/amdm/organizationService';

export default {
  namespace: 'organization',

  state: {
    isCreateFlag: false, // 用于标识是否新增下级
    treeList: [], // 组织列表
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [],
    detail: {}, // 组织详情页数据
    serviceZoneList: [], // 关联服务区域列表
    addressList: [], // 地址列表
    cityList: [],
    orgTypes: [], // 组织类型
  },

  effects: {
    // 组织列表查询
    *queryOrganizationList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryOrganizationList, payload));
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
            serviceZoneList: result.relatedSites,
            addressList: result.relatedLocations,
          },
        });
      }
      return result;
    },
    // 获取父级信息
    *fetchParentOrganization({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            isCreateFlag: true,
            serviceZoneList: [],
            addressList: [],
          },
        });
        return result.orgName;
      } else {
        yield put({
          type: 'updateState',
          payload: {
            isCreateFlag: false,
            serviceZoneList: [],
            addressList: [],
          },
        });
        return '';
      }
    },
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          orgTypes: 'AMDM.ORGANIZATION_TYPE', // 组织类型
          flags: 'HPFM.FLAG', // 是否
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

    // 保存编辑组织信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },
    // 保存新增组织信息
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
