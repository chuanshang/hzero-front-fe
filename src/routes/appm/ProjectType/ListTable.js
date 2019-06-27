import React, { PureComponent } from 'react';
import { Form, Input } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import styles from './index.less';

/**
 * 项目类型树形列表
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
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      expandedRowKeys,
      onEditLine,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
      onCancelLine,
      tenantId,
    } = this.props;
    const prefix = 'appm.projectType.model.projectType';
    const columns = [
      {
        title: intl.get(`${prefix}.typeName`).d('项目类型'),
        dataIndex: 'proTypeName',
        width: 300,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('proTypeName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.typeName`).d('项目类型'),
                    }),
                  },
                ],
              })(<Input trim disabled={record._status === 'update'} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.typeCode`).d('代码'),
        dataIndex: 'proTypeCode',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('proTypeCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.typeCode`).d('代码'),
                    }),
                  },
                  {
                    max: 30,
                    message: intl.get('hzero.common.validation.max', {
                      max: 30,
                    }),
                  },
                ],
              })(<Input trim inputChinese={false} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.codeRule`).d('编号规则'),
        dataIndex: 'codeRule',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('codeRule', {
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
        title: intl.get(`${prefix}.precodeRule`).d('预编号规则'),
        dataIndex: 'precodeRuleId',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('precodeRuleId', {
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
        title: intl.get(`${prefix}.description`).d('说明'),
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
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        align: 'center',
        width: 80,
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
        align: 'center',
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
        rowKey="proTypeId"
        loading={loading}
        onExpand={onExpand}
        className={styles['amdm-product-show']}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}

export default ListTable;
