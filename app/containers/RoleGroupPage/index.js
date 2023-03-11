/**
 *
 * RoleGroupPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableColumnResizing,
  TableFixedColumns,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { NavLink, Link } from 'react-router-dom';
import {
  Button,
  TablePagination,
  Checkbox,
  Fab,
  Typography,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import _ from 'lodash';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import GridUI from '@material-ui/core/Grid';
import { Settings, Edit, Delete, Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import messages from './messages';
import ModelTableDisplaySetting from '../../components/ModelTableDisplaySetting';
import makeSelectRoleGroupPage from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';

import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { getRoleGroupAction, deleteRoleGroupAct, defaultAction } from './actions';
/* eslint-disable react/prefer-stateless-function */

let allId = [];
export class RoleGroupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onDelete: false,
      columns: [{ name: 'code', title: 'Mã' }, { name: 'name', title: 'Tên' }, { name: 'description', title: 'Mô tả' }], // các cột được hiển thị
      // defaultOrder: [], // sắp xếp thứ tự hiển thị của các cột
      defaultColumnWidths: [
        { columnName: 'checkbox', width: 200 },
        { columnName: 'code', width: 200 },
        { columnName: 'name', width: 500 },
        { columnName: 'description', width: 500 },
        { columnName: 'action', width: 90 },
      ], // chiều ngang mặc định của các cột

      columnOrder: ['code', 'name', 'description', 'action'],
      //   pageSizes: [5, 10, 15],
      rowsPerPage: 15, // số hàng hiển thị trên một bảng
      page: 0, // trang hiện tại
      openDialogTableSetting: false, // hiển thị dialog
      selected: [], // các hàng được lựa chọn
      rightColumns: ['action'], // cột fixed bên phải
    };
  }

  componentWillMount() {
    this.props.onGetRoleGroup();
  }

  componentWillReceiveProps(props) {
    if (props.roleGroupPage.successDelete) {
      this.state.onDelete = false;
      this.state.selected = [];
      this.props.onResetNotic();
    }
  }

  render() {
    const { classes, roleGroupPage, intl, dashboardPage } = this.props;
    const { rowsPerPage, page, columns, columnOrder } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 9, nameAdd.length);
    allId = [];
    const newRows = _.chunk(
      _.map(roleGroupPage.roleGroups, row => {
        const action = (
          <Fab
            component={NavLink}
            to={`/setting/roleGroup/edit/${row._id}`}
            size="small"
            title="Chỉnh sửa"
            style={{ marginLeft: 10 }}
            color="primary"
            onClick={this.handleEdit}
          >
            <Edit color="default" />
          </Fab>
        );
        const checkbox = this.addCheckbox(row._id);
        allId.push(row._id);
        return { ...row, action, checkbox };
      }),
      this.state.rowsPerPage,
    )[this.state.page];

    const newColumns = [...columns, { name: 'checkbox', title: this.addCheckboxAll() }, { name: 'action', title: 'Cập nhật' }];

    const role = dashboardPage && dashboardPage.role;
    const roles = role && role.roles;
    const roleCode =
      roles && roles.find(item => item.codeModleFunction === 'Employee') && roles.find(item => item.codeModleFunction === 'Employee').methods;
    const roleCodeDel = roleCode && roleCode.find(item => item.name === 'DELETE') && roleCode.find(item => item.name === 'DELETE').allow;
    return (
      <div>
        {/* <AppBar className={classes.HeaderAppBarRoleGroup}>
              <Toolbar>
                <IconButton
                  className={classes.BTNRoleGroup}
                  color="inherit"
                  variant="contained"
                  onClick={()=> this.props.history.goBack()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {addStock === "roleGroup"
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.saveTemplate}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <Helmet>
          <title>Nhóm quyền </title>
          <meta name="description" content="Description of RoleGroupPage" />
        </Helmet>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              Danh sách nhân sự
            </Link>
            <Typography color="textPrimary">Danh sách vai trò</Typography>
          </Breadcrumbs>
        </Paper>
        <GridUI container>
          <GridUI item md={11}>
            <Button component={NavLink} to="/setting/roleGroup/add" style={{ marginBottom: 10, marginRight: 10 }} variant="outlined" color="primary">
              Thêm mới
            </Button>
          </GridUI>
          <GridUI container justify="flex-end" item md={1}>
            {this.state.selected.length !== 0 ? (
              roleCodeDel ? (
                <Fab size="small" title="Xóa mục đã chọn" style={{ marginRight: 10 }} color="secondary" onClick={this.handleDeletes}>
                  <Delete style={{ color: 'white' }} onClick={this.handleDeleteDialog} />
                </Fab>
              ) : null
            ) : null}
            <Fab size="small" title="Thiết lập hiển thị" onClick={() => this.handleChangeDialogTableSetting(this.state.openDialogTableSetting)}>
              <Settings />
            </Fab>
          </GridUI>
        </GridUI>

        <Paper className={classes.tableContainer} id="table-full-width" style={{ height: 739, overflowY: 'auto' }}>
          {console.log('classes', classes)}
          {newRows && (
            <Grid rows={newRows} columns={newColumns} style={{ width: '100%' }}>
              <DragDropProvider />

              {/* <Table className={classes.root} style={{height :680}}  /> */}
              <VirtualTable height={680} messages={{ noData: 'Không có dữ liệu' }} />

              {columnOrder.length !== 0 ? <TableColumnReordering defaultOrder={columnOrder} /> : null}
              {columnOrder.length !== 0 ? <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} /> : null}

              <TableHeaderRow />
              <TableFixedColumns rightColumns={this.state.rightColumns} />
            </Grid>
          )}
          <TablePagination
            rowsPerPageOptions={[15, 30, 50]}
            component="div"
            count={roleGroupPage.roleGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Trang trước',
            }}
            nextIconButtonProps={{
              'aria-label': 'Trang tiếp theo',
            }}
            labelRowsPerPage="Hiển thị: "
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <ModelTableDisplaySetting
          handleChangeDialogTableSetting={this.handleChangeDialogTableSetting}
          columns={this.state.columns}
          openDialogTableSetting={this.state.openDialogTableSetting}
        />
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => this.handleDelete()}>
              LƯU
            </Button>
            <Button variant="outlined" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleDeleteDialog = () => {
    this.setState({ onDelete: true });
  };

  handleDelete = () => {
    const { selected } = this.state;
    this.props.onDelete(selected);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={id} onClick={() => this.handleSelect(id)} />;

  addCheckboxAll = () => <Checkbox checked={this.state.selectAll} onClick={() => this.handleSelectAll()} />;

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSelectAll = () => {
    const selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      this.setState({ selected: [], selectAll });
    } else {
      this.setState({ selected: allId, selectAll });
    }
  };

  // Thay đổi các trường hiện trên table
  handleChangeDialogTableSetting = open => {
    this.setState({ openDialogTableSetting: !open });
    // if (save) {
    //   console.log(save);
    //   // body.columns = this.state.columns.filter(item => item.name !== 'checkbox' && item.name !== 'stt' && item.name !== 'action');
    // }
  };

  handleSelect = id => {
    const { selected } = this.state;
    const index = this.state.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setState({ selected });
  };
}

RoleGroupPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roleGroupPage: makeSelectRoleGroupPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetRoleGroup: () => dispatch(getRoleGroupAction()),
    onDelete: body => dispatch(deleteRoleGroupAct(body)),
    onResetNotic: body => dispatch(defaultAction(body)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'roleGroupPage', reducer });
const withSaga = injectSaga({ key: 'roleGroupPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(RoleGroupPage);
