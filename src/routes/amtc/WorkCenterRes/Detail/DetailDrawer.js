import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';

/**
 * 工作中心人员-新建滑窗(抽屉)
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
    const commonPromptCode = 'amtc.workCenterRes.model.workCenterRes';
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
            label={intl.get(`${commonPromptCode}.workcenterPeopleName`).d('工作中心人员名称')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterPeopleName', {
              initialValue: dataSource.workcenterPeopleName,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl
                      .get(`${commonPromptCode}.workcenterPeopleName`)
                      .d('工作中心人员名称'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workCenterRes`).d('技能类型')}
            {...formLayout}
          >
            {getFieldDecorator('resId', {
              initialValue: dataSource.resId,
            })(
              <Lov
                disabled
                code="AMTC.SKILLTYPES"
                queryParams={{ organizationId: tenantId }}
                textValue={dataSource.workcenterResName}
              />
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.skillLevels`).d('技能水平')}
            {...formLayout}
          >
            {getFieldDecorator('skillLevels', {
              initialValue: dataSource.skillLevels,
            })(<Input />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.rate`).d('单位费率')} {...formLayout}>
            {getFieldDecorator('rate', {
              initialValue: dataSource.rate,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.contact`).d('人员')} {...formLayout}>
            {getFieldDecorator('contactId', {
              initialValue: dataSource.contactId,
            })(
              <Lov
                code="HPFM.EMPLOYEE"
                queryParams={{ organizationId: tenantId }}
                textValue={dataSource.contactName}
              />
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.user`).d('用户')} {...formLayout}>
            {getFieldDecorator('userId', {
              initialValue: dataSource.userId,
            })(
              <Lov
                code=""
                queryParams={{ organizationId: tenantId }}
                textValue={dataSource.userName}
              />
            )}
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
            {getFieldDecorator('description', { initialValue: dataSource.description })(
              <Input.TextArea rows={3} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
