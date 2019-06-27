import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTable extends PureComponent {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      onEdit,
    } = this.props;
    const promptCode = 'arcv.deliveryList.model.deliveryList';
    const columns = [
      {
        title: intl.get(`${promptCode}.deliveryListName`).d('名称'),
        dataIndex: 'deliveryListName',
        width: 120,
        render: (val, record) => <a onClick={() => onEdit(record.deliveryListId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.productCategory`).d('产品类别'),
        dataIndex: 'productCategoryMeaning',
      },
      {
        title: intl.get(`${promptCode}.assetsSet`).d('资产组'),
        dataIndex: 'assetsSetMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.specifications`).d('规格型号'),
        dataIndex: 'specifications',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${promptCode}.unitPrice`).d('单价'),
        dataIndex: 'unitPrice',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.contractId`).d('合同'),
        dataIndex: 'contractMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.contractLine`).d('合同行'),
        dataIndex: 'contractLineMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.needDeliveryQuantity`).d('应交付数量'),
        dataIndex: 'needDeliveryQuantity',
      },
      {
        title: intl.get(`${promptCode}.deliveredQuantity`).d('已交付数量'),
        dataIndex: 'deliveredQuantity',
      },
      {
        title: intl.get(`${promptCode}.deliveryCompleteDate`).d('交付完成日期'),
        dataIndex: 'deliveryCompleteDate',
        width: 100,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.deliveryCompleteFlag`).d('是否交付完成'),
        dataIndex: 'deliveryCompleteFlag',
        render: value => yesOrNoRender(value),
      },
      {
        title: intl.get(`${promptCode}.owningMajorCode`).d('操作'),
        dataIndex: 'owningMajorCode',
        width: 80,
        render: (val, record) => (
          <a onClick={() => onEdit(record.deliveryListId)}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </a>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="deliveryListId"
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
