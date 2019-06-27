/**
 * MaintSites - 服务区域
 * @date: 2019-1-7
 * @author: HBT <baitao.huang@hand-china.com>
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
import { HALM_MDM } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

@connect(({ maintSites, loading }) => ({
  maintSites,
  loading: loading.effects['maintSites/queryMaintSitesList'],
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
    this.state = {};
  }

  componentDidMount() {
    const {
      location: { state: { _back } = {} },
      maintSites: { pagination = {} },
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
    const { dispatch } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'maintSites/queryMaintSitesList',
      payload: {
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
      maintSites: { pagination = {} },
    } = this.props;
    dispatch({
      type: 'maintSites/addMaintSites',
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
  handleMaintSitesLine(maintSitesId) {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amdm/maint-sites/detail/${maintSitesId}` }));
  }

  /**
   * 新增服务区域信息
   */
  @Bind
  handleAddMaintSites() {
    this.setState({ drawerVisible: true, targetItem: {} });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const promptCode = 'amdm.maintSites';
    const { drawerVisible = false, targetItem = {} } = this.state;
    const {
      loading,
      tenantId,
      maintSites: { maintSitesList = [], pagination = {} },
    } = this.props;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      dataSource: maintSitesList,
      onSearch: this.handleSearch,
      onEditLine: this.handleMaintSitesLine,
    };
    const drawerProps = {
      targetItem,
      title: intl.get(`${promptCode}.view.message.drawer`).d('新建服务区域'),
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
        <Header title={intl.get(`${promptCode}.view.message.title`).d('服务区域')}>
          <Button icon="plus" type="primary" onClick={this.handleAddMaintSites}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MDM}/v1/${tenantId}/maint-sites/export`}
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
export default List;
