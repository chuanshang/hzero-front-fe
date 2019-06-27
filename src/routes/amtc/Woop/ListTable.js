import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateTimeRender } from 'utils/renderer';

class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { loading, dataSource, onLinkToDetail, pagination, onSearch } = this.props;
    const promptCode = 'amtc.woop.model.woop';
    const columns = [
      {
        title: intl.get(`${promptCode}.woopNum`).d('编号'),
        dataIndex: 'woopNum',
        align: 'left',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.woopShortName`).d('工单任务名称 '),
        dataIndex: 'woopShortName',
        align: 'left',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.woopId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.woopStatus`).d('状态'),
        dataIndex: 'woopStatusMeaning',
        align: 'left',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.schedualedStartDate`).d('计划开始时间'),
        dataIndex: 'schedualedStartDate',
        align: 'left',
        width: 150,
        render: dateTimeRender,
      },
      {
        title: intl.get(`${promptCode}.durationSchedualed`).d('计划时长'),
        dataIndex: 'durationSchedualed',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.ownerGroupName`).d('负责人组'),
        dataIndex: 'ownerGroupName',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.ownerName`).d('负责人'),
        dataIndex: 'ownerName',
        align: 'left',
        width: 120,
      },
    ];
    return (
      <Table
        bordered
        rowKey="woopId"
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
