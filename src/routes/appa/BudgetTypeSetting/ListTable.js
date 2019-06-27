import React, { PureComponent } from 'react';
import { Form, Input, Select, InputNumber, Popconfirm } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import { isNull } from 'lodash';
import { Bind } from 'lodash-decorators';
import { getEditTableData } from 'utils/utils';
import { yesOrNoRender, enableRender } from 'utils/renderer';
import EditTable from 'components/EditTable';

/**
 * 项目角色列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onCleanLine - 清除行
 * @reactProps {Function} onEditLine - 编辑行
 * @reactProps {Function} onSetPermission - 权限维护
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
  constructor(props) {
    super(props);
    this.state = {
      selectedPreBudget: [], // 已选择的前序预算
    };
  }

  /**
   * 行 - 细化单位change
   * @param {Object} val - 当前值
   * @param {Object} record - 当前行对象
   */
  onUomChange(val, record) {
    const { uomValueList } = this.props;
    uomValueList.map(i => {
      if (i.meaning === val) {
        let temp = '';
        temp = i.value;
        record.$form.setFieldsValue({
          uomMultiple: temp,
        });
      }
      return i;
    });
  }

  /**
   * 前序预算类型改变时
   */
  @Bind()
  handleSelectChange(val, record) {
    const { orderBudgetTypes } = this.props;
    const temp = orderBudgetTypes.filter(item => item.value === Number(val));
    if (val) {
      record.$form.setFieldsValue({
        thinWbsFlag: temp[0].thinWbsFlag,
        thinBudgetItemFlag: temp[0].thinBudgetItemFlag,
        thinProductFlag: temp[0].thinProductFlag,
        thinAssetFlag: temp[0].thinAssetFlag,
      });
    }
  }
  /**
   * 缓存已选择前序预算
   */
  handleSelectedPreBudget() {
    const { dataSource } = this.props;
    const temps = getEditTableData(dataSource);
    const preBudgets = [];
    temps.forEach(item => {
      if (!isNull(item.preorderBudgetTypeId)) {
        preBudgets.push(Number(item.preorderBudgetTypeId));
      }
    });
    dataSource.forEach(item => {
      if (!isNull(item.preorderBudgetTypeId)) {
        preBudgets.push(item.preorderBudgetTypeId);
      }
    });
    const list = Array.from(new Set(preBudgets)); // 去重
    this.setState({ selectedPreBudget: list });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      orderBudgetTypes,
      uomValueList,
      controlRequirements,
      controlTypes,
      onCancelLine,
      onEditLine,
      onForbidLine,
      onEnabledLine,
    } = this.props;
    const { selectedPreBudget } = this.state;
    const prefix = 'appa.budgetTypeSetting.model.budgetTypeSetting';
    const columns = [
      {
        title: intl.get(`${prefix}.budgetTypeName`).d('预算类型'),
        dataIndex: 'budgetTypeName',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('budgetTypeName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.budgetTypeName`).d('预算类型'),
                    }),
                  },
                  {
                    max: 60,
                    message: intl.get('hzero.common.validation.max', {
                      max: 60,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.description`).d('用途说明'),
        dataIndex: 'description',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.description`).d('用途说明'),
                    }),
                  },
                  {
                    max: 240,
                    message: intl.get('hzero.common.validation.max', {
                      max: 240,
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.preorderBudgetType`).d('前序预算类型'),
        dataIndex: 'preorderBudgetTypeId',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('preorderBudgetTypeId', {
                initialValue: !isNull(value) ? String(value) : null,
              })(
                <Select
                  allowClear
                  style={{ width: 120 }}
                  onChange={val => this.handleSelectChange(val, record)}
                  onFocus={() => this.handleSelectedPreBudget()}
                >
                  {orderBudgetTypes
                    .filter(item => item.value !== record.budgetTypeId)
                    .filter(item => !selectedPreBudget.some(ele => ele === item.value))
                    .map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.preorderBudgetTypeMeaning
          ),
      },
      {
        title: intl.get(`${prefix}.autoCodeFlag`).d('预算行自动编号'),
        dataIndex: 'autoCodeFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('autoCodeFlag', {
                initialValue: val,
              })(<Switch />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.thinWbsFlag`).d('细化到WBS/分项任务'),
        dataIndex: 'thinWbsFlag',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('thinWbsFlag', {
                initialValue: val,
              })(
                <Switch
                  disabled={
                    record.$form.getFieldValue('thinWbsFlag') === 1 &&
                    record.$form.getFieldValue('preorderBudgetTypeId')
                  }
                />
              )}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.thinBudgetItemFlag`).d('细化到预算项类型'),
        dataIndex: 'thinBudgetItemFlag',
        width: 140,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('thinBudgetItemFlag', {
                initialValue: val,
              })(
                <Switch
                  disabled={
                    record.$form.getFieldValue('thinBudgetItemFlag') === 1 &&
                    record.$form.getFieldValue('preorderBudgetTypeId')
                  }
                />
              )}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.thinProductFlag`).d('细化到产品类别'),
        dataIndex: 'thinProductFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('thinProductFlag', {
                initialValue: val,
              })(
                <Switch
                  disabled={
                    record.$form.getFieldValue('thinProductFlag') === 1 &&
                    record.$form.getFieldValue('preorderBudgetTypeId')
                  }
                />
              )}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.thinAssetFlag`).d('细化到资产组/物料'),
        dataIndex: 'thinAssetFlag',
        width: 140,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('thinAssetFlag', {
                initialValue: val,
              })(
                <Switch
                  disabled={
                    record.$form.getFieldValue('thinAssetFlag') === 1 &&
                    record.$form.getFieldValue('preorderBudgetTypeId')
                  }
                />
              )}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.thinPeriodFlag`).d('细化到期间编制'),
        dataIndex: 'thinPeriodFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('thinPeriodFlag', {
                initialValue: val,
              })(<Switch />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.unilateralCostFlag`).d('是否按单方造价'),
        dataIndex: 'unilateralCostFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('unilateralCostFlag', {
                initialValue: val,
              })(<Switch />)}
            </Form.Item>
          ) : (
            yesOrNoRender(val)
          ),
      },
      {
        title: intl.get(`${prefix}.controlType`).d('预算控制层级'),
        dataIndex: 'controlType',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('controlType', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.controlType`).d('预算控制层级'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: 120 }}>
                  {controlTypes
                    .filter((
                      i // 关闭细化到预算项类型时，过滤掉按预算项选项
                    ) =>
                      record.$form.getFieldValue('thinBudgetItemFlag') === 0
                        ? i.value !== 'BY_BUDGET'
                        : i
                    )
                    .map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.controlTypeMeaning
          ),
      },
      {
        title: intl.get(`${prefix}.detailControlRequirement`).d('预算明细控制要求'),
        dataIndex: 'detailControlRequirement',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('detailControlRequirement', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.detailControlRequirement`).d('预算明细控制要求'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: 120 }}>
                  {controlRequirements
                    .filter((
                      i // 关闭细化到产品类别时，过滤掉按产品类别选项
                    ) =>
                      record.$form.getFieldValue('thinProductFlag') === 0
                        ? i.value !== 'BY_PRO_CATEGORY'
                        : i
                    )
                    .filter((
                      i // 关闭细化到资产组/物料时，过滤掉资产组/物料选项
                    ) =>
                      record.$form.getFieldValue('thinAssetFlag') === 0
                        ? i.value !== 'BY_ASSET_SET'
                        : i
                    )
                    .map(i => (
                      <Select.Option key={i.value}>{i.meaning}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.controlRequirementMeaning
          ),
      },
      {
        title: intl.get(`${prefix}.Uom`).d('细化单位'),
        dataIndex: 'uomName',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.uomName`).d('细化单位'),
                    }),
                  },
                ],
              })(
                <Select style={{ width: 100 }} onChange={val => this.onUomChange(val, record)}>
                  {uomValueList.map(i => (
                    <Select.Option key={i.meaning}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.uomName
          ),
      },
      {
        title: intl.get(`${prefix}.uomMultiple`).d('单位倍数'),
        dataIndex: 'uomMultiple',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomMultiple', {
                initialValue: value,
              })(<InputNumber disabled allowThousandth />)}
            </Form.Item>
          ) : (
            record.uomMultiple
          ),
      },
      {
        title: intl.get(`${prefix}.enabledFlag`).d('是否启用'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        fixed: 'right',
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
        scroll={{ x: 2130 }}
        rowKey="budgetTypeId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}

export default ListTable;
