/*
 * 物料管理
 * @date: 2019/5/2
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_MTC } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const prefix = `${HALM_MTC}/v1`;
const organizationId = getCurrentOrganizationId();

export async function createOrUpdateMaterialTsType(params) {
  const query = filterNullValueObject(params);
  if (query.transtypeId) {
    return request(`${prefix}/${organizationId}/products`, {
      method: 'PUT',
      body: { ...params, enabledFlag: 1 },
    });
  } else {
    return request(`${prefix}/${organizationId}/products`, {
      method: 'POST',
      body: { ...params, enabledFlag: 1 },
    });
  }
}

/**
 * 查询列表数据
 * @async
 * @function fetchMaterialTsTypeList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchMaterialTsTypeList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/products`, {
    method: 'GET',
    query,
  });
}
/**
 * 详情
 * @async
 * @function fetchMaterialTsTypeById
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchMaterialTsTypeById(params) {
  const query = filterNullValueObject(params);
  return request(`${prefix}/${organizationId}/products/${query.transtypeId}`, {
    method: 'GET',
  });
}
/**
 * 启用禁用
 * @async
 * @function toggleMaterialTsType
 * @param {Object} params - 参数
 * @param {String} params.enabled - 当前状态
 * @param {String} params.productId - 产品id
 */
export async function toggleMaterialTsType(params) {
  const query = filterNullValueObject(params);
  if (params.enabledFlag === 1) {
    return request(`${prefix}/${organizationId}/products/disabled/${query.transtypeId}`, {
      method: 'PUT',
    });
  } else {
    return request(`${prefix}/${organizationId}/products/enabled/${query.transtypeId}`, {
      method: 'PUT',
    });
  }
}
