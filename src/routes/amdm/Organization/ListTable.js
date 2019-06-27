import React, { PureComponent } from 'react';
import { isNumber, sum } from 'lodash';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { yesOrNoRender, enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      expandedRowKeys,
      onLinkToDetail,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
    } = this.props;
    const promptCode = 'amdm.organization.model.organization';
    const columns = [
      {
        title: intl.get(`${promptCode}.orgName`).d('组织简称'),
        dataIndex: 'orgName',
        width: 120,
        render: (value, record) => <a onClick={() => onLinkToDetail(record.orgId)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.orgFullName`).d('组织全称'),
        dataIndex: 'orgFullName',
        width: 300,
      },
      {
        title: intl.get(`${promptCode}.orgNum`).d('组织编号'),
        dataIndex: 'orgNum',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.businessType`).d('业务类型'),
        dataIndex: 'businessTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.orgType`).d('组织类型'),
        dataIndex: 'orgTypeMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.orgLevel`).d('组织级别'),
        dataIndex: 'orgLevelMeaning',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.parentOrg`).d('上级组织'),
        dataIndex: 'parentOrganizationName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.costCenterCode`).d('成本中心'),
        dataIndex: 'costCenterCode',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.bookName`).d('财务账簿'),
        dataIndex: 'bookName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.legalPersonFlag`).d('独立法人公司'),
        dataIndex: 'legalPersonFlag',
        width: 120,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.assetOrgFlag`).d('可分配使用资产'),
        dataIndex: 'assetOrgFlag',
        width: 120,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.customerFlag`).d('客户'),
        dataIndex: 'customerFlag',
        width: 80,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.supplierFlag`).d('是否供应商'),
        dataIndex: 'supplierFlag',
        width: 120,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.outServicesFlag`).d('是否可提供委外服务'),
        dataIndex: 'outServicesFlag',
        width: 150,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        align: 'center',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 250,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onAddLine(record.orgId, true)}>{intl.get('hzero').d('新增下级')}</a>
              <a onClick={() => onForbidLine(record)}>
                {intl.get('hzero.common.status.disable').d('禁用当前及下级')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onAddLine(record.orgId, true)}>{intl.get('hzero').d('新增下级')}</a>
              <a style={{ color: '#F04134', cursor: 'default' }}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
              <a onClick={() => onEnabledLine(record)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    const scrollX = sum(columns.map(n => (isNumber(n.width) ? n.width : 0)));
    return (
      <Table
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey="orgId"
        loading={loading}
        onExpand={onExpand}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: scrollX }}
      />
    );
  }
}
export default ListTable;
