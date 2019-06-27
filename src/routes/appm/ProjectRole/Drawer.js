import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import { Modal, Form, Select } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';

/**
 * 项目角色维护权限
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
export default class Drawer extends PureComponent {
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
   * 取消操作
   */
  @Bind()
  cancelBtn() {
    this.props.onCancel();
  }
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      anchor,
      visible,
      form,
      loading,
      itemData,
      planPermissions,
      changePermissions,
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const prefix = 'appm.projectRole.model.permission';
    return (
      <Modal
        destroyOnClose
        title={intl.get(`appm.projectRole.view.message.drawer.title`).d('权限维护')}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={visible}
        confirmLoading={loading}
        onOk={this.saveBtn}
        okText={intl.get('hzero.common.button.save').d('保存')}
        onCancel={this.cancelBtn}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <Form.Item label={intl.get(`${prefix}.planPermissions`).d('计划权限')} {...formLayout}>
            {getFieldDecorator('planPermissionsCode', {
              initialValue: itemData.planPermissionsCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefix}.planPermissions`).d('计划权限'),
                  }),
                },
              ],
            })(
              <Select>
                {planPermissions.map(i => (
                  <Select.Option key={i.value}>{i.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.orderFlag`).d('可下单')} {...formLayout}>
            {getFieldDecorator('orderFlag', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefix}.orderFlag`).d('可下单'),
                  }),
                },
              ],
              initialValue: itemData.orderFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.convertAssetFlag`).d('可转资')} {...formLayout}>
            {getFieldDecorator('convertAssetFlag', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefix}.convertAssetFlag`).d('可转资'),
                  }),
                },
              ],
              initialValue: itemData.convertAssetFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${prefix}.prepareBudgetFlag`).d('可编制预算')}
            {...formLayout}
          >
            {getFieldDecorator('prepareBudgetFlag', {
              initialValue: itemData.prepareBudgetFlag,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefix}.prepareBudgetFlag`).d('可编制预算'),
                  }),
                },
              ],
            })(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get(`${prefix}.changePermissions`).d('变更权限')} {...formLayout}>
            {getFieldDecorator('changePermissionsCode', {
              initialValue: itemData.changePermissionsCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefix}.changePermissions`).d('变更权限'),
                  }),
                },
              ],
            })(
              <Select>
                {changePermissions.map(i => (
                  <Select.Option key={i.value}>{i.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
