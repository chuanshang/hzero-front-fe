import React, { PureComponent } from 'react';
import { Table, Button, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';

class AcceptanceRelationList extends PureComponent {
  render() {
    const {
      isNew,
      editFlag,
      AcceptanceRelationPanelReadOnly,
      dataSource,
      onDelete,
      onAcceptanceList,
    } = this.props;
    const promptCode = 'arcv.acceptance.model.acceptanceRelation';
    const columns = [
      {
        title: intl.get(`${promptCode}.acceptanceNum`).d('验收单编号'),
        dataIndex: 'acceptanceNum',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.title`).d('标题概述'),
        dataIndex: 'title',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.acceptanceTypeMeaning`).d('验收类型'),
        dataIndex: 'acceptanceTypeMeaning',
      },
      {
        title: intl.get(`${promptCode}.principalPersonMeaning`).d('负责人'),
        dataIndex: 'principalPersonMeaning',
      },
      {
        title: intl.get(`${promptCode}.acceptanceStatusMeaning`).d('验收状态'),
        dataIndex: 'acceptanceStatusMeaning',
      },
      {
        title: intl.get(`${promptCode}.submitDate`).d('提交日期'),
        dataIndex: 'submitDate',
      },
      {
        title: intl.get(`${promptCode}.completeDate`).d('完成日期'),
        dataIndex: 'completeDate',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        render:
          AcceptanceRelationPanelReadOnly || (!isNew && !editFlag)
            ? null
            : (val, record) => (
              <div>
                <a onClick={() => onDelete(record)}>
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              </div>
              ),
      },
    ];
    return (
      <div>
        {AcceptanceRelationPanelReadOnly || (!isNew && !editFlag) ? null : (
          <Row>
            <Col className="search-btn-more">
              <Button
                onClick={onAcceptanceList}
                className="search-btn-more"
                type="primary"
                style={{ marginBottom: 16, marginRight: 8 }}
              >
                {intl.get('hzero.common.button.selectAcceptance').d('选择')}
              </Button>
            </Col>
          </Row>
        )}
        <Table bordered rowKey="acceptanceRelationId" columns={columns} dataSource={dataSource} />
      </div>
    );
  }
}
export default AcceptanceRelationList;
