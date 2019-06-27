import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import CacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'amtc/service-zone/detail' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
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
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'amtc.faultDefect.model.faultDefect';
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Row>
              <Col span={6}>
                <Form.Item label={intl.get(`${commonModelPrompt}.rcAssesmentName`).d('名称')}>
                  {getFieldDecorator('rcAssesmentName', {})(<Input trim />)}
                </Form.Item>
              </Col>
              <Col span={6}>
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
