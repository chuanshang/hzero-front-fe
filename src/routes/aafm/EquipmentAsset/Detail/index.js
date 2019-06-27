/**
 * Detail - 设备资产明细
 * @date: 2019-1-24
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col, Modal, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import moment from 'moment';
import InfoExhibit from './InfoExhibit';
import FullTextSearch from './FullTextSearch';
import styles from './index.less';

@connect(({ equipmentAsset, loading }) => ({
  equipmentAsset,
  loading: {
    detail: loading.effects['equipmentAsset/fetchEquipmentAssetDetail'],
    fullTextSearch: loading.effects['equipmentAsset/searchFullText'],
    delete: loading.effects['equipmentAsset/deleteEquipmentAsset'],
    save:
      loading.effects['equipmentAsset/updateEquipmentAsset'] ||
      loading.effects['equipmentAsset/addEquipmentAsset'],
    event: loading.effects['equipmentAsset/searchEventHistory'],
    field: loading.effects['equipmentAsset/searchFieldHistory'],
    transaction: loading.effects['equipmentAsset/fetchTransactionTypesList'],
  },
  tenantId: getCurrentOrganizationId(),
}))
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showSearchFlag: true,
      editFlag: false,
      defaultDetailItem: {},
      tabPaneHeight: window.screen.availHeight - 450 < 380 ? 380 : window.screen.availHeight - 450,
      dateTimeFormat: getDateTimeFormat(),
      currentAssetsSetId: '',
    };
  }

  componentDidMount() {
    this.screenChange();
    const { match, tenantId } = this.props;
    const { assetId } = match.params;
    if (!isUndefined(assetId)) {
      this.handleFullSearch('', {});
    }
    this.props.dispatch({ type: 'equipmentAsset/fetchLov', payload: { tenantId } });
  }
  @Bind()
  screenChange() {
    window.addEventListener('resize', this.resize);
  }
  @Bind()
  resize() {
    this.setState({
      tabPaneHeight: window.screen.availHeight - 450 < 380 ? 380 : window.screen.availHeight - 450,
    });
  }
  /**
   * 跳转到明细页
   * @param {string} id - 设备资产id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aafm/equipment-asset/detail/${id}`,
      })
    );
  }

  /**
   * 明细页查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { assetId } = match.params;
    if (!isUndefined(assetId)) {
      dispatch({
        type: 'equipmentAsset/fetchEquipmentAssetDetail',
        payload: {
          tenantId,
          assetInfoId: assetId,
        },
      }).then(res => {
        this.setCurrentAssetsSetId(res.assetsSetId);
        if (res && res.attributeSetId) {
          // 获取属性行(资产-->资产组-->属性组-->属性行)
          this.renderAttributeDescription(res.attributeSetId);
        }
      });
    } else {
      this.setState({
        defaultDetailItem: {
          maintainable: 1,
        },
      });
    }
  }

  /**
   * 展开/收缩数据检索
   */
  @Bind()
  setShowSearchFlag() {
    const { showSearchFlag } = this.state;
    this.setState({ showSearchFlag: !showSearchFlag });
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
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 明细页-数据检索
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'equipmentAsset/searchFullText',
      payload: {
        tenantId,
        page,
        detailCondition: condition,
      },
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleEquipmentAssetSave() {
    const {
      dispatch,
      tenantId,
      match,
      equipmentAsset: { detail },
    } = this.props;
    const { assetId } = match.params;
    const { editFlag, defaultDetailItem, dateTimeFormat } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        const linear = {
          linearName: values.linearName,
          linearStartMeasure: values.linearStartMeasure,
          linearStartDesc: values.linearStartDesc,
          linearEndMeasure: values.linearEndMeasure,
          linearEndDesc: values.linearEndDesc,
        };
        const attributeValues = [];
        for (const key in values) {
          if (key.indexOf('lineId') !== -1) {
            const attrCode = key.substring(key.indexOf('#'));
            attributeValues.push({ attrCode, attrValue: values[key] });
          }
        }
        if (isUndefined(assetId)) {
          // 新增
          dispatch({
            type: 'equipmentAsset/addEquipmentAsset',
            payload: {
              tenantId,
              data: {
                ...defaultDetailItem,
                ...values,
                specialAssetCode: isUndefined(values.specialAssetCode)
                  ? ''
                  : values.specialAssetCode,
                attributeValues: JSON.stringify(attributeValues),
                assetLinear: { ...linear },
                receivedDate: moment(values.receivedDate).format(dateTimeFormat),
                startDate: moment(values.startDate).format(dateTimeFormat),
                warrantyStartDate: moment(values.warrantyStartDate).format(dateTimeFormat),
                warrantyExpireDate: moment(values.warrantyExpireDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editFlag: !editFlag });
              dispatch(
                routerRedux.push({
                  pathname: `/aafm/equipment-asset/detail/${res.assetId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'equipmentAsset/updateEquipmentAsset',
            payload: {
              tenantId,
              data: {
                ...defaultDetailItem,
                ...detail,
                ...values,
                specialAssetCode: isUndefined(values.specialAssetCode)
                  ? ''
                  : values.specialAssetCode,
                attributeValues: JSON.stringify(attributeValues),
                assetLinear: { ...detail.assetLinear, ...linear },
                receivedDate: moment(values.receivedDate).format(dateTimeFormat),
                startDate: moment(values.startDate).format(dateTimeFormat),
                warrantyStartDate: moment(values.warrantyStartDate).format(dateTimeFormat),
                warrantyExpireDate: moment(values.warrantyExpireDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editFlag: !editFlag });
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 单条数据删除
   */
  @Bind()
  handleEquipmentAssetDelete() {
    const {
      dispatch,
      tenantId,
      equipmentAsset: { detail },
    } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl.get('aafm.common.view.message.confirm.delete').d('是否删除该条设备资产记录'),
      onOk: () => {
        dispatch({
          type: 'equipmentAsset/deleteEquipmentAsset',
          payload: {
            tenantId,
            data: [detail],
          },
        }).then(res => {
          if (res) {
            notification.success();
            // 返回列表页
            dispatch(
              routerRedux.push({
                pathname: `/aafm/equipment-asset/list`,
              })
            );
          }
        });
      },
    });
  }

  @Bind()
  renderAttributeDescription(attributeSetId) {
    const { dispatch, tenantId } = this.props;
    if (attributeSetId) {
      dispatch({
        type: 'equipmentAsset/queryDetailLineList',
        payload: {
          tenantId,
          attributeSetId,
        },
      });
    } else {
      dispatch({
        type: 'equipmentAsset/updateState',
        payload: {
          attributeInfo: [],
        },
      });
    }
  }

  /**
   * 获取事件列表
   */
  @Bind()
  handleSearchEventList(fields = {}) {
    const {
      tenantId,
      dispatch,
      match: {
        params: { assetId },
      },
    } = this.props;
    dispatch({
      type: 'equipmentAsset/searchEventHistory',
      payload: {
        tenantId,
        assetId,
        ...fields,
      },
    });
  }

  /**
   * 获取字段列表
   */
  @Bind()
  handleSearchFieldList(fields = {}) {
    const {
      tenantId,
      dispatch,
      match: {
        params: { assetId },
      },
    } = this.props;
    dispatch({
      type: 'equipmentAsset/searchFieldHistory',
      payload: {
        tenantId,
        assetId,
        ...fields,
      },
    });
  }

  /**
   * 获取字段列表
   */
  @Bind()
  handleAssetFields(fields = {}) {
    const {
      tenantId,
      dispatch,
      match: {
        params: { assetId },
      },
    } = this.props;
    dispatch({
      type: 'equipmentAsset/searchAssetFields',
      payload: {
        tenantId,
        assetId,
        ...fields,
      },
    });
  }

  /**
   * 获取多选框中需要显示的事件类型短名称
   */
  @Bind()
  handleSearchTransactionTypes() {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'equipmentAsset/fetchTransactionTypesList',
      payload: {
        tenantId,
        enabledFlag: 1,
      },
    });
  }
  @Bind()
  setCurrentAssetsSetId(assetsSetId) {
    this.setState({ currentAssetsSetId: assetsSetId });
  }
  render() {
    const {
      loading,
      tenantId,
      equipmentAsset,
      match: { params },
    } = this.props;
    const { assetId } = params;
    const {
      editFlag,
      showSearchFlag,
      defaultDetailItem,
      tabPaneHeight,
      currentAssetsSetId,
    } = this.state;
    const isNew = !isUndefined(assetId);
    const {
      detail,
      fullList,
      fullPagination,
      eventPagination,
      eventList = [],
      fieldList = [],
      specialAsset = [],
      nameplateRule = [],
      assetSource = [],
      warrantyTypeRule = [],
      attributeInfo = [],
      assetCriticalityMap = [],
      transactionTypes = [],
      assetFields = [],
      fullTagStatusColorMap = [],
    } = equipmentAsset;
    const assetTagStatusColorMap =
      fullTagStatusColorMap.filter(item => item.tag === 'equipment-asset') || [];
    const fullTextSearchProps = {
      currentAssetId: assetId,
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      assetTagStatusColorMap,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      tenantId,
      editFlag,
      specialAsset,
      assetCriticalityMap,
      nameplateRule,
      assetSource,
      warrantyTypeRule,
      attributeInfo,
      loading,
      eventPagination,
      eventList,
      fieldList,
      transactionTypes,
      assetFields,
      key: assetId,
      isNew,
      tabPaneHeight,
      attributeSetId: detail.attributeSetId,
      currentAssetsSetId,
      dataSource: isUndefined(assetId) ? defaultDetailItem : detail,
      assetTagStatusColorMap,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onSearchField: this.handleSearchFieldList,
      onSearchEvent: this.handleSearchEventList,
      onSearchTransactionTypes: this.handleSearchTransactionTypes,
      onSearchAssetFields: this.handleAssetFields,
      onFetchAttributeDescription: this.renderAttributeDescription,
      onSetCurrentAssetsSetId: this.setCurrentAssetsSetId,
    };
    const displayFlag = !isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get('aafm.equipmentAsset.view.title').d('设备/资产')}
          backPath="/aafm/equipment-asset/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleEquipmentAssetSave}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
          <Button
            icon="delete"
            disabled={isUndefined(assetId)}
            loading={loading.delete}
            onClick={this.handleEquipmentAssetDelete}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['equipment-asset-detail'])}>
            <Row>
              <Col span={isUndefined(assetId) ? 0 : editFlag ? 1 : showSearchFlag ? 6 : 1}>
                <Row>
                  <Col style={displayFullFlag} span={isUndefined(assetId) ? 0 : 21}>
                    <FullTextSearch {...fullTextSearchProps} />
                  </Col>
                  <Col style={displayFlag} span={isUndefined(assetId) ? 0 : 3}>
                    <Icon
                      type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                      onClick={this.setShowSearchFlag}
                      style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                    >
                      {intl.get(`hero.common.click.menu`).d('')}
                    </Icon>
                  </Col>
                </Row>
              </Col>
              <Col span={isUndefined(assetId) ? 24 : editFlag ? 23 : showSearchFlag ? 18 : 23}>
                <Spin
                  spinning={isUndefined(assetId) ? false : loading.detail}
                  wrapperClassName={classNames(
                    styles['equipment-asset-detail'],
                    DETAIL_DEFAULT_CLASSNAME
                  )}
                >
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
