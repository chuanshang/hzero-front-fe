import React, { PureComponent } from 'react';
import { Table, Row, Button, Popconfirm, message } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { omit } from 'lodash';

import WoChecklistGroupEdit from './WoChecklistGroupEdit';

@connect(({ woChecklistGroups, loading }) => ({
  woChecklistGroups,
  tenantId: getCurrentOrganizationId(),
  loading: {
    listLoading: loading.effects['woChecklistGroups/fetchWoChecklistGroupsList'],
  },
}))
class WoChecklistGroupList extends PureComponent {
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
    const { parentId, parentType, tenantId, dispatch } = this.props;
    dispatch({ type: 'woChecklistGroups/fetchLov', payload: { tenantId } });
    dispatch({
      type: 'woChecklistGroups/fetchWoChecklistGroupsList',
      payload: {
        tenantId,
        parentId,
        parentTypeCode: parentType,
      },
    });
  }
  /**
   * 保存
   */
  @Bind()
  handleConfirm(record) {
    const { parentId, parentType, tenantId, dispatch } = this.props;
    const current = {
      ...omit(record, ['_status']),
      actChecklistGroupId: 1,
      parentId,
      parentTypeCode: parentType,
    };
    dispatch({
      type: 'woChecklistGroups/saveEditData',
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
    dispatch({
      type: 'woChecklistGroups/updateState',
      payload: {
        detailList: [],
      },
    });
  }
  /**
   * 取消
   */
  @Bind()
  handleCancel() {
    const { tenantId, dispatch, parentId, parentType } = this.props;
    dispatch({
      type: 'woChecklistGroups/updateState',
      payload: {
        detailList: [],
      },
    });
    dispatch({
      type: 'woChecklists/fetchWoChecklistsList',
      payload: {
        tenantId,
        parentId,
        parentTypeCode: parentType,
      },
    });
    this.setState({ editVisible: false });
  }
  /**
   * 编辑
   */
  @Bind()
  handleEdit(record) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'woChecklistGroups/fetchWoChecklistsList',
      payload: {
        tenantId,
        parentId: record.checklistGroupId,
        parentTypeCode: 'CHECKLIST_GROUPS',
      },
    });
    this.setState({
      currentData: { ...record, _status: 'update' },
      editVisible: true,
    });
  }
  /**
   * 删除
   */
  @Bind()
  handleDelete(record) {
    const {
      dispatch,
      woChecklistGroups: { list = [] },
    } = this.props;
    dispatch({
      type: 'woChecklistGroups/deleteWoChecklistGroups',
      payload: record,
    }).then(res => {
      if (res) {
        message.success('删除成功!');
        // 刷新列表
        const newList =
          list.filter(item => item.checklistGroupId !== record.checklistGroupId) || [];
        dispatch({
          type: 'woChecklistGroups/updateState',
          payload: {
            list: newList,
          },
        });
      }
    });
  }
  /**
   * 新增
   */
  @Bind()
  handleCreateWoChecklistGroup() {
    this.setState({
      editVisible: true,
      currentData: { _status: 'create' },
    });
  }
  render() {
    const {
      parentId,
      tenantId,
      loading,
      dispatch,
      parentType,
      woChecklistGroups = {},
    } = this.props;
    const { parentTypeMap = [], list = [], detailList = [] } = woChecklistGroups;
    const { editVisible, currentData } = this.state;
    const woChecklistGroupEditProps = {
      parentId,
      parentType,
      detailList,
      loading,
      tenantId,
      dispatch,
      editVisible,
      parentTypeMap,
      woChecklistGroups,
      anchor: 'right',
      title: intl.get(`amtc.woChecklistGroups.view.message.drawer`).d('实际检查组'),
      dataSource: currentData,
      onConfirm: this.handleConfirm,
      onCancel: this.handleCancel,
    };
    const prefix = 'amtc.woChecklistGroups.model.woChecklistGroups';
    const columns = [
      {
        title: intl.get(`${prefix}.itemSeq`).d('序号'),
        dataIndex: 'groupSeq',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.checklistName`).d('实际检查组名称'),
        dataIndex: 'groupName',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.quantity`).d('标准检查组'),
        dataIndex: 'quantity',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.groupTypeCode`).d('组类别'),
        dataIndex: 'groupTypeCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.mustCheckFlag`).d('等级评定'),
        dataIndex: 'mustCheckFlag',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.standardTotalScore`).d('标准总分'),
        dataIndex: 'standardTotalScore',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.deductionValue`).d('扣分'),
        dataIndex: 'deductionValue',
        width: 140,
      },
      {
        title: intl.get(`${prefix}.standardReference`).d('得分'),
        dataIndex: 'standardReference',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.actValue`).d('实际等级'),
        dataIndex: 'actValue',
        width: 120,
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
            <a onClick={() => this.handleEdit(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
            <Popconfirm
              title="是否删除该记录?"
              placement="topRight"
              onConfirm={() => this.handleDelete(record)}
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
            onClick={this.handleCreateWoChecklistGroup}
          >
            {intl.get(`amtc.woChecklistGroups.view.button.add`).d('新增')}
          </Button>
        </Row>
        <Table
          bordered
          rowKey="checklistGroupId"
          loading={loading.listLoading}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
        <WoChecklistGroupEdit {...woChecklistGroupEditProps} />
      </React.Fragment>
    );
  }
}
export default WoChecklistGroupList;
