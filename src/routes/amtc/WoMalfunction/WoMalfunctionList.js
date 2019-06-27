import React, { PureComponent } from 'react';
import { Table, Row, Button, Popconfirm, message } from 'hzero-ui';
import intl from 'utils/intl';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { omit } from 'lodash';

import WoMalfunctionEdit from './WoMalfunctionEdit';

class WoMalfunctionList extends PureComponent {
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
    const { woId, tenantId, dispatch } = this.props;
    dispatch({
      type: 'woMalfuction/listWoMalfuction',
      payload: {
        tenantId,
        woId,
      },
    });
  }
  /**
   * 保存
   */
  @Bind()
  handleConfirmlLine(record) {
    const { woId, tenantId, dispatch } = this.props;
    const saveLines = [];
    const currentLine = {
      ...omit(record, ['_status']),
      woId,
      malfunctionTime: moment(record.malfunctionTime).format(getDateTimeFormat()),
    };
    saveLines.push(currentLine);
    dispatch({
      type: 'woMalfuction/saveWoMalfuction',
      payload: {
        tenantId,
        data: saveLines,
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
    const {
      dispatch,
      woMalfuction: { dataList = [] },
    } = this.props;
    dispatch({
      type: 'woMalfuction/deleteWoMalfuction',
      payload: record,
    }).then(res => {
      if (res) {
        message.success('删除成功!');
        // 刷新列表
        const newDataList =
          dataList.filter(item => item.woMalfunctionId !== record.woMalfunctionId) || [];
        dispatch({
          type: 'woMalfuction/updateState',
          payload: {
            dataList: newDataList,
          },
        });
      }
    });
  }
  /**
   * 新增
   */
  @Bind()
  handleCreateWoMalfunction() {
    this.setState({
      editVisible: true,
      currentData: { _status: 'create' },
    });
  }
  render() {
    const {
      woId,
      woName,
      tenantId,
      loading,
      woMalfuction: { dataList = [] },
    } = this.props;
    const { editVisible, currentData } = this.state;
    const woMalfunctionEditProps = {
      woId,
      woName,
      tenantId,
      dataSource: currentData,
      onConfirmlLine: this.handleConfirmlLine,
      onCancelLine: this.handleCancelLine,
    };
    const prefix = 'amtc.woMalfunction.model.WoMalfunctionList';
    const columns = [
      {
        title: intl.get(`${prefix}.woop`).d('工单任务编号'),
        dataIndex: 'woopMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.asset`).d('设备/资产'),
        dataIndex: 'assetMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.rcAssesment`).d('故障/缺陷目录'),
        dataIndex: 'rcAssesmentMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.malfunctionTime`).d('故障/缺陷时间'),
        dataIndex: 'malfunctionTime',
        width: 200,
      },
      {
        title: intl.get(`${prefix}.partCode`).d('故障/缺陷部位'),
        dataIndex: 'partCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.riskCode`).d('故障/缺陷现象'),
        dataIndex: 'riskCodeId',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.causeCode`).d('故障/缺陷原因'),
        dataIndex: 'causeCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.remedyCode`).d('故障/缺陷处理办法'),
        dataIndex: 'remedyCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.description`).d('解决方法描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${prefix}.remark`).d('记录备注'),
        dataIndex: 'remark',
        width: 150,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        fixed: 'right',
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
    return editVisible ? (
      <WoMalfunctionEdit {...woMalfunctionEditProps} />
    ) : (
      <React.Fragment>
        <Row style={{ margin: '10px' }}>
          <Button
            icon="plus"
            style={{ marginRight: '10px' }}
            type="primary"
            onClick={this.handleCreateWoMalfunction}
          >
            {intl.get(`amtc.woMalfunction.view.button.add`).d('新增')}
          </Button>
        </Row>
        <Table
          bordered
          rowKey="woMalfunctionId"
          loading={loading.listWoMalfuction}
          columns={columns}
          dataSource={dataList}
          pagination={false}
        />
      </React.Fragment>
    );
  }
}
export default WoMalfunctionList;
