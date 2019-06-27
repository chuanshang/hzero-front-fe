import React, { Component } from 'react';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import { Table } from 'hzero-ui';

class AddressList extends Component {
  render() {
    const { loading, dataSource, onEditLine, onCleanLine } = this.props;
    const modelPrompt = `amdm.organization.model.organization`;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.maintSitesName`).d('服务区域'),
        dataIndex: 'maintSitesName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.locationName`).d('位置名称'),
        dataIndex: 'locationName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.country`).d('国家'),
        dataIndex: 'countryName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.region`).d('省 / 市 / 区'),
        dataIndex: 'regionName',
      },
      {
        title: intl.get(`${modelPrompt}.mapAddress`).d('地址'),
        dataIndex: 'mapAddress',
      },
      {
        title: intl.get(`${modelPrompt}.zipCode`).d('邮编'),
        dataIndex: 'zipCode',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.contactWay`).d('主要联系方式'),
        dataIndex: 'contactWay',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.mapEnabledFlag`).d('开启地图/GIS模式'),
        dataIndex: 'mapEnabledFlag',
        width: 150,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 80,
        align: 'center',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'create' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record)}>
                {intl.get('hzero.common.status.edit').d('编辑')}
              </a>
              <a onClick={() => onCleanLine(record)}>
                {intl.get('hzero.common.status.clear').d('清除')}
              </a>
            </span>
          ) : (
            <a onClick={() => onEditLine(record)}>
              {intl.get('hzero.common.status.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="orgToLocationId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 1360 }}
      />
    );
  }
}
export default AddressList;
