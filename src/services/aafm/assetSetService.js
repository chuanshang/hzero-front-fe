/**
 * service - 资产组
 * @date: 2019-1-14
 * @version: 0.0.1
 * @author: WH <heng.wei@hand-china.com>
 * @copyright Copyright (c) 2019, Hands
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询资产组列表信息
 * @async
 * @function searchAssetSet
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetSet(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/assets-set`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询资产组明细
 * @async
 * @function searchAssetSetDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.assetSetId - 资产组ID
 * @returns {object} fetch Promise
 */
export async function searchAssetSetDetail(params) {
  return request(`${prefix}/${params.tenantId}/assets-set/${params.assetSetId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 新增资产组
 * @async
 * @function addAssetSet
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产组信息
 * @returns {object} fetch Promise
 */
export async function addAssetSet(params) {
  return request(`${prefix}/${params.tenantId}/assets-set`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 编辑资产组
 * @async
 * @function updateAssetSet
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产组信息
 * @returns {object} fetch Promise
 */
export async function updateAssetSet(params) {
  return request(`${prefix}/${params.tenantId}/assets-set`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 资产组明细页-数据检索
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
  return request(`${prefix}/${param.tenantId}/assets-set/detail/list`, {
    method: 'GET',
    query: param,
  });
}
