/**
 * service - WBS结构模板
 * @date: 2019-3-11
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { isNull } from 'lodash';
import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 获取项目模板明细
 * @async
 * @function searchProjectTemplate
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTemplateId - 项目模板Id
 * @returns {object} fetch Promise
 */
export async function searchProjectTemplate(params) {
  return request(`${prefix}/${params.tenantId}/project-templates/${params.proTemplateId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取WBS结构模板
 * @async
 * @function searchTaskTemplate
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTemplateId - 项目模板Id
 * @returns {object} fetch Promise
 */
export async function searchTaskTemplate(params) {
  return request(
    `${prefix}/${params.tenantId}/task-templates/pro-template/${params.proTemplateId}`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 获取WBS任务明细
 * @async
 * @function searchTaskDetail
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTaskId - 任务Id
 * @returns {object} fetch Promise
 */
export async function searchTaskDetail(params) {
  return request(`${prefix}/${params.tenantId}/task-templates/${params.proTaskId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 保存WBS任务
 * @async
 * @function saveTaskLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveTaskLine(params) {
  return request(`${prefix}/${params.tenantId}/task-templates`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 批量保存WBS任务
 * @async
 * @function saveTaskLine
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function saveTaskLines(params) {
  return request(`${prefix}/${params.tenantId}/task-templates/batch`, {
    method: 'POST',
    body: params.data,
  });
}
/**
 * 删除WBS任务行
 * @async
 * @function deleteTask
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTaskId - 任务Id
 * @returns {object} fetch Promise
 */
export async function deleteTask(params) {
  return request(`${prefix}/${params.tenantId}/task-templates/${params.proTaskId}`, {
    method: 'DELETE',
    body: params.data,
  });
}
/**
 * 获取WBS任务关联关系
 * @async
 * @function searchTaskRelation
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTaskId - 任务Id
 * @returns {object} fetch Promise
 */
export async function searchTaskRelation(params) {
  return request(`${prefix}/${params.tenantId}/task-templates/${params.proTaskId}/task-relation`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 移除WBS任务关联关系
 * @async
 * @function deleteTaskRelation
 * @param {!string} params.tenantId - 租户Id
 * @param {!string} params.proTaskId - 任务Id
 * @returns {object} fetch Promise
 */
export async function deleteTaskRelation(params) {
  return request(`${prefix}/${params.tenantId}/task-templates/${params.proTaskId}/task-relation`, {
    method: 'DELETE',
    body: params.data,
  });
}

/**
 *  获取项目角色
 * @async
 * @function searchProjectRole
 * @param {!string} params.tenantId - 租户Id
 * @returns {object} fetch Promise
 */
export async function searchProjectRole(params) {
  return request(`${prefix}/${params.tenantId}/project-role`, {
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
  return request(
    `${prefix}/${params.tenantId}/task-templates/pro-template/${
      params.proTemplateId
    }/listRelTaskTemplates/${params.proTaskId}`,
    {
      method: 'GET',
      query: params,
    }
  );
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
  return request(`${prefix}/${param.tenantId}/task-work-lists/${param.taskNum}`, {
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
  return request(`${prefix}/${params.tenantId}/task-work-lists/${params.taskNum}`, {
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
  return request(`${prefix}/${params.tenantId}/task-work-lists`, {
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
  return request(`${prefix}/${params.tenantId}/task-work-lists/item`, {
    method: 'DELETE',
    query: params,
    body: params.data,
  });
}

/**
 * 处理接口获取的数据，提取每个节点的层次路径
 * @param {array} collections - 页面展示数据
 * @param {array} levelPath - 特定组织的层级路径
 *  @param {BigInteger} count - 第一个编号起始值
 * @returns {object} 节点树和层次路径组成的对象
 */
export function renderTreeData(collections = [], levelPath = {}, count = 0) {
  const pathMap = levelPath;
  let tempCount = count;
  const treeList = collections.map(item => {
    const temp = item;
    pathMap[temp.proTaskId] = [...(pathMap[temp.parentTaskId] || []), temp.proTaskId];
    if (temp.children) {
      temp.children = [...renderTreeData(temp.children || [], pathMap, 0).treeList];
    }
    tempCount += 1;
    return {
      ...temp,
      _order: tempCount,
      otherRoles: isNull(temp.otherRoles) ? [] : temp.otherRoles.split(','),
    };
  });
  return {
    treeList,
    pathMap,
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
    levelMap[item.proTaskId] = [...(levelMap[item.parentTaskId] || []), item._order];
    if (item.children) {
      setLevel(item.children, levelMap);
    }
  }
  return levelMap;
}
