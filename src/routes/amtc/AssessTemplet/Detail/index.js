/**
 * index - 故障缺陷明细页
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
import notification from 'utils/notification';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, assessTemplet }) => ({
  assessTemplet,
  fetchAssessTempletDetailLoading: loading.effects['assessTemplet/fetchAssessTempletDetail'],
  fetchTempletItemsListLoading: loading.effects['assessTemplet/queryTempletItemsList'],
  saveDetailLoading:
    loading.effects['assessTemplet/saveEditData'] || loading.effects['assessTemplet/saveAddData'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.assessTemplet', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDetailItem: {
        enabledFlag: 1,
      },
    };
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
   * fetch DetailInfo - 查询详细信息
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
        type: 'assessTemplet/fetchAssessTempletDetail',
        payload: {
          tenantId,
          templetId: id,
        },
      });
      dispatch({
        type: 'assessTemplet/queryTempletItemsList',
        payload: {
          tenantId,
          templetId: id,
        },
      });
    } else {
      dispatch({
        type: 'assessTemplet/updateState',
        payload: {
          templetItemsList: [],
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveAssessTemplet() {
    const {
      dispatch,
      match,
      tenantId,
      assessTemplet: { assessTempletDetail = {} },
    } = this.props;
    const { id } = match.params;
    const { defaultDetailItem } = this.state;
    let params = [];
    this.form.validateFields((err, values) => {
      if (!err) {
        params = isUndefined(id)
          ? { ...values, ...defaultDetailItem, tenantId }
          : { ...assessTempletDetail, ...values, tenantId };
        dispatch({
          type: isUndefined(id) ? 'assessTemplet/saveAddData' : 'assessTemplet/saveEditData',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res) {
            notification.success();
            if (isUndefined(id)) {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/assess-templet/detail/${res.templetId}`,
                })
              );
            } else {
              this.fetchDetailInfo();
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
      assessTemplet,
      dispatch,
      match: { url, params },
      saveDetailLoading,
      fetchAssessTempletDetailLoading,
      fetchTempletItemsListLoading,
    } = this.props;
    const {
      assessTempletDetail,
      templetItemsList,
      templetItemsPagination,
      evaluationPointMap,
    } = assessTemplet;
    const isNew = url.indexOf('create') !== -1;
    const { id } = params;
    const infoProps = {
      id,
      isNew,
      dispatch,
      tenantId,
      templetItemsList,
      evaluationPointMap,
      fetchTempletItemsListLoading,
      templetItemsPagination: isNew ? {} : templetItemsPagination,
      dataSource: isNew ? defaultDetailItem : assessTempletDetail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailInfo,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.assessTemplet.view.title.detail`).d('服务评估')}
          backPath="/amtc/assess-templet/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveAssessTemplet}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['assess-templet-detail'])}>
            <Col>
              <Spin spinning={isUndefined(id) ? false : fetchAssessTempletDetailLoading}>
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
