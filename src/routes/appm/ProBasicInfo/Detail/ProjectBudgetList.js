import React, { Component } from 'react';
import { dateRender } from 'utils/renderer';
import { Table, Spin, Col, Row, Divider } from 'hzero-ui';
import { isNull, isUndefined } from 'lodash';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

class ProjectBudgetList extends Component {
  /**
   * 金额转换为千分位并保留两位小数
   */
  @Bind()
  renderAmount(amount) {
    let temp = amount;
    if (!isNull(amount) && !isUndefined(amount)) {
      temp = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    return temp;
  }
  render() {
    const {
      loading,
      initLoading,
      newVersionFlag,
      dataSource,
      onGoToProBudget,
      onGotoNewProBudget,
    } = this.props;
    const promptCode = 'appm.proBasicInfo.model.proBasicInfo';
    const columns = [
      {
        title: intl.get(`${promptCode}.budgetTypeName`).d('预算类型'),
        dataIndex: 'budgetTypeName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.versionNumber`).d('当前版本'),
        dataIndex: 'versionNumber',
        width: 100,
        render: (val, record) => (
          <a onClick={() => onGoToProBudget(record)}>{!isNull(val) ? `V${val}` : ''}</a>
        ),
      },
      {
        title: intl.get(`${promptCode}.description`).d('版本概述'),
        dataIndex: 'description',
        width: 120,
      },
      {
        title: intl.get(`${promptCode}.versionEffect`).d('版本生效日期'),
        dataIndex: 'versionEffect',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${promptCode}.uomName`).d('预算金额/单位'),
        dataIndex: 'uomName',
        width: 120,
        render: (val, record) =>
          !isNull(val) && !isNull(record.budgetAmount) ? `${record.budgetAmount}/${val}` : '',
      },
      {
        title: intl.get(`${promptCode}.history`).d('变更历史'),
        dataIndex: 'history',
        width: 500,
        render: (_, record) => {
          const dataList = record.historyVersion || [];
          const templateList = [];
          for (let i = 0; i < dataList.length; i++) {
            const template = (
              <Col span={4}>
                <Row>
                  <a onClick={() => onGoToProBudget(dataList[i])}>
                    {`${this.renderAmount(dataList[i].budgetAmount)}/${dataList[i].uomName}`}
                  </a>
                </Row>
                <Row>
                  <span>{dateRender(dataList[i].versionEffect)}</span>
                </Row>
                <Row>
                  <span>{`${dataList[i].description} V${dataList[i].versionNumber}`}</span>
                </Row>
                {dataList.length > 3 ? (
                  <Divider dashed style={{ marginTop: 12, marginBottom: 12 }} />
                ) : (
                  ''
                )}
              </Col>
            );
            templateList.push(template);
            if (i + 1 < dataList.length) {
              // 计算差额
              const spread = dataList[i].priceSpread;
              templateList.push(
                <Col span={4}>
                  <Row style={{ marginTop: 20 }}>
                    <span style={{ color: spread > 0 ? '#F04134' : '#00A854' }}>
                      {`${spread > 0 ? '+' : ''}${this.renderAmount(spread)}/${
                        dataList[i].uomName
                      }`}
                    </span>
                  </Row>
                </Col>
              );
            }
          }
          return (
            <Row type="flex" style={{ width: '100%' }}>
              {templateList}
            </Row>
          );
        },
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 120,
        fixed: 'right',
        render: (_, record) => (
          <Spin
            size="small"
            spinning={newVersionFlag === record.budgetTypeId ? initLoading : false}
          >
            <a onClick={() => onGotoNewProBudget(record)}>
              {intl.get(`${promptCode}.editNew`).d('编辑新版本')}
            </a>
          </Spin>
        ),
      },
    ];
    return (
      <Table
        bordered
        scroll={{ x: 1180 }}
        rowKey="budgetTypeId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
export default ProjectBudgetList;
