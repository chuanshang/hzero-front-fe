/**
 * WorkCenterStaff - 工作中心人员
 * @date: 2019-04-24
 * @author: 潘顾昌 <guchang.pan@hand-china.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Button } from 'hzero-ui';
import { connect } from 'dva/index';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { HALM_MTC } from '@/utils/config';

// import styles from './index.less';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import PromptDrawer from './PromptDrawer';

// dva连接
// loading 获取异步状态。
@connect(({ workCenterStaff, loading }) => ({
  workCenterStaff,
  saving: loading.effects['workCenterStaff/createOrUpdateStuff'],
}))
// 当{intl.get('hiam.workCenterStaff.title.name').d('工作中心人员')}为非hzero.common的时候需要引入
// 该注解，例如下面的就不需要添加进注解的code,{intl.get('hzero.common.button.search').d('查询')}
@formatterCollections({ code: ['hiam.workCenterStaff'] })
export default class WorkCenterStaff extends React.Component {
  // 获取子表单
  form;
  constructor(props) {
    super(props);
    // 父组件给子组件使用
    this.state = {
      modalVisible: false,
      tenantId: getCurrentOrganizationId(),
      StuffFormData: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    // 组件加载完成获取列表
    this.fetchStuffList();
  }

  @Bind
  fetchStuffList(params = {}) {
    const {
      dispatch,
      workCenterStaff: { pagination = {} },
    } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const { tenantId } = this.state;
    dispatch({
      type: 'workCenterStaff/fetchStuffList',
      payload: { tenantId, ...filterValues, page: pagination, ...params },
    });
  }

  @Bind
  testRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 分页
   */
  @Bind()
  handleStandardTableChange(pagination) {
    this.fetchStuffList({
      page: pagination,
    });
  }

  /**
   * 控制modal显示与隐藏
   * @param {boolean}} flag 是否显示modal
   */
  handleModalVisible(flag) {
    this.setState({ modalVisible: !!flag });
  }

  /**
   * 打开模态框
   */
  @Bind()
  showModal() {
    this.setState({
      StuffFormData: {},
    });
    this.handleModalVisible(true);
  }

  /**
   * 关闭模态框
   */
  @Bind()
  hideModal() {
    const { saving = false } = this.props;
    if (!saving) {
      this.handleModalVisible(false);
    }
  }

  /**
   * 编辑打开模态框
   */
  @Bind()
  handleUpdateSuffer(record) {
    this.setState({
      StuffFormData: record,
    });
    this.handleModalVisible(true);
  }

  /**
   * 保存多语言
   * @param {object} fieldsValue - 编辑或新增的数据
   */
  @Bind()
  handleSavePrompt(fieldsValue) {
    const { dispatch } = this.props;
    const { StuffFormData, tenantId } = this.state;
    const params =
      StuffFormData.workcenterPeopleId !== undefined
        ? {
            ...StuffFormData,
            ...fieldsValue,
            tenantId,
          }
        : {
            ...fieldsValue,
            tenantId,
          };
    dispatch({
      type: 'workCenterStaff/createOrUpdateStuff',
      payload: params,
    }).then(res => {
      if (res) {
        notification.success();
        this.hideModal();
        this.fetchStuffList();
      }
    });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ ...this.state, selectedRowKeys, selectedRows });
  }

  render() {
    const {
      saving,
      workCenterStaff: { stuffList, pagination = {} },
    } = this.props;
    const { StuffFormData, modalVisible, selectedRowKeys, tenantId } = this.state;
    const languageList = [];
    const listProp = {
      selectedRowKeys,
      pagination: { ...pagination, pageSizeOptions: ['5', '10', '15', '20', '50'] },
      dataSource: stuffList,
      onSelectRow: this.handleSelectRow,
      onUpdateSuffer: this.handleUpdateSuffer,
      handleStandardTableChange: this.handleStandardTableChange,
    };
    const fieldValues = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header title={intl.get('hiam.workCenterStaff.title.name').d('工作中心人员')}>
          <Button icon="plus" type="primary" onClick={this.showModal}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_MTC}/v1/${tenantId}/workcenter-staff/export`}
            queryParams={fieldValues}
          />
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm onRef={this.testRef} onSearch={this.fetchStuffList} />
          </div>
          <ListTable {...listProp} />
          <PromptDrawer
            title={
              StuffFormData.workcenterStaffId
                ? intl.get('hpfm.prompt.view.message.edit').d('编辑工作中心人员')
                : intl.get('hpfm.prompt.view.message.create').d('创建工作中心人员')
            }
            loading={saving}
            modalVisible={modalVisible}
            initData={StuffFormData}
            languageList={languageList}
            onCancel={this.hideModal}
            onOk={this.handleSavePrompt}
          />
        </Content>
      </Fragment>
    );
  }
}
