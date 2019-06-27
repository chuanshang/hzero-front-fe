/**
 * index - 工序明细页
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
import moment from 'moment/moment';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, woop }) => ({
  woop,
  loading: {
    fetchDetailInfoLoading: loading.effects['woop/fetchWorkProcessDetailInfo'],
    saveDetailLoading: loading.effects['woop/saveEditData'] || loading.effects['woop/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.woop', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {},
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'woop/init',
      payload: {
        tenantId,
      },
    });
    this.handleSearch();
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
   * 查询
   */
  @Bind()
  handleSearch() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { woId, id },
      },
    } = this.props;
    if (url.indexOf('create') === -1) {
      dispatch({
        type: 'woop/fetchWorkProcessDetailInfo',
        payload: {
          tenantId,
          woopId: id,
        },
      });
      dispatch({
        type: 'woop/fetchDetailInfo',
        payload: {
          tenantId,
          woId,
        },
      });
    } else {
      // 查询表单信息
      dispatch({
        type: 'woop/fetchDetailInfo',
        payload: {
          tenantId,
          woId,
        },
      }).then(res => {
        if (res) {
          this.setState({
            defaultDetailItem: {
              waitingOwnerFlag: 0,
              planFixed: 0,
              enabledFlag: 1,
              woId: res.woId,
              woopNum: res.woNum,
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
  handleSaveWorkProcess() {
    const {
      tenantId,
      dispatch,
      woop,
      match: { url },
    } = this.props;
    const { woopDetail = {} } = woop;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    const { defaultDetailItem } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const params =
          url.indexOf('create') !== -1
            ? {
                ...defaultDetailItem,
                ...values,
                tenantId,
                schedualedStartDate: moment(fieldValues.schedualedStartDate).format(
                  getDateTimeFormat()
                ),
                schedualedFinishDate: moment(fieldValues.schedualedFinishDate).format(
                  getDateTimeFormat()
                ),
                targetStartDate: moment(fieldValues.targetStartDate).format(getDateTimeFormat()),
                targetFinishDate: moment(fieldValues.targetFinishDate).format(getDateTimeFormat()),
                startNotearlierDate: moment(fieldValues.startNotearlierDate).format(
                  getDateTimeFormat()
                ),
                finishNotlaterDate: moment(fieldValues.finishNotlaterDate).format(
                  getDateTimeFormat()
                ),
                actualStartDate: moment(fieldValues.actualStartDate).format(getDateTimeFormat()),
                actualFinishDate: moment(fieldValues.actualFinishDate).format(getDateTimeFormat()),
              } // 新增
            : {
                ...woopDetail,
                ...values,
                tenantId,
                schedualedStartDate: moment(fieldValues.schedualedStartDate).format(
                  getDateTimeFormat()
                ),
                schedualedFinishDate: moment(fieldValues.schedualedFinishDate).format(
                  getDateTimeFormat()
                ),
                targetStartDate: moment(fieldValues.targetStartDate).format(getDateTimeFormat()),
                targetFinishDate: moment(fieldValues.targetFinishDate).format(getDateTimeFormat()),
                startNotearlierDate: moment(fieldValues.startNotearlierDate).format(
                  getDateTimeFormat()
                ),
                finishNotlaterDate: moment(fieldValues.finishNotlaterDate).format(
                  getDateTimeFormat()
                ),
                actualStartDate: moment(fieldValues.actualStartDate).format(getDateTimeFormat()),
                actualFinishDate: moment(fieldValues.actualFinishDate).format(getDateTimeFormat()),
              }; // 编辑
        const dispatchType =
          url.indexOf('create') !== -1
            ? {
                type: 'woop/saveAddData',
                payload: params,
              }
            : {
                type: 'woop/saveEditData',
                payload: params,
              };
        dispatch(dispatchType).then(res => {
          if (res) {
            notification.success();
            if (url.indexOf('create') === -1) {
              this.handleSearch();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/work-order/${res.woId}/woop/detail/${res.woopId}`,
                })
              );
            }
          }
        });
      }
    });
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      loading,
      woop,
      match: { url, params },
    } = this.props;
    const { fetchDetailInfoLoading, saveDetailLoading } = loading;
    const isNew = url.indexOf('create') !== -1;
    const fromWorkOrder = url.indexOf('work-order') !== -1;
    const { woId, id } = params;
    const { woopStatusMap, durationUnitMap, woopDetail, workOrderDetail } = woop;
    const infoProps = {
      tenantId,
      fetchDetailInfoLoading,
      woopStatusMap,
      durationUnitMap,
      dataSource: isNew ? defaultDetailItem : woopDetail,
      workOrderDetail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.woop.view.title.detail`).d('工序')}
          backPath={fromWorkOrder ? `/amtc/work-order/detail/${woId}` : `/amtc/woop/list`}
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveWorkProcess}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['work-process-detail'])}>
            <Col>
              <Spin spinning={isNew ? false : fetchDetailInfoLoading}>
                <InfoExhibit {...infoProps} />
              </Spin>
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
export default Detail;
