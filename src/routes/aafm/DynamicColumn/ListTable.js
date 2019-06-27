import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

class ListTable extends PureComponent {
  render() {
    const {
      tenantId,
      loading,
      dataSource,
      descSourceTypeMap,
      columnClassMap,
      lovTypeMap,
      pagination,
      onCancelLine,
      onEditLine,
      onDeleteLine,
    } = this.props;
    const prefix = 'aafm.dynamicColumn.model.dynamicColumn';
    const tableSchema = 'halm_atn';
    const tableName = 'aafm_asset';
    const columns = [
      {
        title: intl.get(`${prefix}.columnCode`).d('字段'),
        dataIndex: 'columnCode',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('columnCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.columnCode`).d('字段'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.DYNAMIC_COLUMN.COLUMNS"
                  textValue={val}
                  queryParams={{ tableSchema, tableName }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.columnName`).d('字段名称'),
        dataIndex: 'columnName',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('columnName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.columnName`).d('字段名称'),
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
        title: intl.get(`${prefix}.columnClass`).d('分类'),
        dataIndex: 'columnClass',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('columnClass', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskNumber`).d('分类'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {columnClassMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            columnClassMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
          ),
      },
      {
        title: intl.get(`${prefix}.descCode`).d('描述名称'),
        dataIndex: 'descCode',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('descCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.descCode`).d('描述名称'),
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
        title: intl.get(`${prefix}.descSourceType`).d('描述来源类型'),
        dataIndex: 'descSourceType',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('descSourceType', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.descSourceType`).d('描述来源类型'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {descSourceTypeMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            descSourceTypeMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
          ),
      },
      {
        title: intl.get(`${prefix}.descSource`).d('描述来源'),
        dataIndex: 'descSource',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('descSource', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.descSource`).d('描述来源'),
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
        title: intl.get(`${prefix}.lovName`).d('值集'),
        dataIndex: 'lovName',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('lovName', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.lovName`).d('值集'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.DYNAMIC_COLUMN.HPFM_LOV"
                  textValue={val}
                  queryParams={{ organizationId: tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.lovType`).d('取值类型'),
        dataIndex: 'lovType',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('lovType', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.lovType`).d('取值类型'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {lovTypeMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            lovTypeMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
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
        rowKey="columnId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}

export default ListTable;
