import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

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
    const { loading, dataSource, pagination, onSearch, onLinkToDetail } = this.props;
    const columns = [
      {
        title: intl.get(`${transferOrderModelPrompt}.transferNum`).d('事务处理单编号'),
        dataIndex: 'transferNum',
        render: (val, record) => (
          <a onClick={() => onLinkToDetail(record.transferHeaderId)}>{val}</a>
        ),
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.titleOverview`).d('标题概述'),
        dataIndex: 'titleOverview',
        render: (val, record) => (
          <a onClick={() => onLinkToDetail(record.transferHeaderId)}>{val}</a>
        ),
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.transactionType`).d('事务类型'),
        dataIndex: 'transactionName',
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.processStatus`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonName',
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.planStartDate`).d('计划执行日期'),
        dataIndex: 'planStartDate',
        render: dateRender,
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.planEndDate`).d('计划完成日期'),
        dataIndex: 'planEndDate',
        render: dateRender,
      },
      {
        title: intl.get(`${transferOrderModelPrompt}.description`).d('描述'),
        dataIndex: 'description',
      },
    ];
    return (
      <Table
        bordered
        rowKey="transferHeaderId"
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
