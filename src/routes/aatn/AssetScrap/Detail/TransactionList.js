import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

class TransactionList extends PureComponent {
  /**
   * 删除操作
   */
  @Bind()
  deleteBtn(record) {
    const { dataSource, onDelete, onDeleteFromDB } = this.props;

    if (record._status !== `create`) {
      // 调用接口来删除数据
      onDeleteFromDB(dataSource, record.scrapLineId);
    } else {
      // 进行删除操作
      onDelete(dataSource.filter(item => item.scrapLineId !== record.scrapLineId));
    }
  }
  render() {
    const { isNew, editFlag, loading, dataSource, lineDeleteButtonStyle, onEdit } = this.props;
    const { detailLineListLoading } = loading;
    const promptCode = 'aatn.assetScrap.model.assetScrap';
    const columns = [
      {
        title: intl.get(`${promptCode}.lineNumDisplay`).d('编号'),
        dataIndex: 'lineNumDisplay',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetName`).d('设备/资产'),
        dataIndex: 'assetName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.assetDesc`).d('资产名称'),
        dataIndex: 'assetDesc',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render: (val, record) =>
          isNew || editFlag ? (
            <div>
              <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a style={lineDeleteButtonStyle} onClick={() => this.deleteBtn(record)}>
                {intl.get('hzero.common.button.delete').d('清除')}
              </a>
            </div>
          ) : (
            <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
              {intl.get('hzero.common.button.detail').d('详细')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="scrapLineId"
        loading={detailLineListLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        // onChange={page => onSearch(page)}
      />
    );
  }
}
export default TransactionList;
