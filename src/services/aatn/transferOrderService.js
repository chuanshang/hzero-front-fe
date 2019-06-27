/**
 * 调拨转移单
 * @date: 2019-3-20
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

/**
 * 查询调拨转移单
 * @async
 * @function fetchTransferOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchTransferOrder(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transfer`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询调拨转移单明细
 * @async
 * @function fetchTransferOrderDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.transferHeaderId - 调拨转移单ID
 * @returns {object} fetch Promise
 */
export async function fetchTransferOrderDetail(params) {
  return request(`${prefix}/${params.tenantId}/transfer`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 新增调拨转移单
 * @async
 * @function addTransferOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 调拨转移单信息
 * @returns {object} fetch Promise
 */
export async function addTransferOrder(params) {
  return request(`${prefix}/${params.tenantId}/transfer`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 编辑调拨转移单
 * @async
 * @function updateTransferOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 调拨转移单信息
 * @returns {object} fetch Promise
 */
export async function updateTransferOrder(params) {
  return request(`${prefix}/${params.tenantId}/transfer`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 行数据 - 调入/调出
 * @async
 * @function confirmTransferOrderLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 调拨转移单信息
 * @returns {object} fetch Promise
 */
export async function confirmTransferOrderLine(params) {
  return request(`${prefix}/${params.tenantId}/transfer/confirm`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 调拨转移单明细页-数据检索
 * @async
 * @function searchByFullText
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.detailCondition - 查询参数值
 * @param {!object} params.page - 分页信息
 * @returns {object} fetch Promise
 */
export async function searchByFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transfer`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 调拨转移单明细页-行数据明细
 * @async
 * @function searchByFullText
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchTransferOrderLine(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transfer/list`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询设备资产列表信息
 * @async
 * @function searchEquipmentAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchEquipmentAsset(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-info/list`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询设备资产明细信息
 * @async
 * @function searchEquipmentAssetDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchEquipmentAssetDetail(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-info/${param.assetId}`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询事务处理行列表信息
 * @async
 * @function fetchTransactionTypeLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchTransactionTypeLine(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transaction-type/${param.transactionTypeId}`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 获取行动态字段
 * @async
 * @function fetchDynamicColumnLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchDynamicColumnLine(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dynamic-column`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 动态获取Lov
 * @async
 * @function fetchDynamicLov
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function fetchDynamicLov(params) {
  return request(`/hpfm/v1/lov-view/info?viewCode=${params.viewCode}`, {
    method: 'GET',
  });
}
/**
 * 调拨单提交
 * @async
 * @function commitTransferOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产调拨单信息
 * @returns {object} fetch Promise
 */
export async function commitTransferOrder(params) {
  return request(`${prefix}/${params.tenantId}/transfer/submit`, {
    method: 'POST',
    body: params.data,
  });
}
