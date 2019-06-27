/*
 * rcSystemService - 工作中心服务
 * @date: 2019-04-29
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * queryRcSystemList - 故障缺陷评估项列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryRcSystemList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate`, {
    method: 'GET',
    query: param,
  });
}
/**
 * queryEvaluateObjectsList - 评估项关联对象
 * @param params
 * @returns {Promise<void>}
 */
export async function queryEvaluateObjectsList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/evaluate-objects/${params.rcAssesmentId}`,
    {
      method: 'GET',
      query: param,
    }
  );
}

/**
 * queryEvaluateCodesList - 评估对象代码
 * @param params
 * @returns {Promise<void>}
 */
export async function queryEvaluateCodesList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/evaluate-codes/${params.rcAssesmentId}/tree`,
    {
      method: 'GET',
      query: param,
    }
  );
}

/**
 * fetchDetailInfo - 故障缺陷详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/${params.rcAssesmentId}`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate`, {
    method: 'PUT',
    body: { ...params },
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 启用当前及子节点
 * @async
 * @function enabledRcSystemType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function enabledRcSystem(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/enabled?evaluateId=${params.rcAssesmentId}`,
    {
      method: 'PUT',
    }
  );
}

/**
 * 禁用当前及子节点
 * @async
 * @function disabledRcSystemType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function disabledRcSystem(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/disabled?evaluateId=${params.rcAssesmentId}`,
    {
      method: 'PUT',
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
  const evaluateCodesTreeList = collections.map(item => {
    const temp = item;
    pathMap[temp.asmtCodesId] = [...(pathMap[temp.parentCodeId] || []), temp.asmtCodesId];
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap).evaluateCodesTreeList];
    }
    return temp;
  });
  return {
    evaluateCodesTreeList,
    pathMap,
  };
}

/**
 * 删除当前记录
 * @async
 * @function deleteEvaluateObjects
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteEvaluateObjects(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/remove-evaluate-objects`, {
    method: 'DELETE',
    body: { ...params },
  });
}

/**
 * 删除当前记录
 * @async
 * @function deleteEvaluateCodes
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteEvaluateCodes(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-evaluate/remove-evaluate-codes`, {
    method: 'DELETE',
    body: { ...params },
  });
}
