/*
 * service - 资产事务处理类型
 * @date: 2019-03-20 10:02:42
 * @author: HBT <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_ATN, HALM_MDM } from '@/utils/config';

/**
 * queryOrganizationList - 查询资产事物类型树状图
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryTransactionTypesTreeList(params) {
  const param = parseParameters(params);
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type/tree`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryOrganizationList - 查询资产事物类型list
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

/**
 * saveEditData - 保存更新数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function saveEditData(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type`, {
    method: 'POST',
    body: params.data,
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
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 获取明细数据
 * @async
 * @function fetchDetailInfo
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} transactionTypeId - 事件类型Id
 * @returns {object} fetch Promise
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type/${params.transactionTypeId}`, {
    method: 'GET',
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
  return request(`${HALM_ATN}/v1/${params.tenantId}/transaction-type/list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 禁用当前及子节点
 * @async
 * @function enabledTransactionTypes
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function enabledTransactionTypes(params) {
  return request(
    `${HALM_ATN}/v1/${params.tenantId}/transaction-type/${params.transactionTypeId}/enabled`,
    {
      method: 'PUT',
      body: { ...params },
    }
  );
}

/**
 * 禁用当前及子节点
 * @async
 * @function disabledTransactionTypes
 * @param {string} params - 参数
 * @param {string} params.tenantId - 租户Id
 * @param {string} params.transactionTypeId - Id
 */
export async function disabledTransactionTypes(params) {
  return request(
    `${HALM_ATN}/v1/${params.tenantId}/transaction-type/${params.transactionTypeId}/disabled`,
    {
      method: 'PUT',
      body: { ...params },
    }
  );
}

/**
 * 动态获取特定资产事物类型的下级资产事物类型，更新页面数据展示
 * @deprecated
 * @param {array} collections - 页面展示数据
 * @param {array} cursorList - 特定资产事物类型的层级路径
 * @param {array} data - 替换特定资产事物类型对象的children属性值
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
 * @param {array} levelPath - 特定资产事物类型的层级路径
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderTreeData(collections = [], levelPath = {}) {
  const pathMap = levelPath;
  const treeList = collections.map(item => {
    const temp = item;
    pathMap[temp.transactionTypeId] = [
      ...(pathMap[temp.transactionTypeId] || []),
      temp.transactionTypeId,
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

/**
 *  获取组织
 * @async
 * @function searchTransactionTypesOrg
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchTransactionTypesOrg(params) {
  return request(`${HALM_MDM}/v1/${params.tenantId}/org/list`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  获取资产状态
 * @async
 * @function searchAssetStatus
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetStatus(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/asset-status`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  获取资产专业分类
 * @async
 * @function searchAssetSpecialty
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchAssetSpecialty(params) {
  return request(`${HALM_ATN}/v1/${params.tenantId}/asset-specialty`, {
    method: 'GET',
    query: params,
  });
}
