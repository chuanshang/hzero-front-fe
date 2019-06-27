import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateTimeRender } from 'utils/renderer';

class WOOPList extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onLinkToWOOPDetail,
      onDeleteWoop,
    } = this.props;
    const promptCode = 'amtc.workOrder.model.wo';
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
        render: (value, record) => <a onClick={() => onLinkToWOOPDetail(record.woopId)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.woopStatusMeaning`).d('状态'),
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
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 60,
        align: 'center',
        // fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => onDeleteWoop(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          </span>
        ),
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
        // rowSelection={{
        //   selectedRowKeys,
        //   onChange: onSelectRow,
        // }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default WOOPList;
