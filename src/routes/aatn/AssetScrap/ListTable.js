import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const promptCode = 'aatn.assetScrap.model.assetScrap';
    const columns = [
      {
        title: intl.get(`${promptCode}.scrapNum`).d('资产报废单编号'),
        dataIndex: 'scrapNum',
        width: 120,
        render: (val, record) => <a onClick={() => onEdit(record.scrapHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.titleOverview`).d('标题概述'),
        dataIndex: 'titleOverview',
        render: (val, record) => <a onClick={() => onEdit(record.scrapHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.transactionType`).d('事务类型'),
        dataIndex: 'transactionTypeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.processStatusMeaning`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
        width: 100,
        align: 'center',
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
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.planEndDate`).d('完成日期'),
        dataIndex: 'planEndDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.description`).d('理由'),
        dataIndex: 'description',
      },
      {
        title: intl.get(`${promptCode}.owningMajorCode`).d('操作'),
        dataIndex: 'owningMajorCode',
        width: 80,
        render: (val, record) => (
          <a onClick={() => onEdit(record.scrapHeaderId)}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </a>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="scrapHeaderId"
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
