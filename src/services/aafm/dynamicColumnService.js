/**
 * service - 资产动态字段
 * @date: 2019-04-02
 * @version: 0.0.1
 * @author: DT <ting.dai@hand-china.com>
 * @copyright Copyright (c) 2019, Hands
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

/**
 * API前缀
 * @type {string}
 */
const prefix = `${HALM_ATN}/v1`;

/**
 * 资产动态字段列表查询
 * @param params 请求参数
 * @param param.tenantId 租户ID
 * @returns {Promise<void>}
 */
export async function searchDynamicColumn(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dynamic-columns`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 资产动态字段添加
 * @param params 请求参数
 * @param param.tenantId 租户ID
 * @returns {Promise<void>}
 */
export async function saveDynamicColumn(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dynamic-columns`, {
    method: 'POST',
    body: param.data,
  });
}

/**
 * 资产动态字段删除
 * @param param params 请求参数
 * @param param.tenantId 租户ID
 * @returns {Promise<void>}
 */
export async function deleteDynamicColumn(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/dynamic-columns/${param.columnId}`, {
    method: 'DELETE',
    body: param,
  });
}
