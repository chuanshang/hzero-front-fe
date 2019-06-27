import React, { PureComponent } from 'react';
import { Form, Modal, Button, Row, Col, Input, Select, InputNumber, DatePicker } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
class FilterModal extends PureComponent {
  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }
  /**
   * 选择字段后查询
   */
  @Bind()
  handleSearch() {
    const { form, onSearch, onCancel } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSearch({
          ...values,
          startDateFrom: values.startDateFrom
            ? moment(values.startDateFrom).format(getDateTimeFormat())
            : null,
          startDateTo: values.startDateTo
            ? moment(values.startDateTo).format(getDateTimeFormat())
            : null,
        });
        onCancel();
      }
    });
  }

  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const {
      wbsPlanHeader,
      modalVisible,
      taskTypeMap,
      tenantId,
      riskLevelMap,
      priorityMap,
      onCancel,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const longFormLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Modal
        destroyOnClose
        width={600}
        title={intl.get(`${prefix}.filter`).d('筛选任务')}
        visible={modalVisible}
        onCancel={onCancel}
        footer={
          <React.Fragment>
            <Button type="primary" onClick={this.handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
            <Button type="primary" onClick={this.handleFormReset}>
              {intl.get('hzero.common.button.reset').d('重置')}
            </Button>
          </React.Fragment>
        }
      >
        <React.Fragment>
          <Form className="table-list-search">
            <Row>
              <Col span={22}>
                <Form.Item label={intl.get(`${prefix}.taskName`).d('任务名称')} {...longFormLayout}>
                  {getFieldDecorator('taskName', {})(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={intl.get(`${prefix}.principalPerson`).d('负责人')}
                  {...formLayout}
                >
                  {getFieldDecorator('principalPersonId', {})(
                    <Lov
                      code="APPM.PROJECT_RESOURCE"
                      queryParams={{
                        tenantId,
                        projectId: wbsPlanHeader.projectId,
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={intl.get(`${prefix}.taskType`).d('任务类型')} {...formLayout}>
                  {getFieldDecorator('taskTypeCode', {})(
                    <Select allowClear style={{ width: '100%' }}>
                      {taskTypeMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label={intl.get(`${prefix}.priority`).d('优先级')} {...formLayout}>
                  {getFieldDecorator('priorityCode', {})(
                    <Select allowClear style={{ width: '100%' }}>
                      {priorityMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={intl.get(`${prefix}.riskLevel`).d('风险等级')} {...formLayout}>
                  {getFieldDecorator('riskLevel', {})(
                    <Select allowClear style={{ width: '100%' }}>
                      {riskLevelMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label={intl.get(`${prefix}.scheduleRate`).d('进度从')} {...formLayout}>
                  {getFieldDecorator('scheduleRateFrom', {})(
                    <InputNumber
                      min={0}
                      max={100}
                      style={{ width: '100%' }}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={intl.get(`${prefix}.scheduleRateTo`).d('进度至')} {...formLayout}>
                  {getFieldDecorator('scheduleRateTo', {})(
                    <InputNumber
                      min={getFieldValue('scheduleRateFrom')}
                      max={100}
                      style={{ width: '100%' }}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={intl.get(`${prefix}.startDateFrom`).d('开始日期从')}
                  {...formLayout}
                >
                  {getFieldDecorator('startDateFrom', {})(
                    <DatePicker
                      format={getDateFormat()}
                      style={{ width: '100%' }}
                      placeholder=""
                      disabledDate={currentDate =>
                        getFieldValue('startDateTo') &&
                        moment(getFieldValue('startDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  label={intl.get(`${prefix}.startDateTo`).d('开始日期至')}
                  {...formLayout}
                >
                  {getFieldDecorator('startDateTo', {})(
                    <DatePicker
                      format={getDateFormat()}
                      style={{ width: '100%' }}
                      placeholder=""
                      disabledDate={currentDate =>
                        getFieldValue('startDateFrom') &&
                        moment(getFieldValue('startDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}
export default FilterModal;
