import React, { Component } from 'react';
import { Input, Form, InputNumber, DatePicker } from 'hzero-ui';
import { yesOrNoRender, dateRender } from 'utils/renderer';
import { getDateFormat } from 'utils/utils';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Switch from 'components/Switch';
import Lov from 'components/Lov';
import styles from './index.less';

/**
 * BOM展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class DetailList extends Component {
  /**
   * @param {*} value 当前值
   * @param {*} lovRecord lov选中的行
   * @param {*} record 行的值
   */
  @Bind()
  handleLovOnChange(value, lovRecord, record) {
    const { dataSource } = this.props;
    const flag = this.getMenuName(value, dataSource);
    if (flag) {
      record.$form.getFieldDecorator('itemId');
      record.$form.getFieldDecorator('tenantId');
      record.$form.setFieldsValue({
        itemNum: lovRecord.itemNum,
        tenantId: lovRecord.tenantId,
      });
    } else {
      record.$form.setFieldsValue({
        itemName: '',
        itemNum: '',
      });
      const message = '所录入BOM行项目与已存在行项目存在重复！';
      notification.warning({ message });
    }
  }

  @Bind()
  getMenuName(key, menus) {
    let flag = true;
    for (const value of menus) {
      if (value.children) {
        this.getMenuName(key, value.children);
      }
      if (value.itemId === key) {
        flag = false;
      }
    }
    return flag;
  }

  render() {
    const {
      loading,
      tenantId,
      dataSource,
      isNew,
      editFlag,
      expandedRowKeys,
      onEditLine,
      onAddLine,
      onDeleteLine,
      onExpand,
      onCancelLine,
    } = this.props;
    const modelPrompt = 'amtc.bom.model.bom';
    const displayFlag = !isNew || editFlag;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.item`).d('产品'),
        dataIndex: 'itemId',
        width: 300,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemId', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.maintSiteId`).d('产品'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="AMMT.INVENTORY_ITEMS"
                  textValue={record.itemName}
                  queryParams={{ organizationId: tenantId }}
                  onChange={(value, lovRecord) => this.handleLovOnChange(value, lovRecord, record)}
                />
              )}
            </Form.Item>
          ) : (
            record.itemName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.itemNum`).d('部件编号'),
        dataIndex: 'itemNum',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('itemNum', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.quantity`).d('数量'),
        dataIndex: 'quantity',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('quantity', {
                initialValue: val,
              })(<InputNumber min={0} precision={2} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.effectiveStartDate`).d('生效日期'),
        dataIndex: 'effectiveStartDate',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('effectiveStartDate', {
                initialValue: value ? moment(value, getDateFormat()) : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.effectiveStartDate`).d('开始日期'),
                    }),
                  },
                ],
              })(<DatePicker format={getDateFormat()} style={{ width: '100%' }} placeholder="" />)}
            </Form.Item>
          ) : (
            dateRender(value)
          ),
      },
      {
        title: intl.get(`${modelPrompt}.effectiveEndDate`).d('失效日期'),
        dataIndex: 'effectiveEndDate',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('effectiveEndDate', {
                initialValue: value ? moment(value, getDateFormat()) : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.effectiveEndDate`).d('结束日期'),
                    }),
                  },
                ],
              })(<DatePicker format={getDateFormat()} style={{ width: '100%' }} placeholder="" />)}
            </Form.Item>
          ) : (
            dateRender(value)
          ),
      },
      {
        title: intl.get(`${modelPrompt}.extraConsumableFlag`).d('是耗材（而不是组件）？'),
        dataIndex: 'extraConsumableFlag',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('extraConsumableFlag', {
                initialValue: val,
              })(<Switch />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 150,
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
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : displayFlag ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onAddLine(record)}>
                {intl.get('hzero.common.button.add.sub').d('新增下级')}
              </a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.status.delete').d('删除')}
              </a>
            </span>
          ) : (
            ''
          ),
      },
    ];
    return (
      <EditTable
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey="bomLineId"
        loading={loading}
        onExpand={onExpand}
        columns={columns}
        dataSource={dataSource}
        className={styles['amtc-detaliList-show']}
        pagination={false}
      />
    );
  }
}
export default DetailList;
