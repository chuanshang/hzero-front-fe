/**
 * 资产目录数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
import React, { PureComponent } from 'react';
import { Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

class CodesDetailList extends PureComponent {
  render() {
    const {
      rcSystemId,
      tenantId,
      loading,
      dataSource,
      expandedRowKeys,
      onEditLine,
      onAddLine,
      onExpand,
      onCancelLine,
      onDeleteLine,
    } = this.props;
    const promptCode = 'afam.rcAssesment.model.rcAssesment';
    const columns = [
      {
        title: intl.get(`${promptCode}.asmtCodesName`).d('值名称'),
        dataIndex: 'asmtCodesName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('asmtCodesName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.asmtCodesName`).d('值名称'),
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
        title: intl.get(`${promptCode}.hierarchies`).d('值类型'),
        dataIndex: 'hierarchiesName',
        width: 150,
        render: (value, record) => {
          return ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('sysHierarchyId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.hierarchies`).d('值类型'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMTC.EVALUATION_HIERARCHIES"
                  queryParams={{ tenantId, faultdefectId: rcSystemId }}
                  textValue={value}
                />
              )}
            </Form.Item>
          ) : (
            value
          );
        },
      },
      {
        title: intl.get(`${promptCode}.faultCode`).d('故障代码'),
        dataIndex: 'faultCode',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('faultCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.faultCode`).d('故障代码'),
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
        title: intl.get(`${promptCode}.parentCodevalueName`).d('父级代码'),
        dataIndex: 'parentCodevalueName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('parentCodevalueName', {
                initialValue: val,
                rules: [],
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : record.enabledFlag && record.hierarchiesCount > record.levelNumber + 1 ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
            </span>
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
        expandedRowKeys={expandedRowKeys}
        rowKey="asmtCodesId"
        loading={loading}
        onExpand={onExpand}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default CodesDetailList;
