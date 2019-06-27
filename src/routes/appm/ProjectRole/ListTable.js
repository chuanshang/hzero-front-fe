import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';

/**
 * 项目角色列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Function} onSetPermission - 权限维护
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      projectRoleType,
      onCancelLine,
      onEditLine,
      onSetPermission,
    } = this.props;
    const prefix = 'appm.projectRole.model.projectRole';
    const columns = [
      {
        title: intl.get(`${prefix}.roleCode`).d('角色简称'),
        dataIndex: 'roleCode',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('roleCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.roleCode`).d('角色简称'),
                    }),
                  },
                  {
                    max: 30,
                    message: intl.get('hzero.common.validation.max', {
                      max: 30,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.roleName`).d('角色全称'),
        dataIndex: 'roleName',
        width: 300,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('roleName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.roleName`).d('角色全称'),
                    }),
                  },
                  {
                    max: 60,
                    message: intl.get('hzero.common.validation.max', {
                      max: 60,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.roleType`).d('角色类型'),
        dataIndex: 'roleType',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('roleType', {
                initialValue: value,
              })(
                <Select style={{ width: '100%' }}>
                  {projectRoleType.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.roleTypeMeaning
          ),
      },
      {
        title: intl.get(`${prefix}.description`).d('角色说明'),
        dataIndex: 'description',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        align: 'center',
        width: 80,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: value,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            enableRender(value)
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => onSetPermission(record)}>
                {intl.get(`appm.proRole.view.option.permission.setting`).d('设置权限')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onSetPermission(record)}>
                {intl.get(`appm.proRole.view.option.permission.setting`).d('设置权限')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="proRoleId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}

export default ListTable;
