/**
 * ProjectStatus - 项目状态
 * @date: 2019-2-20
 * @author: WH <heng.wei@hand-china.com>
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
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import ListTable from './ListTable';

@connect(({ projectStatus, loading }) => ({
  projectStatus,
  tenantId: getCurrentOrganizationId(),
  loading: {
    search: loading.effects['projectStatus/fetchProjectStatus'],
    save: loading.effects['projectStatus/saveProjectStatus'],
  },
}))
@formatterCollections({
  code: ['appm.projectStatus'],
})
class ProjectStatus extends Component {
  componentDidMount() {
    this.handleSearch();
  }
  @Bind()
  handleSearch() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'projectStatus/fetchProjectStatus',
      payload: {
        tenantId,
      },
    });
  }
  @Bind()
  handleDataSave() {
    const {
      dispatch,
      tenantId,
      projectStatus: { statusList },
    } = this.props;
    const params = getEditTableData(statusList.filter(i => i._status === 'update')).map(i => ({
      ...i,
      nextStatus: JSON.stringify(i.nextStatus),
    }));
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'projectStatus/saveProjectStatus',
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
  handleEditLine(current, flag) {
    const {
      dispatch,
      projectStatus: { statusList = [] },
    } = this.props;
    const newList = statusList.map(item =>
      item.proStatusId === current.proStatusId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'projectStatus/updateState',
      payload: {
        statusList: newList,
      },
    });
  }
  render() {
    const {
      loading,
      projectStatus: { statusList = [], sysStatus = [] },
    } = this.props;
    const listProps = {
      sysStatus,
      loading: loading.search,
      dataSource: statusList,
      onEdit: this.handleEditLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`appm.projectStatus.view.message.title`).d('项目状态')}>
          <Button icon="save" type="primary" loading={loading.save} onClick={this.handleDataSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default ProjectStatus;
