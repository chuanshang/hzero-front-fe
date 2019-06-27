/**
 * service - 项目状态
 * @date: 2019-02-19
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 获取项目状态
 * @async
 * @function fetchProjectStatus
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchProjectStatus(params) {
  return request(`${prefix}/${params.tenantId}/project-status`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 批量数据保存
 * @async
 * @function saveProjectStatus
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveProjectStatus(params) {
  return request(`${prefix}/${params.tenantId}/project-status`, {
    method: 'POST',
    body: params.data,
  });
}
