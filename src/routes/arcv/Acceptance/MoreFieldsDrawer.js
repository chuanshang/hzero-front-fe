import React, { PureComponent } from 'react';
import { Drawer, Button, Form, Input, DatePicker, Select } from 'hzero-ui';
import moment from 'moment';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';

class MoreFieldsDrawer extends PureComponent {
  renderForm() {
    const {
      tenantId,
      AcceptanceStatusLovMap,
      form: { getFieldDecorator, getFieldValue },
      onReset,
      onSearch,
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const promptCode = 'arcv.acceptance.model.acceptance';
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.acceptanceType`).d('验收类型')} {...formLayout}>
          {getFieldDecorator('acceptanceTypeId', {})(
            <Lov code="ARCV.ACCEPTANCE_ORDER_TYPE" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.acceptanceStatusCode`).d('验收状态')}
          {...formLayout}
        >
          {getFieldDecorator('acceptanceStatusCode', {})(
            <Select style={{ width: 100 }}>
              {AcceptanceStatusLovMap.map(i => (
                <Select.Option key={i.value}>{i.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.principalPerson`).d('负责人')} {...formLayout}>
          {getFieldDecorator('principalPersonId', {})(
            <Lov code="HALM.EMPLOYEE" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.acceptanceNum`).d('验收单编号')} {...formLayout}>
          {getFieldDecorator('acceptanceNum', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.title`).d('标题概述')} {...formLayout}>
          {getFieldDecorator('title', {})(<Input />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.submitDateFrom`).d('验收提交日期从')}
          {...formLayout}
        >
          {getFieldDecorator('submitDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('submitDateTo') &&
                moment(getFieldValue('submitDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.submitDateTo`).d('验收提交日期至')}
          {...formLayout}
        >
          {getFieldDecorator('submitDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('submitDateFrom') &&
                moment(getFieldValue('submitDateFrom')).isAfter(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.completeDateFrom`).d('验收完成日期从')}
          {...formLayout}
        >
          {getFieldDecorator('completeDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('completeDateTo') &&
                moment(getFieldValue('completeDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.completeDateTo`).d('验收完成日期至')}
          {...formLayout}
        >
          {getFieldDecorator('completeDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('completeDateFrom') &&
                moment(getFieldValue('completeDateFrom')).isAfter(currentDate, 'day')
              }
            />
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
