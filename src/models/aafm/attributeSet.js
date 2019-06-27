/**
 * model - 属性组
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryAttributeSetList,
  saveDetailData,
  queryDetailLineList,
  fetchAttributeSetDetail,
} from '../../services/aafm/attributeSetService';

export default {
  namespace: 'attributeSet',

  state: {
    list: [],
    pagination: {},
    detail: {}, // 属性组明细
    detailList: [], // 属性行列表
  },

  effects: {
    *queryAttributeSetList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryAttributeSetList, payload));
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
    *fetchAttributeSetDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAttributeSetDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            detailList: result.attributeLinesList,
          },
        });
      }
    },

    // 查询明细行数据
    *queryDetailLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryDetailLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailPagination: createPagination(result),
          },
        });
      }
    },
    // 查询值集
    *init({ payload }, { call, put }) {
      const enumMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'HPFM.FLAG',
          fieldTypes: 'AAFM.FIELD_TYPE',
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
    // 保存明细数据
    *saveDetailData({ payload }, { call }) {
      const result = yield call(saveDetailData, payload);
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
