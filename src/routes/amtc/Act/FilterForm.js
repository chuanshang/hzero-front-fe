import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import CacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';
import { SEARCH_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import { SEARCH_FORM_ITEM_LAYOUT_2 } from '@/utils/constants';
/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'amtc/act/list' })
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
    const commonModelPrompt = 'amtc.act.model.act';
    const { form, tenantId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT_2}
                  label={intl.get(`${commonModelPrompt}.actName`).d('标准作业名称')}
                >
                  {getFieldDecorator('actName', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT_2}
                  label={intl.get(`${commonModelPrompt}.maintSites`).d('服务区域')}
                >
                  {getFieldDecorator('maintSitesId', {})(
                    <Lov code="AMDM.ASSET_MAINT_SITE" queryParams={{ organization: tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT} className="search-btn-more">
                <Form.Item>
                  <Button
                    data-code="reset"
                    style={{ marginLeft: 8 }}
                    onClick={this.handleFormReset}
                  >
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
