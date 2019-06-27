/*
 * WoChecklistGroupsService - 检查组服务
 * @date: 2019-05-31
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchWoChecklistGroupsList - 标准检查组列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoChecklistGroupsList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklist-groups`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchWoChecklistGroupsDetail - 标准检查组详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoChecklistGroupsDetail(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/wo-checklist-groups/${params.checklistGroupId}`,
    {
      method: 'GET',
    }
  );
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklist-groups`, {
    method: 'POST',
    body: params,
  });
}

/**
 * deleteWoChecklistGroups - 删除数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteWoChecklistGroups(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklist-groups`, {
    method: 'DELETE',
    body: params,
  });
}
