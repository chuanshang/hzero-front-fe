import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import intl from 'utils/intl';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';

/**
 * 资产状态数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, onEdit, sysStatus } = this.props;
    const prefix = 'aafm.assetStatus.model.assetStatus';
    const columns = [
      {
        title: intl.get(`${prefix}.name`).d('系统状态名称'),
        dataIndex: 'sysStatusName',
        width: 120,
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
        title: intl.get(`${prefix}.status`).d('用户自定义名称'),
        dataIndex: 'userStatusName',
        width: 140,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('userStatusName', {
                initialValue: value,
                rules: [
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
                    <Select.Option key={i.value} disabled={i.value === record.assetStatusId}>
                      {i.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            <Select disabled mode="multiple" style={{ width: '100%' }} defaultValue={val}>
              {sysStatus.map(i => (
                <Select.Option key={i.value}>{i.meaning}</Select.Option>
              ))}
            </Select>
          ),
      },
      {
        title: intl.get(`${prefix}.initialStatusFlag`).d('新增时可用'),
        dataIndex: 'initialStatusFlag',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('initialStatusFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.maintainFlag`).d('可维护'),
        dataIndex: 'maintainFlag',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maintainFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.transactionFlag`).d('可事务处理'),
        dataIndex: 'transactionFlag',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('transactionFlag', {
                initialValue: val,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`aafm.assetStatus.view.message.detailControl`).d('设备/资产编辑详细控制'),
        children: [
          {
            title: intl.get(`${prefix}.editBasicFlag`).d('基本信息'),
            dataIndex: 'editBasicFlag',
            width: 90,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('editBasicFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
          {
            title: intl.get(`${prefix}.editSourceFlag`).d('来源信息'),
            dataIndex: 'editSourceFlag',
            width: 90,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('editSourceFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
          {
            title: intl.get(`${prefix}.editManageFlag`).d('管理信息'),
            dataIndex: 'editManageFlag',
            width: 90,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('editManageFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
          {
            title: intl.get(`${prefix}.editAttributeFlag`).d('属性信息'),
            dataIndex: 'editAttributeFlag',
            width: 90,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('editAttributeFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
          {
            title: intl.get(`${prefix}.editWarrantyFlag`).d('质保信息'),
            dataIndex: 'editWarrantyFlag',
            width: 90,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('editWarrantyFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
        ],
      },
      {
        title: intl.get(`aafm.assetStatus.view.message.maintainControl`).d('触发预防性维护控制'),
        children: [
          {
            title: intl.get(`${prefix}.pmStartTriggerFlag`).d('开启'),
            dataIndex: 'pmStartTriggerFlag',
            width: 80,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('pmStartTriggerFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
          {
            title: intl.get(`${prefix}.pmStopTriggerFlag`).d('停止'),
            dataIndex: 'pmStopTriggerFlag',
            width: 80,
            render: (val, record) =>
              ['create', 'update'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator('pmStopTriggerFlag', {
                    initialValue: val,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item>
              ) : (
                yesOrNoRender(val)
              ),
          },
        ],
      },
      {
        title: intl.get('hzero.common.enabledFlag').d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 90,
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
        width: 80,
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
        rowKey="assetStatusId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ListTable;
