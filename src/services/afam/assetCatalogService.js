/*
 * service - 资产目录
 * @date: 2019-3-21
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;

/**
 * 查询资产目录
 * @async
 * @function listAssetCatalog
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function listAssetCatalog(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-catalog`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 资产目录保存
 * @async
 * @function saveAssetCatalog
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveAssetCatalog(params) {
  return request(`${prefix}/${params.tenantId}/asset-catalog`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 资产目录当前记录及下级禁用
 * @async
 * @function forbidLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(
    `${prefix}/${params.tenantId}/asset-catalog/disabled?assetCatalogId=${params.assetCatalogId}`,
    {
      method: 'POST',
    }
  );
}
/**
 * 启用
 * @async
 * @function enabledLine
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(
    `${prefix}/${params.tenantId}/asset-catalog/enabled?assetCatalogId=${params.assetCatalogId}`,
    {
      method: 'POST',
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
    pathMap[temp.assetCatalogId] = [...(pathMap[temp.parentCatalogId] || []), temp.assetCatalogId];
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
