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
        title: intl.get(`${promptCode}.workcenterResName`).d('技能类型名称'),
        dataIndex: 'workcenterResName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onEditLine(record.workcenterResId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
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
        rowKey="workcenterResId"
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
