import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 评估项关联对象
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ObjectsDetailList extends PureComponent {
  render() {
    const {
      tenantId,
      loading,
      objectTypeCodeMap,
      dataSource,
      pagination,
      onCancelLine,
      onEditLine,
      onDeleteLine,
    } = this.props;
    const promptCode = `amtc.rcAssesment.model.rcAssesment`;
    const columns = [
      {
        title: intl.get(`${promptCode}.parentTypeCode`).d('对象类型'),
        dataIndex: 'parentTypeCode',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('parentTypeCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.parentTypeCode`).d('对象类型'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {objectTypeCodeMap.map(n => (
                    <Select.Option key={n.value}>{n.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            objectTypeCodeMap
              .filter(item => item.value === val)
              .map(item => {
                return item.meaning;
              })
          ),
      },
      {
        title: intl.get(`${promptCode}.parentId`).d('对象'),
        dataIndex: 'objectTypeName',
        width: 100,
        align: 'left',
        render: (val, record) => {
          if (['create', 'update'].includes(record._status)) {
            return (
              <Form.Item>
                {record.$form.getFieldDecorator('parentId', {
                  initialValue: val,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.parentId`).d('对象'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code={
                      record.$form.getFieldValue('parentTypeCode') === 'AOS_Assets'
                        ? 'AAFM.ASSET_SET'
                        : record.$form.getFieldValue('parentTypeCode') === 'HAT_Assets'
                        ? 'AAFM.ASSETS'
                        : 'AMDM.LOCATIONS'
                    }
                    textValue={val}
                    queryParams={{ organizationId: tenantId }}
                  />
                )}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
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
        rowKey="asmtObjectsId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default ObjectsDetailList;
