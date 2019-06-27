import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Select, Button } from 'hzero-ui';
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
import { isEmpty, isUndefined } from 'lodash';
import uuidv4 from 'uuid/v4';
import ServiceZoneList from './ServiceZoneList';
import AddressList from './AddressList';
import AddressDetailDrawer from './AddressDetailDrawer';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: [],
      addressItem: {},
      defaultAddressItem: {
        mapEnabledFlag: 0,
        enabledFlag: 1,
      },
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  /**
   * 新增地址信息
   */
  @Bind
  handleAddAddress() {
    this.setState({ drawerVisible: true, addressItem: {} });
  }

  /**
   * 编辑地址信息
   */
  @Bind()
  handleEditAddress(record) {
    this.setState({ drawerVisible: true, addressItem: record });
  }

  /**
   * Drawer close
   */
  @Bind()
  handleDrawerCancel() {
    this.setState({ drawerVisible: false, addressItem: {} });
  }

  /**
   * Drawer Ok
   * @param {obejct} values - 操作数据对象
   */
  @Bind()
  handleDrawerOk(values = {}) {
    const { dispatch, addressList } = this.props;
    if (isUndefined(values.orgToLocationId)) {
      // 新建
      const id = uuidv4();
      dispatch({
        type: 'organization/updateState',
        payload: {
          addressList: [{ ...values, orgToLocationId: id, _status: 'create' }, ...addressList],
        },
      });
    } else {
      // 编辑
      const newList = addressList.map(item =>
        item.orgToLocationId === values.orgToLocationId
          ? { ...item, ...values, _status: item._status !== 'create' ? 'update' : item._status }
          : item
      );
      dispatch({
        type: 'organization/updateState',
        payload: {
          addressList: [...newList],
        },
      });
    }
    this.setState({ drawerVisible: false, addressItem: {} });
  }

  /**
   * 根据regionId查出之前的省市name数组
   * @param {Number}  id - 省市区末位id
   * @param {Array}  cityList - 城市集合
   * return {Array} 地区集合
   */
  fetchRegionNames(id, cityList = []) {
    if (!id) return;
    const stack = [];
    const deepSearch = children => {
      let found = false;
      children.forEach(item => {
        if (!found) {
          if (item.regionId === id) {
            found = true;
          } else if (!found && item.children && item.children.length > 0) {
            found = deepSearch(item.children);
          }
          if (found) stack.push(item);
        }
      });
      return found;
    };
    deepSearch(cityList);
    return stack.reverse().map(item => item.regionName);
  }

  setRegionName(addressList) {
    const { cityList } = this.props;
    const newAddressList = addressList.map(item => {
      if (item.regionId) {
        const regionNames = this.fetchRegionNames(item.regionId, cityList);
        return { ...item, regionName: regionNames.toString() };
      } else {
        return { ...item };
      }
    });
    return [...newAddressList];
  }

  render() {
    // const EMAIL = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;  // [TODO]
    const modelPrompt = 'amdm.organization.model.organization';
    const {
      tenantId,
      isCreateFlag,
      serviceZoneListLoading,
      onCleanAddress,
      onCleanServiceZoneLine,
      onEditServiceZoneLine,
      onAddServiceZoneLine,
      orgTypes,
      detailInfo = {},
      addressList = [],
      serviceZoneList = [],
      cityList = [],
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const newAddressList = this.setRegionName(addressList);
    const {
      defaultAddressItem,
      addressItem,
      collapseKeys = [],
      drawerVisible = false,
    } = this.state;
    const addressListProps = {
      cityList,
      dataSource: newAddressList,
      onCleanLine: onCleanAddress,
      onEditLine: this.handleEditAddress,
    };
    const serviceZoneListProps = {
      tenantId,
      onEditLine: onEditServiceZoneLine,
      onCleanLine: onCleanServiceZoneLine,
      loading: serviceZoneListLoading,
      dataSource: serviceZoneList,
    };
    const addressDrawerProps = {
      cityList,
      tenantId,
      targetItem: isEmpty(addressItem) ? defaultAddressItem : addressItem,
      title: intl.get('amdm.organization.view.message.drawer').d('地址详情'),
      anchor: 'right',
      maskClosable: false,
      visible: drawerVisible,
      onCancel: this.handleDrawerCancel,
      onOk: this.handleDrawerOk,
    };
    const prefix = 'amdm.organization.view.message';
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
                  label={intl.get(`${modelPrompt}.orgType`).d('组织类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('orgTypeCode', {
                    initialValue: detailInfo.orgTypeCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.orgType`).d('组织类型'),
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {orgTypes.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.customerFlag`).d('是否客户')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('customerFlag', {
                    initialValue: detailInfo.isCustomer,
                    rules: [],
                  })(<Switch disabled={getFieldValue('orgTypeCode') !== 'EXTERNAL_ORG'} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.supplierFlag`).d('供应商')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('supplierFlag', {
                    initialValue: detailInfo.isSupplier,
                  })(<Switch disabled={getFieldValue('orgTypeCode') !== 'EXTERNAL_ORG'} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.orgNum`).d('组织编号')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('orgNum', {
                    initialValue: detailInfo.orgNum,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.orgNum`).d('组织编号'),
                        }),
                      },
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', {
                          max: 30,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.orgName`).d('组织简称/简码')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('orgName', {
                    initialValue: detailInfo.orgName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.orgName`).d('组织简称/简码'),
                        }),
                      },
                      {
                        max: 150,
                        message: intl.get('hzero.common.validation.max', {
                          max: 150,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.parentOrg`).d('上级组织')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('parentOrgId', {
                    initialValue: detailInfo.parentOrgId,
                  })(
                    isCreateFlag || getFieldValue('orgTypeCode') !== 'INTERNAL_ORG' ? (
                      <span>{detailInfo.parentOrganizationName}</span>
                    ) : (
                      <Lov
                        code="AMDM.ORGANIZATION"
                        queryParams={{ organizationId: tenantId }}
                        textValue={detailInfo.parentOrganizationName}
                      />
                    )
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col span={21}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.orgFullName`).d('组织全称')}
                  {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                >
                  {getFieldDecorator('orgFullName', {
                    initialValue: detailInfo.orgFullName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.orgFullName`).d('组织全称'),
                        }),
                      },
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.orgLevel`).d('组织级别')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('orgLevelCode', {
                    initialValue: detailInfo.orgLevelCode,
                  })(
                    getFieldValue('orgTypeCode') !== 'EXTERNAL_ORG' ? (
                      <span>{detailInfo.orgLevelCode}</span>
                    ) : (
                      <Lov
                        code="AMDM.ORGANIZATION_LEVEL"
                        queryParams={{ organizationId: tenantId }}
                      />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.businessType`).d('业务类型')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('businessTypeCode', {
                    initialValue: detailInfo.businessTypeCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.businessType`).d('业务类型'),
                        }),
                      },
                    ],
                  })(<Lov code="AMDM.BUSINESS_TYPE" queryParams={{ organizationId: tenantId }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.legalPersonFlag`).d('是否法人')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('legalPersonFlag', {
                    initialValue: detailInfo.legalPersonFlag,
                  })(<Switch disabled={getFieldValue('orgTypeCode') !== 'INTERNAL_ORG'} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.bookName`).d('财务账簿')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('bookNameId', {
                    initialValue: detailInfo.bookName,
                  })(
                    getFieldValue('orgTypeCode') !== 'INTERNAL_ORG' ? (
                      <span>{detailInfo.bookName}</span>
                    ) : (
                      <Lov code="AMDM.FINANCIAL_BOOKS" queryParams={{ organizationId: tenantId }} />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.costCenterCode`).d('成本中心')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('costCenterCode', {
                    initialValue: detailInfo.costCenterCode,
                  })(
                    getFieldValue('orgTypeCode') !== 'INTERNAL_ORG' ? (
                      <span>{detailInfo.costCenterCode}</span>
                    ) : (
                      <Lov
                        code="AAFM.ASSET_COST_CENTER"
                        queryParams={{ organizationId: tenantId }}
                      />
                    )
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.assetOrgFlag`).d('可分配使用资产')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('assetOrgFlag', {
                    initialValue: detailInfo.assetOrgFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.outServicesFlag`).d('可提供委外服务')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('outServicesFlag', {
                    initialValue: detailInfo.outServicesFlag,
                  })(<Switch disabled={getFieldValue('orgTypeCode') !== 'EXTERNAL_ORG'} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.leader`).d('负责人信息')}</h3>
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
                  label={intl.get(`${modelPrompt}.contactName`).d('负责人姓名')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('contactName', {
                    initialValue: detailInfo.contactName,
                    rules: [
                      {
                        max: 255,
                        message: intl.get('hzero.common.validation.max', {
                          max: 255,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.phoneOffice`).d('电话')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('phoneOffice', {
                    initialValue: detailInfo.phoneOffice,
                    rules: [
                      {
                        max: 60,
                        message: intl.get('hzero.common.validation.max', {
                          max: 60,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.contactFax`).d('传真')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('contactFax', {
                    initialValue: detailInfo.contactFax,
                    rules: [
                      {
                        max: 60,
                        message: intl.get('hzero.common.validation.max', {
                          max: 60,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.website`).d('网站')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('website', {
                    initialValue: detailInfo.website,
                    rules: [
                      {
                        max: 240,
                        message: intl.get('hzero.common.validation.max', {
                          max: 240,
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.email`).d('邮箱')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  <span>{detailInfo.email}</span>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.address`).d('地址')}</h3>
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
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col>
              <Button
                icon="plus"
                type="primary"
                style={{ margin: '10px' }}
                onClick={() => this.handleAddAddress()}
              >
                {intl.get(`amdm.organization.view.button.addLine`).d('新增')}
              </Button>
            </Col>
          </Row>
          <AddressList {...addressListProps} />
          <AddressDetailDrawer {...addressDrawerProps} />
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          header={
            <Fragment>
              <h3>{intl.get(`${prefix}.linkedServiceZone`).d('关联服务区域')}</h3>
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
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col>
              <Button
                icon="plus"
                style={{ margin: '10px' }}
                type="primary"
                onClick={() => onAddServiceZoneLine()}
              >
                {intl.get(`amdm.organization.view.button.addLine`).d('新增')}
              </Button>
            </Col>
          </Row>
          <ServiceZoneList {...serviceZoneListProps} />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default InfoExhibit;
