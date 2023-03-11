/* eslint-disable eqeqeq */
/**
 *
 * ReportReportCustomer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// import { Add } from '@material-ui/icons';
import { templateColumns, EmaiColumns, EmailReportCols, reportConverCustomer } from 'variable';
import AddProjects from 'containers/AddProjects';
import AddSalesQuotation from 'containers/AddSalesQuotation';
import ListPage from 'components/List';
import { Tab, Tabs, TextField, Typography } from '@material-ui/core';
import dot from 'dot-object';
// import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Progressbar from 'react-progressbar';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Buttons from 'components/CustomButtons/Button';
import FavoritePage from 'containers/FavoritePage';
import HrmCount from 'containers/HrmCount/Loadable';
import CashManager from 'containers/CashManager';
import SalesManager from 'containers/SalesManager/Loadable';
import ExpenseManager from 'containers/ExpenseManager/Loadable';
import GeneralManager from 'containers/GeneralManager/Loadable';
import TaskManager from 'containers/TaskManager/Loadable';
import StockManager from 'containers/StockManager/Loadable';
import ReceivableManager from 'containers/ReceivableManager/Loadable';
import CustomerReportPage from 'containers/CustomerReportPage';
import SalesEmployee from '../../containers/SalesEmployee/Loadable';
import ExpandReportManager from 'containers/ExpandReportManager/Loadable';
import GeneralReportPage from 'containers/GeneralReportPage/Loadable';
import PayManager from 'containers/PayManager';
import makeSelectReportReportCustomer from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import { makeSelectMiniActive } from '../Dashboard/selectors';
import { Grid, Paper, Autocomplete, SwipeableDrawer, TaskReport, AsyncAutocomplete } from '../../components/LifetekUi';
import TaskReportWeekly from '../../components/LifetekUi/TaskReportWeekly';
import ReportTaskStatus from './components/ReportTaskStatus';
import ReportBusinessOp from './components/ReportBusinessOp/ReportBusinessOp';
import ReportCustomerContract from './components/ReportCustomerContract/ReportCustomerContract';
import ReportPersonnelStatistics from '././components/ReportPersonnelStatistics/ReportPersonnelStatistics';
import ReportSalesEmployee from './components/ReportSalesEmployee/ReportSalesEmployee';
import ReportEngineerEmployee from './components/ReportEngineerEmployee/ReportEngineerEmployee';

import ReportTimeForJob from './components/ReportTimeForJob';
import HOCTable from '../HocTable';
import {
  API_TASK_PROJECT,
  API_PRICE,
  GET_CONTRACT,
  API_TEMPLATE,
  API_MAIL,
  API_RNE,
  API_USERS,
  API_REPORT,
  API_ROLE_APP,
  API_ROLE,
} from '../../config/urlConfig';
import { mergeData, getReportCustomer, fetchAllBosAction, defaultData } from './actions';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { changeSnackbar } from '../Dashboard/actions';
import { BoDialog } from '../BoDialog';
import { fetchData, getNameByApi } from '../../helper';
import EmployeeReport from '../EmployeeReport';
import ReportCampain from './components/ReportCampain/ReportCampain';
import ReportChannel from './components/ReportChannel/ReportChannel';
import ReportProduct from './components/ReportProduct/ReportProduct';

// import ReportCompletionLevel from './components/ReportCompletionLevel';

const CustomForget = props => {
  const duration = moment.duration(moment().diff(moment(props.item.updatedAt)));
  return <div>{Math.floor(duration.as('day'))} ngày</div>;
};

const CustomName = props => <Link to={`/crm/BusinessOpportunities/${props.item._id}`}>{props.item.name}</Link>;

const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
    switch (item.code) {
      case 1:
        laneStart.push(item);
        break;
      case 2:
        laneAdd.push(item);
        break;

      case 3:
        laneSucces.push(item);
        break;

      case 4:
        laneFail.push(item);
        break;

      default:
        break;
    }
  });

  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    >
      <b style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0' }}>
        {props.progress}
        %- {props.name} {props.time}
        ngày
      </b>
    </div>
  </div>
);
/* eslint-disable react/prefer-stateless-function */
const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    // color: 'white',
    backgroundColor: `#E0E0E0`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
export class ReportReportCustomer extends React.Component {
  state = {
    tab: 0,
    tabIndex: 0,
    tab1: 1,
    bos: [],
    crmStatusSteps: [],
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
      skip: 0,
      limit: 10,
    },
    openDialog: false,
    editData: {},
    isEditting: false,
    showReportMonth: null,
    showReportWeek: null,
    openReportTaskStatus: false,
    openReportTimeTaskStatus: false,
    openBusinessOp: false,
    openReportCustomerContract: false,
    openReportPersonnelStatistics: false,
    openReportCompletionLevel: false,
    openReportSalesEmployee: false,
    openReportEngineerEmployee: false,
    roles: [],

    openReportChannel: false,
    openReportCampain: false,
    openReportProduct: false,
  };

  mergeData = data => {
    this.props.mergeData(data);
  };
  getDataChildReports = (roles, tab) => {
    let result;
    if (roles) {
      result = roles.find(i => i.tab === tab);
    }
    if (result && result.data) {
      return result.data;
    }
  };
  getNameByIndex = index => {
    switch (Number(index)) {
      case 0:
        return 'Báo cáo tổng hợp';
      case 1:
        return 'Báo cáo yêu thích';
      case 2:
        return 'Báo cáo quản lý tiền mặt, tiền gửi';
      case 3:
        return 'Báo cáo quản lý bán hàng';
      case 4:
        return 'Báo cáo quản lý chi phí';
      case 5:
        return 'Báo cáo quản lý kho';
      case 6:
        return 'Báo cáo quản lý tổng hợp';
      case 7:
        return 'Báo cáo quản lý công nợ';
      case 8:
        return 'Báo cáo quản lý khách hàng';
      case 9:
        return 'Báo cáo công việc dự án';
      case 10:
        return 'Báo cáo nhân viên';
      case 11:
        return 'Báo cáo mở rộng';
      case 12:
        return 'Báo cáo nhân sự';
    }
  };
  checkValidGroupReport = data => {
    let result = [];
    if (data) {
      data.map((i, index) => {
        if (i.length > 0) {
          let obj = {
            label: this.getNameByIndex(index),
            data: [...i],
            tab: index,
          };
          result.push(obj);
        }
      });
    }
    return result;
  };
  checkPermission = data => {
    let result = true;
    if (data) {
      data.map(i => {
        if (i.name === 'GET' && i.allow === false) {
          result = false;
        }
      });
    }
    return result;
  };
  groupReport = data => {
    let group1 = [];
    let group2 = []; // null favaroute
    let group3 = []; // quản lý tiền mặt cash
    let group4 = []; //
    let group5 = [];
    let group6 = [];
    let group7 = [];
    let group8 = [];
    let group9 = [];
    let group10 = [];
    let group11 = [];
    let group12 = [];
    let group13 = [];
    let finalResult = [];
    if (data) {
      data.filter(f => f.codeModleFunction !== 'reports').map((i, index) => {
        let { codeModleFunction, methods } = i || {};

        if (this.checkPermission(methods)) {
          if (codeModleFunction === 'reportsBusinessOpportunities' || codeModleFunction === 'reportBusinessSituation') {
            group1.push(i);
          } else if (codeModleFunction === 'reportStatisticalReceipt' || codeModleFunction === 'reportTopCustomerReceiptsMonth') {
            group3.push(i);
          } else if (
            codeModleFunction !== 'reportsEmployeeKpiSales' &&
            codeModleFunction !== 'ReportSalesEmployees' &&
            codeModleFunction.includes('Sales')
          ) {
            group4.push(i);
          } else if (codeModleFunction === 'reportbankBalance' || codeModleFunction === 'ReportSalesEmployees') {
            group2.push(i);
          } else if (codeModleFunction === 'reportCostRatio' || codeModleFunction === 'reportCostRatioItem') {
            group5.push(i);
          } else if (codeModleFunction.includes('Inventory') && codeModleFunction !== 'reportRevenueInventory') {
            group6.push(i);
          } else if (
            (codeModleFunction.includes('Cost') && codeModleFunction !== 'reportCostRatio' && codeModleFunction !== 'ReportFavoriteCostRatioYear') ||
            codeModleFunction === 'reportRevenueInventory'
          ) {
            group7.push(i);
          } else if (codeModleFunction.includes('reportDebt')) {
            group8.push(i);
          } else if (
            codeModleFunction.includes('Customer') &&
            codeModleFunction !== 'reportCustomerNumberSell' &&
            codeModleFunction !== 'reportCustomerFrequencySell' &&
            codeModleFunction !== 'reportTopCustomerReceiptsMonth'
          ) {
            group9.push(i);
          } else if (codeModleFunction.includes('Task')) {
            group10.push(i);
          } else if (
            codeModleFunction === 'reportStatsHrm' ||
            codeModleFunction === 'reportsEmployeeKpiSales' ||
            codeModleFunction === 'reportsFinishLevel'
          ) {
            group11.push(i);
          } else if (codeModleFunction.includes('reportHrmCountBy')) {
            group13.push(i);
          } else {
            group12.push(i);
          }
        }
      });
    }

    finalResult = [group1, group2, group3, group4.reverse(), group5, group6, group7, group8.reverse(), group9, group10, group11, group12, group13];
    finalResult = this.checkValidGroupReport(finalResult);

    return finalResult;
  };

  getRoles = async () => {
    const { profile } = this.props;
    let result = [];

    try {
      const res = await fetchData(`${API_ROLE}/${profile && profile.userId}`);
      const { roles } = res;
      if (roles && Array.isArray(roles)) {
        roles.map(i => {
          if (i.codeModleFunction && (i.codeModleFunction.includes('report') || i.codeModleFunction.includes('Report'))) {
            result.push(i);
          }
        });
      }

      let finalResult = result && this.groupReport(result);
      if (finalResult) {
        this.setState({ roles: finalResult });
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.props.getReportCustomer();
    this.getRoles();
  }

  componentWillUnmount() {
    try {
      localStorage.removeItem('_isDisplay');
    } catch (error) {
      // fucking care
    }
  }

  componentWillReceiveProps(props) {
    const { reportReportCustomer } = props;
    const newBos = [];
    if (reportReportCustomer.bos !== undefined) {
      reportReportCustomer.bos.forEach(element => {
        newBos.push(dot.dot(element));
      });

      this.state.bos = newBos;
      this.state.pageDetail.totalCount = reportReportCustomer.pageDetail.count;
      this.state.pageDetail.currentPage = Number(reportReportCustomer.pageDetail.skip);
      this.state.pageDetail.pageSize = reportReportCustomer.pageDetail.limit;
    }
    if (Number(reportReportCustomer.callAPIStatus) === 1 && props.history.isEdit === true) {
      // this.state.openDialog = false;
      this.props.onGetBos(this.state.pageDetail);
      props.history.isEdit = undefined;
      this.setState({
        openDialog: false,
      });
    }

    this.props.onDefaultData();
  }

  handleTab(tab1) {
    this.setState({ tab1 });
  }

  handleTabIndex(tabIndex) {
    this.setState({ tabIndex });
  }

  customFunctionEmail = item => {
    let newItem = [];
    newItem = item.map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };

  customFunctionSMS = item => {
    let newItem = [];
    newItem = item.filter(ele => ele.formType === 'sms').map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };

  selectCustomer = customer => {
    this.props.mergeData({ customer });
  };

  mapFunctionCustomer = item => {
    return {
      ...item,
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openAddTask: true, id: item._id })}>
          {item.name}
        </button>
      ),
      organizationUnit: item.organizationUnitName || item.organizationUnit,

      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={item.taskStatus === 1 ? '#0320ff' : item.taskStatus === 2 ? '#009900' : item.taskStatus === 3 ? '#ff5722' : '#f44336'}
          time={
            new Date(item.endDate) >= new Date()
              ? ((new Date(item.endDate) - new Date()) / 86400000).toFixed()
              : ((new Date() - new Date(item.endDate)) / 86400000).toFixed()
          }
          name={new Date(item.endDate) > new Date() ? 'Còn' : 'Trễ'}
          color2={item.taskStatus === 1 ? '#364896' : item.taskStatus === 2 ? '#70db70' : item.taskStatus === 3 ? '#e07c5c' : '#69201b'}
        />
      ),
    };
  };

  mapFunctionSale = item => ({
    ...item,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openSale: true, id: item._id })}>
        {item.name}
      </button>
    ),
    typeOfSalesQuotation: item.typeOfSalesQuotation == 1 ? ' Bán hàng' : item.typeOfSalesQuotation == 2 ? 'Báo giá' : 'Đăt hàng',
  });

  handleReportMonth = () => {
    this.setState({
      showReportMonth: !this.state.showReportMonth,
      showReportWeek: (this.state.showReportWeek = false),
    });
  };

  handleReportWeek = () => {
    this.setState({
      showReportWeek: !this.state.showReportWeek,
      showReportMonth: (this.state.showReportMonth = false),
    });
  };
  displayReportByRoles;

  render() {
    const { reportReportCustomer, miniActive, profile } = this.props;
    let isDisplay = '';
    try {
      isDisplay = JSON.parse(localStorage.getItem('_isDisplay'));
    } catch (error) {
      // fucking care
    }
    const { customers, customer, openAddTask, id, openSale, openSalesEmployee, employee, filter } = reportReportCustomer;

    const {
      tab,
      tabIndex,
      tab1,
      bos,
      crmStatusSteps,
      pageDetail,
      openDialog,
      editData,
      isEditting,
      showReportMonth,
      showReportWeek,
      roles,
    } = this.state;
    const Tb = props => (
      <Buttons
        onClick={() => this.handleTabIndex(props.tabIndex)}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        left
        round
        style={{ fontSize: 11 }}
      >
        {props.children}
      </Buttons>
    );

    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab1)} {...props} color={props.tab1 === tab1 ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Grid style={{ marginLeft: '20px' }}>
          {/* <Tb tabIndex={0} >Báo cáo khách hàng</Tb>
          <Tb
            tabIndex={1}
            onClick={() => {
              this.setState({ openReportCustomerContract: true });
            }}
          >
            Báo cáo tiếp xúc khách hàng
          </Tb> */}
          <Tb tabIndex={0}>Chi tiết báo cáo</Tb>
        </Grid>
        {/* {tabIndex === 0 ? (
          <div>
            <Grid container>
              <Grid item sm={12}>
                <Bt tab1={7}>SMS</Bt>
                <Bt tab1={6}>Email</Bt>
                <Bt tab1={5}>Thu chi</Bt>
                <Bt tab1={4}>Hợp đồng</Bt>
                <Bt tab1={3}>Báo giá/Bán hàng</Bt>
                <Bt tab1={2}>Cơ hội kinh doanh</Bt>
                <Bt tab1={1}>Công việc dự án</Bt>
              </Grid>
            </Grid>

            {tab1 === 1 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  tree
                  code="Task"
                  kanban="KANBAN"
                  status="taskStatus"
                  apiUrl={`${API_TASK_PROJECT}/projects`}
                  mapFunction={this.mapFunctionCustomer}
                  filter={{
                    customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  }}
                  columnExtensions={[{ columnName: 'name', width: 300 }]}
                />
                <SwipeableDrawer
                  onClose={() => this.props.mergeData({ openAddTask: false })}
                  open={openAddTask}
                  width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                >
                  <AddProjects id={id} />
                </SwipeableDrawer>
              </Paper>
            ) : null}
            {tab1 === 2 ? (
              <HOCTable
                // useConfirm // Sử dụng confirm dialog mặc định ( confirm('message')
                customColumns={[
                  {
                    columnName: 'customer.customerId',
                    display: 'none',
                  },
                  {
                    columnName: 'kanbanStatus',
                    CustomComponent: CustomKanbanStatus,
                  },
                  {
                    columnName: 'name',
                    CustomComponent: CustomName,
                  },
                ]}
                extraColumnsFirst={[
                  {
                    columnName: 'forget',
                    columnTitle: 'Chưa thao tác',
                    CustomComponent: CustomForget,
                    alternativeSortColumnName: 'updatedAt',
                  },
                ]}
                dialogTitle="cơ hội kinh doanh"
                path="/crm/BusinessOpportunities"
                data={bos}
                tree
                kanbanStatuses={crmStatusSteps}
                collectionCode="BusinessOpportunities"
                pageDetail={pageDetail}
                onGetAPI={this.props.onGetBos}
                enableServerPaging
                history={this.props.history}
                enableAddFieldTable={false}
                enableApproved
                filter={{
                  customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  status: 1,
                }}
              />
            ) : null}
            {tab1 === 3 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  code="SalesQuotation"
                  kanban="ST02"
                  // status="taskStatus"
                  apiUrl={API_PRICE}
                  mapFunction={this.mapFunctionSale}
                  filter={{
                    customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                    status: 1,
                  }}
                />
                <SwipeableDrawer onClose={() => this.props.mergeData({ openSale: false })} open={openSale} width={window.innerWidth - 260}>
                  <div fullWidth>
                    <AddSalesQuotation id={id} />
                  </div>
                </SwipeableDrawer>
              </Paper>
            ) : null}
            {tab1 === 4 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  code="Contract"
                  kanban="KANBAN"
                  status="taskStatus"
                  apiUrl={GET_CONTRACT}
                  filter={{
                    customerId: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  }}
                />
              </Paper>
            ) : null}
            {tab1 === 5 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  code="RevenueExpenditure"
                  kanban="KANBAN"
                  status="taskStatus"
                  apiUrl={API_RNE}
                  filter={{
                    customerId: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  }}
                />
              </Paper>
            ) : null}
            {tab1 === 6 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  columns={EmailReportCols}
                  customFunction={this.customFunctionEmail}
                  mapFunction={item => {
                    const newItem = {
                      ...item,
                      templateTitle: item.campaignId && item.campaignId.template ? item.campaignId.template.title : '',
                      status: item.status === 1 ? 'Đang gửi' : item.status === 2 ? 'Thành công' : 'Thất bại',
                    };
                    return newItem;
                  }}
                  apiUrl={API_MAIL}
                  // filter={{
                  //   customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  // }}
                />
              </Paper>
            ) : null}
            {tab1 === 7 ? (
              <Paper>
                <ListPage
                  disableEdit
                  disableAdd
                  disableConfig
                  columns={templateColumns}
                  customFunction={this.customFunctionSMS}
                  apiUrl={API_TEMPLATE}
                  // filter={{
                  //   customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  // }}
                />
              </Paper>
            ) : null}
          </div>
        ) : null} */}
        {/* <Typography style={{ marginLeft: 20, marginTop: 30, marginBottom: 15, fontSize: 20 }}>Danh sách báo cáo</Typography> */}
        {tabIndex === 0 ? (
          <Paper>
            <Grid container spacing={16}>
              <Grid item xs={3}>
                <VerticalTabs
                  // value={tab}
                  onSelect={(event, value) => {
                    this.setState({ tab: value });
                  }}
                >
                  {/* {roles
                    ? roles.map(i => (
                        <VerticalTab
                          key={i.tab}
                          style={{ textAlign: 'left', textTransform: 'none' }}
                          label={i.label}
                          onClick={() => {
                            this.setState({ tab: i.tab });
                          }}
                        />
                      ))
                    : null} */}
                  {/* openReportPersonnelStatistics */}
                  <VerticalTab
                    style={{ textAlign: 'left', textTransform: 'none' }}
                    label="Báo cáo theo kênh"
                    onClick={() => {
                      this.setState({ openReportChannel: true });
                    }}
                  />
                  {/* openSalesEmployee */}
                  <VerticalTab
                    style={{ textAlign: 'left', textTransform: 'none' }}
                    label="Báo cáo theo chiến dịch"
                    onClick={() => {
                      this.setState({ openReportCampain: true });
                    }}
                  />
                  {/* openBusinessOp */}
                  <VerticalTab
                    style={{ textAlign: 'left', textTransform: 'none' }}
                    label="Báo cáo theo nhóm sản phẩm"
                    onClick={() => {
                      this.setState({ openReportProduct: true });
                    }}
                  />
                  {/* openReportCompletionLevel */}
                  <VerticalTab
                    style={{ textAlign: 'left', textTransform: 'none' }}
                    label="Báo cáo theo nhân viên kinh doanh"
                    onClick={() => {
                      this.setState({ openReportSalesEmployee: true });
                    }}
                  />
                  {/* openReportCompletionLevel */}
                  <VerticalTab
                    style={{ textAlign: 'left', textTransform: 'none' }}
                    label="Báo cáo theo nhân viên kỹ thuật"
                    onClick={() => {
                      this.setState({ openReportEngineerEmployee: true });
                    }}
                  />
                </VerticalTabs>
              </Grid>
              {/* {tab === 0 ? (
                <Grid item xs={9} style={{ padding: '0px' }}>
                  <GeneralReportPage dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )} */}
              {tab === 0 ? (
                <Grid item xs={9} style={{ padding: '0px' }}>
                  <GeneralReportPage dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {tab === 1 ? (
                <Grid item xs={9} style={{ padding: '0px' }}>
                  <FavoritePage miniActive={this.props.miniActive} dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {tab === 2 ? (
                <Grid item xs={9}>
                  <CashManager miniActive={this.props.miniActive} dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {/* Bán hàng */}
              {tab === 3 ? (
                <Grid item xs={9}>
                  {/* <SalesManager dataRole={roles[tab] ? roles[tab].data : []} /> */}
                  <SalesManager miniActive={this.props.miniActive} dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {/* Chi phí */}
              {tab === 4 ? (
                <Grid item xs={9}>
                  <ExpenseManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {/* Kho */}
              {tab === 5 ? (
                <Grid item xs={9}>
                  <StockManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {/* Tổng hợp */}
              {tab === 6 ? (
                <Grid item xs={9}>
                  <GeneralManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {/* Công nợ */}
              {tab === 7 ? (
                <Grid item xs={9}>
                  <ReceivableManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {tab === 8 ? (
                <Grid item xs={9}>
                  <CustomerReportPage dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : (
                ''
              )}
              {tab === 11 ? (
                <Grid item xs={9}>
                  <ExpandReportManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : null}

              {tab === 12 ? (
                <Grid item xs={9}>
                  <HrmCount dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
              ) : null}

              {/* Công việc dự án */}
              {tab === 9 ? (
                <>
                  <Grid item xs={9}>
                    <TaskManager dataRole={this.getDataChildReports(roles, tab)} profile={this.props.profile} />
                    {/* <VerticalTabs>
                 
                    <VerticalTab
                      onClick={() => {
                        this.setState({ openReportTimeTaskStatus: true });
                      }}
                      style={{ textAlign: 'left', textTransform: 'none' }}
                      label="Báo cáo thời gian thực hiện công việc"
                    />
                    <VerticalTab
                      onClick={() => {
                        this.setState({ openReportTaskStatus: true });
                      }}
                      style={{ textAlign: 'left', textTransform: 'none' }}
                      label="Báo cáo trạng thái công việc"
                    />
                  </VerticalTabs> */}
                  </Grid>
                  <SwipeableDrawer
                    disableClose
                    anchor="right"
                    onClose={() => this.setState({ openReportTaskStatus: false })}
                    open={this.state.openReportTaskStatus}
                    width={window.innerWidth - 260}
                  >
                    <ReportTaskStatus
                      profile={this.props.profile}
                      onClose={() => this.setState({ openReportTaskStatus: false })}
                      onChangeSnackbar={this.props.onChangeSnackbar}
                    />
                  </SwipeableDrawer>
                  <SwipeableDrawer
                    disableClose
                    anchor="right"
                    onClose={() => this.setState({ openReportTimeTaskStatus: false })}
                    open={this.state.openReportTimeTaskStatus}
                    width={window.innerWidth - 260}
                  >
                    <ReportTimeForJob
                      profile={this.props.profile}
                      onClose={() => this.setState({ openReportTimeTaskStatus: false })}
                      onChangeSnackbar={this.props.onChangeSnackbar}
                    />
                  </SwipeableDrawer>
                </>
              ) : null}

              {tab === 9 && (
                <SwipeableDrawer
                  anchor="right"
                  onClose={() => this.setState({ showReportMonth: false })}
                  open={showReportMonth}
                  width={window.innerWidth - 260}
                >
                  <div style={{ padding: '15px' }}>
                    <TaskReport />
                  </div>
                </SwipeableDrawer>
              )}
              {tab === 9 && (
                <SwipeableDrawer
                  anchor="right"
                  onClose={() => this.setState({ showReportWeek: false })}
                  open={showReportWeek}
                  width={window.innerWidth - 260}
                >
                  <div style={{ padding: '15px' }}>
                    <TaskReportWeekly />
                  </div>
                </SwipeableDrawer>
              )}
              {/* Báo cáo nhân viên */}
              {tab === 10 ? (
                <Grid item xs={9}>
                  <EmployeeReport dataRole={this.getDataChildReports(roles, tab)} />
                  {/* <Grid item container spacing={24}>
                  <Grid md={12} item container />
                  <Grid item md={6}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label="Nhân viên"
                      onChange={employee => this.props.mergeData({ employee })}
                      url={API_USERS}
                      value={reportReportCustomer.employee}
                    />
                  </Grid>
                </Grid>
                <Grid style={{ marginLeft: '20px' }}>
                  <Tb tabIndex={0}>Báo cáo nhân viên</Tb>
                  <Tb tabIndex={-1}>Báo cáo tỷ lệ khách hàng</Tb>
                </Grid>
                {tabIndex === 0 ? (
                  <div>
                    <Grid container>
                      <Grid item sm={12}>
                        <Bt tab1={7}>SMS</Bt>
                        <Bt tab1={6}>Email</Bt>
                        <Bt tab1={5}>Thu chi</Bt>
                        <Bt tab1={4}>Hợp đồng</Bt>
                        <Bt tab1={3}>Báo giá/Bán hàng</Bt>
                        <Bt tab1={2}>Cơ hội kinh doanh</Bt>
                        <Bt tab1={1}>Công việc dự án</Bt>
                      </Grid>
                    </Grid>
                    {tab1 === 1 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          tree
                          code="Task"
                          kanban="KANBAN"
                          status="taskStatus"
                          apiUrl={`${API_TASK_PROJECT}/projects`}
                          mapFunction={this.mapFunctionCustomer}
                          filter={{
                            createdBy: employee ? employee._id : '',
                          }}
                          columnExtensions={[{ columnName: 'name', width: 300 }]}
                        />
                        <SwipeableDrawer
                          onClose={() => this.props.mergeData({ openAddTask: false })}
                          open={openAddTask}
                          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                        >
                          <AddProjects id={id} />
                        </SwipeableDrawer>
                      </Paper>
                    ) : null}
                    {tab1 === 2 ? (
                      <HOCTable
                    
                        customColumns={[
                          {
                            columnName: 'customer.customerId',
                            display: 'none',
                          },
                          {
                            columnName: 'kanbanStatus',
                            CustomComponent: CustomKanbanStatus,
                          },
                          {
                            columnName: 'name',
                            CustomComponent: CustomName,
                          },
                        ]}
                        extraColumnsFirst={[
                          {
                            columnName: 'forget',
                            columnTitle: 'Chưa thao tác',
                            CustomComponent: CustomForget,
                            alternativeSortColumnName: 'updatedAt',
                          },
                        ]}
                        dialogTitle="cơ hội kinh doanh"
                        path="/crm/BusinessOpportunities"
                        data={bos}
                        tree
                        kanbanStatuses={crmStatusSteps}
                        collectionCode="BusinessOpportunities"
                        pageDetail={pageDetail}
                        onGetAPI={this.props.onGetBos}
                        enableServerPaging
                        history={this.props.history}
                        enableAddFieldTable={false}
                        enableApproved
                      />
                    ) : null}
                    {tab1 === 3 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          code="SalesQuotation"
                          kanban="ST02"
                          // status="taskStatus"
                          apiUrl={API_PRICE}
                          mapFunction={this.mapFunctionSale}
                          filter={{
                            'salesman.employeeId': employee ? employee._id : '',
                          }}
                        />
                        <SwipeableDrawer onClose={() => this.props.mergeData({ openSale: false })} open={openSale} width={window.innerWidth - 260}>
                          <div fullWidth>
                            <AddSalesQuotation id={id} />
                          </div>
                        </SwipeableDrawer>
                      </Paper>
                    ) : null}
                    {tab1 === 4 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          code="Contract"
                          kanban="KANBAN"
                          status="taskStatus"
                          apiUrl={GET_CONTRACT}
  
                        />
                      </Paper>
                    ) : null}
                    {tab1 === 5 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          code="RevenueExpenditure"
                          kanban="KANBAN"
                          status="taskStatus"
                          apiUrl={API_RNE}
                       
                        />
                      </Paper>
                    ) : null}
                    {tab1 === 6 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          columns={EmaiColumns}
                          customFunction={this.customFunctionEmail}
                          apiUrl={API_TEMPLATE}
                       
                        />
                      </Paper>
                    ) : null}
                    {tab1 === 7 ? (
                      <Paper>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableConfig
                          columns={templateColumns}
                          customFunction={this.customFunctionSMS}
                          apiUrl={API_TEMPLATE}
                          filter={{
                            customer: customer ? customer._id : '',
                          }}
                        />
                      </Paper>
                    ) : null}
                  </div>
                ) : null}
                {tabIndex === -1 ? (
                  <Paper>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 50 }}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          label="Từ Ngày"
                          value={reportReportCustomer.startDate}
                          name="startDate1"
                          error={false}
                          helperText={null}
                          variant="outlined"
                          margin="dense"
                          onChange={value => this.props.mergeData({ startDate: value })}
                      
                        />
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                          <TrendingFlat color="primary" />
                        </div>

                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          label="Đến"
                          error={false}
                          helperText={null}
                          value={reportReportCustomer.endDate}
                          name="endDate"
                          margin="dense"
                          variant="outlined"
                          onChange={value => this.handleChangeDate(value)}
                     
                        />
                      </div>
                    </MuiPickersUtilsProvider>
                   
                  </Paper>
                ) : null}*/}
                </Grid>
              ) : null}
            </Grid>
          </Paper>
        ) : null}

        {openDialog ? (
          <BoDialog
            {...this.props}
            isTrading={false}
            path="/crm/BusinessOpportunities"
            handleClose={this.handleCloseDialog}
            callBack={this.callBack}
            open={openDialog}
            editData={editData}
            isEditting={isEditting}
          />
        ) : null}
        {/* <SwipeableDrawer
          // disableClose
          anchor="right"
          onClose={() => this.props.mergeData({ openSalesEmployee: false })}
          open={openSalesEmployee}
          width={window.innerWidth - 260}
        >
          <SalesEmployee profile={this.props.profile} onChangeSnackbar={this.props.onChangeSnackbar} />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openBusinessOp: false })}
          open={this.state.openBusinessOp}
          width={window.innerWidth - 260}
        >
          <ReportBusinessOp
            profile={this.props.profile}
            onClose={() => this.setState({ openBusinessOp: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportCustomerContract: false })}
          open={this.state.openReportCustomerContract}
          width={window.innerWidth - 260}
        >
          <ReportCustomerContract
            profile={this.props.profile}
            onClose={() => this.setState({ openReportCustomerContract: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        report employEE
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportPersonnelStatistics: false })}
          open={this.state.openReportPersonnelStatistics}
          width={window.innerWidth - 260}
        >
          <ReportPersonnelStatistics
            profile={this.props.profile}
            onClose={() => this.setState({ openReportPersonnelStatistics: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer> */}

        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportChannel: false })}
          open={this.state.openReportChannel}
          width={window.innerWidth - 260}
        >
          <ReportChannel
            profile={this.props.profile}
            onClose={() => this.setState({ openReportChannel: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportSalesEmployee: false })}
          open={this.state.openReportSalesEmployee}
          width={window.innerWidth - 260}
        >
          <ReportSalesEmployee
            profile={this.props.profile}
            onClose={() => this.setState({ openReportSalesEmployee: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportEngineerEmployee: false })}
          open={this.state.openReportEngineerEmployee}
          width={window.innerWidth - 260}
        >
          <ReportEngineerEmployee
            profile={this.props.profile}
            onClose={() => this.setState({ openReportEngineerEmployee: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        {/* openReportCompletionLevel */}

        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportCampain: false })}
          open={this.state.openReportCampain}
          width={window.innerWidth - 260}
        >
          <ReportCampain
            profile={this.props.profile}
            onClose={() => this.setState({ openReportCampain: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>

        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportProduct: false })}
          open={this.state.openReportProduct}
          width={window.innerWidth - 260}
        >
          <ReportProduct
            profile={this.props.profile}
            onClose={() => this.setState({ openReportProduct: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>

        {/* <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openReportCompletionLevel: false })}
          open={this.state.openReportCompletionLevel}
          width={window.innerWidth - 260}
        >
          <ReportCompletionLevel profile={this.props.profile}  onClose={() => this.setState({ openReportCompletionLevel: false })} onChangeSnackbar={this.props.onChangeSnackbar} />
        </SwipeableDrawer> */}
      </div>
    );
  }

  handleCloseDialog = () => {
    const id = this.props.match.params.id;
    if (id) {
      this.props.history.goBack();
    } else {
      this.props.mergeData({ openDialog: false, isEditting: false });
    }
  };
}

ReportReportCustomer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportReportCustomer: makeSelectReportReportCustomer(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getReportCustomer: () => dispatch(getReportCustomer()),
    onGetBos: pageDetail => {
      dispatch(fetchAllBosAction(pageDetail));
    },
    onDefaultData: () => {
      dispatch(defaultData());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportReportCustomer', reducer });
const withSaga = injectSaga({ key: 'reportReportCustomer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ReportReportCustomer);
