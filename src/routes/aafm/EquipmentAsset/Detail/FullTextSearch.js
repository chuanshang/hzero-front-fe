import React, { Component, Fragment } from 'react';
import { Input, Table, Row, Col, Tag, Icon } from 'hzero-ui';
import intl from 'utils/intl';
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
    const {
      currentAssetId,
      dataSource,
      pagination,
      loading,
      onGotoDetail,
      assetTagStatusColorMap = [],
    } = this.props;
    const columns = [
      {
        dataIndex: 'assetId',
        render: (val, record) => (
          <Fragment>
            <Col span={1}>
              <Icon
                style={
                  record.assetId === Number(currentAssetId)
                    ? {
                        backgroundColor: '#69a43a',
                        marginTop: 8,
                        fontSize: 25,
                        height: 50,
                        width: 2,
                      }
                    : {}
                }
              />
            </Col>
            <Col span={23}>
              <Row>
                <Col span={4}>
                  <Icon type="picture" style={{ marginTop: 8, fontSize: 25 }} />
                </Col>
                <Col span={20}>
                  <Row>
                    <a onClick={() => onGotoDetail(record.assetId)}>{record.name}</a>
                  </Row>
                  <Row>
                    <a onClick={() => onGotoDetail(record.assetId)}>{record.assetDesc}</a>
                  </Row>
                </Col>
                <Tag
                  color={`${(
                    assetTagStatusColorMap.filter(item => item.value === record.assetStatus)[0] ||
                    {}
                  ).meaning || ''}`}
                >
                  {record.assetStatusName}
                </Tag>
              </Row>
              <Row>
                <Col offset={4}>
                  <span>{record.assetLocationName}</span>
                </Col>
              </Row>
              <Row>
                <Col offset={4}>
                  <span>{record.owningOrgName}</span>
                </Col>
              </Row>
            </Col>
          </Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Input.Search
          enterButton
          placeholder={intl.get('aafm.common.view.option.search').d('搜索名称或编号')}
          onSearch={this.handleSearch}
          onChange={this.handleChangeCondition}
        />
        <div className="full-search">
          <Table
            bordered
            rowKey="assetId"
            // className="full-search-col"
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
        </div>
      </React.Fragment>
    );
  }
}
export default FullTextSearch;
