import React, { PureComponent } from 'react';
import { Table, Row } from 'hzero-ui';
import intl from 'utils/intl';

class TransactionList extends PureComponent {
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
    const {
      isNew,
      editControl,
      loading,
      dataSource,
      pagination,
      onEdit,
      onDelete,
      onSearch,
    } = this.props;
    const promptCode = 'aatn.assetStatusChange.model.assetStatusChange';
    const columns = [
      {
        title: intl.get(`${promptCode}.lineNumber`).d('编号'),
        dataIndex: 'lineNumber',
        width: 180,
      },
      {
        title: intl.get(`${promptCode}.name`).d('设备/资产'),
        dataIndex: 'name',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.assetDesc`).d('资产名称'),
        dataIndex: 'assetDesc',
        width: 120,
        onCell: () => this.handleCell(180),
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        render: (_, record) => (
          <Row>
            <Row>
              {'资产状态由'}
              <span style={{ color: '#F04134' }}>{`${record.currentAssetStatusName}`}</span>
              {'变为'}
              <span style={{ color: '#F04134' }}>{`${record.targetAssetStatusName},`}</span>
              {'位置由'}
              <span style={{ color: '#F04134' }}>{`${record.currentLocationName}`}</span>
              {'变为'}
              <span style={{ color: '#F04134' }}>{`${record.targetLocationName},`}</span>
            </Row>
            <Row>
              {'所属人由'}
              <span style={{ color: '#F04134' }}>{`${record.currentOwningPersonName}`}</span>
              {'变为'}
              <span style={{ color: '#F04134' }}>{`${record.targetOwningPersonName},`}</span>
              {'使用人由'}
              <span style={{ color: '#F04134' }}>{`${record.currentUsingPersonName}`}</span>
              {'变为'}
              <span style={{ color: '#F04134' }}>
                {`${record.targetUsingPersonName},${record.description}`}
              </span>
            </Row>
          </Row>
        ),
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
          record.processStatus === 'NEW' ? ( // 新建状态
            <span className="action-link">
              {!isNew || editControl ? (
                <a onClick={() => onEdit(record)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              ) : (
                <a onClick={() => onEdit(record)}>
                  {intl.get('hzero.common.button.detail').d('详情')}
                </a>
              )}
              <a onClick={() => onDelete(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
          ) : record.processStatus === 'UNPROCESSED' ? ( // 未处理状态
            <a onClick={() => onEdit(record)}>
              {intl.get('aatn.assetStatusChange.button.execute').d('执行处理')}
            </a>
          ) : (
            <a onClick={() => onEdit(record)}>{intl.get('hzero.common.button.detail').d('详情')}</a>
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
export default TransactionList;
