/**
 * 资产处置单
 * @date: 2019-3-27
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

/**
 * 查询资产处置单
 * @async
 * @function fetchDisposeOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchDisposeOrder(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dispose`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询资产处置单明细
 * @async
 * @function fetchDisposeOrderDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.disposeHeaderId - 资产处置单ID
 * @returns {object} fetch Promise
 */
export async function fetchDisposeOrderDetail(params) {
  return request(`${prefix}/${params.tenantId}/dispose/${params.disposeHeaderId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询资产处置单行列表
 * @async
 * @function fetchDisposeOrderLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.disposeHeaderId - 资产处置单ID
 * @returns {object} fetch Promise
 */
export async function fetchDisposeOrderLine(params) {
  return request(`${prefix}/${params.tenantId}/dispose/entHandle`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 新增资产处置单
 * @async
 * @function addDisposeOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产处置单信息
 * @returns {object} fetch Promise
 */
export async function addDisposeOrder(params) {
  return request(`${prefix}/${params.tenantId}/dispose`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 编辑资产处置单
 * @async
 * @function updateDisposeOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产处置单信息
 * @returns {object} fetch Promise
 */
export async function updateDisposeOrder(params) {
  return request(`${prefix}/${params.tenantId}/dispose`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 删除资产处置单
 * @async
 * @function deleteDisposeOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产处置单信息
 * @returns {object} fetch Promise
 */
export async function deleteDisposeOrder(params) {
  return request(`${prefix}/${params.tenantId}/dispose/lineRemove`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 行数据 - 处置
 * @async
 * @function disposeOrderConfirm
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产处置单信息
 * @returns {object} fetch Promise
 */
export async function disposeOrderConfirm(params) {
  return request(`${prefix}/${params.tenantId}/dispose/disposeConfirm`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 资产处置单明细页-数据检索
 * @async
 * @function searchFullText
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.detailCondition - 查询参数值
 * @param {!object} params.page - 分页信息
 * @returns {object} fetch Promise
 */
export async function searchFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dispose`, {
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
 * 获取资产状态 (目标资产状态默认值)
 * @async
 * @function fetchAssetStatus
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchAssetStatus(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-status`, {
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
 * 处置单提交
 * @async
 * @function commitDisposeOrder
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产处置单信息
 * @returns {object} fetch Promise
 */
export async function commitDisposeOrder(params) {
  return request(`${prefix}/${params.tenantId}/dispose/commit`, {
    method: 'POST',
    body: params.data,
  });
}
