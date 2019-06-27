import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Select, Row, Col, Icon, Divider, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull, isEmpty } from 'lodash';
import Lov from 'components/Lov';
import Upload from 'components/Upload/UploadButton';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import {
  EDIT_FORM_ITEM_LAYOUT,
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from 'utils/constants';
import { getAttachmentUrl } from 'utils/utils';

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  uploadButton;
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C', 'D'],
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
    const { form, tenantId } = this.props;
    if (file) {
      form.setFieldsValue({
        productUrl: getAttachmentUrl(file.response, 'aafm-product', tenantId, ''),
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
  uploadRef(upload) {
    this.uploadButton = upload;
  }

  /**
   * 拼接资产全称：产品名称.品牌/厂商.规格型号
   * @param {object}  - event 事件对象
   */
  @Bind()
  handleMakeAssetName(event) {
    let assetsSetName = '';
    const { assetName = '', brand = '', specifications = '' } = this.props.form.getFieldsValue();
    const { id, value = '' } = event.target;
    switch (id) {
      case 'assetName':
        assetsSetName = `${value}${isEmpty(brand) ? '' : `.${brand}`}${
          isEmpty(specifications) ? '' : `.${specifications}`
        }`;
        break;
      case 'brand':
        assetsSetName = `${assetName}${isEmpty(value) ? '' : `.${value}`}${
          isEmpty(specifications) ? '' : `.${specifications}`
        }`;
        break;
      case 'specifications':
        assetsSetName = `${assetName}${isEmpty(brand) ? '' : `.${brand}`}${
          isEmpty(value) ? '' : `.${value}`
        }`;
        break;
      default:
    }
    this.props.form.setFieldsValue({
      assetsSetName,
    });
  }

  render() {
    const {
      isNew,
      editFlag,
      tenantId,
      dataSource,
      specialAsset,
      nameplateRule,
      assetCriticality,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const { productUrl } = dataSource;
    const fileList = [];
    if (productUrl && this.uploadButton) {
      fileList.push({
        uid: productUrl,
        name: productUrl,
        thumbUrl: productUrl,
        url: productUrl,
      });
    }
    const prefix = `aafm.assetSet.model.assetSet`;
    const displayFlag = editFlag ? { display: 'block' } : { display: 'none' };
    return (
      <React.Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {dataSource.assetsSetName}
                  </span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.assetsSetName`).d('资产组名称')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetsSetName}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.assetClass`).d('产品类别/资产分类')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.assetClassMeaning}</Row>
                  </Col>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.fixedAssetTypeCode`).d('固定资产类别')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.fixedAssetTypeCodeMeaning}</Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider style={{ marginTop: 5, marginBottom: 0 }} />
          </React.Fragment>
        ) : (
          ''
        )}
        <Tabs defaultActiveKey="basicTab">
          <Tabs.TabPane
            tab={intl.get(`${prefix}.tab.basicTab`).d('基本')}
            key="basicTab"
            style={{ height: window.screen.availHeight / 2, overflow: 'auto' }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={['A', 'B', 'C', 'D']}
              className="form-collapse"
              onChange={this.handleChangeKey.bind(this)}
            >
              <Collapse.Panel
                showArrow={false}
                key="A"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.A`).d('基础信息')}</h3>
                    <a>
                      {collapseKeys.includes('A')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('A') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetName`).d('资产名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetName', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetName`).d('资产名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.assetName,
                          })(<Input trimAll id="assetName" onChange={this.handleMakeAssetName} />)
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
                          })(<Input trimAll id="brand" onChange={this.handleMakeAssetName} />)
                        ) : (
                          <span>{dataSource.brand}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.specifications`).d('规格型号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('specifications', {
                            initialValue: dataSource.specifications,
                          })(
                            <Input
                              trimAll
                              id="specifications"
                              onChange={this.handleMakeAssetName}
                            />
                          )
                        ) : (
                          <span>{dataSource.specifications}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`aafm.common.model.num`).d('编号')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetsSetNum', {
                            initialValue: dataSource.assetsSetNum,
                            rules: [
                              {
                                required: isNull(getFieldValue('assetsSetNum')),
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`aafm.common.model.num`).d('编号'),
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
                              disabled={isNew || getFieldValue('needCodeRule') === 1}
                              inputChinese={false}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetsSetNum}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetsSetName`).d('资产组名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetsSetName', {
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetsSetName`).d('资产组名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                            initialValue: dataSource.assetsSetName,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.assetsSetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.assetClassId`).d('产品类别/资产分类')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('assetClassId', {
                            initialValue: dataSource.assetClassId,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.assetClassId`).d('产品类别/资产分类'),
                                }),
                              },
                            ],
                          })(
                            <Lov
                              code="AAFM.ASSET_CLASS"
                              queryParams={{ organizationId: tenantId }}
                              textValue={dataSource.assetClassMeaning}
                            />
                          )
                        ) : (
                          <span>{dataSource.assetClassMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.icon`).d('图标')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {getFieldDecorator('icon', {
                          initialValue: dataSource.icon,
                        })(<div />)}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.enabledFlag`).d('启用')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('enabledFlag', {
                            initialValue: dataSource.enabledFlag,
                          })(<Switch />)
                        ) : (
                          <span>{yesOrNoRender(dataSource.enabledFlag)}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="B"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.B`).d('详细信息')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${prefix}.url`).d('URL')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('url', {
                            initialValue: dataSource.url,
                          })(<Input />)
                        ) : (
                          <span>{dataSource.url}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${prefix}.description`).d('说明')}
                        {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                          })(<Input.TextArea rows={3} />)
                        ) : (
                          <span>{dataSource.description}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.productUrl`).d('产品图片')}
                        extra={intl
                          .get('hzero.common.upload.support', { type: '*.jpg;*.png;*.jpeg;*.pdf' })
                          .d('上传格式：*.jpg;*.png;*.jpeg;*.pdf')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {getFieldDecorator('productUrl', {
                          initialValue: dataSource.productUrl,
                        })(<div />)}
                        <Upload
                          multiple
                          style={displayFlag}
                          onRef={this.uploadRef}
                          fileType="image/jpeg;image/png"
                          bucketName="aafm-product"
                          fileList={fileList}
                          onUploadSuccess={this.onUploadSuccess}
                          onRemoveSuccess={this.onRemoveSuccess}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="C"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.C`).d('资产跟踪规则')}</h3>
                    <a>
                      {collapseKeys.includes('C')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('C') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.nameplateRuleCode`).d('资产标签/铭牌规则')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('nameplateRuleCode', {
                            initialValue: dataSource.nameplateRuleCode,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl
                                    .get(`${prefix}.nameplateRuleCode`)
                                    .d('资产标签/铭牌规则'),
                                }),
                              },
                            ],
                          })(
                            <Select>
                              {nameplateRule.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.nameplateRuleMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.specialAssetClassId`).d('资产专业分类')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('specialAssetClassId', {
                            initialValue: dataSource.specialAssetClassId,
                          })(
                            <Lov
                              code="AAFM.SPECIAL_ASSET_CLASS"
                              textValue={dataSource.specialAssetClassMeaning}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.specialAssetClassMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.fixedAssetTypeCode`).d('固定资产类别')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('fixedAssetTypeCode', {
                            initialValue: dataSource.fixedAssetTypeCode,
                          })(
                            <Lov
                              code="AAFM.FIXED_ASSET_TYPE"
                              textValue={dataSource.fixedAssetTypeCodeMeaning}
                              queryParams={{ organizationId: tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.fixedAssetTypeCodeMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.attributeSet`).d('属性组')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('attributeSetId', {
                            initialValue: dataSource.attributeSetId,
                          })(
                            <Lov
                              code="AAFM.ATTRIBUTE_SET"
                              textValue={dataSource.attributeSetMeaning}
                              queryParams={{ tenantId }}
                            />
                          )
                        ) : (
                          <span>{dataSource.attributeSetMeaning}</span>
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
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`${prefix}.specialAssetCode`).d('所属特殊资产'),
                                }),
                              },
                            ],
                          })(
                            <Select>
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
                </Form>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="D"
                header={
                  <Fragment>
                    <h3>{intl.get(`${prefix}.panel.D`).d('资产默认属性')}</h3>
                    <a>
                      {collapseKeys.includes('D')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('D') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Form>
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${prefix}.maintainFlag`).d('可维修')}
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
                            <Select>
                              {assetCriticality.map(i => (
                                <Select.Option key={i.value}>{i.meaning}</Select.Option>
                              ))}
                            </Select>
                          )
                        ) : (
                          <span>{dataSource.assetCriticalityMeaning}</span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
export default InfoExhibit;
