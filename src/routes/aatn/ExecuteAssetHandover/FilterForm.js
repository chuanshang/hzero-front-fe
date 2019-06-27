import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Select, Row, Col, DatePicker, Input, Icon, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import { getDateFormat } from 'utils/utils';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'aatn/asset-handover' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      display: true,
    };
  }
  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }
  /**
   * 查询校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }
  /**
   * 多查询条件展示
   */
  @Bind()
  toggleForm() {
    const { display } = this.state;
    this.setState({
      display: !display,
    });
  }
  render() {
    const promptCode = 'aatn.executeAssetHandover.model.executeAssetHandover';
    const { form, tenantId, processStatusHeaderMap, processStatusLineMap } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { display } = this.state;
    const formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const midLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline" className="more-fields-form">
            <Row>
              <Col span={18}>
                <Tabs>
                  <Tabs.TabPane
                    key="header"
                    tab={intl.get(`${promptCode}.header`).d('按事务处理单查找')}
                  >
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.transactionType`).d('事务类型')}
                          {...formLayout}
                        >
                          {getFieldDecorator('transactionTypeId', {})(
                            <Lov
                              code="AAFM.TRANSACTION_TYPES"
                              queryParams={{ organization: tenantId }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.processStatus`).d('处理状态')}
                          {...formLayout}
                        >
                          {getFieldDecorator('processStatus', {})(
                            <Select style={{ width: '100%' }} allowClear>
                              {processStatusHeaderMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.principalPerson`).d('负责人')}
                          {...formLayout}
                        >
                          {getFieldDecorator('principalPersonId', {})(
                            <Lov code="HALM.EMPLOYEE" queryParams={{ tenantId }} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ display: display ? 'none' : 'block' }}>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.handoverNum`).d('事务处理单编号')}
                          {...formLayout}
                        >
                          {getFieldDecorator('handoverNum', {})(<Input />)}
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          label={intl.get(`${promptCode}.titleOverview`).d('标题概述')}
                          {...midLayout}
                        >
                          {getFieldDecorator('titleOverview', {})(<Input />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ display: display ? 'none' : 'block' }}>
                      <Col span={8}>
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
                                moment(getFieldValue('planStartDateTo')).isBefore(
                                  currentDate,
                                  'day'
                                )
                              }
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
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
                                moment(getFieldValue('planStartDateFrom')).isAfter(
                                  currentDate,
                                  'day'
                                )
                              }
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ display: display ? 'none' : 'block' }}>
                      <Col span={8}>
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
                      </Col>
                      <Col span={8}>
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
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key="line"
                    tab={intl.get(`${promptCode}.line`).d('按事务处理行查找')}
                  >
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.equipmentAsset`).d('设备/资产')}
                          {...formLayout}
                        >
                          {getFieldDecorator('assetId', {})(
                            <Lov
                              code="AAFM.ASSET_PARENT"
                              queryParams={{ organization: tenantId }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={intl.get(`${promptCode}.lineProcessStatus`).d('处理状态')}
                          {...formLayout}
                        >
                          {getFieldDecorator('lineProcessStatus', {})(
                            <Select style={{ width: '100%' }}>
                              {processStatusLineMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Col>
              <Col span={6} className="search-btn-more">
                <Form.Item>
                  <Button
                    data-code="search"
                    type="primary"
                    htmlType="submit"
                    onClick={this.handleSearch}
                  >
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                  <Button
                    data-code="reset"
                    style={{ marginLeft: 8 }}
                    onClick={this.handleFormReset}
                  >
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <a
                    style={{ marginLeft: 8, display: display ? 'inline-block' : 'none' }}
                    onClick={() => this.toggleForm()}
                  >
                    {intl.get(`hzero.common.button.expand`).d('收起')} <Icon type="down" />
                  </a>
                  <a
                    style={{ marginLeft: 8, display: display ? 'none' : 'inline-block' }}
                    onClick={() => this.toggleForm()}
                  >
                    {intl.get(`hzero.common.button.up`).d('展开')} <Icon type="up" />
                  </a>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default FilterForm;
