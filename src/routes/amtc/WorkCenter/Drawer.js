import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';

/**
 * 工作中心-新建滑窗(抽屉)
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
    const commonPromptCode = 'amtc.workCenter.model.workCenter';
    const { anchor, visible, title, form, loading, onCancel, tenantId } = this.props;
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
            label={intl.get(`${commonPromptCode}.workcenterName`).d('工作中心名称')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.workcenterName`).d('工作中心名称'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workcenterShortName`).d('代码/简称')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterShortName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.workcenterShortName`).d('代码/简称'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workcenterNum`).d('工作中心编号')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterNum', {
              rules: [],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSites`).d('服务区域')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.workcenterShortName`).d('代码/简称'),
                  }),
                },
              ],
            })(<Lov code="AMDM.ASSET_MAINT_SITE" queryParams={{ organizationId: tenantId }} />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.workcenterStaff`).d('工作中心负责人')}
            {...formLayout}
          >
            {getFieldDecorator('workcenterStaffId', {})(
              <Lov code="AMTC.WORKCENTER_PRINCIPAL" queryParams={{ organizationId: tenantId }} />
            )}
          </Form.Item>
          <Form.Item
            label={intl.get('hzero.common.status.enabledFlag').d('是否启用')}
            {...formLayout}
          >
            {getFieldDecorator('enabledFlag', {
              initialValue: 1,
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
