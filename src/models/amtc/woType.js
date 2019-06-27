/*
 * woType - 工单类型
 * @date: 2019-04-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryWoTypeTreeList,
  saveEditData,
  saveAddData,
  renderTreeData,
  fetchDetailInfo,
  enabledWoType,
  disabledWoType,
} from '../../services/amtc/woTypeService';

export default {
  namespace: 'woType',

  state: {
    isCreateFlag: false, // 用于标识是否新增下级
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [],
    woTypeTreeList: [], // 工单类型树形列表
    pagination: {}, // 分页信息
    woTypeDetail: {}, // 工单类型详细信息
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    needTwiceConfirmMap: [], // 需要两步处理
    orderPlanStatusMap: [], // 计划状态
    orderCompletionRuleMap: [], // 工作单完成规则
    needToOperatorMap: [], // 是否需要
    needToCloseMap: [], // 事件关闭方式
    isNeedMap: [], // 是否启用服务评价
    inputTypeMap: [], // 解决方式输入类型
    verifyEnabledMap: [], // 现场核实资产信息
    mustBeProvidedMap: [], // 必须提供工作对象至
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          needTwiceConfirmMap: 'AAFM.NEED_TWICE_CONFIRM', // 需要两步处理
          orderPlanStatusMap: 'AMTC.ORDER_PLAN_STATUS', // 计划状态
          orderCompletionRuleMap: 'AMTC.ORDER_COMPLETION_RULE', // 工作单完成规则
          needToOperatorMap: 'AMTC.NEED_TO_OPERATOR', // 是否需要
          needToCloseMap: 'AMTC.NEED_TO_CLOSE', // 事件关闭方式
          isNeedMap: 'AMTC.IS_NEED', // 是否启用服务评价
          inputTypeMap: 'AMTC.INPUT_TYPE', // 解决方式输入类型
          verifyEnabledMap: 'AMTC.VERIFY_ENABLED', // 现场核实资产信息
          mustBeProvidedMap: 'AMTC.MUST_BE_PROVIDED', // 必须提供工作对象至
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

    // 列表树查询
    *queryWoTypeTreeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWoTypeTreeList, payload));
      const { woTypeTreeList, pathMap } = renderTreeData(result, {});
      const expandedRowKeys = Object.keys(pathMap).map(item => +item);
      yield put({
        type: 'updateState',
        payload: {
          woTypeTreeList,
          pathMap,
          expandedRowKeys,
        },
      });
      return result;
    },

    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            woTypeDetail: {
              ...result,
            },
          },
        });
      }
      return result;
    },
    // 禁用
    *disabledWoType({ payload }, { call }) {
      const result = yield call(disabledWoType, payload);
      return getResponse(result);
    },
    // 启用
    *enabledWoType({ payload }, { call }) {
      const result = yield call(enabledWoType, payload);
      return getResponse(result);
    },

    // 保存编辑信息
    *saveEditData({ payload }, { call }) {
      const result = yield call(saveEditData, payload);
      return getResponse(result);
    },
    // 保存新增信息
    *saveAddData({ payload }, { call }) {
      const result = yield call(saveAddData, payload);
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
