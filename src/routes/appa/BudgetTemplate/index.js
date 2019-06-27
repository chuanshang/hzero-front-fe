/**
 * 预算模板-入口
 * @date: 2019-4-17
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button, notification, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import { HALM_PPM } from '@/utils/config';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import HistoryModal from './HistoryModal';

@connect(({ budgetTemplate, loading }) => ({
  budgetTemplate,
  loading: {
    fetch: loading.effects['budgetTemplate/fetchBudgetTemplates'],
    delete: loading.effects['budgetTemplate/deleteBudgetTemplate'],
    history: loading.effects['budgetTemplate/fetchHistoryVersions'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appa.budgetTemplate'],
})
class BudgetTemplate extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    };
  }
  componentDidMount() {
    const {
      budgetTemplate: { pagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.handleSearch(page);
  }
  /**
   * 页面查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const fromValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(fromValue);
    }
    dispatch({
      type: 'budgetTemplate/fetchBudgetTemplates',
      payload: {
        tenantId,
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }
  /**
   * 删除拟定版本的模板
   */
  @Bind()
  handleDelete() {
    const { dispatch, tenantId } = this.props;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl.get('appa.budgetTemplate.view.message.delete').d('是否删除选中的预算模板'),
      onOk: () => {
        dispatch({
          type: 'budgetTemplate/deleteBudgetTemplate',
          payload: {
            tenantId,
            data: [...selectedRows],
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }
        });
      },
    });
  }
  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }
  /**
   * 明细页跳转
   */
  @Bind()
  handleGotoDetail(record) {
    const { dispatch } = this.props;
    const linkUrl = isUndefined(record)
      ? 'create'
      : record.templateStatus === 'PRESET'
      ? `new-detail/${record.templateCode}`
      : `detail/${record.templateCode}`;
    dispatch(
      routerRedux.push({
        pathname: `/appa/budget-template/${linkUrl}`,
      })
    );
  }
  /**
   * 编辑新版本跳转明细页
   * 根据new-detail是否存在判断明细页handleSearch函数的flag取值
   * @param {string} templateCode 预算模板templateCode
   */
  @Bind()
  handleGotoNewDetail(templateCode) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/appa/budget-template/new-detail/${templateCode}`,
      })
    );
  }
  /**
   * 查看历史版本
   * @param {object} record - 行记录
   */
  @Bind()
  handleViewHistory(record) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'budgetTemplate/fetchHistoryVersions',
      payload: {
        tenantId,
        templateCode: record.templateCode,
      },
    });
    this.handleShowModal();
  }
  /**
   * 查询历史明细
   */
  @Bind()
  handleGotoHistory(templateCode, templateVersion, templateStatus) {
    const { dispatch } = this.props;
    if (templateStatus === 'PRESET') {
      dispatch(
        routerRedux.push({
          pathname: `/appa/budget-template/new-detail/${templateCode}`,
        })
      );
    } else {
      dispatch(
        routerRedux.push({
          pathname: `/appa/budget-template/history/${templateCode}/${templateVersion}`,
        })
      );
    }
  }
  /**
   * 打开进度模态框
   */
  @Bind()
  handleShowModal() {
    this.setState({ modalVisible: true });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleCancel() {
    this.setState({
      modalVisible: false,
    });
  }
  /**
   * 传递表单参数
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  render() {
    const promptCode = 'appa.budgetTemplate';
    const { modalVisible, selectedRowKeys = [] } = this.state;
    const { loading, tenantId, budgetTemplate } = this.props;
    const { pagination = {}, templateList = [], historyList = [] } = budgetTemplate;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: loading.fetch,
      dataSource: templateList,
      onGotoDetail: this.handleGotoDetail,
      onGotoNewDetail: this.handleGotoNewDetail,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
      onView: this.handleViewHistory,
    };
    const historyModalProps = {
      modalVisible,
      loading: loading.history,
      onCancel: this.handleCancel,
      dataSource: historyList,
      onGotoHistory: this.handleGotoHistory,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('预算模板')}>
          <Button icon="plus" type="primary" onClick={() => this.handleGotoDetail()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={loading.delete}
            onClick={this.handleDelete}
            disabled={isEmpty(selectedRowKeys)}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/budget-template/template-export`}
            queryParams={exportParams}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <HistoryModal {...historyModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default BudgetTemplate;
