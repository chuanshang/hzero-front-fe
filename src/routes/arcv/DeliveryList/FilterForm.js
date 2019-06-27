import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';

import MoreFieldsDrawer from './MoreFieldsDrawer';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: 'arcv/delivery-list' })
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
    const promptCode = 'arcv.deliveryList.model.deliveryList';
    const { moreFieldsVisible = false } = this.state;
    const { form, tenantId } = this.props;
    const { getFieldDecorator } = form;
    const moreFieldsProps = {
      form,
      tenantId,
      visible: moreFieldsVisible,
      onReset: this.handleFormReset,
      onSearch: this.handleSearch,
      onHideDrawer: this.handleMoreFields,
    };
    return (
      <Fragment>
        <div className="table-list-search">
          <Form layout="inline">
            <Form.Item label={intl.get(`${promptCode}.deliveryListName`).d('名称')}>
              {getFieldDecorator('deliveryListName', {})(<Input />)}
            </Form.Item>
            <Form.Item label={intl.get(`${promptCode}.contract`).d('合同')}>
              {getFieldDecorator('contractId', {})(
                <Lov code="" queryParams={{ organization: tenantId }} />
              )}
            </Form.Item>
            <Form.Item label={intl.get(`${promptCode}.contractLine`).d('合同行')}>
              {getFieldDecorator('contractLineId', {})(
                <Lov code="" queryParams={{ organization: tenantId }} />
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
