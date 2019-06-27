import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const promptCode = 'aatn.assetHandover.model.assetHandover';
    const columns = [
      {
        title: intl.get(`${promptCode}.handoverNum`).d('事务处理单编号'),
        dataIndex: 'handoverNum',
        width: 150,
        render: (val, record) => <a onClick={() => onEdit(record.handoverHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.titleOverview`).d('标题概述'),
        dataIndex: 'titleOverview',
      },
      {
        title: intl.get(`${promptCode}.transactionType`).d('事务类型'),
        dataIndex: 'transactionTypeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.processStatus`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.planStartDate`).d('执行日期'),
        dataIndex: 'planStartDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.planEndDate`).d('完成日期'),
        dataIndex: 'planEndDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.description`).d('理由'),
        dataIndex: 'description',
      },
    ];
    return (
      <Table
        bordered
        rowKey="handoverHeaderId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
