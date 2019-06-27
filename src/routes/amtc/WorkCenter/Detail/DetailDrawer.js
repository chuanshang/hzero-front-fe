import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';

/**
 * 技能类型-新建滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class Drawer extends PureComponent {
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
    const { form, onOk, dataSource } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...dataSource, ...values });
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'amtc.workCenter.model.workCenter';
    const { anchor, visible, title, form, loading, onCancel, tenantId, dataSource } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        destroyOnClose
        title={title}
        width={520}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={visible}
        confirmLoading={loading}
        onOk={this.saveBtn}
        okText={intl.get('hzero.common.button.save').d('保存')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workcenterResName`).d('技能类型名称')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterResName', {
              initialValue: dataSource.workcenterResName,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.workcenterResName`).d('技能类型名称'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workcenter`).d('工作中心')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterId', {
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
                disabled
                code="AMTC.WORKCENTERS"
                queryParams={{ organizationId: tenantId }}
                textValue={dataSource.workcenterName}
              />
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.resQty`).d('资源数')} {...formLayout}>
            {getFieldDecorator('resQty', {
              rules: [],
              initialValue: dataSource.resQty === undefined ? 0 : dataSource.resQty,
            })(<InputNumber disabled />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.profession`).d('工种')} {...formLayout}>
            {getFieldDecorator('profession', {
              initialValue: dataSource.profession,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.profession`).d('工种'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.level`).d('级别')} {...formLayout}>
            {getFieldDecorator('level', {
              initialValue: dataSource.level,
              rules: [],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.plannerFlag`).d('是否签派/计划员')}
            {...formLayout}
          >
            {getFieldDecorator('plannerFlag', {
              initialValue: dataSource.plannerFlag === undefined ? 0 : dataSource.plannerFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.resOwner`).d('技能类型负责人')}
            {...formLayout}
          >
            {getFieldDecorator('resOwnerId', {})(
              <Lov code="AMTC.WORKCENTER_PRINCIPAL" queryParams={{ organizationId: tenantId }} />
            )}
          </Form.Item>
          <Form.Item
            label={intl.get('hzero.common.status.costFlag').d('启用成本核算')}
            {...formLayout}
          >
            {getFieldDecorator('costFlag', {
              initialValue: dataSource.costFlag === undefined ? 0 : dataSource.costFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item
            label={intl.get('hzero.common.status.enabledFlag').d('是否启用')}
            {...formLayout}
          >
            {getFieldDecorator('enabledFlag', {
              initialValue: dataSource.enabledFlag === undefined ? 1 : dataSource.enabledFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.description`).d('描述')} {...formLayout}>
            {getFieldDecorator('description', {})(<Input.TextArea rows={3} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
