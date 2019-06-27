/**
 * Detail - 标准检查项明细页面
 * @date: 2019-05-22
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, PureComponent } from 'react';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, inspectList }) => ({
  inspectList,
  loading: {
    detailLoading: loading.effects['inspectList/fetchInspectListDetail'],
    problemListLoading: loading.effects['inspectList/fetchProblemList'],
    saveDetailLoading:
      loading.effects['inspectList/saveEditData'] || loading.effects['inspectList/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.inspectList', 'amtc.common'] })
class Detail extends PureComponent {
  form;
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      defaultDetailItem: {
        mustCheckFlag: 1,
      },
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const { match, dispatch, tenantId } = this.props;
    const { params } = match;
    dispatch({ type: 'inspectList/fetchLov', payload: { tenantId } });
    if (!isUndefined(params.id)) {
      this.handleSearch();
    } else {
      dispatch({
        type: 'inspectList/updateState',
        payload: {
          detail: {},
          checklist: [],
          problemsList: [],
        },
      });
    }
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
   * 数据保存
   */
  @Bind()
  handleSaveInspectList() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id, parentId, from },
      },
      inspectList: { detail, problemsList },
    } = this.props;
    const list = problemsList === null ? [] : problemsList;
    const newList = list.map(item => {
      if (typeof item.checklistProblemId === 'string') {
        const { $form, checklistProblemId, ...newItem } = item;
        return newItem;
      } else {
        return item;
      }
    });
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'inspectList/saveEditData',
          payload: {
            parentId,
            parentTypeCode: this.judgeRouterSource(from),
            ...detail,
            ...fieldValues,
            actChecklistProblems: newList,
            tenantId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.setState({ editFlag: false });
            if (!isUndefined(id) && url.indexOf('create') === -1) {
              this.handleSearch();
            } else {
              dispatch(
                routerRedux.push({
                  pathname: `/amtc/${from}/${parentId}/${from}/detail/${res.checklistId}`,
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
    const { params } = match;
    if (!isUndefined(params.id)) {
      dispatch({
        type: 'inspectList/fetchInspectListDetail',
        payload: {
          tenantId,
          page: {},
          id: params.id,
        },
      });
      dispatch({
        type: 'inspectList/fetchProblemList',
        payload: {
          tenantId,
          page: {},
          actChecklistId: params.id,
        },
      });
    }
  }

  /**
   * 判断页面来源
   * @param {*} from
   */
  @Bind()
  judgeRouterSource(from) {
    let source = '';
    switch (from) {
      case 'wo-type':
        source = 'WO_TYPE';
        break;
      case 'act':
        source = 'ACT';
        break;
      default:
        source = 'ACT_CHECKLIST_GROUPS';
        break;
    }
    return source;
  }

  render() {
    const { defaultDetailItem, editFlag } = this.state;
    const {
      loading,
      match,
      tenantId,
      dispatch,
      inspectList: {
        detail = {},
        problemsList = [],
        businessScenarioList = [],
        fieldTypeList = [],
      },
    } = this.props;
    const { id, parentId, from } = match.params;
    const isNew = !isUndefined(id);
    const { detailLoading, saveDetailLoading } = loading;
    const infoProps = {
      isNew,
      editFlag,
      tenantId,
      dispatch,
      loading,
      key: id,
      parentId,
      problemsList,
      fieldTypeList,
      businessScenarioList,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.inspectList.view.message.title.detail`).d('标准检查项明细')}
          backPath={`/amtc/${from}/detail/${parentId}`}
        >
          <Button
            type="primary"
            icon="save"
            style={displayFlagBtn}
            loading={saveDetailLoading}
            onClick={this.handleSaveInspectList}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <Row className={classNames(styles['inspect-list-detail'])}>
            <Col>
              <Spin
                spinning={isUndefined(id) ? false : detailLoading}
                wrapperClassName={classNames(
                  styles['inspect-list-detail'],
                  DETAIL_DEFAULT_CLASSNAME
                )}
              >
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
