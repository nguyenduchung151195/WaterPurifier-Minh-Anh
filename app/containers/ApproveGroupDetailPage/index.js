/**
 *
 * ApproveGroupDetailPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TextField, withStyles, Grid, Checkbox, Paper, FormControlLabel, Button, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Edit, Close } from '@material-ui/icons';
import { clientId } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectApproveGroupDetailPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { injectIntl } from 'react-intl';
import CustomAppBar from 'components/CustomAppBar';
import { changeSnackbar } from 'containers/Dashboard/actions';

import { updateApproveGroupAction, addApproveGroupAction, getApproveGroupDetailPageAction, resetNotis, getAllUserAct } from './actions';
import DndUser from '../../components/DndUser';
import DepartmentSelect from '../../components/DepartmentSelect/Clone';
import styles from './styles';

/* eslint-disable react/prefer-stateless-function */

class ApproveGroupDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // currency: 0,
      // stages: [],
      approveGroup: {
        name: '',
        code: '',
        group: [],
        clientId,
        authorityAdd: [],
      },
      errorMessage: {
        name: 'Không được để trống tên nhóm',
        code: 'Không được để trống code',
      },
    };
  }

  componentWillMount() {
    this.props.onGetAllUser();
    if (this.props.match.params.id) {
      this.props.onGetApproveGroupDetailPage(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props) {
    const { ApproveGroupDetailPage } = props;
    if (ApproveGroupDetailPage.callAPIStatus === 1) {
      this.props.history.push('/setting/approved');
    }
    if (ApproveGroupDetailPage.ApproveGroupDetailPage !== undefined && this.props.match.params.id) {
      this.state.approveGroup = ApproveGroupDetailPage.ApproveGroupDetailPage;
    }
    this.props.onResetNotis();
  }

  handleUpdateApproveGroup = listUser => {
    const { approveGroup } = this.state;
    const newGroup = listUser.map((item, index) => ({
      person: item.userId,
      order: index,
    }));
    approveGroup.group = newGroup;
    // console.log(approveGroup);
    this.setState({ approveGroup });
  };

  handleChangeAllowedSellingOrganization = viewedDepartmentIds => {
    const { approveGroup } = this.state;
    const newApproveGroup = { ...approveGroup, organizationId: viewedDepartmentIds };
    this.setState({ approveGroup: newApproveGroup });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelectedUserChange = newSelected => {
    if (!Array.isArray(newSelected)) newSelected = [];
    const { approveGroup } = this.state;
    approveGroup.group = newSelected.map(u => ({ person: u.userId, order: u.order }));
    this.setState({ approveGroup });
  };

  render() {
    const { classes, ApproveGroupDetailPage, intl } = this.props;
    const { users } = ApproveGroupDetailPage;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới nhóm phê duyệt' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật nhóm phê duyệt' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={() => {
            if (!this.state.approveGroup.name || !this.state.approveGroup.code) {
              this.props.onChangeSnackbar({ status: true, message: 'Nhập thiếu thông tin các trường bắt buộc!', variant: 'error' });
            } else {
              this.props.match.params.id
                ? this.props.onUpdateApproveGroup(this.state.approveGroup)
                : this.props.onAddApproveGroup(this.state.approveGroup);
            }
          }}
        />
        <Helmet>
          <title>Thêm mới nhóm phê duyệt động</title>
          <meta name="description" content="Thêm mới phê duyệt động" />
        </Helmet>
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item md={6}>
              <TextField
                onChange={event => {
                  const { approveGroup, errorMessage } = this.state;
                  approveGroup.name = event.target.value;
                  this.setState({ approveGroup });
                  if (approveGroup.name === '') {
                    errorMessage.name = 'Không được để trống tên nhóm';
                  } else {
                    errorMessage.name = '';
                  }
                }}
                value={this.state.approveGroup.name}
                id="outlined-full-width"
                label="Tên nhóm"
                style={{ margin: 8 }}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!this.state.approveGroup.name && this.state.errorMessage.name}
                helperText={!this.state.approveGroup.name && this.state.errorMessage.name}
              />
              <TextField
                onChange={event => {
                  const { approveGroup, errorMessage } = this.state;
                  approveGroup.code = event.target.value;
                  this.setState({ approveGroup });
                  if (approveGroup.code === '') {
                    errorMessage.code = 'Không được để trống code';
                  } else {
                    errorMessage.code = '';
                  }
                }}
                value={this.state.approveGroup.code}
                id="outlined-full-width"
                label="Code"
                style={{ margin: 8 }}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!this.state.approveGroup.code && this.state.errorMessage.code}
                helperText={!this.state.approveGroup.code && this.state.errorMessage.code}
              />
              <DepartmentSelect
                title=""
                allowedDepartmentIds={this.state.approveGroup.organizationId || []}
                onChange={this.handleChangeAllowedSellingOrganization}
                isMultiple
              />
            </Grid>
            {/* <Grid item md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="checkedB"
                    color="primary"
                    checked={this.state.approveType}
                    onChange={e => {
                      this.setState({ approveType: e.target.checked });
                    }}
                  />
                }
                label="Hoạt động"
              /> */}
            {/* <div style={{ marginTop: 60 }}>
                <Button
                  variant="contained"
                  onClick={() => {        
                    this.props.match.params.id
                      ? this.props.onUpdateApproveGroup(this.state.approveGroup)
                      : this.props.onAddApproveGroup(this.state.approveGroup);
                  }}
                  color="primary"
                  style={{ marginRight: 20 }}
                >
                  Lưu
                </Button>
                <Button variant="contained" color="default" onClick={() => this.props.history.goBack()}>
                  Hủy
                </Button>
              </div> */}
            {/* </Grid> */}
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <DndUser
            selected={this.state.approveGroup.group}
            authorityAdd={this.state.approveGroup.authorityAdd}
            handleUpdateApproveGroup={this.handleUpdateApproveGroup}
            users={users}
            onSelectedChange={this.handleSelectedUserChange}
          />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  ApproveGroupDetailPage: makeSelectApproveGroupDetailPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onGetAllUser: () => {
      dispatch(getAllUserAct());
    },
    onAddApproveGroup: approveGroup => {
      dispatch(addApproveGroupAction(approveGroup));
    },
    onUpdateApproveGroup: approveGroup => {
      dispatch(updateApproveGroupAction(approveGroup));
    },
    onGetApproveGroupDetailPage: id => {
      dispatch(getApproveGroupDetailPageAction(id));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'ApproveGroupDetailPage', reducer });
const withSaga = injectSaga({ key: 'ApproveGroupDetailPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(ApproveGroupDetailPage);
