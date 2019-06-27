/**
 * service - 验收单
 * @date: 2019-04-18
 * @version: 0.0.1
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @copyright Copyright (c) 2019, Hands
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN, HALM_PPM } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
const ppmPrefix = `${HALM_PPM}/v1`;
/**
 * 新增验收单
 * @async
 * @function addAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function addAcceptance(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-headers`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 更新验收单
 * @async
 * @function updateAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function updateAcceptance(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-headers`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 验收单list界面查询
 * @async
 * @function listAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function listAcceptance(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/acceptance-headers`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 验收单详细界面查询
 * @async
 * @function detailAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function detailAcceptance(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-headers/details`, {
    method: 'GET',
    query: { acceptanceHeaderIds: params.acceptanceHeaderIds },
  });
}
/**
 * 新增验收单行
 * @async
 * @function addAcceptanceLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function addAcceptanceLine(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-lines`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 更新验收单行
 * @async
 * @function updateAcceptanceLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function updateAcceptanceLine(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-lines`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 删除验收单行
 * @async
 * @function deleteAcceptanceLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function deleteAcceptanceLine(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-lines`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 验收单全文检索
 * @async
 * @function fullTextSearch
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function fullTextSearch(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/acceptance-headers/list`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 交付清单检索
 * @async
 * @function searchDeliveryList
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function searchDeliveryList(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/delivery-list`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 更新验收单资产明细行
 * @async
 * @function updateAcceptanceAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function updateAcceptanceAsset(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-assets`, {
    method: 'PUT',
    body: params.data,
  });
}
/** 提交审批
 * @async
 * @function submitAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单数据
 * @returns {object} fetch Promise
 */
export async function submitAcceptance(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/acceptance-headers/submit`, {
    method: 'POST',
    query: param,
  });
}
/**
 * 完成验收
 * @async
 * @function completeAcceptance
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单数据
 * @returns {object} fetch Promise
 */
export async function completeAcceptance(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/acceptance-headers/completeAcceptance`, {
    method: 'POST',
    query: param,
  });
}
/**
 * 完成资产
 * @async
 * @function completeAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单数据
 * @returns {object} fetch Promise
 */
export async function completeAsset(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/acceptance-headers/completeAsset`, {
    method: 'POST',
    query: param,
  });
}
/**
 * 新增验收单关联
 * @async
 * @function addAcceptanceLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单关联信息
 * @returns {object} fetch Promise
 */
export async function addAcceptanceRelation(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-relations `, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 删除验收单关联
 * @async
 * @function deleteAcceptanceRelation
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单关联信息
 * @returns {object} fetch Promise
 */
export async function deleteAcceptanceRelation(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-relations `, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 查询项目计划
 * @async
 * @function updateDelivery
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function selectWbsPlan(params) {
  const param = parseParameters(params);
  return request(`${ppmPrefix}/${params.tenantId}/pro-wbs`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 验收单类型详细界面查询
 * @async
 * @function detailAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单信息
 * @returns {object} fetch Promise
 */
export async function detailAcceptanceType(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-type/${params.acceptanceTypeId}`, {
    method: 'GET',
  });
}
