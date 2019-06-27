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
 * queryrcSystemList - 故障缺陷列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryRcSystemList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect`, {
    method: 'GET',
    query: param,
  });
}
/**
 * queryWorkCenterList - 评估计算项列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryEvaluateCalcsList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-defect/evaluate-calcs/${params.rcSystemId}`,
    {
      method: 'GET',
      query: param,
    }
  );
}

/**
 * queryWorkCenterList - 评估字段层次列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryEvaluateHierarchiesList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-defect/evaluate-hierarchies/${params.rcSystemId}`,
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect/${params.rcSystemId}`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect`, {
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
export async function enabledRcSystemType(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-defect/enabled?faultdefectId=${params.rcSystemId}`,
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
export async function disabledRcSystemType(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/fault-defect/disabled?faultdefectId=${params.rcSystemId}`,
    {
      method: 'PUT',
    }
  );
}
/**
 * 删除当前记录
 * @async
 * @function enabledRcSystemType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteEvaluateCalcs(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect/remove-evaluate-calcs`, {
    method: 'DELETE',
    body: { ...params },
  });
}

/**
 * 删除当前记录
 * @async
 * @function disabledRcSystemType
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteEvaluateHierarchies(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/fault-defect/remove-evaluate-hierarchies`, {
    method: 'DELETE',
    body: { ...params },
  });
}
