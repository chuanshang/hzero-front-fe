/**
 * 资产目录数据列表
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
import React, { PureComponent } from 'react';
import { Form, Input, Select, InputNumber } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import styles from './index.less';

class ListTable extends PureComponent {
  render() {
    const {
      tenantId,
      loading,
      dataSource,
      expandedRowKeys,
      depreciationTypeMap,
      accountTypeMap,
      onEditLine,
      onAddLine,
      onForbidLine,
      onEnabledLine,
      onExpand,
      onCancelLine,
    } = this.props;
    const modelPrompt = 'afam.assetCatalog.model.assetCatalog';
    const columns = [
      {
        title: intl.get(`${modelPrompt}.catalogName`).d('名称'),
        dataIndex: 'catalogName',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('catalogName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.catalogName`).d('名称'),
                    }),
                  },
                  {
                    max: 60,
                    message: intl.get('hzero.common.validation.max', {
                      max: 60,
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
        title: intl.get(`${modelPrompt}.catalogCode`).d('代码'),
        dataIndex: 'catalogCode',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('catalogCode', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.productCategory`).d('产品类别'),
        dataIndex: 'productCategoryId',
        width: 150,
        render: (value, record) => {
          return ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productCategoryId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.productCategory`).d('产品类别'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AAFM.ASSET_CLASS"
                  queryParams={{ tenantId }}
                  textValue={record.productCategoryMeaning}
                />
              )}
            </Form.Item>
          ) : (
            record.productCategoryMeaning
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.residualValueRate`).d('残值率(%)'),
        dataIndex: 'residualValueRate',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('residualValueRate', {
                initialValue: value,
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.depreciationMonth`).d('折旧月份'),
        dataIndex: 'depreciationMonth',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('depreciationMonth', {
                initialValue: value,
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.depreciationType`).d('折旧类型'),
        dataIndex: 'depreciationTypeCode',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('depreciationTypeCode', {
                initialValue: value,
              })(
                <Select>
                  {depreciationTypeMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.depreciationTypeCodeMeaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.accountType`).d('资产入账会计科目类型'),
        dataIndex: 'accountTypeCode',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('accountTypeCode', {
                initialValue: value,
              })(
                <Select>
                  {accountTypeMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.accountTypeCodeMeaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('启用'),
        dataIndex: 'enabledFlag',
        width: 80,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: value,
              })(<Switch disabled />)}
            </Form.Item>
          ) : (
            yesOrNoRender(value)
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: value,
              })(<Input.TextArea />)}
            </Form.Item>
          ) : (
            value
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
                {intl.get('hzero.common.status.disable').d('禁用当前及下级')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
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
        rowKey="assetCatalogId"
        loading={loading}
        onExpand={onExpand}
        className={styles['asset-catalog-show']}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ListTable;
