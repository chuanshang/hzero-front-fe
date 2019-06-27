/*
 * WoChecklistsService - 检查项服务
 * @date: 2019-05-31
 * @author: qzq <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * fetchWoChecklistsList - 标准检查组列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoChecklistsList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklists/tree`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchWoChecklistsDetail - 标准检查组详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchWoChecklistsDetail(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklists/${params.checklistsId}`, {
    method: 'GET',
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklists`, {
    method: 'POST',
    body: params,
  });
}

/**
 * deleteWoChecklists - 删除数据
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteWoChecklists(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-checklists`, {
    method: 'DELETE',
    body: params,
  });
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
