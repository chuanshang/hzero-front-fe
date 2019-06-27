import React, { PureComponent } from 'react';
import { Drawer, Button, Form, Input } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';

class MoreFieldsDrawer extends PureComponent {
  renderForm() {
    const {
      onReset,
      onSearch,
      tenantId,
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const promptCode = 'arcv.deliveryList.model.deliveryList';
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.deliveryListName`).d('名称')} {...formLayout}>
          {getFieldDecorator('deliveryListName', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.contract`).d('合同')} {...formLayout}>
          {getFieldDecorator('contractId', {})(
            <Lov code="" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.contractLine`).d('合同行')} {...formLayout}>
          {getFieldDecorator('contractLineId', {})(
            <Lov code="" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.productCategory`).d('产品类别')} {...formLayout}>
          {getFieldDecorator('productCategoryId', {})(
            <Lov code="AAFM.ASSET_CLASS" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.assetsSet`).d('资产组')} {...formLayout}>
          {getFieldDecorator('assetsSetId', {})(
            <Lov code="AAFM.ASSET_SET" queryParams={{ organization: tenantId }} />
          )}
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
