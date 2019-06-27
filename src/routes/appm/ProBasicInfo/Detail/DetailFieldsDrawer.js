import React, { PureComponent } from 'react';
import { Drawer, Form, Button, Input, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getDateFormat, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

@Form.create({ fieldNameProp: null })
class DetailFieldsDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      roleName: undefined, // 角色
      orgName: undefined, // 组织
      staffName: undefined, // 人员
      staffId: undefined, // 人员id
      planPermissionsCodeMeaning: '', // 计划权限
      changePermissionsCodeMeaning: '', // 变更权限
      orderFlag: '', // 可下单
      convertAssetFlag: '', // 可转资
      prepareBudgetFlag: '', // 可编制预算
    };
  }
  /**
   * 确认操作
   */
  @Bind()
  handleOk() {
    const { form, projectSourceDetail, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const { startDate, endDate } = fieldsValue;
        const {
          roleName,
          orgName,
          staffId,
          staffName,
          planPermissionsCodeMeaning,
          changePermissionsCodeMeaning,
          orderFlag,
          convertAssetFlag,
          prepareBudgetFlag,
        } = this.state;
        onOk({
          ...projectSourceDetail,
          ...fieldsValue,
          planPermissionsCodeMeaning,
          changePermissionsCodeMeaning,
          orderFlag,
          convertAssetFlag,
          prepareBudgetFlag,
          startDate: startDate ? moment(startDate).format(getDateTimeFormat()) : null,
          endDate: endDate ? moment(endDate).format(getDateTimeFormat()) : null,
          proRoleName: isUndefined(roleName) ? projectSourceDetail.proRoleName : roleName,
          orgName: isUndefined(orgName) ? projectSourceDetail.orgName : orgName,
          staffName: isUndefined(staffName) ? projectSourceDetail.staffName : staffName,
          staffId: isUndefined(staffId) ? projectSourceDetail.staffId : staffId,
        });
      }
    });
  }
  /**
   * 设置name用于DetailList的数据展示
   * @param {*} record 选中的lov对应的数据
   */
  @Bind()
  setName(_, record) {
    if (!isUndefined(record.proRoleId)) {
      // 角色
      this.setState({
        roleName: record.roleName,
        planPermissionsCodeMeaning: record.planPermissionsCodeMeaning,
        changePermissionsCodeMeaning: record.changePermissionsCodeMeaning,
        orderFlag: record.orderFlag,
        convertAssetFlag: record.convertAssetFlag,
        prepareBudgetFlag: record.prepareBudgetFlag,
      });
    }
    if (!isUndefined(record.orgId)) {
      // 组织
      this.setState({ orgName: record.orgName });
    }
    if (!isUndefined(record.employeeId)) {
      // 人员
      this.setState({
        staffId: record.employeeId,
        staffName: record.name,
      });
    }
  }
  renderForm() {
    const promptCode = 'aafm.proBasicInfo.model.proBasicInfo';
    const {
      tenantId,
      onHideDrawer,
      projectSourceDetail,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="more-fields-form">
        <Form.Item label={intl.get(`${promptCode}.roleName`).d('角色')} {...formLayout}>
          {getFieldDecorator('proRoleId', {
            initialValue: projectSourceDetail.proRoleId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.roleName`).d('角色'),
                }),
              },
            ],
          })(
            <Lov
              code="APPM.PROJECT_ROLE"
              queryParams={{ organizationId: tenantId }}
              textValue={projectSourceDetail.proRoleName}
              onChange={this.setName}
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.grouping`).d('分组')} {...formLayout}>
          {getFieldDecorator('grouping', {
            initialValue: projectSourceDetail.grouping,
          })(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.orgName`).d('组织')} {...formLayout}>
          {getFieldDecorator('orgId', {
            initialValue: projectSourceDetail.orgId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.orgName`).d('组织'),
                }),
              },
            ],
          })(
            <Lov
              code="AMDM.ORGANIZATION"
              queryParams={{ organizationId: tenantId }}
              textValue={projectSourceDetail.orgName}
              onChange={this.setName}
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.staffCode`).d('人员')} {...formLayout}>
          {getFieldDecorator('staffId', {
            initialValue: projectSourceDetail.staffId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.staffCode`).d('人员'),
                }),
              },
            ],
          })(
            <Lov
              code="HPFM.EMPLOYEE"
              queryParams={{ tenantId }}
              textValue={projectSourceDetail.staffName}
              onChange={this.setName}
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.startDate`).d('开始日期')} {...formLayout}>
          {getFieldDecorator('startDate', {
            initialValue: !isUndefined(projectSourceDetail.startDate)
              ? moment(projectSourceDetail.startDate, getDateFormat())
              : null,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.startDate`).d('开始日期'),
                }),
              },
            ],
          })(
            <DatePicker
              placeholder=""
              style={{ width: '100%' }}
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('endDate') &&
                moment(getFieldValue('endDate')).isBefore(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.endDate`).d('结束日期')} {...formLayout}>
          {getFieldDecorator('endDate', {
            initialValue: !isUndefined(projectSourceDetail.endDate)
              ? moment(projectSourceDetail.endDate, getDateFormat())
              : null,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get(`${promptCode}.endDate`).d('结束日期'),
                }),
              },
            ],
          })(
            <DatePicker
              placeholder=""
              style={{ width: '100%' }}
              format={getDateFormat()}
              disabledDate={currentDate =>
                getFieldValue('startDate') &&
                moment(getFieldValue('startDate')).isAfter(currentDate, 'day')
              }
            />
          )}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.phone`).d('工作电话')} {...formLayout}>
          {getFieldDecorator('phone', {
            initialValue: projectSourceDetail.phone,
            rules: [
              {
                max: 30,
                message: intl.get('hzero.common.validation.max', {
                  max: 30,
                }),
              },
            ],
          })(<Input inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.email`).d('电子邮件')} {...formLayout}>
          {getFieldDecorator('email', {
            initialValue: projectSourceDetail.email,
          })(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.projectPhone`).d('项目工作电话')} {...formLayout}>
          {getFieldDecorator('projectPhone', {
            initialValue: projectSourceDetail.projectPhone,
            rules: [
              {
                max: 30,
                message: intl.get('hzero.common.validation.max', {
                  max: 30,
                }),
              },
            ],
          })(<Input inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.projectEmail`).d('项目电子邮件')} {...formLayout}>
          {getFieldDecorator('projectEmail', {
            initialValue: projectSourceDetail.projectEmail,
            rules: [
              {
                max: 100,
                message: intl.get('hzero.common.validation.max', {
                  max: 100,
                }),
              },
            ],
          })(<Input inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get(`${promptCode}.description`).d('描述')} {...formLayout}>
          {getFieldDecorator('description', {
            initialValue: projectSourceDetail.description,
            rules: [
              {
                max: 240,
                message: intl.get('hzero.common.validation.max', {
                  max: 240,
                }),
              },
            ],
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => this.handleOk()}
          >
            {intl.get('hzero.common.button.sure').d('确认')}
          </Button>
          <Button onClick={() => onHideDrawer()}>
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
  render() {
    const { visible, onHideDrawer } = this.props;
    const drawerProps = {
      title: intl.get('aafm.proBasicInfo.view.drawer.title').d('项目资源详情'),
      visible,
      mask: true,
      onClose: () => onHideDrawer(),
      width: 450,
      style: {
        height: 'calc(100% - 103px)',
        overflow: 'auto',
        padding: 12,
      },
    };
    return (
      <Drawer destroyOnClose {...drawerProps}>
        {this.renderForm()}
      </Drawer>
    );
  }
}
export default DetailFieldsDrawer;
