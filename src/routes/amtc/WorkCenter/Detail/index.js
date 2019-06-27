/**
 * Detail - 工作中心明细页面
 * @date: 2019-01-15
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, workCenter }) => ({
  workCenter,
  loading: {
    detailLoading: loading.effects['workCenter/fetchWorkCenterDetail'],
    saveDetailLoading:
      loading.effects['workCenter/saveEditData'] || loading.effects['workCenter/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.workCenter', 'amtc.common'] })
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
    const {
      dispatch,
      tenantId,
      match: { params = {} },
    } = this.props;
    if (!isUndefined(params.id)) {
      dispatch({
        type: 'workCenter/queryWorkCenterList',
        payload: {
          tenantId,
          page: {},
          workCenterName: '',
        },
      });
    }
  }

  /**
   * 工作中心明细查询：头信息&行信息
   * @param {object} [page = {}] - 分页参数
   */
  @Bind()
  fetchDetailList() {
    const {
      dispatch,
      tenantId,
      match: { params = {} },
    } = this.props;
    if (!isUndefined(params.id)) {
      dispatch({
        type: 'workCenter/fetchWorkCenterDetail',
        payload: {
          tenantId,
          workcenterId: params.id,
        },
      });
      dispatch({
        type: 'workCenter/fetchDetailListInfo',
        payload: {
          tenantId,
          workcenterId: params.id,
        },
      });
    } else {
      dispatch({
        type: 'workCenter/updateState',
        payload: {
          detailList: [],
        },
      });
      this.setState({
        defaultDetailItem: {
          enabledFlag: 1,
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveWorkCenter() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id },
      },
      workCenter: { detail },
    } = this.props;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'workCenter/saveEditData',
          payload: {
            ...detail,
            ...fieldValues,
            tenantId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            if (!isUndefined(id) && url.indexOf('create') === -1) {
              this.handleSearch();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/work-center/detail/${res.workcenterId}`,
                })
              );
            }
          }
        });
      }
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
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    const { defaultDetailItem } = this.state;
    if (!isUndefined(id)) {
      dispatch({
        type: 'workCenter/fetchWorkCenterDetail',
        payload: {
          tenantId,
          workcenterId: id,
        },
      }).then(res => {
        if (res) {
          const newDefaultDetailItem = {
            ...defaultDetailItem,
          };
          this.setState({
            defaultDetailItem: newDefaultDetailItem,
          });
        }
      });
      dispatch({
        type: 'workCenter/fetchDetailListInfo',
        payload: {
          tenantId,
          workcenterId: id,
        },
      });
    } else {
      dispatch({
        type: 'workCenter/updateState',
        payload: {
          detail: {},
          detailList: [],
          detailListPagination: [],
        },
      });
    }
  }

  /**
   *
   * @param {string} id - 资产组Id
   */
  @Bind()
  handleLinkToDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/amtc/work-center/detail/${id}`,
      })
    );
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      loading,
      match,
      tenantId,
      dispatch,
      workCenter: { detail = {}, detailList, detailListPagination = {} },
    } = this.props;
    const { id } = match.params;
    const { detailLoading, saveDetailLoading } = loading;
    const infoProps = {
      tenantId,
      detailList,
      detailListPagination,
      dispatch,
      key: id,
      loading: detailLoading,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailList,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.workCenter.view.message.title.detail`).d('工作中心明细')}
          backPath="/amtc/work-center/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveWorkCenter}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['work-center-detail'])}>
            <Col>
              <Spin spinning={isUndefined(id) ? false : detailLoading}>
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
