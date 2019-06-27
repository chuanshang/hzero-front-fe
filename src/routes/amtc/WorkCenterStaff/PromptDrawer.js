import React from 'react';
import { Form, Input, Modal, Button, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';

import { getCurrentOrganizationId } from 'utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

@Form.create({ fieldNameProp: null })
export default class PromptForm extends React.Component {
  state = {
    currentTenantId: getCurrentOrganizationId(),
  };

  @Bind()
  handleOk() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  render() {
    const { form, initData, title, modalVisible, loading, onCancel } = this.props;
    const { currentTenantId } = this.state;
    const { getFieldDecorator } = form;
    const {
      workcenterPeopleName,
      resId,
      skilltypeName,
      skillLevels,
      rate,
      contactId,
      userId,
      enabledFlag,
      description,
      tenantId,
    } = initData;
    // 当前租户是否和数据中的租户对应
    const isCurrentTenant = tenantId !== undefined ? tenantId !== currentTenantId : false;
    return (
      <Modal
        destroyOnClose
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        title={title}
        visible={modalVisible}
        confirmLoading={loading}
        onCancel={onCancel}
        footer={
          isCurrentTenant
            ? null
            : [
              <Button key="cancel" onClick={onCancel}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </Button>,
              <Button key="on" type="primary" loading={loading} onClick={this.handleOk}>
                {intl.get('hzero.common.button.ok').d('确定')}
              </Button>,
              ]
        }
      >
        <Form>
          <FormItem {...formLayout} label="工作中心人员名称：">
            {getFieldDecorator('workcenterPeopleName', {
              initialValue: workcenterPeopleName,
              rules: [
                {
                  type: 'string',
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '工作中心人员名称',
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label="技能类型：">
            {getFieldDecorator('resId', {
              initialValue: resId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '技能类型',
                  }),
                },
              ],
            })(<Lov code="AMTC.SKILLTYPES" textValue={skilltypeName} />)}
          </FormItem>
          <FormItem {...formLayout} label="技能水平：">
            {getFieldDecorator('skillLevels', {
              initialValue: skillLevels,
            })(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label="单位费率：">
            {getFieldDecorator('rate', {
              initialValue: rate,
            })(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label="人员：">
            {getFieldDecorator('contactId', {
              initialValue: contactId,
            })(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label="用户：">
            {getFieldDecorator('userId', {
              initialValue: userId,
            })(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label="是否启用：">
            {getFieldDecorator('enabledFlag', {
              initialValue: enabledFlag === 1,
              rules: [
                {
                  type: 'boolean',
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '启用',
                  }),
                },
              ],
            })(<Switch defaultChecked />)}
          </FormItem>
          <FormItem {...formLayout} label="描述：">
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [
                {
                  type: 'string',
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
