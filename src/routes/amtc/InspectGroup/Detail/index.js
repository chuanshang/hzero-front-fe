/**
 * Detail - 标准检查组明细页面
 * @date: 2019-05-22
 * @author: QZQ <zhiqiang.quan@hand-china.com>
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
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, inspectGroup }) => ({
  inspectGroup,
  loading: {
    detailLoading: loading.effects['inspectGroup/fetchInspectGroupDetail'],
    checklistTreeLoading: loading.effects['inspectGroup/fetchActChecklistsList'],
    saveDetailLoading:
      loading.effects['inspectGroup/saveEditData'] || loading.effects['inspectGroup/saveAddData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['amtc.inspectGroup', 'amtc.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
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
    dispatch({ type: 'inspectGroup/fetchLov', payload: { tenantId } });
    if (!isUndefined(params.id)) {
      this.handleSearch();
    } else {
      dispatch({
        type: 'inspectGroup/updateState',
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
  handleSaveInspectGroup() {
    const {
      dispatch,
      tenantId,
      match: {
        url,
        params: { id },
      },
      inspectGroup: { detail },
    } = this.props;
    const { validateFields = e => e } = this.form;
    const fieldValues = isUndefined(this.form) ? {} : this.form.getFieldsValue();
    validateFields(err => {
      if (isEmpty(err)) {
        dispatch({
          type: 'inspectGroup/saveEditData',
          payload: {
            ...detail,
            ...fieldValues,
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
                  pathname: `/amtc/inspect-group/detail/${res.checklistGroupId}`,
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
    if (!isUndefined(id)) {
      dispatch({
        type: 'inspectGroup/fetchInspectGroupDetail',
        payload: {
          tenantId,
          page: {},
          inspectGroupId: id,
        },
      });
      dispatch({
        type: 'inspectGroup/fetchActChecklistsList',
        payload: {
          tenantId,
          parentId: id,
        },
      });
    }
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 组织行信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record) {
    const {
      dispatch,
      inspectGroup: { expandedRowKeys = [] },
    } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.checklistId]
      : expandedRowKeys.filter(item => item !== record.checklistId);
    dispatch({
      type: 'inspectGroup/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  render() {
    const { defaultDetailItem, editFlag } = this.state;
    const {
      loading,
      match,
      tenantId,
      dispatch,
      inspectGroup: {
        detail = {},
        checkGroupTypeList = [],
        fieldTypeList = [],
        treeList = [],
        expandedRowKeys = [],
      },
    } = this.props;
    const { id } = match.params;
    const isNew = !isUndefined(id);
    const { detailLoading, saveDetailLoading } = loading;
    const infoProps = {
      isNew,
      loading,
      editFlag,
      tenantId,
      dispatch,
      groupId: id,
      treeList,
      expandedRowKeys,
      fieldTypeList,
      checkGroupTypeList,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onExpand: this.handleExpandSubLine,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <Fragment>
        <Header
          title={intl.get(`amtc.inspectGroup.view.message.title.detail`).d('标准检查组明细')}
          backPath="/amtc/inspect-group/list"
        >
          <Button
            type="primary"
            icon="save"
            style={displayFlagBtn}
            loading={saveDetailLoading}
            onClick={this.handleSaveInspectGroup}
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
          <Row className={classNames(styles['inspect-group-detail'])}>
            <Col>
              <Spin
                spinning={isUndefined(id) ? false : detailLoading}
                wrapperClassName={classNames(
                  styles['inspect-group-detail'],
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
