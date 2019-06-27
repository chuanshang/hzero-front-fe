/**
 * functionListService - 功能清单
 * @date: 2019-4-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_EIM } from '@/utils/config';

/**
 * queryFunctionList - 查询功能清单list
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryFunctionList(params) {
  const param = parseParameters(params);
  return request(`${HALM_EIM}/v1/${params.tenantId}/function-list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * saveAddData - 保存新增数据
 * @export
 * @param {*} params
 * @returns
 */
export async function saveData(params) {
  return request(`${HALM_EIM}/v1/${params.tenantId}/function-list`, {
    method: 'POST',
    body: params.data,
  });
}
