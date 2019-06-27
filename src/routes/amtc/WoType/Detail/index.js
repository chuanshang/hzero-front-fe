/**
 * index - 工单类型明细页
 * @date: 2019-4-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import IconsModal from './Icons';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, woType }) => ({
  woType,
  loading: {
    fetchDetailInfoLoading: loading.effects['woType/fetchDetailInfo'],
    saveDetailLoading:
      loading.effects['woType/saveEditData'] || loading.effects['woType/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.woType', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params },
      location: { query },
    } = this.props;
    const { id } = params;
    const { parentTypeName } = isUndefined(query) ? '' : query;
    this.state = {
      editFlag: false,
      defaultDetailItem: {
        enabledFlag: 1,
        approvalFlowFlag: 0,
        checkGroupFlag: 0,
        manualcreateEnableFlag: 1,
        failureRequiredFlag: 0,
        sourceFlag: 1,
        linesFlag: 1,
        checklistsFlag: 1,
        outsourceFlag: 1,
        toolsFlag: 0,
        workcenterPeopleFlag: 1,
        itemsFlag: 1,
        costFlag: 1,
        repairTypeFlag: 0,
        woopCompletedFlag: 1,
        defaultWoopownerFlag: 0,
        enableOrgFlag: 0,
        checklistCreatewoFlag: 0,
        woopOwnergroupFlag: 0,
        srChecklistsFlag: 0,
        defaultAssessFlag: 0,
        countingFlag: 0,
        enabledPdfFlag: 0,
        parentTypeId: id,
        parentTypeName,
      },
      iconsModalVisible: false,
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'woType/init',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * fetchDetailInfo - 查询详细信息
   */
  @Bind()
  fetchDetailInfo() {
    const {
      tenantId,
      match: {
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;

    if (!isUndefined(id)) {
      dispatch({
        type: 'woType/fetchDetailInfo',
        payload: {
          tenantId,
          woTypeId: id,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'woType/updateState',
            payload: {
              isCreateFlag: true,
            },
          });
        }
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveWoType() {
    const {
      tenantId,
      dispatch,
      woType,
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const { woTypeDetail = {} } = woType;
    const { defaultDetailItem } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const params = isUndefined(id)
          ? {
              ...defaultDetailItem,
              ...values,
              tenantId,
            } // 新增顶级
          : url.indexOf('create') !== -1
          ? {
              ...defaultDetailItem,
              ...values,
              tenantId,
              parentTypeId: Number(id),
            } // 新增下级
          : {
              ...woTypeDetail,
              ...values,
              tenantId,
            }; // 编辑

        const dispatchType =
          url.indexOf('create') !== -1
            ? {
                type: 'woType/saveAddData',
                payload: { tenantId, data: params },
              }
            : {
                type: 'woType/saveEditData',
                payload: {
                  tenantId,
                  data: params,
                },
              };
        dispatch(dispatchType).then(res => {
          if (res) {
            notification.success();
            this.setState({ editFlag: false });
            if (!isUndefined(id) && url.indexOf('create') === -1) {
              this.fetchDetailInfo();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/wo-type/detail/${res.woTypeId}`,
                })
              );
            }
          }
        });
      }
    });
  }

  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/wo-type/detail/${id}`,
      })
    );
  }

  openIconModal() {
    this.setState({
      iconsModalVisible: true,
    });
  }

  onIconSelect(icon) {
    const { setFieldsValue = e => e } = this.form;
    setFieldsValue({ icon });
    this.setState({
      iconsModalVisible: false,
    });
  }

  closeIconsModal() {
    this.setState({
      iconsModalVisible: false,
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
  render() {
    const { defaultDetailItem, iconsModalVisible, editFlag } = this.state;
    const {
      tenantId,
      loading,
      woType,
      dispatch,
      match: { params },
    } = this.props;
    const { fetchDetailInfoLoading, saveDetailLoading } = loading;
    const {
      isCreateFlag,
      assetStatusMap,
      orderPlanStatusMap,
      orderCompletionRuleMap,
      needToOperatorMap,
      needToCloseMap,
      isNeedMap,
      inputTypeMap,
      verifyEnabledMap,
      mustBeProvidedMap,
      woTypeDetail,
    } = woType;
    const { id } = params;
    const isNew = isUndefined(id);
    const infoProps = {
      isNew,
      editFlag,
      dispatch,
      tenantId,
      fetchDetailInfoLoading,
      isCreateFlag,
      assetStatusMap,
      orderPlanStatusMap,
      orderCompletionRuleMap,
      needToOperatorMap,
      needToCloseMap,
      isNeedMap,
      inputTypeMap,
      verifyEnabledMap,
      mustBeProvidedMap,
      detailInfo: isNew ? defaultDetailItem : woTypeDetail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailInfo,
      handleOpenIconModal: this.openIconModal.bind(this),
      key: id,
    };

    const iconsModalProps = {
      visible: iconsModalVisible,
      onSelect: this.onIconSelect.bind(this),
      onCancel: this.closeIconsModal.bind(this),
    };
    const displayEditFlag = isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.woType.view.title.detail`).d('工单类型')}
          backPath="/amtc/wo-type/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            style={displayFlagBtn}
            onClick={this.handleSaveWoType}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayEditFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['woType-detail'])}>
            <Col>
              <Spin
                spinning={isNew ? false : fetchDetailInfoLoading}
                wrapperClassName={classNames(styles['woType-detail'], DETAIL_DEFAULT_CLASSNAME)}
              >
                <InfoExhibit {...infoProps} />
              </Spin>
            </Col>
          </Row>
        </Content>
        <IconsModal {...iconsModalProps} />
      </Fragment>
    );
  }
}
export default Detail;
