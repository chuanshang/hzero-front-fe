import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class MaterialList extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { loading, dataSource, pagination, onSearch, onDeleteMaterial, onEditLine } = this.props;
    const promptCode = 'amtc.workOrder.model.material';
    const columns = [
      {
        title: intl.get(`${promptCode}.woopMeaning`).d('任务'),
        dataIndex: 'woopMeaning',
        align: 'left',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.itemMeaning`).d('物料'),
        dataIndex: 'itemMeaning',
        align: 'left',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.itemNum`).d('物料编码'),
        dataIndex: 'itemNum',
        align: 'left',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.needQuantity`).d('需要数量'),
        dataIndex: 'needQuantity',
        align: 'left',
        width: 90,
      },
      {
        title: intl.get(`${promptCode}.uomMeaning`).d('单位'),
        dataIndex: 'uomMeaning',
        align: 'left',
        width: 90,
      },
      {
        title: intl.get(`${promptCode}.processedQuantity`).d('处理数量'),
        dataIndex: 'processedQuantity',
        align: 'left',
        width: 90,
      },
      {
        title: intl.get(`${promptCode}.lotNumber`).d('批次号'),
        dataIndex: 'lotNumber',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.locationMeaning`).d('来源位置'),
        dataIndex: 'locationMeaning',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.locatorMeaning`).d('来源货位'),
        dataIndex: 'locatorMeaning',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.description`).d('描述'),
        dataIndex: 'description',
        align: 'left',
        width: 120,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => onEditLine(record)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
            <a onClick={() => onDeleteMaterial(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="woMaterialId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        // rowSelection={{
        //   selectedRowKeys,
        //    onChange: onSelectRow,
        //  }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default MaterialList;
