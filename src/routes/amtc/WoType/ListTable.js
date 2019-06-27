import React, { PureComponent } from 'react';
import { isNumber, sum } from 'lodash';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import LazyLoadMenuIcon from '@/components/LazyLoadMenuIcon';

const menuIconStyle = {
  width: 14,
  height: 14,
};

class ListTable extends PureComponent {
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

    const promptCode = 'amtc.woType.model.woType';
    const columns = [
      {
        title: intl.get(`${promptCode}.longName`).d('工单类型名称'),
        dataIndex: 'longName',
        width: 150,
        render: (value, record) => <a onClick={() => onLinkToDetail(record, false)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.icon`).d('图标'),
        dataIndex: 'icon',
        width: 60,
        render: code => <LazyLoadMenuIcon code={code} style={menuIconStyle} />,
      },
      {
        title: intl.get(`${promptCode}.parentTypeName`).d('父工单类型'),
        dataIndex: 'parentTypeName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.shortName`).d('事件短名称'),
        dataIndex: 'shortName',
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
        width: 200,
        align: 'left',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onAddLine(record, true)}>{intl.get('hzero').d('新增下级')}</a>
              <a onClick={() => onForbidLine(record)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onAddLine(record, true)}>{intl.get('hzero').d('新增下级')}</a>
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
        rowKey="woTypeId"
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
