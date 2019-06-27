import React, { PureComponent } from 'react';
import { Table, Row } from 'hzero-ui';
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
        title: intl.get(`${promptCode}.changeNum`).d('事务处理单'),
        dataIndex: 'changeNum',
        width: 160,
        render: (val, record) => <a onClick={() => onGotoDetail(record.changeHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.lineNumber`).d('资产事务处理行'),
        dataIndex: 'lineNumber',
        width: 180,
      },
      {
        title: intl.get(`${promptCode}.name`).d('设备/资产'),
        dataIndex: 'name',
        width: 100,
        onCell: () => this.handleCell(180),
      },
      {
        title: intl.get(`${promptCode}.description`).d('理由'),
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
        render: (
          val,
          record // 未处理状态
        ) => (
          <a onClick={() => onShowDrawer(record)}>
            {intl.get('aatn.executeAssetStatusChange.button.execute').d('执行处理')}
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
