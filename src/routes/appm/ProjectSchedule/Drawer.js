import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Modal,
  Input,
  InputNumber,
  Row,
  Col,
  Icon,
  Collapse,
  Tag,
  Popconfirm,
  Button,
} from 'hzero-ui';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import classNames from 'classnames';
import { isFunction, isEmpty } from 'lodash';
import TaskListTable from './TaskListTable';
import styles from './index.less';

/**
 * 项目进度填报
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @reactProps {Function} onCancel - 抽屉取消操作
 * @reactProps {Object} form - 表单对象
 * @reactProps {Object} detail - 权限信息
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
      collapseKeys: ['A', 'B'],
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
   * 确定操作
   */
  @Bind()
  saveBtn() {
    const { form, onOk, detail } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...detail, ...values });
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      tenantId,
      title,
      anchor,
      visible,
      form,
      saveLoading,
      detail,
      workList,
      workListLoading,
      fileMap,
      completeScheduleLoading,
      resetScheduleLoading,
      onCancel,
      onOperateWorkList,
      onCancelFile,
      onEditFile,
      onDeleteFile,
      onAddFile,
      onResetSchedule,
      onCompleteSchedule,
      onUpload,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { collapseKeys } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const midLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const prefix = 'appm.projectSchedule.model.projectSchedule';
    const taskListTableProps = {
      tenantId,
      fileMap,
      workListLoading,
      onOperateWorkList,
      onAddFile,
      onCancelFile,
      onEditFile,
      onDeleteFile,
      onUpload,
      dataSource: workList,
    };
    let completeFlag = isEmpty(workList);
    workList.forEach(item => {
      if (item.workListStatus === 'PROCESSING') {
        completeFlag = true;
      }
    });
    return (
      <Modal
        destroyOnClose
        title={title}
        width={800}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={visible}
        confirmLoading={saveLoading}
        onOk={this.saveBtn}
        onCancel={onCancel}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <div className={classNames(styles['project-schedule-detail'])}>
          <Row style={{ marginBottom: 10 }}>
            <Col span={20}>
              <Row>
                <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                  {detail.taskName}
                </span>
                <Tag color="#2db7f5">{detail.taskTypeMeaning}</Tag>
                <Tag color="#2db7f5">{detail.planModeMeaning}</Tag>
              </Row>
            </Col>
            <Col span={1} offset={2}>
              {detail.approvedScheduleRate === 100 ? (
                <Popconfirm
                  title={intl.get(`${prefix}.cancelCompleteTitle`).d('是否取消完成工作项')}
                  onConfirm={() => onResetSchedule(detail)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                >
                  <Button loading={resetScheduleLoading}>
                    {intl.get(`${prefix}.cancelComplete`).d('取消完成')}
                  </Button>
                </Popconfirm>
              ) : detail.enteredScheduleRate < 100 ? (
                <Popconfirm
                  title={intl.get(`${prefix}.completeTitle`).d('是否完成工作项')}
                  onConfirm={() => onCompleteSchedule(detail)}
                  okText={intl.get('hzero.common.button.sure').d('确认')}
                  cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                >
                  <Button loading={completeScheduleLoading} disabled={completeFlag}>
                    {intl.get(`${prefix}.complete`).d('完成')}
                  </Button>
                </Popconfirm>
              ) : (
                ''
              )}
            </Col>
          </Row>
          <Collapse bordered={false} className="associated-collapse" defaultActiveKey={['A', 'B']}>
            <Collapse.Panel
              showArrow={false}
              key="A"
              header={
                <Fragment>
                  <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
                  <h3>{intl.get(`${prefix}.panel.a`).d('进度')}</h3>
                </Fragment>
              }
            >
              <Form>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label={intl.get(`${prefix}.enteredScheduleRate`).d('已填报总进度')}
                      {...formLayout}
                    >
                      {getFieldDecorator('enteredScheduleRate', {
                        initialValue: detail.enteredScheduleRate,
                      })(
                        <InputNumber
                          disabled
                          style={{ width: '100%' }}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      label={intl.get(`${prefix}.approvedScheduleRate`).d('已审批总进度')}
                      {...formLayout}
                    >
                      {getFieldDecorator('approvedScheduleRate', {
                        initialValue: detail.approvedScheduleRate,
                      })(
                        <InputNumber
                          disabled
                          style={{ width: '100%' }}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label={intl.get(`${prefix}.progress`).d('新增进度(%)')}
                      {...formLayout}
                    >
                      {getFieldDecorator('progress', {
                        initialValue: detail.progress,
                        rules: [
                          {
                            required: getFieldValue('enteredScheduleRate') < 100,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${prefix}.progress`).d('新增进度'),
                            }),
                          },
                        ],
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled={getFieldValue('enteredScheduleRate') === 100}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      {...midLayout}
                      style={{ marginLeft: 20 }}
                      label={intl.get(`${prefix}.remark`).d('备注')}
                    >
                      {getFieldDecorator('remark', {
                        initialValue: detail.remark,
                        rules: [
                          {
                            max: 240,
                            message: intl.get('hzero.common.validation.max', {
                              max: 240,
                            }),
                          },
                        ],
                      })(<Input.TextArea rows={3} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Collapse.Panel>
            <Collapse.Panel
              showArrow={false}
              key="B"
              header={
                <Fragment>
                  <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
                  <h3>{intl.get(`${prefix}.panel.b`).d('工作清单')}</h3>
                </Fragment>
              }
            >
              <TaskListTable {...taskListTableProps} />
            </Collapse.Panel>
          </Collapse>
        </div>
      </Modal>
    );
  }
}
export default Drawer;
