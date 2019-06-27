import React, { PureComponent } from 'react';
import { Drawer, Form, Button, Input, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { getDateTimeFormat } from 'utils/utils';

class MoreFieldsDrawer extends PureComponent {
  // 弹出日历
  @Bind()
  onOpenChange(status) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    if (status) {
      setFieldsValue({
        schedualedFinishDate: getFieldValue('schedualedStartDateFrom'),
      });
    }
  }

  renderForm() {
    const promptCode = 'amtc.woop.model.woop';
    const {
      tenantId,
      woopStatusMap,
      form: { getFieldDecorator, getFieldValue },
      onReset,
      onSearch,
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.workorderNum`).d('工单编号')} {...formLayout}>
          {getFieldDecorator('workorderNum', {})(<Input trim />)}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.workorderName`).d('工单任务名称')}
          {...formLayout}
        >
          {getFieldDecorator('workorderName', {})(<Input trim />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.woopStatus`).d('状态')} {...formLayout}>
          {getFieldDecorator('woopStatus', {})(
            <Select allowClear>
              {woopStatusMap.map(item => (
                <Select.Option key={item.value}>{item.meaning}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.ownerGroupId`).d('负责人组')} {...formLayout}>
          {getFieldDecorator('ownerGroupId', {})(
            <Lov code="AMTC.SKILLTYPES" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.ownerId`).d('负责人')} {...formLayout}>
          {getFieldDecorator('ownerId', {})(
            <Lov code="AMTC.WORKCENTER_PRINCIPAL" queryParams={{ organizationId: tenantId }} />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.schedualedStartDateFrom`).d('计划开始时间从')}
          {...formLayout}
        >
          {getFieldDecorator('schedualedStartDateFrom', {})(
            <DatePicker
              placeholder=""
              style={{ width: '100%' }}
              format={getDateTimeFormat()}
              disabledDate={currentDate =>
                getFieldValue('schedualedStartDateTo') &&
                moment(getFieldValue('schedualedStartDateTo')).isBefore(currentDate, 'second')
              }
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.schedualedStartDateTo`).d('计划开始时间至')}
          {...formLayout}
        >
          {getFieldDecorator('schedualedStartDateTo', {})(
            <DatePicker
              placeholder=""
              style={{ width: '100%' }}
              format={getDateTimeFormat()}
              showTime
              onOpenChange={this.onOpenChange}
              disabledDate={currentDate =>
                getFieldValue('schedualedStartDateFrom') &&
                moment(getFieldValue('schedualedStartDateFrom')).isAfter(currentDate, 'second')
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
