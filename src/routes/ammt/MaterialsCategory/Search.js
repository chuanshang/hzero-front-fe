import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input } from 'hzero-ui';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import MoreFieldsDrawer from './MoreFieldsDrawer';

const modelPrompt = 'aafm.productCategory.model.productCategory';
/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      moreFieldsVisible: false,
    };
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
   * 更多条件查询滑窗显示
   * @param {boolean} [flag = false] - 显示标记
   */
  @Bind()
  handleMoreFields(flag = false) {
    this.setState({ moreFieldsVisible: flag });
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
    const { moreFieldsVisible = false } = this.state;
    const { getFieldDecorator } = form;
    const moreFieldsProps = {
      form,
      visible: moreFieldsVisible,
      onReset: this.handleFormReset,
      onSearch: this.handleSearch,
      onHideDrawer: this.handleMoreFields,
    };
    return (
      <Fragment>
        <Form layout="inline">
          <Form.Item label={intl.get(`aafm.common.model.name`).d('名称')}>
            {getFieldDecorator('itemCategoryName', {})(<Input />)}
          </Form.Item>
          <Form.Item label={intl.get(`${modelPrompt}.Code`).d('代码')}>
            {getFieldDecorator('itemCategoryCode', {})(
              <Input trim typeCase="upper" inputChinese={false} />
            )}
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
            <Button style={{ marginLeft: 8 }} onClick={() => this.handleMoreFields(true)}>
              {intl.get('hzero.common.button.more').d('更多')}
            </Button>
          </Form.Item>
        </Form>
        <MoreFieldsDrawer {...moreFieldsProps} />
      </Fragment>
    );
  }
}
