/**
 * model - 预算类型设置
 * @date: 2019-03-06
 * @author: QZQ <zhiqiang.quan  @hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { queryMapIdpValue } from 'services/api';
import { getResponse, createPagination } from 'utils/utils';
import { queryBudgetTypeSettingList, saveData } from '../../services/appa/budgetTypeSettingService';

export default {
  namespace: 'budgetTypeSetting',

  state: {
    list: [], // 数据集
    uomValueList: [], // 单位下拉值集
    orderBudgetTypes: [], // 前序预算类型
  },

  effects: {
    // 获取页面下拉列表显示值集
    *fetchLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          uomValueList: 'APPM.UOM',
          enumMap: 'HPFM.FLAG', // 是/否
          controlRequirements: 'APPA.CONTROL_REQUIREMENT', // 预算明细控制要求
          controlTypes: 'APPA.CONTROL_TYPE', // 预算控制层级
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

    *queryBudgetTypeSettingList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBudgetTypeSettingList, payload));
      const temp = [];
      result.content.forEach(item => {
        if (item.enabledFlag === 1) {
          temp.push({
            value: item.budgetTypeId,
            meaning: item.budgetTypeName,
            thinWbsFlag: item.thinWbsFlag,
            thinBudgetItemFlag: item.thinBudgetItemFlag,
            thinProductFlag: item.thinProductFlag,
            thinAssetFlag: item.thinAssetFlag,
          });
        }
      });
      yield put({
        type: 'updateState',
        payload: {
          list: result.content,
          pagination: createPagination(result),
          orderBudgetTypes: temp,
        },
      });
    },

    // 保存新增或编辑的预算项
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
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
