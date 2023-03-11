/**
 *
 * CustomersPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tabs, Tab, Avatar, Grid, Menu, MenuItem, Paper } from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { API_CRM_CAMPAIGN, API_CUSTOMERS, API_ROLE_APP } from 'config/urlConfig';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core/styles';
import avatarDefault from '../../images/default-avatar.png';
import ListAsync from '../../components/List';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectRole } from '../Dashboard/selectors';
import { makeSelectCustomersPage, makeSelectAddCustomerPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
// import styles from './styles';
import CustomerDashboard from '../../components/CustomerDashboard';
import AdvanceFilterAndListFilterTags from '../../components/Filter/AdvanceFilterAndListFilterTags';
import SelectManagerDialog from '../../components/CustomDialog/SelectMangerDialog';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import { clientId } from '../../variable';
import { fetchData } from '../../helper';
import { mergeData as mergeDataReport } from '../ReportReportCustomer/actions';
import { mergeData, changeTabAct, getCampaign, changeTabCampainAction } from './actions';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import { Fab, Loading } from 'components/LifetekUi';
import { Dehaze } from '@material-ui/icons';
import moment from 'moment';
import Kanban from '../KanbanPlugin';
import Automation from '../PluginAutomation/Loadable';
import { Dialog, SwipeableDrawer } from '../../components/LifetekUi';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import Button from 'components/CustomButtons/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import ViewContent from '../../components/ViewContentCampaign/Loadable';
import ViewContentCampaign from '../../components/ViewContentCampaign';
import ContactCenterPage from '../ContactCenterPage';
import ContactCenterFormPage from '../ContactCenterFormPage';
import makeSelectSuppliersPage from './selectors';

/* eslint-disable react/prefer-stateless-function */
export class CampaignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countCustomer: 0,
      tab: 0,
      tab1: 1,
      openSelectManager: false,
      openRevokeManger: false,
      openCreateManger: false,
      anchorEl: null,
      advanceSearchQuery: {},
      selectedCustomers: [],
      emailTemplates: [],
      kanbanFilter: {},
      bos: [],
      kanbanData: {},
      openKanbanDialog: false,
      crmStatusSteps: [],
      totalCount: 0,
      count: 0,
      pageDetail: {
        currentPage: 0,
        pageSize: 0,
        totalCount: 0,
      },
      editDialog: false,
      id: null,
      reload: 0,
    };
  }

  componentDidMount() { }

  // shouldComponentUpdate(prevState, prevProps) {
  //   if (prevState.showList !== this.state.showList) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // componentWillReceiveProps(props) {

  // }

  // componentDidUpdate(prevState, prevProps) {

  // }

  mergeData = data => {
    this.props.mergeData(data);
  };
  openTask = id => {
    this.setState({ id, editDialog: true });
  };
  handleCloseEdit = () => {
    this.setState({ editDialog: false });
  };
  mapFunctionCampaign = item => {
    return {
      ...item,
      name: (
        <button onClick={() => this.openTask(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      parentId: item['parentId.name'],
      ['owner.ownerId']: item['owner.name'],
      updatedBy: item['updatedBy.name'],
      createdBy: item['createdBy.name'],
      contactCenter: item['contactCenter.name'],
    };
  };
  addCampaign = () => {
    this.props.history.push('/crm/crmCampaign/add');
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleTab(tab) {
    this.setState({ tab });
  }

  render() {
    const { classes, intl, dashboardPage, campaignPage, profile, role } = this.props;
    const { tab, reload } = campaignPage;
    const { allDepartment } = dashboardPage;
    const Bt = props => (
      <Button onClick={() => this.props.onChangeTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Button>
    );
    const roles = role && role.roles;
    const roleContactCenter =
      roles &&
      roles.find(item => item.codeModleFunction === 'ContactCenter') &&
      roles.find(item => item.codeModleFunction === 'ContactCenter').methods;
    const roleContactCenterGet =
      roleContactCenter && roleContactCenter.find(item => item.name === 'GET') && roleContactCenter.find(item => item.name === 'GET').allow;
    return (
      <div>
        <Paper style={{ marginTop: '20px' }}>
          <Grid container style={{ width: '100%' }}>
            <Grid item md={12}>
              <Bt tab={0}>Danh sách</Bt>

              {roleContactCenterGet ? <Bt tab={1}>Biểu mẫu chiến dịch</Bt> : null}
            </Grid>
            <Grid item md={12}>
              {tab === 0 ? (
                <ListAsync
                  disableSMS
                  disableSeenMail
                  height="660px"
                  // deleteOption="customers"
                  deleteUrl={`${API_CRM_CAMPAIGN}`}
                  apiUrl={API_CRM_CAMPAIGN}
                  exportExcel
                  code="crmCampaign"
                  deleteOption="ids"
                  // share
                  addFunction={this.addCampaign}
                  // advanceFilter={<AdvanceFilterAndListFilterTags onSearch={this.handleSearch} />}
                  mapFunction={this.mapFunctionCampaign}
                // kanban="ST18"
                // ref={this.refCustomer}
                // onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                />
              ) : null}
              {/* </Grid> */}
              {/* <Grid item md={12}> */}
              {tab === 1 ? (
                <ContactCenterPage reload={reload} disable={true} history={this.props.history} handleTab={this.handleTab.bind(this, tab)} />
              ) : null}
            </Grid>
            <Dialog title="Xem chi tiết chiến dịch" onClose={this.handleCloseEdit} open={this.state.editDialog}>
              <ViewContentCampaign code="crmCampaign" id={this.state.id} />
            </Dialog>
          </Grid>
        </Paper>
      </div>
    );
  }

  handleReport = (e, item) => {
    try {
      localStorage.setItem('_isDisplay', JSON.stringify(item));
    } catch (error) {
      // fucking care
    }
    this.props.history.push('/reports');
    // this.props.mergeDataReport({ isDisplay: item });
  };

  handleChangeIndex = index => {
    this.props.handleChangeIndex(index);
  };

  handleChangeSelectedCustomers = newSelected => {
    this.setState({ selectedCustomers: newSelected });
  };

  onOpenSelectManager = () => {
    this.setState({ openSelectManager: true });
  };

  onCloseSelectManager = () => {
    this.setState({ openSelectManager: false });
  };

  openRevokeManger = () => {
    this.setState({ openRevokeManger: true });
  };

  onCloseRevokeManager = () => {
    this.setState({ openRevokeManger: false });
  };

  openCreateManger = () => {
    this.setState({ openCreateManger: true });
  };

  onCloseCreateManager = () => {
    this.setState({ openCreateManger: false });
  };

  handleSearch = newQuery => {
    // console.log('handleSearch', newQuery);
    this.setState({ advanceSearchQuery: newQuery }); P
  };
}

CampaignPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  campaignPage: makeSelectSuppliersPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getCampaign: data => dispatch(getCampaign(data)),
    onChangeTab: tab => {
      dispatch(changeTabCampainAction(tab));
    },
    // saveSetting: columns => dispatch(updateViewConfig(columns)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'campaignPage', reducer });
const withSaga = injectSaga({ key: 'campaignPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(CampaignPage);
