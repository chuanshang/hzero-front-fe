import React, { PureComponent } from 'react';
import { Table, Popconfirm } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender, dateTimeRender } from 'utils/renderer';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';

/**
 * 项目进度数据列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onEdit - 编辑行
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @return React.element
 */
class ListTable extends PureComponent {
  @Bind()
  progressChange(record, e) {
    const scheduleRate = Number.parseInt(record.enteredScheduleRate, 10);
    const progress = Number.parseInt(e.target.value, 10) || 0;
    record.$form.setFieldsValue({
      enteredScheduleRate: `${scheduleRate + progress}%`,
    });
  }
  render() {
    const prefix = 'appm.projectSchedule.model.projectSchedule';
    const {
      loading,
      dataSource,
      pagination,
      listMap,
      historyLoading,
      historyList,
      onExpand,
      onSearch,
      onShowDrawer,
      onCompleteSchedule,
      onResetSchedule,
    } = this.props;
    const expandedRowRender = record => {
      const columns = [
        {
          title: intl.get(`${prefix}.scheduleRate`).d('进度新增'),
          dataIndex: 'scheduleRate',
          width: 80,
          render: val => `${val}%`,
        },
        {
          title: intl.get(`${prefix}.workListProgress`).d('交付物完成'),
          dataIndex: 'workListProgress',
          width: 100,
        },
        {
          title: intl.get(`${prefix}.enterPerson`).d('填报人'),
          dataIndex: 'enterPersonName',
          width: 100,
        },
        {
          title: intl.get(`${prefix}.enterDate`).d('进度填报时间'),
          dataIndex: 'enterDate',
          width: 120,
          render: dateTimeRender,
        },
        {
          title: intl.get(`${prefix}.approvedStatus`).d('审批状态'),
          dataIndex: 'approvedStatusMeaning',
          width: 100,
        },
        {
          title: intl.get(`${prefix}.description`).d('备注'),
          dataIndex: 'description',
          width: 100,
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={listMap.get(record.wbsLineId) || historyList}
          pagination={false}
          loading={historyLoading}
        />
      );
    };
    const columns = [
      {
        title: intl.get(`${prefix}.projectCode`).d('项目编码'),
        dataIndex: 'projectCode',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.projectName`).d('项目名称'),
        dataIndex: 'projectName',
        align: 'center',
        width: 200,
      },
      {
        title: intl.get(`${prefix}.taskName`).d('任务名称'),
        dataIndex: 'taskName',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.taskType`).d('任务类型'),
        dataIndex: 'taskTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${prefix}.startDate`).d('计划开始日期'),
        dataIndex: 'startDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.endDate`).d('计划结束日期'),
        dataIndex: 'endDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.enteredScheduleRate`).d('已填报总进度'),
        dataIndex: 'enteredScheduleRate',
        width: 120,
        render: (val, record) =>
          record.taskTypeCode === 'MILESTONE'
            ? val === 0
              ? '未完成'
              : '完成'
            : val === 100
            ? '完成'
            : `${val}%`,
      },
      {
        title: intl.get(`${prefix}.approvedScheduleRate`).d('已审批进度'),
        dataIndex: 'approvedScheduleRate',
        width: 120,
        render: (val, record) =>
          record.taskTypeCode === 'MILESTONE'
            ? val === 0
              ? '未完成'
              : '完成'
            : val === 100
            ? '完成'
            : `${val}%`,
      },
      {
        title: intl.get(`${prefix}.riskLevel`).d('风险等级'),
        dataIndex: 'riskLevelMeaning',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        dataIndex: 'operate',
        // fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => onShowDrawer(record)}>
              {intl.get(`${prefix}.taskName`).d('进度填报')}
            </a>
            {record.approvedScheduleRate === 100 ? (
              <Popconfirm
                title={intl.get(`${prefix}.cancelCompleteTitle`).d('是否取消完成工作项')}
                onConfirm={() => onResetSchedule(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.cancel').d('取消')}
              >
                <a>{intl.get(`${prefix}.cancelComplete`).d('取消完成')}</a>
              </Popconfirm>
            ) : record.enteredScheduleRate < 100 ? (
              <Popconfirm
                title={intl.get(`${prefix}.completeTitle`).d('是否完成工作项')}
                onConfirm={() => onCompleteSchedule(record)}
                okText={intl.get('hzero.common.button.sure').d('确认')}
                cancelText={intl.get('hzero.common.button.cancel').d('取消')}
              >
                <a>{intl.get(`${prefix}.complete`).d('完成')}</a>
              </Popconfirm>
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="wbsLineId"
        loading={loading}
        columns={columns}
        onExpand={onExpand}
        dataSource={dataSource}
        pagination={pagination}
        expandedRowRender={record => expandedRowRender(record)}
        scroll={{ x: 1230 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
