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
      tenantId,
      processStatusHeaderMap,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const promptCode = 'aatn.assetStatusChange.model.assetStatusChange';
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.transactionType`).d('事务类型')} {...formLayout}>
          {getFieldDecorator('transactionTypeId', {})(
            <Lov code="AAFM.TRANSACTION_TYPES" queryParams={{ organization: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.processStatus`).d('处理状态')} {...formLayout}>
          {getFieldDecorator('processStatus', {})(
            <Select>
              {processStatusHeaderMap.map(i => (
                <Select.Option key={i.value}>{i.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.principalPerson`).d('负责人')} {...formLayout}>
          {getFieldDecorator('principalPersonId', {})(
            <Lov code="HALM.EMPLOYEE" queryParams={{ tenantId }} />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.handoverNum`).d('事务处理单编号')}
          {...formLayout}
        >
          {getFieldDecorator('handoverNum', {})(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.titleOverview`).d('标题概述')} {...formLayout}>
          {getFieldDecorator('titleOverview', {})(<Input />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.planStartDateFrom`).d('计划执行日期从')}
          {...formLayout}
        >
          {getFieldDecorator('planStartDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('planStartDateTo') &&
                moment(getFieldValue('planStartDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.planStartDateTo`).d('计划执行日期至')}
          {...formLayout}
        >
          {getFieldDecorator('planStartDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('planStartDateFrom') &&
                moment(getFieldValue('planStartDateFrom')).isAfter(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.planEndDateFrom`).d('计划完成日期从')}
          {...formLayout}
        >
          {getFieldDecorator('planEndDateFrom', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('planEndDateTo') &&
                moment(getFieldValue('planEndDateTo')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.planEndDateTo`).d('计划完成日期至')}
          {...formLayout}
        >
          {getFieldDecorator('planEndDateTo', {})(
            <DatePicker
              placeholder=""
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('planEndDateFrom') &&
                moment(getFieldValue('planEndDateFrom')).isAfter(currentDate, 'day')
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
