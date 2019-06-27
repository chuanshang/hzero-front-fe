import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Select } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
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
    const { form } = this.props;
    form.resetFields();
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
    const commonModelPrompt = 'amtc.assetRoute.model.assetRoute';
    const { form, tenantId, referenceModeMap } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Form.Item label={intl.get(`${commonModelPrompt}.assetRouteName`).d('资产路线名称')}>
              {getFieldDecorator('assetRouteName', {})(<Input trim />)}
            </Form.Item>
            <Form.Item label={intl.get(`${commonModelPrompt}.maintSites`).d('服务区域')}>
              {getFieldDecorator('maintSitesId', {})(
                <Lov code="AMDM.ASSET_MAINT_SITE" queryParams={{ organization: tenantId }} />
              )}
            </Form.Item>
            <Form.Item label={intl.get(`${commonModelPrompt}.routeModeName`).d('引用模式')}>
              {getFieldDecorator('routeMode', {})(
                <Select style={{ width: 150 }} allowClear>
                  {referenceModeMap.map(item => (
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
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default FilterForm;
