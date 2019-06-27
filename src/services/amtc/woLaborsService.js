/*
 * woLaborsService - 人员服务
 * @date: 2019-06-13
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchWoLaborsList - 人员列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoLaborsList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-labors`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchWoLaborsDetail - 人员详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoLaborsDetail(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-labors/${params.id}`, {
    method: 'GET',
  });
}

/**
 * saveAddData - 保存新建数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-labors`, {
    method: 'POST',
    body: params,
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-labors`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * deleteWoLabors - 删除数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteWoLabors(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-labors`, {
    method: 'DELETE',
    body: params,
  });
}
