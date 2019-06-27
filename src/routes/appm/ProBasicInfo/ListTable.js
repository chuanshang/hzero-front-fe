import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onEdit,
      selectedRowKeys,
      onSelectRow,
    } = this.props;
    const promptCode = 'appm.proBasicInfo.model.proBasicInfo';
    const columns = [
      {
        title: intl.get(`${promptCode}.projectCode`).d('预项目编号/项目编号'),
        width: 200,
        fixed: true,
        render: (_, record) => (
          <a onClick={() => onEdit(record.projectId)}>
            {`${record.preProjectCode} / ${record.projectCode}`}
          </a>
        ),
      },
      {
        title: intl.get(`${promptCode}.projectName`).d('项目名称'),
        dataIndex: 'projectName',
      },
      {
        title: intl.get(`${promptCode}.proType`).d('项目类型'),
        dataIndex: 'proTypeName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.proStatus`).d('项目状态'),
        dataIndex: 'proStatusName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.manageOrg`).d('项目管理组织'),
        dataIndex: 'manageOrgName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.implementOrg`).d('项目实施组织'),
        dataIndex: 'implementOrgName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.priority`).d('优先级'),
        dataIndex: 'priorityMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.completionDegree`).d('完成度'),
        dataIndex: 'completionDegree',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.healthCondition`).d('项目健康状况'),
        dataIndex: 'healthConditionMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.startDate`).d('预计开始日期'),
        dataIndex: 'startDate',
        width: 120,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.endDate`).d('预计结束日期'),
        dataIndex: 'endDate',
        width: 120,
        align: 'center',
        render: dateRender,
      },
    ];
    return (
      <Table
        bordered
        scroll={{ x: 1490 }}
        rowKey="projectId"
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
export default ListTable;
