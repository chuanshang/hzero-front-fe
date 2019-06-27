import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Select, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import {
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

import MoreFieldsDrawer from './MoreFieldsDrawer';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'arcv/acceptance' })
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

  /**
   * 更多条件查询滑窗显示
   * @param {boolean} [flag = false] - 显示标记
   */
  @Bind()
  handleMoreFields(flag = false) {
    this.setState({ moreFieldsVisible: flag });
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

  render() {
    const promptCode = 'arcv.acceptance.model.acceptance';
    const { moreFieldsVisible = false } = this.state;
    const { form, tenantId, AcceptanceStatusLovMap } = this.props;
    const { getFieldDecorator } = form;
    const moreFieldsProps = {
      form,
      tenantId,
      AcceptanceStatusLovMap,
      visible: moreFieldsVisible,
      onReset: this.handleFormReset,
      onSearch: this.handleSearch,
      onHideDrawer: this.handleMoreFields,
    };
    return (
      <Fragment>
        <Form className="more-fields-search-form">
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_4_LAYOUT}>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${promptCode}.acceptanceType`).d('验收类型')}
                    {...SEARCH_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('acceptanceTypeId', {})(
                      <Lov
                        code="ARCV.ACCEPTANCE_ORDER_TYPE"
                        queryParams={{ organization: tenantId }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${promptCode}.acceptanceStatusCode`).d('验收状态')}
                    {...SEARCH_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('acceptanceStatusCode', {})(
                      <Select style={{ width: 100 }}>
                        {AcceptanceStatusLovMap.map(i => (
                          <Select.Option key={i.value}>{i.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${promptCode}.principalPerson`).d('负责人')}
                    {...SEARCH_FORM_ITEM_LAYOUT}
                  >
                    {getFieldDecorator('principalPersonId', {})(
                      <Lov code="HALM.EMPLOYEE" queryParams={{ organization: tenantId }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
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
            </Col>
          </Row>
        </Form>
        <MoreFieldsDrawer {...moreFieldsProps} />
      </Fragment>
    );
  }
}
export default FilterForm;
