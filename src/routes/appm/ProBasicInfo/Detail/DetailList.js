import React, { Component } from 'react';
import EditTable from 'components/EditTable';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class DetailList extends Component {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onEditLine,
      selectedRowKeys,
      onSelectRow,
      onMakePermission,
    } = this.props;
    const promptCode = 'appm.proBasicInfo.model.proBasicInfo';
    const columns = [
      {
        title: intl.get(`${promptCode}.roleName`).d('角色'),
        dataIndex: 'proRoleName',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.grouping`).d('分组'),
        dataIndex: 'grouping',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.orgName`).d('组织'),
        dataIndex: 'orgName',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.staffCode`).d('人员'),
        dataIndex: 'staffName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.phone`).d('工作电话'),
        dataIndex: 'phone',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.email`).d('电子邮件'),
        dataIndex: 'email',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.projectPhone`).d('项目工作电话'),
        dataIndex: 'projectPhone',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.projectEmail`).d('项目电子邮件'),
        dataIndex: 'projectEmail',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.startDate`).d('开始日期'),
        dataIndex: 'startDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.endDate`).d('结束日期'),
        dataIndex: 'endDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.permission`).d('项目权限'),
        dataIndex: 'permission',
        minWidth: 120,
        render: (_, record) => onMakePermission(record),
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 60,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <a onClick={() => onEditLine(record)}>{intl.get('hzero.common.status.edit').d('编辑')}</a>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        scroll={{ x: 760 }}
        rowKey="proResourceId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default DetailList;
