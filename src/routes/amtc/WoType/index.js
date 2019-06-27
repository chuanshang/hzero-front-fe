/**
 * WoType - 工单类型
 * @date: 2019-4-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HALM_MTC } from '@/utils/config';
import intl from 'utils/intl';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ woType, loading }) => ({
  woType,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['woType/queryWoTypeTreeList'],
  },
}))
class WoType extends Component {
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
    const { tenantId } = this.props;

    this.props.dispatch({
      type: 'woType/init',
      payload: {
        tenantId,
      },
    });

    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'woType/queryWoTypeTreeList',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 新增工单类型
   * 跳转到新增明细页
   */
  @Bind()
  handleAddWoType() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/wo-type/create`,
        query: { parentTypeName: null },
      })
    );
  }

  /**
   * 跳转到详情页
   * @param {string} id 位置行id
   * @param {boolean} isCreateFlag 判断是新增下级还是新增顶级
   */
  @Bind()
  handleLinkToDetail(record, isCreateFlag) {
    const id = record.woTypeId;
    const { dispatch } = this.props;
    const linkUrl = isCreateFlag ? `create-sub/${id}` : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/wo-type/${linkUrl}`,
        query: { parentTypeName: record.longName },
      })
    );
    dispatch({
      type: 'woType/updateState',
      payload: {
        isCreateFlag,
      },
    });
  }

  /**
   * 启用 - 启用，如果有下级组织则同时启用所有下级
   * @param {Object} item 行信息
   */
  @Bind()
  handleEnabledLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { woTypeId, parentTypeId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'woType/enabledWoType',
      payload: {
        woTypeId,
        parentTypeId,
        tenantId,
        objectVersionNumber,
        _token,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   *  禁用 - 禁用特定组织，同时禁用所有下属组织
   * @param {Object} item 组织行信息
   */
  @Bind()
  handleForbidLine(item = {}) {
    const { dispatch, tenantId } = this.props;
    const { woTypeId, parentTypeId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'woType/disabledWoType',
      payload: {
        woTypeId,
        parentTypeId,
        tenantId,
        objectVersionNumber,
        _token,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 展开全部
   * 将页面展示的数据进行展开
   */
  @Bind()
  handleExpand() {
    const {
      dispatch,
      woType: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'woType/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap).map(item => +item),
      },
    });
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      woType: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.woTypeId]
      : expandedRowKeys.filter(item => item !== record.woTypeId);
    dispatch({
      type: 'woType/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 收起全部
   * 页面顶部收起全部按钮，将内容树收起
   */
  @Bind()
  handleShrink() {
    const { dispatch } = this.props;
    dispatch({
      type: 'woType/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  render() {
    const {
      woType,
      tenantId,
      loading: { fetchListLoading },
    } = this.props;
    const { expandedRowKeys = [], woTypeTreeList = [] } = woType;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      expandedRowKeys,
      loading: fetchListLoading,
      dataSource: woTypeTreeList,
      onLinkToDetail: this.handleLinkToDetail,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleLinkToDetail,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
    };
    const fieldValues = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`amtc.woType.view.message.title`).d('工单类型')}>
          <Button icon="plus" type="primary" onClick={this.handleAddWoType}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/wo-type/export`}
            queryParams={fieldValues}
          />
          <Button icon="down" onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
          <Button icon="up" onClick={this.handleShrink}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
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
export default WoType;
