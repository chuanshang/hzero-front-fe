import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { enableRender } from 'utils/renderer';

class ListTable extends PureComponent {
  handleCell(length) {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: length,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      selectedRowKeys,
      onSelectRow,
      pagination,
      handleStandardTableChange,
      onUpdateSuffer,
    } = this.props;
    const columns = [
      {
        title: '工作人员名称',
        dataIndex: 'workcenterPeopleName',
        align: 'left',
        width: 150,
        render: (value, record) => <a onClick={() => onUpdateSuffer(record)}>{value}</a>,
      },
      {
        title: '技能类型',
        dataIndex: 'resId',
        align: 'left',
        width: 150,
        render: (value, record) => <a onClick={() => onUpdateSuffer(record)}>{value}</a>,
      },
      {
        title: '人员',
        dataIndex: 'contactId',
        align: 'left',
        width: 100,
      },
      {
        title: '用户',
        dataIndex: 'userId',
        align: 'left',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'description',
        align: 'left',
        width: 200,
      },
      {
        title: '是否启用',
        dataIndex: 'enabledFlag',
        align: 'left',
        width: 100,
        render: enableRender,
      },
    ];
    return (
      <Table
        bordered
        rowKey="workcenterPeopleId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => handleStandardTableChange(page)}
      />
    );
  }
}

export default ListTable;
