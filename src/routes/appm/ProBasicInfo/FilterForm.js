import React, { PureComponent } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { isFunction } from 'lodash';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import CacheComponent from 'components/CacheComponent';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'appm/pro-basic-info' })
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
   * 表单校验
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
    const prefix = 'appm.proBasicInfo.model.proBasicInfo';
    const { form, tenantId, priorityMap } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm = false } = this.state;
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
                  label={intl.get(`${prefix}.prePrjCodeAndPrjCode`).d('预项目编号/项目编号')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('prePrjCodeAndPrjCode', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proType`).d('项目类型')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proTypeId', {})(
                    <Lov code="APPM.PROJECT_TYPE" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proStatus`).d('项目状态')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proStatusId', {})(
                    <Lov code="APPM.PROJECT_STATUS" queryParams={{ organizationId: tenantId }} />
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
                  label={intl.get(`${prefix}.projectName`).d('项目名称')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('projectName', {})(<Input trim />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.manageOrg`).d('项目管理组织')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('manageOrgId', {})(
                    <Lov code="AMDM.ORGANIZATION" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.implementOrg`).d('项目实施组织')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('implementOrgId', {})(
                    <Lov code="AMDM.ORGANIZATION" queryParams={{ organizationId: tenantId }} />
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
                  label={intl.get(`${prefix}.priority`).d('优先级')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('priorityCode', {})(
                    <Select allowClear>
                      {priorityMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.createTimeFrom`).d('创建时间从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('createTimeFrom', {})(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('createTimeTo') &&
                        moment(getFieldValue('createTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.createTimeTo`).d('创建时间至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('createTimeTo', {})(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('createTimeFrom') &&
                        moment(getFieldValue('createTimeFrom')).isAfter(currentDate, 'second')
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
