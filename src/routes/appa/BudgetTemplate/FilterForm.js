import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { isFunction } from 'lodash';
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
@CacheComponent({ cacheKey: 'appa.budgetTemplate' })
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
  /**
   * 多查询条件展示
   */
  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }
  render() {
    const promptCode = 'appa.budgetTemplate.model.budgetTemplate';
    const { expandForm = false } = this.state;
    const { form, tenantId } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Form className="more-fields-search-form">
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_4_LAYOUT}>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${promptCode}.templateCode`).d('模板编号')}
                  >
                    {getFieldDecorator('templateCode', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${promptCode}.templateName`).d('模板名称')}
                  >
                    {getFieldDecorator('templateName', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${promptCode}.proType`).d('项目类型')}
                  >
                    {getFieldDecorator('proTypeId', {})(
                      <Lov code="APPM.PROJECT_TYPE" queryParams={{ organizationId: tenantId }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${promptCode}.budgetType`).d('预算类型')}
                  >
                    {getFieldDecorator('budgetTypeId', {})(
                      <Lov
                        code="APPA.BUDGET_TYPE_SETTING"
                        queryParams={{ organizationId: tenantId }}
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
                <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button
                  data-code="search"
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 8 }}
                  onClick={this.handleSearch}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
export default FilterForm;
