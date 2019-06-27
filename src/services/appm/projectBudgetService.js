/**
 * service-项目预算
 * @date: 2019-5-5
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { HALM_PPM, HALM_ATN } from '@/utils/config';
import { parseParameters } from 'utils/utils';

const prefix = `${HALM_PPM}/v1`;

/**
 * 查询项目预算
 * @async
 * @function searchBudgetItems
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchBudgetItems(params) {
  return request(`${prefix}/${params.tenantId}/project-budget-item/${params.proBudgetId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询项目基础信息明细
 * @async
 * @function searchProBasicInfoDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.projectId - 项目基础信息ID
 * @returns {object} fetch Promise
 */
export async function searchProBasicInfoDetail(params) {
  return request(`${prefix}/${params.tenantId}/project-info/${params.projectId}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询对比列表
 * @async
 * @function searchCompareList
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchCompareList(params) {
  const param = parseParameters(params);
  delete param.proBudgetItemList;
  return request(`${prefix}/${params.tenantId}/project-budget-item/${params.proBudgetId}/compare`, {
    method: 'POST',
    query: param,
    body: params.proBudgetItemList,
  });
}
/**
 * 查询预算明细
 * @async
 * @function searchBudgetDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchBudgetDetail(params) {
  return request(
    `${prefix}/${params.tenantId}/project-budget/${params.projectId}/${params.proBudgetId}`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 *保存项目预算
 * @async
 * @function saveProjectBudget
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 项目预算
 * @returns {object} fetch Promise
 */
export async function saveProjectBudget(params) {
  return request(`${prefix}/${params.tenantId}/project-budget-item/${params.proBudgetId}`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *删除预算项
 * @async
 * @function deleteBudgetItem
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function deleteBudgetItem(params) {
  return request(`${prefix}/${params.tenantId}/project-budget-item/${params.proBudgetId}`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 *提交项目预算
 * @async
 * @function submitProjectBudget
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function submitProjectBudget(params) {
  return request(`${prefix}/${params.tenantId}/project-budget-item/${params.proBudgetId}/submit`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 *拷贝项目预算
 * @async
 * @function copyProjectBudget
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function copyProjectBudget(params) {
  const param = parseParameters(params);
  return request(
    `${prefix}/${param.tenantId}/project-budget-item/${param.proBudgetId}/copy-template`,
    {
      method: 'POST',
      query: params.data,
    }
  );
}
/**
 *复制自历史版本
 * @async
 * @function copyHistory
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function copyHistory(params) {
  const param = parseParameters(params);
  return request(
    `${prefix}/${param.tenantId}/project-budget-item/${param.proBudgetId}/copy-history`,
    {
      method: 'POST',
      query: params.data,
    }
  );
}

/**
 * 获取预算项关联资产列表
 * @async
 * @function queryBudgetItemAssetList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetItemAssetList(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/project-budget-asset`, {
    method: 'GET',
    query: param,
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
  return request(`${prefix}/${params.tenantId}/project-budget-asset/save`, {
    method: 'POST',
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
  return request(`${prefix}/${params.tenantId}/project-budget-asset`, {
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
  return request(`${prefix}/${params.tenantId}/budget-type`, {
    method: 'GET',
    query: params,
  });
}
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
 * 查询预算模板-预算项明细
 * @async
 * @function searchTemplateBudgetItems
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchTemplateBudgetItems(params) {
  return request(`${prefix}/${params.tenantId}/budget-template/${params.templateCode}`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询项目周期包含的预算期间
 * @async
 * @function queryBudgetPeriod
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryBudgetPeriod(params) {
  return request(`${prefix}/${params.tenantId}/budget-period`, {
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
    pathMap[temp.proBudgetItemId] = [
      ...(pathMap[temp.parentProBudgetItemId] || []),
      temp.proBudgetItemId,
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
export function renderCreatedTreeData(collections = [], levelPath = {}) {
  const pathMap = levelPath;
  const treeList = collections.map(item => {
    const temp = item;
    delete temp.objectVersionNumber;
    delete temp._token;
    pathMap[temp.proBudgetItemId] = [
      ...(pathMap[temp.parentProBudgetItemId] || []),
      temp.proBudgetItemId,
    ];
    if (temp.parentTemplateItemId) {
      temp.parentProBudgetItemId = temp.parentTemplateItemId;
    }
    if (temp.itemId) {
      temp.budgetItemId = temp.itemId;
    }
    // if(!isUndefined(temp.budgetStandard) || isUndefined(temp.fixedBudget)) {
    //   temp.occupiedBudgetAmount =
    // }
    if (temp.children) {
      temp.children = [...renderCreatedTreeData(temp.children || [], pathMap).treeList];
    }
    return {
      ...temp,
      proBudgetItemId: temp.templateItemId,
      _status: 'create',
    };
  });
  return {
    treeList,
    pathMap,
  };
}
