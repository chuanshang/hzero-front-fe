import React, { PureComponent } from 'react';
import { Form, Button, Select, Row, Col, Input, DatePicker } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import moment from 'moment';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { getDateFormat } from 'utils/utils';
import Lov from 'components/Lov';
import CacheComponent from 'components/CacheComponent';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'aatn/dispose-order/detail' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch();
        }
      });
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  componentWillUnmount() {
    this.toggleForm.cancel();
  }

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const disposeOrderModelPrompt = 'aatn.disposeOrder.model.disposeOrder';
    const { expandForm } = this.state;
    const { form, approveStatus = [], tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const dateFormat = getDateFormat();
    const expandFormStyle = {
      display: 'block',
    };
    const noExpandFormStyle = {
      display: 'none',
    };
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${disposeOrderModelPrompt}.transactionTypeId`).d('事务类型')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('transactionTypeId', {})(
                    <Lov code="AAFM.TRANSACTION_TYPES" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${disposeOrderModelPrompt}.processStatus`).d('处理状态')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('processStatus', {})(
                    <Select allowClear>
                      {approveStatus.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${disposeOrderModelPrompt}.principalPersonId`).d('负责人')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('principalPersonId', {})(
                    <Lov code="HALM.EMPLOYEE" queryParams={{ tenantId }} />
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
                  label={intl.get(`${disposeOrderModelPrompt}.transferNum`).d('事务处理单编号')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('transferNum', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${disposeOrderModelPrompt}.titleOverview`).d('标题概述')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('titleOverview', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${disposeOrderModelPrompt}.planStartDateFrom`)
                    .d('计划执行日期从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('planStartDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('planStartDateTo') &&
                        moment(getFieldValue('planStartDateTo')).isBefore(currentDate, 'day')
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
                  label={intl.get(`${disposeOrderModelPrompt}.planStartDateTo`).d('计划执行日期至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('planStartDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('planStartDateFrom') &&
                        moment(getFieldValue('planStartDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${disposeOrderModelPrompt}.planEndDateFrom`).d('计划完成日期从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('planEndDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
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
                  label={intl.get(`${disposeOrderModelPrompt}.planEndDateTo`).d('计划完成日期至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('planEndDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
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
      </Form>
    );
  }
}
export default FilterForm;
