/*
 * inspectGroupService - 标准检查组服务
 * @date: 2019-05-17
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchInspectGroupList - 标准检查组列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchInspectGroupList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchInspectGroupDetail - 标准检查组详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchInspectGroupDetail(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups/${params.inspectGroupId}`,
    {
      method: 'GET',
    }
  );
}

/**
 * fetchActChecklistsList - 标准检查项tree列表
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchActChecklistsList(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists/tree`, {
    method: 'GET',
    query: params,
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups`, {
    method: 'POST',
    body: params,
  });
}

/**
 * deleteInspectGroup - 删除数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteInspectGroup(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * deleteChecklist - 删除检查项
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteChecklist(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/act-checklists`, {
    method: 'DELETE',
    body: params,
  });
}
/**
 * 启用
 * @async
 * @function enabledInspectGroup
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.inspectGroupId - Id
 */
export async function enabledInspectGroup(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups/enabled?checklistGroupId=${
      params.checklistGroupId
    }`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 禁用
 * @async
 * @function disabledInspectGroup
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.inspectGroupId - Id
 */
export async function disabledInspectGroup(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/act-checklist-groups/disabled?checklistGroupId=${
      params.checklistGroupId
    }`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 处理接口获取的数据，提取每个节点的层次路径
 * @param {array} collections - 页面展示数据
 * @param {array} levelPath - 特定组织的层级路径
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderTreeData(collections = [], levelPath = {}) {
  const pathMap = levelPath;
  const treeList = collections.map(item => {
    const temp = item;
    pathMap[temp.checklistId] = [...(pathMap[temp.parentChecklistId] || []), temp.checklistId];
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap).treeList];
    }
    return temp;
  });
  return {
    treeList,
    pathMap,
  };
}
