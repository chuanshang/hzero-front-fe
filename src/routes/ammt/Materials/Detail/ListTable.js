import React, { PureComponent } from 'react';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { Form, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators/index';

class ListTable extends PureComponent {
  @Bind()
  handlePagination(pagination) {
    const { onChange = e => e, detailId } = this.props;
    onChange({ page: pagination, itemId: detailId });
  }
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      onCancelLine,
      onEditLine,
      onDeleteLine,
      innerpagination,
    } = this.props;
    const columns = [
      {
        title: '服务区域',
        dataIndex: 'maintSitesId',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maintSitesId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '服务区域',
                    }),
                  },
                ],
              })(<Lov code="AMDM.ASSET_MAINT_SITE" textValue={record.maintSitesName} />)}
            </Form.Item>
          ) : (
            record.maintSitesName
          ),
      },
      {
        title: '最小库存量',
        dataIndex: 'minQty',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('minQty', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '最小库存量',
                    }),
                  },
                ],
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '最大库存量',
        dataIndex: 'maxQty',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maxQty', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '最大库存量',
                    }),
                  },
                ],
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '采购提前期',
        dataIndex: 'leadtimeDay',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('leadtimeDay', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '采购提前期',
                    }),
                  },
                ],
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '操作',
        width: 100,
        align: 'left',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>清除</a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>取消</a>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>编辑</a>
              <a onClick={() => onDeleteLine(record)}>删除</a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="itemMaintsitesId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={innerpagination}
        onChange={this.handlePagination}
      />
    );
  }
}

export default ListTable;
