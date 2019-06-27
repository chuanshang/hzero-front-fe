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

    const promptCode = 'amtc.assetRoute.model.assetRoute';
    const columns = [
      {
        title: intl.get(`${promptCode}.assetRouteName`).d('资产路线名称'),
        dataIndex: 'assetRouteName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onEditLine(record.assetRouteId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.maintSites`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.routeMode`).d('引用模式'),
        dataIndex: 'routeModeName',
        width: 150,
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
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'left',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onDisabledLine(record.assetRouteId)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEnabledLine(record.assetRouteId)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="assetRouteId"
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
