/**
 * model - 资产动态字段
 * @date: 2019-04-02
 * @author: DT <ting.dai@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  searchDynamicColumn,
  saveDynamicColumn,
  deleteDynamicColumn,
} from '../../services/aafm/dynamicColumnService';

export default {
  namespace: 'dynamicColumn',
  state: {
    list: [],
    pagination: {},
    descSourceTypeMap: [],
    columnClassMap: [],
    lovTypeMap: [],
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          descSourceTypeMap: 'AAFM.DESC_SOURCE_TYPE', // 描述来源类型
          columnClassMap: 'AAFM.COLUMN_CLASS', // 分类
          lovTypeMap: 'AAFM.FIELD_TYPE', // 取值类型
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
    /**
     * 查询
     * @param payload
     * @param call
     * @param put
     */
    *fetchDynamicColumnList({ payload }, { call, put }) {
      const res = yield call(searchDynamicColumn, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            list: list.content,
            pagination: createPagination(list),
          },
        });
      }
    },

    /**
     * 保存
     * @param payload
     * @param call
     */
    *saveDynamicColumn({ payload }, { call }) {
      const res = yield call(saveDynamicColumn, payload);
      return getResponse(res);
    },

    /**
     * 删除
     * @param payload
     * @param call
     */
    *deleteDynamicColumn({ payload }, { call }) {
      const res = yield call(deleteDynamicColumn, payload);
      return getResponse(res);
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
