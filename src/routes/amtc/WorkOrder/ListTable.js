import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateTimeRender } from 'utils/renderer';

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
      selectedRowKeys,
      onSelectRow,
      onLinkToDetail,
      pagination,
      onSearch,
    } = this.props;
    const promptCode = 'amtc.workOrder.model.wo';
    const columns = [
      {
        title: intl.get(`${promptCode}.woNum`).d('工单编号'),
        dataIndex: 'woNum',
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.woId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.woName`).d('工单概述'),
        dataIndex: 'woName',
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.woId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.woStatusMeaning`).d('工单状态'),
        dataIndex: 'woStatusMeaning',
      },
      {
        title: intl.get(`${promptCode}.woTypeName`).d('工单类型'),
        dataIndex: 'woTypeName',
      },
      // {
      //   title: intl.get(`${promptCode}.woTypeName`).d('工作对象'),
      //   dataIndex: 'woTypeName',
      //   align: 'left',
      //   width: 100,
      // },
      {
        title: intl.get(`${promptCode}.ownerName`).d('负责人'),
        dataIndex: 'ownerName',
      },
      {
        title: intl.get(`${promptCode}.plannerName`).d('签派/计划员'),
        dataIndex: 'plannerName',
      },
      {
        title: intl.get(`${promptCode}.scheduledStartDate`).d('已计划开始时间'),
        dataIndex: 'scheduledStartDate',
        render: dateTimeRender,
      },
      {
        title: intl.get(`${promptCode}.durationScheduled`).d('计划工期'),
        dataIndex: 'durationScheduled',
      },
      {
        title: intl.get(`${promptCode}.initOriginalValue`).d('处理人'),
        dataIndex: 'initOriginalValue',
      },
      {
        title: intl.get(`${promptCode}.maintSitesName`).d('服务区域'),
        dataIndex: 'maintSitesName',
      },
    ];
    return (
      <Table
        bordered
        rowKey="woId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
