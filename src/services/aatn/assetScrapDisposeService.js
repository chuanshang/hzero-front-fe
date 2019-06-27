/*
 * service - 资产报废单处理
 * @date: 2019-3-22
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询设备资产报废单处理list查询
 * @async
 * @function listAssetScrapDispose
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function listAssetScrapDispose(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/scrap/entryProcess`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 资产报废行确认
 * @async
 * @function confirmAssetScrapLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 资产报废信息
 * @returns {object} fetch Promise
 */
export async function confirmAssetScrapLine(params) {
  return request(`${prefix}/${params.tenantId}/scrap/confirm`, {
    method: 'POST',
    body: params.data,
  });
}
