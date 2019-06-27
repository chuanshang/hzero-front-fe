/**
 * service-预算模板
 * @date: 2019-4-22
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM, HALM_ATN } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 查询预算模板头列表信息
 * @async
 * @function searchBudgetTemplates
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchBudgetTemplates(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/budget-template`, {
    method: 'GET',
    query: param,
  });
}

/**
 *保存预算模板
 * @async
 * @function saveBudgetTemplate
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算模板
 * @returns {object} fetch Promise
 */
export async function saveBudgetTemplate(params) {
  return request(`${prefix}/${params.tenantId}/budget-template`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *删除预算模板
 * @async
 * @function deleteBudgetTemplate
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算模板
 * @returns {object} fetch Promise
 */
export async function deleteBudgetTemplate(params) {
  return request(`${prefix}/${params.tenantId}/budget-template`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 *提交预算模板
 * @async
 * @function submitBudgetTemplate
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算模板
 * @returns {object} fetch Promise
 */
export async function submitBudgetTemplate(params) {
  return request(`${prefix}/${params.tenantId}/budget-template/submit`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 *删除预算模板-预算项
 * @async
 * @function deleteBudgetItem
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 预算模板
 * @returns {object} fetch Promise
 */
export async function deleteBudgetItem(params) {
  return request(`${prefix}/${params.tenantId}/budget-template/${params.templateId}`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 查询预算模板-预算项明细
 * @async
 * @function searchBudgetItems
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchBudgetItems(params) {
  return request(`${prefix}/${params.tenantId}/budget-template/${params.templateCode}`, {
    method: 'GET',
    query: params,
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
  return request(
    `${HALM_PPM}/v1/${params.tenantId}/budget-template/budget-asset/${params.templateItemId}`,
    {
      method: 'GET',
      query: params,
    }
  );
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
  return request(
    `${HALM_PPM}/v1/${params.tenantId}/budget-template/${params.templateId}/${
      params.templateItemId
    }`,
    {
      method: 'POST',
      body: params.data,
    }
  );
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
  return request(
    `${HALM_PPM}/v1/${params.tenantId}/budget-template/${params.templateId}/${
      params.templateItemId
    }`,
    {
      method: 'DELETE',
      body: params.data,
    }
  );
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
 * 获取产品类别列表
 * @async
 * @function queryAttributeList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryProductCategoryList(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/product-categories/list`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 获取预算类型
 * @async
 * @function queryBudgetType
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetType(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/budget-type`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询历史版本
 * @async
 * @function searchHistoryVersions
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchHistoryVersions(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/budget-template/versions/${param.templateCode}`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询历史版本
 * @async
 * @function searchHistoryDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchHistoryDetail(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/budget-template/history/${param.templateCode}`, {
    method: 'GET',
    query: param,
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
    pathMap[temp.templateItemId] = [
      ...(pathMap[temp.parentTemplateItemId] || []),
      temp.templateItemId,
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
/**
 * 处理接口获取的数据，提取每个节点的层次路径
 * @param {array} collections - 页面展示数据
 * @param {array} levelPath - 特定组织的层级路径
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderUpdatedTreeData(collections = [], levelPath = {}) {
  const pathMap = levelPath;
  const treeList = collections.map(item => {
    const temp = item;
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap).treeList];
    }
    return {
      ...temp,
      _flag: 'template',
    };
  });
  return {
    treeList,
    pathMap,
  };
}
