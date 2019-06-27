/**
 * modules - 资产目录
 * @date: 2019-3-21
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  renderTreeData,
  listAssetCatalog,
  saveAssetCatalog,
  forbidLine,
  enabledLine,
} from '../../services/afam/assetCatalogService';

export default {
  namespace: 'assetCatalog',
  state: {
    treeList: [], // 列表页面数据集合
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [], // 可展开的行数据key集合
    depreciationTypeMap: [], // 折旧类型值集
    accountTypeMap: [], // 资产入账会计科目类型值集
  },
  effects: {
    // 获取页面下拉列表显示值集 折旧类型
    *fetchDepreciationTypeLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          depreciationTypeMap: 'AFAM.DEPRECIATION_TYPE',
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

    // 获取页面下拉列表显示值集 资产入账会计科目类型
    *fetchAccountTypeLov({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          accountTypeMap: 'AFAM.ACCOUNT_TYPE',
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
    // 资产目录列表查询
    *listAssetCatalog({ payload }, { call, put }) {
      const result = getResponse(yield call(listAssetCatalog, payload));
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
    // 资产目录保存
    *saveAssetCatalog({ payload }, { call }) {
      const result = yield call(saveAssetCatalog, payload);
      return getResponse(result);
    },
    // 禁止当前行及下级
    *forbidLine({ payload }, { call }) {
      const result = yield call(forbidLine, payload);
      return getResponse(result);
    },
    // 启用当前行
    *enabledLine({ payload }, { call }) {
      const result = yield call(enabledLine, payload);
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
