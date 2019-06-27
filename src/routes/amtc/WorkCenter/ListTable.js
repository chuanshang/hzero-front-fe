import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, onEditLine, pagination, onSearch } = this.props;

    const promptCode = 'amtc.workCenter.model.workCenter';
    const columns = [
      {
        title: intl.get(`${promptCode}.workcenterName`).d('工作中心名称'),
        dataIndex: 'workcenterName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onEditLine(record.workcenterId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.workcenterShortName`).d('代码/简称'),
        dataIndex: 'workcenterShortName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.workcenterNum`).d('工作中心编号'),
        dataIndex: 'workcenterNum',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.maintSitesName`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.status`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        align: 'left',
        render: enableRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="workcenterId"
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
