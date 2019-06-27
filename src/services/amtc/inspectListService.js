/*
 * inspectListService - 标准检查组服务
 * @date: 2019-05-17
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchInspectListList - 标准检查组列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchInspectListList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchProblemList - 问题清单列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchProblemList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists/problemList`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchInspectListDetail - 标准检查组详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchInspectListDetail(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists/${params.id}`, {
    method: 'GET',
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists`, {
    method: 'POST',
    body: params,
  });
}

/**
 * deleteInspectList - 删除数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteInspectList(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * deleteProblems - 删除问题清单数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteProblems(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists/problemRemove`, {
    method: 'DELETE',
    body: params,
  });
}
