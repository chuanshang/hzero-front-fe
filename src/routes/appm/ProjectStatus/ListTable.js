import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import intl from 'utils/intl';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';

/**
 * 项目状态数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, onEdit, sysStatus } = this.props;
    const prefix = 'appm.projectStatus.model.projectStatus';
    const columns = [
      {
        title: intl.get(`${prefix}.sysStatusName`).d('系统状态名称'),
        dataIndex: 'sysStatusName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('sysStatusName', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.userStatusName`).d('用户自定义名称'),
        dataIndex: 'userStatusName',
        align: 'center',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('userStatusName', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.nextStatus`).d('后续状态'),
        dataIndex: 'nextStatus',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('nextStatus', {
                initialValue: val,
              })(
                <Select mode="multiple" style={{ width: '100%' }}>
                  {sysStatus.map(i => (
                    <Select.Option
                      key={i.proStatusId}
                      disabled={i.proStatusId === record.proStatusId}
                    >
                      {i.status}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            <Select disabled mode="multiple" style={{ width: '100%' }} defaultValue={val}>
              {sysStatus.map(i => (
                <Select.Option key={i.proStatusId}>{i.status}</Select.Option>
              ))}
            </Select>
          ),
      },
      {
        title: intl.get(`${prefix}.processFlag`).d('允许发生进度'),
        dataIndex: 'processFlag',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('processFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.orderFlag`).d('允许下单'),
        dataIndex: 'orderFlag',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('orderFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.costFlag`).d('允许发生费用'),
        dataIndex: 'costFlag',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('costFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.changeFlag`).d('允许发起变更'),
        dataIndex: 'changeFlag',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('changeFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        align: 'center',
        width: 100,
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
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'update' ? (
            <a onClick={() => onEdit(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => onEdit(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="proStatusId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}

export default ListTable;
