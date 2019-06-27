/**
 * service - 物料类别
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_MMT } from '@/utils/config';

/**
 * 获取物料类别
 * @async
 * @function queryProductCategoryList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryMaterialsCategoryList(params) {
  return request(`${HALM_MMT}/v1/${params.tenantId}/item-categoriess`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 保存物料类别
 * @async
 * @function saveData
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 物料类别信息
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${HALM_MMT}/v1/${params.tenantId}/item-categoriess`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 禁用物料类别
 * @async
 * @function forbidLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.productCategoryId - 类别Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(
    `${HALM_MMT}/v1/${params.tenantId}/item-categoriess/disabled/${params.itemCategoryId}`,
    {
      method: 'PUT',
      body: { ...params },
    }
  );
}
/**
 * 启用物料类别
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.productCategoryId - 类别Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(
    `${HALM_MMT}/v1/${params.tenantId}/item-categoriess/enabled/${params.itemCategoryId}`,
    {
      method: 'PUT',
      body: { ...params },
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
    pathMap[temp.itemCategoryId] = [...(pathMap[temp.parentCategoryId] || []), temp.itemCategoryId];
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
