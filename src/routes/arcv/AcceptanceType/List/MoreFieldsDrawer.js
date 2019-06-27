import React, { PureComponent } from 'react';
import { Drawer, Form, Button, Input, Select } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';

class MoreFieldsDrawer extends PureComponent {
  renderForm() {
    const promptCode = 'arcv.acceptanceType.model.acceptanceType';
    const {
      transferFixed,
      acceptanceType,
      onReset,
      onSearch,
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="more-fields-form">
        <Form.Item
          label={intl.get(`${promptCode}.acceptanceTypeCode`).d('验收基础类型')}
          {...formLayout}
        >
          {getFieldDecorator('acceptanceTypeCode', {})(
            <Select style={{ width: 150 }} allowClear>
              {acceptanceType.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.transferFixedCode`).d('是否转固')}
          {...formLayout}
        >
          {getFieldDecorator('transferFixedCode', {})(
            <Select style={{ width: 150 }} allowClear>
              {transferFixed.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.code`).d('代码')} {...formLayout}>
          {getFieldDecorator('code', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.shortName`).d('事件短名称')} {...formLayout}>
          {getFieldDecorator('shortName', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.fullName`).d('事件完整名称')} {...formLayout}>
          {getFieldDecorator('fullName', {})(<Input />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.approveFlowFlag`).d('是否需要审批流')}
          {...formLayout}
        >
          {getFieldDecorator('approveFlowFlag', {})(<Switch />)}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" style={{ marginRight: 8 }} onClick={onSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button onClick={onReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        </Form.Item>
      </Form>
    );
  }
  render() {
    const { visible, onHideDrawer } = this.props;
    const drawerProps = {
      title: intl.get('hzero.common.view.title').d('更多'),
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
export default MoreFieldsDrawer;
