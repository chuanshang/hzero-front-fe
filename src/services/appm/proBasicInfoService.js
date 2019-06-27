/**
 * 项目基础信息
 * @date: 2019-2-19
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 查询项目基础信息列表信息
 * @async
 * @function searchProBasicInfo
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProBasicInfo(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/project-info`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询项目资源列表信息
 * @async
 * @function searchProjectSourceInfo
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProjectSourceInfo(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/project-info/${param.projectId}/resource`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询项目基础信息明细
 * @async
 * @function searchProBasicInfoDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.projectId - 项目基础信息ID
 * @returns {object} fetch Promise
 */
export async function searchProBasicInfoDetail(params) {
  return request(`${prefix}/${params.tenantId}/project-info/${params.projectId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 项目基础信息-删除
 * @async
 * @function deleteProBasicInfo
 * @param {object} params - 请求参数
 * @param {string} params.tenantId - 租户Id
 * @param {!Array<object>} params.data - 项目基础信息数组
 * @returns {object} fetch Promise
 */
export async function deleteProBasicInfo(params) {
  return request(`${prefix}/${params.tenantId}/project-info`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 *新增保存项目基础信息
 * @async
 * @function addProBasicInfo
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 项目基础信息
 * @returns {object} fetch Promise
 */
export async function addProBasicInfo(params) {
  return request(`${prefix}/${params.tenantId}/project-info`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *编辑保存项目基础信息
 * @async
 * @function updateProBasicInfo
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 项目基础信息
 * @returns {object} fetch Promise
 */
export async function updateProBasicInfo(params) {
  return request(`${prefix}/${params.tenantId}/project-info`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *提交项目基础信息审批
 * @async
 * @function submitProBasicInfo
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 项目基础信息
 * @returns {object} fetch Promise
 */
export async function submitProBasicInfo(params) {
  return request(`${prefix}/${params.tenantId}/project-info/${params.projectId}/submit`, {
    method: 'PUT',
    body: params.data,
  });
}

/**
 * 项目资源-删除
 * @async
 * @function deleteProjectSource
 * @param {object} params - 请求参数
 * @param {string} params.tenantId - 租户Id
 * @param {!Array<object>} params.data - 项目基础信息数组
 * @returns {object} fetch Promise
 */
export async function deleteProjectSource(params) {
  return request(`${prefix}/${params.tenantId}/project-info/${params.projectId}/resource`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 * 查询wbs计划头列表
 * @async
 * @function searchWBSPlan
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchWBSPlan(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/pro-wbs`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询项目状态
 * @async
 * @function searchProjectStatus
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProjectStatus(params) {
  return request(`${prefix}/${params.tenantId}/project-status`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询项目预算列表
 * @async
 * @function searchProjectBudgets
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProjectBudgets(params) {
  return request(`${prefix}/${params.tenantId}/project-budget/${params.projectId}/list`, {
    method: 'GET',
    // query: params,
  });
}
/**
 *初始化拟定版本项目预算
 * @async
 * @function initProjectBudget
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function initProjectBudget(params) {
  return request(`${prefix}/${params.tenantId}/project-budget/${params.projectId}/init/preset`, {
    method: 'POST',
    query: params.data,
  });
}
