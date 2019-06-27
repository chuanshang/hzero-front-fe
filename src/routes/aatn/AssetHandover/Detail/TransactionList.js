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
    const { isNew, editControl, loading, dataSource, handoverNum, onEdit, onDelete } = this.props;
    const promptCode = 'aatn.assetHandover.model.assetHandover';
    const columns = [
      {
        title: intl.get(`${promptCode}.lineNum`).d('编号'),
        dataIndex: 'lineNum',
        width: 180,
        render: (val, record) => (record.processStatus !== 'NEW' ? `${handoverNum}-${val}` : ''),
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
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].currentAssetStatusName}`}
              </span>
              {'变为'}
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].targetAssetStatusName},`}
              </span>
            </Row>
            <Row>
              {'所属人由'}
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].currentOwningPersonName}`}
              </span>
              {'变为'}
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].targetOwningPersonName},`}
              </span>
              {'使用人由'}
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].currentUsingPersonName}`}
              </span>
              {'变为'}
              <span style={{ color: '#F04134' }}>
                {`${record.detailList[0].targetUsingPersonName}`}
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
          ) : record.processStatus === 'NO_HANDED_OVER' ? ( // 未提交状态
            <a onClick={() => onEdit(record)}>
              {intl.get('aatn.assetHandover.button.handover').d('移交确认')}
            </a>
          ) : record.processStatus === 'HANDED_NO_RETURN' ? ( // 移交未归还状态
            <a onClick={() => onEdit(record)}>
              {intl.get('aatn.assetHandover.button.return').d('移交归还')}
            </a>
          ) : (
            <a onClick={() => onEdit(record)}>{intl.get('hzero.common.button.detail').d('详情')}</a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="handoverLineId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        // onChange={page => onSearch(page)}
      />
    );
  }
}
export default TransactionList;
