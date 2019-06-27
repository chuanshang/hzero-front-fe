import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, Row, Col, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import CacheComponent from 'components/CacheComponent';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: '/amtc/WorkOrder/Detail' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {};
  }

  componentWillUnmount() {
    this.toggleForm.cancel();
  }

  /**
   * 编辑保存前校验
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
    const commonModelPrompt = 'amtc.workOrder.model.workOrder';
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { tenantId, selectMaps } = this.props;
    const { expandForm } = this.state;
    const { woStatusMap } = selectMaps;

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
                  label={intl.get(`${commonModelPrompt}.woName`).d('工单概述')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('woName', {})(<Input trim />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.woTypeId`).d('工单类型')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('woTypeId', {})(
                    <Lov code="AMTC.WORKORDERTYPES" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.woStatus`).d('工单状态')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('woStatus', {})(
                    <Select style={{ width: 150 }} allowClear>
                      {woStatusMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
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
                  label={intl.get(`${commonModelPrompt}.ownerGroupId`).d('负责人组')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('ownerGroupId', {})(
                    <Lov code="AMTC.SKILLTYPES" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.ownerId`).d('负责人')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('ownerId', {})(
                    <Lov code="AMTC.SKILLTYPES" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.assetLocationId`).d('位置')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('assetLocationId', {})(
                    <Lov code="AMDM.LOCATIONS" queryParams={{ organizationId: tenantId }} />
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
                  label={intl.get(`${commonModelPrompt}.plannerId`).d('签派/计划员')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('plannerId', {})(
                    <Lov code="AMTC.SKILLTYPES" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.woNum`).d('工单编号')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('woNum', {})(<Input trim />)}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...SEARCH_FORM_ROW_LAYOUT}
              style={expandForm ? expandFormStyle : noExpandFormStyle}
            >
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl
                    .get(`${commonModelPrompt}.scheduledStartDateFrom`)
                    .d('计划开始时间从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('scheduledStartDateFrom', {})(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('scheduledStartDateTo') &&
                        moment(getFieldValue('scheduledStartDateTo')).isBefore(
                          currentDate,
                          'second'
                        )
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.scheduledStartDateTo`).d('计划开始时间至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('scheduledStartDateTo', {})(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      showTime
                      onOpenChange={this.onOpenChange}
                      disabledDate={currentDate =>
                        getFieldValue('scheduledStartDateFrom') &&
                        moment(getFieldValue('scheduledStartDateFrom')).isAfter(
                          currentDate,
                          'second'
                        )
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
