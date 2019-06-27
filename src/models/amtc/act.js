/*
 * act - 标准作业
 * @date: 2019-05-10
 * @author: zzs <zhisheng,zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { addAct, updateAct, listAct, detailAct, deleteLine } from '../../services/amtc/actService';

export default {
  namespace: 'act',
  state: {
    list: [],
    pagination: {},
    detail: {}, // 标准作业明细
    lineList: [], // 工作任务行
    WoActivityTypeMap: [], // 标准作业类型
    JobDutiesSpecifiedMap: [], // 工作职责指定方式
    WorkOrderStatusMap: [], // 工单状态
    WoDurationRule: [], // 工单工期规则
    DurationUnitMap: [], // 工期单位
    ActOpStatusMap: [], // 工作任务行状态
    ActOpDefJobCodeMap: [], // 工作任务行工作职责默认方式
  },
  effects: {
    // 获取页面下拉列表显示值集
    *fetchLovMap({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          WoActivityTypeMap: 'AMTC.WOACTIVITYTYPE',
          JobDutiesSpecifiedMap: 'AMTC.JOBDUTIESSPECIFIED',
          WorkOrderStatusMap: 'AMTC.WORKORDERSTATES',
          WoDurationRule: 'AMTC.WODURATIONRULE',
          DurationUnitMap: 'AMTC.DURATION_UNIT',
          ActOpStatusMap: 'AMTC.ACTOPSTATUS',
          ActOpDefJobCodeMap: 'AMTC.ACTOPDEFJOBCODE',
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
    // 新增标准作业
    *addAct({ payload }, { call }) {
      const result = yield call(addAct, payload);
      return getResponse(result);
    },
    // 更新标准作业
    *updateAct({ payload }, { call }) {
      const result = yield call(updateAct, payload);
      return getResponse(result);
    },
    // 标准作业数据list界面查询
    *listAct({ payload }, { call, put }) {
      const result = yield call(listAct, payload);
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
    // 标准作业数据list界面查询
    *detailAct({ payload }, { call, put }) {
      const result = yield call(detailAct, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: result,
            lineList: result.actOpList.content,
          },
        });
        return result;
      }
    },
    // 工作任务行删除
    *deleteLine({ payload }, { call }) {
      const result = yield call(deleteLine, payload);
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
