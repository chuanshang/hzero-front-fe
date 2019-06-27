/*
 * workProcessService - 备件耗材
 * @date: 2019-05-29
 * @author: dt <zhiguang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters, filterNullValueObject } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * 保存
 * @async
 * @function saveData
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function saveMaterialData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * fetchDetailListInfo - 备件耗材投入列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchMaterialListInfo(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material`, {
    method: 'GET',
    query: param,
  });
}

/**
 * fetchDetailListInfo - 备件耗材退回列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchMaterialReturnListInfo(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material/return`, {
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
export async function deleteMaterialData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material`, {
    method: 'DELETE',
    body: { ...params },
  });
}

/**
 * queryOrganizationList - 查询组织树状图
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryItemsTreeMaterialList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material/tree`, {
    method: 'GET',
    query: param,
  });
}

export async function queryItemsHisTreeMaterialList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/wo-material/treeHis`, {
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
    pathMap[temp.orgId] = [...(pathMap[temp.orgId] || []), temp.orgId];
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
