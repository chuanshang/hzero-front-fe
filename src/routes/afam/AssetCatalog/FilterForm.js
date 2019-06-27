/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
import React, { PureComponent } from 'react';
import { Form, Button, Input } from 'hzero-ui';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
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
  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'afam.assetCatalog.model.assetCatalog';
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Form.Item label={intl.get(`${modelPrompt}.catalogName`).d('名称')}>
          {getFieldDecorator('catalogName', {})(<Input trim />)}
        </Form.Item>
        <Form.Item label={intl.get(`${modelPrompt}.catalogCode`).d('代码')}>
          {getFieldDecorator('catalogCode', {})(<Input trim />)}
        </Form.Item>
        <Form.Item label={intl.get(`${modelPrompt}.enabledFlag`).d('是否启用')}>
          {getFieldDecorator('enabledFlag', {})(<Switch />)}
        </Form.Item>
        <Form.Item>
          <Button data-code="search" type="primary" htmlType="submit" onClick={this.handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default FilterForm;
