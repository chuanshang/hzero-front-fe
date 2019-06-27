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

    const promptCode = 'amtc.assessTemplet.model.assessTemplet';
    const columns = [
      {
        title: intl.get(`${promptCode}.templetName`).d('名称'),
        dataIndex: 'templetName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onEditLine(record.templetId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.templetNum`).d('模版编号'),
        dataIndex: 'templetNum',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.assessTimeName`).d('评价时点'),
        dataIndex: 'assessTimeName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.createdName`).d('创建人'),
        dataIndex: 'createdName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.creationDate`).d('创建日期'),
        dataIndex: 'creationDate',
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
              <a onClick={() => onDisabledLine(record.templetId)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEnabledLine(record.templetId)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="templetId"
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
