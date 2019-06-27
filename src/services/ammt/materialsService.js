/*
 * 物料管理
 * @date: 2019/5/2
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_MMT } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const prefix = `${HALM_MMT}/v1`;
const organizationId = getCurrentOrganizationId();

export async function createOrUpdateMaterials(params) {
  const query = filterNullValueObject(params);
  if (query.itemId) {
    return request(`${prefix}/${organizationId}/items`, {
      method: 'PUT',
      body: { ...params, enabledFlag: 1, tenantId: organizationId },
    });
  } else {
    return request(`${prefix}/${organizationId}/items`, {
      method: 'POST',
      body: { ...params, enabledFlag: 1, tenantId: organizationId },
    });
  }
}

/**
 * 查询列表数据
 * @async
 * @function queryWorkOrdersList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchMaterialList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/items`, {
    method: 'GET',
    query,
  });
}
/**
 * 详情
 * @async
 * @function queryWorkOrdersList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchMaterialById(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/items/${query.itemId}`, {
    method: 'GET',
  });
}
/**
 * 启用禁用物料
 * @async
 * @function queryWorkOrdersList
 * @param {Object} params - 参数
 * @param {String} params.enabled - 当前状态
 * @param {String} params.itemId - 产品id
 */
export async function enabledMaterial(params) {
  if (params.enabledFlag === 1) {
    return request(`${prefix}/${organizationId}/items/disabled/${params.itemId}`, {
      method: 'PUT',
    });
  } else {
    return request(`${prefix}/${organizationId}/items/enabled/${params.itemId}`, {
      method: 'PUT',
    });
  }
}

/**
 * 删除物料
 * @async
 * @function queryWorkOrdersList
 * @param {Object} params - 参数
 * @param {String} params.enabled - 当前状态
 * @param {String} params.itemId - 产品id
 */
export async function deleteMaterial(params) {
  if (params.enabledFlag === 1) {
    return request(`${prefix}/${organizationId}/items/disabled/${params.itemId}`, {
      method: 'PUT',
    });
  } else {
    return request(`${prefix}/${organizationId}/items/enabled/${params.itemId}`, {
      method: 'PUT',
    });
  }
}

/**
 * 删除物料的行结构
 * @async
 */
export async function deleteMaterialRow(params) {
  return request(`${prefix}/${organizationId}/items/remove-itemMaintSites`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 物料的分页、头行结构
 * @async
 */
export async function selectMaterialRow(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/items/line-list/${query.itemId}`, {
    method: 'GET',
    query,
  });
}
