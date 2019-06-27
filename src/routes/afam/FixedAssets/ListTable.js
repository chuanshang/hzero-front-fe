import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

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
    const promptCode = 'afam.fixedAssets.model.fixedAssets';
    const columns = [
      {
        title: intl.get(`${promptCode}.fixedAssetName`).d('名称'),
        dataIndex: 'fixedAssetName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onLinkToDetail(record.fixedAssetId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.financialNum`).d('财务固定资产编号'),
        dataIndex: 'financialNum',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.transferDate`).d('转固日期'),
        dataIndex: 'transferDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.assetBookCode`).d('资产账簿'),
        dataIndex: 'assetBookCode',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.assetCatalogName`).d('资产目录'),
        dataIndex: 'assetCatalogName',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.initOriginalValue`).d('原始原值'),
        dataIndex: 'initOriginalValue',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.currentOriginalValue`).d('当前原值'),
        dataIndex: 'currentOriginalValue',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.accumulatedDepreciation`).d('累计折旧'),
        dataIndex: 'accumulatedDepreciation',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.YTDDepreciation`).d('YTD折旧'),
        dataIndex: 'YTDDepreciation',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.netValue`).d('净值'),
        dataIndex: 'netValue',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.residualValue`).d('残值'),
        dataIndex: 'residualValue',
        align: 'right',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        onCell: () => this.handleCell(180),
        width: 120,
      },
    ];
    return (
      <Table
        bordered
        rowKey="fixedAssetId"
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
