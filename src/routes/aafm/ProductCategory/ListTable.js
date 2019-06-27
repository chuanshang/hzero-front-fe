import React, { PureComponent } from 'react';
import { Form, Input } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import styles from './index.less';

/**
 * 资产组数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
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
  render() {
    const {
      loading,
      tenantId,
      dataSource,
      expandedRowKeys,
      onEditLine,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
      onCancelLine,
    } = this.props;
    const modelPrompt = 'aafm.productCategory.model.productCategory';
    const columns = [
      {
        title: intl.get(`aafm.common.model.name`).d('名称'),
        dataIndex: 'productCategoryName',
        width: 300,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productCategoryName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`aafm.common.model.name`).d('名称'),
                    }),
                  },
                ],
              })(<Input disabled={record._status === 'update'} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.code`).d('代码'),
        dataIndex: 'productCategoryCode',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productCategoryCode', {
                initialValue: value,
              })(<Input trim inputChinese={false} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.codeRule`).d('编号规则'),
        dataIndex: 'codeRuleId',
        width: 170,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('codeRuleId', {
                initialValue: val,
              })(
                <Lov
                  code="AMDM.CODE_RULE"
                  textValue={val}
                  queryParams={{ organizationId: tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('全称'),
        dataIndex: 'categoryDescription',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('categoryDescription', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: value,
              })(<Checkbox disabled={record._status === 'update'} />)}
            </Form.Item>
          ) : (
            enableRender(value)
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 200,
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
              <a onClick={() => onForbidLine(record)}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a style={{ color: '#F04134' }}>
                {intl.get('hzero.common.status.disable').d('禁用')}
              </a>
              <a onClick={() => onEnabledLine(record)}>
                {intl.get('hzero.common.status.enable').d('启用')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey="productCategoryId"
        loading={loading}
        onExpand={onExpand}
        className={styles['aafm-product-show']}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ListTable;
