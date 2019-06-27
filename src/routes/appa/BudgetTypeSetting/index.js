/**
 * BudgetTypeSetting - 预算类型设置
 * @date: 2019-3-6
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { isNull } from 'lodash';
import { HALM_PPM } from '@/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ budgetTypeSetting, loading }) => ({
  budgetTypeSetting,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetch: loading.effects['budgetTypeSetting/queryBudgetTypeSettingList'],
    save: loading.effects['budgetTypeSetting/saveData'],
  },
}))
@formatterCollections({
  code: ['appa.budgetTypeSetting', 'appa.common'],
})
class BudgetTypeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch();
    dispatch({ type: 'budgetTypeSetting/fetchLov', payload: { tenantId } });
  }

  /**
   * 查询预算项设置
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'budgetTypeSetting/queryBudgetTypeSettingList',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }

  /**
   * 新增预算项设置
   */
  @Bind()
  handleNewLine() {
    const { dispatch, tenantId, budgetTypeSetting } = this.props;
    const { list } = budgetTypeSetting;
    const newItem = {
      tenantId,
      budgetTypeId: uuidv4(),
      enabledFlag: 1,
      autoCodeFlag: 1,
      thinWbsFlag: 0,
      thinPeriodFlag: 0,
      unilateralCostFlag: 0,
      thinProductFlag: 0,
      thinAssetFlag: 0,
      thinBudgetItemFlag: 0,
      thinAreaFlag: 0,
      preorderBudgetTypeId: null,
      uomMultiple: 1,
      uomName: '元',
      _status: 'create',
    };
    dispatch({
      type: 'budgetTypeSetting/updateState',
      payload: {
        list: [...list, newItem],
      },
    });
  }

  /**
   * 保存预算项设置
   */
  @Bind()
  handleSaveData() {
    const {
      dispatch,
      tenantId,
      budgetTypeSetting: { list = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(list, ['budgetTypeId']);
    if (Array.isArray(params) && params.length > 0) {
      const tempList = params.map(item => ({
        ...item,
        preorderBudgetTypeId: !isNull(item.preorderBudgetTypeId)
          ? Number(item.preorderBudgetTypeId)
          : null,
      }));
      dispatch({
        type: 'budgetTypeSetting/saveData',
        payload: {
          tenantId,
          data: tempList,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   * 行 - 编辑
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      budgetTypeSetting: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.budgetTypeId === current.budgetTypeId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'budgetTypeSetting/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 行 - 取消
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      budgetTypeSetting: { list = [] },
    } = this.props;
    const newList = list.filter(item => item.budgetTypeId !== current.budgetTypeId);
    dispatch({
      type: 'budgetTypeSetting/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 启用
   * @param {Object} item 预算项设置行信息
   */
  @Bind()
  handleEnabledLine(record = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'budgetTypeSetting/saveData',
      payload: {
        tenantId,
        data: [{ ...record, enabledFlag: 1 }],
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
   * @param {Object} item 预算项设置行信息
   */
  @Bind()
  handleForbidLine(record = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'budgetTypeSetting/saveData',
      payload: {
        tenantId,
        data: [{ ...record, enabledFlag: 0 }],
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const { loading, tenantId, budgetTypeSetting = [] } = this.props;
    const {
      list,
      pagination,
      uomValueList,
      orderBudgetTypes = [],
      controlRequirements = [],
      controlTypes = [],
      enumMap = [],
    } = budgetTypeSetting;
    const filterProps = {
      enumMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      uomValueList,
      orderBudgetTypes,
      controlRequirements,
      controlTypes,
      loading: loading.fetch,
      dataSource: list,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onUomChange: this.handleChangeUom,
      onForbidLine: this.handleForbidLine,
      onEnabledLine: this.handleEnabledLine,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`appa.budgetTypeSetting.view.message.title`).d('预算类型设置')}>
          <Button type="primary" icon="plus" onClick={this.handleNewLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="save" onClick={this.handleSaveData} loading={loading.save}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/budget-type/export`}
            queryParams={exportParams}
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
export default BudgetTypeSetting;
