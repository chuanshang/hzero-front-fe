/**
 * 资产状态信息变更单 创建/编辑 明细
 * @date: 2019-3-21
 * @author: HBT <baitao.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Button, Spin, Row, Col, Modal, Icon } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import { isUndefined, isEmpty, omit, isNull } from 'lodash';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { routerRedux } from 'dva/router';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ assetStatusChange, loading }) => ({
  assetStatusChange,
  loading: {
    detail: loading.effects['assetStatusChange/fetchHeaderDetail'],
    list: loading.effects['assetStatusChange/fetchLineList'],
    fullTextSearch: loading.effects['assetStatusChange/searchFullText'],
    save:
      loading.effects['assetStatusChange/updateAssetStatusChange'] ||
      loading.effects['assetStatusChange/addAssetStatusChange'],
    equipmentAsset: loading.effects['assetStatusChange/fetchEquipmentAsset'],
    execute: loading.effects['assetStatusChange/executeAssetStatusChange'],
    delete: loading.effects['assetStatusChange/deleteAssetStatusChange'],
    submit: loading.effects['assetStatusChange/submitAssetStatusChange'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aatn.common', 'aatn.assetStatusChange'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editControl: false,
      showSearchFlag: true,
      isMulti: false,
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      drawerVisible: false,
      deleteFlag: false,
      lineDetail: {}, // drawer用到的数据源
      dynamicFields: [], // 需要展示的动态字段
      submitDynamics: [], // 需提交的动态数据列表
      valuesList: [], // 下拉列表值集列表
      defaultItem: {
        processStatus: 'NEW',
        processStatusMeaning: '新建',
      },
    };
  }

  componentDidMount() {
    const { match, tenantId } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      this.handleFullSearch('', {});
      this.handleGetFields();
    }
    this.props.dispatch({ type: 'assetStatusChange/fetchLov', payload: { tenantId } });
  }

  /**
   * 设备资产列表查询
   */
  @Bind()
  handleSearchAsset(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetDesc } = fields;
    dispatch({
      type: 'assetStatusChange/fetchEquipmentAsset',
      payload: {
        tenantId,
        detailCondition: assetDesc,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 清空资产列表数据
   */
  @Bind()
  handleClearAssetList() {
    this.props.dispatch({
      type: 'assetStatusChange/updateState',
      payload: {
        assetList: [],
      },
    });
  }

  /**
   * 打开设备资产模态框
   */
  @Bind()
  handleShowAssetModal(flag) {
    this.handleSearchAsset();
    this.setState({ modalVisible: true, isMulti: flag });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleModalCancel() {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
    this.handleClearAssetList();
  }

  /**
   * 设备资产模态框确认操作
   */
  @Bind()
  handleAssetModalOk() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      assetStatusChange: { changeOrderLines, transferType },
    } = this.props;
    const { targetAssetStatusId, targetAssetStatusName } = transferType;
    let detailList = [];
    if (!isEmpty(selectedRows)) {
      detailList = selectedRows
        .map(item => {
          return {
            ...item,
            targetAssetStatusId,
            targetAssetStatusName,
            processStatus: 'NEW',
            processStatusMeaning: '新建',
            changeLineId: uuidv4(),
            currentAssetStatusId: item.assetStatusId,
            currentAssetStatusName: item.assetStatusName,
            currentLocationId: item.assetLocationId,
            currentLocationName: item.assetLocationName,
            currentOwningPersonId: item.owningPersonId,
            currentOwningPersonName: item.owningPersonName,
            currentUsingPersonId: item.userPersonId,
            currentUsingPersonName: item.userPersonName,
            _status: 'create',
          };
        })
        .map(i => omit(i, ['description', '_token', 'objectVersionNumber']));
    }
    dispatch({
      type: 'assetStatusChange/updateState',
      payload: {
        changeOrderLines: [...changeOrderLines, ...detailList],
      },
    });
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
    this.handleClearAssetList();
  }

  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 弹出行明细滑窗
   * @param {object} record 行记录
   */
  @Bind()
  handleShowDrawer(record) {
    this.setState({
      drawerVisible: true,
      lineDetail: record,
    });
    if (record._status !== 'create') {
      this.handleGetDynamicData(record);
    }
  }

  /**
   * 滑窗关闭
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false });
  }

  /**
   * 滑窗的确认操作
   * @param {object} current 当前编辑的行记录
   */
  @Bind()
  handleDrawerOk(current = {}) {
    const { submitDynamics } = this.state;
    const {
      dispatch,
      tenantId,
      assetStatusChange: { changeOrderLines },
    } = this.props;
    let newList = [];
    const submitList = [];
    if (current._status === 'create') {
      // 新建
      submitDynamics.forEach(item => {
        if (!isUndefined(current[`target#${item._tag}`])) {
          submitList.push({
            ...item,
            tenantId,
            currentColumnValue: current[`current#${item._tag}`],
            targetColumnValue: current[`target#${item._tag}`],
            targetColumnDesc: current[`targetName#${item._tag}`],
            currentColumnDesc: current[`currentName#${item._tag}`],
          });
        }
      });
    } else {
      // 编辑
      submitDynamics.forEach(item => {
        if (!isUndefined(current[`target#${item._tag}`])) {
          submitList.push({
            ...item,
            tenantId,
            changeLineId: current.changeLineId,
            currentColumnValue: current[`current#${item._tag}`],
            targetColumnValue: current[`target#${item._tag}`],
            targetColumnDesc: current[`targetName#${item._tag}`],
            currentColumnDesc: current[`currentName#${item._tag}`],
          });
        }
      });
    }
    newList = changeOrderLines.map(item =>
      item.changeLineId === current.changeLineId
        ? {
            ...item,
            ...current,
            orderDynamicColumnList: submitList,
            _status: item._status !== 'create' ? 'update' : item._status,
          }
        : item
    );
    dispatch({
      type: 'assetStatusChange/updateState',
      payload: {
        changeOrderLines: newList,
      },
    });
    this.setState({ drawerVisible: false });
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
        type: 'assetStatusChange/fetchHeaderDetail',
        payload: {
          tenantId,
          changeHeaderId: id,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'assetStatusChange/fetchTransactionTypeLine',
            payload: {
              tenantId,
              transactionTypeId: res.content[0].transactionTypeId,
            },
          });
        }
      });
      this.handleLineSearch();
    }
  }

  @Bind()
  handleLineSearch(page = {}) {
    const { dispatch, tenantId, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'assetStatusChange/fetchLineList',
      payload: {
        tenantId,
        page,
        changeHeaderId: id,
      },
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  handleSave() {
    const { editControl } = this.state;
    const {
      dispatch,
      tenantId,
      match,
      assetStatusChange: { detail, changeOrderLines },
    } = this.props;
    const { id } = match.params;
    this.form.validateFields((err, values) => {
      if (!err) {
        const newList = [];
        changeOrderLines.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        let temp = {};
        const data = newList.map(item => {
          const {
            // changeOrderLines无用数据太多，只提取需要的数据保存
            assetId,
            processStatus,
            currentAssetStatusId,
            targetAssetStatusId,
            currentOwningPersonId,
            targetOwningPersonId,
            currentUsingPersonId,
            targetUsingPersonId,
            targetLocationId,
            currentLocationId,
            description,
            handoverTypeCode,
            changeLineId,
            orderDynamicColumnList,
            _status,
            _token,
            objectVersionNumber,
          } = item;
          temp = {
            assetId,
            tenantId,
            processStatus,
            currentAssetStatusId,
            targetAssetStatusId,
            currentOwningPersonId,
            targetOwningPersonId,
            currentUsingPersonId,
            targetUsingPersonId,
            targetLocationId,
            currentLocationId,
            description,
            handoverTypeCode,
            changeLineId,
            orderDynamicColumnList,
            _status,
            _token,
            objectVersionNumber,
          };
          if (temp && temp._status === 'create') {
            delete temp.changeLineId;
            delete temp._token;
            delete temp.objectVersionNumber;
          }
          return temp;
        });
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'assetStatusChange/addAssetStatusChange',
            payload: {
              tenantId,
              data: {
                tenantId,
                ...values,
                changeOrderLines: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/asset-status-change/detail/${res.changeHeaderId}`,
                })
              );
            }
          });
        } else {
          // 编辑
          dispatch({
            type: 'assetStatusChange/updateAssetStatusChange',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                changeOrderLines: data,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editControl: !editControl });
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 行记录删除
   * @param {object} record - 行记录
   */
  @Bind()
  handleDelete(record) {
    const {
      dispatch,
      tenantId,
      assetStatusChange: { changeOrderLines },
    } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl.get('aatn.assetStatusChange.view.message.delete').d('是否删除该处理单？'),
      onOk: () => {
        let newList = [];
        newList = changeOrderLines.filter(item => item.changeLineId !== record.changeLineId);
        if (record._status === 'create') {
          // 未保存的数据，从页面上删除
          dispatch({
            type: 'assetStatusChange/updateState',
            payload: {
              changeOrderLines: newList,
            },
          });
        } else {
          // 数据库中删除
          this.setState({ deleteFlag: true });
          const deleteRow = changeOrderLines.filter(
            item => item.changeLineId === record.changeLineId
          );
          dispatch({
            type: 'assetStatusChange/deleteAssetStatusChange',
            payload: {
              tenantId,
              data: deleteRow[0],
            },
          }).then(res => {
            if (res) {
              this.handleSearch();
              notification.success();
              dispatch({
                type: 'assetStatusChange/updateState',
                payload: {
                  changeOrderLines: newList,
                },
              });
            }
          });
        }
      },
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - assetModal中的form对象
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
      type: 'assetStatusChange/searchFullText',
      payload: {
        tenantId,
        page,
        condition,
      },
    });
  }

  /**
   * 资产移交归还单明细查询
   * @param {string} id - 资产移交归还单头Id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-status-change/detail/${id}`,
      })
    );
  }

  /**
   * 执行处理
   */
  @Bind()
  handleExecute(current) {
    const {
      tenantId,
      dispatch,
      assetStatusChange: { detail },
    } = this.props;
    const { changeHeaderId, transactionTypeId } = detail;
    dispatch({
      type: 'assetStatusChange/executeAssetStatusChange',
      payload: {
        tenantId,
        data: { changeHeaderId, transactionTypeId, ...current },
      },
    }).then(res => {
      if (res) {
        this.setState({
          lineDetail: res,
        });
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 获取动态字段
   */
  @Bind()
  handleGetFields(transferTypeRes) {
    const {
      dispatch,
      tenantId,
      assetStatusChange: { transferType = {} },
    } = this.props;
    const { basicAssetColumnList = [], trackingManagementColumnList = [] } =
      transferTypeRes || transferType;
    const tempBasicList = isNull(basicAssetColumnList) ? [] : basicAssetColumnList;
    const tempTrackList = isNull(trackingManagementColumnList) ? [] : trackingManagementColumnList;
    const tempList = [...tempBasicList, ...tempTrackList];
    const submitList = [];
    const newList = [];
    tempList.forEach(item => {
      if (item.lovType === 'Lov') {
        dispatch({
          type: 'assetStatusChange/fetchDynamicLov',
          payload: {
            viewCode: item.lovName,
          },
        }).then(res => {
          if (res) {
            newList.push({ ...item, displayField: res.displayField });
          } else {
            newList.push(item);
          }
        });
      } else if (item.lovType === 'ValueList') {
        const { valuesList } = this.state;
        dispatch({
          type: 'assetStatusChange/fetchDynamicValueList',
          payload: {
            tenantId,
            lovCode: item.lovName,
          },
        }).then(res => {
          if (res) {
            const newValueList = {
              tag: item.fieldColumn,
              lovList: res.lovCode,
            };
            this.setState({ valuesList: [...valuesList, newValueList] });
          }
        });
        newList.push(item);
      } else {
        newList.push(item);
      }
      submitList.push({
        fieldType: item.fieldType,
        currentTableName: 'aafm_asset',
        currentColumnName: item.fieldColumn,
        currentColumnValue: null,
        targetColumnType: item.lovType,
        targetColumnValue: null,
        orderTypeCode: transferType.basicTypeCode,
        _tag: item.fieldId,
      });
    });
    this.setState({
      dynamicFields: newList,
      submitDynamics: submitList,
    });
  }
  /**
   * 通过事物类型id查询动态字段
   */
  @Bind()
  handleGetFieldsByTransactionType(transactionTypeId) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetStatusChange/fetchTransactionTypeLine',
      payload: {
        tenantId,
        transactionTypeId,
      },
    }).then(res => {
      this.handleGetFields(res);
    });
  }
  /**
   * 获取动态字段的数据
   */
  @Bind()
  handleGetDynamicData(record) {
    const {
      dispatch,
      tenantId,
      match: {
        params: { id },
      },
      assetStatusChange: { transferType },
    } = this.props;
    if (!isUndefined(id)) {
      dispatch({
        type: 'assetStatusChange/fetchDynamicFields',
        payload: {
          tenantId,
          orderHeaderId: id,
          orderLineId: record.changeLineId,
          orderTypeCode: transferType.basicTypeCode,
        },
      });
    }
  }

  /**
   * 提交
   */
  @Bind()
  handleSubmit() {
    const {
      dispatch,
      tenantId,
      assetStatusChange: { detail },
    } = this.props;
    dispatch({
      type: 'assetStatusChange/submitAssetStatusChange',
      payload: {
        tenantId,
        data: detail,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 编辑
   */
  @Bind()
  handleEdit() {
    const { editControl } = this.state;
    this.setState({ editControl: !editControl });
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

  render() {
    const {
      editControl,
      showSearchFlag,
      defaultItem,
      modalVisible,
      drawerVisible,
      isMulti,
      lineDetail,
      dynamicFields,
      deleteFlag,
      valuesList,
      selectedRowKeys = [],
    } = this.state;
    const { loading, match, tenantId, assetStatusChange, dispatch } = this.props;
    const { id } = match.params;
    const isNew = !isUndefined(id);
    const {
      detail = {},
      fullList = [],
      fullPagination = {},
      linePagination = {},
      processStatusHeaderMap = [],
      processStatusLineMap = [],
      assetList = [],
      assetPagination = {},
      changeOrderLines = [],
      dynamicFieldsData = [],
    } = assetStatusChange;
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      tenantId,
      loading,
      isMulti,
      dispatch,
      editControl,
      dynamicFields,
      selectedRowKeys,
      modalVisible,
      drawerVisible,
      linePagination,
      valuesList,
      processStatusHeaderMap,
      assetList,
      assetPagination,
      changeOrderLines,
      lineDetail,
      dynamicFieldsData,
      processStatusLineMap,
      dataSource: isUndefined(id) ? defaultItem : detail,
      isNew: !isUndefined(id),
      onSelectRow: this.handleSelectRow,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onShowAssetModal: this.handleShowAssetModal,
      onSearchAsset: this.handleSearchAsset,
      onModalCancel: this.handleModalCancel,
      onAssetModalOk: this.handleAssetModalOk,
      onDrawerCancel: this.handleDrawerCancel,
      onEdit: this.handleShowDrawer,
      onDrawerOk: this.handleDrawerOk,
      onExecute: this.handleExecute,
      onDelete: this.handleDelete,
      onSearch: this.handleLineSearch,
      onGetFieldsByTransactionType: this.handleGetFieldsByTransactionType,
      key: id,
    };
    const editFlag = detail.processStatus !== 'NEW' && !isUndefined(id);
    const displayFlag = !isNew || editControl ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      !isNew || editControl || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = !isNew || editControl ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = !isNew || !editControl ? { display: 'none' } : { display: 'block' };
    const displayCommitBtn = editControl ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl
            .get(`aatn.assetStatusChange.view.message.detail.title`)
            .d('资产状态信息变更明细')}
          backPath="/aatn/asset-status-change/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            disabled={editFlag}
            loading={loading.save}
            onClick={this.handleSave}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button
            icon="select"
            style={displayCommitBtn}
            disabled={editFlag}
            loading={loading.submit}
            onClick={this.handleSubmit}
          >
            {intl.get('hzero.common.button.post').d('提交')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['asset-status-change-detail'])}>
            <Row>
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
              <Col span={isUndefined(id) ? 24 : editControl ? 23 : showSearchFlag ? 17 : 23}>
                <Spin
                  spinning={isUndefined(id) ? false : deleteFlag ? loading.delete : loading.detail}
                  wrapperClassName={classNames(
                    styles['transfer-order-detail'],
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
