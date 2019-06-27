import React, { PureComponent } from 'react';
import { Row, Button, Popconfirm, message } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { omit } from 'lodash';
import styles from './index.less';

import WoLaborsEdit from './WoLaborsEdit';

@connect(({ woLabors, loading }) => ({
  woLabors,
  tenantId: getCurrentOrganizationId(),
  loading: {
    listLoading: loading.effects['woLabors/fetchWoLaborsList'],
    saveLoading: loading.effects['woLabors/saveEditData'],
  },
}))
class WoLaborsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      currentData: {},
    };
  }
  componentDidMount() {
    this.handleRefresh();
  }
  /**
   * 刷新列表数据
   */
  @Bind()
  handleRefresh() {
    const { parentId, tenantId, dispatch } = this.props;
    dispatch({ type: 'woLabors/fetchLov', payload: { tenantId } });
    dispatch({
      type: 'woLabors/fetchWoLaborsList',
      payload: {
        tenantId,
        woId: parentId,
      },
    });
  }
  /**
   * 保存
   */
  @Bind()
  handleConfirmLine(record) {
    const { parentId, tenantId, dispatch } = this.props;
    const current = {
      ...omit(record, ['_status']),
      woId: parentId,
    };
    if (record._status === 'create') {
      dispatch({
        type: 'woLabors/saveAddData',
        payload: {
          tenantId,
          ...current,
        },
      }).then(res => {
        if (res) {
          notification.success();
          // 刷新列表
          this.handleRefresh();
          this.setState({ editVisible: false });
        }
      });
    } else {
      dispatch({
        type: 'woLabors/saveEditData',
        payload: {
          tenantId,
          ...current,
        },
      }).then(res => {
        if (res) {
          notification.success();
          // 刷新列表
          this.handleRefresh();
          this.setState({ editVisible: false });
        }
      });
    }
  }
  /**
   * 取消
   */
  @Bind()
  handleCancelLine() {
    this.setState({ editVisible: false });
  }
  /**
   * 编辑
   */
  @Bind()
  handleEditLine(record) {
    this.setState({
      currentData: { ...record, _status: 'update' },
      editVisible: true,
    });
  }
  /**
   * 删除
   */
  @Bind()
  handleDeleteLine(record) {
    const { tenantId, parentId, dispatch } = this.props;
    dispatch({
      type: 'woLabors/deleteWoLabors',
      payload: record,
    }).then(res => {
      if (res) {
        message.success('删除成功!');
        // 刷新列表
        dispatch({
          type: 'woLabors/fetchWoLaborsList',
          payload: {
            tenantId,
            woId: parentId,
          },
        });
      }
    });
  }
  /**
   * 新增
   */
  @Bind()
  handleCreateWoLabors() {
    const { currentData } = this.state;
    this.setState({
      editVisible: true,
      currentData: { ...currentData, _status: 'create' },
    });
  }

  render() {
    const {
      parentId,
      tenantId,
      loading,
      parentType,
      woLabors: { list = [], pagination = {}, limitTimeUom },
    } = this.props;
    const { editVisible, currentData } = this.state;
    const woLaborsEditProps = {
      loading,
      parentId,
      tenantId,
      editVisible,
      parentType,
      limitTimeUom,
      anchor: 'right',
      title: intl.get(`amtc.woLabors.view.message.drawer`).d('人员'),
      dataSource: currentData,
      onConfirmLine: this.handleConfirmLine,
      onCancelLine: this.handleCancelLine,
    };
    const prefix = 'amtc.woLabors.model.woLabors';
    const columns = [
      {
        title: intl.get(`${prefix}.woopNum`).d('任务编号'),
        dataIndex: 'woopNum',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.workcenter`).d('工作中心'),
        dataIndex: 'workcenterName',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.workcenterRes`).d('资源/工种'),
        dataIndex: 'workcenterResName',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.workcenterPeople`).d('工作中心人员'),
        dataIndex: 'workcenterPeopleName',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.laborQuantity`).d('人员数量'),
        dataIndex: 'laborQuantity',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.unitDuration`).d('投入单元时间'),
        dataIndex: 'unitDuration',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.durationUom`).d('时间单位'),
        dataIndex: 'durationUomMeaning',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.plannedTotalDuration`).d('计划用工'),
        dataIndex: 'plannedTotalDuration',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.actualLaborQuantity`).d('实际人员数量'),
        dataIndex: 'actualLaborQuantity',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.actualTotalDuration`).d('实际用工'),
        dataIndex: 'actualTotalDuration',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.description`).d('记录备注'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        fixed: 'right',
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => this.handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
            <Popconfirm
              title="是否删除该记录?"
              placement="topRight"
              onConfirm={() => this.handleDeleteLine(record)}
              okText="是"
              cancelText="否"
            >
              <a>{intl.get('hzero.common.button.delete').d('删除')}</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Row style={{ margin: '10px' }}>
          <Button
            icon="plus"
            style={{ marginRight: '10px' }}
            type="primary"
            onClick={this.handleCreateWoLabors}
          >
            {intl.get(`amtc.woLabors.view.button.add`).d('新增')}
          </Button>
        </Row>
        <EditTable
          bordered
          rowKey="woLaborId"
          loading={loading.listLoading}
          columns={columns}
          dataSource={list}
          className={styles['wo-labors-detail']}
          pagination={pagination}
        />
        <WoLaborsEdit {...woLaborsEditProps} />
      </React.Fragment>
    );
  }
}
export default WoLaborsList;
