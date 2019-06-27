/*
 * act - 标准作业
 * @date: 2019-05-10
 * @author: zzs <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

const prefix = `${HALM_MTC}/v1`;

/**
 * 新增标准作业
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function addAct(params) {
  return request(`${prefix}/${params.tenantId}/act`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 更新标准作业
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function updateAct(params) {
  return request(`${prefix}/${params.tenantId}/act`, {
    method: 'PUT',
    body: params.data,
  });
}

/**
 * 标准作业list界面查询
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function listAct(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/act`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 标准作业明细界面查询
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function detailAct(params) {
  return request(`${prefix}/${params.tenantId}/act/${params.actId}`, {
    method: 'GET',
  });
}

/**
 * 工作任务行删除
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 工作任务信息
 * @returns {object} fetch Promise
 */
export async function deleteLine(params) {
  return request(`${prefix}/${params.tenantId}/actOp`, {
    method: 'DELETE',
    body: params.data,
  });
}
