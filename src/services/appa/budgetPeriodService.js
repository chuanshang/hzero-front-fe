/**
 * service - 预算控制期间
 * @date: 2019/03/06 19:48:32
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { parseParameters } from 'utils/utils';
import { HALM_PPM } from '@/utils/config';

const prefix = `${HALM_PPM}/v1`;

/**
 * 查询
 * @export
 * @param {object} params
 * @param {object} params.page 查询分页
 * @returns
 */
export async function fetchList(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${param.tenantId}/budget-period`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存
 * @export
 * @param {object} params
 * @returns
 */
export async function saveList(params) {
  const { newData, tenantId } = params;
  return request(`${prefix}/${tenantId}/budget-period`, {
    method: 'POST',
    body: newData,
  });
}
