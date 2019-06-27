import React, { PureComponent } from 'react';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { Form, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators/index';

class ListTable extends PureComponent {
  @Bind()
  handlePagination(pagination) {
    const { onChange = e => e, detailId } = this.props;
    onChange({ page: pagination, transbatchId: detailId });
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
      detailId,
      innerpagination,
      deleteinnerrowloading,
      isEditable,
    } = this.props;
    const columns = [
      {
        title: '行号',
        dataIndex: 'rownum',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('rownum', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '批次号',
                    }),
                  },
                ],
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '库存物料',
        dataIndex: 'itemId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemId', {
                initialValue: isUndefined(detailId) ? '' : val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '库存物料',
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMMT.INVENTORY_ITEMS"
                  extSetMap="itemNum,model,brand,uomName"
                  textValue={isUndefined(detailId) ? '' : record.itemName}
                />
              )}
            </Form.Item>
          ) : (
            record.itemName
          ),
      },
      {
        title: '物料编号',
        dataIndex: 'itemNum',
        align: 'left',
        width: 100,
        render: (value, record) =>
          isUndefined(record.$form)
            ? value
            : isUndefined(record.$form.getFieldValue('itemNum'))
            ? value
            : record.$form.getFieldValue('itemNum'),
      },
      {
        title: '规格型号',
        dataIndex: 'model',
        align: 'left',
        width: 100,
        render: (value, record) =>
          isUndefined(record.$form)
            ? value
            : isUndefined(record.$form.getFieldValue('model'))
            ? value
            : record.$form.getFieldValue('model'),
      },
      {
        title: '品牌/厂商',
        dataIndex: 'brand',
        align: 'left',
        width: 120,
        render: (value, record) =>
          isUndefined(record.$form)
            ? value
            : isUndefined(record.$form.getFieldValue('brand'))
            ? value
            : record.$form.getFieldValue('brand'),
      },
      {
        title: '来源维护区域',
        dataIndex: 'fromMaintsitesId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fromMaintsitesId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '来源维护区域',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '目标维护区域',
        dataIndex: 'toMaintsitesId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('toMaintsitesId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标维护区域',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '主要单位',
        dataIndex: 'uomName',
        align: 'left',
        width: 100,
        render: (value, record) =>
          isUndefined(record.$form)
            ? value
            : isUndefined(record.$form.getFieldValue('uomName'))
            ? value
            : record.$form.getFieldValue('uomName'),
      },
      {
        title: '处理数量',
        dataIndex: 'primaryQty',
        align: 'left',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('primaryQty', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '处理数量',
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
        title: '批次号',
        dataIndex: 'lotNum',
        align: 'left',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('lotNum', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '批次号',
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
        title: '来源位置',
        dataIndex: 'fromLocationId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fromLocationId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '来源位置',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '来源货位',
        dataIndex: 'fromLocatorId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fromLocatorId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '来源货位',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '目标位置',
        dataIndex: 'toLocationId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('toLocationId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标位置',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '目标货位',
        dataIndex: 'toLocatorId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('toLocatorId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标货位',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '工单工序',
        dataIndex: 'woopId',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('woopId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工单工序',
                    }),
                  },
                ],
              })(<Lov code="AAFM.ASSET_CLASS" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '描述',
        dataIndex: 'description',
        align: 'left',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '操作',
        width: 150,
        align: 'left',
        fixed: 'right',
        render: (val, record) =>
          isEditable || isUndefined(detailId) ? (
            record._status === 'create' ? (
              <a onClick={() => onCancelLine(record)}>清除</a>
            ) : record._status === 'update' ? (
              <a onClick={() => onEditLine(record, false)}>取消</a>
            ) : (
              <span className="action-link">
                <a onClick={() => onEditLine(record, true)}>编辑</a>
                <a onClick={() => onDeleteLine(record)}>删除</a>
              </span>
            )
          ) : (
            ''
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="translineId"
        loading={loading || deleteinnerrowloading}
        columns={columns}
        dataSource={dataSource}
        pagination={{ ...innerpagination }}
        onChange={this.handlePagination}
        scroll={{ x: '186%', y: 300 }}
      />
    );
  }
}

export default ListTable;
