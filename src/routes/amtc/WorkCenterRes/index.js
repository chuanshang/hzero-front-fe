/**
 * WorkCenterRes - 技能类型
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
import ExcelExport from 'components/ExcelExport';
import { HALM_MTC } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

@connect(({ workCenterRes, loading }) => ({
  workCenterRes,
  loading: loading.effects['workCenterRes/queryWorkCenterResList'],
  tenantId: getCurrentOrganizationId(),
}))
class WorkCenterRes extends Component {
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
      location: { state: { _back } = {} },
      workCenterRes: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
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
      type: 'workCenterRes/queryWorkCenterResList',
      payload: {
        tenantId,
        ...fieldValues,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const {
      tenantId,
      dispatch,
      workCenterRes: { pagination = {} },
    } = this.props;
    dispatch({
      type: 'workCenterRes/saveAddData',
      payload: { tenantId, ...values },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch(pagination);
        this.setState({ targetItem: {}, drawerVisible: false });
      }
    });
  }

  /**
   * Drawer close
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false, targetItem: {} });
  }

  @Bind
  handleWorkCenterResDetail(workcenterResId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/work-center-res/detail/${workcenterResId}` }));
  }

  /**
   * 新增工作中心信息
   */
  @Bind
  handleAddWorkCenterRes() {
    this.setState({ drawerVisible: true, targetItem: {} });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'amtc.workCenterRes';
    const { drawerVisible = false, targetItem = {} } = this.state;
    const {
      loading,
      tenantId,
      workCenterRes: { list = [], pagination = {} },
    } = this.props;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      dataSource: list,
      onSearch: this.handleSearch,
      onEditLine: this.handleWorkCenterResDetail,
    };
    const drawerProps = {
      tenantId,
      targetItem,
      title: intl.get(`${promptCode}.view.message.drawer`).d('新建技能类型'),
      anchor: 'right',
      maskClosable: false,
      visible: drawerVisible,
      onCancel: this.handleDrawerCancel,
      onOk: this.handleDrawerOk,
    };
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('技能类型')}>
          <Button icon="plus" type="primary" onClick={this.handleAddWorkCenterRes}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/workcenter-res/export`}
            queryParams={fieldValues}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <Drawer {...drawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default WorkCenterRes;
