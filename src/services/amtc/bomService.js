/*
 * act - 标准作业
 * @date: 2019-05-10
 * @author: zzs <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

const prefix = `${HALM_MTC}/v1`;

/**
 * 新增Bom头
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function addBom(params) {
  return request(`${prefix}/${params.tenantId}/bom`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 更新Bom头
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function updateBom(params) {
  return request(`${prefix}/${params.tenantId}/bom`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * BOMlist界面查询
 * @async
 * @function listBom
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function listBom(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/bom/list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * BOM明细界面查询
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function detailBom(params) {
  return request(`${prefix}/${params.tenantId}/bom/${params.bomId}`, {
    method: 'GET',
  });
}

/**
 * Bom头删除
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 工作任务信息
 * @returns {object} fetch Promise
 */
export async function deleteBom(params) {
  return request(`${prefix}/${params.tenantId}/bom/batchDelete`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 * 新增Bom行
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function addBomLine(params) {
  return request(`${prefix}/${params.tenantId}/bom/${params.bomId}/line`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 更新Bom行
 * @async
 * @function addAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function updateBomLine(params) {
  return request(`${prefix}/${params.tenantId}/bom/${params.bomId}/line`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * BOMlist界面查询
 * @async
 * @function listBom
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 标准作业信息
 * @returns {object} fetch Promise
 */
export async function listBomTree(params) {
  return request(`${prefix}/${params.tenantId}/bom/${params.bomId}/line/tree`, {
    method: 'GET',
  });
}

/**
 * Bom头删除
 * @async
 * @function listAct
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 工作任务信息
 * @returns {object} fetch Promise
 */
export async function deleteBomLine(params) {
  return request(`${prefix}/${params.tenantId}/bom/${params.bomId}/line`, {
    method: 'DELETE',
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
    pathMap[temp.bomLineId] = [...(pathMap[temp.parentBomLineId] || []), temp.bomLineId];
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
