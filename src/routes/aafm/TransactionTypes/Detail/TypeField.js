import React, { Component } from 'react';
import { Button, Form, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';

class TypeFieldList extends Component {
  render() {
    const { dataSource = [], onDeleteColumnLine, fieldTypeMap, tenantId, columnClass } = this.props;
    const modelPrompt = `aafm.transactionTypes.model.transactionTypes`;
    const columns = [
      {
        title: intl.get(`hzero.common.button.clean`).d('删除'),
        dataIndex: '1',
        width: 40,
        render: (val, record) => (
          <Button
            style={{ margin: '0px 2px 2px 10px' }}
            icon="minus"
            type="Normal"
            onClick={() => onDeleteColumnLine(record)}
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.fieldColumn`).d('字段'),
        dataIndex: 'fieldColumn',
        width: 130,
        align: 'center',
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('fieldColumn', {
              initialValue: record.fieldColumn,
            })(
              <Lov
                code="AAFM.DYNAMIC_COLUMN"
                textValue={record.fieldColumnMeaning}
                queryParams={{ tenantId, columnClass }}
              />
            )}
          </Form.Item>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.fieldType`).d('类型'),
        dataIndex: 'fieldType',
        width: 130,
        align: 'center',
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('fieldType', {
              initialValue: record.fieldType,
            })(
              <Select>
                {fieldTypeMap.map(i => (
                  <Select.Option key={i.value}>{i.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ),
      },
    ];

    return (
      <EditTable
        bordered
        showHeader={false}
        rowKey="fieldId"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default TypeFieldList;
