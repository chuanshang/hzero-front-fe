import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Form,
  Input,
  Select,
  Row,
  Col,
  Icon,
  InputNumber,
  DatePicker,
  Tabs,
  Tag,
} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import {
  DEFAULT_DATE_FORMAT,
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
import { FORM_COL_2_3_LAYOUT, EDIT_FORM_ITEM_LAYOUT_COL_4 } from '@/utils/constants';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { getDateFormat } from 'utils/utils';
import { dateRender, yesOrNoRender } from 'utils/renderer';
import moment from 'moment';
import { getComponentType, getComponentProps } from './util';
import AssetRecordTab from './AssetRecordTab';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      warrantyStartDateFlag: false, // 质保起始日启用标志
      locationName: '', // 资产位置
      assetClassMeaning: '', // 资产类别
      specialAssetCode: undefined, // 特殊资产
      enabledNameFlag: false, // 资产标签/铭牌禁用标志
      serialNumRequired: false, // 序列号必输
      collapseKeys: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    };
  }

  componentDidMount() {
    const { onSearchField, onSearchEvent, onRefresh, isNew } = this.props;
    onRefresh();
    if (isNew) {
      onSearchField();
      onSearchEvent();
    }
  }

  @Bind()
  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 根据开始端(B)计量位计算长度
   * @param {number} end - 开始端(B)计量位
   */
  @Bind()
  handleLinearEndCount(end) {
    const {
      form: { getFieldValue },
    } = this.props;
    const start = getFieldValue('linearStartMeasure');
    if (!isUndefined(start) && !isUndefined(end)) {
      this.props.form.setFieldsValue({
        linearName: end - start,
      });
    } else {
      this.props.form.setFieldsValue({
        linearName: null,
      });
    }
  }

  /**
   * 根据开始端(A)计量位计算长度
   * @param {number} start - 开始端(B)计量位
   */
  @Bind()
  handleLinearStartCount(start) {
    const {
      form: { getFieldValue },
    } = this.props;
    const end = getFieldValue('linearEndMeasure');
    if (!isUndefined(start) && !isUndefined(end)) {
      this.props.form.setFieldsValue({
        linearName: end - start,
      });
    } else {
      this.props.form.setFieldsValue({
        linearName: null,
      });
    }
  }

  /**
   * 根据‘资产组’的值自动带出资产类别、图标、资产标签/铭牌规则、是否可维修、产品名称、
   * 品牌/厂商、规格型号、所属特殊资产
   * @param {string} _ 显示参数
   * @param {object} record 资产组对象
   */
  @Bind()
  handleValidateAsset(val, record) {
    // debugger;
    if (!isUndefined(record)) {
      this.props.form.setFieldsValue({
        assetClassId: record.assetClassId,
        assetIcon: record.iconC,
        nameRuleCode: record.nameplateRuleCode,
        // name: record.nameplateRuleMeaning,
        maintainable: record.isMaintain,
        assetsSetId: record.assetsSetId,
        assetName: record.assetName,
        brand: record.brand,
        model: record.specifications,
        specialAssetCode: record.specialAssetCode,
        assetDesc: `${record.assetsSetName}${!isEmpty(record.brand) ? `.${record.brand}` : ''}${
          !isEmpty(record.specifications) ? `.${record.specifications}` : ''
        }`,
        assetCriticality: record.assetCriticality,
      });
      this.handleValidateNameInput('', { key: record.nameplateRuleCode });
      this.setState({
        specialAssetCode: record.specialAssetCode,
        assetClassMeaning: record.assetClassMeaning,
      });
      this.props.onFetchAttributeDescription(record.attributeSetId);
    }
    this.props.onSetCurrentAssetsSetId(val);
  }

  /**
   * 所属特殊资产更改是保存其值
   * @param {string} value - 特殊资产
   */
  @Bind()
  handleChangeSpecialAssert(value) {
    if (!isEmpty(value)) {
      this.setState({
        specialAssetCode: value,
      });
    } else {
      this.setState({
        specialAssetCode: null,
      });
    }
  }

  /**
   * 拼接资产全称：产品名称.品牌/厂商.规格型号
   * @param {object}  - event 事件对象
   */
  @Bind()
  handleMakeAssetDesc(event) {
    let assetDesc = '';
    const { assetName = '', brand = '', model = '' } = this.props.form.getFieldsValue();
    const { id, value = '' } = event.target;
    switch (id) {
      case 'assetName':
        assetDesc = `${value}${isEmpty(brand) ? '' : `.${brand}`}${
          isEmpty(model) ? '' : `.${model}`
        }`;
        break;
      case 'brand':
        assetDesc = `${assetName}${isEmpty(value) ? '' : `.${value}`}${
          isEmpty(model) ? '' : `.${model}`
        }`;
        break;
      case 'model':
        assetDesc = `${assetName}${isEmpty(brand) ? '' : `.${brand}`}${
          isEmpty(value) ? '' : `.${value}`
        }`;
        break;
      default:
    }
    this.props.form.setFieldsValue({
      assetDesc,
    });
  }

  /**
   * 根据资产标签/铭牌规则生成资产标签/铭牌编号
   */
  @Bind()
  handleValidateNameInput(_, record) {
    if (!isUndefined(record)) {
      if (record.key === 'MANUAL_INPUT_NUM') {
        this.setState({
          enabledNameFlag: false,
        });
        this.props.form.setFieldsValue({
          name: null,
        });
      } else {
        this.setState({
          enabledNameFlag: true,
        });
        if (record.key === 'SERIES_NUM') {
          this.setState({ serialNumRequired: true });
        } else {
          this.setState({ serialNumRequired: false });
        }
        switch (record.key) {
          case 'ASSET_NUM': // 资产编号
            this.props.form.setFieldsValue({
              name: this.props.form.getFieldValue('assetNum'),
            });
            break;
          case 'SERIES_NUM': // 序列号
            this.props.form.setFieldsValue({
              name: this.props.form.getFieldValue('serialNum'),
            });
            break;
          // case 'VEHICLE_NUM': // 车架号
          //   this.props.form.setFieldsValue({
          //     name: this.props.form.getFieldValue('vinNum'),
          //   });
          //   break;
          // case 'ENGINE_NUM': // 发动机号
          //   this.props.form.setFieldsValue({
          //     name: this.props.form.getFieldValue('engineNum'),
          //   });
          //   break;
          case 'CAR_NUM': // 车牌号
            this.props.form.setFieldsValue({
              name: this.props.form.getFieldValue('carNum'),
            });
            break;
          case 'OTHER_NUM': // 其他跟踪编号
            this.props.form.setFieldsValue({
              name: this.props.form.getFieldValue('trackingNum'),
            });
            break;
          default:
        }
      }
    }
  }

  @Bind()
  setName(event) {
    const nameRuleCode = this.props.form.getFieldValue('nameRuleCode');
    const { id, value } = event.target;
    switch (nameRuleCode) {
      case 'ASSET_NUM': // 资产编号
        if (id === 'assetNum') {
          this.props.form.setFieldsValue({
            name: value,
          });
        }
        break;
      case 'SERIES_NUM': // 序列号
        if (id === 'serialNum') {
          this.props.form.setFieldsValue({
            name: value,
          });
        }
        break;
      // case 'VEHICLE_NUM': // 车架号
      //   if (id === 'vinNum') {
      //     this.props.form.setFieldsValue({
      //       name: value,
      //     });
      //   }
      //   break;
      // case 'ENGINE_NUM': // 发动机号
      //   if (id === 'engineNum') {
      //     this.props.form.setFieldsValue({
      //       name: value,
      //     });
      //   }
      //   break;
      case 'CAR_NUM': // 车牌号
        if (id === 'carNum') {
          this.props.form.setFieldsValue({
            name: value,
          });
        }
        break;
      case 'OTHER_NUM': // 其他跟踪编号
        if (id === 'trackingNum') {
          this.props.form.setFieldsValue({
            name: value,
          });
        }
        break;
      default:
    }
  }

  /**
   * 根据属性行内容动态渲染属性折叠部分表单内容
   * @param {Array} [attributeInfo=[]]

   */
  @Bind()
  getAttributeInfo(attributeInfo = []) {
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const {
      isNew,
      editFlag,
      form: { getFieldDecorator },
      dataSource,
      currentAssetsSetId,
    } = this.props;
    const renderTemplates = [];
    attributeInfo.forEach(item => {
      const field = {
        componentType: item.attributeType,
        lovCode: item.lovValue,
        fieldCode: 'attributeName',
      };
      const componentType = getComponentType(field);
      const componentProps = getComponentProps({ field, componentType: field.componentType });
      const initValue =
        dataSource.assetsSetId !== currentAssetsSetId
          ? ''
          : this.getInitialValue(item.lineId, JSON.parse(dataSource.attributeValues || '{}') || []);
      const template = (
        <Col key={item.lineId} span={8} style={{ marginBottom: 16 }} {...FORM_COL_3_LAYOUT}>
          <Form.Item label={item.attributeName} {...formLayout}>
            {!isNew || editFlag ? (
              getFieldDecorator(`${currentAssetsSetId}lineId#${item.lineId}`, {
                initialValue: initValue,
                rules:
                  item.requiredFlag === 1
                    ? [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: item.attributeName,
                          }),
                        },
                      ]
                    : [],
              })(React.createElement(componentType, Object.assign({}, componentProps)))
            ) : (
              <span>{initValue}</span>
            )}
          </Form.Item>
        </Col>
      );
      renderTemplates.push(template);
    });
    return renderTemplates;
  }

  getInitialValue(lineId, values = []) {
    if (values && values.length > 0) {
      const value = values.filter(item => `#${lineId}` === item.attrCode);
      return isUndefined(value[0]) ? '' : value[0].attrValue;
    }
  }

  /**
   * 根据质保起始日计算规则生成质保起始日
   */
  @Bind()
  handleWarrantyStartDate(record) {
    const { form } = this.props;
    switch (record) {
      case 'DELIVERY_DATE':
        this.setState({ warrantyStartDateFlag: true });
        form.setFieldsValue({
          warrantyStartDate: form.getFieldValue('receivedDate'),
        });
        break;
      case 'ENABLE_DATE':
        this.setState({ warrantyStartDateFlag: true });
        form.setFieldsValue({
          warrantyStartDate: form.getFieldValue('startDate'),
        });
        break;
      case 'MANUAL_INPUT':
        this.setState({ warrantyStartDateFlag: false });
        break;
      default:
    }
  }

  /**
   * 选择交付日期或者启用日期时，根据质保起始日计算规则设置质保起始日
   * @param {string} value - 交付日期或者启用日期
   */
  @Bind()
  setWarrantyStartDate(value) {
    const warrantyTypeRule = this.props.form.getFieldValue('warrantyTypeRule');
    let startDate = null;
    switch (warrantyTypeRule) {
      case 'DELIVERY_DATE':
        startDate = value;
        break;
      case 'ENABLE_DATE':
        startDate = value;
        break;
      case 'MANUAL_INPUT':
        startDate = null;
        break;
      default:
    }
    this.props.form.setFieldsValue({
      warrantyStartDate: startDate,
    });
  }

  render() {
    const {
      dataSource,
      isNew,
      tenantId,
      editFlag,
      specialAsset,
      nameplateRule,
      assetSource,
      warrantyTypeRule,
      attributeInfo,
      assetCriticalityMap,
      loading,
      eventList,
      fieldList,
      assetFields,
      eventPagination,
      transactionTypes,
      tabPaneHeight,
      assetTagStatusColorMap,
      onSearchField,
      onSearchEvent,
      onSearchAssetFields,
      onSearchTransactionTypes,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {
      enabledNameFlag,
      warrantyStartDateFlag,
      specialAssetCode,
      assetClassMeaning,
      serialNumRequired,
      collapseKeys = [],
    } = this.state;
    const maxLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const assetRecordTabProps = {
      eventPagination,
      transactionTypes,
      assetFields,
      onSearchField,
      onSearchEvent,
      onSearchAssetFields,
      onSearchTransactionTypes,
      eventLoading: loading.event,
      fieldLoading: loading.field,
      eventDataSource: eventList,
      fieldDataSource: fieldList,
    };
    const prefix = 'aafm.equipmentAsset.model.equipment';
    // const renderList = this.getAttributeInfo(attributeInfo);
    // const renderAttribute = renderList.map(item => item);
    return (
      <React.Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={24}>
                <Row className="object-title">
                  <h1>{`${dataSource.assetDesc}`}</h1>
                  <h2>
                    {`${dataSource.assetNum}`}
                    <Tag
                      style={{ marginLeft: 5 }}
                      color={`${(
                        assetTagStatusColorMap.filter(
                          item => item.value === dataSource.assetStatus
                        )[0] || {}
                      ).meaning || ''}`}
                    >
                      {dataSource.assetStatusName}
                    </Tag>
                  </h2>
                </Row>
                <Row className="object-header">
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.locationName`).d('资产位置')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetLocationName}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.owningOrg`).d('使用方')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>
                      {`${dataSource.usingOrgName} ${dataSource.userPersonName}`}
                    </Row>
                  </Col>
                  <Col span={5}>
                    <Row>
                      <span>{intl.get(`${prefix}.assetStatus`).d('资产专业归类')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetSpecialtyName}</Row>
                  </Col>
                  <Col span={5}>
                    <Row>
                      <span>{intl.get(`${prefix}.startDate`).d('启用日期')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>
                      {!isUndefined(dataSource.startDate) && !isNull(dataSource.startDate)
                        ? dataSource.startDate.substr(0, 10)
                        : ''}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          ''
        )}
        <Tabs>
          <Tabs.TabPane
            key="basic"
            tab={intl.get(`${prefix}.basic`).d('基本')}
            style={{ height: tabPaneHeight, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C', 'D', 'E', 'F', 'G']}
              className="form-collapse"
              onChange={this.handleChangeKey}
            >
              <Collapse.Panel
                showArrow={false}
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('A') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${prefix}.panel.A`).d('基础信息')}
                    </h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
                key="A"
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetsSetName`).d('资产组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetsSetId', {
                            initialValue: dataSource.assetsSetId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetsSetName`).d('资产组'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AAFM.ASSET_SET"
                              textValue={dataSource.assetsSetName}
                              queryParams={{ organizationId: tenantId }}
                              onChange={this.handleValidateAsset}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetsSetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetClassCode`).d('资产类别')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetClassId', {
                            initialValue: dataSource.assetClassId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetClassCode`).d('资产类别'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AAFM.ASSET_CLASS"
                              textValue={
                                isEmpty(assetClassMeaning)
                                  ? dataSource.assetClassMeaning
                                  : assetClassMeaning
                              }
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>
                            {isEmpty(assetClassMeaning)
                              ? dataSource.assetClassMeaning
                              : assetClassMeaning}
                          </span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.iconC`).d('图标')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {/* <Button onClick={handleOpenIconModal} icon={getFieldValue('iconC')}>
                          {isEmpty(getFieldValue('icon'))
                          ? intl.get(`${viewButtonPrompt}.button.selectIcons`).d('选择图标')
                          : null}
                        </Button> */}
                        {getFieldDecorator('iconC', {
                          initialValue: dataSource.iconC,
                        })(<div />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.nameRuleCode`).d('资产标签/铭牌规则')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('nameRuleCode', {
                            initialValue: dataSource.nameRuleCode,
                            rules: [
                              {
                                required: false,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.nameRuleCode`).d('资产标签/铭牌规则'),
                                }),
                              },
                            ],
                          })(
                            <Select disabled allowClear onChange={this.handleValidateNameInput}>
                              {nameplateRule.map(i => {
                                // 特殊资产为车辆时才显示 {/** 车架号和发动机号*/} 车牌号
                                if (specialAssetCode !== 'CAR') {
                                  // if (i.value !== 'VEHICLE_NUM' && i.value !== 'ENGINE_NUM') {
                                  if (i.value !== 'CAR_NUM') {
                                    return <Select.Option key={i.value}>{i.meaning}</Select.Option>;
                                  } else {
                                    return null;
                                  }
                                } else {
                                  return <Select.Option key={i.value}>{i.meaning}</Select.Option>;
                                }
                              })}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.nameRuleMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.name`).d('资产标签/铭牌')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('name', {
                            initialValue: dataSource.name,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.name`).d('资产标签/铭牌'),
                                }),
                              },
                              {
                                required: serialNumRequired,
                                max: 30,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 30,
                                }),
                              },
                            ],
                          })(
                            <Input
                              disabled={
                                getFieldValue('nameRuleCode') !== 'MANUAL_INPUT_NUM' ||
                                enabledNameFlag
                              }
                            />
                          )
                        ) : (
                          <span>{dataSource.name}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetNum`).d('资产编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetNum', {
                            initialValue: dataSource.assetNum,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetNum`).d('资产编号'),
                                }),
                              },
                              {
                                max: 30,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 30,
                                }),
                              },
                            ],
                          })(
                            <Input
                              id="assetNum"
                              disabled={isNew}
                              inputChinese={false}
                              onChange={this.setName}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.serialNum`).d('序列号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('serialNum', {
                            initialValue: dataSource.serialNum,
                            rules: [
                              {
                                max: 120,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 120,
                                }),
                              },
                            ],
                          })(<Input id="serialNum" inputChinese={false} onChange={this.setName} />)
                        ) : (
                          <span>{dataSource.serialNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.trackingNum`).d('其它跟踪编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('trackingNum', {
                            initialValue: dataSource.trackingNum,
                            rules: [
                              {
                                max: 30,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 30,
                                }),
                              },
                            ],
                          })(
                            <Input id="trackingNum" inputChinese={false} onChange={this.setName} />
                          )
                        ) : (
                          <span>{dataSource.trackingNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.maintainFlag`).d('是否可维修')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('maintainFlag', {
                            initialValue: dataSource.maintainFlag,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.maintainFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetName`).d('资产名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetName', {
                            initialValue: dataSource.assetName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetName`).d('资产名称'),
                                }),
                              },
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input trimAll id="assetName" onChange={this.handleMakeAssetDesc} />)
                        ) : (
                          <span>{dataSource.assetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.brand`).d('品牌/厂商')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('brand', {
                            initialValue: dataSource.brand,
                            rules: [
                              {
                                max: 120,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 120,
                                }),
                              },
                            ],
                          })(<Input trimAll id="brand" onChange={this.handleMakeAssetDesc} />)
                        ) : (
                          <span>{dataSource.brand}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.model`).d('规格型号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('model', {
                            initialValue: dataSource.model,
                            rules: [
                              {
                                max: 120,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 120,
                                }),
                              },
                            ],
                          })(<Input trimAll id="model" onChange={this.handleMakeAssetDesc} />)
                        ) : (
                          <span>{dataSource.model}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_2_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetDesc`).d('资产全称')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_4}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetDesc', {
                            initialValue: dataSource.assetDesc,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetDesc`).d('资产全称'),
                                }),
                              },
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input trimAll disabled />)
                        ) : (
                          <span>{dataSource.assetDesc}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.specialAssetCode`).d('所属特殊资产')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('specialAssetCode', {
                            initialValue: dataSource.specialAssetCode,
                          })(
                            <Select disabled allowClear onChange={this.handleChangeSpecialAssert}>
                              {specialAsset.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.specialAssetMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item label={intl.get(`${prefix}.description`).d('说明')} {...maxLayout}>
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input.TextArea rows={3} />)
                        ) : (
                          <span>{dataSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              {(isUndefined(specialAssetCode) ? dataSource.specialAssetCode : specialAssetCode) ===
              'LINEAR_ASSET' ? (
                <Collapse.Panel
                  showArrow={false}
                  header={
                    <Fragment>
                      <h3 style={collapseKeys.includes('C') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                        {intl.get(`${prefix}.panel.C`).d('线性描述')}
                      </h3>
                      <a>
                        {collapseKeys.includes('C')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                    </Fragment>
                  }
                  key="C"
                >
                  <Form>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.linearName`).d('长度')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('linearName', {
                              initialValue: isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearName)
                                ? null
                                : dataSource.assetLinear.linearName,
                              rules: [
                                {
                                  required: true,
                                  message: intl.get('hzero.common.validation.notNull', {
                                    name: intl.get(`${prefix}.linearName`).d('长度'),
                                  }),
                                },
                              ],
                            })(
                              <InputNumber
                                precision={8}
                                style={{ width: '100%' }}
                                disabled="true"
                              />
                            )
                          ) : (
                            <span>
                              {isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearName)
                                ? null
                                : dataSource.assetLinear.linearName}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.linearStartMeasure`).d('开始端(A)计量位')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('linearStartMeasure', {
                              initialValue: isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearStartMeasure)
                                ? null
                                : dataSource.assetLinear.linearStartMeasure,
                              rules: [
                                {
                                  required: true,
                                  message: intl.get('hzero.common.validation.notNull', {
                                    name: intl
                                      .get(`${prefix}.linearStartMeasure`)
                                      .d('开始端(A)计量位'),
                                  }),
                                },
                              ],
                            })(
                              <InputNumber
                                precision={9}
                                style={{ width: '100%' }}
                                onChange={this.handleLinearStartCount}
                              />
                            )
                          ) : (
                            <span>
                              {isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearStartMeasure)
                                ? null
                                : dataSource.assetLinear.linearStartMeasure}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.linearStartDesc`).d('开始端(A)描述')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('linearStartDesc', {
                              initialValue: isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearStartDesc)
                                ? null
                                : dataSource.assetLinear.linearStartDesc,
                              rules: [
                                {
                                  max: 480,
                                  message: intl.get('hzero.common.validation.max', {
                                    max: 480,
                                  }),
                                },
                              ],
                            })(<Input />)
                          ) : (
                            <span>
                              {isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearStartDesc)
                                ? null
                                : dataSource.assetLinear.linearStartDesc}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.linearEndMeasure`).d('开始端(B)计量位')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('linearEndMeasure', {
                              initialValue: isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearEndMeasure)
                                ? null
                                : dataSource.assetLinear.linearEndMeasure,
                              rules: [
                                {
                                  required: true,
                                  message: intl.get('hzero.common.validation.notNull', {
                                    name: intl
                                      .get(`${prefix}.linearEndMeasure`)
                                      .d('开始端(B)计量位'),
                                  }),
                                },
                              ],
                            })(
                              <InputNumber
                                precision={10}
                                style={{ width: '100%' }}
                                onChange={this.handleLinearEndCount}
                              />
                            )
                          ) : (
                            <span>
                              {isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearEndMeasure)
                                ? null
                                : dataSource.assetLinear.linearEndMeasure}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.linearEndDesc`).d('开始端(B)描述')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('linearEndDesc', {
                              initialValue: isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearEndDesc)
                                ? null
                                : dataSource.assetLinear.linearEndDesc,
                              rules: [
                                {
                                  max: 480,
                                  message: intl.get('hzero.common.validation.max', {
                                    max: 480,
                                  }),
                                },
                              ],
                            })(<Input />)
                          ) : (
                            <span>
                              {isUndefined(dataSource.assetLinear)
                                ? null
                                : isUndefined(dataSource.assetLinear.linearEndDesc)
                                ? null
                                : dataSource.assetLinear.linearEndDesc}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Collapse.Panel>
              ) : (
                ''
              )}
              {(isUndefined(specialAssetCode) ? dataSource.specialAssetCode : specialAssetCode) ===
              'CAR' ? (
                <Collapse.Panel
                  showArrow={false}
                  header={
                    <Fragment>
                      <h3 style={collapseKeys.includes('D') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                        {intl.get(`${prefix}.panel.D`).d('车辆描述')}
                      </h3>
                      <a>
                        {collapseKeys.includes('D')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
                    </Fragment>
                  }
                  key="D"
                >
                  <Form>
                    <Row
                      {...EDIT_FORM_ROW_LAYOUT}
                      className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                    >
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.carNum`).d('车牌号')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('carNum', {
                              initialValue: dataSource.carNum,
                              rules: [
                                {
                                  required: true,
                                  message: intl.get('hzero.common.validation.notNull', {
                                    name: intl.get(`${prefix}.carNum`).d('车牌号'),
                                  }),
                                },
                                {
                                  max: 30,
                                  message: intl.get('hzero.common.validation.max', {
                                    max: 30,
                                  }),
                                },
                              ],
                            })(<Input id="carNum" onChange={this.setName} />)
                          ) : (
                            <span>{dataSource.carNum}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.vinNum`).d('车架号')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('vinNum', {
                              initialValue: dataSource.vinNum,
                              rules: [
                                {
                                  max: 30,
                                  message: intl.get('hzero.common.validation.max', {
                                    max: 30,
                                  }),
                                },
                              ],
                            })(<Input id="vinNum" onChange={this.setName} />)
                          ) : (
                            <span>{dataSource.vinNum}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.engineNum`).d('发动机编号')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {!isNew || editFlag ? (
                            getFieldDecorator('engineNum', {
                              initialValue: dataSource.engineNum,
                              rules: [
                                {
                                  max: 30,
                                  message: intl.get('hzero.common.validation.max', {
                                    max: 30,
                                  }),
                                },
                              ],
                            })(<Input id="engineNum" onChange={this.setName} />)
                          ) : (
                            <span>{dataSource.engineNum}</span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Collapse.Panel>
              ) : (
                ''
              )}
              {!isEmpty(attributeInfo) ? (
                <Collapse.Panel
                  showArrow={false}
                  header={
                    <Fragment>
                      <h3 style={collapseKeys.includes('B') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                        {intl.get(`${prefix}.panel.B`).d('属性描述')}
                      </h3>
                      <a>
                        {collapseKeys.includes('B')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                    </Fragment>
                  }
                  key="B"
                >
                  <Form>
                    <Row className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}>
                      {this.getAttributeInfo(attributeInfo)}
                    </Row>
                  </Form>
                </Collapse.Panel>
              ) : (
                ''
              )}
              <Collapse.Panel
                showArrow={false}
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('G') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${prefix}.panel.G`).d('跟踪与管理')}
                    </h3>
                    <a>
                      {collapseKeys.includes('G')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('G') ? 'up' : 'down'} />
                  </Fragment>
                }
                key="G"
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.parentAsset`).d('父资产')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('parentAssetId', {
                            initialValue: dataSource.parentAssetId,
                          })(
                            <Lov
                              code="AAFM.ASSETS"
                              textValue={dataSource.parentAssetName}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.parentAssetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetCriticality`).d('资产重要性')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetCriticality', {
                            initialValue: dataSource.assetCriticality,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetCriticality`).d('资产重要性'),
                                }),
                              },
                            ],
                          })(
                            <Select allowClear>
                              {assetCriticalityMap.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.assetCriticalityMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    {!isNew || editFlag ? (
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.assetStatus`).d('资产状态')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {/** !isNew || editFlag ? ( */
                          getFieldDecorator('assetStatusId', {
                            initialValue: dataSource.assetStatusId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetStatus`).d('资产状态'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AAFM.ASSET_STATUS"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetStatusName}
                            />
                          )
                          /** ) : (
                              <span>{dataSource.assetStatusName}</span>
                          ) */
                          }
                        </Form.Item>
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.locationName`).d('资产位置')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetLocationId', {
                            initialValue: dataSource.assetLocationId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetLocationId`).d('资产位置'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AMDM.LOCATIONS"
                              textValue={dataSource.assetLocationName}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetLocationName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetLocationDesc`).d('位置详细说明')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetLocationDesc', {
                            initialValue: dataSource.assetLocationDesc,
                            rules: [
                              {
                                max: 480,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 480,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.assetLocationDesc}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.mapSource`).d('地图来源')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('mapSource', {
                            initialValue:
                              dataSource.mapSource || intl.get(`${prefix}.initMapSource`).d('地图'),
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.mapSource`).d('地图来源'),
                                }),
                              },
                            ],
                          })(<Select allowClear>{}</Select>)
                        ) : (
                          <span>{dataSource.mapSource}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.owningOrg`).d('所属组织')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('owningOrgId', {
                            initialValue: dataSource.owningOrgId,
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              textValue={dataSource.owningOrgName}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.owningOrgName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.owningOrgDetail`).d('所属组织明细')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('owningOrgDetail', {
                            initialValue: dataSource.owningOrgDetail,
                            rules: [
                              {
                                max: 480,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 480,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.owningOrgDetail}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetManager`).d('资产管理员')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('owningPersonId', {
                            initialValue: dataSource.owningPersonId,
                          })(
                            <Lov
                              code="HALM.EMPLOYEE"
                              textValue={dataSource.owningPersonName}
                              queryParams={{ tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.owningPersonName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.costCenter`).d('成本中心')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('costCenterId', {
                            initialValue: dataSource.costCenterId,
                          })(
                            <Lov
                              code="AATN.ASSET_COST_CENTER"
                              textValue={dataSource.costCenterMeaning}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.costCenterMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    {!isNew || editFlag ? (
                      <Col {...FORM_COL_3_LAYOUT}>
                        <Form.Item
                          label={intl.get(`${prefix}.assetSpecialty`).d('资产专业归类')}
                          {...EDIT_FORM_ITEM_LAYOUT}
                        >
                          {/** !isNew || editFlag ? ( */
                          getFieldDecorator('assetSpecialtyId', {
                            initialValue: dataSource.assetSpecialtyId,
                          })(
                            <Lov
                              code="AAFM.SPECIAL_ASSET_CLASS"
                              textValue={dataSource.assetSpecialtyName}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                          /** ) : (
                                <span>{dataSource.assetSpecialtyName}</span>
                            ) */
                          }
                        </Form.Item>
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.usingOrg`).d('使用组织')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('usingOrgId', {
                            initialValue: dataSource.usingOrgId,
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              textValue={dataSource.usingOrgName}
                              queryParams={{ organization: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.usingOrgName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.useOrgDetail`).d('使用组织明细')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('useOrgDetail', {
                            initialValue: dataSource.useOrgDetail,
                            rules: [
                              {
                                max: 480,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 480,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.useOrgDetail}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.userPerson`).d('使用人')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('userPersonId', {
                            initialValue: dataSource.userPersonId,
                          })(
                            <Lov
                              code="HALM.EMPLOYEE"
                              queryParams={{ tenantId }}
                              textValue={dataSource.userPersonName}
                            />
                          )
                        ) : (
                          <span>{dataSource.userPersonName}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('E') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${prefix}.panel.E`).d('来源与日期')}
                    </h3>
                    <a>
                      {collapseKeys.includes('E')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('E') ? 'up' : 'down'} />
                  </Fragment>
                }
                key="E"
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetSourceType`).d('资产来源')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetSourceTypeCode', {
                            initialValue: dataSource.assetSourceTypeCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetSourceType`).d('资产来源'),
                                }),
                              },
                            ],
                          })(
                            <Select allowClear>
                              {assetSource.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.assetSourceTypeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.sourceWordNum`).d('来源相关文档号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('sourceWordNum', {
                            initialValue: dataSource.sourceWordNum,
                          })(
                            <Lov
                              code="AATN.ASSET_SOURCE_DOC"
                              textValue={dataSource.sourceWordNum}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.sourceWordNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.sourceCheckList`).d('来源验收单')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('sourceCheckList', {
                            initialValue: dataSource.sourceCheckList,
                          })(
                            <Lov
                              code="AATN.ASSET_SOURCE_RECEIPT"
                              textValue={dataSource.sourceCheckList}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.sourceCheckList}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.sourceCont`).d('来源合同')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('sourceContractId', {
                            initialValue: dataSource.sourceContractId,
                          })(
                            <Lov
                              code="AATN.ASSET_SOURCE_CONTRACT"
                              textValue={dataSource.sourceContractId}
                              queryParams={{ organization: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.sourceContractId}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.sourceProject`).d('来源项目')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('sourceProject', {
                            initialValue: dataSource.sourceProjectId,
                          })(
                            <Lov
                              code="AATN.ASSET_SOURCE_PROJECT"
                              textValue={dataSource.sourceProjectId}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.sourceProjectId}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.supplierOrg`).d('供应商')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('supplierOrgId', {
                            initialValue: dataSource.supplierOrgId,
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              textValue={dataSource.supplierOrgMeaning}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.supplierOrgMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.manufacturer`).d('制造厂商(总装)')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('manufacturerId', {
                            initialValue: dataSource.manufacturerId,
                          })(
                            <Lov
                              code="AMDM.ORGANIZATION"
                              textValue={dataSource.manufacturerName}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.manufacturerName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetSourceDetail`).d('来源明细说明')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetSourceDetail', {
                            initialValue: dataSource.assetSourceDetail,
                            rules: [
                              {
                                max: 480,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 480,
                                }),
                              },
                            ],
                          })(<Input />)
                        ) : (
                          <span>{dataSource.assetSourceDetail}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.currencyCode`).d('计价币种')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('currencyCode', {
                            initialValue: dataSource.currencyCode || 'CNY',
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.currencyCode`).d('计价币种'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="HPFM.CURRENCY"
                              textValue={dataSource.currencyCode || 'CNY'}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.currencyCode}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.originalCost`).d('获取价格')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('originalCost', {
                            initialValue: dataSource.originalCost,
                          })(<InputNumber style={{ width: '100%' }} step={0.01} />)
                        ) : (
                          <span>{dataSource.originalCost}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.receivedDate`).d('交付日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('receivedDate', {
                            initialValue: dataSource.receivedDate
                              ? moment(dataSource.receivedDate, DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              format={getDateFormat()}
                              style={{ width: '100%' }}
                              placeholder=""
                              onChange={this.setWarrantyStartDate}
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.receivedDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.startDate`).d('启用日期')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('startDate', {
                            initialValue: dataSource.startDate
                              ? moment(dataSource.startDate, DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              format={getDateFormat()}
                              style={{ width: '100%' }}
                              placeholder=""
                              onChange={this.setWarrantyStartDate}
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.startDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                header={
                  <Fragment>
                    <h3 style={collapseKeys.includes('F') ? {} : { color: 'rgba(0,0,0,.25)' }}>
                      {intl.get(`${prefix}.panel.F`).d('质保信息')}
                    </h3>
                    <a>
                      {collapseKeys.includes('F')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('F') ? 'up' : 'down'} />
                  </Fragment>
                }
                key="F"
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.warrantyTypeCode`).d('质保类型')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('warrantyTypeCode', {
                            initialValue: dataSource.warrantyTypeCode,
                          })(
                            <Lov
                              code="AATN.ASSET_WARRANTY_TYPE"
                              textValue={dataSource.warrantyTypeCode}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.warrantyTypeCode}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.warrantyTypeRule`).d('质保起始日计算规则')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('warrantyTypeRule', {
                            initialValue: dataSource.warrantyTypeRule,
                          })(
                            <Select allowClear onChange={this.handleWarrantyStartDate}>
                              {warrantyTypeRule.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.warrantyTypeRuleMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.warrantyStartDate`).d('质保起始日')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('warrantyStartDate', {
                            initialValue: dataSource.warrantyStartDate
                              ? moment(dataSource.warrantyStartDate, DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              format={getDateFormat()}
                              style={{ width: '100%' }}
                              disabled={
                                getFieldValue('warrantyTypeRule') !== 'MANUAL_INPUT' ||
                                warrantyStartDateFlag
                              }
                              disabledDate={currentDate =>
                                getFieldValue('warrantyExpireDate') &&
                                moment(getFieldValue('warrantyExpireDate')).isBefore(
                                  currentDate,
                                  'day'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.warrantyStartDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.warrantyExpireDate`).d('质保到期日')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('warrantyExpireDate', {
                            initialValue: dataSource.warrantyExpireDate
                              ? moment(dataSource.warrantyExpireDate, DEFAULT_DATE_FORMAT)
                              : null,
                          })(
                            <DatePicker
                              placeholder=""
                              format={getDateFormat()}
                              style={{ width: '100%' }}
                              disabledDate={currentDate =>
                                getFieldValue('warrantyStartDate') &&
                                moment(getFieldValue('warrantyStartDate')).isAfter(
                                  currentDate,
                                  'day'
                                )
                              }
                            />
                          )
                        ) : (
                          <span>{dateRender(dataSource.warrantyExpireDate)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={!isNew || editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${prefix}.warrantyNotes`).d('质保详细说明')}
                        {...maxLayout}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('warrantyNotes', {
                            initialValue: dataSource.warrantyNotes,
                            rules: [
                              {
                                max: 240,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 240,
                                }),
                              },
                            ],
                          })(<Input.TextArea rows={3} />)
                        ) : (
                          <span>{dataSource.warrantyNotes}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
          {/* {!isNew || editFlag ? null : (
            <Tabs.TabPane
              key="analyse"
              tab={intl.get(`${prefix}.analyse`).d('故障分析')}
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            />
          )}
          {!isNew || editFlag ? null : (
            <Tabs.TabPane
              key="meter"
              tab={intl.get(`${prefix}.meter`).d('仪表/测量点')}
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            />
          )} */}
          {!isNew || editFlag ? null : (
            <Tabs.TabPane
              key="record"
              tab={intl.get(`${prefix}.record`).d('资产履历')}
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            >
              <AssetRecordTab {...assetRecordTabProps} />
            </Tabs.TabPane>
          )}
          {/* {!isNew || editFlag ? null : (
            <Tabs.TabPane
              key="plan"
              tab={intl.get(`${prefix}.plan`).d('计划与标准')}
              style={{ height: tabPaneHeight, overflow: 'auto' }}
            />
          )} */}
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
