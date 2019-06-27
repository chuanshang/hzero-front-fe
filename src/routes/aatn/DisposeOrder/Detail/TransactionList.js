import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class TransactionList extends PureComponent {
  render() {
    const {
      isNew,
      editControl,
      loading,
      dataSource,
      pagination,
      onDelete,
      onSearch,
      onEditLine,
    } = this.props;
    const promptCode = 'aatn.disposeOrder.model.disposeOrder';
    const columns = [
      {
        title: intl.get(`${promptCode}.assetName`).d('设备/资产'),
        dataIndex: 'assetName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetDesc`).d('资产名称'),
        dataIndex: 'assetDesc',
      },
      {
        title: intl.get(`${promptCode}.processStatus`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        render: (val, record) =>
          record.processStatus === 'NEW' ? ( // 新建状态
            <span className="action-link">
              {isNew || editControl ? (
                <a onClick={() => onEditLine(record)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              ) : (
                <a onClick={() => onEditLine(record)}>
                  {intl.get('hzero.common.button.detail').d('详情')}
                </a>
              )}
              <a onClick={() => onDelete(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
          ) : record.processStatus === 'PENDING_DISPOSAL' ? ( // 待处置状态
            <a onClick={() => onEditLine(record, 'disposition')}>
              {intl.get('aatn.transfer.button.disposition').d('处置')}
            </a>
          ) : (
            <a onClick={() => onEditLine(record)}>
              {intl.get('hzero.common.button.detail').d('详情')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="disposeLineId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TransactionList;
