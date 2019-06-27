/*
 * workOrder - 工单管理-故障缺陷信息TAB页
 * @date: 2019-04-18
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse } from 'utils/utils';
import {
  saveWoMalfuction,
  listWoMalfuction,
  deleteWoMalfuction,
  detailWoMalfuction,
} from '../../services/amtc/woMalfunctionService';

export default {
  namespace: 'woMalfuction',
  state: {
    dataList: [], // 列表
  },

  effects: {
    // 保存新增/编辑信息
    *saveWoMalfuction({ payload }, { call }) {
      const result = yield call(saveWoMalfuction, payload);
      return getResponse(result);
    },
    // 删除 故障/缺陷信息
    *deleteWoMalfuction({ payload }, { call }) {
      const result = yield call(deleteWoMalfuction, payload);
      return getResponse(result);
    },
    // 查询 故障/缺陷信息
    *listWoMalfuction({ payload }, { call, put }) {
      const result = getResponse(yield call(listWoMalfuction, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
          },
        });
      }
    },
    // 查询 故障/缺陷信息 明细
    *detailWoMalfuction({ payload }, { call }) {
      const result = getResponse(yield call(detailWoMalfuction, payload));
      return result;
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
