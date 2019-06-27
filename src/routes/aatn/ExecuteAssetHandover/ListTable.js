import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  /**
   * 变更单元格样式
   * @param {number} length - 单元格长度
   */
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
  render() {
    const { loading, dataSource, pagination, onSearch, onShowDrawer, onGotoDetail } = this.props;
    const promptCode = 'aatn.executeAssetStatusChange.model.executeAssetStatusChange';
    const columns = [
      {
        title: intl.get(`${promptCode}.handoverNum`).d('事务处理单'),
        dataIndex: 'handoverNum',
        width: 160,
        render: (val, record) => <a onClick={() => onGotoDetail(record.handoverHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.lineNum`).d('资产事务处理行'),
        dataIndex: 'lineNum',
        width: 180,
        render: (val, record) => `${record.handoverNum}-${val}`,
      },
      {
        title: intl.get(`${promptCode}.name`).d('设备/资产'),
        dataIndex: 'name',
        width: 100,
        onCell: () => this.handleCell(180),
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get(`${promptCode}.processStatus`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        align: 'center',
        render: (val, record) =>
          record.processStatus === 'NO_HANDED_OVER' ? ( // 未提交状态
            <a onClick={() => onShowDrawer(record)}>
              {intl.get('aatn.assetHandover.button.handover').d('移交确认')}
            </a>
          ) : record.processStatus === 'HANDED_NO_RETURN' ? ( // 移交未归还状态
            <a onClick={() => onShowDrawer(record)}>
              {intl.get('aatn.assetHandover.button.return').d('移交归还')}
            </a>
          ) : (
            <a onClick={() => onShowDrawer(record)}>
              {intl.get('aatn.assetHandover.button.view').d('查看')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="changeLineId"
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
