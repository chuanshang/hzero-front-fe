/**
 * DisposeOrder - 资产处置单
 * @date: 2019-3-27
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import { routerRedux } from 'dva/router';
import ExcelExport from 'components/ExcelExport';
import { HALM_ATN } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ disposeOrder, loading }) => ({
  disposeOrder,
  loading: loading.effects['disposeOrder/fetchDisposeOrder'],
  tenantId: getCurrentOrganizationId(),
}))
class List extends Component {
  form;
  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {
      dateTimeFormat: getDateTimeFormat(),
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      location: { state: { _back } = {} },
      disposeOrder: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
    dispatch({ type: 'disposeOrder/fetchLov', payload: { tenantId } });
  }

  /**
   * 数据查询
   * @param {object} page - 查询查询
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const { dateTimeFormat } = this.state;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'disposeOrder/fetchDisposeOrder',
      payload: {
        tenantId,
        ...fieldValues,
        planStartDateFrom: isUndefined(fieldValues.planStartDateFrom)
          ? ''
          : moment(fieldValues.planStartDateFrom).format(dateTimeFormat),
        planStartDateTo: isUndefined(fieldValues.planStartDateTo)
          ? ''
          : moment(fieldValues.planStartDateTo).format(dateTimeFormat),
        planEndDateFrom: isUndefined(fieldValues.planEndDateFrom)
          ? ''
          : moment(fieldValues.planEndDateFrom).format(dateTimeFormat),
        planEndDateTo: isUndefined(fieldValues.planEndDateTo)
          ? ''
          : moment(fieldValues.planEndDateTo).format(dateTimeFormat),
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  @Bind
  handleDisposeOrderDetail(disposeHeaderId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/aatn/dispose-order/detail/${disposeHeaderId}` }));
  }

  /**
   * 新增资产处置单信息
   */
  @Bind
  handleAddDisposeOrder() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aatn/dispose-order/create`,
      })
    );
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'aatn.disposeOrder';
    const {
      loading,
      tenantId,
      disposeOrder: { list = [], approveStatus = [], pagination = {} },
    } = this.props;
    const filterProps = {
      tenantId,
      approveStatus,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      dataSource: list,
      onSearch: this.handleSearch,
      onLinkToDetail: this.handleDisposeOrderDetail,
    };
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('资产处置单')}>
          <Button icon="plus" type="primary" onClick={this.handleAddDisposeOrder}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/dispose/export`}
            queryParams={fieldValues}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default List;
