import React, { Component } from 'react';
import { Form, InputNumber, Input } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
/**
 * 资产路线行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
  render() {
    const {
      tenantId,
      loading,
      dataSource,
      pagination,
      onEditLine,
      onDeleteLine,
      onCancelLine,
    } = this.props;
    const promptCode = `amtc.assetRoute.model.assetRoute`;
    const columns = [
      {
        title: intl.get(`${promptCode}.flownoSeq`).d('序号'),
        dataIndex: 'flownoSeq',
        width: 50,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('flownoSeq', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.columnName`).d('序号'),
                    }),
                  },
                ],
              })(<InputNumber style={{ width: 60 }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.assetName`).d('设备/资产'),
        dataIndex: 'assetName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetId', {
                initialValue: val,
                rules: [],
              })(<Lov code="AAFM.ASSETS" textValue={val} queryParams={{ tenantId }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.assetLocationName`).d('位置'),
        dataIndex: 'assetLocationName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetLocationId', {
                initialValue: val,
                rules: [],
              })(<Lov code="AMDM.LOCATIONS" textValue={val} queryParams={{ tenantId }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.ownerGroupName`).d('负责人组'),
        dataIndex: 'ownerGroupName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('ownerGroupId', {
                initialValue: val,
                rules: [],
              })(<Lov code="AMTC.SKILLTYPES" textValue={val} queryParams={{ tenantId }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.ownerName`).d('负责人'),
        dataIndex: 'ownerName',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('ownerId', {
                initialValue: val,
                rules: [],
              })(
                <Lov code="AMTC.WORKCENTER_PRINCIPAL" textValue={val} queryParams={{ tenantId }} />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
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
        rowKey="routeAssignmentId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default DetailList;
