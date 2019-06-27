/**
 * service - 服务区域
 * @date: 2019-1-7
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 * 查询列表数据
 * @async
 * @function queryFixedAssetsList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryFixedAssetsList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/fixed-assets`, {
    method: 'GET',
    query,
  });
}

/**
 * 保存
 * @async
 * @function saveData
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function saveData(params) {
  return request(`${prefix}/${params.tenantId}/fixed-assets`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 删除
 * @async
 * @function deleteData
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function deleteData(params) {
  return request(`${prefix}/${params.tenantId}/fixed-assets`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 明细页面查询
 * @async
 * @function fetchDetailInfo
 * @param {string} params.tenantId - 租户id
 * @param {string} params.fixedAssetId - id
 */
export async function fetchDetailInfo(params) {
  return request(`${prefix}/${params.tenantId}/fixed-assets/${params.fixedAssetId}`, {
    method: 'GET',
    query: {
      ...params,
    },
  });
}

/**
 * 明细页面全文检索
 * @async
 * @function searchByFullText
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function searchByFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/fixed-assets`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 行搜索
 * @async
 * @function searchChangeLines
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function searchChangeLines(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/fixed-assets/${params.fixedAssetId}/changes`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 行删除
 * @async
 * @function deleteChangeLines
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function deleteChangeLines(params) {
  return request(`${prefix}/${params.tenantId}/fixed-assets/${params.fixedAssetId}/removeChanges`, {
    method: 'DELETE',
    body: params.data,
  });
}
