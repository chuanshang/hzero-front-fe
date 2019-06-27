/**
 * Detail - 技能类型明细页面
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

@connect(({ loading, workCenterRes }) => ({
  workCenterRes,
  loading: {
    detailLoading: loading.effects['workCenterRes/fetchWorkCenterResDetail'],
    detailListLoading: loading.effects['workCenterRes/fetchDetailListInfo'],
    saveDetailLoading:
      loading.effects['workCenterRes/saveEditData'] || loading.effects['workCenterRes/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.workCenterRes', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {},
    };
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
        type: 'workCenterRes/fetchWorkCenterResDetail',
        payload: {
          tenantId,
          workcenterResId: params.id,
        },
      });
      dispatch({
        type: 'workCenterRes/fetchDetailListInfo',
        payload: {
          tenantId,
          resId: params.id,
        },
      });
    } else {
      dispatch({
        type: 'workCenterRes/updateState',
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
  handleSaveWorkCenterRes() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id },
      },
      workCenterRes: { detail },
    } = this.props;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'workCenterRes/saveEditData',
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
                  pathname: `/amtc/work-center-res/detail/${res.workcenterResId}`,
                })
              );
            }
            // this.handleSearch();
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
        type: 'workCenterRes/fetchWorkCenterResDetail',
        payload: {
          tenantId,
          workcenterResId: id,
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
        type: 'workCenterRes/fetchDetailListInfo',
        payload: {
          tenantId,
          resId: id,
        },
      });
    } else {
      dispatch({
        type: 'workCenterRes/updateState',
        payload: {
          detail: {},
          detailList: [],
          detailListPagination: [],
        },
      });
    }
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      loading,
      match,
      tenantId,
      dispatch,
      workCenterRes: { detail = {}, detailList, detailListPagination = {} },
    } = this.props;
    const { id } = match.params;
    const { detailLoading, detailListLoading, saveDetailLoading } = loading;
    const infoProps = {
      tenantId,
      detailList,
      detailListPagination,
      dispatch,
      key: id,
      loading: detailListLoading,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailList,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.workCenterRes.view.message.title.detail`).d('技能类型')}
          backPath="/amtc/work-center-res/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveWorkCenterRes}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['work-center-res-detail'])}>
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
