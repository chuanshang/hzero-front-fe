import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  DEBOUNCE_TIME,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { isFunction } from 'lodash';
import CacheComponent from 'components/CacheComponent';

import MoreFieldsDrawer from './MoreFieldsDrawer';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'aafm/equipment-asset' })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      moreFieldsVisible: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  componentWillUnmount() {
    this.toggleForm.cancel();
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
   * 查询校验
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
   * 更多条件查询滑窗显示
   * @param {boolean} [flag = false] - 显示标记
   */
  @Bind()
  handleMoreFields(flag = false) {
    this.setState({ moreFieldsVisible: flag });
  }

  render() {
    const promptCode = 'aafm.equipmentAsset.model.equipmentAsset';
    const { form, specialAsset, enumMap, tenantId } = this.props;
    const { getFieldDecorator } = form;
    const { moreFieldsVisible = false } = this.state;
    const moreFieldsProps = {
      form,
      tenantId,
      specialAsset,
      enumMap,
      visible: moreFieldsVisible,
      onReset: this.handleFormReset,
      onSearch: this.handleSearch,
      onHideDrawer: this.handleMoreFields,
    };
    return (
      <Fragment>
        <div className="table-list-search">
          <Form className="more-fields-search-form">
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_4_LAYOUT}>
                <Row {...SEARCH_FORM_ROW_LAYOUT}>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${promptCode}.assetDesc`).d('资产全称')}
                      {...SEARCH_FORM_ITEM_LAYOUT}
                    >
                      {getFieldDecorator('assetDesc', {})(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${promptCode}.name`).d('可视标签/铭牌')}
                      {...SEARCH_FORM_ITEM_LAYOUT}
                    >
                      {getFieldDecorator('name', {})(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col {...FORM_COL_3_LAYOUT}>
                    <Form.Item
                      label={intl.get(`${promptCode}.assetNum`).d('资产编号')}
                      {...SEARCH_FORM_ITEM_LAYOUT}
                    >
                      {getFieldDecorator('assetNum', {})(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
                <Form.Item>
                  <Button onClick={() => this.handleMoreFields(true)}>
                    {intl.get('hzero.common.button.viewMore').d('更多查询')}
                  </Button>
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
        <MoreFieldsDrawer {...moreFieldsProps} />
      </Fragment>
    );
  }
}
export default FilterForm;
