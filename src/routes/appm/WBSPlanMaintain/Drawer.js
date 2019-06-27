import React, { PureComponent } from 'react';
import {
  Form,
  Select,
  Modal,
  Input,
  InputNumber,
  Tabs,
  Row,
  Col,
  Button,
  Spin,
  DatePicker,
} from 'hzero-ui';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isEmpty, isFunction, isNull } from 'lodash';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';
import TaskListTable from './TaskListTable';
import TaskRelationList from './TaskRelationList';

/**
 * WBS计划明细信息变更
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @reactProps {Function} onCancel - 抽屉取消操作
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */

@Form.create({ fieldNameProp: null })
class Drawer extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      tabTag: 'basic',
    };
  }
  /**
   * 组件属性定义
   */
  static propTypes = {
    anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };
  /**
   * 组件属性默认值设置
   */
  static defaultProps = {
    anchor: 'left',
    title: '',
    visible: false,
    onOk: e => e,
    onCancel: e => e,
  };

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 删除任务间关系
   */
  @Bind()
  handleDelete() {
    const { onDeleteLine } = this.props;
    const { selectedRows } = this.state;
    const successFlag = onDeleteLine(selectedRows);
    if (successFlag) {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
  }

  /**
   * 确定操作
   */
  @Bind()
  saveBtn() {
    const { form, onSave, detailInfo } = this.props;
    if (onSave) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onSave({ ...detailInfo, ...values });
        }
      });
    }
  }

  /**
   * 负责人、负责角色变化时
   */
  handleSelectChange(val, flag) {
    const { otherRoles, otherUsers, form } = this.props;
    let list = [];
    switch (flag) {
      case 'principalRole':
        {
          list = otherRoles.filter(item => item.value === Number(val));
          const principalPersonId = list[0].staffId;
          form.setFieldsValue({ principalPersonId: String(principalPersonId) });
        }
        break;
      case 'principalPerson':
        {
          list = otherUsers.filter(item => item.value === Number(val));
          const principalRoleId = list[0].proRoleId;
          form.setFieldsValue({ principalRoleId: String(principalRoleId) });
        }
        break;
      default:
    }
  }

  /**
   * 参与角色、参与人变化时
   */
  handleMultiSelectChange(selectedList, flag) {
    const { otherRoles, otherUsers, form } = this.props;
    let list = [];
    switch (flag) {
      case 'otherRoles':
        {
          const tempList = [];
          selectedList.forEach(val => {
            list = otherRoles.filter(item => item.value === Number(val));
            if (list.length === 1) {
              tempList.push(String(list[0].staffId));
            }
          });
          form.setFieldsValue({ otherPerson: Array.from(new Set(tempList)) });
        }
        break;
      case 'otherPerson':
        {
          const tempList = [];
          selectedList.forEach(val => {
            list = otherUsers.filter(item => item.value === Number(val));
            if (list.length === 1) {
              tempList.push(String(list[0].proRoleId));
            }
          });
          form.setFieldsValue({ otherRoles: Array.from(new Set(tempList)) });
        }
        break;
      default:
    }
  }

  /**
   * 根据工期和开始日期设置结束日期
   */
  @Bind()
  handleSetEndDate(val, flag) {
    const { uomCode, form } = this.props;
    const { startDate, taskTypeCode, limitTime = 0 } = form.getFieldsValue();
    if (taskTypeCode === 'PROJECT_MISSION') {
      switch (flag) {
        case 'startDate': {
          if (!isNull(val)) {
            if (uomCode === 'HOUR') {
              form.setFieldsValue({
                endDate: moment(val).add(parseInt(limitTime / 24, 10), 'days'),
              });
            } else {
              form.setFieldsValue({
                endDate: moment(val).add(limitTime, 'days'),
              });
            }
          }
          break;
        }
        case 'limitTime': {
          if (uomCode === 'HOUR') {
            form.setFieldsValue({
              endDate: moment(startDate).add(parseInt(val / 24, 10), 'days'),
            });
          } else {
            form.setFieldsValue({
              endDate: moment(startDate).add(val, 'days'),
            });
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
  handleSetLimitTime(val) {
    const { uomCode, form } = this.props;
    const { startDate, taskTypeCode } = form.getFieldsValue();
    if (taskTypeCode === 'PROJECT_MISSION' && !isNull(val)) {
      if (uomCode === 'HOUR') {
        form.setFieldsValue({
          limitTime: val.diff(startDate, 'hour'),
        });
      } else {
        form.setFieldsValue({
          limitTime: val.diff(startDate, 'day'),
        });
      }
    }
  }

  /**
   * 切换tab记录key
   */
  @Bind()
  handleTabChange(key) {
    this.setState({ tabTag: key });
  }

  /**
   * 任务类型为里程牌时把工期清空
   */
  @Bind()
  handleTaskTypeChange(val) {
    if (val === 'MILESTONE') {
      this.props.form.setFieldsValue({ limitTime: null });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      title,
      anchor,
      visible,
      form,
      loading,
      saveLoading,
      tenantId,
      workList,
      detailInfo,
      wbsStatus,
      uomName,
      taskTypeMap,
      planModeMap,
      otherUsers,
      otherRoles,
      priorityMap,
      taskStatusMap,
      riskLevelMap,
      wbsHeaderId,
      wbsLineId,
      taskRelationList,
      relationTypeMap,
      fileMap,
      workListLoading,
      deleteRelsLoading,
      wbsPlanHeader,
      onCancel,
      onAddLine,
      onCleanLine,
      onEditLine,
      onAddWorkList,
      onCancelWorkList,
      onEditWorkList,
      onAddFile,
      onCancelFile,
      onEditFile,
      onSaveWorkList,
      onDeleteFile,
      onDeleteWorkList,
      onView,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { selectedRowKeys, tabTag } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const midLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const taskRelationListProps = {
      tenantId,
      wbsStatus,
      wbsHeaderId,
      wbsLineId,
      selectedRowKeys,
      relationTypeMap,
      onEditLine,
      onCleanLine,
      onSelectRow: this.handleSelectRow,
      dataSource: taskRelationList,
    };
    const taskListTableProps = {
      tenantId,
      wbsStatus,
      otherUsers,
      otherRoles,
      fileMap,
      workListLoading,
      onCancelWorkList,
      onEditWorkList,
      onAddFile,
      onCancelFile,
      onEditFile,
      onDeleteFile,
      onDeleteWorkList,
      onView,
      dataSource: workList,
    };
    return (
      <Modal
        destroyOnClose
        title={title}
        width={800}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={visible}
        confirmLoading={saveLoading}
        onOk={
          wbsStatus === 'PRESET' ? (tabTag === 'basic' ? this.saveBtn : onSaveWorkList) : onCancel
        }
        onCancel={onCancel}
        okText={
          wbsStatus === 'PRESET'
            ? intl.get('hzero.common.button.save').d('保存')
            : intl.get('hzero.common.button.close').d('关闭')
        }
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Tabs defaultActiveKey="basic" onChange={this.handleTabChange}>
          <Tabs.TabPane key="basic" tab={intl.get('appm.task').d('基本信息')}>
            <Spin spinning={loading}>
              <Form>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.taskName`).d('任务名称')} {...formLayout}>
                      {getFieldDecorator('taskName', {
                        initialValue: detailInfo.taskName,
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
                      })(<Input disabled={wbsStatus !== 'PRESET'} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.taskType`).d('任务类型')} {...formLayout}>
                      {getFieldDecorator('taskTypeCode', {
                        initialValue: detailInfo.taskTypeCode,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.taskType`).d('任务类型'),
                            }),
                          },
                        ],
                      })(
                        <Select
                          allowClear
                          disabled={wbsStatus !== 'PRESET'}
                          onChange={this.handleTaskTypeChange}
                        >
                          {taskTypeMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.limitTime`).d(`工期 (${uomName})`)}
                      {...formLayout}
                    >
                      {getFieldDecorator('limitTime', {
                        initialValue: detailInfo.limitTime,
                        rules: [
                          {
                            required: getFieldValue('taskTypeCode') === 'PROJECT_MISSION',
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.limitTime`).d('工期'),
                            }),
                          },
                        ],
                      })(
                        <InputNumber
                          disabled={
                            wbsStatus !== 'PRESET' ||
                            getFieldValue('taskTypeCode') !== 'PROJECT_MISSION'
                          }
                          min={0}
                          onChange={val => this.handleSetEndDate(val, 'limitTime')}
                          style={{ width: '100%' }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.planMode`).d('计划模式')} {...formLayout}>
                      {getFieldDecorator('planModeCode', {
                        initialValue: detailInfo.planModeCode,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.planMode`).d('计划模式'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={wbsStatus !== 'PRESET'}>
                          {planModeMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.startDate`).d('开始日期')}
                      {...formLayout}
                    >
                      {getFieldDecorator('startDate', {
                        initialValue: detailInfo.startDate
                          ? moment(detailInfo.startDate, getDateFormat())
                          : null,
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
                          disabled={wbsStatus !== 'PRESET'}
                          format={getDateFormat()}
                          style={{ width: '100%' }}
                          placeholder=""
                          onChange={val => this.handleSetEndDate(val, 'startDate')}
                          disabledDate={currentDate =>
                            moment(wbsPlanHeader.expectEndDate).isBefore(currentDate, 'day') ||
                            moment(wbsPlanHeader.expectStartDate).isAfter(currentDate, 'day') ||
                            (getFieldValue('endDate') &&
                              moment(getFieldValue('endDate')).isBefore(currentDate, 'day'))
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.endDate`).d('结束日期')} {...formLayout}>
                      {getFieldDecorator('endDate', {
                        initialValue: detailInfo.endDate
                          ? moment(detailInfo.endDate, getDateFormat())
                          : null,
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
                          disabled={wbsStatus !== 'PRESET'}
                          format={getDateFormat()}
                          style={{ width: '100%' }}
                          onChange={this.handleSetLimitTime}
                          placeholder=""
                          disabledDate={currentDate =>
                            moment(wbsPlanHeader.expectEndDate).isBefore(currentDate, 'day') ||
                            moment(wbsPlanHeader.expectStartDate).isAfter(currentDate, 'day') ||
                            (getFieldValue('startDate') &&
                              moment(getFieldValue('startDate')).isAfter(currentDate, 'day'))
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.principalRole`).d('负责角色')}
                      {...formLayout}
                    >
                      {getFieldDecorator('principalRoleId', {
                        initialValue: String(detailInfo.principalRoleId),
                      })(
                        <Select
                          disabled={wbsStatus !== 'PRESET'}
                          style={{ width: '100%' }}
                          onChange={val => this.handleSelectChange(val, 'principalRole')}
                        >
                          {otherRoles.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.principalPerson`).d('负责人')}
                      {...formLayout}
                    >
                      {getFieldDecorator('principalPersonId', {
                        initialValue: String(detailInfo.principalPersonId),
                      })(
                        <Select
                          disabled={wbsStatus !== 'PRESET'}
                          style={{ width: '100%' }}
                          onChange={val => this.handleSelectChange(val, 'principalPerson')}
                        >
                          {otherUsers.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.otherRoles`).d('参与角色')}
                      {...formLayout}
                    >
                      {getFieldDecorator('otherRoles', {
                        initialValue: detailInfo.otherRoles,
                      })(
                        <Select
                          disabled={wbsStatus !== 'PRESET'}
                          mode="multiple"
                          style={{ width: '100%' }}
                          onChange={val => this.handleMultiSelectChange(val, 'otherRoles')}
                        >
                          {otherRoles // 过滤掉已选的负责角色
                            .filter(i => i.value !== Number(getFieldValue('principalRoleId')))
                            .map(i => (
                              <Select.Option key={i.value}>{i.meaning}</Select.Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.otherPerson`).d('参与人')}
                      {...formLayout}
                    >
                      {getFieldDecorator('otherPerson', {
                        initialValue: detailInfo.otherPerson,
                      })(
                        <Select
                          disabled={wbsStatus !== 'PRESET'}
                          mode="multiple"
                          style={{ width: '100%' }}
                          onChange={val => this.handleMultiSelectChange(val, 'otherPerson')}
                        >
                          {otherUsers // 过滤掉已选的负责人
                            .filter(i => i.value !== Number(getFieldValue('principalPersonId')))
                            .map(i => (
                              <Select.Option key={i.value}>{i.meaning}</Select.Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.priority`).d('优先级')} {...formLayout}>
                      {getFieldDecorator('priorityCode', {
                        initialValue: detailInfo.priorityCode,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.priority`).d('优先级'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={wbsStatus !== 'PRESET'}>
                          {priorityMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.taskStatus`).d('任务状态')}
                      {...formLayout}
                    >
                      {getFieldDecorator('taskStatus', {
                        initialValue: detailInfo.taskStatus,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.taskStatus`).d('任务状态'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled>
                          {taskStatusMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.riskLevel`).d('风险等级')}
                      {...formLayout}
                    >
                      {getFieldDecorator('riskLevel', {
                        initialValue: detailInfo.riskLevel,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.riskLevel`).d('风险等级'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={wbsStatus !== 'PRESET'}>
                          {riskLevelMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.approvedScheduleRate`).d('进度')}
                      {...formLayout}
                    >
                      {getFieldDecorator('approvedScheduleRate', {
                        initialValue: `${detailInfo.approvedScheduleRate}%`,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      {...midLayout}
                      style={{ marginLeft: 20 }}
                      label={intl.get(`${prefix}.description`).d('详细说明')}
                    >
                      {getFieldDecorator('description', {
                        initialValue: detailInfo.description,
                        rules: [
                          {
                            max: 240,
                            message: intl.get('hzero.common.validation.max', {
                              max: 240,
                            }),
                          },
                        ],
                      })(<Input.TextArea rows={3} disabled={wbsStatus !== 'PRESET'} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Spin>
            {wbsStatus === 'PRESET' ? (
              <Row style={{ margin: '10px' }}>
                <Col>
                  <Button icon="plus" type="primary" onClick={() => onAddLine()}>
                    {intl.get(`hzero.common.button.add`).d('新增')}
                  </Button>
                  <Button
                    icon="delete"
                    loading={deleteRelsLoading}
                    disabled={isEmpty(selectedRowKeys)}
                    style={{ marginLeft: '10px' }}
                    onClick={() => this.handleDelete()}
                  >
                    {intl.get(`hzero.common.button.delete`).d('删除')}
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
            <TaskRelationList {...taskRelationListProps} />
          </Tabs.TabPane>
          <Tabs.TabPane key="workList" tab={intl.get('appm.task').d('工作清单')}>
            <Row style={{ margin: '10px' }}>
              <Col>
                <Button
                  icon="plus"
                  type="primary"
                  style={{ display: wbsStatus === 'PRESET' ? 'inline' : 'none' }}
                  onClick={() => onAddWorkList()}
                >
                  {intl.get(`hzero.common.button.add`).d('新增')}
                </Button>
              </Col>
            </Row>
            <TaskListTable {...taskListTableProps} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}
export default Drawer;
