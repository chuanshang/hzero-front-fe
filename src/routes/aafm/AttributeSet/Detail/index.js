/**
 * Detail - 属性组明细页面
 * @date: 2019-01-15
 * @author: FQL <qilin.feng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Spin, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ loading, attributeSet }) => ({
  attributeSet,
  loading: {
    detailLoading: loading.effects['attributeSet/fetchAttributeSetDetail'],
    // detailLineListLoading: loading.effects['attributeSet/queryDetailLineList'],
    fullTextSearchLoading: loading.effects['attributeSet/queryAttributeSetList'],
    saveDetailLoading: loading.effects['attributeSet/saveDetailData'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['aafm.attributeSet', 'aafm.common'] })
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
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
        type: 'attributeSet/queryAttributeSetList',
        payload: {
          tenantId,
          page: {},
          attributeSetName: '',
        },
      });
    }
    this.props.dispatch({
      type: 'attributeSet/init',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * 明细页-数据检索
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'attributeSet/queryAttributeSetList',
      payload: {
        tenantId,
        page,
        attributeSetName: condition,
      },
    });
  }

  /**
   * 属性明细查询：头信息&行信息
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
      // dispatch({
      //   type: 'attributeSet/queryDetailLineList',
      //   payload: {
      //     tenantId,
      //     page,
      //     attributeSetId: params.id,
      //   },
      // });
      dispatch({
        type: 'attributeSet/fetchAttributeSetDetail',
        payload: {
          tenantId,
          attributeSetId: params.id,
        },
      });
    } else {
      dispatch({
        type: 'attributeSet/updateState',
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
  handleSaveAttributeSet() {
    const {
      dispatch,
      match,
      tenantId,
      attributeSet: { detail = {}, detailList = [] },
    } = this.props;
    const { editFlag } = this.state;
    const { id } = match.params;
    let flag = false;
    let params = [];
    const attrLines = detailList.filter(i => ['update', 'create'].includes(i._status));
    if (Array.isArray(attrLines) && attrLines.length === 0) {
      // 未进行属性行变更：新增、编辑
      this.form.validateFields((err, values) => {
        if (!err) {
          params = isUndefined(id)
            ? [{ ...values, tenantId }]
            : [{ ...detail, ...values, tenantId, attributeLinesList: [] }];
          flag = true;
        }
      });
    } else {
      const data = getEditTableData(attrLines, ['lineId']);
      this.form.validateFields((err, values) => {
        if (!err && (Array.isArray(data) && data.length > 0)) {
          params = isUndefined(id)
            ? [{ ...values, attributeLinesList: data || [], tenantId }]
            : [{ ...detail, ...values, attributeLinesList: data || [], tenantId }];
          flag = true;
        }
      });
    }
    // debugger;
    if (flag) {
      dispatch({
        type: 'attributeSet/saveDetailData',
        payload: {
          tenantId,
          data: params,
        },
      }).then(res => {
        if (res) {
          this.setState({ editFlag: !editFlag });
          notification.success();
          if (isUndefined(id)) {
            dispatch(
              routerRedux.push({
                pathname: `/aafm/attribute-set/detail/${res[0].attributeSetId}`,
              })
            );
          } else {
            this.fetchDetailList();
          }
        }
      });
    }
  }

  /**
   * 明细添加行数据
   */
  @Bind()
  handleAddDetailLine() {
    const {
      dispatch,
      tenantId,
      attributeSet: { detailList = [] },
    } = this.props;
    dispatch({
      type: 'attributeSet/updateState',
      payload: {
        detailList: [
          ...detailList,
          {
            tenantId,
            lineId: uuidv4(),
            lineNum: detailList.length < 1 ? 1 : detailList[detailList.length - 1].lineNum + 1,
            // attributeName: '',
            enabledFlag: 1,
            requiredFlag: 1,
            _status: 'create',
          },
        ],
      },
    });
  }

  /**
   * 清除新增行数据
   * @param {Objec} record 待清除的数据对象
   */
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      attributeSet: { detailList = [] },
    } = this.props;
    const newList = detailList.filter(item => item.lineId !== record.lineId);
    dispatch({
      type: 'attributeSet/updateState',
      payload: {
        detailList: [...newList],
      },
    });
  }

  /**
   * 编辑
   * @param {Object} record 行数据
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record, flag) {
    const {
      dispatch,
      attributeSet: { detailList = [] },
    } = this.props;
    const newList = detailList.map(item =>
      item.lineId === record.lineId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'attributeSet/updateState',
      payload: {
        detailList: [...newList],
      },
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
   * 搜索区域隐藏显示
   */
  @Bind()
  setShowSearchFlag() {
    const { showSearchFlag } = this.state;
    const reShowSearchFlag = !showSearchFlag;
    this.setState({ showSearchFlag: reShowSearchFlag });
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
   *
   * @param {string} id - 资产组Id
   */
  @Bind()
  handleLinkToDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aafm/attribute-set/detail/${id}`,
      })
    );
  }

  render() {
    const { editFlag, showSearchFlag, defaultDetailItem } = this.state;
    const {
      loading,
      match,
      tenantId,
      attributeSet: { detail = {}, detailList, list = [], pagination = {}, enumMap = {} },
    } = this.props;
    const { id } = match.params;
    const isNew = !isUndefined(id);
    const { fieldTypes } = enumMap;
    const { detailLoading, fullTextSearchLoading, saveDetailLoading } = loading;
    const fullTextSearchProps = {
      pagination,
      loading: fullTextSearchLoading,
      dataSource: list,
      onSearch: this.handleFullSearch,
      onLinkToDetail: this.handleLinkToDetail,
    };
    const infoProps = {
      isNew,
      editFlag,
      fieldTypes,
      tenantId,
      detailList,
      key: id,
      loading: detailLoading,
      dataSource: isUndefined(id) ? defaultDetailItem : detail,
      onRef: this.handleBindRef,
      onAddDetailLine: this.handleAddDetailLine,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onRefresh: this.fetchDetailList,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <Fragment>
        <Header
          title={intl.get(`aafm.attributeSet.view.message.title.detail`).d('属性组明细')}
          backPath="/aafm/attribute-set/list"
        >
          <Button
            type="primary"
            icon="save"
            style={displayFlagBtn}
            loading={saveDetailLoading}
            onClick={this.handleSaveAttributeSet}
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
          <Row className={classNames(styles['attribute-set-detail'])}>
            <Col style={displayFullFlag} span={isUndefined(id) ? 0 : 6}>
              <FullTextSearch {...fullTextSearchProps} />
            </Col>
            <Col style={displayFlag} span={isUndefined(id) ? 0 : 1}>
              <Icon
                type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                onClick={this.setShowSearchFlag}
                style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
              >
                {intl.get(`hero.common.click.menu`).d('')}
              </Icon>
            </Col>
            <Col span={isUndefined(id) ? 24 : editFlag ? 23 : showSearchFlag ? 17 : 23}>
              <Spin
                spinning={isUndefined(id) ? false : detailLoading}
                wrapperClassName={classNames(
                  styles['attribute-set-detail'],
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
