/**
 * model - 项目状态
 * @date: 2019-02-20
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { isNull } from 'lodash';
import { getResponse } from 'utils/utils';
import { fetchProjectStatus, saveProjectStatus } from '../../services/appm/projectStatusService';

export default {
  namespace: 'projectStatus',
  state: {
    statusList: [], // 项目状态列表
    sysStatus: [], // 系统支持的项目状态
  },
  effects: {
    // 获取项目状态信息
    *fetchProjectStatus({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProjectStatus, payload));
      if (result) {
        const statusList = result.content.map(i => ({
          ...i,
          nextStatus: isNull(i.nextStatus) ? [] : JSON.parse(i.nextStatus),
        }));
        yield put({
          type: 'updateState',
          payload: {
            statusList,
            sysStatus: result.content.map(i => ({
              proStatusId: i.proStatusId,
              status: i.userStatusName,
            })),
          },
        });
      }
    },
    // 数据保存
    *saveProjectStatus({ payload }, { call }) {
      const result = yield call(saveProjectStatus, payload);
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
