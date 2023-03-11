/**
 *
 * WorkingSchedule
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import { Tab, Tabs } from '@material-ui/core';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import AddProjects from 'containers/AddProjects';
import AddWorkingSchedule from 'containers/AddWorkingSchedule';
import injectReducer from 'utils/injectReducer';
import { API_MEETING } from '../../config/urlConfig';
import { Paper, SwipeableDrawer } from '../../components/LifetekUi';
import makeSelectWorkingSchedule from './selectors';
import { makeSelectMiniActive } from '../Dashboard/selectors';

import reducer from './reducer';
import saga from './saga';
import { getData } from './actions';
// import { calendarColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';
import Automation from '../PluginAutomation/Loadable';
import messages from './messages';
import { injectIntl } from 'react-intl';

/* eslint-disable react/prefer-stateless-function */
export class WorkingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      id: 'add',
      openDrawer: false,
      openDrawerMeeting: false,
    };
  }

  componentDidMount() {
    this.props.getData();
  }

  mapFunctionCalendar = item => ({
    ...item,
    typeCalendar: item.typeCalendar === '1' ? 'Lịch họp' : 'Lịch công tác',
    organizer: item['organizer.name'],
    task: item['task.name'],
    roomMetting: item['roomMetting.name'],
    approved: item['approved.name'],
    createdBy: item.createdByName ? item.createdByName : null,
  });

  handleChangeTask = id => {
    this.setState({ openDrawer: true, id });
  };

  render() {
    const { tabIndex } = this.state;
    const { workingSchedule, intl, miniActive } = this.props;
    return (
      <div>
        <Helmet>
          <title>Lịch Họp</title>
          <meta name="description" content="Description of MeetingPage" />
        </Helmet>
        <Tabs value={tabIndex} onChange={(e, tabIndex) => this.setState({ tabIndex })} aria-label="simple tabs example">
          <Tab value={0} label={intl.formatMessage(messages.list || { id: 'list' })} />
          <Tab value={1} label={intl.formatMessage(messages.calendar || { id: 'calendar' })} />
          <Tab value={2} label={intl.formatMessage(messages.kanban || { id: 'kanban' })} />
          <Tab value={3} label="AutoMation Rules" />
        </Tabs>
        <div>
          {tabIndex === 0 ? (
            <Paper>
              <ListPage
                height="640px"
                showDepartmentAndEmployeeFilter
                kanban="ST16"
                // reload={calendarPage.reload}
                exportExcel
                filter={{ typeCalendar: '2' }}
                // columns={calendarColumns}
                code="Calendar"
                apiUrl={API_MEETING}
                mapFunction={this.mapFunctionCalendar}
                columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
              />
            </Paper>
          ) : null}

          {tabIndex === 1 ? (
            <CalendarComponent
              meetings={workingSchedule.mettings}
              // visits={visits}
            />
          ) : null}
          {tabIndex === 2 ? (
            <Kanban
              addItem={this.addItemKanban}
              module="crmStatus"
              code="ST16"
              apiUrl={API_MEETING}
              itemComponent={this.ItemComponent}
              filter={{ typeCalendar: '2' }}
            />
          ) : null}
        </div>
        {tabIndex === 3 ? (
          <Automation
            code="ST16" // code của danh sách trạng thái kanban
            path="/crm/Calendar" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
            kanbanStatus="String"
          />
        ) : null}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects
              mettingSchedule={this.state.id}
              data={{ isProject: false }}
              id="add"
              callback={this.callbackTask}
              onClose={() => this.setState({ openDrawer: false, id: 'add' })}
            />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerMeeting: false, id: 'add' })}
          open={this.state.openDrawerMeeting}
          width={window.innerWidth - 260}
        >
          <div>
            <AddWorkingSchedule id="add" callback={this.callback} kanbanStatus={this.state.kanbanStatus} propsAll={this.props} />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  addItemKanban = id => {
    this.setState({ openDrawerMeeting: true, kanbanStatus: id });
  };

  callbackTask = () => {
    this.setState({ openDrawer: false });
  };

  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban-planner">
        Tên cuộc họp: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người tham gia: <b> {data.people ? data.people.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Địa điểm: <b> {data.address}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

WorkingSchedule.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  workingSchedule: makeSelectWorkingSchedule(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'workingSchedule', reducer });
const withSaga = injectSaga({ key: 'workingSchedule', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(WorkingSchedule);
