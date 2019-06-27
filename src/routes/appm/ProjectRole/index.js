/**
 * ProjectRole - 项目角色
 * @date: 2019-2-21
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

@connect(({ projectRole, loading }) => ({
  projectRole,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetch: loading.effects['projectRole/fetchProjectRole'],
    save: loading.effects['projectRole/saveProjectRole'],
    update: loading.effects['projectRole/updateRolePermission'],
  },
}))
@formatterCollections({
  code: ['appm.projectRole'],
})
class ProjectRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false, // 权限维护滑窗控制
    };
  }
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.handleSearch();
    dispatch({ type: 'projectRole/fetchLov', payload: { tenantId } });
  }
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'projectRole/fetchProjectRole',
      payload: {
        tenantId,
        ...filterValues,
      },
    });
  }
  @Bind()
  handleAddRole() {
    const {
      dispatch,
      tenantId,
      projectRole: { roleList = [] },
    } = this.props;
    const newItem = {
      tenantId,
      proRoleId: uuidv4(),
      enabledFlag: 1,
      _status: 'create',
    };
    dispatch({
      type: 'projectRole/updateState',
      payload: {
        roleList: [newItem, ...roleList],
      },
    });
  }
  @Bind()
  handleSaveRoles() {
    const {
      dispatch,
      tenantId,
      projectRole: { roleList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(roleList, ['proRoleId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'projectRole/saveProjectRole',
        payload: {
          tenantId,
          data: params,
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
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      projectRole: { roleList = [] },
    } = this.props;
    const newList = roleList.map(item =>
      item.proRoleId === current.proRoleId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'projectRole/updateState',
      payload: {
        roleList: newList,
      },
    });
  }
  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      projectRole: { roleList = [] },
    } = this.props;
    const newList = roleList.filter(item => item.proRoleId !== current.proRoleId);
    dispatch({
      type: 'projectRole/updateState',
      payload: {
        roleList: newList,
      },
    });
  }
  /**
   *
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleSetPermission(current = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectRole/fetchPermission',
      payload: {
        tenantId,
        proRoleId: current.proRoleId,
      },
    }).then(res => {
      if (res) {
        const newItem = isEmpty(res)
          ? {
              proRoleId: current.proRoleId,
              orderFlag: 1,
              convertAssetFlag: 1,
              prepareBudgetFlag: 1,
            }
          : res;
        this.setState({ drawerVisible: true, permission: newItem });
      }
    });
  }
  /**
   * 变更角色权限
   * @param {Object} data - 角色权限信息
   */
  @Bind()
  handleDrawerOk(data) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectRole/savePermission',
      payload: {
        tenantId,
        data,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ permission: {}, drawerVisible: false });
      }
    });
  }
  /**
   * 关闭角色权限维护滑窗
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ permission: {}, drawerVisible: false });
  }
  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  render() {
    const { drawerVisible = false, permission = {} } = this.state;
    const {
      loading,
      projectRole: {
        pagination = {},
        roleList = [],
        flag = [],
        projectRoleType = [],
        planPermissions = [],
        changePermissions = [],
      },
    } = this.props;
    const filterProps = {
      flag,
      projectRoleType,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      projectRoleType,
      loading: loading.fetch,
      dataSource: roleList,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onSetPermission: this.handleSetPermission,
    };
    const drawerProps = {
      planPermissions,
      changePermissions,
      onCancel: this.handleDrawerCancel,
      onOk: this.handleDrawerOk,
      visible: drawerVisible,
      anchor: 'right',
      itemData: permission,
      loading: loading.update,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`appm.projectRole.view.message.title`).d('项目角色')}>
          <Button type="primary" icon="plus" onClick={this.handleAddRole}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="save" onClick={this.handleSaveRoles}>
            {intl.get('hzero.common.button.save').d('保存')}
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
export default ProjectRole;
