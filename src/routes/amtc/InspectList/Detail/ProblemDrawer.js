import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber } from 'hzero-ui';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';

/**
 * 问题清单-新建滑窗(抽屉)
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
    const commonPromptCode = 'amtc.inspectList.model.inspectList';
    const {
      isNew,
      editFlag,
      anchor,
      drawerVisible,
      title,
      form,
      loading,
      onCancel,
      dataSource = {},
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        maskClosable
        destroyOnClose
        title={title}
        width={500}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={drawerVisible}
        confirmLoading={loading}
        onOk={this.saveBtn}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <div className="drawer-row">
            <Form.Item label={intl.get(`${commonPromptCode}.problemSeq`).d('序号')} {...formLayout}>
              {!isNew || editFlag ? (
                getFieldDecorator('problemSeq', {
                  initialValue: dataSource.problemSeq,
                })(<InputNumber min={0} />)
              ) : (
                <span>{dataSource.problemSeq}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.problemName`).d('名称')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('problemName', {
                  initialValue: dataSource.problemName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${commonPromptCode}.problemName`).d('名称'),
                      }),
                    },
                  ],
                })(<Input />)
              ) : (
                <span>{dataSource.problemName}</span>
              )}
            </Form.Item>
            <Form.Item label={intl.get(`${commonPromptCode}.score`).d('分值')} {...formLayout}>
              {!isNew || editFlag ? (
                getFieldDecorator('score', {
                  initialValue: dataSource.score,
                })(<Input />)
              ) : (
                <span>{dataSource.score}</span>
              )}
            </Form.Item>
            <Form.Item label={intl.get(`${commonPromptCode}.url`).d('链接')} {...formLayout}>
              {!isNew || editFlag ? (
                getFieldDecorator('url', {
                  initialValue: dataSource.url,
                })(<Input />)
              ) : (
                <span>{dataSource.url}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.resultDesc`).d('结果意义说明')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('resultDesc', {
                  initialValue: dataSource.resultDesc,
                })(<Input />)
              ) : (
                <span>{dataSource.resultDesc}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.solution`).d('解决方案')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('solution', {
                  initialValue: dataSource.solution,
                })(<Input />)
              ) : (
                <span>{dataSource.solution}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.relateProblemFlag`).d('关联对象值')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('relateProblemFlag', {
                  initialValue: dataSource.relateProblemFlag,
                })(<Switch />)
              ) : (
                <span>{yesOrNoRender(dataSource.relateProblemFlag)}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.evalueationRuleId`).d('评级标准')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('evalueationRuleId', {
                  initialValue: dataSource.evalueationRuleId,
                })(<Input />)
              ) : (
                <span>{dataSource.evalueationRuleId}</span>
              )}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonPromptCode}.description`).d('备注')}
              {...formLayout}
            >
              {!isNew || editFlag ? (
                getFieldDecorator('description', {
                  initialValue: dataSource.description,
                })(<Input.TextArea />)
              ) : (
                <span>{dataSource.description}</span>
              )}
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  }
}
export default Drawer;
