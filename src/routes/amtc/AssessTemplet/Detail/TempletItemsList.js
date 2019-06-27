import React, { PureComponent } from 'react';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 评估项关联对象
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class TempletItemsList extends PureComponent {
  render() {
    const { loading, dataSource, pagination, onEditLine, onDeleteLine } = this.props;
    const promptCode = `amtc.assessTemplet.model.assessTemplet`;
    const columns = [
      {
        title: intl.get(`${promptCode}.templetItemSeq`).d('序号'),
        dataIndex: 'templetItemSeq',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.templetItemName`).d('名称'),
        dataIndex: 'templetItemName',
        width: 150,
        render: (value, record) => <a onClick={() => onEditLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.methodCode`).d('检测方法'),
        dataIndex: 'methodCode',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.standardReference`).d('参考标准'),
        dataIndex: 'standardReference',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.valueTypeName`).d('字段类型'),
        dataIndex: 'valueTypeName',
        width: 150,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'left',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => onDeleteLine(record)}>
              {intl.get('hzero.common.status.delete').d('删除')}
            </a>
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="templetItemslistId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default TempletItemsList;
