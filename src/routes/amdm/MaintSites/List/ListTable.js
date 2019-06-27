import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';

/**
 * 服务区域数据展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEditLine - 编辑行
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
    const commonModelPrompt = 'amdm.common.model.common';
    const { loading, dataSource, pagination, onSearch, onEditLine } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.maintSitesName`).d('简称'),
        dataIndex: 'maintSitesName',
        width: 120,
        render: (val, record) => <a onClick={() => onEditLine(record.maintSitesId)}>{val}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.maintSitesDescription`).d('全称'),
        dataIndex: 'maintSitesDescription',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.maintSitesCode`).d('代码'),
        dataIndex: 'maintSitesCode',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.sharedAreaFlag`).d('共享区域'),
        dataIndex: 'sharedAreaFlag',
        width: 80,
        align: 'center',
        render: yesOrNoRender,
      },
      {
        title: intl.get('hzero.common.enabledFlag').d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 80,
        align: 'center',
        render: enableRender,
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
