/**
 * assessTemplet - 故障缺陷评估项
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

@connect(({ assessTemplet, loading }) => ({
  assessTemplet,
  loading: loading.effects['assessTemplet/queryAssessTempletList'],
  tenantId: getCurrentOrganizationId(),
}))
class AssessTemplet extends Component {
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
      dispatch,
      location: { state: { _back } = {} },
      assessTemplet: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    dispatch({
      type: 'assessTemplet/init',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'assessTemplet/queryAssessTempletList',
      payload: {
        tenantId,
        page: isEmpty(page) ? {} : page,
      },
    });
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
      type: 'assessTemplet/queryAssessTempletList',
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
  handleGotoDetail(templetId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/assess-templet/detail/${templetId}` }));
  }

  /**
   * 新建故障缺陷评估项
   */
  @Bind()
  handleAddAssessTemplet() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/assess-templet/create` }));
  }

  /**
   * 启用故障缺陷评估项
   * @param faultassessTempletId
   */
  @Bind()
  handleEnabled(templetId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assessTemplet/enabledAssessTemplet',
      payload: { tenantId, templetId },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 禁用故障缺陷评估项
   * @param faultassessTempletId
   */
  @Bind()
  handleDisabled(templetId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assessTemplet/disabledAssessTemplet',
      payload: { tenantId, templetId },
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
    const promptCode = 'amtc.assessTemplet';
    const {
      loading,
      assessTemplet: { assessTempletList = [], assessTempletPagination = {}, enableFlags },
    } = this.props;
    const filterProps = {
      enableFlags,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination: assessTempletPagination,
      loading,
      dataSource: assessTempletList,
      onSearch: this.handleSearch,
      onEditLine: this.handleGotoDetail,
      onDisabledLine: this.handleDisabled,
      onEnabledLine: this.handleEnabled,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('服务评价模版')}>
          <Button icon="plus" type="primary" onClick={this.handleAddAssessTemplet}>
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
export default AssessTemplet;
