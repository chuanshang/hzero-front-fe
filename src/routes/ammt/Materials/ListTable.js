import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      handleStandardTableChange,
      onToggleMaterial,
      onEditMaterials,
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'itemName',
        align: 'left',
        width: 100,
        render: (value, record) => <a onClick={() => onEditMaterials(record.itemId)}>{value}</a>,
      },
      {
        title: '规格型号',
        dataIndex: 'model',
        align: 'left',
        width: 100,
      },
      {
        title: '品牌/厂商',
        dataIndex: 'brand',
        align: 'left',
        width: 100,
      },
      {
        title: '物料编号',
        dataIndex: 'itemNum',
        align: 'left',
        width: 100,
      },
      {
        title: '产品类别',
        dataIndex: 'itemCategoryId',
        align: 'left',
        width: 100,
      },
      {
        title: '产品类型',
        dataIndex: 'itemTypeCode',
        align: 'left',
        width: 100,
      },
      {
        title: '成本',
        dataIndex: 'cost',
        align: 'left',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'enabledFlag',
        align: 'left',
        width: 60,
        render: enableRender,
      },
      {
        title: '操作',
        align: 'left',
        width: 80,
        render: (value, record) => {
          const { enabledFlag } = record;
          return (
            <a style={{ color: 'rgb(7,122,255)' }} onClick={() => onToggleMaterial(record)}>
              {enabledFlag === 0 ? '启用' : '禁用'}
            </a>
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="itemId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => handleStandardTableChange(page)}
      />
    );
  }
}

export default ListTable;
