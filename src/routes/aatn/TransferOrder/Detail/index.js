/**
 * TransferOrder - 调拨转移单-详细页面
 * @date: 2019-3-20
 * @author: QZQ <zhiqiang.quan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Row, Col, Spin, Modal, Icon } from 'hzero-ui';
import classname from 'classnames';
import { getCurrentOrganizationId, getDateTimeFormat, getDateFormat } from 'utils/utils';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { isEmpty, isUndefined, omit } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';
import styles from './index.less';

@connect(({ transferOrder, loading }) => ({
  transferOrder,
  queryDetailHeaderLoading: loading.effects['transferOrder/fetchTransferOrderDetail'],
  saveDetailLoading: loading.effects['transferOrder/saveDetail'],
  fullTextSearchLoading: loading.effects['transferOrder/searchFullText'],
  detailLineListLoading: loading.effects['transferOrder/fetchTransferOrderLine'],
  equipmentAssetLoading: loading.effects['transferOrder/fetchEquipmentAsset'],
  equipmentAssetDetailLoading: loading.effects['transferOrder/searchEquipmentAssetDetail'],
  tenantId: getCurrentOrganizationId(),
}))
class Detail extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editControl: false,
      showSearchFlag: true,
      dateTimeFormat: getDateTimeFormat(),
      dateFormat: getDateFormat(),
      defaultDetailItem: {
        processStatus: 'NEW',
        processStatusMeaning: '新建',
      },
      isMulti: false,
      selectedRowKeys: [],
      selectedRows: [],
      dynamicLovDisplayFieldList: [], // lov显示字段描述名
      dynamicSelectLovList: [], // 动态字段下拉列表值集数组
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match,
      tenantId,
      transferOrder: { detail, detailList },
    } = this.props;
    const { transferHeaderId } = match.params;
    const detailNew = isUndefined(transferHeaderId) ? [] : detail;
    const detailListNew = isUndefined(transferHeaderId) ? [] : detailList;
    if (!isUndefined(transferHeaderId)) {
      this.handleFullSearch('', {});
    }
    dispatch({ type: 'transferOrder/fetchLov', payload: { tenantId } });
    dispatch({
      type: 'transferOrder/updateState',
      payload: { detail: detailNew, detailList: detailListNew },
    });
  }

  /**
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 保存调拨转移单明细
   */
  @Bind()
  save() {
    const {
      dispatch,
      tenantId,
      match,
      transferOrder: { detail, detailList },
    } = this.props;
    const { dateTimeFormat, editControl } = this.state;
    const { transferHeaderId } = match.params;
    this.form.validateFields((err, values) => {
      if (isEmpty(err)) {
        const newList = [];
        detailList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        const transferOrderLines = newList.map(item =>
          item._status === 'create'
            ? omit(item, ['_status', 'processStatus', 'transferLineId'])
            : omit(item, ['_status', 'processStatus'])
        );
        if (isUndefined(transferHeaderId)) {
          // 新增
          dispatch({
            type: 'transferOrder/addTransferOrder',
            payload: {
              tenantId,
              data: {
                tenantId,
                transferOrderLines,
                ...values,
                planStartDate: moment(values.planStartDate).format(dateTimeFormat),
                planEndDate: moment(values.planEndDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/transfer-order/detail/${res.transferHeaderId}`,
                })
              );
            }
          });
        } else {
          // 修改
          dispatch({
            type: 'transferOrder/updateTransferOrder',
            payload: {
              tenantId,
              data: {
                tenantId,
                transferOrderLines,
                ...detail,
                ...values,
                processStatus: detail.processStatus,
                planStartDate: moment(values.planStartDate).format(dateTimeFormat),
                planEndDate: moment(values.planEndDate).format(dateTimeFormat),
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
   * 明细页全文检索
   * @param {string} condition - 调拨转移单id
   * @param {object} page - 分页
   */
  @Bind()
  handleFullSearch(condition = '', page = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'transferOrder/searchFullText',
      payload: {
        tenantId,
        page,
        condition,
      },
    });
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, match } = this.props;
    const { transferHeaderId } = match.params;
    if (!isUndefined(transferHeaderId)) {
      dispatch({
        type: 'transferOrder/fetchTransferOrderDetail',
        payload: {
          tenantId,
          transferHeaderId,
        },
      }).then(res => {
        if (res) {
          this.fetchTransactionTypeLine(res.transactionTypeId);
        }
      });
      dispatch({
        type: 'transferOrder/fetchTransferOrderLine',
        payload: {
          tenantId,
          transferHeaderId,
        },
      });
    }
  }

  /**
   * 查询事务处理行
   */
  @Bind()
  fetchTransactionTypeLine(transactionTypeId) {
    const { tenantId, dispatch } = this.props;
    if (transactionTypeId) {
      dispatch({
        type: 'transferOrder/fetchTransactionTypeLine',
        payload: {
          tenantId,
          transactionTypeId,
        },
      }).then(r => {
        r.forEach(item => {
          if (item.lovType === `Lov` || item.lovType === `ValueList`) {
            this.selectLovDisplayField(item.lovName, item.lovType);
          }
        });
      });
    }
  }

  /**
   * 查询Lov的显示描述值 dynamicLovDisplayFieldList
   */
  @Bind()
  selectLovDisplayField(lovCode, lovType) {
    const { dispatch, tenantId } = this.props;
    // 如果为列表值集，查询所有数据保存在dynamicSelectLovList中
    if (lovType === `ValueList`) {
      dispatch({
        type: 'transferOrder/fetchDynamicValueListLov',
        payload: { lovCode, tenantId },
      }).then(res => {
        if (res) {
          const { dynamicSelectLovList = [] } = this.state;
          const newValueList = {
            lovCode,
            lovList: res.lovCode,
          };
          this.setState({ dynamicSelectLovList: [...dynamicSelectLovList, newValueList] });
        }
      });
    } else {
      // 查询Lov的显示字段名等信息
      dispatch({
        type: 'transferOrder/fetchDynamicLov',
        payload: {
          viewCode: lovCode,
        },
      }).then(res => {
        if (res) {
          const { dynamicLovDisplayFieldList = [] } = this.state;
          const currentLovList = dynamicLovDisplayFieldList.filter(
            item => item.lovCode !== res.lovCode
          );
          this.setState({ dynamicLovDisplayFieldList: [...currentLovList, res] });
        }
      });
    }
  }

  /**
   * 行记录删除
   * @param {object} record - 行记录
   */
  @Bind()
  handleDelete(record) {
    const {
      dispatch,
      transferOrder: { detailList },
    } = this.props;
    Modal.confirm({
      iconType: '',
      content: intl.get('aatn.transferOrder.view.message.delete').d('是否删除该处理单？'),
      onOk: () => {
        let newList = [];
        newList = detailList.filter(item => item.transferLineId !== record.transferLineId);
        if (record._status === 'create') {
          // 未保存的数据，从页面上删除
          dispatch({
            type: 'transferOrder/updateState',
            payload: {
              detailList: newList,
            },
          });
        }
      },
    });
  }

  /**
   * @param {string} id - 调拨转移单id
   */
  @Bind()
  handleGotoDetail(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/aatn/transfer-order/detail/${id}`,
      })
    );
  }

  /**
   * 设备资产列表查询
   */
  @Bind()
  handleSearchAsset(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let fromValue = {};
    if (!isUndefined(this.form)) {
      fromValue = this.form.getFieldValue('assetDesc');
    }
    dispatch({
      type: 'transferOrder/fetchEquipmentAsset',
      payload: {
        tenantId,
        condition: fromValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 调拨单提交审批
   */
  @Bind()
  handleTransferOrderSubmit() {
    const {
      match,
      dispatch,
      tenantId,
      transferOrder: { detail, detailList },
    } = this.props;
    const { dateTimeFormat } = this.state;
    const { transferHeaderId } = match.params;
    this.form.validateFields((err, values) => {
      if (isEmpty(err)) {
        const newList = [];
        detailList.forEach(item => {
          if (['create', 'update'].includes(item._status)) {
            newList.push(item);
          }
        });
        const transferOrderLines = newList.map(item =>
          item._status === 'create'
            ? omit(item, ['_status', 'processStatus', 'transferLineId'])
            : omit(item, ['_status', 'processStatus'])
        );
        if (isUndefined(transferHeaderId)) {
          // 新增
          dispatch({
            type: 'transferOrder/addTransferOrder',
            payload: {
              tenantId,
              data: {
                tenantId,
                transferOrderLines,
                ...values,
                planStartDate: moment(values.planStartDate).format(dateTimeFormat),
                planEndDate: moment(values.planEndDate).format(dateTimeFormat),
              },
            },
          }).then(res => {
            if (res) {
              dispatch({
                type: 'transferOrder/commitTransferOrder',
                payload: {
                  tenantId,
                  data: res,
                },
              }).then(r => {
                if (r) {
                  notification.success();
                  dispatch(
                    routerRedux.push({
                      pathname: `/aatn/transfer-order/detail/${r.transferHeaderId}`,
                    })
                  );
                }
              });
            }
          });
        } else {
          dispatch({
            type: 'transferOrder/commitTransferOrder',
            payload: {
              tenantId,
              data: detail,
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleSearch();
              this.handleFullSearch();
            }
          });
        }
      }
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
    this.setState({ modalVisible: false, selectedRowKeys: [], selectedRows: [] });
  }

  /**
   * 设备资产模态框确认操作
   */
  @Bind()
  handleAssetModalOk() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      tenantId,
      transferOrder: { detailList, transferTypeList },
    } = this.props;
    const { targetAssetStatusId, targetAssetStatusName } = transferTypeList;
    let newSelectedRows = [];
    if (!isEmpty(selectedRows)) {
      newSelectedRows = selectedRows.map(item => {
        const {
          assetId,
          name,
          assetDesc,
          assetStatusId,
          owningOrgId,
          owningOrgIdName,
          costCenterCode,
        } = item;
        return {
          tenantId,
          assetId,
          name,
          assetDesc,
          processStatus: 'NEW',
          processStatusMeaning: '新建',
          currentCostCenter: costCenterCode,
          currentAssetStatusId: assetStatusId,
          currentOwningOrg: owningOrgId,
          currentOwningOrgMeaning: owningOrgIdName,
          targetAssetStatusId,
          targetAssetStatusName,
          transferLineId: uuidv4(),
          _status: 'create',
        };
      });
    }
    dispatch({
      type: 'transferOrder/updateState',
      payload: {
        detailList: [...detailList, ...newSelectedRows],
      },
    });
    this.setState({ modalVisible: false, selectedRowKeys: [], selectedRows: [] });
  }

  /**
   * 滑窗的确认操作
   * @param {object} current 当前编辑的行记录
   */
  @Bind()
  handleDrawerOk(current = {}) {
    const {
      dispatch,
      tenantId,
      transferOrder: { detailList, transferTypeList },
    } = this.props;
    const { dateFormat } = this.state;
    const targetItem = {
      currentAssetStatusId: current.assetStatusId,
      currentAssetStatusName: current.sysStatusName,
      currentOwningOrg: current.owningOrgId,
      currentOwningOrgName: current.owningOrgIdName,
      currentCostCenter: current.currentCostCenter,
      targetAssetStatusId: current.targetAssetStatusId,
      targetAssetStatusName: current.targetAssetStatusName,
      targetOwningOrg: current.targetOwningOrg,
      targetOwningOrgName: current.targetOwningOrgName,
      targetCostCenter: current.targetCostCenter,
      description: current.description,
    };
    // 遍历动态字段
    const objectSymbols = Object.getOwnPropertyNames(current);
    let orderDynamicColumnList = [];
    let dynamicList = [];
    const attributeList = [];
    objectSymbols.forEach(i => {
      if (i.includes('target#')) {
        const dynamicId = i.split('target#')[1];
        let currentDynamicValue = current[`current#${dynamicId}`];
        let targetDynamicValue = current[`target#${dynamicId}`];
        transferTypeList.forEach(item => {
          if (item.fieldId === Number.parseInt(dynamicId, 10)) {
            currentDynamicValue =
              item.lovType === 'DatePicker'
                ? moment(currentDynamicValue).format(dateFormat)
                : currentDynamicValue;
            targetDynamicValue =
              item.lovType === 'DatePicker'
                ? moment(targetDynamicValue).format(dateFormat)
                : targetDynamicValue;
            const attribute = {
              orderTypeCode: 'TRANSFER',
              currentTableName: item.descSource,
              currentColumnName: item.fieldColumn,
              currentColumnValue: currentDynamicValue,
              currentColumnDesc: current[`currentName#${dynamicId}`],
              targetColumnType: item.lovType,
              targetColumnValue: targetDynamicValue,
              targetColumnDesc: current[`targetName#${dynamicId}`],
              tenantId,
            };
            attributeList.push(attribute);
          }
        });
        orderDynamicColumnList = [...attributeList];
      }
      dynamicList = detailList.map(item => {
        let newItem = {};
        if (item.transferLineId === current.transferLineId) {
          newItem = { ...item, [i]: current[i] };
        } else {
          newItem = item;
        }
        return newItem;
      });
    });
    let newList = [];
    if (current._status === 'create') {
      newList = dynamicList.map(item =>
        item.transferLineId === current.transferLineId
          ? { ...item, ...targetItem, orderDynamicColumnList }
          : item
      );
    } else {
      newList = dynamicList.map(item =>
        item.transferLineId === current.transferLineId
          ? {
              ...item,
              ...targetItem,
              _status: 'update',
              orderDynamicColumnList,
            }
          : item
      );
    }
    dispatch({
      type: 'transferOrder/updateState',
      payload: {
        detailList: newList,
      },
    });
  }

  /**
   * 数据行选中操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  /**
   * 调入/调出
   */
  @Bind()
  handleChangeLineStatus(current = {}) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'transferOrder/confirmTransferOrderLine',
      payload: {
        tenantId,
        data: { tenantId, ...current },
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
      queryDetailHeaderLoading,
      saveDetailLoading,
      fullTextSearchLoading,
      detailLineListLoading,
      equipmentAssetLoading,
      equipmentAssetDetailLoading,
      match,
      dispatch,
      tenantId,
      transferOrder,
    } = this.props;
    const {
      editControl,
      showSearchFlag,
      defaultDetailItem,
      modalVisible,
      isMulti,
      selectedRowKeys,
      dynamicLovDisplayFieldList,
      dynamicSelectLovList,
    } = this.state;
    const {
      detail,
      fullList,
      fullPagination,
      detailList,
      detailPagination,
      assetDetail,
      assetList,
      assetPagination,
      transferTypeList,
      transactionTypeList,
      fieldTypeMap,
      approveStatus = [],
    } = transferOrder;
    const { transferHeaderId } = match.params;
    const isNew = isUndefined(transferHeaderId);
    const editFlag = detail.processStatus !== 'NEW' && !isNew;
    const detailFormProps = {
      dispatch,
      tenantId,
      approveStatus,
      modalVisible,
      assetDetail,
      assetList,
      assetPagination,
      isNew,
      isMulti,
      editControl,
      selectedRowKeys,
      transferTypeList,
      transactionTypeList,
      dynamicLovDisplayFieldList,
      dynamicSelectLovList,
      fieldTypeMap,
      detailLoading: queryDetailHeaderLoading,
      loading: detailLineListLoading,
      equipmentAssetDetailLoading,
      equipmentAssetLoading,
      detail: isUndefined(transferHeaderId) ? defaultDetailItem : detail,
      dataSource: detailList,
      pagination: detailPagination,
      key: transferHeaderId,
      onRef: this.handleBindRef,
      onDelete: this.handleDelete,
      onRefresh: this.handleSearch,
      onDrawerOk: this.handleDrawerOk,
      onDrawerEdit: this.handleDrawerEdit,
      onSearchAsset: this.handleSearchAsset,
      onAssetModalOk: this.handleAssetModalOk,
      onSelectRow: this.handleSelectRow,
      onAddDetailLine: this.handleShowAssetModal,
      onModalCancel: this.handleModalCancel,
      onSearchTransactionTypeLine: this.fetchTransactionTypeLine,
      onChangeLineStatus: this.handleChangeLineStatus,
    };
    const fullTextSearchProps = {
      loading: fullTextSearchLoading,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const displayFlag = isNew || editControl ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      isNew || editControl || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editControl ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editControl ? { display: 'none' } : { display: 'block' };
    const displayCommitBtn = editControl ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get('aatn.transferOrder.view.message.detail').d('调拨转移单明细')}
          backPath="/aatn/transfer-order"
        >
          <Button
            disabled={editFlag}
            style={displayFlagBtn}
            loading={saveDetailLoading}
            icon="save"
            type="primary"
            onClick={this.save}
          >
            {intl.get(`hero.common.button.save`).d('保存')}
          </Button>
          <Button
            icon="select"
            disabled={editFlag}
            style={displayCommitBtn}
            // loading={loading.submit}
            onClick={this.handleTransferOrderSubmit}
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
          <div className={classname(styles['transfer-order-detail'])}>
            <Row>
              <Col style={displayFullFlag} span={isUndefined(transferHeaderId) ? 0 : 6}>
                <FullTextSearch {...fullTextSearchProps} />
              </Col>
              <Col style={displayFlag} span={isUndefined(transferHeaderId) ? 0 : 1}>
                <Icon
                  type={showSearchFlag ? 'menu-fold' : 'menu-unfold'}
                  onClick={this.setShowSearchFlag}
                  style={{ fontSize: 18, padding: 10, border: 0, cursor: 'pointer' }}
                >
                  {intl.get(`hero.common.click.menu`).d('')}
                </Icon>
              </Col>
              <Col
                span={
                  isUndefined(transferHeaderId) ? 24 : editControl ? 23 : showSearchFlag ? 17 : 23
                }
              >
                <Spin
                  spinning={isUndefined(transferHeaderId) ? false : queryDetailHeaderLoading}
                  wrapperClassName={classname(
                    styles['transfer-order-detail'],
                    DETAIL_DEFAULT_CLASSNAME
                  )}
                >
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
