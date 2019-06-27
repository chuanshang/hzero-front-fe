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
      onToggleMaterialTsType,
      onEditMaterialTsType,
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'productName',
        align: 'left',
        width: 100,
        render: (value, record) => (
          <a onClick={() => onEditMaterialTsType(record.transtypeId)}>{value}</a>
        ),
      },
      {
        title: '规格型号',
        dataIndex: 'productModel',
        align: 'left',
        width: 100,
      },
      {
        title: '品牌/厂商',
        dataIndex: 'productBrand',
        align: 'left',
        width: 100,
      },
      {
        title: '部件编号',
        dataIndex: 'partNumber',
        align: 'left',
        width: 100,
      },
      {
        title: '产品类别',
        dataIndex: 'productCategoryId',
        align: 'left',
        width: 100,
      },
      {
        title: '产品类型',
        dataIndex: 'productTypeCode',
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
            <a style={{ color: 'rgb(7,122,255)' }} onClick={() => onToggleMaterialTsType(record)}>
              {enabledFlag === 0 ? '启用' : '禁用'}
            </a>
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="transtypeId"
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
