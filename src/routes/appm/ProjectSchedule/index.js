/**
 * ProjectSchedule - 项目进度
 * @date: 2019-3-11
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { isUndefined, isEmpty } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ListTable from './ListTable';
import FilterForm from './FilterForm';
import Drawer from './Drawer';

@connect(({ projectSchedule, loading }) => ({
  projectSchedule,
  tenantId: getCurrentOrganizationId(),
  loading: {
    search: loading.effects['projectSchedule/fetchProjectSchedule'],
    save: loading.effects['projectSchedule/saveData'],
    submit: loading.effects['projectSchedule/submitData'],
    history: loading.effects['projectSchedule/fetchProjectScheduleHistory'],
    workList: loading.effects['projectSchedule/fetchWorkList'],
    completeSchedule: loading.effects['projectSchedule/completeSchedule'],
    resetSchedule: loading.effects['projectSchedule/resetSchedule'],
  },
}))
@formatterCollections({
  code: ['appm.projectSchedule'],
})
class ProjectSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false, // 滑窗控制标记
      detail: {}, // 滑窗明细
    };
  }
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch();
    dispatch({
      type: 'projectSchedule/fetchLov',
      payload: { tenantId },
    });
  }
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let filterValues = {};
    if (!isUndefined(this.form)) {
      const formValue = this.form.getFieldsValue();
      filterValues = filterNullValueObject(formValue);
    }
    dispatch({
      type: 'projectSchedule/fetchProjectSchedule',
      payload: {
        tenantId,
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }
  @Bind()
  handleSearchHistory(_, record) {
    const {
      dispatch,
      tenantId,
      projectSchedule: { listMap },
    } = this.props;
    dispatch({
      type: 'projectSchedule/fetchProjectScheduleHistory',
      payload: {
        tenantId,
        projectId: record.projectId,
        taskCode: record.taskCode,
      },
    }).then(res => {
      dispatch({
        type: 'projectSchedule/updateState',
        payload: {
          listMap: listMap.set(record.wbsLineId, res),
        },
      });
    });
  }
  /**
   * 进度保存
   */
  @Bind()
  handleDataSave(current) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectSchedule/saveData',
      payload: {
        tenantId,
        data: [{ ...current }],
      },
    }).then(res => {
      if (res) {
        this.setState({ detail: res[0] });
        notification.success();
        this.handleSearch();
      }
    });
  }
  @Bind()
  handleDataSubmit() {
    const {
      dispatch,
      tenantId,
      projectSchedule: { list },
    } = this.props;
    dispatch({
      type: 'projectSchedule/submitData',
      payload: {
        tenantId,
        data: list,
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
  /**
   * 打开滑窗
   */
  @Bind()
  handleShowDrawer(record) {
    this.setState({ drawerVisible: true, detail: record });
    this.handleSearchWorkList(record);
  }
  /**
   * 关闭滑窗
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false });
  }

  /**
   * 查询工作列表
   */
  @Bind()
  handleSearchWorkList(record) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectSchedule/fetchWorkList',
      payload: {
        tenantId,
        taskCode: record.taskCode,
        projectId: record.projectId,
      },
    });
  }

  /**
   * 完成/取消完成 工作清单
   */
  @Bind()
  handleOperateWorkList(record, operationFlag) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectSchedule/operateWorkList',
      payload: {
        tenantId,
        operationFlag,
        workListId: record.workListId,
      },
    }).then(res => {
      if (res) {
        this.handleSearchWorkList(record);
        notification.success();
      }
    });
  }
  /**
   * 完成进度
   */
  @Bind()
  handleCompleteSchedule(record) {
    const { dispatch, tenantId } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'projectSchedule/completeSchedule',
      payload: {
        tenantId,
        wbsLineId: record.wbsLineId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          detail: {
            ...detail,
            approvedScheduleRate: res.approvedScheduleRate,
            enteredScheduleRate: res.enteredScheduleRate,
          },
        });
        this.handleSearch();
        this.handleSearchHistory('', record);
        notification.success();
      }
    });
  }
  /**
   * 取消完成进度
   */
  @Bind()
  handleResetSchedule(record) {
    const { dispatch, tenantId } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'projectSchedule/resetSchedule',
      payload: {
        tenantId,
        wbsLineId: record.wbsLineId,
        taskCode: record.taskCode,
      },
    }).then(res => {
      if (res) {
        this.setState({
          detail: {
            ...detail,
            approvedScheduleRate: res.approvedScheduleRate,
            enteredScheduleRate: res.enteredScheduleRate,
          },
        });
        this.handleSearch();
        this.handleSearchHistory('', record);
        notification.success();
      }
    });
  }

  /**
   * 交付物上传
   */
  @Bind()
  handleUpload(record, workListLine) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectSchedule/uploadAttachment',
      payload: {
        tenantId,
        data: record,
      },
    }).then(res => {
      if (res) {
        this.handleSearchWorkList(workListLine);
        notification.success();
      }
    });
  }
  render() {
    const {
      tenantId,
      loading,
      projectSchedule: {
        listMap,
        pagination,
        historyList,
        list = [],
        priorityMap = [], // 优先级
        riskLevelMap = [], // 风险等级
        taskTypeMap = [], // 任务类型
        workList = [],
        fileMap = {},
      },
    } = this.props;
    const { detail, drawerVisible } = this.state;
    const listProps = {
      listMap,
      pagination,
      riskLevelMap,
      historyList,
      loading: loading.search,
      historyLoading: loading.history,
      dataSource: list,
      onSearch: this.handleSearch,
      onExpand: this.handleSearchHistory,
      onShowDrawer: this.handleShowDrawer,
      onCompleteSchedule: this.handleCompleteSchedule,
      onResetSchedule: this.handleResetSchedule,
    };
    const filterProps = {
      tenantId,
      priorityMap, // 优先级
      riskLevelMap, // 风险等级
      taskTypeMap, // 任务类型
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const drawerProps = {
      tenantId,
      workList,
      fileMap,
      detail,
      anchor: 'right',
      saveLoading: loading.save,
      visible: drawerVisible,
      title: intl.get(`appm.projectSchedule`).d('填报进度'),
      completeScheduleLoading: loading.completeSchedule,
      resetScheduleLoading: loading.resetSchedule,
      onOk: this.handleDataSave,
      onCancel: this.handleDrawerCancel,
      workListLoading: loading.workList,
      onEditFile: this.handleEditFile,
      onDeleteFile: this.handleDeleteFile,
      onAddFile: this.handleAddFile,
      onOperateWorkList: this.handleOperateWorkList,
      onCompleteSchedule: this.handleCompleteSchedule,
      onResetSchedule: this.handleResetSchedule,
      onUpload: this.handleUpload,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`appm.projectSchedule.view.message.title`).d('项目进度')}>
          <Button icon="check" loading={loading.submit} onClick={this.handleDataSubmit}>
            {intl.get('hzero.common.button.submit').d('提交')}
          </Button>
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

export default ProjectSchedule;
