import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
/**
 * 评估计算项展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ListTable extends PureComponent {
  render() {
    const { functionModuleMap, loading, dataSource, pagination, onEdit, onCancel } = this.props;
    const promptCode = `amtc.workCenter.model.workCenter`;
    const columns = [
      {
        title: intl.get(`${promptCode}.functionName`).d('功能名称'),
        dataIndex: 'functionName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('functionName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.functionName`).d('功能名称'),
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
        title: intl.get(`${promptCode}.functionNum`).d('功能代码'),
        dataIndex: 'functionNum',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('functionNum', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.functionNum`).d('简称/短码'),
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
        title: intl.get(`${promptCode}.functionModuleCode`).d('功能模块'),
        dataIndex: 'functionModuleCode',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('functionModuleCode', {
                initialValue: val,
              })(
                <Select style={{ width: '100%' }}>
                  {functionModuleMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            functionModuleMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
          ),
      },
      {
        title: intl.get(`${promptCode}.enabledFlag`).d('功能状态'),
        dataIndex: 'enabledFlag',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: isUndefined(val) ? 1 : 0,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            enableRender(val)
          ),
      },
      {
        title: intl.get(`${promptCode}.description`).d('详细说明'),
        dataIndex: 'description',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: val,
                rules: [],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancel(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEdit(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <span className="action-link">
              <a onClick={() => onEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="functionId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default ListTable;
