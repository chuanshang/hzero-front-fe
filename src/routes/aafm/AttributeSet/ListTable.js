import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';

/**
 * 属性组数据展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onSearch - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
const modelPrompt = 'aafm.attributeSet.model.attributeSet';
class ListTable extends Component {
  /**
   * 跳转到对应行的明细页面
   * @param {string} attributeSetId - 属性组Id
   */
  @Bind()
  handleToDetail(attributeSetId) {
    const { onHandleToDetail } = this.props;
    if (onHandleToDetail) {
      onHandleToDetail(attributeSetId);
    }
  }

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`aafm.common.model.name`).d('名称'),
        dataIndex: 'attributeSetName',
        render: (val, record) => (
          <a onClick={() => this.handleToDetail(record.attributeSetId)}>{val}</a>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get(`hzero.common.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        render: yesOrNoRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="attributeSetId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onSearch}
      />
    );
  }
}

export default ListTable;
