/**
 * service - 产品类别
 * @date: 2019-01-14
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_MDM } from '@/utils/config';
import { HZERO_PLATFORM } from 'utils/config';

/**
 * 查询位置树状图
 * @async
 * @function queryLocationList
 * @param {Object} params
 * @param {!String} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function queryLocationList(params) {
  const param = parseParameters(params);
  return request(`${HALM_MDM}/v1/${param.tenantId}/asset-locations`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存更新数据
 * @async
 * @function saveEditData
 * @param {Object} params
 * @param {!String} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveEditData(params) {
  // debugger;
  return request(`${HALM_MDM}/v1/${params.tenantId}/asset-locations`, {
    method: 'PUT',
    body: params.assetLocations,
    query: { statusChanged: params.statusChanged },
  });
}

/**
 * 保存新增数据
 * @async
 * @function saveAddData
 * @param {Object} params
 * @param {!String} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveAddData(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/asset-locations`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 查询国家地区.
 * @async
 * @function queryProvinceCity
 * @param {Number} countryId 国家ID
 * @returns {object} fetch Promise
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
 * 禁用位置行信息
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/asset-locations/disable`, {
    method: 'PUT',
    body: { ...params },
  });
}
/**
 * 启用位置行信息
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function enabledLine(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/asset-locations/enable`, {
    method: 'PUT',
    body: { ...params },
  });
}

/**
 * 获取明细数据
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/asset-locations/${params.id}`, {
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
    if (m.assetLocationId === cursor) {
      if (newCursorList[1]) {
        // if (!m.children) {
        //   m.children = [];
        // }
        newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
        m.children = findAndSetNodeProps(m.children, newCursorList, data);
      } else {
        // m.children = Array.from(new Set(m.children.concat(data)));
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
    pathMap[temp.assetLocationId] = [
      ...(pathMap[temp.assetLocationId] || []),
      temp.assetLocationId,
    ];
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
