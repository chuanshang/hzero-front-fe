import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isNumber } from 'lodash';
import moment from 'moment';

import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';
import { getDateFormat } from 'utils/utils';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import intl from 'utils/intl';

const { MonthPicker } = DatePicker;

/**
 * 数据列表组件
 * @export
 * @class ListTable
 * @extends {PureComponent}
 */
export default class ListTable extends PureComponent {
  /**
   * 设置periodName
   * @param {Object} record 当前行
   * @param {Object} e 目标组件对象
   * @param {String} name 当前改变值的字段
   * @memberof ListTable
   */
  @Bind()
  changeFields(record, e, name) {
    const { $form } = record;
    const { getFieldValue, setFieldsValue } = $form;
    let periodYear = '';
    let periodSeq = '';
    if (name === 'periodYear') {
      // 当periodYear改变时
      periodYear = e.target.value;
      periodSeq = getFieldValue('periodSeq');
    } else if (name === 'periodSeq') {
      // 当periodSeq改变时
      periodYear = getFieldValue('periodYear');
      periodSeq = e.target.value;
    }
    if (!isEmpty(periodSeq) && !isEmpty(periodYear.toString())) {
      const periodName = `${periodYear}-${periodSeq}`;
      setFieldsValue({ periodName });
    }
  }

  /**
   * 设置月份的第一天和最后一天
   * @param {*} val 当前组件改变的值
   * @param {*} preValue 当前组件改变值之前的值
   * @param {Object} allValue 当前$form里所有的表单值
   * @param {String} flag 判断改变的值是 periodStartDate 还是 PeriodEndDate
   * @returns
   * @memberof ListTable
   */
  @Bind()
  changeDate(val, preValue, allValue, flag) {
    if (isEmpty(val)) {
      return '';
    } else if (flag === 'start') {
      return moment(val).startOf('month');
    } else if (flag === 'end') {
      return moment(val).endOf('month');
    }
  }

  /**
   * 自定义校验信息
   * @param {*} rule
   * @param {*} value 当前改变的值
   * @param {Function} callback 回调
   * @memberof ListTable
   */
  checkContent(rule, value, callback) {
    const num = Number(value);
    if (isNumber(num) && num.toString().length === 4) {
      // 当前输入的值为数字且长度为四位
      callback();
    } else {
      callback(
        intl.get('appa.budgetPeriod.view.massage.callback.periodYear').d('请输入四位数字的年份')
      );
    }
  }

  /**
   * render
   * @returns
   * @memberof ListTable
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onCleanLine,
      onEditLine,
      onSearch,
      onEnabledLine,
      onForbidLine,
    } = this.props;
    const prefix = 'appa.budgetPeriod.model.budgetPeriod';
    const dateFormat = getDateFormat();
    const columns = [
      {
        title: intl.get(`${prefix}.periodName`).d('名称'),
        dataIndex: 'periodName',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('periodName', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.periodYear`).d('年度'),
        dataIndex: 'periodYear',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('periodYear', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.periodYear`).d('年度'),
                    }),
                  },
                  {
                    validator: (rule, val, callback) =>
                      this.checkContent.bind(this)(rule, val, callback),
                  },
                ],
              })(<Input onChange={e => this.changeFields(record, e, 'periodYear')} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.periodSeq`).d('序号'),
        dataIndex: 'periodSeq',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('periodSeq', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.periodSeq`).d('序号'),
                    }),
                  },
                  {
                    max: 30,
                    message: intl.get('hzero.common.validation.maxLength', {
                      max: 30,
                    }),
                  },
                ],
              })(<Input onChange={e => this.changeFields(record, e, 'periodSeq')} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.periodStartDate`).d('开始时间'),
        dataIndex: 'periodStartDate',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('periodStartDate', {
                initialValue: !isEmpty(value) ? moment(value) : '',
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.periodStartDate`).d('开始时间'),
                    }),
                  },
                ],
                normalize: (val, preValue, allValue) =>
                  this.changeDate(val, preValue, allValue, 'start'),
              })(
                <MonthPicker
                  format={dateFormat}
                  disabledDate={currentDate =>
                    moment(record.$form.getFieldValue('periodEndDate'))
                      .endOf('month')
                      .isBefore(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          ) : (
            moment(value).format(dateFormat)
          ),
      },
      {
        title: intl.get(`${prefix}.periodEndDate`).d('结束时间'),
        dataIndex: 'periodEndDate',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('periodEndDate', {
                initialValue: !isEmpty(value) ? moment(value) : '',
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.periodEndDate`).d('结束时间'),
                    }),
                  },
                ],
                normalize: (val, preValue, allValue) =>
                  this.changeDate(val, preValue, allValue, 'end'),
              })(
                <MonthPicker
                  format={dateFormat}
                  disabledDate={currentDate =>
                    moment(record.$form.getFieldValue('periodStartDate'))
                      .startOf('month')
                      .isAfter(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          ) : (
            moment(value).format(dateFormat)
          ),
      },
      {
        title: intl.get(`${prefix}.fillBudgetFlag`).d('可填写预算'),
        dataIndex: 'fillBudgetFlag',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fillBudgetFlag', {
                initialValue: value,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            yesOrNoRender(value)
          ),
      },
      {
        title: intl.get(`${prefix}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 80,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 120,
        render: (value, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => onEditLine(record, false)}>
              {intl.get('hzero.common.status.cancel').d('取消')}
            </a>
          ) : record.enabledFlag ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <Popconfirm
                title={intl.get(`${prefix}.disabledTitle`).d('是否禁用')}
                onConfirm={() => onForbidLine(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.sure').d('取消')}
              >
                <a>{intl.get('hzero.common.status.disable').d('禁用')}</a>
              </Popconfirm>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <Popconfirm
                title={intl.get(`${prefix}.enabledTitle`).d('是否启用')}
                onConfirm={() => onEnabledLine(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.sure').d('取消')}
              >
                <a>{intl.get('hzero.common.status.enable').d('启用')}</a>
              </Popconfirm>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        columns={columns}
        rowKey="periodId"
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
