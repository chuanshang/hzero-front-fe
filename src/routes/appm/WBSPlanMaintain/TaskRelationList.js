import React, { PureComponent } from 'react';
import { Form, Select, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import Checkbox from 'components/Checkbox';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { yesOrNoRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';

/**
 * 任务数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class TaskRelationList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tempDataSource: [],
    };
  }
  /**
   * 提前时间和延迟时间只能存在一个
   */
  @Bind()
  checkTimeUnique(rule, value, callback, record) {
    const { getFieldValue } = record.$form;
    switch (rule.field) {
      case 'delayTime':
        if (getFieldValue('advanceTime') && value > 0) {
          callback(intl.get('appm.common.view.validation.advanceTime.unique').d('提前时间已存在'));
        } else {
          callback();
        }
        break;
      case 'advanceTime':
        if (getFieldValue('delayTime') && value > 0) {
          callback(intl.get('appm.common.view.validation.delayTime.unique').d('延迟时间已存在'));
        } else {
          callback();
        }
        break;
      default:
        callback();
    }
  }
  /**
   * 主要关系只能有一个
   */
  @Bind()
  checkPrimaryFlagUnique(rule, value, callback, record) {
    const { tempDataSource } = this.state;
    const { dataSource } = this.props;
    const newList = [...dataSource, ...tempDataSource].filter(
      item => item.wbsRelId !== record.wbsRelId
    );
    if (!isEmpty(newList)) {
      newList.forEach(element => {
        if (element.primaryFlag === 1 && value === 1) {
          callback(intl.get('appm.common.view.validation.primaryFlag.unique').d('主要关系已存在'));
        }
      });
      callback();
    } else {
      callback();
    }
  }
  @Bind()
  handleRelationChange(e, record) {
    const { dataSource } = this.props;
    const temp = dataSource.map(item =>
      item.wbsRelId === record.wbsRelId ? { ...item, primaryFlag: e.target.checked } : item
    );
    this.setState({ tempDataSource: temp });
  }
  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const {
      tenantId,
      wbsStatus,
      wbsHeaderId,
      wbsLineId,
      loading,
      dataSource,
      onEditLine,
      onCleanLine,
      relationTypeMap,
      selectedRowKeys,
      onSelectRow,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.preTask`).d('前置任务'),
        dataIndex: 'preTaskName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('beforeLineId', {
                initialValue: record.beforeLineId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.preTask`).d('前置任务'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="APPM.WBS.PRE_TASK"
                  queryParams={{
                    wbsHeaderId,
                    wbsLineId,
                    tenantId,
                  }}
                  textValue={record.preTaskName}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.relationType`).d('关系类型'),
        dataIndex: 'relationTypeMeaning',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('relationTypeCode', {
                initialValue: record.relationTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.relationTypeCode`).d('关系类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {relationTypeMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.delayTime`).d('延迟时间'),
        dataIndex: 'delayTime',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('delayTime', {
                initialValue: val,
                rules: [
                  {
                    validator: (rule, value, callback) =>
                      this.checkTimeUnique(rule, value, callback, record),
                  },
                ],
              })(<InputNumber min={0} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.advanceTime`).d('提前时间'),
        dataIndex: 'advanceTime',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('advanceTime', {
                initialValue: val,
                rules: [
                  {
                    validator: (rule, value, callback) =>
                      this.checkTimeUnique(rule, value, callback, record),
                  },
                ],
              })(<InputNumber min={0} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.primaryFlag`).d('主要关系'),
        dataIndex: 'primaryFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('primaryFlag', {
                initialValue: val,
                valuePropName: 'checked',
                rules: [
                  {
                    validator: (rule, value, callback) =>
                      this.checkPrimaryFlagUnique(rule, value, callback, record),
                  },
                ],
              })(<Checkbox onChange={e => this.handleRelationChange(e, record)} />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      wbsStatus === 'PRESET'
        ? {
            title: intl.get('hzero.common.button.action').d('操作'),
            width: 100,
            render: (val, record) =>
              record._status === 'create' ? (
                <a onClick={() => onCleanLine(record)}>
                  {intl.get('hzero.common.button.clean').d('清除')}
                </a>
              ) : record._status === 'update' ? (
                <a onClick={() => onEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              ) : (
                <a onClick={() => onEditLine(record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              ),
          }
        : {},
    ];
    return (
      <EditTable
        bordered
        rowKey="wbsRelId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowSelection={
          wbsStatus === 'PRESET'
            ? {
                selectedRowKeys,
                onChange: onSelectRow,
              }
            : {}
        }
      />
    );
  }
}
export default TaskRelationList;
