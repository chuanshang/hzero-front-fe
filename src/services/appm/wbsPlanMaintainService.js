/*
 * service - wbs计划维护
 * @date: 2019-3-12
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { isNull } from 'lodash';
import { HALM_PPM } from '@/utils/config';
import moment from 'moment';

/**
 * queryWBSPlanMaintainList - 查询任务树状图
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryWBSPlanMaintainList(params) {
  const param = parseParameters(params);
  return request(`${HALM_PPM}/v1/${param.tenantId}/pro-wbs/${param.wbsHeaderId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 获取明细数据
 * @async
 * @function fetchDetailInfo
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchDetailInfo(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/line-detail/${params.wbsLineId}`, {
    method: 'GET',
  });
}

/**
 * 保存数据
 * @async
 * @function saveAddData
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/${params.wbsHeaderId}`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 删除计划
 * @async
 * @function deleteWBS
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function deleteWBS(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs`, {
    method: 'DELETE',
    body: params.data,
    query: { projectId: params.projectId },
  });
}
/**
 * 提交
 * @async
 * @function submitWBS
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function submitWBS(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/submit`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 查询wbs计划头列表
 * @async
 * @function searchWBSPlanHeader
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchWBSPlanHeader(params) {
  const param = parseParameters(params);
  return request(`${HALM_PPM}/v1/${param.tenantId}/pro-wbs`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 禁用行信息
 * @async
 * @function enabledLine
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.unitId - 组织Id
 * @param {!string} params._token - token
 * @param {!number} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function forbidLine(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/org/${params.orgId}/disabled`, {
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
  return request(`${HALM_PPM}/v1/${params.tenantId}/org/${params.orgId}/enabled`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * queryUserList - 查询参与人列表
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryUserList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/project-info/${params.projectId}/resource`, {
    method: 'GET',
    query: params,
  });
}
/**
 * queryDeleteList - 查询删除任务涉及的前置任务
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryDeleteList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/${params.wbsLineId}/delete-rels`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询工作清单列表
 * @async
 * @function searchWorkList
 * @param {object} params - 请求参数
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchWorkList(params) {
  const param = parseParameters(params);
  return request(`${HALM_PPM}/v1/${param.tenantId}/wbs-work-list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存工作清单
 * @async
 * @function saveWorkList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveWorkList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/wbs-work-list`, {
    method: 'POST',
    query: params,
    body: params.data,
  });
}
/**
 * 删除工作清单
 * @async
 * @function saveWorkList
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function deleteWorkList(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/wbs-work-list`, {
    method: 'DELETE',
    query: params,
    body: params.data,
  });
}

/**
 * 工作清单交付物删除
 * @async
 * @function uploadAttachment
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function deleteFile(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/wbs-work-list/item`, {
    method: 'DELETE',
    query: params,
    body: params.data,
  });
}

/**
 * 获取基线列表
 * @async
 * @function fetchBaseLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function fetchBaseLine(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/base`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 保存基线
 * @async
 * @function saveBaseLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveBaseLine(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/base`, {
    method: 'POST',
    body: params.data,
  });
}

/**
 * 删除任务间关系
 * @async
 * @function deleteRels
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function deleteRels(params) {
  return request(`${HALM_PPM}/v1/${params.tenantId}/pro-wbs/rels`, {
    method: 'DELETE',
    query: params,
    body: params.data,
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
 *  @param {BigInteger} count - 第一个编号起始值
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderTreeData(collections = [], levelPath = {}, count = 0, tempTime) {
  const pathMap = levelPath;
  let tempCount = count;
  const limitTime = tempTime;
  let { minStartDate, maxEndDate } = limitTime;
  const treeList = collections.map(item => {
    const temp = item;
    // 排除固定行的日期
    if (!isNull(temp.startDate) && temp.wbsLineId !== 0) {
      if (moment(temp.startDate).isBefore(minStartDate)) {
        minStartDate = temp.startDate;
        limitTime.minStartDate = minStartDate;
      }
    }
    if (!isNull(temp.endDate) && temp.wbsLineId !== 0) {
      if (moment(temp.endDate).isAfter(maxEndDate)) {
        maxEndDate = temp.endDate;
        limitTime.maxEndDate = maxEndDate;
      }
    }
    pathMap[temp.wbsLineId] = [...(pathMap[temp.parentLineId] || []), temp.wbsLineId];
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap, 0, limitTime).treeList];
    }
    tempCount += 1;
    return { ...temp, _order: tempCount };
  });
  return {
    treeList,
    pathMap,
    limitTime,
  };
}
/**
 * 获取特定节点的_order
 * @deprecated
 * @param {array} collections - 页面展示数据
 * @param {array} levelPath - 层次编号
 * @returns {array} 更新后的页面展示数据
 */
export function setLevel(collections, levelPath = {}) {
  const levelMap = levelPath;
  // eslint-disable-next-line guard-for-in
  for (const i in collections) {
    const item = collections[i];
    levelMap[item.wbsLineId] = [...(levelMap[item.parentLineId] || []), item._order];
    if (item.children) {
      setLevel(item.children, levelMap);
    }
  }
  return levelMap;
}
