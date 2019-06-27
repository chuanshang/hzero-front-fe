/*
 * act - BOM
 * @date: 2019-05-10
 * @author: LYF <yufang.luo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  addBom,
  updateBom,
  listBom,
  detailBom,
  deleteBom,
  addBomLine,
  updateBomLine,
  listBomTree,
  deleteBomLine,
  renderTreeData,
} from '../../services/amtc/bomService';

export default {
  namespace: 'bom',
  state: {
    list: [], // list界面值集
    detail: {
      enabledFlag: 1,
    }, // 基础信息
    chileBomlist: [], // 子BOM结构清单
    treeList: [], // 结构清单行
    pathMap: {},
    expandedRowKeys: [],
    pagination: {},
    ParentTypeMap: [], // 对象字段独立值集
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLovMap({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          ParentTypeMap: 'AMTC.BOM_TYPE_CODE',
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
    // 新增Bom头
    *addBom({ payload }, { call }) {
      const result = yield call(addBom, payload);
      return getResponse(result);
    },
    // 更新Bom头
    *updateBom({ payload }, { call }) {
      const result = yield call(updateBom, payload);
      return getResponse(result);
    },
    // Bom list界面查询
    *listBom({ payload }, { call, put }) {
      const result = yield call(listBom, payload);
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
    // Bom list界面查询
    *listChildBom({ payload }, { call, put }) {
      const result = yield call(listBom, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pagination: createPagination(result),
            chileBomlist: result.content,
          },
        });
      }
    },
    // Bom detail界面
    *detailBom({ payload }, { call, put }) {
      const result = yield call(detailBom, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
          },
        });
        return result;
      }
    },
    // Bom头删除
    *deleteBom({ payload }, { call }) {
      const result = yield call(deleteBom, payload);
      return getResponse(result);
    },
    // 新增Bom行
    *addBomLine({ payload }, { call }) {
      const result = yield call(addBomLine, payload);
      return getResponse(result);
    },
    // 更新Bom头
    *updateBomLine({ payload }, { call }) {
      const result = yield call(updateBomLine, payload);
      return getResponse(result);
    },
    // Bom行tree界面查询
    *listBomTree({ payload }, { call, put }) {
      const result = getResponse(yield call(listBomTree, payload));
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
    },
    // Bom行删除
    *deleteBomLine({ payload }, { call }) {
      const result = yield call(deleteBomLine, payload);
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
