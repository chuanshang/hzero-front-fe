/**
 * service - 项目模板
 * @date: 2019-3-6
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 获取项目模板
 * @async
 * @function fetchProjectTemplate
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchProjectTemplate(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/project-templates`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 获取项目模板明细
 * @async
 * @function fetchTemplateDetail
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTemplateId - 项目模板Id
 * @returns {object} fetch Promise
 */
export async function fetchTemplateDetail(params) {
  return request(`${prefix}/${params.tenantId}/project-templates/${params.proTemplateId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 保存项目模板
 * @async
 * @function saveTemplate
 * @param {!string} params.tenantId - 租户Id
 * @param {!object} params.data - 项目模板数据
 * @returns {object} fetch Promise
 */
export async function saveTemplate(params) {
  return request(`${prefix}/${params.tenantId}/project-templates`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 删除项目模板
 * @async
 * @function removeTemplate
 * @param {!string} params.tenantId - 租户Id
 * @param {!Array<object>} params.data - 项目模板数据
 * @returns {object} fetch Promise
 */
export async function removeTemplate(params) {
  return request(`${prefix}/${params.tenantId}/project-templates`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 * 项目模板提交
 * @async
 * @function submitTemplate
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTemplateId - 项目模板Id
 * @param {!object} params.data - 项目模板数据
 * @returns {object} fetch Promise
 */
export async function submitTemplate(params) {
  return request(`${prefix}/${params.tenantId}/project-templates/${params.proTemplateId}/submit`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 *  获取项目角色
 * @async
 * @function searchProjectRole
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProjectRole(params) {
  return request(`${prefix}/${params.tenantId}/project-role`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取版本历史
 * @async
 * @function searchHistory
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchHistory(params) {
  const param = parseParameters(params);
  return request(
    `${prefix}/${param.tenantId}/project-templates/${params.proTemplateId}/history/version`,
    {
      method: 'GET',
      query: param,
    }
  );
}
