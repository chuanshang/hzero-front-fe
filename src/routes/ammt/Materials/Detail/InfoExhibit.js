import React, { Component, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Collapse,
  Icon,
  Select,
  Upload,
  Button,
  InputNumber,
} from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import Switch from 'components/Switch';
import notification from 'utils/notification';
import { isUndefined, isEmpty } from 'lodash';
import uuidv4 from 'uuid/v4';
import ListTable from './ListTable';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class FixedAssetsDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A', 'B', 'C', 'D', 'E', 'F'],
    };
  }

  componentDidMount() {
    // this.props.onRefresh();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/updateState',
      payload: {
        innerList: [],
      },
    });
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  // 新建
  @Bind()
  handleNewLine() {
    const { dispatch, tenantId, materials } = this.props;
    const { innerList } = materials;
    const newItem = {
      itemMaintsitesId: uuidv4(),
      tenantId,
      maintSitesId: '',
      minQty: '',
      maxQty: '',
      leadtimeDay: '',
      _status: 'create',
    };
    dispatch({
      type: 'materials/updateState',
      payload: {
        innerList: [newItem, ...innerList],
      },
    });
  }

  /**
   * 行编辑
   * @param current
   * @param flag
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      materials: { innerList = [] },
    } = this.props;
    const newList = innerList.map(item =>
      item.itemMaintsitesId === current.itemMaintsitesId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'materials/updateState',
      payload: {
        innerList: newList,
      },
    });
  }

  /**
   * 行取消
   * @param current
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      materials: { innerList = [] },
    } = this.props;
    const newList = innerList.filter(item => item.itemMaintsitesId !== current.itemMaintsitesId);
    dispatch({
      type: 'materials/updateState',
      payload: {
        innerList: newList,
      },
    });
  }

  /**
   * 行删除
   * @param record
   */
  @Bind()
  handleDeleteContent(record) {
    const {
      dispatch,
      tenantId,
      materials: { innerList, innerpagination },
    } = this.props;
    const { $form, _status, ...otherProps } = record;
    dispatch({
      type: 'materials/deleteMaterialRow',
      payload: { tenantId, ...otherProps },
    }).then(res => {
      if (res) {
        notification.success();
        const newInnerList = innerList.filter(
          item => item.itemMaintsitesId !== record.itemMaintsitesId
        );
        dispatch({
          type: 'materials/updateState',
          payload: {
            innerList: newInnerList,
            innerpagination: { ...innerpagination, total: innerpagination.total - 1 },
          },
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      productTypeMap,
      uomConversionMap,
      trackingUsedMap,
      pricingUsedMap,
      auxiliaryqtymethodMap,
      defaultDetailItem,
      detailId,
      loading,
      onChange,
      materials: { innerList, innerpagination },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const props2 = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
    };
    const listProp = {
      dataSource: innerList,
      innerpagination,
      loading,
      onChange,
      onCancelLine: this.handleCancelLine,
      onEditLine: this.handleEditLine,
      onDeleteLine: this.handleDeleteContent,
      detailId,
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A', 'B', 'C', 'D', 'E', 'F']}
        className="associated-collapse"
        onChange={this.handleChangeKey.bind(this)}
      >
        <Collapse.Panel
          showArrow={false}
          key="A"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('A') ? 'minus' : 'plus'} />
              <h3>基础信息</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="物料编号" {...formLayout}>
                  {getFieldDecorator('itemNum', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.itemNum,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '物料编号',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="名称" {...formLayout}>
                  {getFieldDecorator('itemName', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.itemName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '名称',
                        }),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="产品类别：" {...formLayout}>
                  {getFieldDecorator('itemCategoryId', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.itemCategoryId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '产品类别',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="AAFM.ASSET_CLASS"
                      textValue={isUndefined(detailId) ? '' : defaultDetailItem.itemCategoryName}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="产品类型" {...formLayout}>
                  {getFieldDecorator('itemTypeCode', {
                    initialValue: isUndefined(detailId) ? 'Good' : defaultDetailItem.itemTypeCode,
                    rules: [],
                  })(
                    <Select>
                      {productTypeMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="品牌/厂商" {...formLayout}>
                  {getFieldDecorator('brand', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.brand,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="规格型号" {...formLayout}>
                  {getFieldDecorator('model', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.model,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="URL" {...formLayout}>
                  {getFieldDecorator('url', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.url,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="可在合同中交易？" {...formLayout}>
                  {getFieldDecorator('contractFlag', {
                    initialValue: isUndefined(detailId) ? 0 : defaultDetailItem.contractFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="限用于分配的服务区域" {...formLayout}>
                  {getFieldDecorator('maintSitesFlag', {
                    initialValue: isUndefined(detailId) ? 0 : defaultDetailItem.maintSitesFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="产品图片" {...formLayout}>
                  {getFieldDecorator('productUrl', {
                    initialValue: '',
                  })(
                    <Upload {...props2}>
                      <Button>
                        <Icon type="upload" /> Upload
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="说明">
                  {getFieldDecorator('description', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.description,
                  })(<TextArea rows={3} />)}
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
              <Icon type={collapseKeys.includes('B') ? 'minus' : 'plus'} />
              <h3>计量单位</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="主计量单位" {...formLayout}>
                  {getFieldDecorator('uomCode', {
                    initialValue: isEmpty(defaultDetailItem) ? '' : defaultDetailItem.uomCode,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '主计量单位',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="HPFM.UOM"
                      textValue={isUndefined(detailId) ? '' : defaultDetailItem.uomName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="单位换算" {...formLayout}>
                  {getFieldDecorator('uomConversionsCode', {
                    initialValue: 'USE_MATERIAL_CONVERSION',
                  })(
                    <Select>
                      {uomConversionMap.map(i => (
                        <Select.Option key={i.value}>{i.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="跟踪时使用" {...formLayout}>
                  {getFieldDecorator('trackingUomCode', {
                    initialValue: 'USE_MAIN_UNIT',
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '跟踪时使用',
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {trackingUsedMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="计价时使用" {...formLayout}>
                  {getFieldDecorator('pricingUomCode', {
                    initialValue: 'USE_MAIN_UNIT',
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '计价时使用',
                        }),
                      },
                    ],
                  })(
                    <Select>
                      {pricingUsedMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="辅助计量单位" {...formLayout}>
                  {getFieldDecorator('aidUomCode', {
                    initialValue: isEmpty(defaultDetailItem) ? '' : defaultDetailItem.aidUomCode,
                  })(
                    <Lov
                      code="HPFM.UOM"
                      textValue={isUndefined(detailId) ? '' : defaultDetailItem.aidUomName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="辅助数量填写方式" {...formLayout}>
                  {getFieldDecorator('aidTypeCode', {
                    initialValue: 'DEFAULT_BE_MODIFIED',
                  })(
                    <Select>
                      {auxiliaryqtymethodMap.map(i => (
                        <Select.Option key={i.value} value={i.value}>
                          {i.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
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
              <Icon type={collapseKeys.includes('C') ? 'minus' : 'plus'} />
              <h3>成本及价格</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="计价币种" {...formLayout}>
                  {getFieldDecorator('currencyCode', {
                    initialValue: isEmpty(defaultDetailItem) ? '' : defaultDetailItem.currencyCode,
                  })(
                    <Lov
                      code="HPFM.CURRENCY"
                      textValue={isUndefined(detailId) ? '' : defaultDetailItem.currencyName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="单位费率" {...formLayout}>
                  {getFieldDecorator('uomRate', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.uomRate,
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="成本" {...formLayout}>
                  {getFieldDecorator('cost', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.cost,
                    rules: [],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="市场价格（估）" {...formLayout}>
                  {getFieldDecorator('price', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.price,
                  })(<InputNumber />)}
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
              <Icon type={collapseKeys.includes('D') ? 'minus' : 'plus'} />
              <h3>库存计划与跟踪规则</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="最小库存量" {...formLayout}>
                  {getFieldDecorator('minQty', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.minQty,
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="最大库存量" {...formLayout}>
                  {getFieldDecorator('maxQty', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.maxQty,
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="订购触发点" {...formLayout}>
                  {getFieldDecorator('orderPoint', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.orderPoint,
                    rules: [],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="启用批次控制" {...formLayout}>
                  {getFieldDecorator('lotControlFlag', {
                    initialValue: isUndefined(detailId) ? 0 : defaultDetailItem.lotControlFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="投退记录到资产BOM上" {...formLayout}>
                  {getFieldDecorator('bomComponetFlag', {
                    initialValue: isUndefined(detailId) ? 0 : defaultDetailItem.bomComponetFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="领用时需以旧换新" {...formLayout}>
                  {getFieldDecorator('tradeInFlag', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.tradeInFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="采购提前天数" {...formLayout}>
                  {getFieldDecorator('leadtimeDay', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.leadtimeDay,
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="E"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('E') ? 'minus' : 'plus'} />
              <h3>其他</h3>
            </Fragment>
          }
        >
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="数据来源" {...formLayout}>
                  {getFieldDecorator('dataSource', {
                    initialValue: isUndefined(detailId) ? '' : defaultDetailItem.dataSource,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8} className="ant-left-48">
                <Form.Item label="数据来源参考" {...formLayout}>
                  {getFieldDecorator('dataSourceReference', {
                    initialValue: isUndefined(detailId)
                      ? ''
                      : defaultDetailItem.dataSourceReference,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel
          showArrow={false}
          key="F"
          header={
            <Fragment>
              <Icon type={collapseKeys.includes('F') ? 'minus' : 'plus'} />
              <h3>服务区域</h3>
            </Fragment>
          }
        >
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col offset={1}>
              <Button
                style={{ backgroundColor: 'rgb(24,144,255)', color: 'white' }}
                onClick={this.handleNewLine}
              >
                新增
              </Button>
            </Col>
          </Row>
          <Row>
            <ListTable {...listProp} />
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
export default FixedAssetsDetail;
