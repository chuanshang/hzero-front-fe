/**
 * service - 项目类型
 * @date: 2019-02-19
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;
/**
 * 查询项目类型
 * @async
 * @function queryProjectType
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryProjectType(params) {
  return request(`${prefix}/${params.tenantId}/project-type`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 批量数据保存
 * @async
 * @function saveProjectType
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveProjectType(params) {
  return request(`${prefix}/${params.tenantId}/project-type`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 禁用行
 * @async
 * @function forbidLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(`${prefix}/${params.tenantId}/project-type/disable`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 启用行
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(`${prefix}/${params.tenantId}/project-type/enable`, {
    method: 'PUT',
    body: params.data,
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
    pathMap[temp.proTypeId] = [...(pathMap[temp.parentTypeId] || []), temp.proTypeId];
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
