import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

class FullTextSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: '',
    };
  }
  componentDidMount() {
    if (!isUndefined(this.props.templateCode)) {
      this.handleSearch();
    }
  }
  @Bind()
  handleSearch(param) {
    this.props.onSearch(param, {});
  }
  @Bind()
  handleChangeCondition(event) {
    this.setState({ condition: event.target.value });
  }
  @Bind()
  handlePageSearch(page) {
    const { condition } = this.state;
    this.props.onSearch(condition, page);
  }
  render() {
    const { dataSource, pagination, loading, onGotoDetail } = this.props;
    const columns = [
      {
        dataIndex: 'projectName',
        render: (val, record) => (
          <Fragment>
            <Row>
              <Col>
                <a
                  style={{ display: 'flex', fontSize: 16 }}
                  onClick={() => onGotoDetail(record.templateCode)}
                >
                  {record.templateName}
                </a>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>{record.templateCode}</span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>{record.proTypeName}</span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>{record.budgetTypeName}</span>
              </Col>
            </Row>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('appa.common.view.option.search').d('搜索区域')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <Table
          bordered
          rowKey="templateId"
          className="budget-template-full-search"
          loading={loading}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            size: 'small',
          }}
          columns={columns}
          scroll={{ y: 410 }}
          onChange={this.handlePageSearch}
        />
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
