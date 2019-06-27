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

@connect(({ loading, rcSystem }) => ({
  rcSystem,
  loading: {
    fetchRcSystemInfoLoading: loading.effects['rcSystem/fetchRcSystemDetail'],
    fetchEvaluateCalcsInfoLoading: loading.effects['rcSystem/queryEvaluateCalcsList'],
    fetchEvaluateHierarchiesInfoLoading: loading.effects['rcSystem/queryEvaluateHierarchiesList'],
    saveDetailLoading:
      loading.effects['rcSystem/saveEditData'] || loading.effects['rcSystem/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.rcSystem', 'amtc.common'] })
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
        type: 'rcSystem/fetchRcSystemDetail',
        payload: {
          tenantId,
          rcSystemId: id,
        },
      });
      dispatch({
        type: 'rcSystem/queryEvaluateCalcsList',
        payload: {
          tenantId,
          rcSystemId: id,
        },
      });
      dispatch({
        type: 'rcSystem/queryEvaluateHierarchiesList',
        payload: {
          tenantId,
          rcSystemId: id,
        },
      });
    } else {
      dispatch({
        type: 'rcSystem/updateState',
        payload: {
          evaluateCalcsList: [],
          evaluateHierarchiesList: [],
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
      rcSystem: { detail = {}, evaluateCalcsList = [], evaluateHierarchiesList = [] },
    } = this.props;
    const { defaultDetailItem } = this.state;
    const { id } = match.params;
    let flag = false;
    let params = [];
    const evaluateCalcsLines = evaluateCalcsList.filter(i =>
      ['update', 'create'].includes(i._status)
    );
    const evaluateHierarchiesLines = evaluateHierarchiesList.filter(i =>
      ['update', 'create'].includes(i._status)
    );
    if (Array.isArray(evaluateCalcsLines) && evaluateCalcsLines.length === 0) {
      // 未进行属性行变更：新增、编辑
      this.form.validateFields((err, values) => {
        if (!err) {
          params = isUndefined(id)
            ? { ...values, ...defaultDetailItem, tenantId }
            : { ...detail, ...values, tenantId, evaluationCalcsList: [] };
          flag = true;
        }
      });
    } else {
      const data = getEditTableData(evaluateCalcsLines, ['sysCalcId']);
      this.form.validateFields((err, values) => {
        if (!err && (Array.isArray(data) && data.length > 0)) {
          params = isUndefined(id)
            ? { ...values, ...defaultDetailItem, evaluationCalcsList: data || [], tenantId }
            : { ...detail, ...values, evaluationCalcsList: data || [], tenantId };
          flag = true;
        }
      });
    }
    if (Array.isArray(evaluateHierarchiesLines) && evaluateHierarchiesLines.length === 0) {
      // 未进行属性行变更：新增、编辑
      this.form.validateFields(err => {
        if (!err) {
          params = { ...params, evaluateHierarchies: [] };
          flag = true;
        }
      });
    } else {
      const data = getEditTableData(evaluateHierarchiesLines, ['sysHierarchyId']);
      this.form.validateFields(err => {
        if (!err && (Array.isArray(data) && data.length > 0)) {
          params = { ...params, evaluateHierarchies: data || [] };
          flag = true;
        }
      });
    }
    if (flag) {
      dispatch({
        type: isUndefined(id) ? 'rcSystem/saveAddData' : 'rcSystem/saveEditData',
        payload: {
          ...params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          if (isUndefined(id)) {
            dispatch(
              routerRedux.push({
                pathname: `/amtc/rc-systems/detail/${res.rcSystemId}`,
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
      rcSystem,
      dispatch,
      match: { url, params },
    } = this.props;
    const { saveDetailLoading } = loading;
    const {
      detail,
      evaluateCalcsList,
      evaluateCalcsPagination,
      evaluateHierarchiesList,
      evaluateHierarchiesPagination,
      faultdefectCalcFormulaMap,
      faultdefectBasetypeMap,
    } = rcSystem;
    const isNew = url.indexOf('create') !== -1;
    const { id } = params;
    const infoProps = {
      dispatch,
      tenantId,
      evaluateCalcsList,
      evaluateCalcsPagination: isNew ? {} : evaluateCalcsPagination,
      evaluateHierarchiesList,
      evaluateHierarchiesPagination: isNew ? {} : evaluateHierarchiesPagination,
      faultdefectCalcFormulaMap,
      faultdefectBasetypeMap,
      loading,
      dataSource: isNew ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.fetchDetailInfo,
      key: id,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.rcSystems.view.title.detail`).d('故障缺陷')}
          backPath="/amtc/rc-systems/list"
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
          <Row className={classNames(styles['rc-systems-detail'])}>
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
