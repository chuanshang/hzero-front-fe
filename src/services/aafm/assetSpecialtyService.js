/**
 * service - 资产专业管理
 * @date: 2019-02-25
 * @version: 0.0.1
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @copyright Copyright (c) 2019, Hands
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询资产专业管理列表信息
 * @async
 * @function searchAssetSpecialty
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetSpecialty(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-specialty`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 资产专业分类导出
 * @async
 * @function exportAssetSpecialty
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function exportAssetSpecialty(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-specialty/export`, {
    method: 'POST',
    query: param,
  });
}
/**
 * 新增资产专业管理
 * @async
 * @function addAssetSpecialty
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产专业管理信息
 * @returns {object} fetch Promise
 */
export async function addAssetSpecialty(params) {
  return request(`${prefix}/${params.tenantId}/asset-specialty`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 编辑资产专业管理
 * @async
 * @function updateAssetSpecialty
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产专业管理信息
 * @returns {object} fetch Promise
 */
export async function updateAssetSpecialty(params) {
  return request(`${prefix}/${params.tenantId}/asset-specialty`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 查询资产专业管理明细
 * @async
 * @function searchAssetSpecialtyDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.assetSpecialtyId - 资产专业管理ID
 * @returns {object} fetch Promise
 */
export async function searchAssetSpecialtyDetail(params) {
  return request(`${prefix}/${params.tenantId}/asset-specialty/${params.assetSpecialtyId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 资产专业管理明细页-数据检索
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
  return request(`${prefix}/${param.tenantId}/asset-specialty/list`, {
    method: 'GET',
    query: param,
  });
}
