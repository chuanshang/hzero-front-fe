import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, onEdit, pagination, onSearch } = this.props;

    const promptCode = 'amtc.act.model.act';
    const columns = [
      {
        title: intl.get(`${promptCode}.actName`).d('标准作业名称'),
        dataIndex: 'actName',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record.actId)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.woType`).d('工单类型'),
        dataIndex: 'woTypeName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.woPriority`).d('工单优先级'),
        dataIndex: 'woPriorityName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.maintSites`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.actType`).d('标准作业类型'),
        dataIndex: 'actTypeCodeMeaning',
        width: 100,
        align: 'left',
        render: enableRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="actId"
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
