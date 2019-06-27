import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Select, Input, Row, Col, Tabs, DatePicker } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import moment from 'moment';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import { getDateFormat } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { SEARCH_FORM_ITEM_LAYOUT_2 } from '@/utils/constants';

// import MoreFieldsDrawer from './MoreFieldsDrawer';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'aatn/asset-scrap-dispose' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
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
  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }
  render() {
    const promptCode = 'aatn.assetScrapDispose.model.assetScrapDispose';
    const { expandForm = false } = this.state;
    const {
      form,
      tenantId,
      processStatusHeaderMap = [],
      scrapLineProcessStatusMap = [],
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const expandFormStyle = {
      display: 'block',
    };
    const noExpandFormStyle = {
      display: 'none',
    };
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline" className="more-fields-form">
            <Tabs defaultActiveKey="header" type="card">
              <Tabs.TabPane
                tab={intl.get(`${promptCode}.searchByHeaderData`).d('按报废单查找')}
                key="header"
              >
                <Row {...SEARCH_FORM_ROW_LAYOUT}>
                  <Col {...FORM_COL_3_4_LAYOUT}>
                    <Row {...SEARCH_FORM_ROW_LAYOUT}>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.transactionType`).d('事务类型')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
                        >
                          {getFieldDecorator('transactionTypeId', {})(
                            <Lov
                              code="AAFM.TRANSACTION_TYPES"
                              queryParams={{ organization: tenantId }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.processStatus`).d('处理状态')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
                        >
                          {getFieldDecorator('processStatus', {})(
                            <Select style={{ width: 100 }}>
                              {processStatusHeaderMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.titleOverview`).d('标题概述')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
                        >
                          {getFieldDecorator('titleOverview')(<Input />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row
                      {...SEARCH_FORM_ROW_LAYOUT}
                      style={expandForm ? expandFormStyle : noExpandFormStyle}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.principalPerson`).d('负责人')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
                        >
                          {getFieldDecorator('principalPersonId', {})(
                            <Lov code="HALM.EMPLOYEE" queryParams={{ tenantId }} />
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.scrapNum`).d('资产报废单编号')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
                        >
                          {getFieldDecorator('scrapNum', {})(<Input />)}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.planStartDateFrom`).d('计划执行日期从')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
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
                    </Row>
                    <Row
                      {...SEARCH_FORM_ROW_LAYOUT}
                      style={expandForm ? expandFormStyle : noExpandFormStyle}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.planStartDateTo`).d('计划执行日期至')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
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
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.planEndDateFrom`).d('计划完成日期从')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
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
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${promptCode}.planEndDateTo`).d('计划完成日期至')}
                          {...SEARCH_FORM_ITEM_LAYOUT}
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
                  </Col>
                  <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
                    <Form.Item>
                      <Button onClick={this.toggleForm}>
                        {expandForm
                          ? intl.get('hzero.common.button.collected').d('收起查询')
                          : intl.get('hzero.common.button.viewMore').d('更多查询')}
                      </Button>
                      <Button onClick={this.handleFormReset}>
                        {intl.get('hzero.common.button.reset').d('重置')}
                      </Button>
                      <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                        {intl.get('hzero.common.button.search').d('查询')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={intl.get(`${promptCode}.searchByLineData`).d('按报废单行查找')}
                key="line"
              >
                <Row {...SEARCH_FORM_ROW_LAYOUT}>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${promptCode}.transactionType`).d('设备/资产')}
                      {...SEARCH_FORM_ITEM_LAYOUT_2}
                    >
                      {getFieldDecorator('assetId', {})(
                        <Lov code="AAFM.ASSET_PARENT" queryParams={{ organization: tenantId }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${promptCode}.lineProcessStatus`).d('处理状态')}
                      {...SEARCH_FORM_ITEM_LAYOUT_2}
                    >
                      {getFieldDecorator('lineProcessStatus', {})(
                        <Select style={{ width: 100 }}>
                          {scrapLineProcessStatusMap.map(i => (
                            <Select.Option key={i.value}>{i.meaning}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...FORM_COL_3_LAYOUT} className="search-btn-more">
                    <Form.Item>
                      <Button
                        data-code="reset"
                        style={{ marginLeft: 8 }}
                        onClick={this.handleFormReset}
                      >
                        {intl.get('hzero.common.button.reset').d('重置')}
                      </Button>
                      <Button
                        data-code="search"
                        type="primary"
                        htmlType="submit"
                        onClick={this.handleSearch}
                      >
                        {intl.get('hzero.common.button.search').d('查询')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default FilterForm;
