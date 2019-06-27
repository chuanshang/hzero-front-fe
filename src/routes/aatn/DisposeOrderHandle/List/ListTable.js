import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

/**
 * 资产处置单数据展示列表
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
    const disposeOrderModelPrompt = 'aatn.disposeOrder.model.disposeOrder';
    const { loading, dataSource, pagination, onSearch, onEditLine, onLinkToDetail } = this.props;
    const columns = [
      {
        title: intl.get(`${disposeOrderModelPrompt}.disposeNum`).d('事务处理单编号'),
        dataIndex: 'disposeNum',
        width: 120,
        render: (val, record) => (
          <a onClick={() => onLinkToDetail(record.disposeHeaderId)}>{val}</a>
        ),
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.assetName`).d('设备/资产'),
        dataIndex: 'assetName',
        width: 150,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.processStatus`).d('处理状态(行)'),
        dataIndex: 'processStatusMeaning',
        width: 150,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 120,
        render: (val, record) =>
          record.processStatus === 'PENDING_DISPOSAL' ? ( // 待处置
            <a onClick={() => onEditLine(record, 'disposition')}>
              {intl.get('aatn.dispose.button.disposition').d('处置')}
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
export default ListTable;
