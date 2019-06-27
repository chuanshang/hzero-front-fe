import React, { Component } from 'react';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
/**
 * 标准检查项行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class CheckLists extends Component {
  render() {
    const { loading, dataSource, expandedRowKeys, onEdit, onExpand, onDeleteLine } = this.props;
    const promptCode = `amtc.checkLists.model.checkLists`;
    const columns = [
      {
        title: intl.get(`${promptCode}.itemSeq`).d('序号'),
        dataIndex: 'itemSeq',
        width: 50,
      },
      {
        title: intl.get(`${promptCode}.checklistName`).d('名称'),
        dataIndex: 'checklistName',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record, false)}>{value}</a>,
      },
      {
        title: intl.get(`${promptCode}.businessScenarioCode`).d('业务场景'),
        dataIndex: 'businessScenarioMeaning',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.methodCode`).d('检测方式'),
        dataIndex: 'methodCode',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.standardReference`).d('参考标准'),
        dataIndex: 'standardReference',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.columnTypeCode`).d('字段类型'),
        dataIndex: 'columnTypeMeaning',
        width: 150,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 100,
        render: (val, record) => (
          <a onClick={() => onDeleteLine(record)}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </a>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="checklistId"
        loading={loading.checklistTreeLoading}
        columns={columns}
        dataSource={dataSource}
        onExpand={onExpand}
        expandedRowKeys={expandedRowKeys}
        pagination={false}
      />
    );
  }
}
export default CheckLists;
