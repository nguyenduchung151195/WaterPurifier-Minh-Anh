/**
 *
 * ContactCenterPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  Paper,
  withStyles,
  Menu,
  MenuItem,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@material-ui/core';
import { Message, Phone, ViewModule, QuestionAnswer, ChromeReaderMode, Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectContactCenterPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
// import messages from './messages';
import facebookIcon from '../../assets/img/icons/facebook.svg';
import zaloIcon from '../../assets/img/icons/zalo.svg';
import { getContactCenterAction, deleteContactCenterAction } from './actions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { SwipeableDrawer } from '../../components/LifetekUi';
import ContactCenterFormPage from '../ContactCenterFormPage';
// import { TableContainer } from '../TableContainer';
import { makeSelectRole, makeSelectMiniActive } from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
export class ContactCenterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuForm: null,
      openDialog: false,
      reload: false,
      // contactCenters : this.props.contactCenterPage.contactCenters || [],
    };
    // console.log('ff', this.state.contactCenters);
  }

  componentDidMount() {
    this.props.onGetContactCenter();
  }
  delete = params => {
    const check = confirm('Bạn chắc chắn muốn xóa!');
    if (check) {
      this.props.onDeleteContactCenter(params);
      this.setState({ menuForm: null });
    }
  };

  handleClick = event => {
    this.props.onGetContactCenter();
    this.setState({ menuForm: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ menuForm: null });
    // this.props.history.push('/ContactCenter/add');
  };

  handleCloseDialog = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  callBack = () => {
    this.setState({ openDialog: true, menuForm: null });
  };

  render() {
    const { menuForm, openDialog } = this.state;
    const { classes, contactCenterPage } = this.props;
    const contactCenters = contactCenterPage.contactCenters || [];
    const { role } = this.props;
    const roles = role && role.roles;
    const roleContactCenter =
      roles &&
      roles.find(item => item.codeModleFunction === 'ContactCenter') &&
      roles.find(item => item.codeModleFunction === 'ContactCenter').methods;

    const roleContactCenterPost =
      roleContactCenter && roleContactCenter.find(item => item.name === 'POST') && roleContactCenter.find(item => item.name === 'POST').allow;
    const roleContactCenterPut =
      roleContactCenter && roleContactCenter.find(item => item.name === 'PUT') && roleContactCenter.find(item => item.name === 'PUT').allow;
    const roleContactCenterDel =
      roleContactCenter && roleContactCenter.find(item => item.name === 'DELETE') && roleContactCenter.find(item => item.name === 'DELETE').allow;

    return (
      <>
        <div className={classes.root}>
          {/* <TableContainer></TableContainer> */}

          <Grid container spacing={24}>
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper className={classes.paper} onClick={this.handleCloseDialog}>
                  <Message className={classes.icon} style={{ color: 'green' }} />
                  <span className={classes.textBox}>Thư</span>
                </Paper>
              </Grid>
            ) : null}
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper className={classes.paper} onClick={this.handleCloseDialog}>
                  <Phone className={classes.icon} style={{ color: '#2196f3' }} />
                  <span className={classes.textBox}>Telephone</span>
                </Paper>
              </Grid>
            ) : null}
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper className={classes.paper} onClick={this.handleCloseDialog}>
                  <QuestionAnswer className={classes.icon} style={{ color: '#2196f3' }} />
                  <span className={classes.textBox}>Trò chuyện trực tiếp</span>
                </Paper>
              </Grid>
            ) : null}
            <Grid item xs={3}>
              <Paper className={classes.paper} aria-owns={menuForm ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                <ChromeReaderMode className={classes.icon} style={{ color: '#673ab7' }} />
                <span className={classes.textBox}>Biểu mẫu</span>
              </Paper>
              <Menu id="simple-menu" anchorEl={menuForm} open={Boolean(menuForm)} onClose={this.callBack}>
                <Link to="/ContactCenter/add" history={this.props.history}>
                  {roleContactCenterPost ? (
                    <MenuItem onClick={this.callBack} style={{ borderBottom: '1px solid grey' }}>
                      <Add /> Thêm mới biểu mẫu mới
                    </MenuItem>
                  ) : null}
                </Link>
                {contactCenters.map(item => (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {roleContactCenterPut ? (
                      <Link to={`/ContactCenter/${item._id}`} style={{ width: '60vw' }}>
                        <MenuItem key={item._id} onClick={this.callBack}>
                          {item.name}
                        </MenuItem>
                      </Link>
                    ) : (
                      <div style={{ width: '60vw' }}>
                        <MenuItem key={item._id}>{item.name}</MenuItem>
                      </div>
                    )}

                    {roleContactCenterDel ? (
                      <IconButton onClick={this.delete.bind(this, item._id)} aria-label="delete" color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                  </div>
                ))}
                {/* <SwipeableDrawer anchor="right"  width={window.innerWidth - 260}>
                <ContactCenterFormPage />
              </SwipeableDrawer> */}
              </Menu>
            </Grid>
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper onClick={this.handleCloseDialog} className={classes.paper}>
                  <ViewModule className={classes.icon} style={{ color: '#2196f3' }} />
                  <span className={classes.textBox}>Skype,Slack...</span>
                </Paper>
              </Grid>
            ) : null}
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper onClick={this.handleCloseDialog} className={classes.paper}>
                  <img src={facebookIcon} alt="facebook" style={{ height: 45 }} />
                  <span className={classes.textBox}>Facebook</span>
                </Paper>
              </Grid>
            ) : null}
            {!this.props.disable ? (
              <Grid item xs={3}>
                <Paper onClick={this.handleCloseDialog} className={classes.paper}>
                  <img src={zaloIcon} alt="zalo" style={{ height: 45 }} />
                  <span className={classes.textBox}>Zalo</span>
                </Paper>
              </Grid>
            ) : null}
          </Grid>
          <Dialog
            handleTab={this.props.handleTab}
            open={this.state.open}
            onClose={this.handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Vui lòng liên hệ nhà phát triển để được mở chức năng này.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  }
}

ContactCenterPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contactCenterPage: makeSelectContactCenterPage(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetContactCenter: () => {
      dispatch(getContactCenterAction());
    },
    onDeleteContactCenter: deleteIds => {
      dispatch(deleteContactCenterAction(deleteIds));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contactCenterPage', reducer });
const withSaga = injectSaga({ key: 'contactCenterPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(ContactCenterPage);
