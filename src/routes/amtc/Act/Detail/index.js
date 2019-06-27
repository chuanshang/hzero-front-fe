/**
 * 标准作业 创建/编辑 明细
 * @date: 2019-5-10
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isUndefined, omit } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';

import styles from './index.less';
import InfoExhibit from './InfoExhibit';

@connect(({ act, loading }) => ({
  act,
  loading: {
    save: loading.effects['act/addAct'] || loading.effects['act/updateAct'],
    detail: loading.effects['act/detailAct'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['amtc.common', 'amtc.act'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,
      editFlag: false,
      jobSpecifiedCode: '', // 工作职责指定方式
      currentLineData: {}, // 当前行记录
    };
  }

  componentDidMount() {
    const { tenantId, dispatch } = this.props;
    dispatch({ type: 'act/fetchLovMap', payload: { tenantId } });
  }

  /**
   * 重新查询详情界面数据
   */
  @Bind()
  handleSearch() {
    const { tenantId, match, dispatch } = this.props;
    const { id } = match.params;
    // 清空state数据
    this.setState({});
    if (!isUndefined(id)) {
      dispatch({
        type: 'act/detailAct',
        payload: {
          tenantId,
          actId: id,
        },
      }).then(res => {
        if (res) {
          this.setState({ jobSpecifiedCode: res.jobSpecifiedCode });
        }
      });
    }
  }

  /**
   * 点击新建工作任务行按钮
   */
  @Bind()
  handleAddLine() {
    this.setState({
      drawerVisible: true,
      currentLineData: {},
    });
  }

  /**
   * 点击取消按钮关闭工作任务行编辑窗口
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({
      drawerVisible: false,
      currentLineData: {},
    });
  }

  /**
   * 比较大小
   */
  @Bind()
  compare(property) {
    return (a, b) => {
      const value1 = a[property];
      const value2 = b[property];
      return value1 - value2;
    };
  }

  /**
   * 工作任务编辑窗口确定
   */
  @Bind()
  handleDrawerOk(current = {}) {
    const {
      dispatch,
      act: { lineList = [] },
    } = this.props;
    let newList = [];

    if (isUndefined(current.actOpId)) {
      // 新建
      newList = [
        ...lineList,
        {
          ...current,
          actOpId: uuidv4(),
          _status: 'create',
        },
      ];
    } else {
      // 更新
      newList = [
        ...lineList.filter(item => item.actOpId !== current.actOpId),
        {
          ...lineList.filter(item => item.actOpId === current.actOpId)[0],
          ...current,
        },
      ];
    }
    newList.sort(this.compare('activityOpNumber'));
    dispatch({
      type: 'act/updateState',
      payload: {
        lineList: newList,
      },
    });
    this.setState({
      drawerVisible: false,
      currentLineData: {},
    });
  }

  /**
   * 保存标准作业
   */
  @Bind()
  handleSaveAct() {
    const {
      dispatch,
      tenantId,
      match,
      act: { lineList = [], detail = [] },
    } = this.props;
    const { id } = match.params;

    const newLineList = lineList.map(item => {
      const lineValue = {
        ...item,
      };
      return lineValue._status === 'create'
        ? omit(lineValue, ['_status', 'actOpId'])
        : omit(lineValue, ['_status']);
    });
    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'act/addAct',
            payload: {
              tenantId,
              data: {
                ...values,
                tenantId,
                enabledFlag: 1,
                effectiveEndDate: moment(values.effectiveEndDate).format(getDateTimeFormat()),
                actOpList: newLineList,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/act/detail/${res.actId}`,
                })
              );
            }
          });
        } else {
          // 更新
          dispatch({
            type: 'act/updateAct',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                tenantId,
                enabledFlag: 1,
                effectiveEndDate: moment(values.effectiveEndDate).format(getDateTimeFormat()),
                actOpList: newLineList,
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editFlag: false });
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 编辑行
   */
  @Bind()
  handleEditLine(record) {
    const {
      act: { lineList = [] },
    } = this.props;
    const currentLineData = lineList.filter(item => item.actOpId === record.actOpId)[0];
    this.setState({
      currentLineData,
      drawerVisible: true,
    });
  }

  /**
   * 行删除
   */
  @Bind()
  handleDrawerDelete(record) {
    const {
      dispatch,
      act: { lineList = [] },
    } = this.props;
    const newLine = lineList.filter(item => item.actOpId !== record.actOpId);
    dispatch({
      type: 'act/updateState',
      payload: {
        lineList: newLine,
      },
    });
  }

  /**
   * 行删除，调用接口删除
   */
  @Bind()
  handleDeleteFromDB(record) {
    const {
      tenantId,
      dispatch,
      act: { lineList = [] },
    } = this.props;
    const deleteLine = lineList.filter(item => item.actOpId === record.actOpId)[0];
    const newLine = lineList.filter(item => item.actOpId !== record.actOpId);
    dispatch({
      type: 'act/deleteLine',
      payload: {
        tenantId,
        data: deleteLine,
      },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'act/updateState',
          payload: {
            lineList: newLine,
          },
        });
      }
    });
  }

  /**
   * 编辑
   */
  @Bind()
  handleEdit() {
    const { editFlag } = this.state;
    this.setState({ editFlag: !editFlag });
  }

  /**
   * 修改工作职责指定方式的值
   */
  @Bind()
  handleJobSpecifiedChange(val) {
    this.setState({ jobSpecifiedCode: val });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const { editFlag, drawerVisible, currentLineData, jobSpecifiedCode } = this.state;
    const { loading, match, tenantId, act } = this.props;
    const {
      detail,
      lineList,
      WoActivityTypeMap = [], // 标准作业类型
      JobDutiesSpecifiedMap = [], // 工作职责指定方式
      WorkOrderStatusMap = [], // 工单状态
      WoDurationRule = [], // 工单工期规则
      DurationUnitMap = [], // 工期单位
      ActOpStatusMap = [], // 工作任务行状态
      ActOpDefJobCodeMap = [], // 工作任务行工作职责默认方式
    } = act;
    const { id } = match.params;
    const isNew = isUndefined(id);
    const infoProps = {
      key: id,
      tenantId,
      loading,
      drawerVisible,
      lineList,
      detailSource: detail || [],
      isNew,
      editFlag,
      currentLineData,
      WoActivityTypeMap,
      JobDutiesSpecifiedMap,
      WorkOrderStatusMap,
      WoDurationRule,
      DurationUnitMap,
      ActOpStatusMap,
      ActOpDefJobCodeMap,
      jobSpecifiedCode,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onAddLine: this.handleAddLine,
      onDrawerCancel: this.handleDrawerCancel,
      onDrawerOk: this.handleDrawerOk,
      onEdit: this.handleEditLine,
      onDrawerDelete: this.handleDrawerDelete,
      onDeleteFromDB: this.handleDeleteFromDB,
      onJobSpecifiedChange: this.handleJobSpecifiedChange,
    };
    const displayFlag = isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`amtc.act.view.message.detail.title`).d('标准作业')}
          backPath="/amtc/act/list"
        >
          <Button
            icon="save"
            type="primary"
            loading={loading.save}
            style={displayFlagBtn}
            onClick={this.handleSaveAct}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['act-detail'])}>
            <Row>
              <Col span={isUndefined(id) ? 24 : 23}>
                <Spin
                  spinning={isUndefined(id) ? false : loading.detail}
                  wrapperClassName={classNames(styles['act-detail'], DETAIL_DEFAULT_CLASSNAME)}
                >
                  <InfoExhibit {...infoProps} />
                </Spin>
              </Col>
            </Row>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
