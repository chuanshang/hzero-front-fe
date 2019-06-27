/**
 * 交付清单行
 * @date: 2019-3-20
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN, HALM_PPM } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
const ppmPrefix = `${HALM_PPM}/v1`;

/**
 * 交付清单行list界面查询
 * @async
 * @function listDelivery
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单行信息
 * @returns {object} fetch Promise
 */
export async function listDelivery(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/delivery-list`, {
    method: 'GET',
    query: param,
  });
}
/** 交付清单全文检索
 * @async
 * @function fullTextSearch
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function fullTextSearch(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/delivery-list/list`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 交付清单详细界面查询
 * @async
 * @function detailDelivery
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function detailDelivery(params) {
  return request(`${prefix}/${params.tenantId}/delivery-list/${params.deliveryListId}`, {
    method: 'GET',
    body: params.data,
  });
}
/**
 * 新增交付清单
 * @async
 * @function addDelivery
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function addDelivery(params) {
  return request(`${prefix}/${params.tenantId}/delivery-list`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 更新交付清单
 * @async
 * @function updateDelivery
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 交付清单信息
 * @returns {object} fetch Promise
 */
export async function updateDelivery(params) {
  return request(`${prefix}/${params.tenantId}/delivery-list`, {
    method: 'PUT',
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
