/**
 * 交付清单行
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  listDelivery,
  fullTextSearch,
  detailDelivery,
  addDelivery,
  updateDelivery,
  selectWbsPlan,
  addAcceptance,
} from '../../services/arcv/deliveryListService';

export default {
  namespace: 'deliveryList',
  state: {
    list: [], // list列表界面数据
    pagination: {}, // 列表界面分页
    fullList: [],
    fullPagination: {},
    detail: {},
  },
  effects: {
    // 交付清单行list界面查询
    *listDelivery({ payload }, { call, put }) {
      const result = yield call(listDelivery, payload);
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
    // 交付清单全文检索
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
    // 交付清单详细界面查询
    *detailDelivery({ payload }, { call, put }) {
      const result = yield call(detailDelivery, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
        return getResponse(result);
      }
    },
    // 新增交付清单
    *addDeliveryList({ payload }, { call }) {
      const result = yield call(addDelivery, payload);
      return getResponse(result);
    },
    // 更新交付清单
    *updateDeliveryList({ payload }, { call }) {
      const result = yield call(updateDelivery, payload);
      return getResponse(result);
    },
    // 查询项目计划
    *selectWbsPlan({ payload }, { call }) {
      const result = yield call(selectWbsPlan, payload);
      const wbsHeader = result.filter(item => item.wbsStatus === `FORMAL`)[0] || {};
      return getResponse(wbsHeader);
    },
    // 新增验收单
    *addAcceptance({ payload }, { call }) {
      const result = yield call(addAcceptance, payload);
      return getResponse(result);
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
