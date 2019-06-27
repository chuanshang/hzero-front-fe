import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

const FormItem = Form.Item;
/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */

@Form.create({ fieldNameProp: null }) // { fieldNameProp: null }去除浏览器的表单缓存
class FilterForm extends PureComponent {
  // PureComponent纯组件
  constructor(props) {
    super(props);
    props.onRef(this); // 将子函数组件传给父组件
    this.state = {};
  }

  componentDidMount() {}

  /**
   * 查询前校验
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

  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * render
   * @returns React.element
   */
  // 每次点击都会触发render
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <Form layout="inline">
          <FormItem label="工作中心人员名称">
            {getFieldDecorator('workcenterPeopleName', {})(<Input trim />)}
          </FormItem>
          <FormItem label="人员">{getFieldDecorator('contactId', {})(<Input trim />)}</FormItem>
          <FormItem label="用户">{getFieldDecorator('userId', {})(<Input trim />)}</FormItem>
          <FormItem>
            <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {intl.get('hzero.common.button.reset').d('重置')}
            </Button>
            <Button
              style={{ marginLeft: 16 }}
              data-code="search"
              type="primary"
              htmlType="submit"
              onClick={this.handleSearch}
            >
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}

export default FilterForm;
