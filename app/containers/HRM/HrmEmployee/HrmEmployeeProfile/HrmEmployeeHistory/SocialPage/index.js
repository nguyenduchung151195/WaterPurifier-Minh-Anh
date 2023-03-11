/**
 *
 * SocialPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import makeSelectSocialPage from './selectors';
import { API_HRM_SOCIAL } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddSocial from './components/AddSocial';
import { createSocial, updateSocial, deleteSocial } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function SocialPage(props) {
  const { socialPage, onCreateSocial, onUpdateSocial, onDeleteSocial, id: hrmEmployeeId, miniActive } = props;
  const { createSocialSuccess, updateSocialSuccess, deleteSocialSuccess, reload } = socialPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createSocialSuccess === true) {
        handleCloseSocialDialog();
      }
      if (!createSocialSuccess) {
      }
    },
    [createSocialSuccess],
  );

  useEffect(
    () => {
      if (updateSocialSuccess === true) {
        handleCloseSocialDialog();
      }
      if (!updateSocialSuccess) {
      }
    },
    [updateSocialSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: socailId } = data;
    if (!socailId) {
      onCreateSocial(data);
    } else {
      onUpdateSocial(socailId, data);
    }
  }, []);

  const handleOpenSocialDialog = () => {
    setSelectedSocial(null);
    setOpenDialog(true);
  };

  const handleCloseSocialDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenSocialDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteSocial(hrmEmployeeId, ids);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
  });

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      {/* <Typography
        component="p"
        style={{
          fontWeight: 550,
          fontSize: '18px',
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình bảo hiểm
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography> */}
      <CustomAppBar
        title="Quá trình bảo hiểm"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 80 }}>
        <Paper>
          <ListPage
            code="InsuranceInformation"
            parentCode="hrm"
            onEdit={row => {
              setSelectedSocial(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HRM_SOCIAL}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            exportExcel
            importExport
            // client
          />
        </Paper>
        <SwipeableDrawer anchor="right" onClose={handleCloseSocialDialog} open={openDialog}>
          <AddSocial
            miniActive={props.miniActive}
            code="InsuranceInformation"
            hrmEmployeeId={hrmEmployeeId}
            social={selectedSocial}
            onSave={handleSave}
            onClose={handleCloseSocialDialog}
          />
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

SocialPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  socialPage: makeSelectSocialPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSocial: data => dispatch(createSocial(data)),
    onUpdateSocial: (hrmEmployeeId, data) => dispatch(updateSocial(hrmEmployeeId, data)),
    onDeleteSocial: (hrmEmployeeId, ids) => dispatch(deleteSocial(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'socialPage', reducer });
const withSaga = injectSaga({ key: 'socialPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SocialPage);
