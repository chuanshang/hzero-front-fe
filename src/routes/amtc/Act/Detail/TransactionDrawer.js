import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, Select, InputNumber } from 'hzero-ui';
import Switch from 'components/Switch';
import { EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import { yesOrNoRender } from 'utils/renderer';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

/**
 * 事务处理行明细-滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class TransactionDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lovMeaning: {},
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
    anchor: 'right',
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
    const { ActOpStatusMap, dataSource = {}, form, onOk } = this.props;
    const { lovMeaning } = this.state;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({
            ...dataSource,
            ...values,
            ...lovMeaning,
            activityStatusMeaning: ActOpStatusMap.filter(
              item => item.value === values.activityStatus
            )[0].meaning,
          });
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'amtc.act.model.actDrawer';
    const {
      anchor,
      drawerVisible,
      title,
      isNew,
      form,
      editFlag,
      // loading,
      ActOpStatusMap,
      ActOpDefJobCodeMap,
      jobSpecifiedCode,
      onCancel,
      dataSource = {}, // 当前行list传进来的信息
      tenantId,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        title={title}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        // confirmLoading={loading}
        // onOk={this.saveBtn}
        onCancel={onCancel}
        footer={
          isNew || editFlag
            ? [
                <Button key="cancel" onClick={onCancel}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </Button>,
                <Button
                  key="sure"
                  type="primary"
                  // loading={loading.detailLineListLoading}
                  onClick={this.saveBtn}
                >
                  {intl.get('hzero.common.button.sure').d('确认')}
                </Button>,
              ]
            : null
        }
      >
        <Form>
          <Form.Item
            label={intl.get(`${commonPromptCode}.activityStatus`).d('状态')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('activityStatus', {
                initialValue: dataSource.activityStatus,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.activityStatus`).d('状态'),
                    }),
                  },
                ],
              })(
                <Select>
                  {ActOpStatusMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{dataSource.activityStatusMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.actOpName`).d('标准作业任务名称')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('actOpName', {
                initialValue: dataSource.actOpName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.actOpName`).d('标准作业任务名称'),
                    }),
                  },
                ],
              })(<Input />)
            ) : (
              <span>{dataSource.actOpName}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.activityOpNumber`).d('序号')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('activityOpNumber', {
                initialValue: dataSource.activityOpNumber,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.activityOpNumber`).d('序号'),
                    }),
                  },
                ],
              })(<InputNumber />)
            ) : (
              <span>{dataSource.activityOpNumber}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.defaultJobCode`).d('工作职责默认方式')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('defaultJobCode', {
                initialValue: dataSource.defaultJobCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonPromptCode}.defaultJobCode`).d('工作职责默认方式'),
                    }),
                  },
                ],
              })(
                <Select>
                  {ActOpDefJobCodeMap.map(i => (
                    <Select.Option key={i.value}>{i.meaning}</Select.Option>
                  ))}
                </Select>
              )
            ) : (
              <span>{dataSource.defaultJobCodeMeaning}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.description`).d('任务描述')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('description', {
                initialValue: dataSource.description,
              })(<Input.TextArea rows={3} />)
            ) : (
              <span>{dataSource.description}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.standardHour`).d('标准时长（小时）')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('standardHour', {
                initialValue: dataSource.standardHour,
              })(<InputNumber />)
            ) : (
              <span>{dataSource.standardHour}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.woOwnerFlag`).d('默认为工单的负责人')}
            {...EDIT_FORM_ITEM_LAYOUT}
          >
            {isNew || editFlag ? (
              getFieldDecorator('woOwnerFlag', {
                initialValue: dataSource.woOwnerFlag,
              })(<Switch />)
            ) : (
              <span>{yesOrNoRender(dataSource.woOwnerFlag)}</span>
            )}
          </Form.Item>
          {jobSpecifiedCode === 'CUSTOM' ? (
            <div>
              <Form.Item
                label={intl.get(`${commonPromptCode}.workcenter`).d('工作中心')}
                {...EDIT_FORM_ITEM_LAYOUT}
              >
                {isNew || editFlag ? (
                  getFieldDecorator('workcenterId', {
                    initialValue: dataSource.workcenterId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonPromptCode}.workcenter`).d('工作中心'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMTC.WORKCENTERS"
                      onChange={(_, record) => {
                        const { lovMeaning } = this.state;
                        this.setState({
                          lovMeaning: { ...lovMeaning, workCenterName: record.workCenterName },
                        });
                      }}
                      queryParams={{ tenantId }}
                      textValue={dataSource.workCenterName}
                    />
                  )
                ) : (
                  <span>{dataSource.workCenterName}</span>
                )}
              </Form.Item>
              <Form.Item
                label={intl.get(`${commonPromptCode}.ownerGroup`).d('负责人组（技能类型）')}
                {...EDIT_FORM_ITEM_LAYOUT}
              >
                {isNew || editFlag ? (
                  getFieldDecorator('ownerGroupId', {
                    initialValue: dataSource.ownerGroupId,
                  })(
                    <Lov
                      code="AMTC.SKILLTYPES"
                      onChange={(_, record) => {
                        const { lovMeaning } = this.state;
                        this.setState({
                          lovMeaning: { ...lovMeaning, ownerGroupName: record.workcenterResName },
                        });
                      }}
                      queryParams={{ tenantId }}
                      textValue={dataSource.ownerGroupName}
                    />
                  )
                ) : (
                  <span>{dataSource.ownerGroupName}</span>
                )}
              </Form.Item>
              <Form.Item
                label={intl.get(`${commonPromptCode}.owner`).d('负责人')}
                {...EDIT_FORM_ITEM_LAYOUT}
              >
                {isNew || editFlag ? (
                  getFieldDecorator('ownerId', {
                    initialValue: dataSource.ownerId,
                  })(
                    <Lov
                      code="AMTC.WORKCENTERSTAFF"
                      onChange={(_, record) => {
                        const { lovMeaning } = this.state;
                        this.setState({
                          lovMeaning: { ...lovMeaning, ownerName: record.workcenterStaffName },
                        });
                      }}
                      queryParams={{ tenantId }}
                      textValue={dataSource.ownerName}
                    />
                  )
                ) : (
                  <span>{dataSource.ownerName}</span>
                )}
              </Form.Item>
            </div>
          ) : null}
        </Form>
      </Modal>
    );
  }
}
export default TransactionDrawer;
