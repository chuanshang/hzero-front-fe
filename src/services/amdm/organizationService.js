/*
 * service - 组织
 * @date: 2019-02-25
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HZERO_PLATFORM } from 'utils/config';
import { HALM_MDM } from '@/utils/config';

/**
 * queryOrganizationList - 查询组织树状图
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryOrganizationList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MDM}/v1/${params.tenantId}/org`, {
    method: 'GET',
    query: param,
  });
}

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org`, {
    method: 'PUT',
    body: params.orgs,
    query: { statusChanged: params.statusChanged },
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveAddData(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * queryProvinceCity - 查询国家地区.
 * @param {Number} countryId 国家ID
 * @export
 */
export async function queryProvinceCity(countryId) {
  return request(`${HZERO_PLATFORM}/v1/countries/${countryId}/regions`, {
    method: 'GET',
    query: {
      enabledFlag: 1,
    },
  });
}

/**
 * 禁用组织行信息
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org/${params.orgId}/disabled`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 启用组织行信息
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org/${params.orgId}/enabled`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 获取明细数据
 * @async
 * @function fetchDetailInfo
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} orgId - 组织Id
 * @returns {object} fetch Promise
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org/${params.orgId}`, {
    method: 'GET',
  });
}

/**
 * 动态获取特定组织的下级组织，更新页面数据展示
 * @deprecated
 * @param {array} collections - 页面展示数据
 * @param {array} cursorList - 特定组织的层级路径
 * @param {array} data - 替换特定组织对象的children属性值
 * @returns {array} 更新后的页面展示数据
 */
export function findAndSetNodeProps(collections, cursorList, data) {
  if (collections.length === 0) {
    return data;
  }
  let newCursorList = cursorList || [];
  const cursor = newCursorList[0];

  return collections.map(n => {
    const m = n;
    if (m.orgId === cursor) {
      if (newCursorList[1]) {
        newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
        m.children = findAndSetNodeProps(m.children, newCursorList, data);
      } else {
        m.children = [...data];
      }
      return m;
    }
    return m;
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
    pathMap[temp.orgId] = [...(pathMap[temp.orgId] || []), temp.orgId];
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
