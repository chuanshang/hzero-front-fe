/**
 * service - 资产状态
 * @date: 2019-02-19
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

/**
 * 获取项目状态
 * @async
 * @function fetchAssetStatus
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchAssetStatus(params) {
  return request(`${prefix}/${params.tenantId}/asset-status`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 批量数据保存
 * @async
 * @function saveAssetStatus
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveAssetStatus(params) {
  return request(`${prefix}/${params.tenantId}/asset-status`, {
    method: 'PUT',
    body: params.data,
  });
}
