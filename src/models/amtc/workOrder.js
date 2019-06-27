/*
 * workOrder - 工单管理
 * @date: 2019-04-18
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryWorkOrdersList,
  saveData,
  deleteData,
  fetchDetailInfo,
  searchByFullText,
  deleteWoopData,
  changeWoStatus,
  getCurrentEmployee,
} from '../../services/amtc/workOrderService';
import { fetchWorkProcessListInfo } from '../../services/amtc/woopService';
import {
  fetchMaterialListInfo,
  fetchMaterialReturnListInfo,
  deleteMaterialData,
  saveMaterialData,
  queryItemsTreeMaterialList,
  renderTreeData,
  queryItemsHisTreeMaterialList,
} from '../../services/amtc/materialService';

export default {
  namespace: 'workOrder',

  state: {
    dataList: [], // 列表
    pagination: {},
    detail: {},
    fullPagination: {}, // 明细页数据检索分页信息
    fullList: [], // 明细页数据检索数据列表
    woopList: [],
    woopPagination: {}, // 工序页数据检索分页信息
    materialList: [], // 备件耗材投入列表
    materialPagination: {}, // 备件耗材投入分页信息
    materialReturnList: [], // 备件耗材退回列表
    materialReturnPagination: {}, // 备件耗材退回分页信息
    treeList: [], // 新增页面树结构数据集合
    treeHisList: [], // 新增页面树结构数据集合
    pathMap: {}, // 层次结构路径
    expandedRowKeys: [], // 可展开的行数据key集合
    expandedHisRowKeys: [], // 可展开的行数据key集合
    modalVisible: false, // 控制模态框显示
    selectMaps: {
      woStatusMap: [],
      mapSourceCodeMap: [],
      durationUomMap: [],
    },
    currentEmployee: {},
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woStatusMap: 'AMTC.WORKORDERSTATUS', // 工单状态
          mapSourceCodeMap: 'AMTC.MAPSOURCE', // 地图来源
          durationUomMap: 'HALM.LIMIT_TIME_UOM', // 工期单位
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            selectMaps: result,
          },
        });
      }
    },

    // 列表查询
    *queryWorkOrdersList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWorkOrdersList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取物料树列表
    *queryItemsTreeMaterial({ payload }, { call, put }) {
      const result = getResponse(yield call(queryItemsTreeMaterialList, payload));
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
    // 获取历史发出物料树列表
    *queryItemsHisTreeMaterial({ payload }, { call, put }) {
      const result = getResponse(yield call(queryItemsHisTreeMaterialList, payload));
      const { treeList, pathMap } = renderTreeData(result, {});
      const expandedHisRowKeys = Object.keys(pathMap).map(item => +item);
      yield put({
        type: 'updateState',
        payload: {
          treeHisList: treeList,
          expandedHisRowKeys,
        },
      });
    },
    // 保存备件耗材
    *saveMaterialData({ payload }, { call }) {
      const result = yield call(saveMaterialData, payload);
      return getResponse(result);
    },
    // 获取备件耗材投入列表
    *queryMaterialList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialListInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: result.content,
            materialPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取备件耗材退回列表
    *queryMaterialReturnList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialReturnListInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialReturnList: result.content,
            materialReturnPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 删除备件耗材
    *deleteMaterial({ payload }, { call }) {
      const result = yield call(deleteMaterialData, payload);
      return getResponse(result);
    },
    // 获取明细页数据
    *fetchDetailInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detail: {
              ...result,
            },
          },
        });
      }
      return result;
    },
    // 明细页全文检索
    *searchFullText({ payload }, { call, put }) {
      const result = getResponse(yield call(searchByFullText, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fullList: result.content,
            fullPagination: createPagination(result),
          },
        });
      }
    },
    // 保存信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 修改工单状态
    *changeWoStatus({ payload }, { call }) {
      const result = yield call(changeWoStatus, payload);
      return getResponse(result);
    },
    // 删除
    *deleteWorkOrder({ payload }, { call }) {
      const result = yield call(deleteData, payload);
      return getResponse(result);
    },

    // 工序列表查询
    *queryWorkProcessList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWorkProcessListInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            woopList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 删除
    *deleteWorkProcess({ payload }, { call }) {
      const result = yield call(deleteWoopData, payload);
      return getResponse(result);
    },
    // 查询当前用户在当前租户下的员工
    *getCurrentEmployee({ payload }, { call, put }) {
      const result = getResponse(yield call(getCurrentEmployee, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            currentEmployee: result,
          },
        });
      }
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
