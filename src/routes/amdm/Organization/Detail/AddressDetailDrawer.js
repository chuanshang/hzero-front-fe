import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Cascader } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { isUndefined } from 'lodash';

/**
 * 组织-地址-新建滑窗(抽屉)
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} anchor - 抽屉滑动位置
 * @reactProps {string} title - 抽屉标题
 * @reactProps {boolean} visible - 抽屉是否可见
 * @reactProps {Function} onOk - 抽屉确定操作
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class AddressDetailDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      maintSitesName: undefined,
      locationName: undefined,
      countryName: undefined,
      currentCountry: null,
      createOrUpdateLocationFlag: 0,
      createOrUpdateSiteFlag: 0,
    };
  }

  /**
   * 组件属性定义
   */
  static propTypes = {
    anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };
  /**
   * 组件属性默认值设置
   */
  static defaultProps = {
    anchor: 'right',
    title: '',
    visible: false,
    onOk: e => e,
    onCancel: e => e,
  };
  /**
   * 确定操作
   */
  @Bind()
  saveBtn() {
    const { form, onOk, targetItem } = this.props;
    if (onOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 校验通过，进行保存操作
          const { regionIds } = values;
          const regionId = regionIds && regionIds.length && regionIds[regionIds.length - 1];
          const {
            maintSitesName,
            locationName,
            countryName,
            createOrUpdateLocationFlag,
            createOrUpdateSiteFlag,
          } = this.state;
          onOk({
            ...targetItem,
            ...values,
            regionId,
            createOrUpdateLocationFlag,
            createOrUpdateSiteFlag,
            maintSitesName: isUndefined(maintSitesName)
              ? targetItem.maintSitesName
              : maintSitesName,
            locationName: isUndefined(locationName) ? targetItem.locationName : locationName,
            countryName: isUndefined(countryName) ? targetItem.countryName : countryName,
          });
        }
      });
    }
    this.setState({
      countryName: undefined,
    });
  }
  /**
   * 选择位置时，自动带出国家、省、市、邮编和主要联系方式等信息
   * @param {*} record 选择的位置lov对应的数据
   */
  @Bind()
  handleSelectLocation(_, record) {
    if (!isUndefined(record)) {
      this.props.form.setFieldsValue({
        country: record.countryName,
        region: record.region,
        mapAddress: record.mapAddress,
        zipCode: record.zipCode,
        contactWay: record.contactWay,
      });
    }
    this.setState({ locationName: record.locationName, createOrUpdateLocationFlag: 1 });
  }

  /**
   * 设置name用于AddressList的数据展示
   * @param {*} record 选中的lov对应的数据
   */
  @Bind()
  setName(_, record) {
    if (!isUndefined(record.maintSitesId)) {
      // 服务区域
      this.setState({ maintSitesName: record.maintSitesName, createOrUpdateSiteFlag: 1 });
    }
  }

  @Bind
  handleCountryChange(_, record) {
    this.setState({
      currentCountry: record,
      countryName: record.countryName,
    });
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

  /**
   * 根据regionId查出之前的省市id数组
   * @param {Number}  id - 省市区末位id
   * @param {Array}  cityList - 城市集合
   * return {Array} 地区集合
   */
  fetchRegionIds(id, cityList = []) {
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
    return stack.reverse().map(item => item.regionId);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonPromptCode = 'amdm.organization.model.organization';
    const {
      anchor,
      tenantId,
      visible,
      title,
      form,
      loading,
      onCancel,
      targetItem,
      cityList = [],
    } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const regionIds = this.fetchRegionIds(targetItem.regionId, cityList);
    return (
      <Modal
        destroyOnClose
        title={title}
        width={450}
        wrapClassName={`ant-modal-sidebar-${anchor}`}
        transitionName={`move-${anchor}`}
        visible={visible}
        confirmLoading={loading}
        onOk={this.saveBtn}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        onCancel={onCancel}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      >
        <Form>
          <Form.Item
            label={intl.get(`${commonPromptCode}.maintSitesName`).d('服务区域')}
            {...formLayout}
          >
            {getFieldDecorator('maintSitesId', {
              initialValue: targetItem.maintSitesId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.maintSites`).d('服务区域'),
                  }),
                },
              ],
            })(
              <Lov
                code="AMDM.ASSET_MAINT_SITE"
                queryParams={{ organizationId: tenantId }}
                textValue={targetItem.maintSitesName}
                onChange={this.setName}
              />
            )}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.locationName`).d('位置名称')}
            {...formLayout}
          >
            {getFieldDecorator('assetLocationId', {
              initialValue: targetItem.assetLocationId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonPromptCode}.locationName`).d('位置名称'),
                  }),
                },
              ],
            })(
              <Lov
                code="AMDM.LOCATIONS"
                queryParams={{ organizationId: tenantId }}
                onChange={this.handleSelectLocation}
                textValue={targetItem.locationName}
              />
            )}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.country`).d('国家')} {...formLayout}>
            {getFieldDecorator('countryId', {
              initialValue: targetItem.countryId,
            })(
              <Lov
                code="HPFM.COUNTRY"
                queryParams={{ organizationId: tenantId }}
                textValue={targetItem.countryName}
                onChange={this.handleCountryChange}
              />
            )}
          </Form.Item>
          {this.isChinaCountry(targetItem.countryCode) && (
            <Form.Item label={intl.get(`${commonPromptCode}.region`).d('省/市/区')} {...formLayout}>
              {getFieldDecorator('regionIds', {
                initialValue: regionIds,
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
                          option.regionName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                      );
                    },
                  }}
                />
              )}
            </Form.Item>
          )}
          <Form.Item label={intl.get(`${commonPromptCode}.mapAddress`).d('地址')} {...formLayout}>
            {getFieldDecorator('mapAddress', {
              initialValue: targetItem.mapAddress,
              rules: [
                {
                  max: 480,
                  message: intl.get('hzero.common.validation.max', {
                    max: 480,
                  }),
                },
              ],
            })(<Input.TextArea rows={3} />)}
          </Form.Item>
          <Form.Item label={intl.get(`${commonPromptCode}.zipCode`).d('邮编')} {...formLayout}>
            {getFieldDecorator('zipCode', {
              initialValue: targetItem.zipCode,
              rules: [
                {
                  max: 30,
                  message: intl.get('hzero.common.validation.max', {
                    max: 30,
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={intl.get(`${commonPromptCode}.contactWay`).d('主要联系方式')}
            {...formLayout}
          >
            {getFieldDecorator('contactWay', {
              initialValue: targetItem.contactWay,
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
          <Form.Item
            label={intl.get(`${commonPromptCode}.mapEnabledFlag`).d('开启地图/GIS模式')}
            {...formLayout}
          >
            {getFieldDecorator('mapEnabledFlag', {
              initialValue: targetItem.mapEnabledFlag,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label={intl.get('hzero.common.status.enabledFlag').d('启用')} {...formLayout}>
            {getFieldDecorator('enabledFlag', {
              initialValue: targetItem.enabledFlag,
            })(<Switch />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default AddressDetailDrawer;
