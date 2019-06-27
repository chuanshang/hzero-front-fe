/**
 * index - 故障缺陷明细页
 * @date: 2019-4-16
 * @author: dt <ting.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Fragment, Component } from 'react';
import { Button, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, rcAssesment }) => ({
  rcAssesment,
  loading: {
    fetchRcSystemInfoLoading: loading.effects['rcAssesment/fetchRcSystemDetail'],
    fetchEvaluateObjectsInfoLoading: loading.effects['rcAssesment/queryEvaluateObjectsList'],
    fetchEvaluateCodesInfoLoading: loading.effects['rcAssesment/queryEvaluateCodesList'],
    saveDetailLoading:
      loading.effects['rcAssesment/saveEditData'] || loading.effects['rcAssesment/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.rcAssesment', 'amtc.common'] })
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
        type: 'rcAssesment/fetchRcSystemDetail',
        payload: {
          tenantId,
          rcAssesmentId: id,
        },
      });
      dispatch({
        type: 'rcAssesment/queryEvaluateObjectsList',
        payload: {
          tenantId,
          rcAssesmentId: id,
        },
      });
      dispatch({
        type: 'rcAssesment/queryEvaluateCodesList',
        payload: {
          tenantId,
          rcAssesmentId: id,
        },
      });
    } else {
      dispatch({
        type: 'rcAssesment/updateState',
        payload: {
          evaluateObjectsList: [],
          evaluateCodesTreeList: [],
        },
      });
    }
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSaveRcSystem() {
    const {
      dispatch,
      match,
      tenantId,
      rcAssesment: { detail = {}, evaluateObjectsList = [], evaluateCodesTreeList = [] },
    } = this.props;
    const { id } = match.params;
    const { defaultDetailItem } = this.state;
    let flag = false;
    let params = [];
    const evaluateObjectsLines = evaluateObjectsList.filter(i =>
      ['update', 'create'].includes(i._status)
    );
    // const evaluateCodesLines = evaluateCodesTreeList.filter(i => ['update', 'create'].includes(i._status));
    if (Array.isArray(evaluateObjectsLines) && evaluateObjectsLines.length === 0) {
      // 未进行属性行变更：新增、编辑
      this.form.validateFields((err, values) => {
        if (!err) {
          params = isUndefined(id)
            ? { ...values, ...defaultDetailItem, tenantId }
            : { ...detail, ...values, tenantId, evaluateObjectsList: [] };
          flag = true;
        }
      });
    } else {
      const data = getEditTableData(evaluateObjectsLines, ['asmtObjectsId']);
      this.form.validateFields((err, values) => {
        if (!err && (Array.isArray(data) && data.length > 0)) {
          params = isUndefined(id)
            ? { ...values, ...defaultDetailItem, evaluateObjectsList: data || [], tenantId }
            : { ...detail, ...values, evaluateObjectsList: data || [], tenantId };
          flag = true;
        }
      });
    }
    const data = getEditTableData(evaluateCodesTreeList, ['children', 'asmtCodesId']);
    this.form.validateFields(err => {
      if (!err && (Array.isArray(data) && data.length > 0)) {
        params = { ...params, evaluateCodesList: data || [] };
        flag = true;
      }
    });
    if (flag) {
      dispatch({
        type: isUndefined(id) ? 'rcAssesment/saveAddData' : 'rcAssesment/saveEditData',
        payload: {
          ...params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          if (isUndefined(id)) {
            dispatch(
              routerRedux.push({
                pathname: `/amtc/rc-assesment/detail/${res.rcAssesmentId}`,
              })
            );
          } else {
            this.fetchDetailInfo();
          }
        }
      });
    }
  }

  render() {
    const { defaultDetailItem } = this.state;
    const {
      tenantId,
      loading,
      rcAssesment,
      dispatch,
      match: { url, params },
    } = this.props;
    const { saveDetailLoading } = loading;
    const {
      detail,
      evaluateObjectsList,
      evaluateObjectsPagination,
      evaluateCodesTreeList,
      expandedRowKeys,
      pathMap,
      objectTypeCodeMap,
    } = rcAssesment;
    const isNew = url.indexOf('create') !== -1;
    const { id } = params;
    const infoProps = {
      dispatch,
      tenantId,
      evaluateObjectsList,
      evaluateObjectsPagination: isNew ? {} : evaluateObjectsPagination,
      evaluateCodesTreeList,
      expandedRowKeys,
      pathMap,
      objectTypeCodeMap,
      loading,
      dataSource: isNew ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailInfo,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.rcAssesment.view.title.detail`).d('故障缺陷评估项')}
          backPath="/amtc/rc-assesment/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={saveDetailLoading}
            onClick={this.handleSaveRcSystem}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['rc-assesment-detail'])}>
            <Col>
              <InfoExhibit {...infoProps} />
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
export default Detail;
