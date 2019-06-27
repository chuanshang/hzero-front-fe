import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import CacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';
import {
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
    const commonModelPrompt = 'amtc.bom.model.bom';
    const { form, tenantId, ParentTypeMap } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.bomName`).d('BOM名称')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('bomName', {})(<Input trim />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.parentTypeCode`).d('BOM对象类别')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('parentTypeCode', {})(
                    <Select style={{ width: 150 }} allowClear>
                      {ParentTypeMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.maintSites`).d('服务区域')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('maintSitesId', {})(
                    <Lov code="AMDM.ASSET_MAINT_SITE" queryParams={{ organization: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
                <Form.Item>
                  <Button data-code="reset" onClick={this.handleFormReset}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <Button
                    data-code="search"
                    type="primary"
                    htmlType="submit"
                    onClick={this.handleSearch}
                  >
                    {intl.get('hzero.common.button.search').d('查询')}
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
