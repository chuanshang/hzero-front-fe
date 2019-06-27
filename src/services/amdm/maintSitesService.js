/**
 * service - 服务区域
 * @date: 2019-1-7
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { HALM_MDM } from '@/utils/config';

const prefix = `${HALM_MDM}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 * 查询服务区域列表数据
 * @async
 * @function queryMaintSitesList
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryMaintSitesList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/maint-sites`, {
    method: 'GET',
    query,
  });
}

/**
 * 新增服务区域
 * @async
 * @function addMaintSites
 * @param {string} params - 查询参数
 * @param {string} params.tenantId - 租户Id
 */
export async function addMaintSites(params) {
  return request(`${prefix}/${params.tenantId}/maint-sites/add`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 明细页面查询
 * @async
 * @function queryDetail
 * @param {string} params.tenantId - 租户id
 * @param {string} params.maintSitesId - 服务区域id
 */
export async function queryDetail(params) {
  return request(`${prefix}/${params.tenantId}/maint-sites/${params.maintSitesId}`, {
    method: 'GET',
    query: {
      ...params,
    },
  });
}

/**
 * 明细修改保存
 * @async
 * @function saveDetail
 * @param {object} data - 保存的数据
 */
export async function saveDetail(data) {
  return request(`${prefix}/${organizationId}/maint-sites/update`, {
    method: 'POST',
    body: data,
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
  return request(`${prefix}/${param.tenantId}/maint-sites/retrieval`, {
    method: 'GET',
    query: param,
  });
}
