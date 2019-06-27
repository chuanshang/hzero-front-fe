import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';

class FullTextSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: '',
    };
  }
  componentDidMount() {
    this.handleSearch();
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
    const commonModelPrompt = 'amdm.maintSites.model.maintSites';
    const { dataSource, pagination, loading, onGotoDetail } = this.props;
    const columns = [
      {
        render: (val, record) => (
          <Fragment>
            <Row>
              <Col span={18}>
                <Row>
                  <a
                    style={{ display: 'flex', fontSize: 16 }}
                    onClick={() => onGotoDetail(record.maintSitesId)}
                  >
                    {record.maintSitesName}
                  </a>
                </Row>
                <Row>
                  <Col span={14}>
                    <span>{record.maintSitesDescription}</span>
                  </Col>
                  <Col span={4}>
                    <span>{record.maintSitesCode}</span>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <span style={{ display: 'flex', marginTop: 10, marginLeft: 5 }}>
                  {enableRender(record.enabledFlag)}
                </span>
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
          placeholder={intl.get(`${commonModelPrompt}.search`).d('搜索区域')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <Table
          bordered
          rowKey="maintSitesId"
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
