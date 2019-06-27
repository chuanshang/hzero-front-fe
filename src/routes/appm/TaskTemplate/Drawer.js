import React, { PureComponent } from 'react';
import { Form, Select, Modal, Input, InputNumber, Tabs, Row, Col, Button, Spin } from 'hzero-ui';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isEmpty, isFunction } from 'lodash';
import TaskRelationList from './TaskRelationList';
import TaskListTable from './TaskListTable';
/**
 * WBS任务明细信息变更
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @reactProps {Function} onCancel - 抽屉取消操作
 * @reactProps {Object} form - 表单对象
 * @reactProps {Object} itemData - 权限信息
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
    const { onDelete, itemData } = this.props;
    const { selectedRows } = this.state;
    const successFlag = onDelete(selectedRows, itemData);
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
    const { form, onOk, itemData } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...itemData, ...values });
        }
      });
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
   * 任务类型改变
   */
  @Bind()
  handleTaskTypeChange(val) {
    if (val !== 'PROJECT_MISSION') {
      this.props.form.resetFields('limitTime');
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
      roles,
      form,
      loading,
      saveLoading,
      taskLoading,
      itemData,
      projectRole,
      planMode,
      priority,
      relationType,
      taskRelation,
      taskType,
      tenantId,
      proTemplateStatus,
      proTemplateId,
      workList,
      workListLoading,
      deleteRelsLoading,
      fileMap,
      projectTemplate,
      onCancel,
      onAddLine,
      onCleanLine,
      onEditLine,
      onAddWorkList,
      onEditWorkList,
      onCancelWorkList,
      onDeleteWorkList,
      onCancelFile,
      onEditFile,
      onDeleteFile,
      onSaveWorkList,
      onAddFile,
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
    const prefix = 'appm.taskTemplate.model.taskTemplate';
    const taskRelationListProps = {
      tenantId,
      proTemplateId,
      selectedRowKeys,
      relationType,
      proTemplateStatus,
      onEditLine,
      onCleanLine,
      proTaskId: itemData.proTaskId,
      dataSource: taskRelation,
      loading: taskLoading,
      onSelectRow: this.handleSelectRow,
    };
    const taskListTableProps = {
      proTemplateStatus,
      workListLoading,
      projectRole,
      roles,
      fileMap,
      onEditWorkList,
      onCancelWorkList,
      onDeleteWorkList,
      onCancelFile,
      onEditFile,
      onDeleteFile,
      onAddFile,
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
          proTemplateStatus === 'PRESET'
            ? tabTag === 'basic'
              ? this.saveBtn
              : onSaveWorkList
            : onCancel
        }
        onCancel={onCancel}
        okText={
          proTemplateStatus === 'PRESET'
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
                        initialValue: itemData.taskName,
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
                      })(<Input disabled={proTemplateStatus !== 'PRESET'} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get(`${prefix}.taskType`).d('任务类型')} {...formLayout}>
                      {getFieldDecorator('taskTypeCode', {
                        initialValue: itemData.taskTypeCode,
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
                          disabled={proTemplateStatus !== 'PRESET'}
                          onChange={this.handleTaskTypeChange}
                        >
                          {taskType.map(i => (
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
                      label={intl.get(`${prefix}.priorityCode`).d('优先级')}
                      {...formLayout}
                    >
                      {getFieldDecorator('priorityCode', {
                        initialValue: itemData.priorityCode,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.priorityCode`).d('优先级'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={proTemplateStatus !== 'PRESET'}>
                          {priority.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl
                        .get(`${prefix}.limitTime`)
                        .d(`工期 (${projectTemplate.limitTimeUomMeaning})`)}
                      {...formLayout}
                    >
                      {getFieldDecorator('limitTime', {
                        initialValue: itemData.limitTime,
                        rules: [
                          {
                            required:
                              getFieldValue('taskTypeCode') === 'PROJECT_MISSION' &&
                              proTemplateStatus === 'PRESET',
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.limitTime`).d('工期'),
                            }),
                          },
                        ],
                      })(
                        <InputNumber
                          disabled={
                            proTemplateStatus !== 'PRESET' ||
                            getFieldValue('taskTypeCode') !== 'PROJECT_MISSION'
                          }
                          min={0}
                          style={{ width: '100%' }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.principalRoleName`).d('负责角色')}
                      {...formLayout}
                    >
                      {getFieldDecorator('principalRoleId', {
                        initialValue: String(itemData.principalRoleId),
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.principalRoleName`).d('负责角色'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={proTemplateStatus !== 'PRESET'}>
                          {projectRole // 项目角色中筛选出项目模板中设置的角色
                            .filter(i => roles.indexOf(i.value) !== -1)
                            .map(i => (
                              <Select.Option key={i.value}>{i.meaning}</Select.Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get(`${prefix}.planModeCode`).d('计划模式')}
                      {...formLayout}
                    >
                      {getFieldDecorator('planModeCode', {
                        initialValue: itemData.planModeCode,
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.planModeCode`).d('计划模式'),
                            }),
                          },
                        ],
                      })(
                        <Select allowClear disabled={proTemplateStatus !== 'PRESET'}>
                          {planMode.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      {...midLayout}
                      style={{ marginLeft: 20 }}
                      label={intl.get(`${prefix}.otherRoles`).d('参与角色')}
                    >
                      {getFieldDecorator('otherRoles', {
                        initialValue: itemData.otherRoles,
                      })(
                        <Select
                          allowClear
                          disabled={proTemplateStatus !== 'PRESET'}
                          mode="multiple"
                          placeholder=""
                        >
                          {projectRole // 项目角色中筛选出项目模板中设置的角色
                            .filter(i => roles.indexOf(i.value) !== -1)
                            .map(i => (
                              <Select.Option key={i.value}>{i.meaning}</Select.Option>
                            ))}
                        </Select>
                      )}
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
                        initialValue: itemData.description,
                        rules: [
                          {
                            max: 240,
                            message: intl.get('hzero.common.validation.max', {
                              max: 240,
                            }),
                          },
                        ],
                      })(<Input.TextArea disabled={proTemplateStatus !== 'PRESET'} rows={5} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Spin>
            {proTemplateStatus === 'PRESET' ? (
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
            <Row
              style={{
                margin: '10px',
                display: proTemplateStatus === 'PRESET' ? 'block' : 'none',
              }}
            >
              <Col>
                <Button icon="plus" type="primary" onClick={() => onAddWorkList()}>
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
