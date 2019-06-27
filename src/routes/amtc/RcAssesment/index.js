/**
 * rcAssesment - 故障缺陷评估项
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
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { routerRedux } from 'dva/router';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ rcAssesment, loading }) => ({
  rcAssesment,
  loading: loading.effects['rcAssesment/queryRcSystemList'],
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
      rcAssesment: { rcAssesmentPagination = {} },
      dispatch,
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? rcAssesmentPagination : {};
    dispatch({
      type: 'rcAssesment/init',
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
      type: 'rcAssesment/queryRcSystemList',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * 跳转详情页面
   * @param faultDefectId
   */
  @Bind()
  handleGotoDetail(rcAssesmentId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/rc-assesment/detail/${rcAssesmentId}` }));
  }

  /**
   * 新建故障缺陷评估项
   */
  @Bind()
  handleAddRcAssesment() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/rc-assesment/create` }));
  }

  /**
   * 启用故障缺陷评估项
   * @param faultrcAssesmentId
   */
  @Bind()
  handleEnabled(rcAssesmentId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'rcAssesment/enabledRcSystem',
      payload: { tenantId, rcAssesmentId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 禁用故障缺陷评估项
   * @param faultrcAssesmentId
   */
  @Bind()
  handleDisabled(rcAssesmentId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'rcAssesment/disabledRcSystem',
      payload: { tenantId, rcAssesmentId },
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
    const promptCode = 'amtc.rcAssesment';
    const {
      loading,
      rcAssesment: { rcAssesmentList = [], rcAssesmentPagination = {} },
    } = this.props;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination: rcAssesmentPagination,
      loading,
      dataSource: rcAssesmentList,
      onSearch: this.handleSearch,
      onEditLine: this.handleGotoDetail,
      onDisabledLine: this.handleDisabled,
      onEnabledLine: this.handleEnabled,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('故障缺陷评估项')}>
          <Button icon="plus" type="primary" onClick={this.handleAddRcAssesment}>
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
