import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  render() {
    const {
      loading,
      dataSource,
      onEditLine,
      pagination,
      onSearch,
      onDisabledLine,
      onEnabledLine,
    } = this.props;

    const promptCode = 'amtc.faultDefect.model.faultDefect';
    const columns = [
      {
        title: intl.get(`${promptCode}.rcAssesmentName`).d('名称'),
        dataIndex: 'rcAssesmentName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onEditLine(record.rcAssesmentId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.rcSystemName`).d('评价体系'),
        dataIndex: 'rcSystemName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.categroyCode`).d('评估类别'),
        dataIndex: 'categroyCode',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.description`).d('详细说明'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.status`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        align: 'left',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'left',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onDisabledLine(record.rcAssesmentId)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEnabledLine(record.rcAssesmentId)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="rcAssesmentId"
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
