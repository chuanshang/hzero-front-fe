/**
 * 资产报废单 创建/编辑 明细
 * @date: 2019-3-21
 * @author: ZZS <zhisheng.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Button, Spin, Row, Col, Form, Select, Icon } from 'hzero-ui';
import Lov from 'components/Lov';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { DETAIL_DEFAULT_CLASSNAME } from 'utils/constants';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import { isUndefined, isEmpty, omit } from 'lodash';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getDateTimeFormat, getDateFormat } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import uuidv4 from 'uuid/v4';
import { getComponentType, getComponentProps } from './util';

import styles from './index.less';
import FullTextSearch from './FullTextSearch';
import InfoExhibit from './InfoExhibit';

@connect(({ assetScrap, loading }) => ({
  assetScrap,
  loading: {
    equipmentAsset: loading.effects['assetScrap/fetchEquipmentAsset'],
    detailLineListLoading: loading.effects['assetScrap/updateState'],
    assetStatusLoading: loading.effects['assetScrap/fetchAssetStatus'],
    save:
      loading.effects['assetScrap/addAssetScrap'] || loading.effects['assetScrap/updateAssetScrap'],
    submit: loading.effects['assetScrap/submitApprovalRequest'],
    detail:
      loading.effects['assetScrap/detailAssetScrap'] ||
      loading.effects['assetScrap/fetchDynamicValueListLov'] ||
      loading.effects['assetScrap/selectTransationTypeField'],
    fullTextSearch: loading.effects['assetScrap/fullTextSearch'],
  },
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['aatn.common', 'aatn.assetScrap'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      showSearchFlag: true,
      isMulti: false,
      modalVisible: false,
      drawerVisible: false,
      scrapNumRequired: false,
      lineDetail: {}, // 侧滑框当前行记录record
      selectedRows: [],
      defaultItem: {},
      allAssetList: [], // 行涉及到所有资产的汇总
      dynamicColumnList: [], // 动态字段数组
      dynamicLovDisplayFieldList: [], // lov显示字段描述名
      dynamicSelectLovList: [], // 动态字段下拉列表值集数组
    };
  }

  componentDidMount() {
    const { tenantId, match } = this.props;
    const { id } = match.params;
    if (!isUndefined(id)) {
      // 详细界面，查询数据
      this.handleFullSearch('', { size: 10, page: 0 });
    }
    this.searchAssetStatusDiscardId();
    this.props.dispatch({ type: 'assetScrap/fetchProcessStatusLov', payload: { tenantId } });
    this.props.dispatch({
      type: 'assetScrap/fetchScrapLineProcessStatusLov',
      payload: { tenantId },
    });
    this.props.dispatch({ type: 'assetScrap/fetchDynamicFieldLov', payload: { tenantId } });
    this.props.dispatch({ type: 'assetScrap/fetchDisposeTypeLov', payload: { tenantId } });
    this.props.dispatch({ type: 'assetScrap/fetchScrapTypeLov', payload: { tenantId } });
  }

  /**
   * 动态生成字段HTML
   * transationTypeFieldList 动态字段数组
   * 当前行资产数据currentAssetList
   */
  @Bind()
  dynamicGetHtml(form, assetId, scrapLineId) {
    const {
      tenantId,
      match,
      assetScrap: { transationTypeFieldList = [], lineList = [] },
    } = this.props;
    const { getFieldDecorator, registerField, setFieldsValue } = form;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const {
      allAssetList = [],
      dynamicColumnList = [],
      dynamicSelectLovList = [],
      dynamicLovDisplayFieldList = [],
      editFlag,
    } = this.state;
    const { id } = match.params;
    const isNew = isUndefined(id);
    const renderTemplates = [];
    // 取出当前行
    const currentList = lineList.filter(item => item.scrapLineId === scrapLineId)[0];
    // 当前资产ID对应的资产数据
    const currentAssetList = allAssetList.filter(item => item.assetId === assetId)[0] || [];
    // 如果动态字段数组不为空，则取出当前行的动态字段
    const currentDynamicColumns =
      isUndefined(currentList.orderDynamicColumnList) || isEmpty(currentList.orderDynamicColumnList)
        ? dynamicColumnList.filter(item => item.orderLineId === scrapLineId)
        : currentList.orderDynamicColumnList;
    // 循环配置动态字段
    transationTypeFieldList.forEach(item => {
      // 查询当前值对应的独立值集
      const currentSelectList =
        item.lovType === `ValueList` && !isEmpty(dynamicSelectLovList)
          ? dynamicSelectLovList.filter(seleectItem => seleectItem.lovCode === item.lovName)[0]
              .lovList
          : [];
      // 获取组件类型，若存在Lov则获取其Code
      const field = {
        lovCode: item.lovName,
        componentType: item.lovType === 'BOOLEAN' ? 'Switch' : item.lovType,
        fieldCode: 'fieldColumn',
      };
      const componentType = getComponentType(field);
      const componentProps = getComponentProps({ field, componentType: field.componentType });
      const currentProps = {
        disabled: true,
      };
      const targetProps = {
        disabled:
          (!isUndefined(currentList.processStatus) &&
            !isEmpty(currentList.processStatus) &&
            currentList.processStatus !== 'NEW') ||
          item.fieldType === 'READ_ONLY' ||
          item.fieldType === 'CLEAN',
      };
      const datePickerProps =
        item.lovType === 'DatePicker'
          ? {
              format: getDateFormat(),
            }
          : {};
      // 动态字段赋值
      let initValueCurrent = '';
      let currentLovDisplay = '';
      let initValueTarget = '';
      let targetLovDisplay = '';
      // 获取已经保存的动态字段值
      currentDynamicColumns.forEach(i => {
        if (i.currentColumnName === item.fieldColumn) {
          if (item.lovType === 'DatePicker') {
            initValueCurrent =
              isUndefined(i.currentColumnValue) || isEmpty(i.currentColumnValue)
                ? ''
                : moment(i.currentColumnValue, getDateFormat());
            initValueTarget =
              isUndefined(i.targetColumnValue) || isEmpty(i.targetColumnValue)
                ? ''
                : moment(i.targetColumnValue, getDateFormat());
          } else {
            initValueCurrent = i.currentColumnValue;
            initValueTarget = i.targetColumnValue;
          }
          if (item.lovType === 'Lov') {
            currentLovDisplay = i.currentColumnDesc;
            targetLovDisplay = i.targetColumnDesc;
          }
        }
      });
      // 如果没有已经保存的值，则赋初始值
      // 当前初始值
      initValueCurrent =
        initValueCurrent ||
        (item.lovType === 'DatePicker'
          ? isUndefined(currentAssetList[this.toCamelCaseVar(item.fieldColumn)]) ||
            isEmpty(currentAssetList[this.toCamelCaseVar(item.fieldColumn)])
            ? ''
            : moment(currentAssetList[this.toCamelCaseVar(item.fieldColumn)], getDateFormat())
          : currentAssetList[this.toCamelCaseVar(item.fieldColumn)]) ||
        '';
      // 当前lov显示值
      currentLovDisplay = currentLovDisplay || currentAssetList[this.toCamelCaseVar(item.descCode)];
      // 目标初始值
      initValueTarget = initValueTarget || (item.fieldType === 'CLEAN' ? '' : initValueCurrent);
      // 目标 lov 显示值
      targetLovDisplay = targetLovDisplay || (item.fieldType === 'CLEAN' ? '' : currentLovDisplay);
      // 绘制动态字段
      let template = '';
      if (isNew || editFlag) {
        template =
          item.fieldType === 'READ_ONLY' ? (
            <Form.Item label={`${item.fieldColumnMeaning}`} {...formLayout}>
              {getFieldDecorator(`current#${item.fieldId}`, {
                initialValue: initValueCurrent,
              })(
                item.lovType === 'Lov' ? (
                  <Lov disabled textValue={currentLovDisplay} />
                ) : (
                  React.createElement(
                    componentType,
                    Object.assign({}, { ...componentProps, ...currentProps, ...datePickerProps })
                  )
                )
              )}
              {item.lovType === 'Lov'
                ? getFieldDecorator(`currentName#${item.fieldId}`, {
                    initialValue: currentLovDisplay,
                  })
                : null}
            </Form.Item>
          ) : (
            <React.Fragment>
              <Form.Item label={`当前${item.fieldColumnMeaning}`} {...formLayout}>
                {getFieldDecorator(`current#${item.fieldId}`, {
                  initialValue: initValueCurrent,
                })(
                  item.lovType === 'ValueList' ? (
                    <Select disabled>
                      {currentSelectList.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  ) : item.lovType === 'Lov' ? (
                    <Lov disabled textValue={currentLovDisplay} />
                  ) : (
                    React.createElement(
                      componentType,
                      Object.assign({}, { ...componentProps, ...currentProps, ...datePickerProps })
                    )
                  )
                )}
                {item.lovType === 'Lov'
                  ? getFieldDecorator(`currentName#${item.fieldId}`, {
                      initialValue: currentLovDisplay,
                    })
                  : null}
              </Form.Item>
              <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
                {getFieldDecorator(`target#${item.fieldId}`, {
                  initialValue: initValueTarget,
                  rules:
                    item.fieldType === 'MUST_MODIFY'
                      ? [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl
                                .get(`aatn.assetScrap.model.assetScrap.target#${item.fieldId}`)
                                .d(`目标${item.fieldColumnMeaning}`),
                            }),
                          },
                        ]
                      : [],
                })(
                  item.lovType === 'ValueList' ? (
                    <Select {...targetProps}>
                      {currentSelectList.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  ) : item.lovType === 'Lov' ? (
                    <Lov
                      disabled={item.fieldType === `CLEAN`}
                      code={item.lovName}
                      onChange={(_, record) => {
                        // 获取当前Lov对应的display值
                        const currentLov = dynamicLovDisplayFieldList.filter(
                          fieldItem => fieldItem.lovCode === item.lovName
                        )[0];
                        registerField(`targetName#${item.fieldId}`);
                        setFieldsValue({
                          [`targetName#${item.fieldId}`]: record[currentLov.displayField],
                        });
                      }}
                      textValue={targetLovDisplay}
                      queryParams={{ tenantId }}
                    />
                  ) : (
                    React.createElement(
                      componentType,
                      Object.assign(
                        {},
                        {
                          ...componentProps,
                          ...targetProps,
                          ...datePickerProps,
                        }
                      )
                    )
                  )
                )}
                {item.lovType === 'Lov'
                  ? getFieldDecorator(`targetName#${item.fieldId}`, {
                      initialValue: targetLovDisplay,
                    })
                  : null}
              </Form.Item>
            </React.Fragment>
          );
      } else {
        template =
          item.fieldType === 'READ_ONLY' ? (
            <React.Fragment>
              <Form.Item label={item.fieldColumnMeaning} {...formLayout}>
                <span>
                  {item.lovType === 'Lov'
                    ? currentLovDisplay
                    : item.lovType === 'BOOLEAN'
                    ? yesOrNoRender(initValueCurrent)
                    : item.lovType === 'DatePicker'
                    ? dateRender(initValueCurrent)
                    : initValueCurrent || ''}
                </span>
              </Form.Item>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Form.Item label={`当前${item.fieldColumnMeaning}`} {...formLayout}>
                <span>
                  {item.lovType === 'Lov'
                    ? currentLovDisplay
                    : item.lovType === 'BOOLEAN'
                    ? yesOrNoRender(initValueCurrent)
                    : item.lovType === 'DatePicker'
                    ? dateRender(initValueCurrent)
                    : initValueCurrent || ''}
                </span>
              </Form.Item>
              <Form.Item label={`目标${item.fieldColumnMeaning}`} {...formLayout}>
                <span>
                  {item.lovType === 'Lov'
                    ? targetLovDisplay
                    : item.lovType === 'BOOLEAN'
                    ? yesOrNoRender(initValueTarget)
                    : item.lovType === 'DatePicker'
                    ? dateRender(initValueTarget)
                    : initValueTarget || ''}
                </span>
              </Form.Item>
            </React.Fragment>
          );
      }

      renderTemplates.push(template);
    });
    return renderTemplates;
  }

  /**
   * 行编辑侧滑滑窗的确认操作
   * @param {object} current 当前编辑的行记录
   */
  @Bind()
  handleDrawerOk(current = {}) {
    const {
      tenantId,
      dispatch,
      assetScrap: { lineList = [], transationTypeFieldList = [] },
    } = this.props;
    let newList = [];
    // 在新建的时候处理数据,取出其中的动态字段
    const orderDynamicColumnList = [];
    transationTypeFieldList.forEach(fieldItem => {
      if (
        fieldItem.fieldType !== `READ_ONLY` &&
        !isUndefined(current[`target#${fieldItem.fieldId}`])
      ) {
        const currentColumnValue =
          fieldItem.lovType === 'DatePicker'
            ? dateRender(current[`current#${fieldItem.fieldId}`])
            : current[`current#${fieldItem.fieldId}`];
        const targetColumnValue =
          fieldItem.lovType === 'DatePicker'
            ? dateRender(current[`target#${fieldItem.fieldId}`])
            : current[`target#${fieldItem.fieldId}`];
        const targetColumnDesc =
          fieldItem.lovType === 'DatePicker'
            ? dateRender(current[`targetName#${fieldItem.fieldId}`])
            : current[`targetName#${fieldItem.fieldId}`];
        const currentColumnDesc =
          fieldItem.lovType === 'DatePicker'
            ? dateRender(current[`currentName#${fieldItem.fieldId}`])
            : current[`currentName#${fieldItem.fieldId}`];
        const orderDynamicColumn = {
          tenantId,
          orderTypeCode: `SCRAP`,
          currentTableName: 'aafm_asset',
          fieldType: fieldItem.fieldType,
          targetColumnType: fieldItem.lovType,
          currentColumnName: fieldItem.fieldColumn,
          currentColumnValue,
          currentColumnDesc,
          targetColumnValue,
          targetColumnDesc,
        };
        orderDynamicColumnList.push(orderDynamicColumn);
      }
    });
    const currentVale = { ...current, orderDynamicColumnList };
    if (currentVale._status === 'create') {
      newList = lineList.map(item =>
        item.scrapLineId === currentVale.scrapLineId ? { ...item, ...currentVale } : item
      );
    } else {
      newList = lineList.map(item =>
        item.scrapLineId === currentVale.scrapLineId
          ? { ...item, ...currentVale, _status: 'update' }
          : item
      );
    }
    dispatch({
      type: 'assetScrap/updateState',
      payload: {
        lineList: newList,
      },
    });
    this.setState({ drawerVisible: false });
  }

  /**
   * 下划线转驼峰
   */
  @Bind()
  toCamelCaseVar(variable) {
    return variable.replace(/_+[a-zA-Z]/g, (str, index) =>
      index ? str.substr(-1).toUpperCase() : str
    );
  }

  /**
   * 重新查询详情界面数据
   */
  @Bind()
  handleSearch() {
    const { tenantId, match, dispatch } = this.props;
    const { id } = match.params;
    // 清空state数据
    this.setState({
      modalVisible: false,
      drawerVisible: false,
      lineDetail: {}, // 侧滑框当前行记录record
      selectedRows: [],
      defaultItem: {},
      allAssetList: [], // 行涉及到所有资产的汇总
      dynamicColumnList: [], // 动态字段数组
      dynamicLovDisplayFieldList: [], // lov显示字段描述名
      dynamicSelectLovList: [],
    });
    if (!isUndefined(id)) {
      dispatch({
        type: 'assetScrap/detailAssetScrap',
        payload: {
          tenantId,
          scrapOrderHeaderId: id,
        },
      }).then(res => {
        if (res) {
          this.searchTransationTypeField(res.transactionTypeId);
          res.scrapOrderLines.forEach(element => {
            // 查询资产
            this.handleSearchAssetById({ assetId: element.assetId }, {});
            // 查询已经保存的动态字段
            this.searchDynamicColumn({
              orderLineId: element.scrapLineId,
              orderHeaderId: id,
              orderTypeCode: `SCRAP`,
            });
          });
        }
      });
    }
  }

  /**
   * 查询事件类型的动态字段
   */
  @Bind()
  searchTransationTypeField(transactionTypeId) {
    const { tenantId, dispatch } = this.props;
    dispatch({
      type: 'assetScrap/selectTransationTypeField',
      payload: {
        tenantId,
        transactionTypeId,
      },
    }).then(res => {
      res.forEach(item => {
        if (item.lovType === `Lov` || item.lovType === `ValueList`) {
          this.selectLovDisplayField(item.lovName, item.lovType);
        }
      });
    });
  }

  /**
   * 查询Lov的显示描述值 dynamicLovDisplayFieldList
   */
  @Bind()
  selectLovDisplayField(lovCode, lovType) {
    const { dispatch, tenantId } = this.props;
    const { dynamicLovDisplayFieldList = [] } = this.state;

    // 如果为列表值集，查询所有数据保存在dynamicSelectLovList中
    if (lovType === `ValueList`) {
      dispatch({
        type: 'assetScrap/fetchDynamicValueListLov',
        payload: { lovCode, tenantId },
      }).then(res => {
        const { dynamicSelectLovList = [] } = this.state;
        const newValueList = {
          lovCode,
          lovList: res.lovCode,
        };
        this.setState({ dynamicSelectLovList: [...dynamicSelectLovList, newValueList] });
      });
    } else {
      // 查询Lov的显示字段名等信息
      dispatch({
        type: 'assetScrap/fetchDynamicLov',
        payload: {
          viewCode: lovCode,
        },
      }).then(res => {
        const currentLovList = dynamicLovDisplayFieldList.filter(
          item => item.lovCode !== res.lovCode
        );
        this.setState({ dynamicLovDisplayFieldList: [...currentLovList, res] });
      });
    }
  }

  /**
   * 查询已经保存的动态字段
   */
  @Bind()
  searchDynamicColumn(params = {}, fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { dynamicColumnList } = this.state;
    dispatch({
      type: 'assetScrap/fetchDynamicColumn',
      payload: {
        tenantId,
        ...params,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({ dynamicColumnList: [...dynamicColumnList, ...res] });
      }
    });
  }

  /**
   * 通过Id查询资产
   */
  @Bind()
  handleSearchAssetById(params = {}, fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetDesc } = fields;
    const { allAssetList } = this.state;
    dispatch({
      type: 'assetScrap/fetchEquipmentAssetByParam',
      payload: {
        tenantId,
        ...params,
        assetDesc,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        // 将资产的数据累计入allAssetList中
        this.setState({ allAssetList: [...allAssetList, ...res] });
      }
    });
  }

  /**
   * LOv查询事务处理类型时查询对应动态字段
   */
  @Bind()
  selectTransationTypeField(_, record) {
    this.searchTransationTypeField(record.transactionTypeId);
    if (isEmpty(record.codeRule)) {
      this.setState({ scrapNumRequired: true });
    } else {
      this.setState({ scrapNumRequired: false });
    }
  }

  /**
   * 查询资产状态为报废的id
   */
  @Bind()
  searchAssetStatusDiscardId() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'assetScrap/fetchAssetStatus',
      payload: {
        tenantId,
        assetStatusCode: 'DISCARD',
      },
    });
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
    dispatch({
      type: 'assetScrap/fullTextSearch',
      payload: {
        tenantId,
        page,
        content: condition,
      },
    });
  }

  /**
   * 设备资产列表查询
   */
  @Bind()
  handleSearchAsset(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { assetDesc } = fields;
    const { allAssetList } = this.state;
    dispatch({
      type: 'assetScrap/fetchEquipmentAsset',
      payload: {
        tenantId,
        assetDesc,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        // 将资产的数据累计入allAssetList中
        this.setState({ allAssetList: [...allAssetList, ...res] });
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
   * 关闭设备资产模态框
   */
  @Bind()
  handleModalCancel() {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
    });
  }

  /**
   * 关闭模态框,行编辑侧滑窗
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false });
  }

  /**
   * 弹出行明细编辑侧滑窗
   * @param {object} record 行记录
   */
  @Bind()
  handleShowDrawer(record) {
    this.setState({ lineDetail: record });
    this.setState({ drawerVisible: true });
  }

  /**
   * 报废单报废确认
   */
  @Bind()
  handDrawerConfirm(current = {}) {
    const { dispatch, tenantId } = this.props;
    this.handleDrawerOk(current);
    dispatch({
      type: 'assetScrap/confirmAssetScrapLine',
      payload: {
        tenantId,
        data: {
          ...current,
          capitalizationDate: moment(current.capitalizationDate).format(getDateTimeFormat()),
        },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  /**
   * 行编辑侧划窗删除
   */
  @Bind()
  handleDrawerDelete(newList) {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetScrap/updateState',
      payload: {
        lineList: newList,
      },
    });
    this.setState({ drawerVisible: false });
  }

  /**
   * 调用接口来删除
   */
  @Bind()
  handDeleteFromDB(dataSource, currentLineId) {
    const { dispatch, tenantId } = this.props;
    const currentLine = dataSource.filter(item => item.scrapLineId === currentLineId)[0];
    const newList = dataSource.filter(item => item.scrapLineId !== currentLineId);
    dispatch({
      type: 'assetScrap/deleteAssetScrap',
      payload: {
        tenantId,
        data: {
          tenantId,
          ...currentLine,
          capitalizationDate: moment(currentLine.capitalizationDate).format(getDateTimeFormat()),
        },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleDrawerDelete(newList);
      }
    });
  }

  /**
   * 设备资产模态框确认操作,查询窗口
   */
  @Bind()
  handleAssetModalOk() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      assetScrap: { lineList = [], assetStatusList },
    } = this.props;
    let newSelectedRows = [];
    if (!isEmpty(selectedRows)) {
      newSelectedRows = selectedRows.map(item => {
        const {
          assetId,
          name,
          lineNum,
          assetDesc,
          assetStatus,
          assetStatusId,
          sysStatusName,
          assetLocationId,
          assetLocationName,
          originalCost,
        } = item;
        return {
          assetId,
          assetName: name,
          lineNum,
          assetDesc,
          assetStatus,
          originalCost,
          scrapLineId: uuidv4(),
          _status: 'create',
          currentAssetStatusId: assetStatusId,
          currentAssetStatus: sysStatusName,
          currentLocationId: assetLocationId,
          currentLocationName: assetLocationName,
          targetAssetStatus: assetStatusList[0].sysStatusName,
          targetAssetStatusId: assetStatusList[0].assetStatusId,
        };
      });
    }
    dispatch({
      type: 'assetScrap/updateState',
      payload: {
        lineList: [...lineList, ...newSelectedRows],
      },
    });
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
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
   * 提交审批
   */
  @Bind()
  handleSubmitAssetScrap() {
    const {
      dispatch,
      tenantId,
      match,
      assetScrap: { detail = [], lineList = [] },
    } = this.props;
    const { id } = match.params;
    if (isUndefined(id)) {
      // 新建界面
      const scrapOrderLines = lineList.map(item => {
        const lineValue = {
          ...item,
          capitalizationDate: moment(item.capitalizationDate).format(getDateTimeFormat()),
        };
        return lineValue._status === 'create'
          ? omit(lineValue, ['_status', 'scrapLineId'])
          : omit(lineValue, ['_status']);
      });
      this.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'assetScrap/submitApprovalRequest',
            payload: {
              tenantId,
              data: {
                ...values,
                tenantId,
                scrapOrderLines,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/asset-scrap/detail/${res.scrapHeaderId}`,
                })
              );
            }
          });
        }
      });
    } else {
      dispatch({
        type: 'assetScrap/submitApprovalRequest',
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
  }

  /**
   * 新增/更新数据
   */
  @Bind()
  handleAssetScrap() {
    const {
      dispatch,
      tenantId,
      match,
      assetScrap: { detail, lineList = [] },
    } = this.props;
    const { id } = match.params;
    const scrapOrderLines = lineList.map(item => {
      const lineValue = {
        ...item,
        capitalizationDate: moment(item.capitalizationDate).format(getDateTimeFormat()),
      };
      return lineValue._status === 'create'
        ? omit(lineValue, ['_status', 'scrapLineId'])
        : omit(lineValue, ['_status']);
    });
    this.form.validateFields((err, values) => {
      if (!err) {
        if (isUndefined(id)) {
          // 新增
          dispatch({
            type: 'assetScrap/addAssetScrap',
            payload: {
              tenantId,
              data: {
                ...values,
                tenantId,
                scrapOrderLines,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch(
                routerRedux.push({
                  pathname: `/aatn/asset-scrap/detail/${res.scrapHeaderId}`,
                })
              );
            }
          });
        } else {
          // 更新
          dispatch({
            type: 'assetScrap/updateAssetScrap',
            payload: {
              tenantId,
              data: {
                ...detail,
                ...values,
                tenantId,
                scrapOrderLines,
                planStartDate: moment(values.planStartDate).format(getDateTimeFormat()),
                planEndDate: moment(values.planEndDate).format(getDateTimeFormat()),
              },
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.setState({ editFlag: false });
              this.handleSearch();
            }
          });
        }
      }
    });
  }

  /**
   * 页面跳转
   * @param {string} id - id
   */
  @Bind()
  handleGotoDetail(id) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/aatn/asset-scrap/detail/${id}`,
      })
    );
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
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      editFlag,
      showSearchFlag,
      defaultItem,
      modalVisible,
      drawerVisible,
      scrapNumRequired,
      isMulti,
      lineDetail,
      selectedRowKeys = [],
    } = this.state;
    const { loading, match, tenantId, assetScrap } = this.props;
    const {
      detail,
      fullList,
      fullPagination,
      processStatusHeaderMap = [],
      scrapLineProcessStatusMap = [],
      disposeTypeLovMap = [],
      assetList = [],
      assetPagination = {},
      lineList = [],
      scrapTypeMap = [],
    } = assetScrap;
    const { id } = match.params;
    const isNew = isUndefined(id);
    const fullTextSearchProps = {
      loading: loading.fullTextSearch,
      pagination: fullPagination,
      dataSource: fullList,
      onSearch: this.handleFullSearch,
      onGotoDetail: this.handleGotoDetail,
    };
    const infoProps = {
      key: id,
      tenantId,
      loading,
      isMulti,
      headerProcessStatus: detail.processStatus,
      selectedRowKeys,
      modalVisible,
      drawerVisible,
      scrapNumRequired,
      processStatusHeaderMap,
      scrapLineProcessStatusMap,
      disposeTypeLovMap,
      scrapTypeMap,
      assetList,
      assetPagination,
      lineList,
      lineDetail, // 当前行编辑侧滑
      isNew,
      editFlag,
      detailDataSource: isUndefined(id) ? defaultItem : detail,
      drawerAssetSelectButtonStyle:
        !isUndefined(id) && detail.processStatus !== `NEW`
          ? { display: 'none', marginLeft: 10 }
          : { marginLeft: 10 },
      lineDeleteButtonStyle:
        !isUndefined(id) && detail.processStatus !== `NEW` ? { display: 'none' } : {},
      onDynamicGetHtml: this.dynamicGetHtml,
      onSelectRow: this.handleSelectRow,
      onRef: this.handleBindRef,
      onRefresh: this.handleSearch,
      onShowAssetModal: this.handleShowAssetModal,
      onSearchAsset: this.handleSearchAsset,
      onModalCancel: this.handleModalCancel,
      onAssetModalOk: this.handleAssetModalOk,
      onDrawerCancel: this.handleDrawerCancel,
      onDrawerDelete: this.handleDrawerDelete,
      onDrawerConfirm: this.handDrawerConfirm,
      onEdit: this.handleShowDrawer,
      onDrawerOk: this.handleDrawerOk,
      onTransationTypeField: this.selectTransationTypeField,
      onDeleteFromDB: this.handDeleteFromDB,
    };
    const displayFlag = isNew || editFlag ? { display: 'none' } : { display: 'block' };
    const displayFullFlag =
      isNew || editFlag || !showSearchFlag ? { display: 'none' } : { display: 'block' };
    const displayFlagBtn = isNew || editFlag ? { display: 'block' } : { display: 'none' };
    const displayCloseBtn = isNew || !editFlag ? { display: 'none' } : { display: 'block' };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`aatn.assetScrap.view.message.detail.title`).d('资产报废单明细')}
          backPath="/aatn/asset-scrap/list"
        >
          <Button
            icon="save"
            type="primary"
            style={displayFlagBtn}
            loading={loading.save}
            onClick={this.handleAssetScrap}
          >
            {intl.get(`hzero.common.button.save`).d('保存')}
          </Button>
          <Button icon="edit" type="primary" style={displayFlag} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </Button>
          <Button
            icon="select"
            disabled={
              detail.processStatus !== 'NEW' && detail.processStatus !== 'REJECTED' && !isNew
            }
            style={isNew || !editFlag ? { display: 'block' } : { display: 'none' }}
            loading={loading.submit}
            onClick={this.handleSubmitAssetScrap}
          >
            {intl.get(`hzero.common.button.submit`).d('提交')}
          </Button>
          <Button icon="close" style={displayCloseBtn} onClick={this.handleEdit}>
            {intl.get('hzero.common.button.close').d('取消编辑')}
          </Button>
        </Header>
        <Content>
          <div className={classNames(styles['asset-scrap-detail'])}>
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
              <Col span={isUndefined(id) ? 24 : editFlag ? 23 : showSearchFlag ? 17 : 23}>
                <Spin
                  spinning={isUndefined(id) ? false : loading.detail}
                  wrapperClassName={classNames(
                    styles['asset-scrap-detail'],
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
