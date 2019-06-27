/**
 * service - 预算项设置
 * @date: 2019-03-06
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_PPM, HALM_ATN } from '@/utils/config';

/**
 * 获取预算项设置
 * @async
 * @function queryBudgetItemSettingList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetItemSettingList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 保存预算项设置
 * @async
 * @function saveData
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算项设置类别信息
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 禁用预算项设置
 * @async
 * @function forbidLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.itemId - 预算项Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item/disabled?itemId=${params.itemId}`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 启用预算项设置类别
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.itemId - 预算项Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item/enabled?itemId=${params.itemId}`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 获取预算项关联资产列表
 * @async
 * @function queryBudgetItemAssetList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetItemAssetList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item/asset/list`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 预算项关联资产保存
 * @async
 * @function saveBudgetItemAsset
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算项设置类别信息
 * @returns {object} fetch Promise
 */
export async function saveBudgetItemAsset(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item/asset/save`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 预算项关联资产删除
 * @async
 * @function deleteBudgetItemAsset
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算项设置类别信息
 * @returns {object} fetch Promise
 */
export async function deleteBudgetItemAsset(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-item/asset/delete`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 获取资产组关联属性组的行列表
 * @async
 * @function queryAttributeList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryAttributeList(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/attribute-sets/${params.attributeSetId}/line`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 获取资产组列表
 * @async
 * @function queryAttributeList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryAssetSetList(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/assets-set`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 获取资产组列表
 * @async
 * @function queryAttributeList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryProductCategoryList(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/product-categories`, {
    method: 'GET',
    query: params,
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
    pathMap[temp.itemId] = [...(pathMap[temp.parentItemId] || []), temp.itemId];
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
