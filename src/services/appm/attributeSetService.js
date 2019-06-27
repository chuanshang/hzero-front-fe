/**
 * service - 属性组
 * @date: 2019-1-2
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

/**
 *  查询属性组列表
 * @async
 * @function queryAttributeSetList
 * @param {Object} params - 查询参数
 * @param {String} params.tenantId - 租户ID
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryAttributeSetList(params) {
  const query = parseParameters(params);
  return request(`${HALM_PPM}/v1/${params.tenantId}/attribute-set`, {
    method: 'GET',
    query,
  });
}

/**
 *
 *  查询明细头数据
 * @async
 * @function fetchAttributeSetDetail
 * @param {Object} params - 查询参数
 * @param {String} params.tenantId - 租户ID
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchAttributeSetDetail(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/attribute-set/${params.attributeSetId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  查询明细行数据
 * @async
 * @function queryDetailLineList
 * @param {Object} params - 查询参数
 * @param {String} params.tenantId - 租户ID
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryDetailLineList(params) {
  const query = parseParameters(params);
  return request(`${HALM_PPM}/v1/${params.tenantId}/attribute-set/${params.attributeSetId}/line`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存明细数据
 * @async
 * @function saveDetailData
 * @param {Object} params - 查询参数
 * @param {String} params.tenantId - 租户ID
 */
export async function saveDetailData(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/attribute-set`, {
    method: 'POST',
    body: params.data,
  });
}
