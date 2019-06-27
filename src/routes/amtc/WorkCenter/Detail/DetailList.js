import React, { Component } from 'react';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 工作中心行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
  render() {
    const { loading, dataSource, pagination, onEdit, onGoto } = this.props;
    const promptCode = `amtc.workCenter.model.workCenter`;
    const columns = [
      {
        title: intl.get(`${promptCode}.workcenterResName`).d('名称'),
        dataIndex: 'workcenterResName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onGoto(record.workcenterResId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.workcenterPeopleName`).d('资源'),
        dataIndex: 'workcenterPeopleName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.resQty`).d('资源数'),
        dataIndex: 'resQty',
        width: 150,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 100,
        align: 'left',
        render: (val, record) => (
          <a onClick={() => onEdit(record)}>{intl.get('hzero.common.status.edit').d('编辑')}</a>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="workcenterResId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default DetailList;
