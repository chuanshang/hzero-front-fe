/*
 * 物料事务处理批
 * @date: 2019/5/13
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_MMT } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const prefix = `${HALM_MMT}/v1`;
const organizationId = getCurrentOrganizationId();

export async function createOrUpdateMaterialsTsMulti(params) {
  const query = filterNullValueObject(params);
  if (query.transbatchId) {
    return request(`${prefix}/${organizationId}/trans-batch`, {
      method: 'PUT',
      body: { ...params },
    });
  } else {
    return request(`${prefix}/${organizationId}/trans-batch`, {
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
export async function fetchMaterialsTsMultiList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/trans-batch`, {
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
export async function fetchMaterialsTsMultiById(params) {
  const query = filterNullValueObject(params);
  return request(`${prefix}/${organizationId}/trans-batch/${query.transbatchId}`, {
    method: 'GET',
  });
}

/**
 * 删除行结构
 * @async
 */
export async function deleteInnerRow(params) {
  return request(`${prefix}/${organizationId}/trans-lines`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 分页、头行结构
 * @async
 */
export async function fetchInnerRowById(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/trans-lines/${query.transbatchId}`, {
    method: 'GET',
    query,
  });
}
