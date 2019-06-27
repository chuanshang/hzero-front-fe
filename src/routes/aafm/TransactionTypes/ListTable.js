import React, { PureComponent } from 'react';
import { isNumber, sum } from 'lodash';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  handleCell(length) {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: length,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }
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
    const promptCode = 'aafm.transactionTypes.model.transactionTypes';
    const columns = [
      {
        title: intl.get(`${promptCode}.orgName`).d('事件短名称'),
        dataIndex: 'shortName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.transactionTypeId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.longName`).d('事件完整名称'),
        dataIndex: 'longName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.transactionTypeId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.basicTypeCode`).d('基础类型'),
        dataIndex: 'basicTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.transactionTypeCode`).d('代码'),
        dataIndex: 'transactionTypeCode',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.needTwiceConfirm`).d('需要2步确认'),
        dataIndex: 'needTwiceConfirmMeaning',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        onCell: () => this.handleCell(180),
        width: 120,
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
        width: 200,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onAddLine(record.transactionTypeId, true)}>
                {intl.get('hzero').d('新增下级')}
              </a>
              <a onClick={() => onForbidLine(record)}>
                {intl.get('hzero.common.status.disable').d('禁用当前及下级')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onAddLine(record.transactionTypeId, true)}>
                {intl.get('hzero').d('新增下级')}
              </a>
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
        rowKey="transactionTypeId"
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
