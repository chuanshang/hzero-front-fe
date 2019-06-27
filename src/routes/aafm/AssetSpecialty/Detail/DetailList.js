import React, { Component } from 'react';
import { Form, InputNumber } from 'hzero-ui';
import { sum, isNumber } from 'lodash';
import { enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

/**
 * 属性行展示列表
 * @extends {Component} - React.Component
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
  render() {
    const { loading, dataSource, onCleanLine, onEditLine, tenantId, editFlag } = this.props;
    const modelPrompt = `aafm.assetSpecialty.model.assetSpecialty`;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.maintSitesName`).d('维护区域'),
        dataIndex: 'maintSitesId',
        width: 150,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maintSitesId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.maintSitesName`).d('维护区域'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMDM.ASSET_MAINT_SITE"
                  queryParams={{ tenantId }}
                  textValue={record.maintSitesName}
                />
              )}
            </Form.Item>
          ) : (
            record.maintSitesName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.majorDepartmentName`).d('专业归口部门'),
        dataIndex: 'majorDepartmentId',
        width: 150,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('majorDepartmentId', {
                initialValue: val,
              })(
                <Lov
                  code="AMDM.ORGANIZATION"
                  queryParams={{ tenantId }}
                  textValue={record.majorDepartmentName}
                />
              )}
            </Form.Item>
          ) : (
            record.majorDepartmentName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.manageDepartmentName`).d('管理部门'),
        dataIndex: 'manageDepartmentId',
        width: 150,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('manageDepartmentId', {
                initialValue: val,
              })(
                <Lov
                  code="AMDM.ORGANIZATION"
                  queryParams={{ tenantId }}
                  textValue={record.manageDepartmentName}
                />
              )}
            </Form.Item>
          ) : (
            record.manageDepartmentName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.priority`).d('优先级'),
        dataIndex: 'priority',
        width: 150,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('priority', {
                initialValue: val,
              })(<InputNumber max={100} min={1} />)}
            </Form.Item>
          ) : (
            record.priority
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: record.enabledFlag,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            <span>{enableRender(val)}</span>
          ),
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 100,
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.status.cancel').d('取消')}
            </a>
          ) : (
            <a disabled={!editFlag} onClick={() => onEditLine(record, true)}>
              {intl.get('hzero.common.status.edit').d('编辑')}
            </a>
          ),
      },
    ];
    const scrollX = sum(columns.map(item => (isNumber(item.width) ? item.width : 0)));

    return (
      <EditTable
        bordered
        rowKey="assetOrgId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: scrollX }}
      />
    );
  }
}
export default DetailList;
