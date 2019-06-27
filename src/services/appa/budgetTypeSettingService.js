/**
 * service - 预算类型设置
 * @date: 2019-03-06
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_PPM } from '@/utils/config';

/**
 * 获取预算类型设置类别
 * @async
 * @function queryBudgetTypeSettingList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetTypeSettingList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-type`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 保存预算类型设置类别
 * @async
 * @function saveData
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算项设置类别信息
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-type`, {
    method: 'POST',
    body: params.data,
  });
}
