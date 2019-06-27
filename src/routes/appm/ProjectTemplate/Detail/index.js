/**
 * ProjectTemplate - 项目模板明细
 * @date: 2019-3-6
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ projectTemplate, loading }) => ({
  projectTemplate,
  loading: {
    detail: loading.effects['projectTemplate/fetchTemplateDetail'],
    search: loading.effects['projectTemplate/fetchTemplate'],
    save: loading.effects['projectTemplate/saveTemplate'],
    submit: loading.effects['projectTemplate/submitTemplate'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['appm.common', 'appm.projectTemplate'],
})
class Detail extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
      templateItem: {},
    };
  }
  componentDidMount() {
    const { match, tenantId, dispatch } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
    }
    dispatch({ type: 'projectTemplate/fetchLov', payload: { tenantId } });
    dispatch({ type: 'projectTemplate/fetchProjectRole', payload: { tenantId, enabledFlag: 1 } });
  }
  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    const { url } = match;
    if (!isUndefined(id)) {
      dispatch({
        type: 'projectTemplate/fetchTemplateDetail',
        payload: {
          tenantId,
          proTemplateId: id,
          presetFlag: url.indexOf('new-detail') === -1 ? 0 : 1,
        },
      }).then(res => {
        if (res && url.indexOf('new-detail') !== -1) {
          dispatch(
            routerRedux.push({
              pathname: `/appm/project-template/new-detail/${res.proTemplateId}`,
            })
          );
        }
      });
    } else {
      this.setState({
        templateItem: {
          tenantId,
          enabledFlag: 1,
          workdayFlag: 0,
          approveStatus: 'DRAFT',
          approveStatusMeaning: '未提交',
          proTemplateStatus: 'PRESET',
          proTemplateStatusMeaning: '拟定',
        },
      });
    }
  }
  /**
   * 模板保存
   */
  @Bind()
  handleSaveTemplate() {
    const { templateItem } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      projectTemplate: { templateDetail },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'projectTemplate/saveTemplate',
          payload: {
            tenantId,
            data: {
              tenantId,
              ...templateDetail,
              ...templateItem,
              ...values,
              pmoRoleId: Number(values.pmoRoleId),
              picRoleId: Number(values.picRoleId),
              otherRoles: JSON.stringify(values.otherRoles),
            },
          },
        }).then(res => {
          if (res) {
            notification.success();
            if (isUndefined(id)) {
              this.handleGotoDetail(res);
            } else {
              this.handleSearch();
            }
          }
        });
      }
    });
  }

  /**
   * 跳转至WBS信息
   */
  @Bind()
  handleGotoTaskTemplate() {
    const {
      params: { id },
    } = this.props.match;
    this.props.dispatch(
      routerRedux.push({
        pathname: `/appm/project-template/task/${id}`,
      })
    );
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
   * 明细页-数据检索
   * @param {string} [condition = ''] - 查询条件
   * @param {object} [page = {}] - 分页参数
   * @param {Number} page.current - 当前页码
   * @param {Number} page.pageSize - 分页大小
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    this.setState({});
    dispatch({
      type: 'projectTemplate/searchFullText',
      payload: {
        tenantId,
        page,
        detailSelectItem: condition,
      },
    });
  }
  /**
   * 明细详情切换
   */
  @Bind()
  handleGotoDetail(record) {
    let path = '';
    if (record.proTemplateStatus === 'PRESET') {
      path = 'new-detail';
    } else {
      path = 'detail';
    }
    this.props.dispatch(
      routerRedux.push({
        pathname: `/appm/project-template/${path}/${record.proTemplateId}`,
      })
    );
  }

  /**
   * 模板提交
   */
  @Bind()
  handleSubmitTemplate() {
    const { templateItem } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      projectTemplate: { templateDetail },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'projectTemplate/submitTemplate',
          payload: {
            tenantId,
            proTemplateId: id,
            data: {
              tenantId,
              ...templateDetail,
              ...templateItem,
              ...values,
              pmoRoleId: Number(values.pmoRoleId),
              picRoleId: Number(values.picRoleId),
              otherRoles: JSON.stringify(values.otherRoles),
            },
          },
        }).then(res => {
          if (res) {
            notification.success();
            if (isUndefined(id)) {
              this.handleGotoDetail(res);
            } else {
              // 提交后状态由拟定变为正式，需要手动将路由从new-detail设置为detail
              dispatch(
                routerRedux.push({
                  pathname: `/appm/project-template/detail/${id}`,
                })
              );
            }
          }
        });
      }
    });
  }
  render() {
    const { templateItem = {} } = this.state;
    const { loading, match, tenantId, projectTemplate } = this.props;
    const { id } = match.params;
    const {
      templateDetail = {},
      fullList = [],
      fullPagination = {},
      limitTimeUom = [],
      projectRole = [],
      pmoRole = [],
      proManageRole = [],
    } = projectTemplate;
    const fullTextSearchProps = {
      loading: loading.search,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      tenantId,
      limitTimeUom,
      projectRole,
      pmoRole,
      proManageRole,
      key: id,
      isNew: isUndefined(id),
      dataSource: isUndefined(id) ? templateItem : templateDetail,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
    };
    const prefix = 'appm';
    return (
      <React.Fragment>
        <Header
          title={intl.get(`appm.projectTemplate.view.message.detail.title`).d('项目模板明细')}
          backPath="/appm/project-template/list"
        >
          <Button
            icon="save"
            type="primary"
            loading={loading.save}
            style={{
              display:
                templateDetail.proTemplateStatus !== 'HISTORY' &&
                templateDetail.approveStatus !== 'APPROVING'
                  ? 'block'
                  : 'none',
            }}
            onClick={this.handleSaveTemplate}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button
            icon="check"
            style={{
              display:
                isUndefined(id) || templateDetail.proTemplateStatus === 'PRESET' ? 'block' : 'none',
            }}
            loading={loading.submit}
            onClick={this.handleSubmitTemplate}
          >
            {intl.get(`hzero.common.button.submit`).d('提交')}
          </Button>
          <Button
            icon="file"
            style={{
              display: isUndefined(id) ? 'none' : 'block',
            }}
            onClick={this.handleGotoTaskTemplate}
          >
            {intl.get(`${prefix}`).d('WBS信息')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['project-template-detail'])}>
            <Row>
              <Col span={isUndefined(id) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col span={isUndefined(id) ? 24 : 17} offset={isUndefined(id) ? 0 : 1}>
                <Spin spinning={isUndefined(id) ? false : loading.detail}>
                  <InfoExhibit {...infoProps} />
                </Spin>
              </Col>
            </Row>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
export default Detail;
