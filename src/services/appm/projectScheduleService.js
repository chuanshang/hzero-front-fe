/**
 * 项目基础信息
 * @date: 2019-3-11
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 查询项目进度列表信息
 * @async
 * @function fetchProjectSchedule
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchProjectSchedule(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/pro-schedule/tasks`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询项目进度历史列表信息
 * @async
 * @function fetchProjectScheduleHistory
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchProjectScheduleHistory(params) {
  return request(`${prefix}/${params.tenantId}/pro-schedule/task-schedule/${params.projectId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 *新增保存项目基础信息
 * @async
 * @function saveData
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${prefix}/${params.tenantId}/pro-schedule`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *新增保存项目基础信息
 * @async
 * @function submitData
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function submitData(params) {
  return request(`${prefix}/${params.tenantId}/pro-schedule/submit`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 查询工作清单列表
 * @async
 * @function searchWorkList
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchWorkList(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/wbs-work-list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 工作清单操作
 * @async
 * @function operateWorkList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function operateWorkList(params) {
  return request(`${prefix}/${params.tenantId}/wbs-work-list/${params.workListId}`, {
    method: 'POST',
    query: params,
  });
}

/**
 * 完成进度
 * @async
 * @function completeSchedule
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function completeSchedule(params) {
  return request(`${prefix}/${params.tenantId}/pro-schedule/${params.wbsLineId}/complete`, {
    method: 'POST',
  });
}
/**
 * 取消完成进度
 * @async
 * @function resetSchedule
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function resetSchedule(params) {
  return request(`${prefix}/${params.tenantId}/pro-schedule/${params.wbsLineId}/reset`, {
    method: 'POST',
    query: params,
  });
}

/**
 * 工作清单交付物上传
 * @async
 * @function uploadAttachment
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function uploadAttachment(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/wbs-work-list/attachment`, {
    method: 'POST',
    body: params.data,
  });
}
