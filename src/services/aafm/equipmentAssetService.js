/**
 * service - 设备资产
 * @date: 2019-1-24
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';

const prefix = `${HALM_ATN}/v1`;
/**
 * 查询设备资产列表信息
 * @async
 * @function searchEquipmentAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchEquipmentAsset(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/asset-info`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询设备资产明细
 * @async
 * @function searchEquipmentAssetDetail
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.assetInfoId - 设备资产ID
 * @returns {object} fetch Promise
 */
export async function searchEquipmentAssetDetail(params) {
  return request(`${prefix}/${params.tenantId}/asset-info/${params.assetInfoId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 新增设备资产
 * @async
 * @function addEquipmentAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 设备资产信息
 * @returns {object} fetch Promise
 */
export async function addEquipmentAsset(params) {
  return request(`${prefix}/${params.tenantId}/asset-info`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 编辑设备资产
 * @async
 * @function updateEquipmentAsset
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.data - 设备资产信息
 * @returns {object} fetch Promise
 */
export async function updateEquipmentAsset(params) {
  return request(`${prefix}/${params.tenantId}/asset-info`, {
    method: 'PUT',
    body: params.data,
  });
}
/**
 * 设备资产-批量删除
 * @async
 * @function delete8D
 * @param {object} params - 请求参数
 * @param {string} params.tenantId - 租户Id
 * @param {!Array<object>} params.data - 设备资产数组
 * @returns {object} fetch Promise
 */
export async function deleteEquipmentAsset(params) {
  return request(`${prefix}/${params.tenantId}/asset-info`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 设备资产明细页-数据检索
 * @async
 * @function searchByFullText
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.detailCondition - 查询参数值
 * @param {!object} params.page - 分页信息
 * @returns {object} fetch Promise
 */
export async function searchByFullText(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/asset-info/list`, {
    method: 'GET',
    query: param,
  });
}
/**
 *
 * 查询属性明细行数据
 * @async
 * @function queryDetailLineList
 * @param {Object} params - 查询参数
 * @returns {object} fetch Promise
 */
export async function queryDetailLineList(params) {
  return request(`${prefix}/${params.tenantId}/attribute-sets/${params.attributeSetId}/line`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询资产履历事件列表
 * @async
 * @function searchEventHistory
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchEventHistory(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transaction-historys/event`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询资产履历字段列表
 * @async
 * @function searchFieldHistory
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchFieldHistory(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transaction-historys/field`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询资产字段列表
 * @async
 * @function searchAssetFields
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetFields(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/transaction-historys/asset/fields`, {
    method: 'GET',
    query: param,
  });
}
/**
 * queryTransactionTypesList - 查询资产事务类型list
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryTransactionTypesList(params) {
  const param = parseParameters(params);
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type/list`, {
    method: 'GET',
    query: param,
  });
}
