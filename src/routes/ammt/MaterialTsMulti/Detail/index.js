/**
 * workOrder - 工单-详细页面
 * @date: 2019-4-10
 * @author: HQ <qing.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Row, Col, Spin } from 'hzero-ui';
import { isUndefined } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import moment from 'moment';
import { getCurrentOrganizationId, getEditTableData, getDateTimeFormat } from 'utils/utils';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';

import InfoExhibit from './InfoExhibit';
import styles from './index.less';

// dva连接
@connect(({ materialTsMulti, loading, user }) => ({
  materialTsMulti,
  user,
  tenantId: getCurrentOrganizationId(),
  saveOrUpdateLoading: loading.effects['materialTsMulti/createOrUpdateMaterialsTsMulti'],
  fetchMaterialsTsMultiByIdLoading: loading.effects['materialTsMulti/fetchMaterialsTsMultiById'],
  fetchinnertableloading: loading.effects['materialTsMulti/fetchInnerRowById'],
  deleteinnerrowloading: loading.effects['materialTsMulti/deleteInnerRow'],
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      defaultMaterialTsMulti: {},
      isEditable: false,
      indexnum: 1,
    };
  }

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      dispatch({
        type: 'materialTsMulti/fetchMaterialsTsMultiById',
        payload: {
          transbatchId: id,
        },
      }).then(res => {
        if (res) {
          this.setState({
            defaultMaterialTsMulti: res,
          });
          this.fetchInnerRowList({
            transbatchId: res.transbatchId,
            page: { current: 1, pageSize: 50 },
          });
        }
      });
    }
  }

  /**
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 保存明细
   */
  @Bind()
  save() {
    // 处理表单效验，获取处理后的表单数据
    const {
      materialTsMulti: { innerList = [] },
      dispatch,
      match,
    } = this.props;
    const { defaultMaterialTsMulti } = this.state;
    const params = getEditTableData(innerList, ['translineId']);
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const queryparams = {
          ...defaultMaterialTsMulti,
          ...fieldsValue,
          transLinesList: [...params],
          transDate: moment(fieldsValue.transDate).format(getDateTimeFormat()),
        };
        dispatch({
          type: 'materialTsMulti/createOrUpdateMaterialsTsMulti',
          payload: queryparams,
        }).then(res => {
          if (res) {
            notification.success();
            const { id } = match.params;
            if (isUndefined(id)) {
              dispatch(
                routerRedux.push({ pathname: `/ammt/material_ts_Multi/detail/${res.transbatchId}` })
              );
            } else {
              dispatch({
                type: 'materialTsMulti/fetchMaterialsTsMultiById',
                payload: {
                  transbatchId: id,
                },
              }).then(res1 => {
                if (res1) {
                  this.setState({
                    defaultMaterialTsMulti: res1,
                  });
                  this.fetchInnerRowList({
                    transbatchId: res1.transbatchId,
                    page: { current: 1, pageSize: 50 },
                  });
                  this.setState({ indexnum: 1 });
                }
              });
            }
          }
        });
      }
    });
  }
  @Bind()
  edits() {
    const { isEditable } = this.state;
    this.setState({ isEditable: !isEditable });
  }
  @Bind()
  indexnumAdd() {
    const { indexnum } = this.state;
    this.setState({ indexnum: indexnum + 1 });
  }
  @Bind
  fetchInnerRowList(param) {
    const {
      materialTsMulti: { innerpagination = {} },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'materialTsMulti/fetchInnerRowById',
      payload: {
        page: innerpagination,
        ...param,
      },
    });
  }

  render() {
    const {
      match,
      saveOrUpdateLoading,
      fetchinnertableloading,
      fetchMaterialsTsMultiByIdLoading,
      deleteinnerrowloading,
      user,
    } = this.props;
    const { id } = match.params;
    const { defaultMaterialTsMulti, isEditable, indexnum } = this.state;
    const detailFormProps = {
      onRef: this.handleBindRef,
      materialTsMulti: this.props.materialTsMulti,
      loading: fetchinnertableloading,
      onChange: this.fetchInnerRowList,
      tenantId: this.props.tenantId,
      dispatch: this.props.dispatch,
      defaultMaterialTsMulti,
      detailId: id,
      user,
      isEditable,
      deleteinnerrowloading,
      indexnum,
      indexnumAdd: this.indexnumAdd,
    };
    return (
      <React.Fragment>
        <Header title={isUndefined(id) ? '新增' : '编辑'} backPath="/ammt/material_ts_Multi/list">
          {!isUndefined(id) && (
            <Button icon="save" type="primary">
              {intl.get(`hero.common.button.save`).d('处理')}
            </Button>
          )}
          {!isUndefined(id) && (
            <Button icon="save" type="primary">
              {intl.get(`hero.common.button.save`).d('取消')}
            </Button>
          )}
          {!isUndefined(id) && (
            <Button icon="save" type="primary">
              {intl.get(`hero.common.button.save`).d('提交')}
            </Button>
          )}
          {(isUndefined(id) || isEditable) && (
            <Button loading={saveOrUpdateLoading} icon="save" type="primary" onClick={this.save}>
              {intl.get(`hero.common.button.save`).d('保存')}
            </Button>
          )}
          {!isUndefined(id) &&
            (!isEditable ? (
              <Button icon="save" type="primary" onClick={this.edits}>
                {intl.get(`hero.common.button.edit`).d('编辑')}
              </Button>
            ) : (
              <Button icon="close" type="primary" onClick={this.edits}>
                {intl.get(`hero.common.button.close`).d('关闭')}
              </Button>
            ))}
        </Header>
        <Content>
          <div className={classNames(styles['materials-detail'])}>
            <Row>
              <Col span={24}>
                <Spin spinning={isUndefined(id) ? false : fetchMaterialsTsMultiByIdLoading}>
                  <InfoExhibit {...detailFormProps} />
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
