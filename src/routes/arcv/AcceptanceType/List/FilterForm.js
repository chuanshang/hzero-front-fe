import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Select } from 'hzero-ui';
import Switch from 'components/Switch';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import CacheComponent from 'components/CacheComponent';

import MoreFieldsDrawer from './MoreFieldsDrawer';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'arcv/acceptanceType' })
class FilterForm extends PureComponent {
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
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
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
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'atcv.acceptanceType.model.acceptanceType';
    const { form, tenantId, transferFixed, acceptanceType } = this.props;
    const { getFieldDecorator } = form;
    const { moreFieldsVisible = false } = this.state;
    const moreFieldsProps = {
      form,
      tenantId,
      transferFixed,
      acceptanceType,
      visible: moreFieldsVisible,
      onReset: this.handleFormReset,
      onSearch: this.handleSearch,
      onHideDrawer: this.handleMoreFields,
    };
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Form.Item label={intl.get(`${commonModelPrompt}.onlySearchEnable`).d('仅查询已启用')}>
              {getFieldDecorator('enabledFlag', {})(<Switch />)}
            </Form.Item>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.acceptanceTypeCode`).d('验收基础类型')}
            >
              {getFieldDecorator('acceptanceTypeCode', {})(
                <Select style={{ width: 150 }} allowClear>
                  {acceptanceType.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={intl.get(`${commonModelPrompt}.transferFixedCode`).d('是否转固')}>
              {getFieldDecorator('transferFixedCode', {})(
                <Select style={{ width: 150 }} allowClear>
                  {transferFixed.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
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
        </div>
        <MoreFieldsDrawer {...moreFieldsProps} />
      </Fragment>
    );
  }
}
export default FilterForm;
