/**
 * TaskTemplate - WBS结构模板
 * @date: 2019-3-11
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Tag, Row, Col, Spin, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { isEmpty, isNull } from 'lodash';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import ListTable from './ListTable';
import Drawer from './Drawer';
import RelationModal from './RelationModal';

@connect(({ taskTemplate, loading }) => ({
  taskTemplate,
  tenantId: getCurrentOrganizationId(),
  loading: {
    search: loading.effects['taskTemplate/fetchTaskTemplate'],
    searchPro: loading.effects['taskTemplate/fetchProjectTemplate'],
    detail: loading.effects['taskTemplate/fetchTaskDetail'],
    save: loading.effects['taskTemplate/saveTask'] || loading.effects['taskTemplate/saveWorkList'],
    batchSave: loading.effects['taskTemplate/saveTasks'],
    task: loading.effects['taskTemplate/fetchTaskRelation'],
    taskModal: loading.effects['taskTemplate/fetchTaskRelationModal'],
    deleteList: loading.effects['taskTemplate/queryDeleteList'],
    workList: loading.effects['taskTemplate/fetchWorkList'],
    deleteRels: loading.effects['taskTemplate/deleteTaskRelation'],
  },
}))
class TaskTemplate extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false, // 滑窗控制标记
      relationModalVisible: false,
      isEdit: false, // 是否“编辑”标记位
    };
  }
  componentDidMount() {
    const { dispatch, tenantId, match } = this.props;
    const { proTemplateId } = match.params;
    this.handleSearch();
    dispatch({
      type: 'taskTemplate/fetchProjectTemplate',
      payload: {
        tenantId,
        proTemplateId,
        presetFlag: 0,
      },
    });
    dispatch({ type: 'taskTemplate/fetchProjectRole', payload: { tenantId } });
    dispatch({ type: 'taskTemplate/fetchLov', payload: { tenantId } });
  }
  /**
   * 打开任务关系模态框
   */
  @Bind()
  handleShowRelationModal(record) {
    this.handleFetchTaskRelationModal(record.proTaskId);
    this.setState({ relationModalVisible: true });
  }
  /**
   * 关闭模态框
   */
  @Bind()
  handleCancel() {
    this.props.dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskRelation: [],
      },
    });
    this.setState({
      relationModalVisible: false,
    });
  }

  /**
   * 获取任务数据列表
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { proTemplateId } = match.params;
    dispatch({
      type: 'taskTemplate/fetchTaskTemplate',
      payload: {
        tenantId,
        proTemplateId,
      },
    });
  }
  /**
   * 新建下级任务
   */
  @Bind()
  handleAddTask(record = {}) {
    const {
      dispatch,
      tenantId,
      match,
      taskTemplate: { taskList = [], expandedRowKeys = [], pathMap = {} },
    } = this.props;
    const { proTemplateId } = match.params;
    const proTaskId = uuidv4();
    const newItem = {
      tenantId,
      proTaskId,
      proTemplateId: Number(proTemplateId),
      priorityCode: 'MEDIUM',
      planModeCode: 'MANUAL',
      taskTypeCode: 'PROJECT_MISSION',
      parentTaskId: record.proTaskId,
      taskTemplateRelsList: [],
      _status: 'create',
    };
    const newChildren = [...(record.children || []), newItem];
    const newTreeList = this.findAndSetNodeProps(taskList, pathMap[record.proTaskId], newChildren);
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskList: [...newTreeList],
        expandedRowKeys: [...expandedRowKeys, record.proTaskId],
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
      match,
      taskTemplate: { taskList = [], expandedRowKeys = [] },
    } = this.props;
    const { proTemplateId } = match.params;
    const proTaskId = uuidv4();
    const newItem = {
      proTaskId,
      tenantId,
      proTemplateId: Number(proTemplateId),
      priorityCode: 'MEDIUM',
      planModeCode: 'MANUAL',
      taskTypeCode: 'PROJECT_MISSION',
      taskTemplateRelsList: [],
      _status: 'create',
    };
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskList: [...taskList, newItem],
        expandedRowKeys: [...expandedRowKeys, proTaskId],
      },
    });
  }

  /**
   * 编辑任务
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleEditTask(record) {
    this.handleSearchTaskDetail(record.proTaskId);
    this.handleFetchTaskRelation(record.proTaskId);
    this.handleSearchWorkList(record.taskNum);
    this.setState({
      taskNum: record.taskNum,
      proTaskId: record.proTaskId,
      drawerVisible: true,
      isEdit: true,
    });
  }
  /**
   * 查看任务
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleViewTask(current) {
    this.handleSearchTaskDetail(current.proTaskId);
    this.handleFetchTaskRelation(current.proTaskId);
    this.setState({ drawerVisible: true, isEdit: true });
  }
  /**
   * 任务明细查询
   */
  @Bind()
  handleSearchTaskDetail(proTaskId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'taskTemplate/fetchTaskDetail',
      payload: {
        tenantId,
        proTaskId,
      },
    });
  }
  /**
   * 从数据库中获取的任务间关系列表
   * @param {string} proTaskId 任务id
   */
  @Bind()
  handleFetchTaskRelation(proTaskId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'taskTemplate/fetchTaskRelation',
      payload: {
        tenantId,
        proTaskId,
      },
    });
  }
  /**
   * 从数据库中获取的任务间关系列表
   * 为了区分同时打开入口列表的关系弹窗的数据源以及右滑窗的数据源
   * @param {string} proTaskId 任务id
   */
  @Bind()
  handleFetchTaskRelationModal(proTaskId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'taskTemplate/fetchTaskRelationModal',
      payload: {
        tenantId,
        proTaskId,
      },
    });
  }
  /**
   * 删除WBS任务
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleRemoveTask(current) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'taskTemplate/queryDeleteList',
      payload: {
        tenantId,
        proTaskId: current.proTaskId,
        proTemplateId: current.proTemplateId,
      },
    }).then(result => {
      if (result) {
        const taskList = result.map(item => item.taskName);
        const taskString = taskList.toString().replace(/,/g, '、');
        const message = !isEmpty(taskString)
          ? `${taskString}与该任务有任务间关系，删除该任务之后，对应的任务间关系会被一并删除`
          : '';
        const childrenMessage = !isNull(current.children) ? '及其下层数据?' : '?';
        Modal.confirm({
          content: intl
            .get('appm.taskTemplate.view.message.delete')
            .d(`是否删除该层任务${childrenMessage} ${message}`),
          onOk: () => {
            const value = { ...current, otherRoles: current.otherRoles.toString() };
            dispatch({
              type: 'taskTemplate/deleteTask',
              payload: {
                tenantId,
                proTaskId: current.proTaskId,
                data: value,
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
   * 滑窗确定
   *@param {Object} current - 当前行对象
   */
  @Bind()
  handleDrawerOk(current) {
    const {
      dispatch,
      tenantId,
      taskTemplate: { taskRelation = [] },
    } = this.props;
    const newTaskRelation = [];
    taskRelation.forEach(item => {
      if (['create', 'update'].includes(item._status)) {
        newTaskRelation.push(item);
      }
    });
    this.form.validateFields((err, values) => {
      if (!err) {
        const data =
          (newTaskRelation.length && getEditTableData(newTaskRelation, ['taskRelationId'])) || [];
        let saveFlag = false;
        if (newTaskRelation.length === 0) {
          saveFlag = saveFlag || true;
        }
        if (Array.isArray(data) && data.length > 0) {
          saveFlag = saveFlag || true;
        }
        if (saveFlag) {
          const { otherRoles = [] } = current;
          dispatch({
            type: 'taskTemplate/saveTask',
            payload: {
              tenantId,
              data: {
                ...current,
                ...values,
                // 里程牌的时候工期传0
                limitTime: values.taskTypeCode === 'MILESTONE' ? 0 : values.limitTime,
                otherRoles: otherRoles.toString(),
                taskTemplateRelsList: data,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
              this.handleSearchTaskDetail(current.proTaskId);
              this.handleFetchTaskRelation(current.proTaskId);
            }
          });
        }
      }
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
   * 任务间关系-新增行数据
   */
  @Bind()
  handleAddRelation() {
    const {
      dispatch,
      tenantId,
      taskTemplate: { taskRelation = [] },
    } = this.props;
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskRelation: [
          {
            tenantId,
            taskRelationId: uuidv4(),
            beforeTaskId: '', // 前置任务
            relationTypeCode: '', // 关系类型
            delayTime: '', // 延迟时间
            advanceTime: '', // 提前时间
            primaryFlag: isEmpty(taskRelation) ? 1 : 0, // 主要关系
            _status: 'create',
          },
          ...taskRelation,
        ],
      },
    });
  }
  /**
   * 任务间关系-清除行数据
   */
  @Bind()
  handleCleanRelation(record) {
    const {
      dispatch,
      taskTemplate: { taskRelation = [] },
    } = this.props;
    const newList = taskRelation.filter(item => item.taskRelationId !== record.taskRelationId);
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskRelation: [...newList],
      },
    });
  }
  /**
   * 任务间关系-编辑行数据
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditRelation(record, flag) {
    const {
      dispatch,
      taskTemplate: { taskRelation = [] },
    } = this.props;
    const newList = taskRelation.map(item =>
      item.taskRelationId === record.taskRelationId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskRelation: [...newList],
      },
    });
  }
  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 任务行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      taskTemplate: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.proTaskId]
      : expandedRowKeys.filter(item => item !== record.proTaskId);
    dispatch({
      type: 'taskTemplate/updateState',
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
      taskTemplate: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'taskTemplate/updateState',
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
      type: 'taskTemplate/updateState',
      payload: { expandedRowKeys: [] },
    });
  }
  /**
   * 传递表单参数
   * @param {object} ref - Drawer对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 编辑固定行
   * @param {Object} record 行数据
   */
  @Bind()
  handleEditTopTask(record, flag) {
    const {
      dispatch,
      taskTemplate: { taskList = [] },
    } = this.props;
    const newList = taskList.map(item =>
      item.proTaskId === record.proTaskId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskList: [...newList],
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
      taskTemplate: { taskList, projectTemplate },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(taskList, ['children', 'proTaskId']);
    if (Array.isArray(params) && params.length > 0) {
      const list = [];
      params.forEach(item => {
        // 修改固定行时过滤掉多余字段
        if (item.taskName === projectTemplate.proTemplateName) {
          list.push({
            proTaskId: item.proTaskId,
            proTemplateId: item.proTemplateId,
            taskName: item.taskName,
            limitTime: item.limitTime,
            levelPath: item.levelPath,
            levelNumber: item.levelNumber,
            objectVersionNumber: item.objectVersionNumber,
            _token: item._token,
          });
        } else {
          list.push({
            ...item,
            // 里程牌的时候工期传0
            limitTime: item.taskTypeCode === 'MILESTONE' ? 0 : item.limitTime,
            principalRoleId: Number(item.principalRoleId),
          });
        }
      });
      dispatch({
        // 批量保存接口
        type: 'taskTemplate/saveTasks',
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
  }
  /**
   * 清除
   * @param {Object} record 清除新增行对象
   */
  @Bind()
  handleCancelTask(record = {}) {
    const {
      dispatch,
      taskTemplate: { taskList = [], pathMap = {} },
    } = this.props;
    let newTreeList = [];
    if (record.parentTaskId) {
      // 找到父节点的children, 更新children数组
      const node = this.findNode(taskList, pathMap[record.parentTaskId], 'proTaskId');
      const newChildren = node.children.filter(item => item.proTaskId !== record.proTaskId);
      newTreeList = this.findAndSetNodeProps(taskList, pathMap[record.parentTaskId], newChildren);
    } else {
      newTreeList = taskList.filter(item => item.proTaskId !== record.proTaskId);
    }
    dispatch({
      type: 'taskTemplate/updateState',
      payload: {
        taskList: newTreeList,
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
      taskTemplate: { workList, fileMap },
    } = this.props;
    const { proTemplateId } = match.params;
    const { taskNum } = this.state;
    // 处理表单效验，获取处理后的表单数据
    const tempWorkList = workList.map(item => {
      const param = getEditTableData(fileMap[item.taskListId], ['children', 'taskListItemId']);
      const items = [];
      param.forEach(e => {
        if (typeof e.taskListId === 'string') {
          // 新建时，过滤掉其taskListId
          const { taskListId, ...other } = e;
          items.push(other);
        } else {
          items.push(e);
        }
      });
      return {
        ...item,
        principalRoleId: Number(item.principalRoleId),
        taskWorkListItemList: items,
      };
    });
    const params = getEditTableData(tempWorkList, ['children', 'taskListId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'taskTemplate/saveWorkList',
        payload: {
          tenantId,
          taskNum,
          proTemplateId: Number(proTemplateId),
          data: params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchWorkList(taskNum);
        }
      });
    }
  }

  /**
   * 查询工作列表
   */
  @Bind()
  handleSearchWorkList(taskNum) {
    const { dispatch, tenantId, match } = this.props;
    const { proTemplateId } = match.params;
    dispatch({
      type: 'taskTemplate/fetchWorkList',
      payload: {
        tenantId,
        taskNum,
        proTemplateId,
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
      taskTemplate: { workList },
    } = this.props;
    const { taskNum } = this.state;
    const { proTemplateId } = match.params;
    const taskListId = uuidv4();
    const newItem = {
      tenantId,
      taskListId,
      taskNum,
      proTemplateId: Number(proTemplateId),
      taskWorkListItemList: [],
      _status: 'create',
    };
    dispatch({
      type: 'taskTemplate/updateState',
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
      taskTemplate: { workList },
    } = this.props;
    const temp = workList.filter(item => item.taskListId !== record.taskListId);
    dispatch({
      type: 'taskTemplate/updateState',
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
      taskTemplate: { workList = [] },
    } = this.props;
    const newList = workList.map(item =>
      item.taskListId === record.taskListId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'taskTemplate/updateState',
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
    const { proTemplateId } = match.params;
    const { proTaskId } = this.state;
    dispatch({
      type: 'taskTemplate/deleteWorkList',
      payload: {
        proTemplateId,
        proTaskId,
        tenantId,
        data: record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearchWorkList(this.state.taskNum);
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
      taskTemplate: { workList, fileMap = {} },
    } = this.props;
    const taskListItemId = uuidv4();
    const newItem = {
      tenantId,
      taskListItemId,
      taskListId: record.taskListId,
      fileDirectory: '暂不开发', // todo 需要删除
      _status: 'create',
    };
    const temp = {
      ...fileMap,
      [record.taskListId]: [...(fileMap[record.taskListId] || []), newItem],
    };
    // 新增交付物时给其所在的工作清单添加一个状态，用于保存
    const newList = workList.map(item =>
      item.taskListId === record.taskListId
        ? { ...item, _status: item._status ? item._status : 'update' }
        : item
    );
    dispatch({
      type: 'taskTemplate/updateState',
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
      taskTemplate: { fileMap },
    } = this.props;
    const temp = {
      ...fileMap,
      [workListRecord.taskListId]: fileMap[workListRecord.taskListId].filter(
        item => item.taskListItemId !== record.taskListItemId
      ),
    };
    dispatch({
      type: 'taskTemplate/updateState',
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
      taskTemplate: { workList, fileMap },
    } = this.props;
    const temp = {
      ...fileMap,
      [workListRecord.taskListId]: fileMap[workListRecord.taskListId].map(item =>
        item.taskListItemId === record.taskListItemId
          ? { ...item, _status: flag ? 'update' : '' }
          : item
      ),
    };
    // 新增交付物时给其所在的工作清单添加一个_update状态，用于保存
    const newList = workList.map(item =>
      item.taskListId === workListRecord.taskListId ? { ...item, _status: 'update' } : item
    );
    dispatch({
      type: 'taskTemplate/updateState',
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
    const { proTemplateId } = match.params;
    const { proTaskId } = this.state;
    dispatch({
      type: 'taskTemplate/deleteFile',
      payload: {
        proTemplateId,
        proTaskId,
        tenantId,
        data: record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearchWorkList(this.state.taskNum);
      }
    });
  }

  /**
   * 删除任务间关系
   */
  @Bind()
  handleDelete(selectedRows, itemData) {
    const {
      dispatch,
      tenantId,
      taskTemplate: { taskRelation },
    } = this.props;
    let successFlag = false;
    Modal.confirm({
      content: intl.get('appm.taskTemplate.view.message.detailLine.delete').d('是否删除前置任务'),
      onOk: () => {
        const newTaskRelationList = taskRelation.filter(item => selectedRows.indexOf(item) === -1);
        const newSelectedRows = [];
        selectedRows.forEach(item => {
          if (item._status !== 'create') {
            newSelectedRows.push(item);
          }
        });
        dispatch({
          // 删除数据库中的任务记录
          type: 'taskTemplate/deleteTaskRelation',
          payload: {
            tenantId,
            proTaskId: itemData.proTaskId,
            data: newSelectedRows,
          },
        }).then(res => {
          if (res) {
            successFlag = true;
            dispatch({
              // 数据库中没有的任务记录，只是从页面上删除
              type: 'taskTemplate/updateState',
              payload: {
                taskRelation: newTaskRelationList,
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
      if (m.proTaskId === cursor) {
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

  render() {
    const { relationModalVisible, drawerVisible = false, isEdit = false } = this.state;
    const { tenantId, dispatch, loading, match, taskTemplate } = this.props;
    const { proTemplateId } = match.params;
    const {
      projectTemplate = {},
      taskList = [],
      taskDetail = {},
      expandedRowKeys = [],
      projectRole = [],
      planMode = [],
      priority = [],
      relationType = [],
      taskRelation = [],
      taskType = [],
      levelMap = [],
      workList = [],
      fileMap = [],
      roles = [],
      taskRelationModal = [],
    } = taskTemplate;
    const listProps = {
      taskType,
      projectTemplate,
      projectRole,
      levelMap,
      expandedRowKeys,
      loading,
      priority,
      roles,
      dataSource: taskList,
      proTemplateStatus: projectTemplate.proTemplateStatus,
      onEdit: this.handleEditTask,
      onAdd: this.handleAddTask,
      onView: this.handleViewTask,
      onRemove: this.handleRemoveTask,
      onExpand: this.handleExpandSubLine,
      onShowRelationModal: this.handleShowRelationModal,
      onAddTopTask: this.handleAddTopTask,
      onAddTask: this.handleAddTask,
      onCancel: this.handleCancelTask,
      onEditTopTask: this.handleEditTopTask,
    };
    const drawerProps = {
      tenantId,
      proTemplateId,
      roles,
      dispatch,
      taskRelation,
      projectRole,
      planMode,
      priority,
      relationType,
      taskType,
      workList,
      fileMap,
      projectTemplate,
      anchor: 'right',
      proTemplateStatus: projectTemplate.proTemplateStatus,
      loading: isEdit ? loading.detail : false,
      saveLoading: loading.save,
      taskLoading: loading.task,
      deleteRelsLoading: loading.deleteRels,
      itemData: taskDetail,
      visible: drawerVisible,
      title: isEdit ? intl.get(`appm.task`).d('编辑任务') : intl.get(`appm.task`).d('新增任务'),
      onOk: this.handleDrawerOk,
      onCancel: this.handleDrawerCancel,
      onAddLine: this.handleAddRelation,
      onCleanLine: this.handleCleanRelation,
      onEditLine: this.handleEditRelation,
      onRef: this.handleBindRef,
      onAddWorkList: this.handleAddWorkList,
      workListLoading: loading.workList,
      onSaveWorkList: this.handleSaveWorkList,
      onEditWorkList: this.handleEditWorkList,
      onCancelWorkList: this.handleCancelWorkList,
      onDeleteWorkList: this.handleDeleteWorkList,
      onCancelFile: this.handleCancelFile,
      onEditFile: this.handleEditFile,
      onDeleteFile: this.handleDeleteFile,
      onAddFile: this.handleAddFile,
      onDelete: this.handleDelete,
    };
    const relationModalProps = {
      levelMap,
      loading: loading.taskModal,
      modalVisible: relationModalVisible,
      dataSource: taskRelationModal,
      onCancel: this.handleCancel,
      onEdit: this.handleEditTask,
    };
    const path = projectTemplate.proTemplateStatus === 'PRESET' ? 'new-detail' : 'detail';
    return (
      <React.Fragment>
        <Header
          title={intl.get(`appm`).d('WBS结构信息')}
          backPath={`/appm/project-template/${path}/${proTemplateId}`}
        >
          <Button
            icon="save"
            type="primary"
            loading={loading.batchSave}
            onClick={() => this.handleSaveCreatedData()}
            style={{ display: projectTemplate.proTemplateStatus === 'PRESET' ? 'block' : 'none' }}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="down" style={{ marginLeft: 10 }} onClick={this.handleExpand}>
            {intl.get('hzero.common.button.expandAll').d('全部展开')}
          </Button>
          <Button icon="up" style={{ marginLeft: 10 }} onClick={this.handleShrink}>
            {intl.get('hzero.common.button.collapseAll').d('全部收起')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={loading.searchPro}>
            <Row style={{ marginBottom: 10 }}>
              <Col>
                <Row>
                  <span style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold' }}>
                    {projectTemplate.proTemplateName}.{projectTemplate.proTemplateCode}
                  </span>
                  <Tag color="#2db7f5">{`V${projectTemplate.versionNumber}`}</Tag>
                  <Tag color="#2db7f5">{projectTemplate.proTemplateStatusMeaning}</Tag>
                </Row>
              </Col>
            </Row>
          </Spin>
          <RelationModal {...relationModalProps} />
          <ListTable {...listProps} />
          <Drawer {...drawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
export default TaskTemplate;
