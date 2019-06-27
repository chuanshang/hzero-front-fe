/*
 * @Author: QZQ  /  zhiqiang.quan@hand-china.com
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 * @Date: 2019-02-25 10:29:46
 */
import React, { PureComponent } from 'react';
import { Form, Input } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';

/**
 * 资产专业管理数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
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
    const modelPrompt = 'aafm.assetSpecialty.model.assetSpecialty';
    const { loading, dataSource, pagination, onEdit, onSearch, onHandleGoToDetail } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.assetSpecialtyName`).d('专业分类名称'),
        dataIndex: 'assetSpecialtyName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assetSpecialtyName', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            <a onClick={() => onHandleGoToDetail(record.assetSpecialtyId)}>{value}</a>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.enabledFlag').d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: value,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            enableRender(value)
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        render: (val, record) =>
          record._status === 'update' ? (
            <a onClick={() => onEdit(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => onEdit(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="assetSpecialtyId"
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
