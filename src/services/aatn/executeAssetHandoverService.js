/*
 * service - 资产移交归还单-处理
 * @date: 2019-3-21
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询资产移交归还单列表信息
 * @async
 * @function searchAssetHandover
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetHandover(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/handover-order-headers/exelinelist`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询资产移交归还单行列表
 * @async
 * @function searchAssetHandoverLines
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetHandoverLines(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/handover-order-headers/detail`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 执行处理
 * @async
 * @function executeAssetHandover
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 归还单信息
 * @returns {object} fetch Promise
 */
export async function executeAssetHandover(params) {
  return request(`${prefix}/${params.tenantId}/handover-order-headers/execute`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 查询事务类型
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
 * 查询动态字段的数据
 * @async
 * @function fetchDynamicFields
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchDynamicFields(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dynamic-column`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询Lov对应的中文含义
 * @async
 * @function fetchDynamicFields
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchDynamicLov(params) {
  return request(`/hpfm/v1/lov-view/info?viewCode=${params.viewCode}`, {
    method: 'GET',
  });
}
/**
 * 查询资产移交归还单明细
 * @async
 * @function searchAssetHandoverDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.handoverHeaderId - 订单头ID
 * @returns {object} fetch Promise
 */
export async function searchAssetHandoverDetail(params) {
  return request(`${prefix}/${params.tenantId}/handover-order-headers/${params.handoverHeaderId}`, {
    method: 'GET',
    query: params,
  });
}
