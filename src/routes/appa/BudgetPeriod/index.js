/**
 * BudgetPeriod - 预算控制期间
 * @date: 2019/03/06 14:18:28
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button } from 'hzero-ui';
import uuidv4 from 'uuid/v4';
import { isArray, isEmpty } from 'lodash';

import {
  getCurrentOrganizationId,
  filterNullValueObject,
  addItemToPagination,
  getEditTableData,
  getDateTimeFormat,
  delItemToPagination,
} from 'utils/utils';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HALM_PPM } from '@/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

const promptCode = 'appa.budgetPeriod';

/**
 * 预算控制期间
 * @class BudgetPeriod
 * @extends {Component} - React.Component
 * @reactProps {Object} budgetPeriod - 数据源
 * @reactProps {Boolean} loading - 数据加载是否完成
 * @reactProps {Function} [dispatch = e => e] - redux dispatch方法
 * @return React.element
 */
@connect(({ budgetPeriod, loading }) => ({
  budgetPeriod,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchListLoading: loading.effects['budgetPeriod/fetchList'],
  },
}))
@formatterCollections({
  code: ['appa.budgetPeriod'],
})
class BudgetPeriod extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.handleSearch();
  }

  /**
   * 查询
   * @param {Object} fields 查询分页参数
   * @memberof BudgetPeriod
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const dateTimeFormat = getDateTimeFormat();
    const {
      periodStartDateFrom = '',
      periodStartDateTo = '',
      periodEndDateFrom = '',
      periodEndDateTo = '',
    } = filterValues;
    dispatch({
      type: 'budgetPeriod/fetchList',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValues,
        periodStartDateFrom: isEmpty(periodStartDateFrom)
          ? ''
          : periodStartDateFrom.startOf('day').format(dateTimeFormat),
        periodStartDateTo: isEmpty(periodStartDateTo)
          ? ''
          : periodStartDateTo.startOf('day').format(dateTimeFormat),
        periodEndDateFrom: isEmpty(periodEndDateFrom)
          ? ''
          : periodEndDateFrom.startOf('day').format(dateTimeFormat),
        periodEndDateTo: isEmpty(periodEndDateTo)
          ? ''
          : periodEndDateTo.startOf('day').format(dateTimeFormat),
      },
    });
  }

  /**
   * 新增行
   * @memberof BudgetPeriod
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      budgetPeriod: { list = [], pagination = {} },
      tenantId,
    } = this.props;
    dispatch({
      type: 'budgetPeriod/updateState',
      payload: {
        list: [
          {
            periodId: uuidv4(),
            periodName: '',
            periodYear: '',
            periodSeq: '',
            periodStartDate: '',
            periodEndDate: '',
            fillBudgetFlag: 1,
            enabledFlag: 1,
            tenantId,
            _status: 'create',
          },
          ...list,
        ],
        pagination: addItemToPagination(list.length, pagination),
      },
    });
  }

  /**
   * 批量保存
   * @memberof BudgetPeriod
   */
  @Bind()
  handleSave() {
    const {
      dispatch,
      budgetPeriod: { list = [], pagination = {} },
      tenantId,
    } = this.props;
    const dateTimeFormat = getDateTimeFormat();
    const data = getEditTableData(list, ['periodId']);
    const newData = data.map(item => {
      return {
        ...item,
        periodStartDate: item.periodStartDate.startOf('month').format(dateTimeFormat),
        periodEndDate: item.periodEndDate.endOf('month').format(dateTimeFormat),
      };
    });
    if (isArray(newData) && !isEmpty(newData)) {
      dispatch({
        type: 'budgetPeriod/saveList',
        payload: { newData, tenantId },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch(pagination);
        }
      });
    }
  }

  /**
   * 编辑当前行
   * @param {Object} [current={}] 当前行
   * @param {boolean} [flag=false] 默认false取消当前行的编辑 true编辑当前行
   * @memberof BudgetPeriod
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      budgetPeriod: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.periodId === current.periodId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'budgetPeriod/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 清除新增行
   * @param {Object} [current={}] 当前新增的行
   * @memberof BudgetPeriod
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      budgetPeriod: { list = [], pagination },
    } = this.props;
    const newList = list.filter(item => item.periodId !== current.periodId);
    dispatch({
      type: 'budgetPeriod/updateState',
      payload: {
        list: newList,
        pagination: delItemToPagination(list.length, pagination),
      },
    });
  }

  /**
   * 启用
   * @param {Object} item 预算期间行信息
   */
  @Bind()
  handleEnabledLine(record = {}) {
    const { dispatch, tenantId } = this.props;
    const temp = record;
    delete temp.$form;
    delete temp._status;
    dispatch({
      type: 'budgetPeriod/saveList',
      payload: {
        tenantId,
        newData: [{ ...temp, enabledFlag: 1 }],
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   *  禁用
   * @param {Object} item 预算期间行信息
   */
  @Bind()
  handleForbidLine(record = {}) {
    const { dispatch, tenantId } = this.props;
    const temp = record;
    delete temp.$form;
    delete temp._status;
    dispatch({
      type: 'budgetPeriod/saveList',
      payload: {
        tenantId,
        newData: [{ ...temp, enabledFlag: 0 }],
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }
  /**
   * render
   * @returns React.element
   * @memberof BudgetPeriod
   */
  render() {
    const {
      loading,
      budgetPeriod: { pagination, list = [] },
      tenantId,
      dispatch,
    } = this.props;
    const dateTimeFormat = getDateTimeFormat();
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const {
      periodStartDateFrom = '',
      periodStartDateTo = '',
      periodEndDateFrom = '',
      periodEndDateTo = '',
    } = filterValues;
    const exportParams = {
      ...filterValues,
      periodStartDateFrom: isEmpty(periodStartDateFrom)
        ? ''
        : periodStartDateFrom.startOf('day').format(dateTimeFormat),
      periodStartDateTo: isEmpty(periodStartDateTo)
        ? ''
        : periodStartDateTo.startOf('day').format(dateTimeFormat),
      periodEndDateFrom: isEmpty(periodEndDateFrom)
        ? ''
        : periodEndDateFrom.startOf('day').format(dateTimeFormat),
      periodEndDateTo: isEmpty(periodEndDateTo)
        ? ''
        : periodEndDateTo.startOf('day').format(dateTimeFormat),
    };
    const filterProps = {
      onRef: node => {
        this.form = (node.props || {}).form;
      },
      onSearch: this.handleSearch,
    };
    const listProps = {
      dispatch,
      pagination,
      loading: loading.fetchListLoading,
      dataSource: list,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCancelLine,
      onSearch: this.handleSearch,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('预算控制期间')}>
          <Button type="primary" icon="plus" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="save" onClick={this.handleSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/budget-period/export`}
            queryParams={exportParams}
            method="POST"
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

export default BudgetPeriod;
