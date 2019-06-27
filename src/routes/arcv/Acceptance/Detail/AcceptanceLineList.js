import React, { PureComponent } from 'react';
import { Table, Button, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';

class AcceptanceLineList extends PureComponent {
  render() {
    const {
      isNew,
      editFlag,
      dataSource,
      AcceptanceLinePanelReadOnly,
      lineContractVisible,
      onEdit,
      onDelete,
      onAddLine,
      onSelectdeliveryList,
    } = this.props;
    const promptCode = 'arcv.acceptance.model.acceptanceLine';
    let DynamicItem = [];
    if (lineContractVisible) {
      DynamicItem = [
        {
          title: intl.get(`${promptCode}.contractMeaning`).d('来源合同'),
          dataIndex: 'contractMeaning',
          width: 100,
        },
        {
          title: intl.get(`${promptCode}.contractLineMeaning`).d('来源合同行'),
          dataIndex: 'contractLineMeaning',
          width: 100,
        },
      ];
    }
    const columns = [
      ...DynamicItem,
      {
        title: intl.get(`${promptCode}.deliveryListMeaning`).d('来源交付清单行'),
        dataIndex: 'deliveryListMeaning',
      },
      {
        title: intl.get(`${promptCode}.productCategoryMeaning`).d('资产类别'),
        dataIndex: 'productCategoryMeaning',
      },
      {
        title: intl.get(`${promptCode}.assetsSetMeaning`).d('资产组'),
        dataIndex: 'assetsSetMeaning',
      },
      {
        title: intl.get(`${promptCode}.acceptanceLineName`).d('名称'),
        dataIndex: 'acceptanceLineName',
      },
      {
        title: intl.get(`${promptCode}.deliveryQuantity`).d('数量'),
        dataIndex: 'deliveryQuantity',
      },
      {
        title: intl.get(`${promptCode}.uomMeaning`).d('单位'),
        dataIndex: 'uomMeaning',
      },
      {
        title: intl.get(`${promptCode}.unitPrice`).d('单价'),
        dataIndex: 'unitPrice',
      },
      {
        title: intl.get(`${promptCode}.specifications`).d('规格型号'),
        dataIndex: 'specifications',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render:
          AcceptanceLinePanelReadOnly || !(isNew || editFlag)
            ? (val, record) => (
              <div>
                <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
                  {intl.get('hzero.common.button.detail').d('详细')}
                </a>
              </div>
              )
            : (val, record) => (
              <div>
                <a style={{ marginRight: '15px' }} onClick={() => onEdit(record)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
                <a onClick={() => onDelete(record)}>
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              </div>
              ),
      },
    ];
    return (
      <div>
        {AcceptanceLinePanelReadOnly || (!isNew && !editFlag) ? null : (
          <Row>
            <Col className="search-btn-more">
              <Button
                onClick={onAddLine}
                className="search-btn-more"
                type="primary"
                style={{ marginBottom: 16, marginRight: 8, marginLeft: 30 }}
              >
                {intl.get('hzero.common.button.addLine').d('新增')}
              </Button>
              <Button
                onClick={onSelectdeliveryList}
                className="search-btn-more"
                type="primary"
                style={{ marginBottom: 16, marginRight: 8 }}
              >
                {intl.get('hzero.common.button.selectdeliveryList').d('批量选择交付清单')}
              </Button>
            </Col>
          </Row>
        )}
        <Table
          bordered
          rowKey="acceptanceLineId"
          columns={columns}
          dataSource={dataSource}
          // pagination={pagination}
        />
      </div>
    );
  }
}
export default AcceptanceLineList;
