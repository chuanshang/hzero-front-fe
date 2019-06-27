/**
 * service - 工单管理
 * @date: 2019-4-18
 * @author: QH <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { HZERO_PLATFORM } from 'utils/config';
import { HALM_MTC } from '@/utils/config';

const prefix = `${HALM_MTC}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 * 查询列表数据
 * @async
 * @function queryWorkOrdersList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryWorkOrdersList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders`, {
    method: 'GET',
    query,
  });
}

/**
 * 保存
 * @async
 * @function saveData
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function saveData(params) {
  return request(`${prefix}/${params.tenantId}/work-orders`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 修改工单状态
 * @async
 * @function changeWoStatus
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function changeWoStatus(params) {
  return request(`${prefix}/${params.tenantId}/work-orders/changeStatus`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 删除
 * @async
 * @function deleteData
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function deleteData(params) {
  return request(`${prefix}/${params.tenantId}/work-orders`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 明细页面查询
 * @async
 * @function fetchDetailInfo
 * @param {string} params.tenantId - 租户id
 * @param {string} params.woId - id
 */
export async function fetchDetailInfo(params) {
  return request(`${prefix}/${params.tenantId}/work-orders/${params.woId}`, {
    method: 'GET',
    query: {
      ...params,
    },
  });
}

/**
 * 明细页面全文检索
 * @async
 * @function searchByFullText
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function searchByFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/work-orders`, {
    method: 'GET',
    query: param,
  });
}

/**
 * deleteData - 删除数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function deleteWoopData(params) {
  return request(`${prefix}/${params.tenantId}/woops`, {
    method: 'DELETE',
    body: { ...params },
  });
}
/**
 * 查询当前用户在当前租户下的员工
 * @async
 * @function getCurrentEmployee
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function getCurrentEmployee(params) {
  const param = parseParameters(params);
  return request(`${HZERO_PLATFORM}/v1/${param.tenantId}/employee-users/employee`, {
    method: 'GET',
    query: { enabledFlag: 1 },
  });
}
