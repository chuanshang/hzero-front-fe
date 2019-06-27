/*
 * service - 资产状态变更单-处理
 * @date: 2019-3-28
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

/**
 * 查询资产状态变更单行列表信息
 * @async
 * @function searchLineList
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchLineList(params) {
  return request(`${prefix}/${params.tenantId}/change/list`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 执行处理
 * @async
 * @function executeAssetStatusChange
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产状态变更单信息
 * @returns {object} fetch Promise
 */
export async function executeAssetStatusChange(params) {
  return request(`${prefix}/${params.tenantId}/change/execute`, {
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
