import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';

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
      onEditMaterialTsType,
    } = this.props;
    const columns = [
      {
        title: '事物处理批号',
        dataIndex: 'transbatchNum',
        align: 'left',
        width: 100,
        render: (value, record) => (
          <a onClick={() => onEditMaterialTsType(record.transbatchId)}>{value}</a>
        ),
      },
      {
        title: '处理时间',
        dataIndex: 'transDate',
        align: 'left',
        width: 100,
      },
      {
        title: '处理类型',
        dataIndex: 'transtypeId',
        align: 'left',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'transStatus',
        align: 'left',
        width: 100,
      },
      {
        title: '服务区域',
        dataIndex: 'maintSitesId',
        align: 'left',
        width: 100,
      },
      {
        title: '负责人',
        dataIndex: 'ownerId',
        align: 'left',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'description',
        align: 'left',
        width: 100,
      },
      {
        title: '工单',
        dataIndex: 'woId',
        align: 'left',
        width: 60,
      },
    ];
    return (
      <Table
        bordered
        rowKey="transbatchId"
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
