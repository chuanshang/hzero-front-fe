/**
 * WorkProcess - 工序管理
 * @date: 2019-4-18
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ woop, loading }) => ({
  woop,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['woop/fetchWorkProcessListInfo'],
  },
}))
class WorkProcess extends Component {
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
      woop: { pagination = {} },
      location: { state: { _back } = {} },
      tenantId,
      dispatch,
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    dispatch({
      type: 'woop/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch(page);
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'woop/fetchWorkProcessListInfo',
      payload: {
        tenantId,
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 新增
   * 跳转到新增明细页
   */
  @Bind()
  handleAdd() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/work-order/create` }));
  }

  /**
   * 跳转到工作单列表页
   */
  @Bind()
  handleLinkToWorkOrder() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/amtc/work-order` }));
  }

  /**
   * 跳转到详情页
   * @param {string} id id
   */
  @Bind()
  handleLinkToDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/woop/detail/${id}`,
      })
    );
  }

  render() {
    const {
      woop,
      loading: { fetchListLoading },
      woopPagination = {},
    } = this.props;
    const { woopList = [], woopStatusMap } = woop;
    const filterProps = {
      woopStatusMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      loading: fetchListLoading,
      dataSource: woopList,
      pagination: woopPagination,
      onSearch: this.handleSearch,
      onLinkToDetail: this.handleLinkToDetail,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`amtc.woop.view.message.title`).d('工序管理')}>
          <Button icon="plus" type="primary" onClick={this.handleAdd}>
            {intl.get('amtc.common.button.createWorkOrder').d('新建工作单')}
          </Button>
          <Button icon="profile" type="primary" onClick={this.handleLinkToWorkOrder}>
            {intl.get('amtc.common.button.goWorkOrder').d('工作单列表')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default WorkProcess;
