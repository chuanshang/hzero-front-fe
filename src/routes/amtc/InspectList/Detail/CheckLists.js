import React, { Component } from 'react';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
/**
 * 问题清单行展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class CheckLists extends Component {
  render() {
    const { editFlag, loading, dataSource, onEdit, onCancelLine, onDeleteLine } = this.props;
    const promptCode = `amtc.checkLists.model.checkLists`;
    const columns = [
      {
        title: intl.get(`${promptCode}.problemSeq`).d('序号'),
        dataIndex: 'problemSeq',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.problemName`).d('名称'),
        dataIndex: 'problemName',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.score`).d('分值'),
        dataIndex: 'score',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.url`).d('链接'),
        dataIndex: 'url',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.resultDesc`).d('结果意义说明'),
        dataIndex: 'resultDesc',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.solution`).d('解决方案'),
        dataIndex: 'solution',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.relateProblem`).d('关联对象值'),
        dataIndex: 'relateProblemFlag',
        width: 150,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.evalueationRuleId`).d('评级标准'),
        dataIndex: 'evalueationRuleId',
        width: 150,
      },
      {
        title: intl.get(`${promptCode}.description`).d('备注'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get('hzero.common.operator').d('操作'),
        width: 150,
        render: (val, record) =>
          record._status === 'create' ? (
            <span className="action-link">
              <a onClick={() => onEdit(record)}>{intl.get('hzero.common.status.edit').d('编辑')}</a>
              <a onClick={() => onCancelLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            </span>
          ) : editFlag ? (
            <span className="action-link">
              <a onClick={() => onEdit(record)}>{intl.get('hzero.common.status.edit').d('编辑')}</a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEdit(record)}>{intl.get('hzero.common.status.view').d('查看')}</a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="checklistProblemId"
        loading={loading.problemListLoading}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
}
export default CheckLists;
