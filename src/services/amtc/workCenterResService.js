/*
 * workCenterResService - 技能类型
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * queryworkCenterResList - 技能类型列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryWorkCenterResList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchDetailInfo - 技能类型详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res/${params.workcenterResId}`, {
    method: 'GET',
  });
}

/**
 * fetchDetailListInfo - 技能类型详情行列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailListInfo(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-staff`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-res`, {
    method: 'POST',
    body: params,
  });
}

export async function createOrUpdatePeople(params) {
  if (params.workcenterPeopleId) {
    return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-staff`, {
      method: 'PUT',
      body: { ...params, enabledFlag: params.enabledFlag ? 1 : 0 },
    });
  } else {
    return request(`${HALM_MTC}/v1/${params.tenantId}/workcenter-staff`, {
      method: 'POST',
      body: { ...params, enabledFlag: params.enabledFlag ? 1 : 0 },
    });
  }
}
