/*
 * service - 资产报废单
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

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
 * 查询设备资产列表信息，通过多个参数
 * @async
 * @function fetchEquipmentAssetByParam
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchEquipmentAssetByParam(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-info`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询资产状态
 * @async
 * @function searchAssetStatus
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetStatus(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-status`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 新增资产报废
 * @async
 * @function addAssetScrap
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function addAssetScrap(params) {
  return request(`${prefix}/${params.tenantId}/scrap`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 更新资产报废
 * @async
 * @function updateAssetScrap
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function updateAssetScrap(params) {
  return request(`${prefix}/${params.tenantId}/scrap`, {
    method: 'PUT',
    body: params.data,
  });
}

/**
 * 删除资产报废
 * @async
 * @function deleteAssetScrap
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function deleteAssetScrap(params) {
  return request(`${prefix}/${params.tenantId}/scrap/line`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 * 资产报废list界面查询
 * @async
 * @function listAssetScrap
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function listAssetScrap(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/scrap`, {
    method: 'GET',
    query: param,
  });
}

/** 资产报废全文检索
 * @async
 * @function fullTextSearch
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function fullTextSearch(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/scrap/list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 资产报废详细界面查询
 * @async
 * @function detailAssetScrap
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function detailAssetScrap(params) {
  return request(`${prefix}/${params.tenantId}/scrap/${params.scrapOrderHeaderId}`, {
    method: 'GET',
    body: params.data,
  });
}
/**
 * 资产报废行确认
 * @async
 * @function confirmAssetScrapLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function confirmAssetScrapLine(params) {
  return request(`${prefix}/${params.tenantId}/scrap/confirm`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 动态字段查询
 * @async
 * @function selectTransationTypeField
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function selectTransationTypeField(params) {
  return request(`${prefix}/${params.tenantId}/transaction-type/${params.transactionTypeId}`, {
    method: 'GET',
    body: params.data,
  });
}
/**
 * 获取单据动态字段
 * @async
 * @function fetchDynamicColumn
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function fetchDynamicColumn(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/dynamic-column`, {
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
 * 提交审批
 * @async
 * @function submitApprovalRequest
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 提交审批
 * @returns {object} fetch Promise
 */
export async function submitApprovalRequest(params) {
  return request(`${prefix}/${params.tenantId}/scrap/submit`, {
    method: 'POST',
    body: params.data,
  });
}
