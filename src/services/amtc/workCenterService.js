/*
 * workCenterService - 工作中心服务
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * queryWorkCenterList - 工作中心列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryWorkCenterList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchDetailInfo - 工作中心详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter/${params.workcenterId}`, {
    method: 'GET',
  });
}

/**
 * fetchDetailListInfo - 工作中心详情列表行查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailListInfo(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
    method: 'GET',
    query: param,
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 启用当前及子节点
 * @async
 * @function enabledWorkCenter
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.workcenterId - Id
 */
export async function enabledWorkCenter(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter/${params.workcenterId}/enabled`, {
    method: 'PUT',
    body: { ...params },
  });
}

/**
 * 禁用当前及子节点
 * @async
 * @function disabledWorkCenter
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.workcenterId - Id
 */
export async function disabledWorkCenter(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter/${params.workcenterId}/disabled`, {
    method: 'PUT',
    body: { ...params },
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveWorkCenterResAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
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
export async function saveWorkCenterResEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
    method: 'PUT',
    body: params,
  });
}
