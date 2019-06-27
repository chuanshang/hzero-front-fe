import React, { PureComponent } from 'react';
import { Row, Col, Spin, Form, Input, Select, DatePicker, InputNumber } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';

class ListTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleteFlag: false, // 删除标记
    };
  }
  @Bind()
  handleDelete(record) {
    this.setState({ deleteFlag: true, wbsLineId: record.wbsLineId });
    this.props.onDelete(record);
  }

  /**
   * 负责人、负责角色变化时
   */
  @Bind()
  handleSelectChange(val, record, flag) {
    const { otherRoles, otherUsers } = this.props;
    let list = [];
    switch (flag) {
      case 'principalRole':
        {
          list = otherRoles.filter(item => item.value === Number(val));
          const principalPersonId = list[0].staffId;
          record.$form.setFieldsValue({ principalPersonId: String(principalPersonId) });
        }
        break;
      case 'principalPerson':
        {
          list = otherUsers.filter(item => item.value === Number(val));
          const principalRoleId = list[0].proRoleId;
          record.$form.setFieldsValue({ principalRoleId: String(principalRoleId) });
        }
        break;
      default:
    }
  }
  /**
   * 处理关系
   */
  handleRelation(record) {
    const { levelMap } = this.props;
    const { projectWbsRelsList = [] } = record;
    let key = {};
    if (!isEmpty(projectWbsRelsList)) {
      // 排序，主要关系移到第一位
      for (let i = 0; i < projectWbsRelsList.length; i++) {
        if (projectWbsRelsList[i].primaryFlag === 1) {
          key = projectWbsRelsList[i];
          projectWbsRelsList.splice(i, 1);
          projectWbsRelsList.unshift(key);
        }
      }
      const relation = [];
      projectWbsRelsList.forEach(item => {
        const list = levelMap[item.beforeLineId];
        let levelNumber = '';
        if (!isEmpty(list)) {
          levelNumber = list.toString().replace(/,/g, '.');
        }
        relation.push(`${levelNumber}${item.relationTypeCode}`);
      });
      return relation.toString();
    }
  }

  /**
   * 根据工期和开始日期设置结束日期
   */
  @Bind()
  handleSetEndDate(val, record, flag) {
    const { uomCode } = this.props;
    const { startDate, limitTime, taskTypeCode } = record.$form.getFieldsValue();
    if (taskTypeCode !== 'MILESTONE') {
      switch (flag) {
        case 'startDate': {
          if (!isUndefined(limitTime) && !isNull(val)) {
            if (uomCode === 'HOUR') {
              record.$form.setFieldsValue({
                endDate: moment(val).add(parseInt(limitTime / 24, 10), 'days'),
              });
            } else {
              record.$form.setFieldsValue({
                endDate: moment(val).add(limitTime, 'days'),
              });
            }
          }
          break;
        }
        case 'limitTime': {
          if (!isNull(startDate)) {
            if (uomCode === 'HOUR') {
              record.$form.setFieldsValue({
                endDate: moment(startDate).add(parseInt(val / 24, 10), 'days'),
              });
            } else {
              record.$form.setFieldsValue({
                endDate: moment(startDate).add(val, 'days'),
              });
            }
          }
          break;
        }
        default:
      }
    }
  }

  /**
   * 根据结束日期和开始日期设置工期
   */
  @Bind()
  handleSetLimitTime(val, record) {
    const { uomCode } = this.props;
    const { startDate, taskTypeCode } = record.$form.getFieldsValue();
    if (taskTypeCode !== 'MILESTONE') {
      if (!isNull(startDate) && !isNull(val)) {
        if (uomCode === 'HOUR') {
          record.$form.setFieldsValue({
            limitTime: val.diff(startDate, 'hour'),
          });
        } else {
          record.$form.setFieldsValue({
            limitTime: val.diff(startDate, 'day'),
          });
        }
      }
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      wbsStatus,
      uomName,
      dataSource,
      expandedRowKeys,
      levelMap,
      taskTypeMap,
      priorityMap,
      riskLevelMap,
      otherRoles,
      otherUsers,
      limitDate,
      onEdit,
      onShowScheduleModal,
      onShowRelationModal,
      onAddTask,
      onExpand,
      onCancel,
      onAddTopTask,
      onEditTopTask,
    } = this.props;
    const { deleteFlag, wbsLineId } = this.state;
    const { minStartDate, maxEndDate } = limitDate;
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const columns = [
      {
        title: intl.get(`${prefix}`).d('层级编号'),
        dataIndex: 'levelPath',
        render: (_, record) => {
          const list = levelMap[record.wbsLineId];
          let levelNumber = '';
          if (!isEmpty(list)) {
            levelNumber = list.toString().replace(/,/g, '.');
          }
          return <span>{levelNumber}</span>;
        },
      },
      {
        title: intl.get(`${prefix}.taskName`).d('任务名称'),
        dataIndex: 'taskName',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('taskName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskName`).d('任务名称'),
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
        title: intl.get(`${prefix}.taskType`).d('任务类型'),
        dataIndex: 'taskTypeMeaning',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('taskTypeCode', {
                initialValue: record.taskTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.taskType`).d('任务类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {taskTypeMap.map(i => (
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
        title: intl.get(`${prefix}.principalRole`).d('负责角色'),
        dataIndex: 'principalRoleId',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('principalRoleId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.principalRole`).d('负责角色'),
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: 120 }}
                  onChange={val => this.handleSelectChange(val, record, 'principalRole')}
                >
                  {otherRoles.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.principalRoleName
          ),
      },
      {
        title: intl.get(`${prefix}.principalPerson`).d('负责人'),
        dataIndex: 'principalPersonName',
        width: 150,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('principalPersonId', {
                initialValue: record.principalPersonId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.principalPerson`).d('负责人'),
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: 120 }}
                  onChange={val => this.handleSelectChange(val, record, 'principalPerson')}
                >
                  {otherUsers.map(i => (
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
        title: intl.get(`${prefix}.limitTime`).d(`工期 (${uomName})`),
        dataIndex: 'limitTime',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('limitTime', {
                initialValue: value,
                rules: [
                  {
                    required:
                      record.$form.getFieldValue('taskTypeCode') === 'PROJECT_MISSION' ||
                      record.wbsLineId === 0,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.limitTime`).d('工期'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  disabled={
                    record.$form.getFieldValue('taskTypeCode') !== 'PROJECT_MISSION' &&
                    record.wbsLineId !== 0
                  }
                  onChange={val => this.handleSetEndDate(val, record, 'limitTime')}
                />
              )}
            </Form.Item>
          ) : record.taskTypeCode !== 'MILESTONE' ? (
            value
          ) : (
            ''
          ),
      },
      {
        title: intl.get(`${prefix}.startDate`).d('开始日期'),
        dataIndex: 'startDate',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('startDate', {
                initialValue: value ? moment(value, getDateFormat()) : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.startDate`).d('开始日期'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  format={getDateFormat()}
                  style={{ width: '100%' }}
                  placeholder=""
                  onChange={val => this.handleSetEndDate(val, record, 'startDate')}
                  disabledDate={currentDate =>
                    record.wbsLineId !== 0
                      ? moment(dataSource[0].endDate).isBefore(currentDate, 'day') ||
                        moment(dataSource[0].startDate).isAfter(currentDate, 'day') ||
                        (record.$form.getFieldValue('endDate') &&
                          moment(record.$form.getFieldValue('endDate')).isBefore(
                            currentDate,
                            'day'
                          ))
                      : (!isUndefined(minStartDate) &&
                          record.$form.getFieldValue('startDate') &&
                          moment(currentDate).isAfter(minStartDate, 'day')) ||
                        (record.$form.getFieldValue('endDate') &&
                          moment(record.$form.getFieldValue('endDate')).isBefore(
                            currentDate,
                            'day'
                          ))
                  }
                />
              )}
            </Form.Item>
          ) : (
            dateRender(value)
          ),
      },
      {
        title: intl.get(`${prefix}.endDate`).d('结束日期'),
        dataIndex: 'endDate',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('endDate', {
                initialValue: value ? moment(value, getDateFormat()) : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.endDate`).d('结束日期'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  format={getDateFormat()}
                  style={{ width: '100%' }}
                  placeholder=""
                  onChange={val => this.handleSetLimitTime(val, record)}
                  disabledDate={currentDate =>
                    record.wbsLineId !== 0
                      ? moment(dataSource[0].endDate).isBefore(currentDate, 'day') ||
                        moment(dataSource[0].startDate).isAfter(currentDate, 'day') ||
                        (record.$form.getFieldValue('startDate') &&
                          moment(record.$form.getFieldValue('startDate')).isAfter(
                            currentDate,
                            'day'
                          ))
                      : (!isUndefined(maxEndDate) &&
                          record.$form.getFieldValue('endDate') &&
                          moment(currentDate).isBefore(maxEndDate, 'day')) ||
                        (record.$form.getFieldValue('startDate') &&
                          moment(record.$form.getFieldValue('startDate')).isAfter(
                            currentDate,
                            'day'
                          ))
                  }
                />
              )}
            </Form.Item>
          ) : (
            dateRender(value)
          ),
      },
      {
        title: intl.get(`${prefix}.priority`).d('优先级'),
        dataIndex: 'priorityMeaning',
        width: 80,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('priorityCode', {
                initialValue: record.priorityCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.priority`).d('优先级'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {priorityMap.map(i => (
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
        title: intl.get(`${prefix}.approvedScheduleRate`).d('进度'),
        dataIndex: 'approvedScheduleRate',
        width: 80,
        render: (value, record) =>
          record.wbsLineId !== 0 ? (
            <a onClick={() => onShowScheduleModal(record)}>{`${value}%`}</a>
          ) : (
            `${value}%`
          ),
      },
      {
        title: intl.get(`${prefix}.riskLevel`).d('风险等级'),
        dataIndex: 'riskLevelMeaning',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.wbsLineId !== 0 ? (
            <Form.Item>
              {record.$form.getFieldDecorator('riskLevel', {
                initialValue: record.riskLevel,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.riskLevel`).d('风险等级'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {riskLevelMap.map(i => (
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
        title: intl.get(`${prefix}.taskRelation`).d('任务关系'),
        dataIndex: 'taskRelation',
        width: 120,
        render: (_, record) =>
          record.wbsLineId !== 0 ? (
            <a onClick={() => onShowRelationModal(record)}>{this.handleRelation(record)}</a>
          ) : (
            ''
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: wbsStatus === 'PRESET' ? 200 : 80,
        fixed: 'right',
        dataIndex: 'operate',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancel(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' && record.wbsLineId === 0 ? (
            <a onClick={() => onEditTopTask(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : record.wbsLineId === 0 ? (
            <span className="action-link">
              <a
                style={{ display: wbsStatus !== 'PRESET' ? 'none' : 'inline' }}
                onClick={() => onEditTopTask(record, true)}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a
                style={{ display: wbsStatus !== 'PRESET' ? 'none' : 'inline' }}
                onClick={() => onAddTopTask()}
              >
                {intl.get('appm.common.button.addTop').d('新增顶层')}
              </a>
            </span>
          ) : (
            <Row>
              <Col span={7}>
                <a onClick={() => onEdit(record)}>
                  {wbsStatus === 'PRESET'
                    ? intl.get('hzero.common.button.edit').d('编辑')
                    : intl.get('hzero.common.button.view').d('查看')}
                </a>
              </Col>
              <Col span={10}>
                <a
                  style={{ display: wbsStatus !== 'PRESET' ? 'none' : 'block' }}
                  onClick={() => onAddTask(record)}
                >
                  {intl.get('appm.common.button.addNext').d('新增下级')}
                </a>
              </Col>
              <Col span={7}>
                <a
                  style={{ display: wbsStatus !== 'PRESET' ? 'none' : 'block' }}
                  onClick={() => this.handleDelete(record)}
                >
                  <Spin
                    size="small"
                    spinning={deleteFlag && wbsLineId === val ? loading.deleteList : false}
                  >
                    {intl.get('hzero.common.status.delete').d('删除')}
                  </Spin>
                </a>
              </Col>
            </Row>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey="wbsLineId"
        loading={loading.fetchListLoading}
        onExpand={onExpand}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        // scroll={{ x: wbsStatus === 'PRESET' ? 1450 : 1200 }}
      />
    );
  }
}
export default ListTable;
