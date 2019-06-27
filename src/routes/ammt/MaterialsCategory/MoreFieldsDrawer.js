import React, { PureComponent } from 'react';
import { Drawer, Button, Form, Input } from 'hzero-ui';
import Switch from 'components/Switch';
import intl from 'utils/intl';

class MoreFieldsDrawer extends PureComponent {
  renderForm() {
    const {
      onReset,
      onSearch,
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const promptCode = 'aafm.productCategory.model.productCategory';
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`aafm.common.model.name`).d('名称')} {...formLayout}>
          {getFieldDecorator('productCategoryName', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.enabledFlag`).d('是否启用')} {...formLayout}>
          {getFieldDecorator('enabledFlag', {})(<Switch />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.Code`).d('代码')} {...formLayout}>
          {getFieldDecorator('productCategoryCode', {})(
            <Input trim typeCase="upper" inputChinese={false} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.description`).d('全称')} {...formLayout}>
          {getFieldDecorator('categoryDescription', {})(<Input />)}
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
      title: intl.get('hzero.common.view.more').d('更多'),
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
