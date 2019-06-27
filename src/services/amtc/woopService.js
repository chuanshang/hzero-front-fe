/*
 * workProcessService - 工作中心服务
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters, filterNullValueObject } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchDetailInfo - 工序明细查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWorkProcessDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/woops/${params.woopId}`, {
    method: 'GET',
  });
}

/**
 * fetchDetailListInfo - 工序详情列表行查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWorkProcessListInfo(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${HALM_MTC}/v1/${params.tenantId}/woops`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/woops`, {
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
export async function saveAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/woops`, {
    method: 'POST',
    body: params,
  });
}

/**
 * deleteData - 删除数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function deleteData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/woops`, {
    method: 'DELETE',
    body: params,
  });
}
