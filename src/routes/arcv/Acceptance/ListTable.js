import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const promptCode = 'arcv.acceptance.model.acceptance';
    const columns = [
      {
        title: intl.get(`${promptCode}.acceptanceNum`).d('验收单编号'),
        dataIndex: 'acceptanceNum',
        width: 120,
        render: (val, record) => <a onClick={() => onEdit(record.acceptanceHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.title`).d('标题概述'),
        dataIndex: 'title',
      },
      {
        title: intl.get(`${promptCode}.acceptanceTypeMeaning`).d('验收单类型'),
        dataIndex: 'acceptanceTypeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.acceptanceStatusMeaning`).d('验收状态'),
        dataIndex: 'acceptanceStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.principalPersonMeaning`).d('负责人'),
        dataIndex: 'principalPersonMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.submitDate`).d('提交日期'),
        dataIndex: 'submitDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.completeDate`).d('完成日期'),
        dataIndex: 'completeDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="acceptanceHeaderId"
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
