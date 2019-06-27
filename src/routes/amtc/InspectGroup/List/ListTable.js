import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { loading, dataSource, onLinkToDetail, pagination, onSwitch, onSearch } = this.props;
    const promptCode = 'amtc.inspectGroup.model.inspectGroup';
    const columns = [
      {
        title: intl.get(`${promptCode}.groupName`).d('检查组名称'),
        dataIndex: 'groupName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.checklistGroupId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.groupTypeCode`).d('检查组类型'),
        dataIndex: 'groupTypeCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.status`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 100,
        render: (val, record) =>
          record.enabledFlag ? (
            <a onClick={() => onSwitch(record, false)}>
              {intl.get('hzero.common.status.disable').d('禁用')}
            </a>
          ) : (
            <a onClick={() => onSwitch(record, true)}>
              {intl.get('hzero.common.status.enable').d('启用')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="checklistGroupId"
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
