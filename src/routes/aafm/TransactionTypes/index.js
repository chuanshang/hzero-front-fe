/**
 * TransactionTypes - 资产事务处理类型
 * @date: 2019-3-20
 * @author: hq <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HALM_ATN } from '@/utils/config';
import intl from 'utils/intl';
import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ transactionTypes, loading }) => ({
  transactionTypes,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['transactionTypes/queryTransactionTypesTreeList'],
  },
}))
class TransactionTypes extends Component {
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
      type: 'transactionTypes/init',
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
      type: 'transactionTypes/queryTransactionTypesTreeList',
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
   * 新增模板
   * 跳转到新增明细页
   */
  @Bind()
  handleAddTransactionTypes() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/aafm/transaction-type/create` }));
  }

  /**
   * 跳转到详情页
   * @param {string} id 位置行id
   * @param {boolean} isCreateFlag 判断是新增下级还是新增顶级
   */
  @Bind()
  handleLinkToDetail(id, isCreateFlag) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(id) ? 'create' : isCreateFlag ? `create-sub/${id}` : `detail/${id}`;
    dispatch(
      routerRedux.push({
        pathname: `/aafm/transaction-type/${linkUrl}`,
      })
    );
    dispatch({
      type: 'transactionTypes/updateState',
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
    const { transactionTypeId, parentTypeId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'transactionTypes/enabledTransactionTypes',
      payload: {
        transactionTypeId,
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
    const { transactionTypeId, parentTypeId, objectVersionNumber, _token } = item;
    dispatch({
      type: 'transactionTypes/disabledTransactionTypes',
      payload: {
        transactionTypeId,
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
      transactionTypes: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'transactionTypes/updateState',
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
      transactionTypes: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.transactionTypeId]
      : expandedRowKeys.filter(item => item !== record.transactionTypeId);
    dispatch({
      type: 'transactionTypes/updateState',
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
      type: 'transactionTypes/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  render() {
    const {
      transactionTypes,
      tenantId,
      loading: { fetchListLoading },
    } = this.props;
    const { expandedRowKeys = [], treeList = [], basicTypeMap = [] } = transactionTypes;
    const filterProps = {
      basicTypeMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      expandedRowKeys,
      loading: fetchListLoading,
      dataSource: treeList,
      onLinkToDetail: this.handleLinkToDetail,
      onExpand: this.handleExpandSubLine,
      onAddLine: this.handleLinkToDetail,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
    };
    const fieldValues = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`aafm.transactionTypes.view.message.title`).d('资产事务处理类型')}>
          <Button icon="plus" type="primary" onClick={this.handleAddTransactionTypes}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_ATN}/v1/${tenantId}/transaction-type/export`}
            queryParams={fieldValues}
          />
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
export default TransactionTypes;
