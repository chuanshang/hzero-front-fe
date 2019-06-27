import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSearch,
      onView,
      onGotoDetail,
      onGotoNewDetail,
      onSelectRow,
    } = this.props;
    const promptCode = 'appa.budgetTemplate.model.budgetTemplate';
    const columns = [
      {
        title: intl.get(`${promptCode}.templateCode`).d('模板编号'),
        width: 120,
        dataIndex: 'templateCode',
        render: (val, record) => <a onClick={() => onGotoDetail(record)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.templateName`).d('模板名称'),
        dataIndex: 'templateName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.projectType`).d('项目类型'),
        dataIndex: 'proTypeName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.budgetType`).d('预算类型'),
        dataIndex: 'budgetTypeName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.templateVersion`).d('当前版本'),
        dataIndex: 'templateVersion',
        width: 100,
        render: val => `V${val}`,
      },
      {
        title: intl.get(`${promptCode}.templateStatus`).d('版本状态'),
        dataIndex: 'templateStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.effectiveDate`).d('版本生效日期'),
        dataIndex: 'effectiveDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 200,
        render: (_, record) => (
          <span className="action-link">
            <a onClick={() => onGotoNewDetail(record.templateCode)}>
              {intl.get(`${promptCode}.edit`).d('编辑新版本')}
            </a>
            <a onClick={() => onView(record)}>{intl.get(`${promptCode}.view`).d('查看历史版本')}</a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        scroll={{ x: 780 }}
        rowKey="templateId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
          getCheckboxProps: record => ({
            disabled: record.templateStatus !== 'PRESET',
            name: record.templateStatus,
          }),
        }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
