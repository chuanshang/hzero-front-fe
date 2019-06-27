import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
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
    const commonPromptCode = 'amtc.workOrder.model.material';
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
          <Form.Item label={intl.get(`${commonPromptCode}.woopMeaning`).d('任务')} {...formLayout}>
            {getFieldDecorator('woopId', {
              initialValue: dataSource.woopId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.woopId`).d('任务'),
                  }),
                },
              ],
            })(
              <Lov
                code="AMTC.WOOP"
                queryParams={{ organizationId: tenantId, woId: dataSource.woId }}
                textValue={dataSource.woopMeaning}
              />
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.itemMeaning`).d('物料')} {...formLayout}>
            {getFieldDecorator('itemMeaning', {
              initialValue: dataSource.itemMeaning,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.itemMeaning`).d('物料'),
                  }),
                },
              ],
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label={intl.get(`${commonPromptCode}.itemNum`).d('物料编码')} {...formLayout}>
            {getFieldDecorator('itemNum', {
              initialValue: dataSource.itemNum,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.needQuantity`).d('需要数量')}
            {...formLayout}
          >
            {getFieldDecorator('needQuantity', {
              rules: [
                {
                  required: true,
                },
              ],
              initialValue: dataSource.needQuantity === undefined ? 0 : dataSource.needQuantity,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.uomMeaning`).d('单位')} {...formLayout}>
            {getFieldDecorator('uomMeaning', {
              initialValue: dataSource.uomMeaning,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.processedQuantity`).d('处理数量')}
            {...formLayout}
          >
            {getFieldDecorator('processedQuantity', {
              rules: [],
              initialValue:
                dataSource.processedQuantity === undefined ? 0 : dataSource.processedQuantity,
            })(<InputNumber disabled />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.lotNumber`).d('批次号')} {...formLayout}>
            {getFieldDecorator('lotNumber', {
              initialValue: dataSource.lotNumber,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.locationMeaning`).d('来源位置')}
            {...formLayout}
          >
            {getFieldDecorator('locationMeaning', {
              initialValue: dataSource.locationMeaning,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.locatorMeaning`).d('来源货位')}
            {...formLayout}
          >
            {getFieldDecorator('locatorMeaning', {
              initialValue: dataSource.locatorMeaning,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.description`).d('描述')} {...formLayout}>
            {getFieldDecorator('description', {
              initialValue: dataSource.description,
            })(<Input.TextArea rows={3} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
