/*
 * woTypeService - 工单类型服务
 * @date: 2019-04-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';

/**
 * queryWoTypeTreeList - 工单类型树状图
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryWoTypeTreeList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workorder-type`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryWoTypeList - 查询工单类型list
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryWoTypeList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workorder-type/list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workorder-type`, {
    method: 'PUT',
    body: params.data,
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workorder-type`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 获取明细数据
 * @async
 * @function fetchDetailInfo
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} workorderTypeId - 工单类型Id
 * @returns {object} fetch Promise
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workorder-type/${params.woTypeId}`, {
    method: 'GET',
  });
}

/**
 * 启用当前及子节点
 * @async
 * @function enabledWorkOrdeerType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function enabledWoType(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/workorder-type/enabled/${params.workorderTypeId}`,
    {
      method: 'PUT',
    }
  );
}

/**
 * 禁用当前及子节点
 * @async
 * @function disabledWorkOrdeerType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function disabledWoType(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/workorder-type/disabled/${params.workorderTypeId}`,
    {
      method: 'PUT',
    }
  );
}

/**
 * 处理接口获取的数据，提取每个节点的层次路径
 * @param {array} collections - 页面展示数据
 * @param {array} levelPath - 特定资产事物类型的层级路径
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderTreeData(collections = [], levelPath = {}) {
  const pathMap = levelPath;
  const woTypeTreeList = collections.map(item => {
    const temp = item;
    pathMap[temp.workorderTypeId] = [
      ...(pathMap[temp.workorderTypeId] || []),
      temp.workorderTypeId,
    ];
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap).woTypeTreeList];
    }
    return temp;
  });
  return {
    woTypeTreeList,
    pathMap,
  };
}
