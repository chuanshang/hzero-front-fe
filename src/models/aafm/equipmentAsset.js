/**
 * service - 设备资产
 * @date: 2019-1-23
 * @author: HBT <baitao.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  addEquipmentAsset,
  searchEquipmentAsset,
  searchEquipmentAssetDetail,
  updateEquipmentAsset,
  deleteEquipmentAsset,
  searchByFullText,
  queryDetailLineList,
  searchEventHistory,
  searchFieldHistory,
  queryTransactionTypesList,
  searchAssetFields,
} from '../../services/aafm/equipmentAssetService';

export default {
  namespace: 'equipmentAsset',
  state: {
    list: [], // 设备资产列表
    pagination: {}, // 分页参数
    specialAsset: [], // 特殊资产类型
    nameplateRule: [], // 资产标签/铭牌
    assetSource: [], // 资产来源
    warrantyTypeRule: [], // 质保起始日规则
    detail: {}, // 设备资产详情
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    enumMap: [], // 下拉列表：是/否
    attributeInfo: [], // 属性行
    eventList: [], // 事件列表
    fieldList: [], // 字段列表
    eventPagination: {}, // 字段的分页参数
    transactionTypes: [], // 事务处理类型
    assetFields: [], // 资产字段列表
    fullTagStatusColorMap: [], // 状态颜色
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          specialAsset: 'AAFM.SPECIAL_ASSET', // 特殊资产
          nameplateRule: 'AAFM.NAMEPLATE_RULE', // 资产标签/铭牌
          assetSource: 'AAFM.ASSET_SOURCE', // 资产来源
          warrantyTypeRule: 'AAFM.ASSET_WARRANTY_RULE', // 质保起始日规则
          enumMap: 'HPFM.FLAG', // 是/否
          assetCriticalityMap: 'AAFM.ASSET_CRITICALITY', // 资产重要性
          fullTagStatusColorMap: 'HALM.STATUS_COLOR',
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
    // 获取设备资产列表
    *fetchEquipmentAsset({ payload }, { call, put }) {
      const result = getResponse(yield call(searchEquipmentAsset, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    // 获取设备资产明细
    *fetchEquipmentAssetDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(searchEquipmentAssetDetail, payload));
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
    // 新增设备资产
    *addEquipmentAsset({ payload }, { call }) {
      const result = yield call(addEquipmentAsset, payload);
      return getResponse(result);
    },
    // 编辑设备资产
    *updateEquipmentAsset({ payload }, { call }) {
      const result = yield call(updateEquipmentAsset, payload);
      return getResponse(result);
    },
    // 删除设备资产
    *deleteEquipmentAsset({ payload }, { call }) {
      const result = yield call(deleteEquipmentAsset, payload);
      return getResponse(result);
    },
    // 明细页数据检索
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
    // 查询属性明细行数据
    *queryDetailLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryDetailLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            attributeInfo: result.content.filter(item => item.enabledFlag === 1) || [],
          },
        });
      }
    },
    // 获取资产履历事件列表
    *searchEventHistory({ payload }, { call, put }) {
      const result = getResponse(yield call(searchEventHistory, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            eventList: result.content,
            eventPagination: createPagination(result),
          },
        });
      }
    },
    // 获取资产履历字段列表
    *searchFieldHistory({ payload }, { call, put }) {
      const result = getResponse(yield call(searchFieldHistory, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fieldList: result,
          },
        });
      }
    },
    // 获取资产字段列表
    *searchAssetFields({ payload }, { call, put }) {
      const result = getResponse(yield call(searchAssetFields, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            assetFields: result,
          },
        });
      }
    },
    // 事务类型列表查询
    *fetchTransactionTypesList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryTransactionTypesList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            transactionTypes: result.content.map(item => ({
              value: item.transactionTypeId,
              meaning: item.shortName,
            })),
          },
        });
      }
      return result;
    },
  },
  reducers: {
    // 合并state状态数据,生成新的state
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
