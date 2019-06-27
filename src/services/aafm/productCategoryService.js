/**
 * service - 产品类别
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_ATN } from '@/utils/config';

/**
 * 获取产品类别
 * @async
 * @function queryProductCategoryList
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
 * 保存产品类别
 * @async
 * @function saveData
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 产品类别信息
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/product-categories`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 禁用产品类别
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
    `${HALM_ATN}/v1/${params.tenantId}/product-categories/${params.productCategoryId}/disabled`,
    {
      method: 'POST',
      body: { ...params },
    }
  );
}
/**
 * 启用产品类别
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
    `${HALM_ATN}/v1/${params.tenantId}/product-categories/${params.productCategoryId}/enabled`,
    {
      method: 'POST',
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
    pathMap[temp.productCategoryId] = [
      ...(pathMap[temp.parentCategoryId] || []),
      temp.productCategoryId,
    ];
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
