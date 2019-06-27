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
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, assessTemplet }) => ({
  assessTemplet,
  fetchTempletProblemsLoading: loading.effects['assessTemplet/queryTempletProblems'],
  fetchTempletItemsLoading: loading.effects['assessTemplet/fetchTempletItemsDetailInfo'],
  saveTempletItemsLoading:
    loading.effects['assessTemplet/saveTempletItemsAddData'] ||
    loading.effects['assessTemplet/saveTempletItemsEditData'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.assessTemplet', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.state = {
      defaultDetailItem: {
        enabledFlag: 1,
        assessTempletId: id,
        relationTypeCode: 'HAM_Assess_Templet',
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
        url,
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;

    if (url.indexOf('create') === -1) {
      dispatch({
        type: 'assessTemplet/fetchTempletItemsDetailInfo',
        payload: {
          tenantId,
          templetItemId: id,
        },
      });
      dispatch({
        type: 'assessTemplet/queryTempletProblems',
        payload: {
          tenantId,
          templetItemId: id,
        },
      });
    } else {
      dispatch({
        type: 'assessTemplet/updateState',
        payload: {
          templetProblems: [],
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveTempletItems() {
    const {
      dispatch,
      tenantId,
      assessTemplet: { templetItemsDetail = {}, templetProblems = [] },
      match: { url },
    } = this.props;
    const { defaultDetailItem } = this.state;
    let flag = false;
    let templetItems = [];
    const problemLines = templetProblems.filter(i => ['update', 'create'].includes(i._status));
    if (Array.isArray(problemLines) && problemLines.length === 0) {
      // 未进行属性行变更：新增、编辑
      this.form.validateFields((err, values) => {
        if (!err) {
          templetItems =
            url.indexOf('create') !== -1
              ? { ...values, ...defaultDetailItem, tenantId }
              : { ...templetItemsDetail, ...values, tenantId, templetProblemsLists: [] };
          flag = true;
        }
      });
    } else {
      const data = getEditTableData(problemLines, ['templetProblemId']);
      this.form.validateFields((err, values) => {
        if (!err && (Array.isArray(data) && data.length > 0)) {
          templetItems =
            url.indexOf('create') !== -1
              ? { ...values, ...defaultDetailItem, templetProblemsLists: data || [], tenantId }
              : { ...templetItemsDetail, ...values, templetProblemsLists: data || [], tenantId };
          flag = true;
        }
      });
    }
    if (flag) {
      dispatch({
        type:
          url.indexOf('create') === -1
            ? 'assessTemplet/saveTempletItemsEditData'
            : 'assessTemplet/saveTempletItemsAddData',
        payload: { ...templetItems, tenantId },
      }).then(res => {
        if (res) {
          notification.success();
          if (url.indexOf('create') === -1) {
            this.fetchDetailInfo();
          } else {
            dispatch(
              routerRedux.push({
                pathname: `/amtc/assess-templet/templet-items/detail/${res.templetItemId}`,
              })
            );
          }
        }
      });
    }
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      assessTemplet,
      dispatch,
      match: { url, params },
      fetchTempletProblemsLoading,
      saveTempletItemsLoading,
      fetchTempletItemsLoading,
    } = this.props;
    const {
      templetItemsDetail,
      templetProblems,
      problemPagination,
      evaluationPointMap,
      relateObjectCodeMap,
      valueTypeCodeMap,
      yesOrNoMap,
      startMap,
    } = assessTemplet;
    const isNew = url.indexOf('create') !== -1;
    const { id } = params;
    const infoProps = {
      isNew,
      dispatch,
      tenantId,
      templetProblems,
      yesOrNoMap,
      startMap,
      relateObjectCodeMap,
      evaluationPointMap,
      valueTypeCodeMap,
      fetchTempletProblemsLoading,
      detailPagination: isNew ? {} : problemPagination,
      dataSource: isNew ? defaultDetailItem : templetItemsDetail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailInfo,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.assessTemplet.view.title.detail`).d('评价项明细')}
          backPath={
            isNew
              ? `/amtc/assess-templet/detail/${id}`
              : `/amtc/assess-templet/detail/${templetItemsDetail.assessTempletId}`
          }
        >
          <Button
            type="primary"
            icon="save"
            onClick={this.handleSaveTempletItems}
            loading={saveTempletItemsLoading}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['assess-templet-actcheck-detail'])}>
            <Col>
              <Spin spinning={isNew ? false : fetchTempletItemsLoading}>
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
