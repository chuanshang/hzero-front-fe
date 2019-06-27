import React, { Component } from 'react';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 技能类型行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
  render() {
    const { loading, dataSource, pagination, onEdit, onGoto } = this.props;
    const promptCode = `amtc.workCenterRes.model.workCenterRes`;
    const columns = [
      {
        title: intl.get(`${promptCode}.workcenterPeopleName`).d('名称'),
        dataIndex: 'workcenterPeopleName',
        width: 150,
        render: (value, record) => (
          <a onClick={() => onGoto(record.workcenterPeopleId, false)}>{value}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.contactName`).d('人员'),
        dataIndex: 'contactName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.userName`).d('用户'),
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.rate`).d('单位费率'),
        dataIndex: 'rate',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.skillLevels`).d('技能水平'),
        dataIndex: 'skillLevels',
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
        rowKey="workcenterPeopleId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
export default DetailList;
