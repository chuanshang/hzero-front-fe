import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';

/**
 * 服务区域-新建滑窗(抽屉)
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
    const { form, onOk, targetItem } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          onOk({ ...targetItem, ...values });
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'amdm.maintSites.model.maintSites';
    const { anchor, visible, title, form, loading, onCancel } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
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
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSitesName`).d('简称')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.maintSitesName`).d('简称'),
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
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSitesDescription`).d('全称')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesDescription', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.maintSitesDescription`).d('全称'),
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
          <Form.Item
            label={intl.get(`${commonPromptCode}.sharedAreaFlag`).d('共享区域')}
            {...formLayout}
          >
            {getFieldDecorator('sharedAreaFlag', {})(<Switch />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSitesCodeEnabled`).d('启用代码')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesCodeEnabled', {
              initialValue: 0,
            })(<Switch />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSitesCode`).d('代码')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesCode', {
              rules: [
                {
                  required: getFieldValue('maintSitesCodeEnabled') === 1,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.maintSitesCode`).d('代码'),
                  }),
                },
                {
                  max: 30,
                  message: intl.get('hzero.common.validation.max', {
                    max: 30,
                  }),
                },
              ],
              initialValue:
                getFieldValue('maintSitesCodeEnabled') === 0
                  ? this.props.form.resetFields('maintSitesCode')
                  : '',
            })(
              getFieldValue('maintSitesCodeEnabled') === 0 ? (
                <span>
                  {getFieldValue('maintSitesCodeEnabled') === 0
                    ? this.props.form.resetFields('maintSitesCode')
                    : ''}
                </span>
              ) : (
                <Input inputChinese={false} />
              )
            )}
          </Form.Item>
          <Form.Item label={intl.get('hzero.common.status.enabledFlag').d('启用')} {...formLayout}>
            {getFieldDecorator('enabledFlag', {})(<Switch />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
