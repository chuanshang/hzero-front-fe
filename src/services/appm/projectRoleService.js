/**
 * service - 项目角色
 * @date: 2019-02-21
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 获取项目角色
 * @async
 * @function fetchProjectRole
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchProjectRole(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/project-role`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 批量数据保存
 * @async
 * @function saveProjectRole
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveProjectRole(params) {
  return request(`${prefix}/${params.tenantId}/project-role`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 变更角色权限
 * @async
 * @function updateRolePermission
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function updateRolePermission(params) {
  return request(`${prefix}/${params.tenantId}/project-role/permissions`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 获取角色关联的权限
 * @async
 * @function queryRolePermission
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proRoleId - 项目角色ID
 * @returns {object} fetch Promise
 */
export async function queryRolePermission(params) {
  return request(`${prefix}/${params.tenantId}/project-permissions/${params.proRoleId}`, {
    method: 'GET',
  });
}
