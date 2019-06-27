import React, { PureComponent } from 'react';
import { Drawer, Button, Form, Select, Input, DatePicker } from 'hzero-ui';
import moment from 'moment';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';

class MoreFieldsDrawer extends PureComponent {
  renderForm() {
    const {
      onReset,
      onSearch,
      specialAsset,
      enumMap,
      tenantId,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const promptCode = 'aafm.equipmentAsset.model.equipmentAsset';
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.assetDesc`).d('资产全称')} {...formLayout}>
          {getFieldDecorator('assetDesc', {})(<Input trim />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.name`).d('可视标签/铭牌')} {...formLayout}>
          {getFieldDecorator('name', {})(<Input trim inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.assetNum`).d('资产编号')} {...formLayout}>
          {getFieldDecorator('assetNum', {})(<Input trim inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.assetsSetName`).d('产品/资产组')} {...formLayout}>
          {getFieldDecorator('assetsSetId', {})(
            <Lov code="AMDM.ASSET_SET" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.assetClassCode`).d('产品类别/资产分类')}
          {...formLayout}
        >
          {getFieldDecorator('assetClassCode', {})(
            <Lov code="AMDM.ASSET_CLASS" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.brand`).d('品牌/厂商')} {...formLayout}>
          {getFieldDecorator('brand', {})(<Input trim />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.model`).d('规格/型号')} {...formLayout}>
          {getFieldDecorator('model', {})(<Input trim />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.assetCriticality`).d('资产重要性')}
          {...formLayout}
        >
          {getFieldDecorator('assetCriticality', {})(
            <Lov code="" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.serialNum`).d('序列号')} {...formLayout}>
          {getFieldDecorator('serialNum', {})(<Input trim inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.trackingNum`).d('其他跟踪编号')} {...formLayout}>
          {getFieldDecorator('trackingNum', {})(<Input trim inputChinese={false} />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.receivedDateFrom`).d('交付日期从')}
          {...formLayout}
        >
          {getFieldDecorator('receivedDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('receivedDateTo') &&
                moment(getFieldValue('receivedDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.receivedDateTo`).d('交付日期至')} {...formLayout}>
          {getFieldDecorator('receivedDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('receivedDateFrom') &&
                moment(getFieldValue('receivedDateFrom')).isAfter(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.startDateFrom`).d('启用日期从')} {...formLayout}>
          {getFieldDecorator('startDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('startDateTo') &&
                moment(getFieldValue('startDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.startDateTo`).d('启用日期至')} {...formLayout}>
          {getFieldDecorator('startDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('startDateFrom') &&
                moment(getFieldValue('startDateFrom')).isAfter(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.assetLocationName`).d('资产位置')}
          {...formLayout}
        >
          {getFieldDecorator('assetLocationDesc', {})(
            <Lov code="AATN.ASSET_LOCATION" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.subLocationFlag`).d('包含子位置')}
          {...formLayout}
        >
          {getFieldDecorator('subLocationFlag', {})(
            <Select allowClear>
              {enumMap.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.owningOrgCode`).d('所属组织')} {...formLayout}>
          {getFieldDecorator('owningOrgCode', {})(
            <Lov code="AMDM.ORGANIZATION" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.subOrgFlag`).d('包含子组织')} {...formLayout}>
          {getFieldDecorator('subOrgFlag', {})(
            <Select allowClear>
              {enumMap.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.usingOrgCode`).d('使用组织')} {...formLayout}>
          {getFieldDecorator('usingOrgCode', {})(
            <Lov code="AATN.ASSET_USING_ORG" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.subOrgFlag`).d('包含子组织')} {...formLayout}>
          {getFieldDecorator('subOrgFlag', {})(
            <Select allowClear>
              {enumMap.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.specialAssetCode`).d('所属特殊资产')}
          {...formLayout}
        >
          {getFieldDecorator('specialAssetCode', {})(
            <Select allowClear>
              {specialAsset.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.owningMajorCode`).d('资产专业分类')}
          {...formLayout}
        >
          {getFieldDecorator('owningMajorCode')(
            <Lov code="AMDM.SPECIAL_ASSET_CLASS" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.description`).d('说明')} {...formLayout}>
          {getFieldDecorator('description', {})(<Input.TextArea rows={3} />)}
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
