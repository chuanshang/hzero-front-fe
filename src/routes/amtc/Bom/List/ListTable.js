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
      selectedRowKeys,
      onSelectRow,
    } = this.props;
    const promptCode = 'amtc.bom.model.bom';
    const columns = [
      {
        title: intl.get(`${promptCode}.bomName`).d('BOM名称'),
        dataIndex: 'bomName',
        width: 150,
        render: (value, record) => <a onClick={() => onEditLine(record.bomId, false)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.parentName`).d('对象'),
        dataIndex: 'parentName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get(`${promptCode}.childNodeName`).d('虚拟/子节点名称'),
        dataIndex: 'childNodeName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.maintSites`).d('服务区域'),
        dataIndex: 'maintSiteName',
        width: 150,
      },
    ];
    return (
      <Table
        bordered
        rowKey="bomId"
        loading={loading.list}
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
