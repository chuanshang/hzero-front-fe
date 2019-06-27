/**
 * projectTemplateService - 项目模版
 * @date: 2019-4-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import { parseParameters } from 'utils/utils';
import { HALM_EIM } from '@/utils/config';
import request from 'utils/request';

/**
 * queryProjectTemplateList - 项目模版列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryProjectTemplateList(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryTaskTemplateList - 项目任务模版列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryTaskTemplateList(params) {
  const param = parseParameters(params);
  return request(
    `${HALM_EIM}/v1/${params.tenantId}/project-template/task-template/${param.proTemplateId}`,
    {
      method: 'GET',
      query: param,
    }
  );
}

/**
 * queryRelsList - 任务管理列表查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryRelsList(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/${param.proTaskId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryProjectTemplateDetail - 项目模版详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryProjectTemplateDetail(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/${param.proTemplateId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * queryRelsDetail - 项目任务模版详情查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryTaskTemplateDetail(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/rels/${param.proTaskId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * deleteProjectTemplate - 项目模版删除
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteProjectTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template`, {
    method: 'DELETE',
    body: param,
  });
}

/**
 * deleteTaskTemplate - 项目模版删除
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteTaskTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/task-template`, {
    method: 'DELETE',
    body: param,
  });
}

/**
 * deleteTaskTemplate - 项目任务模版删除
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteRels(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/rels`, {
    method: 'DELETE',
    body: param,
  });
}

/**
 * saveProjectTemplate - 项目模版保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveAddProjectTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template`, {
    method: 'POST',
    body: param,
  });
}

/**
 * saveProjectTemplate - 项目模版保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveEditProjectTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template`, {
    method: 'PUT',
    body: param,
  });
}

/**
 * saveTaskTemplate - 项目模版保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveAddTaskTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/task-template`, {
    method: 'POST',
    body: param,
  });
}

/**
 * saveTaskTemplate - 项目模版保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveEditTaskTemplate(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/project-template/task-template`, {
    method: 'PUT',
    body: param,
  });
}
