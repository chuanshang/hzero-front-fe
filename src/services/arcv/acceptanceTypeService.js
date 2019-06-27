/**
 * service - 验收单类型
 * @date: 2019-04-18
 * @version: 0.0.1
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hands
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询验收单类型列表信息
 * @async
 * @function searchAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAcceptanceType(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/acceptance-type`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 资产专业分类导出
 * @async
 * @function exportAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function exportAcceptanceType(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/acceptance-type/export`, {
    method: 'POST',
    query: param,
  });
}
/**
 * 保存验收单类型
 * @async
 * @function saveAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单类型信息
 * @returns {object} fetch Promise
 */
export async function saveAcceptanceType(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-type`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 禁用
 * @async
 * @function disabledAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单类型信息
 * @returns {object} fetch Promise
 */
export async function disabledAcceptanceType(params) {
  return request(
    `${prefix}/${params.tenantId}/acceptance-type/disabled?acceptanceTypeId=${
      params.acceptanceTypeId
    }`,
    {
      method: 'POST',
      body: params,
    }
  );
}
/**
 * 启用
 * @async
 * @function enabledAcceptanceType
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 验收单类型信息
 * @returns {object} fetch Promise
 */
export async function enabledAcceptanceType(params) {
  return request(
    `${prefix}/${params.tenantId}/acceptance-type/enabled?acceptanceTypeId=${
      params.acceptanceTypeId
    }`,
    {
      method: 'POST',
      body: params,
    }
  );
}
/**
 * 查询验收单类型明细
 * @async
 * @function searchAcceptanceTypeDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.acceptanceTypeId - 验收单类型ID
 * @returns {object} fetch Promise
 */
export async function searchAcceptanceTypeDetail(params) {
  return request(`${prefix}/${params.tenantId}/acceptance-type/${params.acceptanceTypeId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 验收单类型明细页-数据检索
 * @async
 * @function searchByFullText
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.condition - 查询参数值
 * @param {!object} params.page - 分页信息
 * @returns {object} fetch Promise
 */
export async function searchByFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/acceptance-type`, {
    method: 'GET',
    query: param,
  });
}
