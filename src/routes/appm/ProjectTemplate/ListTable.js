import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender, dateRender } from 'utils/renderer';

/**
 * 项目模板列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onSkip - 页面跳转
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
  render() {
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSkip,
      onSearch,
      onSelect,
      onView,
      onGotoNewDetail,
    } = this.props;
    const prefix = 'appm.projectTemplate.model.projectTemplate';
    const columns = [
      {
        title: intl.get(`${prefix}.templateCode`).d('模板编码'),
        dataIndex: 'proTemplateCode',
        width: 150,
        render: (value, record) => <a onClick={() => onSkip(record)}>{value}</a>,
      },
      {
        title: intl.get(`${prefix}.templateName`).d('模板名称'),
        dataIndex: 'proTemplateName',
      },
      {
        title: intl.get(`${prefix}.projectType`).d('项目类型'),
        dataIndex: 'proTypeName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.approveStatus`).d('审批状态'),
        dataIndex: 'approveStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.versionNumber`).d('当前版本'),
        dataIndex: 'versionNumber',
        width: 100,
        render: val => `V${val}`,
      },
      {
        title: intl.get(`${prefix}.templateStatus`).d('模板状态'),
        dataIndex: 'proTemplateStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.versionEffect`).d('版本生效日期'),
        dataIndex: 'versionEffect',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 200,
        fixed: 'right',
        render: (_, record) => (
          <span className="action-link">
            <a onClick={() => onGotoNewDetail(record)}>
              {intl.get(`${prefix}.edit`).d('编辑新版本')}
            </a>
            <a onClick={() => onView(record)}>{intl.get(`${prefix}.view`).d('查看历史版本')}</a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="proTemplateId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelect,
          getCheckboxProps: record => ({
            disabled: record.proTemplateStatus !== 'PRESET',
          }),
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
