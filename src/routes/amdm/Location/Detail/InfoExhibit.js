import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Cascader, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: [],
      currentCountry: null,
      POSTCODE: /^[0-9]*$/,
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  onUploadSuccess(file) {
    const { form } = this.props;
    if (file) {
      form.setFieldsValue({
        productUrl: file.response,
      });
    }
  }

  @Bind()
  onRemoveSuccess() {
    const { form } = this.props;
    form.setFieldsValue({
      productUrl: null,
    });
  }

  @Bind()
  handleInventoryChange(value) {
    if (value === 0) {
      const { form } = this.props;
      form.setFieldsValue({ negativeBalancesFlag: 0 });
      form.setFieldsValue({ movableLocationFlag: 0 });
      form.setFieldsValue({ pickingFlag: 0 });
      form.setFieldsValue({ inventoryModeFlag: 0 });
    }
  }

  @Bind
  handleCountryChange(value, record) {
    this.setState({
      currentCountry: record,
    });
    this.props.onFetchProvinceCity(value);
  }

  @Bind
  isChinaCountry(countryCode) {
    const { currentCountry } = this.state;
    if (currentCountry === null) {
      return countryCode === 'CN';
    } else {
      return currentCountry.countryCode === 'CN';
    }
  }

  render() {
    const {
      tenantId,
      isNew,
      detailInfo = {},
      cityList = [],
      locationTypes = [],
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [], POSTCODE } = this.state;
    const modelPrompt = 'amdm.location.model.location';
    const prefix = 'amdm.location.view.message';
    const editInventoryFlag = this.props.form.getFieldValue('stockFlag') === 1;
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C', 'D']}
        className="form-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get('hzero.common.view.baseInfo').d('基本信息')}</h3>
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
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.maintSites`).d('服务区域')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('maintSitesId', {
                    initialValue: detailInfo.maintSitesId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.requireInput', {
                          name: intl.get(`${modelPrompt}.maintSites`).d('服务区域'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AMDM.ASSET_MAINT_SITE"
                      textValue={detailInfo.maintSitesName}
                      queryParams={{ organizationId: tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.locationTypeCode`).d('位置类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('locationTypeCode', {
                    initialValue: detailInfo.locationTypeMeaning,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.locationTypeCode`).d('位置类型'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {locationTypes.map(r => (
                        <Select.Option key={r.value} value={r.value}>
                          {r.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.parentLocation`).d('父位置节点')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  <span>{detailInfo.parentLocationName}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.icon`).d('图标')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('icon', {
                    initialValue: detailInfo.icon,
                  })(<div />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`amdm.common.model.name`).d('名称')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('locationName', {
                    initialValue: detailInfo.locationName,
                    rules: [
                      {
                        required: isNew,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`amdm.common.model.name`).d('名称'),
                        }),
                      },
                      {
                        max: 60,
                        message: intl.get('hzero.common.validation.max', {
                          max: 60,
                        }),
                      },
                    ],
                  })(!isNew ? <span>{detailInfo.locationName}</span> : <Input disabled={!isNew} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.title`).d('位置标题')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('locationTitle', {
                    initialValue: detailInfo.locationTitle,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={21}>
                <Form.Item
                  label={intl.get(`amdm.common.model.description`).d('描述')}
                  {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                >
                  {getFieldDecorator('description', {
                    initialValue: detailInfo.description,
                  })(<Input.TextArea rows={3} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`hzero.common.status.enable`).d('启用')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('enabledFlag', {
                    initialValue: detailInfo.enabledFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.functionProperty`).d('功能属性')}</h3>
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
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.assetLocationFlag`).d('可放置设备/资产')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('assetLocationFlag', {
                    initialValue: detailInfo.assetLocationFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.rackLocationFlag`).d('可放置服务器/网络机柜')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('rackLocationFlag', {
                    initialValue: detailInfo.rackLocationFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.directMaintainFlag`).d('可直接维修维护')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('directMaintainFlag', {
                    initialValue: detailInfo.directMaintainFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.stockFlag`).d('是否库存')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('stockFlag', {
                    initialValue: detailInfo.stockFlag,
                  })(<Switch onChange={this.handleInventoryChange} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.costCenterCode`).d('成本中心')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('costCenterCode', {
                    initialValue: detailInfo.costCenterCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.requireInput', {
                          name: intl.get(`${modelPrompt}.costCenterCode`).d('成本中心'),
                        }),
                      },
                    ],
                  })(
                    <Lov code="AMDM.ASSET_COST_CENTER" queryParams={{ organizationId: tenantId }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          style={{ display: editInventoryFlag ? 'block' : 'none' }}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.InventoryRules`).d('库存管理规则')}</h3>
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
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.negativeBalancesFlag`).d('允许负库存余量')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('negativeBalancesFlag', {
                    initialValue: detailInfo.negativeBalancesFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.movableLocationFlag`).d('是否为移动位置')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('movableLocationFlag', {
                    initialValue: detailInfo.movableLocationFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.pickingFlag`).d('是否为挑库来源')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('pickingFlag', {
                    initialValue: detailInfo.pickingFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.inventoryModeFlag`).d('启用货位管理')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('inventoryModeFlag', {
                    initialValue: detailInfo.inventoryModeFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.addressAndContact`).d('地址与联系方式')}</h3>
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
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={22}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                  label={intl.get(`${modelPrompt}.country`).d('国家')}
                >
                  <Col span={6}>
                    {getFieldDecorator('countryId', {
                      initialValue: detailInfo.countryId,
                    })(
                      <Lov
                        allowClear={false}
                        code="HPFM.COUNTRY"
                        textValue={detailInfo.countryName}
                        onChange={this.handleCountryChange}
                      />
                    )}
                  </Col>
                  {this.isChinaCountry(detailInfo.countryCode) && (
                    <Col span={13} offset={1}>
                      {getFieldDecorator('regionIds', {
                        initialValue: detailInfo.regionIds,
                      })(
                        <Cascader
                          allowClear={false}
                          fieldNames={{ label: 'regionName', value: 'regionId' }}
                          options={cityList}
                          placeholder={intl.get('hzero.common.validation.requireSelect', {
                            name: intl.get('spfm.enterprise.model.legal.registeredRegionId'),
                          })}
                          showSearch={{
                            filter(inputValue, path) {
                              return path.some(
                                option =>
                                  option.regionName
                                    .toLowerCase()
                                    .indexOf(inputValue.toLowerCase()) > -1
                              );
                            },
                          }}
                        />
                      )}
                    </Col>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={21}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                  label={intl.get(`${modelPrompt}.mapAddress`).d('地址')}
                >
                  {getFieldDecorator('mapAddress', {
                    initialValue: detailInfo.mapAddress,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.zipCode`).d('邮编方式')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('zipCode', {
                    initialValue: detailInfo.zipCode,
                    rules: [
                      {
                        pattern: POSTCODE,
                        message: intl
                          .get('amdm.location.view.validation.postcode.number')
                          .d('邮编必须为数字'),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.addressContact1`).d('主要联系方式')}
                >
                  {getFieldDecorator('addressContact1', {
                    initialValue: detailInfo.addressContact1,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...EDIT_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.addressContact2`).d('其他联系方式')}
                >
                  {getFieldDecorator('addressContact2', {
                    initialValue: detailInfo.addressContact2,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.serviceOrgCode`).d('服务机构')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('serviceOrgCode', {
                    initialValue: detailInfo.serviceOrgCode,
                  })(
                    <Lov
                      code="AMDM.SPECIAL_ASSET_CLASS"
                      queryParams={{ organizationId: tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.mapEnabledFlag`).d('开启地图/GIS模式')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('mapEnabledFlag', {
                    initialValue: detailInfo.mapEnabledFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
