import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, Row, Col } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'appm/projectTemplate' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
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
    const { form, tenantId, templateStatus } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm = false } = this.state;
    const expandFormStyle = {
      display: 'block',
    };
    const noExpandFormStyle = {
      display: 'none',
    };
    const prefix = `appm.projectTemplate.model.projectTemplate`;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proTemplateName`).d('模板名称')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proTemplateName', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proTemplateCode`).d('模板编码')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proTemplateCode', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proTypeId`).d('项目类型')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proTypeId', {})(
                    <Lov code="APPM.PROJECT_TYPE" queryParams={{ tenantId }} />
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
                  label={intl.get(`${prefix}.proTemplateStatus`).d('模板状态')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('proTemplateStatus', {})(
                    <Select allowClear style={{ width: 150 }}>
                      {templateStatus.map(n => (
                        <Select.Option key={n.value}>{n.meaning}</Select.Option>
                      ))}
                    </Select>
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
