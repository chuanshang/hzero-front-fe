import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Collapse, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import { EDIT_FORM_ITEM_LAYOUT, EDIT_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import Switch from 'components/Switch';

@Form.create({ fieldNameProp: null })
class MaintSitesDetail extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      collapseKeys: ['A'],
    };
  }

  componentDidMount() {
    this.props.onRefresh();
  }

  handleChangeKey(collapseKeys) {
    this.setState({ collapseKeys });
  }

  handleEmptyInput(enabledCodeFlag) {
    if (enabledCodeFlag === 0) {
      this.props.form.setFieldsValue({
        maintSitesCode: null,
      });
    }
  }

  render() {
    const commonPromptCode = 'amdm.maintSites.model.maintSites';
    const {
      dataSource,
      form: { getFieldDecorator },
    } = this.props;
    const { collapseKeys = [] } = this.state;
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['A']}
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
                  label={intl.get(`${commonPromptCode}.maintSitesName`).d('简称')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  <span>{dataSource.maintSitesName}</span>
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.maintSitesDescription`).d('全称')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  <span>{dataSource.maintSitesDescription}</span>
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.sharedAreaFlag`).d('共享区域')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('sharedAreaFlag', {
                    initialValue: dataSource.sharedAreaFlag,
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...EDIT_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonPromptCode}.maintSitesCode`).d('代码')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('maintSitesCode', {
                    rules: [
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', {
                          max: 30,
                        }),
                      },
                    ],
                    initialValue: dataSource.maintSitesCode,
                  })(<Input inputChinese={false} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get('hzero.common.status.enabledFlag').d('启用')}
                  {...EDIT_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('enabledFlag', {
                    initialValue: dataSource.enabledFlag,
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
export default MaintSitesDetail;
