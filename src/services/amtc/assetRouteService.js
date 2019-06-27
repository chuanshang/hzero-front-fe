/*
 * assetRoute - 资产路线
 * @date: 2019-04-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * queryAssetRouteList - 资产路线列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryAssetRouteList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchDetailInfo - 资产路线详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute/${params.assetRouteId}`, {
    method: 'GET',
  });
}

/**
 * fetchDetailListInfo -资产路线行查询
 * @param params
 * @returns {Promise<void>}
 * @param {string} params.assetHeaderId - Id
 */
export async function fetchDetailListInfo(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute/list/${params.assetRouteId}`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 启用
 * @async
 * @function enabledAssetRoute
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.assetHeaderId - Id
 */
export async function enabledAssetRoute(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute/enabled`, {
    method: 'PUT',
    query: { ...params },
  });
}

/**
 * 禁用
 * @async
 * @function disabledAssetRoute
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.assetHeaderId - Id
 */
export async function disabledAssetRoute(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute/disabled`, {
    method: 'PUT',
    query: { ...params },
  });
}

/**
 * 删除当前记录
 * @async
 * @function deleteAssetRouteLine
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 */
export async function deleteAssetRouteLine(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assetroute/remove-line`, {
    method: 'DELETE',
    body: { ...params },
  });
}
