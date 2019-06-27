import React, { Component, Fragment } from 'react';
import { Collapse, Form, Input, Row, Col, Icon, Button, Divider, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import intl from 'utils/intl';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import { yesOrNoRender } from 'utils/renderer';
import DetailList from './DetailList';

const { TextArea } = Input;

@Form.create({ fieldNameProp: null })
class InfoExhibit extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: [],
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  @Bind()
  onRemoveSuccess() {
    const { form } = this.props;
    form.setFieldsValue({
      productUrl: null,
    });
  }

  render() {
    const {
      tenantId,
      editFlag,
      dataSource,
      isNew,
      onAddDetailLine,
      onCleanLine,
      onEditLine,
      detailList,
      fieldTypes,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const prefix = `aafm.attributeSet.view.message`;
    const modelPrompt = 'aafm.attributeSet.model.attributeSet';
    const detailListProps = {
      loading,
      tenantId,
      onCleanLine,
      onEditLine,
      fieldTypes,
      editControl: editFlag,
      dataSource: detailList,
    };
    const displayFlag = !isNew || editFlag ? { display: 'block' } : { display: 'none' };
    return (
      <Fragment>
        {isNew ? (
          <React.Fragment>
            <Row>
              <Col span={3}>
                <Icon type="picture" style={{ fontSize: 80 }} />
              </Col>
              <Col span={21}>
                <Row style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {dataSource.attributeSetName}
                  </span>
                </Row>
                <Row>
                  <Col span={7}>
                    <Row>
                      <span>{intl.get(`${prefix}.attributeSetName`).d('名称')}</span>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>{dataSource.attributeSetName}</Row>
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
              defaultActiveKey={['A', 'B']}
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
                        label={intl.get(`aafm.common.model.name`).d('名称')}
                        {...EDIT_FORM_ITEM_LAYOUT}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('attributeSetName', {
                            initialValue: dataSource.attributeSetName,
                            rules: [
                              {
                                required: true,
                                message: intl.get('hzero.common.validation.notNull', {
                                  name: intl.get(`aafm.common.model.name`).d('名称'),
                                }),
                              },
                              {
                                max: 60,
                                message: intl.get('hzero.common.validation.max', {
                                  max: 60,
                                }),
                              },
                            ],
                          })(<Input disabled={isNew} />)
                        ) : (
                          <span>{dataSource.attributeSetName}</span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {...FORM_COL_3_LAYOUT}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.enable`).d('启用')}
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
                  <Row
                    {...EDIT_FORM_ROW_LAYOUT}
                    className={editFlag ? 'inclusion-row' : 'read-row'}
                  >
                    <Col span={22}>
                      <Form.Item
                        label={intl.get(`${modelPrompt}.description`).d('描述')}
                        {...formLayout}
                      >
                        {!isNew || editFlag ? (
                          getFieldDecorator('description', {
                            initialValue: dataSource.description,
                          })(<TextArea rows={2} />)
                        ) : (
                          <span>{dataSource.description}</span>
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
                    <h3>{intl.get(`${prefix}.attributeLine`).d('属性组行')}</h3>
                    <a>
                      {collapseKeys.includes('B')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('B') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Row style={{ margin: '10px' }}>
                  <Col style={displayFlag}>
                    <Button icon="plus" type="primary" onClick={onAddDetailLine}>
                      {intl.get(`aafm.attributeSet.view.button.addLine`).d('添加行')}
                    </Button>
                  </Col>
                </Row>
                <DetailList {...detailListProps} />
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </Fragment>
    );
  }
}
export default InfoExhibit;
