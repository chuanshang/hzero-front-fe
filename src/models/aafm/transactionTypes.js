/*
 * organization - 资产事务处理类型
 * @date: 2019-02-25
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isNull } from 'lodash';
import { queryMapIdpValue } from 'services/api';
import { createPagination, getResponse } from 'utils/utils';
import {
  queryTransactionTypesTreeList,
  queryTransactionTypesList,
  saveEditData,
  saveAddData,
  fetchDetailInfo,
  renderTreeData,
  searchByFullText,
  searchTransactionTypesOrg,
  searchAssetStatus,
  searchAssetSpecialty,
  enabledTransactionTypes,
  disabledTransactionTypes,
} from '../../services/aafm/transactionTypesService';

export default {
  namespace: 'transactionTypes',

  state: {
    isCreateFlag: false, // 用于标识是否新增下级
    treeList: [], // 组织列表
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [],
    specialAssetMap: [], // 特殊资产
    basicTypeMap: [], // 事件类型
    needTwiceConfirmMap: [], // 需要两步处理
    transactionTypesOrg: [],
    assetStatus: [],
    assetSpecialty: [],
    statusUpdateFlag: false,
    basicColumnFlag: false,
    basicAssetColumnList: [],
    trackingFlag: false,
    trackingManagementColumnList: [],
    deleteColumnList: [], // 删除变更的行
    pagination: {},
    detail: {},
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          basicTypeMap: 'AAFM.ASSET_TRANSACTION_TYPE', // 事件类型
          needTwiceConfirmMap: 'AAFM.NEED_TWICE_CONFIRM', // 需要两步处理
          specialAssetMap: 'AAFM.SPECIAL_ASSET', // 特殊资产
          fieldTypeMap: 'AAFM.ASSET_COLUMN_PROPERTY', // 资产事物处理类型变更字段类型
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

    // 列表树查询
    *queryTransactionTypesTreeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTransactionTypesTreeList, payload));
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

    // 列表查询
    *queryTransactionTypesList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTransactionTypesList, payload));
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

    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        const { basicAssetColumnList, trackingManagementColumnList } = result;
        const newBasicAssetColumnList = [];
        if (!isNull(basicAssetColumnList)) {
          basicAssetColumnList.forEach(record => {
            const newRecord = { ...record, _status: 'update' };
            newBasicAssetColumnList.push(newRecord);
          });
        }
        const newTrackingManagementColumnList = [];
        if (!isNull(trackingManagementColumnList)) {
          trackingManagementColumnList.forEach(record => {
            const newRecord = { ...record, _status: 'update' };
            newTrackingManagementColumnList.push(newRecord);
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            detail: {
              ...result,
              organizationScope: isNull(result.organizationScope)
                ? []
                : JSON.parse(result.organizationScope),
              statusScope: isNull(result.statusScope) ? [] : JSON.parse(result.statusScope),
              specialtyScope: isNull(result.specialtyScope)
                ? []
                : JSON.parse(result.specialtyScope),
              targetAssetStatusScope: isNull(result.targetAssetStatusScope)
                ? []
                : JSON.parse(result.targetAssetStatusScope),
            },
            statusUpdateFlag: result.statusUpdateFlag === 1,
            basicColumnFlag: result.basicColumnFlag === 1,
            trackingFlag: result.trackingFlag === 1,
            basicAssetColumnList: newBasicAssetColumnList,
            trackingManagementColumnList: newTrackingManagementColumnList,
          },
        });
      }
      return result;
    },
    // 明细页全文检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchByFullText, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fullList: result.content,
            fullPagination: createPagination(result),
          },
        });
      }
    },

    // 禁用
    *disabledTransactionTypes({ payload }, { call }) {
      const result = yield call(disabledTransactionTypes, payload);
      return getResponse(result);
    },
    // 启用
    *enabledTransactionTypes({ payload }, { call }) {
      const result = yield call(enabledTransactionTypes, payload);
      return getResponse(result);
    },

    // 获取父级信息
    *fetchParentTransactionTypes({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            isCreateFlag: true,
            basicColumnFlag: false,
            trackingFlag: false,
            basicAssetColumnList: [],
            trackingManagementColumnList: [],
          },
        });
        return result.shortName;
      } else {
        yield put({
          type: 'updateState',
          payload: {
            isCreateFlag: false,
            basicColumnFlag: false,
            trackingFlag: false,
            basicAssetColumnList: [],
            trackingManagementColumnList: [],
          },
        });
        return '';
      }
    },

    // 获取组织
    *fetchTransactionTypesOrg({ payload }, { call, put }) {
      const result = getResponse(yield call(searchTransactionTypesOrg, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            transactionTypesOrg: result.content.map(i => ({ value: i.orgId, meaning: i.orgName })),
          },
        });
      }
    },
    // 获取资产状态
    *fetchAssetStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetStatus, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetStatus: result.content.map(i => ({
              value: i.assetStatusId,
              meaning: i.sysStatusName,
            })),
          },
        });
      }
    },
    // 获取资产专业分类
    *fetchAssetSpecialty({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetSpecialty, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetSpecialty: result.content.map(i => ({
              value: i.assetSpecialtyId,
              meaning: i.assetSpecialtyName,
            })),
          },
        });
      }
    },

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },
    // 保存新增信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
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
