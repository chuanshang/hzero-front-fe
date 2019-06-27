/**
 * 验收单
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  addAcceptance,
  updateAcceptance,
  listAcceptance,
  detailAcceptance,
  addAcceptanceLine,
  updateAcceptanceLine,
  deleteAcceptanceLine,
  fullTextSearch,
  searchDeliveryList,
  submitAcceptance,
  completeAcceptance,
  completeAsset,
  updateAcceptanceAsset,
  addAcceptanceRelation,
  deleteAcceptanceRelation,
  selectWbsPlan,
  detailAcceptanceType,
} from '../../services/arcv/acceptanceService';

export default {
  namespace: 'acceptance',
  state: {
    list: [], // list列表界面数据
    pagination: {}, // 列表界面分页
    fullList: [],
    fullPagination: {},
    deliveryList: [],
    deliveryPagination: {},
    detail: {},
    acceptanceLineList: [], // 验收单行信息列表
    acceptanceRelationList: [], // 验收单关联验收单信息列表(验收单的数据)
    relationList: [], // 验收单关联验收单关联信息信息列表(验收单关联表的数据)
    acceptanceAssetList: [], // 验收单资产明细行列表
    AcceptanceStatusLovMap: [],
    TranserFixedLovMap: [],
    detailAcceptanceTypeDetail: {},
  },
  effects: {
    // 获取验收状态值集
    *fetchAcceptanceStatusLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          AcceptanceStatusLovMap: 'ARCV.ACCEPTANCE_STATUS',
          ...payload,
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
    // 查询项目计划
    *selectWbsPlan({ payload }, { call }) {
      const result = yield call(selectWbsPlan, payload);
      const wbsHeader = result.filter(item => item.wbsStatus === `FORMAL`)[0] || {};
      return getResponse(wbsHeader);
    },
    // 获取是否转固值集
    *fetchTranserFixedLovMap({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          TranserFixedLovMap: 'ARCV.TRANSFER_FIXED',
          ...payload,
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
    // 新增验收单
    *addAcceptance({ payload }, { call }) {
      const result = yield call(addAcceptance, payload);
      return getResponse(result);
    },
    // 更新验收单
    *updateAcceptance({ payload }, { call }) {
      const result = yield call(updateAcceptance, payload);
      return getResponse(result);
    },
    // 新增验收单行
    *addAcceptanceLine({ payload }, { call }) {
      const result = yield call(addAcceptanceLine, payload);
      return getResponse(result);
    },
    // 更新验收单行
    *updateAcceptanceLine({ payload }, { call }) {
      const result = yield call(updateAcceptanceLine, payload);
      return getResponse(result);
    },
    // 删除验收单行
    *deleteAcceptanceLine({ payload }, { call }) {
      const result = yield call(deleteAcceptanceLine, payload);
      return getResponse(result);
    },
    // 更新验收单资产明细行
    *updateAcceptanceAsset({ payload }, { call }) {
      const result = yield call(updateAcceptanceAsset, payload);
      return getResponse(result);
    },
    // 验收单数据list界面查询
    *listAcceptance({ payload }, { call, put }) {
      const result = yield call(listAcceptance, payload);
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
    // 验收单详细界面查询
    *detailAcceptance({ payload }, { call, put }) {
      const result = yield call(detailAcceptance, payload);
      if (result[0]) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result[0],
            acceptanceLineList: result[0].acceptanceLineList,
            acceptanceAssetList: result[0].acceptanceAssetList,
            relationList: result[0].acceptanceRelationList,
            acceptanceRelationList: [], // 先将该数组置空，之后会填上查询出来的验收单明细
          },
        });
        return getResponse(result[0]);
      }
    },
    // 验收单关联面板选择验收单后,对验收单明细查询返回
    *detailAcceptanceRelation({ payload }, { call }) {
      const result = yield call(detailAcceptance, payload);
      if (result) {
        return getResponse(result);
      }
    },
    // 验收单全文搜索
    *fullTextSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(fullTextSearch, payload));
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
    // 交付清单全文检索
    *searchDeliveryList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchDeliveryList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            deliveryList: result.content,
            deliveryPagination: createPagination(result),
          },
        });
      }
    },
    // 提交验收单
    *submitAcceptance({ payload }, { call }) {
      const result = yield call(submitAcceptance, payload);
      return getResponse(result);
    },
    // 完成验收
    *completeAcceptance({ payload }, { call }) {
      const result = yield call(completeAcceptance, payload);
      return getResponse(result);
    },
    // 完成资产
    *completeAsset({ payload }, { call }) {
      const result = yield call(completeAsset, payload);
      return getResponse(result);
    },
    // 新增验收单关联
    *addAcceptanceRelation({ payload }, { call }) {
      const result = yield call(addAcceptanceRelation, payload);
      return getResponse(result);
    },
    // 删除验收单关联
    *deleteAcceptanceRelation({ payload }, { call }) {
      const result = yield call(deleteAcceptanceRelation, payload);
      return getResponse(result);
    },
    // 验收单类型明细
    *detailAcceptanceType({ payload }, { call, put }) {
      const result = yield call(detailAcceptanceType, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailAcceptanceTypeDetail: result,
          },
        });
      }
      return result || {};
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
