/*
 * 工作中心人员
 * @date: 2019/4/25
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { HALM_MTC } from '@/utils/config';

const prefix = `${HALM_MTC}/v1`;

export async function createOrUpdateStuff(params) {
  if (params.workcenterPeopleId) {
    return request(`${prefix}/${params.tenantId}/workcenter-staff`, {
      method: 'PUT',
      body: { ...params, enabledFlag: params.enabledFlag ? 1 : 0 },
    });
  } else {
    return request(`${prefix}/${params.tenantId}/workcenter-staff`, {
      method: 'POST',
      body: { ...params, enabledFlag: params.enabledFlag ? 1 : 0 },
    });
  }
}

export async function fetchStuffList(params) {
  return request(`${prefix}/${params.tenantId}/workcenter-staff`, {
    method: 'GET',
    query: params,
  });
}
