/*
 * woMalfunctionService - 故障/缺陷信息工单tab页
 * @date: 2019-04-18
 * @author: zzs <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

const prefix = `${HALM_MTC}/v1`;
/**
 * saveWoMalfuction - 保存/编辑数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveWoMalfuction(params) {
  return request(`${prefix}/${params.tenantId}/wo-malfunctions`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * listWoMalfuction - 查询 故障/缺陷信息
 * @export
 * @param {*} params
 * @returns
 */
export async function listWoMalfuction(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/wo-malfunctions`, {
    method: 'GET',
    query: param,
  });
}
/**
 * deleteWoMalfuction - 删除 故障/缺陷信息
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteWoMalfuction(params) {
  return request(`${prefix}/${params.tenantId}/wo-malfunctions`, {
    method: 'DELETE',
    body: params,
  });
}
/**
 * detailWoMalfuction - 故障/缺陷信息 明细
 * @export
 * @param {*} params
 * @returns
 */
export async function detailWoMalfuction(params) {
  return request(`${prefix}/${params.tenantId}/wo-malfunctions/${params.woMalfunctionId}`, {
    method: 'GET',
  });
}
