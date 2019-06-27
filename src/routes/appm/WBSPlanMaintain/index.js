/**
 * index - WBS计划入口界面
 * @date: 2019-3-11
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Form, Row, Col, Spin, Modal, Input, Tag } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { HALM_PPM } from '@/utils/config';
import { getCurrentOrganizationId, getDateTimeFormat, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { dateRender } from 'utils/renderer';
import { FORM_COL_3_LAYOUT, EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT } from 'utils/constants';
import { FORM_COL_2_3_LAYOUT, EDIT_FORM_ITEM_LAYOUT_COL_4 } from '@/utils/constants';
import ListTable from './ListTable';
import RelationModal from './RelationModal';
import ScheduleModal from './ScheduleModal';
import FilterModal from './FilterModal';
import Drawer from './Drawer';
import BaseLineModal from './BaseLineModal';

@connect(({ wbsPlanMaintain, loading }) => ({
  wbsPlanMaintain,
  loading: {
    fetchListLoading: loading.effects['wbsPlanMaintain/queryWBSPlanMaintainList'],
    header: loading.effects['wbsPlanMaintain/searchWBSPlanHeader'],
    submit: loading.effects['wbsPlanMaintain/submitWBS'],
    delete: loading.effects['wbsPlanMaintain/deleteWBS'],
    deleteList: loading.effects['wbsPlanMaintain/queryDeleteList'],
    detail: loading.effects['wbsPlanMaintain/fetchDetailInfo'],
    save:
      loading.effects['wbsPlanMaintain/saveData'] ||
      loading.effects['wbsPlanMaintain/saveWorkList'],
    workList: loading.effects['wbsPlanMaintain/fetchWorkList'],
    searchBaseLine: loading.effects['wbsPlanMaintain/fetchBaseLine'],
    saveBaseLine: loading.effects['wbsPlanMaintain/saveBaseLine'],
    deleteRels: loading.effects['wbsPlanMaintain/deleteRels'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appm.wbsPlanMaintain', 'appm.common'],
})
@Form.create({ fieldNameProp: null })
class WBSPlanMaintain extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      wbsLineId: '',
      relationModalVisible: false,
      scheduleModalVisible: false,
      filterModalVisible: false,
      baseLineModalVisible: false,
      drawerVisible: false, // 滑窗控制标记
      isEdit: false, // 是否“编辑”标记位
      defaultDetailItem: {
        approvedScheduleRate: 0, // 进度
        enteredScheduleRate: 0, // 填报进度
        taskStatus: 'NEW', // 任务状态
      },
    };
  }
  componentDidMount() {
    const {
      tenantId,
      wbsPlanMaintain: { state: { _back } = {} },
    } = this.props;
    if (_back === -1) {
      this.handleSearch();
    } else {
      this.props.dispatch({
        type: 'wbsPlanMaintain/init',
        payload: {
          tenantId,
        },
      });
      this.handleSearch();
    }
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch() {
    const {
      dispatch,
      tenantId,
      match: {
        params: { wbsHeaderId },
      },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/searchWBSPlanHeader',
      payload: {
        tenantId,
        wbsHeaderId,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'wbsPlanMaintain/queryUserList',
          payload: {
            tenantId,
            projectId: res[0].projectId,
            organizationId: tenantId,
          },
        });
      }
    });
    this.handleSearchWBSLines();
  }
  /**
   * wbs行列表查询
   */
  @Bind()
  handleSearchWBSLines(fields = {}) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { wbsHeaderId },
      },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/queryWBSPlanMaintainList',
      payload: {
        tenantId,
        wbsHeaderId,
        ...fields,
        showChildAndParentFlag: 0,
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
      wbsPlanMaintain: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.wbsLineId]
      : expandedRowKeys.filter(item => item !== record.wbsLineId);
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
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
      wbsPlanMaintain: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap).map(item => +item),
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
      type: 'wbsPlanMaintain/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  /**
   * 打开任务关系模态框
   */
  @Bind()
  handleShowRelationModal(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        projectWbsRelsList: record.projectWbsRelsList,
      },
    });
    this.setState({ relationModalVisible: true });
  }

  /**
   * 打开进度模态框
   */
  @Bind()
  handleShowScheduleModal(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        projectWbsScheduleList: record.projectWbsScheduleList,
      },
    });
    this.setState({ scheduleModalVisible: true });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleCancel() {
    this.setState({
      relationModalVisible: false,
      scheduleModalVisible: false,
      filterModalVisible: false,
      baseLineModalVisible: false,
    });
  }
  /**
   * 打开筛选框
   */
  @Bind()
  handleShowFilterModal() {
    this.setState({ filterModalVisible: true });
  }

  /**
   * 提交
   */
  @Bind()
  handleSubmit() {
    const {
      dispatch,
      tenantId,
      form,
      wbsPlanMaintain: { wbsPlanHeader = {}, treeList = [] },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const list = treeList.filter(item => item.wbsLineId !== 0);
        dispatch({
          type: 'wbsPlanMaintain/submitWBS',
          payload: {
            tenantId,
            data: {
              ...wbsPlanHeader,
              ...values,
              projectWbsLines: list,
            },
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch();
          }
        });
      }
    });
  }

  /**
   * 删除WBS任务
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleDeleteTask(current) {
    const {
      dispatch,
      tenantId,
      loading,
      wbsPlanMaintain: { wbsPlanHeader },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/queryDeleteList',
      payload: {
        tenantId,
        wbsLineId: current.wbsLineId,
      },
    }).then(result => {
      if (result) {
        const taskList = (!isEmpty(result) ? result : []).map(item => item.taskName);
        const taskString = taskList.toString().replace(/,/g, '、');
        const message = !isEmpty(taskString)
          ? `${taskString}与该任务有任务间关系，删除该任务之后，对应的任务间关系会被一并删除`
          : '';
        Modal.confirm({
          content: intl
            .get('appm.wbsPlanMaintain.view.message.delete')
            .d(`是否删除该任务? ${message}`),
          confirmLoading: loading.delete,
          onOk: () => {
            const projectWbsLines = { ...current, otherRoles: current.otherRoles.toString() };
            dispatch({
              type: 'wbsPlanMaintain/deleteWBS',
              payload: {
                tenantId,
                data: projectWbsLines,
                projectId: wbsPlanHeader.projectId,
              },
            }).then(res => {
              if (res) {
                notification.success();
                this.handleSearch();
              }
            });
          },
        });
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
   * fetchDetailInfo - 查询任务详细信息
   */
  @Bind()
  fetchDetailInfo(wbsLineId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/fetchDetailInfo',
      payload: {
        tenantId,
        wbsLineId,
      },
    });
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        taskRelationList: [],
      },
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSave(current) {
    const {
      tenantId,
      dispatch,
      wbsPlanMaintain,
      match: {
        params: { wbsHeaderId },
      },
    } = this.props;
    const { wbsPlanHeader, taskRelationList } = wbsPlanMaintain;
    const { wbsLineId } = this.state;
    const newTaskRelationList = [];
    taskRelationList.forEach(item => {
      if (['create', 'update'].includes(item._status)) {
        newTaskRelationList.push({
          ...item,
          // 里程牌的时候工期传0
          limitTime: item.taskTypeCode === 'MILESTONE' ? 0 : item.limitTime,
        });
      }
    });
    const data =
      (newTaskRelationList.length && getEditTableData(newTaskRelationList, ['wbsRelId'])) || [];
    let saveFlag = false;
    if (newTaskRelationList.length === 0) {
      saveFlag = saveFlag || true;
    }
    if (Array.isArray(data) && data.length > 0) {
      saveFlag = saveFlag || true;
    }
    if (saveFlag) {
      const lineList = [
        {
          ...current,
          tenantId,
          principalRoleId: Number(current.principalRoleId),
          principalPersonId: Number(current.principalPersonId),
          approvedScheduleRate: Number(current.approvedScheduleRate.replace('%', '')),
          otherRoles: isUndefined(current.otherRoles) ? '' : current.otherRoles.toString(),
          otherPerson: isUndefined(current.otherPerson) ? '' : current.otherPerson.toString(),
          projectWbsRelsList: [...data] || [],
          startDate: moment(current.startDate).format(getDateTimeFormat()),
          endDate: moment(current.endDate).format(getDateTimeFormat()),
        },
      ];
      dispatch({
        type: 'wbsPlanMaintain/saveData',
        payload: {
          tenantId,
          wbsHeaderId,
          data: {
            ...wbsPlanHeader,
            projectWbsLines: lineList,
          },
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
          this.fetchDetailInfo(wbsLineId);
        }
      });
    }
  }
  /**
   * 明细页-任务关系添加行数据
   */
  @Bind
  handleAddLine() {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { taskRelationList = [] },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        taskRelationList: [
          {
            tenantId,
            wbsRelId: uuidv4(),
            beforeLineId: '', // 前置任务
            relationTypeCode: '', // 关系类型
            delayTime: '', // 延迟时间
            advanceTime: '', // 提前时间
            primaryFlag: isEmpty(taskRelationList) ? 1 : 0, // 主要关系
            _status: 'create',
          },
          ...taskRelationList,
        ],
      },
    });
  }
  /**
   * 明细页-任务关系删除行数据
   */
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      wbsPlanMaintain: { taskRelationList = [] },
    } = this.props;
    const newList = taskRelationList.filter(item => item.wbsRelId !== record.wbsRelId);
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        taskRelationList: [...newList],
      },
    });
  }
  /**
   * 明细页-任务关系编辑行数据
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record, flag) {
    const {
      dispatch,
      wbsPlanMaintain: { taskRelationList = [] },
    } = this.props;
    const newList = taskRelationList.map(item =>
      item.wbsRelId === record.wbsRelId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        taskRelationList: [...newList],
      },
    });
  }
  /**
   * 删除任务关系
   */
  @Bind()
  handleDeleteLine(selectedRows) {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { taskRelationList },
      match: {
        params: { wbsHeaderId },
      },
    } = this.props;
    let successFlag = false;
    Modal.confirm({
      content: intl
        .get('appm.wbsPlanMaintain.view.message.detailLine.delete')
        .d('是否删除前置任务'),
      onOk: () => {
        const newTaskRelationList = taskRelationList.filter(
          item => selectedRows.indexOf(item) === -1
        );
        const newSelectedRows = [];
        selectedRows.forEach(item => {
          if (item._status !== 'create') {
            newSelectedRows.push({ ...item, removeFlag: 1 });
          }
        });
        dispatch({
          type: 'wbsPlanMaintain/deleteRels',
          payload: {
            tenantId,
            wbsHeaderId,
            data: newSelectedRows,
          },
        }).then(res => {
          if (res) {
            successFlag = true;
            dispatch({
              type: 'wbsPlanMaintain/updateState',
              payload: {
                taskRelationList: [...newTaskRelationList],
              },
            });
            notification.success();
            this.handleSearch();
          }
        });
      },
    });
    return successFlag;
  }
  /**
   * 编辑任务
   */
  @Bind()
  handleEditTask(record) {
    this.fetchDetailInfo(record.wbsLineId);
    this.handleSearchWorkList(record.taskCode);
    this.setState({
      wbsLineId: record.wbsLineId,
      taskCode: record.taskCode,
      drawerVisible: true,
      isEdit: true,
    });
  }
  /**
   * 滑窗关闭
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false, isEdit: false });
  }

  /**
   * 新建下级任务
   */
  @Bind()
  handleAddTask(record = {}) {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { treeList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const wbsLineId = uuidv4();
    const newItem = {
      tenantId,
      wbsLineId,
      approvedScheduleRate: 0,
      planModeCode: 'MANUAL',
      taskTypeCode: 'PROJECT_MISSION',
      priorityCode: 'MEDIUM',
      riskLevel: 'NORMAL',
      taskStatus: 'NEW',
      parentLineId: record.wbsLineId,
      _status: 'create',
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.wbsLineId], newChildren);
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        treeList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.wbsLineId],
      },
    });
  }

  /**
   * 新建顶层任务
   */
  @Bind()
  handleAddTopTask() {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { treeList = [], expandedRowKeys = [] },
    } = this.props;
    const wbsLineId = uuidv4();
    const newItem = {
      wbsLineId,
      tenantId,
      approvedScheduleRate: 0,
      planModeCode: 'MANUAL',
      taskTypeCode: 'PROJECT_MISSION',
      priorityCode: 'MEDIUM',
      riskLevel: 'NORMAL',
      taskStatus: 'NEW',
      _status: 'create',
    };
    treeList.splice(1, 0, newItem);
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        treeList,
        expandedRowKeys: [...expandedRowKeys, wbsLineId],
      },
    });
  }

  /**
   * 清除
   * @param {Object} record 清除新增行对象
   */
  @Bind()
  handleCancelTask(record = {}) {
    const {
      dispatch,
      wbsPlanMaintain: { treeList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentLineId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(treeList, pathMap[record.parentLineId], 'wbsLineId');
      const newChildren = node.children.filter(item => item.wbsLineId !== record.wbsLineId);
      newTreeList = this.findAndSetNodeProps(treeList, pathMap[record.parentLineId], newChildren);
    } else {
      newTreeList = treeList.filter(item => item.wbsLineId !== record.wbsLineId);
    }
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        treeList: newTreeList,
      },
    });
  }
  /**
   * 保存新建的列表数据
   */
  @Bind()
  handleSaveCreatedData() {
    const {
      dispatch,
      tenantId,
      match,
      form,
      wbsPlanMaintain: { treeList, wbsPlanHeader },
    } = this.props;
    const { wbsHeaderId } = match.params;
    // 处理表单效验，获取处理后的表单数据
    form.validateFields((err, values) => {
      if (!err) {
        // 校验通过，进行保存操作
        const params = getEditTableData(treeList, ['children', 'wbsLineId']);
        if (Array.isArray(params) && params.length > 0) {
          const list = [];
          params.forEach(item => {
            list.push({
              ...item,
              // 里程牌的时候工期传0
              limitTime: item.taskTypeCode === 'MILESTONE' ? 0 : item.limitTime,
              startDate: moment(item.startDate).format(getDateTimeFormat()),
              endDate: moment(item.endDate).format(getDateTimeFormat()),
              principalRoleId: Number(item.principalRoleId),
              principalPersonId: Number(item.principalPersonId),
            });
          });
          // 固定行wbsLineId =0，需要单独提取到到保存
          const headers = list.filter(item => item.wbsLineId === 0);
          const header = !isEmpty(headers)
            ? {
                limitTimeTotal: headers[0].limitTime,
                expectStartDate: headers[0].startDate,
                expectEndDate: headers[0].endDate,
              }
            : {};
          const tempList = list.filter(item => item.wbsLineId !== 0);
          dispatch({
            type: 'wbsPlanMaintain/saveData',
            payload: {
              tenantId,
              wbsHeaderId,
              data: {
                ...wbsPlanHeader,
                ...header,
                remark: values.remark,
                projectWbsLines: tempList,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 编辑固定行
   * @param {Object} record 行数据
   */
  @Bind()
  handleEditTopTask(record, flag) {
    const {
      dispatch,
      wbsPlanMaintain: { treeList = [] },
    } = this.props;
    const newList = treeList.map(item =>
      item.wbsLineId === record.wbsLineId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        treeList: [...newList],
      },
    });
  }

  /**
   * 保存工作清单
   */
  @Bind()
  handleSaveWorkList() {
    const {
      dispatch,
      tenantId,
      match,
      wbsPlanMaintain: { workList, fileMap, wbsPlanHeader },
    } = this.props;
    const { taskCode } = this.state;
    const { wbsHeaderId } = match.params;
    // 处理表单效验，获取处理后的表单数据
    const tempWorkList = workList.map(item => {
      const param = getEditTableData(fileMap[item.workListId], ['children', 'workListItemId']);
      const items = [];
      param.forEach(e => {
        if (typeof e.workListId === 'string') {
          // 新建时，过滤掉其workListId
          const { workListId, ...other } = e;
          items.push(other);
        } else {
          items.push(e);
        }
      });
      return {
        ...item,
        principalRoleId: Number(item.principalRoleId),
        principalPersonId: Number(item.principalPersonId),
        workListItems: items,
      };
    });
    const params = getEditTableData(tempWorkList, ['children', 'workListId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'wbsPlanMaintain/saveWorkList',
        payload: {
          tenantId,
          taskCode,
          wbsHeaderId: Number(wbsHeaderId),
          projectId: wbsPlanHeader.projectId,
          data: params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchWorkList(this.state.taskCode);
        }
      });
    }
  }

  /**
   * 查询工作列表
   */
  @Bind()
  handleSearchWorkList(taskCode) {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { wbsPlanHeader },
    } = this.props;
    dispatch({
      type: 'wbsPlanMaintain/fetchWorkList',
      payload: {
        tenantId,
        taskCode,
        projectId: wbsPlanHeader.projectId,
      },
    });
  }

  /**
   * 新增工作清单
   */
  @Bind()
  handleAddWorkList() {
    const {
      dispatch,
      tenantId,
      match,
      wbsPlanMaintain: { workList, wbsPlanHeader },
    } = this.props;
    const { taskCode } = this.state;
    const { wbsHeaderId } = match.params;
    const workListId = uuidv4();
    const newItem = {
      tenantId,
      workListId,
      taskCode,
      projectId: wbsPlanHeader.projectId,
      wbsHeaderId: Number(wbsHeaderId),
      _status: 'create',
    };
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        workList: [...workList, newItem],
      },
    });
  }

  /**
   * 清除工作清单
   */
  @Bind()
  handleCancelWorkList(record) {
    const {
      dispatch,
      wbsPlanMaintain: { workList },
    } = this.props;
    const temp = workList.filter(item => item.workListId !== record.workListId);
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        workList: temp,
      },
    });
  }
  /**
   * 编辑工作清单
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditWorkList(record, flag) {
    const {
      dispatch,
      wbsPlanMaintain: { workList = [] },
    } = this.props;
    const newList = workList.map(item =>
      item.workListId === record.workListId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        workList: [...newList],
      },
    });
  }

  /**
   * 删除工作清单
   */
  @Bind()
  handleDeleteWorkList(record) {
    const { tenantId, match, dispatch } = this.props;
    const { wbsHeaderId } = match.params;
    dispatch({
      type: 'wbsPlanMaintain/deleteWorkList',
      payload: {
        wbsHeaderId,
        tenantId,
        data: record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearchWorkList(this.state.taskCode);
      }
    });
  }

  /**
   * 新增文件
   */
  @Bind()
  handleAddFile(record) {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { workList, fileMap = {} },
    } = this.props;
    const workListItemId = uuidv4();
    const newItem = {
      tenantId,
      workListItemId,
      workListId: record.workListId,
      fileDirectory: '暂不开发', // todo 需要删除
      _status: 'create',
    };
    const temp = {
      ...fileMap,
      [record.workListId]: [...(fileMap[record.workListId] || []), newItem],
    };
    // 新增交付物时给其所在的工作清单添加一个状态，用于保存
    const newList = workList.map(item =>
      item.workListId === record.workListId
        ? { ...item, _status: item._status ? item._status : 'update' }
        : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        fileMap: temp,
        workList: newList,
      },
    });
  }

  /**
   * 清除文件
   */
  @Bind()
  handleCancelFile(workListRecord, record) {
    const {
      dispatch,
      wbsPlanMaintain: { fileMap },
    } = this.props;
    const temp = {
      ...fileMap,
      [workListRecord.workListId]: fileMap[workListRecord.workListId].filter(
        item => item.workListItemId !== record.workListItemId
      ),
    };
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        fileMap: temp,
      },
    });
  }
  /**
   * 编辑文件
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditFile(workListRecord, record, flag) {
    const {
      dispatch,
      wbsPlanMaintain: { workList, fileMap },
    } = this.props;
    const temp = {
      ...fileMap,
      [workListRecord.workListId]: fileMap[workListRecord.workListId].map(item =>
        item.workListItemId === record.workListItemId
          ? { ...item, _status: flag ? 'update' : '' }
          : item
      ),
    };
    // 新增交付物时给其所在的工作清单添加一个_update状态，用于保存
    const newList = workList.map(item =>
      item.workListId === workListRecord.workListId ? { ...item, _status: 'update' } : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        fileMap: temp,
        workList: newList,
      },
    });
  }

  /**
   * 删除文件
   */
  @Bind()
  handleDeleteFile(record) {
    const { tenantId, match, dispatch } = this.props;
    const { wbsHeaderId } = match.params;
    dispatch({
      type: 'wbsPlanMaintain/deleteFile',
      payload: {
        wbsHeaderId,
        tenantId,
        data: record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearchWorkList(this.state.taskCode);
      }
    });
  }
  /**
   * 根据节点路径，在树形结构树中的对应节点添加或替换children属性
   * @param {Array} collections 树形结构树
   * @param {Array} cursorPath 节点路径
   * @param {Array} data  追加或替换的children数据
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, cursorPath = [], data) {
    let newCursorList = cursorPath;
    const cursor = newCursorList[0];
    const tree = collections.map(n => {
      const m = n;
      if (m.wbsLineId === cursor) {
        if (newCursorList[1]) {
          if (!m.children) {
            m.children = [];
          }
          newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
          m.children = this.findAndSetNodeProps(m.children, newCursorList, data);
        } else {
          m.children = [...data];
        }
        if (m.children.length === 0) {
          const { children, ...others } = m;
          return { ...others };
        } else {
          return m;
        }
      }
      return m;
    });
    return tree;
  }

  /**
   * 根据节点路径，在树形结构树中的对应节点
   * @param {Array} collection 树形结构树
   * @param {Array} cursorList 节点路径
   * @param {String} keyName 主键名称
   * @returns {Object} 节点信息
   */
  findNode(collection, cursorList = [], keyName) {
    let newCursorList = cursorList;
    const cursor = newCursorList[0];
    for (let i = 0; i < collection.length; i++) {
      if (collection[i][keyName] === cursor) {
        if (newCursorList[1]) {
          newCursorList = newCursorList.slice(1);
          return this.findNode(collection[i].children, newCursorList, keyName);
        }
        return collection[i];
      }
    }
  }

  /**
   * 基线弹窗
   */
  @Bind()
  handleShowBaseLineModal() {
    this.handleSearchBaseLine();
    this.setState({ baseLineModalVisible: true });
  }

  /**
   * 基线列表查询
   */
  @Bind()
  handleSearchBaseLine() {
    const {
      tenantId,
      dispatch,
      match,
      wbsPlanMaintain: { wbsPlanHeader },
    } = this.props;
    const { wbsHeaderId } = match.params;
    dispatch({
      type: 'wbsPlanMaintain/fetchBaseLine',
      payload: {
        tenantId,
        wbsHeaderId,
        projectId: wbsPlanHeader.projectId,
      },
    }).then(res => {
      if (res) {
        // 查询结果为空时，需要往baselines塞入初始数据
        const initialList = [
          {
            tenantId,
            primaryFlag: 0,
            proBaseWbsId: uuidv4(),
            baseWbsName: '基线1',
            projectId: wbsPlanHeader.projectId,
          },
          {
            tenantId,
            primaryFlag: 0,
            proBaseWbsId: uuidv4(),
            baseWbsName: '基线2',
            projectId: wbsPlanHeader.projectId,
          },
          {
            tenantId,
            primaryFlag: 0,
            proBaseWbsId: uuidv4(),
            baseWbsName: '基线3',
            projectId: wbsPlanHeader.projectId,
          },
        ];
        if (res.length === 1) {
          initialList.splice(0, 1);
        } else if (res.length === 2) {
          initialList.splice(0, 2);
        } else if (res.length === 3) {
          initialList.splice(0, 3);
        }
        dispatch({
          type: 'wbsPlanMaintain/updateState',
          payload: {
            baseLines: [...res, ...initialList],
          },
        });
      }
    });
  }

  /**
   * 编辑基线
   */
  @Bind()
  handleEditBaseLine(record, flag) {
    const {
      dispatch,
      wbsPlanMaintain: { baseLines },
    } = this.props;
    const temps = baseLines.map(item =>
      item.proBaseWbsId === record.proBaseWbsId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'wbsPlanMaintain/updateState',
      payload: {
        baseLines: temps,
      },
    });
  }

  /**
   * 保存基线
   */
  @Bind()
  handleSaveBaseLine() {
    const {
      dispatch,
      tenantId,
      wbsPlanMaintain: { baseLines },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(baseLines, ['proBaseWbsId']);
    // 若编辑的是初始数据，_status为update，此时需要手动过滤proBaseWbsId
    if (Array.isArray(params) && params.length > 0) {
      const temps = params.map(item => {
        if (typeof item.proBaseWbsId === 'string') {
          const { proBaseWbsId, ...other } = item;
          return { ...other };
        } else {
          return item;
        }
      });
      dispatch({
        type: 'wbsPlanMaintain/saveBaseLine',
        payload: {
          tenantId,
          data: temps,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchBaseLine();
        }
      });
    }
  }

  render() {
    const prefix = 'appm.wbsPlanMaintain.model.wbsPlanMaintain';
    const {
      wbsPlanMaintain,
      tenantId,
      loading,
      match,
      form: { getFieldDecorator },
    } = this.props;
    const {
      relationModalVisible,
      scheduleModalVisible,
      filterModalVisible,
      baseLineModalVisible,
      isEdit,
      drawerVisible,
      wbsLineId,
    } = this.state;
    const { wbsHeaderId } = match.params;
    const {
      limitDate = {},
      wbsPlanHeader = {},
      expandedRowKeys = [],
      treeList = [],
      projectWbsScheduleList = [],
      projectWbsRelsList = [],
      taskTypeMap = [], // 任务类型
      priorityMap = [], // 优先级
      riskLevelMap = [], // 风险等级
      levelMap = [], // 层次编号
      detail = {},
      taskRelationList = [],
      otherUsers = [], // 参与人
      otherRoles = [], // 参与角色
      planModeMap = [], // 计划模式
      taskStatusMap = [], // 任务状态
      relationTypeMap = [], // 关系类型
      workList = [], // 工作清单
      fileMap = {}, // 文件列表
      baseLines = [], // 基线列表
    } = wbsPlanMaintain;
    const listProps = {
      limitDate,
      levelMap,
      expandedRowKeys,
      loading,
      taskTypeMap,
      priorityMap,
      riskLevelMap,
      otherRoles,
      otherUsers,
      dataSource: treeList,
      wbsStatus: wbsPlanHeader.wbsStatus,
      uomCode: wbsPlanHeader.limitTimeUom,
      uomName: wbsPlanHeader.limitTimeUomMeaning,
      onExpand: this.handleExpandSubLine,
      onShowRelationModal: this.handleShowRelationModal,
      onShowScheduleModal: this.handleShowScheduleModal,
      onAddTask: this.handleAddTask,
      onDelete: this.handleDeleteTask,
      onEdit: this.handleEditTask,
      onCancel: this.handleCancelTask,
      onAddTopTask: this.handleAddTopTask,
      onEditTopTask: this.handleEditTopTask,
    };
    const relationModalProps = {
      levelMap,
      modalVisible: relationModalVisible,
      dataSource: projectWbsRelsList,
      onCancel: this.handleCancel,
      onEdit: this.handleEditTask,
    };
    const scheduleModalProps = {
      modalVisible: scheduleModalVisible,
      onCancel: this.handleCancel,
      dataSource: projectWbsScheduleList,
    };
    const filterModalProps = {
      tenantId,
      wbsPlanHeader,
      taskTypeMap,
      priorityMap,
      riskLevelMap,
      modalVisible: filterModalVisible,
      onCancel: this.handleCancel,
      onSearch: this.handleSearchWBSLines,
    };
    const baseLineModalProps = {
      tenantId,
      projectId: wbsPlanHeader.projectId,
      saveBaseLine: loading.saveBaseLine,
      searchBaseLine: loading.searchBaseLine,
      modalVisible: baseLineModalVisible,
      dataSource: baseLines,
      onEdit: this.handleEditBaseLine,
      onSave: this.handleSaveBaseLine,
      onCancel: this.handleCancel,
    };
    const drawerProps = {
      tenantId,
      taskRelationList,
      otherUsers,
      otherRoles,
      planModeMap,
      taskTypeMap,
      taskStatusMap,
      priorityMap,
      riskLevelMap,
      relationTypeMap,
      wbsHeaderId,
      wbsLineId,
      workList,
      fileMap,
      wbsPlanHeader,
      uomCode: wbsPlanHeader.limitTimeUom,
      uomName: wbsPlanHeader.limitTimeUomMeaning,
      detailInfo: detail,
      anchor: 'right',
      loading: isEdit ? loading.detail : false,
      saveLoading: loading.save,
      visible: drawerVisible,
      wbsStatus: wbsPlanHeader.wbsStatus,
      workListLoading: loading.workList,
      deleteRelsLoading: loading.deleteRels,
      title: isEdit ? intl.get(`appm.plan`).d('编辑计划') : intl.get(`appm.plan`).d('新增计划'),
      onSave: this.handleSave,
      onCancel: this.handleDrawerCancel,
      onRef: this.handleBindRef,
      onSearch: this.fetchDetailList,
      onAddLine: this.handleAddLine,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteLine,
      onAddWorkList: this.handleAddWorkList,
      onCancelWorkList: this.handleCancelWorkList,
      onEditWorkList: this.handleEditWorkList,
      onAddFile: this.handleAddFile,
      onCancelFile: this.handleCancelFile,
      onEditFile: this.handleEditFile,
      onSaveWorkList: this.handleSaveWorkList,
      onDeleteWorkList: this.handleDeleteWorkList,
      onView: this.handleViewFile,
      onDeleteFile: this.handleDeleteFile,
    };
    const exportParams = this.form ? this.form.getFieldsValue() : {};
    return (
      <Fragment>
        <Header
          title={intl.get('appm.wbsPlanMaintain.view.message.title').d('WBS计划维护')}
          backPath={`/appm/pro-basic-info/detail/${wbsPlanHeader.projectId}`}
        >
          <Button
            icon="save"
            type="primary"
            loading={loading.save}
            style={{ display: wbsPlanHeader.wbsStatus === 'PRESET' ? 'block' : 'none' }}
            onClick={() => this.handleSaveCreatedData()}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            icon="check"
            loading={loading.submit}
            style={{ display: wbsPlanHeader.wbsStatus === 'PRESET' ? 'block' : 'none' }}
            onClick={this.handleSubmit}
          >
            {intl.get('hzero.common.button.submit').d('提交')}
          </Button>
          <Button icon="check" onClick={this.handleShowBaseLineModal}>
            {intl.get(`${prefix}.baseLine`).d('设定基线')}
          </Button>
          <Button icon="search" onClick={this.handleShowFilterModal}>
            {intl.get(`${prefix}.filter`).d('筛选任务')}
          </Button>
          <ExcelExport
            requestUrl={`${HALM_PPM}/v1/${tenantId}/pro-wbs/export`}
            queryParams={exportParams}
          />
          <Button icon="down" onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
          <Button icon="up" onClick={this.handleShrink}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={loading.header}>
            <Row style={{ marginBottom: 10 }}>
              <Col>
                <Row>
                  <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                    {wbsPlanHeader.projectName}.{wbsPlanHeader.projectCode}
                  </span>
                  <Tag color="#2db7f5">{wbsPlanHeader.proStatusName}</Tag>
                </Row>
              </Col>
            </Row>
            <Form>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.manageOrgName`).d('项目管理组织')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{wbsPlanHeader.orgFullName}</span>
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.startDate`).d('预计开始日期')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{dateRender(wbsPlanHeader.expectStartDate)}</span>
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.endDate`).d('预计结束日期')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{dateRender(wbsPlanHeader.expectEndDate)}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.wbsVersion`).d('版本号')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{`${wbsPlanHeader.wbsVersion}.0`}</span>
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.wbsStatus`).d('版本状态')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{wbsPlanHeader.wbsStatusMeaning}</span>
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    label={intl.get(`${prefix}.approveStatus`).d('审批状态')}
                    {...EDIT_FORM_ITEM_LAYOUT}
                  >
                    <span>{wbsPlanHeader.approveStatusMeaning}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row {...EDIT_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_2_3_LAYOUT}>
                  <Form.Item
                    style={{ marginLeft: 7 }}
                    label={intl.get(`${prefix}.remark`).d('版本变更原因')}
                    {...EDIT_FORM_ITEM_LAYOUT_COL_4}
                  >
                    {getFieldDecorator('remark', {
                      initialValue: wbsPlanHeader.remark,
                      rules: [
                        {
                          required: wbsPlanHeader.wbsStatus === 'PRESET',
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${prefix}.remark`).d('版本变更原因'),
                          }),
                        },
                        {
                          max: 240,
                          message: intl.get('hzero.common.validation.max', {
                            max: 240,
                          }),
                        },
                      ],
                    })(<Input disabled={wbsPlanHeader.wbsStatus !== 'PRESET'} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
          <ListTable {...listProps} />
          <RelationModal {...relationModalProps} />
          <ScheduleModal {...scheduleModalProps} />
          <FilterModal {...filterModalProps} />
          <BaseLineModal {...baseLineModalProps} />
          <Drawer {...drawerProps} />
        </Content>
      </Fragment>
    );
  }
}
export default WBSPlanMaintain;
