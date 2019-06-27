import React, { PureComponent } from 'react';
import { Form, Button, Input, Col, Row } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  FORM_COL_3_4_LAYOUT,
} from 'utils/constants';
import { SEARCH_FORM_ITEM_LAYOUT_2 } from '@/utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
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

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const prefix = `appm.projectType.model.projectType`;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proTypeName`).d('项目类型')}
                  {...SEARCH_FORM_ITEM_LAYOUT_2}
                >
                  {getFieldDecorator('proTypeName', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.proTypeCode`).d('代码')}
                  {...SEARCH_FORM_ITEM_LAYOUT_2}
                >
                  {getFieldDecorator('proTypeCode', {})(<Input trim inputChinese={false} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${prefix}.description`).d('说明')}
                  {...SEARCH_FORM_ITEM_LAYOUT_2}
                >
                  {getFieldDecorator('description', {})(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
            <Form.Item>
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
