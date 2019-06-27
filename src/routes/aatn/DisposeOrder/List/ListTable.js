import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

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
    const { loading, dataSource, pagination, onSearch, onLinkToDetail } = this.props;
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
        title: intl.get(`${disposeOrderModelPrompt}.titleOverview`).d('标题概述'),
        dataIndex: 'titleOverview',
        width: 150,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.transactionType`).d('事务类型'),
        dataIndex: 'transactionTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.processStatus`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
        width: 150,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonName',
        width: 150,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.planStartDate`).d('执行日期'),
        dataIndex: 'planStartDate',
        width: 150,
        render: dateRender,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.planEndDate`).d('完成日期'),
        dataIndex: 'planEndDate',
        width: 150,
        render: dateRender,
      },
      {
        title: intl.get(`${disposeOrderModelPrompt}.description`).d('理由'),
        dataIndex: 'description',
        width: 150,
      },
    ];
    return (
      <Table
        bordered
        rowKey="disposeHeaderId"
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
