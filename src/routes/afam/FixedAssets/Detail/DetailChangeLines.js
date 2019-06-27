import React, { Component } from 'react';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

class DetailChangeLines extends Component {
  render() {
    const { loading, dataSource, selectedRowKeys, onEditLine, onSelectRow } = this.props;
    const promptCode = 'afam.fixedAssets.model.fixedAssets';
    const columns = [
      {
        title: intl.get(`${promptCode}.periodName`).d('期间'),
        dataIndex: 'periodName',
        align: 'left',
        width: 110,
      },
      {
        title: intl.get(`${promptCode}.changeTypeCode`).d('类型'),
        dataIndex: 'changeTypeMeaning',
        align: 'left',
        width: 110,
      },
      {
        title: intl.get(`${promptCode}.changeValue`).d('价值变动'),
        dataIndex: 'changeValue',
        align: 'right',
        width: 110,
      },
      {
        title: intl.get(`${promptCode}.correlatedEvent`).d('关联事件'),
        dataIndex: 'correlatedEvent',
        align: 'left',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.accountingVoucherNumber`).d('会计凭证编号'),
        dataIndex: 'accountingVoucherNumber',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        align: 'left',
        width: 180,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 70,
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
        showHeader
        scroll={{ x: 760, y: 260 }}
        rowKey="changeId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        // onChange={page => onSearch(page)}
      />
    );
  }
}
export default DetailChangeLines;
