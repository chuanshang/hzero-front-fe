import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

/**
 * 服务区域数据展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onForBid - 禁用行
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const promptCode = 'amdm.acceptanceType.model.acceptanceType';
    const { loading, dataSource, pagination, onSearch, onEditLine, onChangeStatus } = this.props;
    const columns = [
      {
        title: intl.get(`${promptCode}.shortName`).d('事件短名称'),
        dataIndex: 'shortName',
        render: (val, record) => <a onClick={() => onEditLine(record.acceptanceTypeId)}>{val}</a>,
      },
      {
        title: intl.get(`${promptCode}.fullName`).d('事件完整名称'),
        dataIndex: 'fullName',
      },
      {
        title: intl.get(`${promptCode}.code`).d('代码'),
        dataIndex: 'code',
      },
      {
        title: intl.get(`${promptCode}.acceptanceTypeCode`).d('验收基础类型'),
        dataIndex: 'acceptanceTypeCodeMeaning',
      },
      {
        title: intl.get(`${promptCode}.transferFixedCode`).d('是否转固'),
        dataIndex: 'transferFixedCodeMeaning',
      },
      {
        title: intl.get(`${promptCode}.approveFlowFlag`).d('是否需要审批流'),
        dataIndex: 'approveFlowFlagMeaning',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        render: (val, record) =>
          record.enabledFlag ? (
            <a onClick={() => onChangeStatus(record, false)}>
              {intl.get('hzero.common.button.disabled').d('禁用')}
            </a>
          ) : (
            <a onClick={() => onChangeStatus(record, true)}>
              {intl.get('hzero.common.button.disabled').d('启用')}
            </a>
          ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="maintSitesId"
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
