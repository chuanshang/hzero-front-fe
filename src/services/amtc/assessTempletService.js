/*
 * assessTempletService - 服务评价模板
 * @date: 2019-04-29
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { parseParameters } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import request from 'utils/request';

/**
 * queryAssessTempletList - 服务评价模板列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryAssessTempletList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet`, {
    method: 'GET',
    query: param,
  });
}
/**
 * queryTempletItemslistsList - 评价项
 * @param params
 * @returns {Promise<void>}
 */
export async function queryTempletItemsList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/list/${params.templetId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryProblemList - 评价项
 * @param params
 * @returns {Promise<void>}
 */
export async function queryProblemList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/assess-templet/list/two/${params.templetItemId}`,
    {
      method: 'GET',
      query: param,
    }
  );
}

/**
 * fetchDetailInfo - 服务评价模板详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/${params.templetId}`, {
    method: 'GET',
  });
}

/**
 * fetchDetailInfo - 服务评价模板详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchTempletItemsDetailInfo(params) {
  return request(
    `${HALM_MTC}/v1/${params.tenantId}/assess-templet/list/detail/${params.templetItemId}`,
    {
      method: 'GET',
    }
  );
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet`, {
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
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveTempletItemsEditData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/update-actChecklists`, {
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
export async function saveTempletItemsAddData(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/create-actChecklists`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 启用当前及子节点
 * @async
 * @function enabledAssessTemplet
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function enabledAssessTemplet(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/enabled/${params.templetId}`, {
    method: 'PUT',
  });
}

/**
 * 禁用当前及子节点
 * @async
 * @function disabledAssessTemplet
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function disabledAssessTemplet(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/disabled/${params.templetId}`, {
    method: 'PUT',
  });
}

/**
 * 删除当前记录
 * @async
 * @function deleteTempletItems
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteTempletItems(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/remove-actChecklists`, {
    method: 'DELETE',
    body: { ...params },
  });
}

/**
 * 删除当前记录
 * @async
 * @function deleteTempletItems
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function deleteProblem(params) {
  return request(`${HALM_MTC}/v1/${params.tenantId}/assess-templet/remove-problemList`, {
    method: 'DELETE',
    body: { ...params },
  });
}
