import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const { loading, dataSource, pagination, onSearch, onDeal, onEdit } = this.props;
    const promptCode = 'aatn.assetScrapDispose.model.assetScrapDispose';
    const columns = [
      {
        title: intl.get(`${promptCode}.scrapNum`).d('资产报废单编号'),
        dataIndex: 'scrapNum',
        width: 120,
        render: (val, record) => <a onClick={() => onEdit(record.scrapHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.lineNumDisplay`).d('资产报废单行编号'),
        dataIndex: 'lineNumDisplay',
        width: 120,
        render: (val, record) => <a onClick={() => onEdit(record.scrapHeaderId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.assetDesc`).d('设备/资产'),
        dataIndex: 'assetDesc',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描 述'),
        dataIndex: 'description',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.processStatusMeaning`).d('处理状态'),
        dataIndex: 'processStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.owningMajorCode`).d('操作'),
        dataIndex: 'owningMajorCode',
        width: 80,
        render: (val, record) => (
          <a
            disabled={record.processStatus !== 'WAIT_FOR_SCRAP'}
            onClick={() => onDeal(record.scrapLineId)}
          >
            {intl.get('hzero.common.button.deal').d('处理')}
          </a>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="scrapLineId"
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
