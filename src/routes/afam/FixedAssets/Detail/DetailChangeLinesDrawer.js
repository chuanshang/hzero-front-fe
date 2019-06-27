import React, { PureComponent } from 'react';
import { Drawer, Form, Button, Select, InputNumber, Input } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
class DetailChangeLinesDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 确认操作
   */
  @Bind()
  handleOk() {
    const { form, changeDetail, onOk, changeTypeCodeMap } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const { changeTypeCode } = {
          ...changeDetail,
          ...fieldsValue,
        };
        let changeTypeMeaning;
        changeTypeCodeMap.forEach(i => {
          if (i.value === changeTypeCode) {
            changeTypeMeaning = i.meaning;
          }
        });
        onOk({
          ...changeDetail,
          ...fieldsValue,
          changeTypeMeaning,
        });
      }
    });
  }

  renderForm() {
    const promptCode = 'aafm.proBasicInfo.model.proBasicInfo';
    const {
      changeTypeCodeMap,
      changeDetail,
      form: { getFieldDecorator },
      onHideDrawer,
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.periodName`).d('期间')} {...formLayout}>
          {getFieldDecorator('periodName', {
            initialValue: changeDetail.periodName,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.periodName`).d('期间'),
                }),
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.changeTypeCode`).d('类型')} {...formLayout}>
          {getFieldDecorator('changeTypeCode', {
            initialValue: changeDetail.changeTypeCode,
            rules: [],
          })(
            <Select>
              {changeTypeCodeMap.map(i => (
                <Select.Option key={i.value}>{i.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.changeValue`).d('价值变动')} {...formLayout}>
          {getFieldDecorator('changeValue', {
            initialValue: changeDetail.changeValue,
            rules: [],
          })(<InputNumber precision={2} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.correlatedEvent`).d('关联事件')} {...formLayout}>
          {getFieldDecorator('correlatedEvent', {
            initialValue: changeDetail.correlatedEvent,
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.accountingVoucherNumber`).d('会计凭证编号')}
          {...formLayout}
        >
          {getFieldDecorator('accountingVoucherNumber', {
            initialValue: changeDetail.accountingVoucherNumber,
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.description`).d('描述')} {...formLayout}>
          {getFieldDecorator('description', {
            initialValue: changeDetail.description,
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => this.handleOk()}
          >
            {intl.get('hzero.common.button.sure').d('确认')}
          </Button>
          <Button onClick={() => onHideDrawer()}>
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
  render() {
    const { visible, onHideDrawer } = this.props;
    const drawerProps = {
      title: intl.get('afam.fixedAssets.view.drawer.title').d('价值变动详情'),
      visible,
      mask: true,
      onClose: () => onHideDrawer(),
      width: 450,
      style: {
        height: 'calc(100% - 103px)',
        overflow: 'auto',
        padding: 12,
      },
    };
    return (
      <Drawer destroyOnClose {...drawerProps}>
        {this.renderForm()}
      </Drawer>
    );
  }
}
export default DetailChangeLinesDrawer;
