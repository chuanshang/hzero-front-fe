/**
 * rcSystem - 故障缺陷
 * @date: 2019-4-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { routerRedux } from 'dva/router';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ rcSystem, loading }) => ({
  rcSystem,
  loading: loading.effects['rcSystem/queryRcSystemList'],
  tenantId: getCurrentOrganizationId(),
}))
class RcSystem extends Component {
  form;

  /**
   * state初始化
   * @param {props} props -参数
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      tenantId,
      location: { state: { _back } = {} },
      rcSystem: { rcSystemPagination = {} },
      dispatch,
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? rcSystemPagination : {};
    dispatch({
      type: 'rcSystem/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch(page);
  }

  /**
   * 数据查询
   * @param {object} page - 查询查询
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'rcSystem/queryRcSystemList',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * 跳转详情页面
   * @param rcSystemId
   */
  @Bind()
  handleGotoDetail(rcSystemId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/rc-systems/detail/${rcSystemId}` }));
  }

  /**
   * 新建故障缺陷
   */
  @Bind()
  handleAddRcSystem() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/rc-systems/create` }));
  }

  /**
   * 启用故障缺陷
   * @param rcSystemId
   */
  @Bind()
  handleEnabled(rcSystemId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'rcSystem/enabledRcSystem',
      payload: { tenantId, rcSystemId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 禁用故障缺陷
   * @param rcSystemId
   */
  @Bind()
  handleDisabled(rcSystemId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'rcSystem/disabledRcSystem',
      payload: { tenantId, rcSystemId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'amtc.rcSystem';
    const {
      loading,
      rcSystem: { rcSystemList = [], rcSystemPagination = {} },
    } = this.props;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination: rcSystemPagination,
      loading,
      dataSource: rcSystemList,
      onSearch: this.handleSearch,
      onEditLine: this.handleGotoDetail,
      onDisabledLine: this.handleDisabled,
      onEnabledLine: this.handleEnabled,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('故障缺陷')}>
          <Button icon="plus" type="primary" onClick={this.handleAddRcSystem}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default RcSystem;
