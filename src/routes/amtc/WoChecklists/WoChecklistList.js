import React, { PureComponent } from 'react';
import { Row, Button, Popconfirm, message } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import { yesOrNoRender } from 'utils/renderer';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { omit } from 'lodash';
import styles from './index.less';

import WoChecklistEdit from './WoChecklistEdit';

@connect(({ woChecklists, loading }) => ({
  woChecklists,
  tenantId: getCurrentOrganizationId(),
  loading: {
    listLoading: loading.effects['woChecklists/fetchWoChecklistsList'],
  },
}))
class WoChecklistList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      currentData: {
        mustCheckFlag: 0,
        showTableFlag: 0,
      },
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
    dispatch({ type: 'woChecklists/fetchLov', payload: { tenantId } });
    dispatch({
      type: 'woChecklists/fetchWoChecklistsList',
      payload: {
        tenantId,
        parentId,
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
      parentId,
    };
    dispatch({
      type: 'woChecklists/saveEditData',
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
    const { tenantId, parentId, dispatch, parentType } = this.props;
    dispatch({
      type: 'woChecklists/deleteWoChecklists',
      payload: record,
    }).then(res => {
      if (res) {
        message.success('删除成功!');
        // 刷新列表
        dispatch({
          type: 'woChecklists/fetchWoChecklistsList',
          payload: {
            tenantId,
            parentId,
            parentTypeCode: parentType,
          },
        });
      }
    });
  }
  /**
   * 新增
   */
  @Bind()
  handleCreateWoChecklist() {
    const { currentData } = this.state;
    this.setState({
      editVisible: true,
      currentData: { ...currentData, _status: 'create' },
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
      woChecklists: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.checklistId]
      : expandedRowKeys.filter(item => item !== record.checklistId);
    dispatch({
      type: 'woChecklists/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  render() {
    const {
      parentId,
      tenantId,
      loading,
      parentType,
      woChecklists: {
        treeList,
        expandedRowKeys,
        parentTypeMap = [],
        businessScenarioList = [],
        fieldTypeList = [],
      },
    } = this.props;
    const { editVisible, currentData } = this.state;
    const woChecklistEditProps = {
      loading,
      parentId,
      tenantId,
      editVisible,
      parentType,
      parentTypeMap,
      fieldTypeList,
      businessScenarioList,
      anchor: 'right',
      title: intl.get(`amtc.woChecklist.view.message.drawer`).d('实际检查项'),
      dataSource: currentData,
      onConfirmLine: this.handleConfirmLine,
      onCancelLine: this.handleCancelLine,
    };
    const prefix = 'amtc.woChecklists.model.woChecklists';
    const columns = [
      {
        title: intl.get(`${prefix}.itemSeq`).d('序号'),
        dataIndex: 'itemSeq',
        width: 100,
      },
      {
        title: intl.get(`${prefix}.checklistName`).d('检查项名称'),
        dataIndex: 'checklistName',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.methodCode`).d('检查方式'),
        dataIndex: 'methodCode',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.businessScenarioCode`).d('业务场景'),
        dataIndex: 'businessScenarioMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.mustCheckFlag`).d('是否必检'),
        dataIndex: 'mustCheckFlag',
        width: 150,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${prefix}.columnTypeCode`).d('记录方式'),
        dataIndex: 'columnTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.defaultShowFlag`).d('默认拍照类型'),
        dataIndex: 'defaultShowFlag',
        width: 140,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${prefix}.standardReference`).d('参考标准'),
        dataIndex: 'standardReference',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.actValue`).d('实际值'),
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
            onClick={this.handleCreateWoChecklist}
          >
            {intl.get(`amtc.woChecklist.view.button.add`).d('新增')}
          </Button>
        </Row>
        <EditTable
          bordered
          expandedRowKeys={expandedRowKeys}
          rowKey="checklistId"
          loading={loading.listLoading}
          onExpand={this.handleExpandSubLine}
          columns={columns}
          dataSource={treeList}
          className={styles['wo-checklists-detail']}
          pagination={false}
        />
        <WoChecklistEdit {...woChecklistEditProps} />
      </React.Fragment>
    );
  }
}
export default WoChecklistList;
