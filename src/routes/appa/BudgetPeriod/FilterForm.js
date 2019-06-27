import React, { PureComponent } from 'react';
import { Form, Button, Input, DatePicker, Row, Col } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 * 查询表单
 * @class FilterForm
 * @extends {PureComponent}
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false, // 查询表单是否展开标识默认不展开
    };
  }

  /**
   * 查询
   * @memberof FilterForm
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
   * 重置查询表单
   * @memberof FilterForm
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * 是否展开查询表单
   * @memberof FilterForm
   */
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
   * @returns
   * @memberof FilterForm
   */
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { expandForm } = this.state;
    const dateFormat = getDateFormat();
    const expandFormStyle = {
      display: 'block',
    };
    const noExpandFormStyle = {
      display: 'none',
    };
    const prefix = 'appa.budgetPeriod.model.budgetPeriod';
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.periodName`).d('名称')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodName')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.periodStartDateFrom`).d('开始时间从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodStartDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder=""
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('periodStartDateTo') &&
                        moment(getFieldValue('periodStartDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.periodStartDateTo`).d('开始时间至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodStartDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder=""
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('periodStartDateFrom') &&
                        moment(getFieldValue('periodStartDateFrom')).isAfter(currentDate, 'day')
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
                  label={intl.get(`${prefix}.periodYear`).d('年度')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodYear')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.periodEndDateFrom`).d('结束时间从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodEndDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder=""
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('periodEndDateTo') &&
                        moment(getFieldValue('periodEndDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.periodEndDateTo`).d('结束时间至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('periodEndDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder=""
                      format={dateFormat}
                      disabledDate={currentDate =>
                        getFieldValue('periodEndDateFrom') &&
                        moment(getFieldValue('periodEndDateFrom')).isAfter(currentDate, 'day')
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
