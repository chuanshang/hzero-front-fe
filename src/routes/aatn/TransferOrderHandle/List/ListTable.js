import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

/**
 * 调拨转移单数据展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onLinkToDetail - 跳转详情页
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const transferOrderModelPrompt = 'aatn.transferOrder.model.transferOrder';
    const { loading, dataSource, pagination, onSearch, onEditLine, onLinkToDetail } = this.props;
    const columns = [
      {
        title: intl.get(`${transferOrderModelPrompt}.transferNum`).d('事务处理单编号'),
        dataIndex: 'transferNum',
        width: 120,
        render: (val, record) => (
          <a onClick={() => onLinkToDetail(record.transferHeaderId)}>{val}</a>
        ),
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.assetName`).d('设备/资产'),
        dataIndex: 'name',
        width: 150,
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.processStatus`).d('处理状态(行)'),
        dataIndex: 'processStatusMeaning',
        width: 150,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 120,
        render: (val, record) =>
          record.processStatus === 'UNPROCESSED' ? ( // 未处理状态
            <a onClick={() => onEditLine(record, 'callOut')}>
              {intl.get('aatn.transfer.button.callOut').d('调出')}
            </a>
          ) : record.processStatus === 'ON_THE_WAY' ? (
            <a onClick={() => onEditLine(record, 'callIn')}>
              {intl.get('aatn.transfer.button.callIn').d('调入')}
            </a>
          ) : (
            <a onClick={() => onEditLine(record, 'view')}>
              {intl.get('hzero.common.button.view').d('查看')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="transferLineId"
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
