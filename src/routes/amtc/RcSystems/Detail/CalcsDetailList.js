import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 评估计算项展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class CalcsDetailList extends PureComponent {
  render() {
    const {
      loading,
      faultdefectCalcFormulaMap,
      dataSource,
      pagination,
      onCancelLine,
      onEditLine,
      onDeleteLine,
    } = this.props;
    const promptCode = `amtc.workCenter.model.workCenter`;
    const columns = [
      {
        title: intl.get(`${promptCode}.longName`).d('名称'),
        dataIndex: 'longName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('longName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.longName`).d('名称'),
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
        title: intl.get(`${promptCode}.shortName`).d('简称/短码'),
        dataIndex: 'shortName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('shortName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.shortName`).d('简称/短码'),
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
        title: intl.get(`${promptCode}.internalCode`).d('内部短码'),
        dataIndex: 'internalCode',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('internalCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.internalCode`).d('内部短码'),
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
        title: intl.get(`${promptCode}.fomular`).d('计算公式'),
        dataIndex: 'fomular',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fomular', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.fomular`).d('计算公式'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {faultdefectCalcFormulaMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            faultdefectCalcFormulaMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
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
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="sysCalcId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default CalcsDetailList;
