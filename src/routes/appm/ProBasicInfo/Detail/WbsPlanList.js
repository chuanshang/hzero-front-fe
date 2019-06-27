import React, { Component } from 'react';
import EditTable from 'components/EditTable';
import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

class WbsPlanList extends Component {
  render() {
    const { loading, dataSource, onGoToWBS } = this.props;
    const promptCode = 'appm.proBasicInfo.model.proBasicInfo';
    const columns = [
      {
        title: intl.get(`${promptCode}.wbsVersion`).d('计划版本'),
        dataIndex: 'wbsVersion',
        width: 100,
        render: val => `${val}.0`,
      },
      {
        title: intl.get(`${promptCode}.wbsStatus`).d('版本状态'),
        dataIndex: 'wbsStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.approveStatus`).d('审批状态'),
        dataIndex: 'approveStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.expectStartDate`).d('预计开始日期'),
        dataIndex: 'expectStartDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.expectEndDate`).d('预计结束日期'),
        dataIndex: 'expectEndDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.limitTimeTotal`).d('工期'),
        dataIndex: 'limitTimeTotal',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.limitTimeUom`).d('工期单位'),
        dataIndex: 'limitTimeUomMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.remark`).d('版本概述'),
        dataIndex: 'remark',
        width: 120,
      },
      // {
      //   title: intl.get(`${promptCode}.approvedDate`).d('批准时间'),
      //   dataIndex: 'approvedDate',
      //   width: 100,
      //   render: dateRender,
      // },
      {
        title: intl.get(`${promptCode}.lastUpdateDate`).d('最后更新日期'),
        dataIndex: 'lastUpdateDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.detail`).d('明细'),
        width: 60,
        fixed: 'right',
        render: (_, record) => (
          <a onClick={() => onGoToWBS(record)}>{intl.get(`${promptCode}.detail`).d('明细')}</a>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        scroll={{ x: 1040 }}
        rowKey="wbsHeaderId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default WbsPlanList;
