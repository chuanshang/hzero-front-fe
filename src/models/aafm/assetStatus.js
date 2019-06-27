/**
 * model - 资产状态
 * @date: 2019-02-20
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { isNull } from 'lodash';
import { getResponse } from 'utils/utils';
import { fetchAssetStatus, saveAssetStatus } from '../../services/aafm/assetStatusService';

export default {
  namespace: 'assetStatus',
  state: {
    statusList: [], // 资产状态列表
    sysStatus: [], // 系统支持的资产状态
  },
  effects: {
    // 获取项目状态信息
    *fetchAssetStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAssetStatus, payload));
      if (result) {
        const statusList = result.content.map(item => ({
          ...item,
          nextStatus: isNull(item.nextStatus) ? [] : JSON.parse(item.nextStatus),
        }));
        yield put({
          type: 'updateState',
          payload: {
            statusList,
            sysStatus: statusList.map(i => ({
              value: `${i.assetStatusId}`,
              meaning: i.userStatusName,
            })),
          },
        });
      }
    },
    // 数据保存
    *saveAssetStatus({ payload }, { call }) {
      const result = yield call(saveAssetStatus, payload);
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
