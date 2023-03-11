/**
 *
 * TakeLeaveManagePage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTakeLeaveManagePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import ListPage from '../../../../components/List';
import { API_TAKE_LEAVE_MANAGER } from 'config/urlConfig';
import makeSelectDashboardPage from '../../../Dashboard/selectors';
import VerticalDepartmentTree from '../../../../components/Filter/VerticalDepartmentTree';
import { Paper } from 'components/LifetekUi';
import { Grid, Tooltip, Fab } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Add, ImportExport } from '@material-ui/icons';
import AddEditTakeLeave from './components/AddEditTakeLeave';
import { createTakeLeave, updateTakeLeave, deleteTakeLeave } from './actions';

/* eslint-disable react/prefer-stateless-function */
function TakeLeaveManagePage(props) {
  const { onCreateTakeLive, dashboardPage, tableId, onUpdateTakeLeave, onDeleteTakeLeave, TakeLeaveManagePage } = props;
  const { reload } = TakeLeaveManagePage;
  const { allDepartment, allSymbol } = dashboardPage;
  const [query, setQuery] = useState({
    // tableId,
    hrmEmployeeId: null,
    organizationId: null,
  });
  const [filter, setFilter] = useState({});
  const [expansive, setExpansive] = useState(true);
  const [widthColumn, setWidthColumn] = useState(300);
  const [openDialog, setOpenDialog] = useState(false);
  const [organizationUnitId, setOrganizationUnitId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [selectTakeLeave, setSelectTakeLive] = useState(null);

  const onClickExpansive = () => {
    if (expansive) {
      setExpansive(false);
      setWidthColumn(50);
    } else {
      setExpansive(true);
      setWidthColumn(300);
    }
  };

  const handleSelectDepart = useCallback(
    depart => {
      try {
        const { hrmEmployeeId, organizationId, ...rest } = query;
        const newQuery = {
          ...rest,
        };
        if (depart && depart._id) {
          if (depart.isHrm) {
            setFilter({ hrmEmployeeId: depart._id });
          } else {
            setFilter({ organizationId: depart._id });
          }
        }
        setQuery(newQuery);
      } catch (error) {
        console.log('errr', error);
      }
    },
    [query],
  );

  const handleCloseWagesDialog = useCallback(() => {
    setSelectTakeLive(null);
    setOpenDialog(false);
    setIsEdit(false);
  }, []);

  const handleOpenWagesDialog = () => {
    setSelectTakeLive(null);
    setOpenDialog(true);
    setIsEdit(false);
  };

  const addItem = () => (
    <Tooltip title="Thêm mới" onClick={handleOpenWagesDialog}>
      <Add />
    </Tooltip>
  );

  const handleSave = useCallback(data => {
    // const { _id: WagesId } = data;
    onCreateTakeLive(data);
    handleCloseWagesDialog();
  }, []);

  const handleUpdate = useCallback((hrmEmployeeId, data) => {
    // const { _id: WagesId } = data;
    onUpdateTakeLeave(hrmEmployeeId, data);
    handleCloseWagesDialog();
  }, []);

  const handleDelete = data => onDeleteTakeLeave(data);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['hrmEmployeeId.name'],
  });

  return (
    <Paper>
      <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%', paddingTop: 15 }}>
        {expansive ? (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container>
              <ArrowBackIcon color="primary" onClick={onClickExpansive} />
            </Grid>

            <VerticalDepartmentTree
              addUser={false}
              addHrm={true}
              departments={allDepartment}
              onChange={handleSelectDepart}
              departmentId={organizationUnitId}
            />
          </Grid>
        ) : (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container className="ml-1">
              <ArrowForwardIcon color="primary" onClick={onClickExpansive} />
            </Grid>
          </Grid>
        )}
        <Grid item style={{ width: `calc(100% - ${widthColumn}px)` }}>
          <ListPage
            code="TakeLeaveManager"
            parentCode="hrm"
            filterWidth="25%"
            apiUrl={API_TAKE_LEAVE_MANAGER}
            onEdit={row => {
              setSelectTakeLive(row);
              setOpenDialog(true);
              setIsEdit(true);
            }}
            onDelete={handleDelete}
            settingBar={[addItem()]}
            reload={reload}
            filter={filter}
            mapFunction={mapFunction}
            exportExcel
            importExport
            disableAdd
          />
        </Grid>
      </Grid>
      <AddEditTakeLeave
        isEdit={isEdit}
        selectTakeLeave={selectTakeLeave}
        open={openDialog}
        onClose={handleCloseWagesDialog}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </Paper>
  );
}

TakeLeaveManagePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  TakeLeaveManagePage: makeSelectTakeLeaveManagePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCreateTakeLive: data => dispatch(createTakeLeave(data)),
    onUpdateTakeLeave: (hrmEmployeeId, data) => dispatch(updateTakeLeave(hrmEmployeeId, data)),
    onDeleteTakeLeave: data => dispatch(deleteTakeLeave(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'takeLeaveManagePage', reducer });
const withSaga = injectSaga({ key: 'takeLeaveManagePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TakeLeaveManagePage);
