/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import { MenuItem, AppBar, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { serialize } from 'helper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { API_BANK_ACCOUNT } from '../../config/urlConfig';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddLtAccount from './selectors';
import reducer from './reducer';
import CustomInputField from 'components/Input/CustomInputField';
import saga from './saga';
import { createAccountRequest, updateAccountRequest, updatePasswordRequest, defaultAccountRequest } from './actions';

/* eslint-disable react/prefer-stateless-function */
function AddBankAccountPage(props) {
  const [localState, setLocalState] = useState({ initialBalance: 0, currentBalance: 0 });
  const [openModal, setOpenModal] = useState(false);
  const menu = localStorage.getItem('viewConfig');
  const { createAccountRequestSuccess, updateAccountRequestSuccess, loading, updatePasswordRequestSuccess } = props.accountRequest;
  const id = props.history.valueTab;
  const requestURL = API_BANK_ACCOUNT;
  console.log(props, 'oooooo');

  useEffect(() => {
    props.onDefaultAccountRequest();
  }, []);

  useEffect(
    () => {
      if (id !== 'add')
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setLocalState(data);
          });
    },
    [id],
  );

  useEffect(
    () => {
      if (loading) {
        props.history.goBack();
      }
    },
    [loading],
  );

  // useEffect(() => {
  //     if (updatePasswordRequestSuccess === true) {
  //         setOpenModal(false)
  //     }
  // }, [updatePasswordRequestSuccess])

  const handleChange = e => {
    // console.log(e,'ooo')
    let value;
    if (e.target.name === 'initialBalance' || e.target.name === 'currentBalance') {
      value = parseInt(e.target.value);
    } else {
      value = e.target.value;
    }
    setLocalState({
      ...localState,
      [e.target.name]: value,
    });
  };
  const onSave = () => {
    const body = {
      ...localState,
    };
    if (body._id) {
      props.onUpdateAccountRequest(body);
    } else {
      props.onCreateAccountRequest(body);
    }
  };
  // const handleSave = (item) => {
  //     if (item.password !== item.newPassword) {
  //         alert('Nhâp mật khẩu phải trùng nhau')
  //     } else {
  //         const data = {
  //             ...item,
  //             id: localState._id,
  //         }
  //         console.log(data, 'kkk')
  //         props.onUpdatePasswordRequest(data)
  //     }

  // }
  // const onChangePass = () => {
  //     setOpenModal(true)
  // }
  // const handleCloseDialog = () => {
  //     setOpenModal(false)
  // }
  return (
    <>
      <CustomAppBar
        title={id === 'add' ? `Thêm mới tài khoản ngân hàng` : `Cập nhật tài khoản ngân hàng`}
        onGoBack={() => {
          props.history.goBack();
        }}
        onSubmit={onSave}
        //  onChangePass={onChangePass}
        id={id}
      />
      <Grid container>
        <Typography variant="h5" color="primary">
          Điền thông tin
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        {/* <Grid item xs={4}>
                     <TextField
                         value={localState ? localState.moduleCode : null}
                         fullWidth
                         name="moduleCode"
                         label="ModuleCode"
                         select
                         variant="outlined"
                         margin="dense"
                         onChange={handleChange}
                         InputLabelProps={{
                             shrink: true,
                         }}
                     >
                         <MenuItem value={0}>--CHỌN--</MenuItem>
                         <MenuItem value={'Customer'}>Khách hàng</MenuItem>
                         <MenuItem value={'Supplier'}>Nhà cung cấp</MenuItem>
                         <MenuItem value={'Contract'}>Hợp đồng</MenuItem>
                     </TextField>
                 </Grid> */}
        <Grid item xs={4}>
          <CustomInputBase
            label={'Tên tài khoản'}
            value={localState.name ? localState.name : null}
            name="name"
            onChange={handleChange}
            error={localState.name ? '' : 'Nhập tên tài khoản'}
            helperText={localState.name ? '' : 'Không được để trống tên tài khoản'}
          />
        </Grid>
        {/* {id === 'add' ? */}
        {/* <Grid item xs={4}>
                    <TextField
                        label="Mật khẩu"
                        value={localState.password ? localState.password : null}
                        name="password"
                        onChange={handleChange}
                        variant="outlined"
                        type="password"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        fullWidth
                    />
                </Grid> */}
        {/* //   <Grid item xs={4}>
                     //         <CustomInputBase label={'Mật khẩu'} value={localState.password ? localState.password : null} name="password" onChange={handleChange} />
                     //     </Grid> */}
        {/* : <> </>} */}

        <Grid item md={4}>
          <CustomInputField
            configType="crmSource"
            configCode="S04"
            type="Source|CrmSource,S04|Id||_id"
            label={'Tên ngân hàng'}
            name="bank"
            value={localState.bank ? localState.bank : null}
            onChange={handleChange}
            error={localState.bank ? '' : 'Chọn ngân hàng'}
            helperText={localState.bank ? '' : 'Không được để trống ngân hàng'}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={'Số tài khoản'}
            value={localState.accountNumber ? localState.accountNumber : null}
            name="accountNumber"
            onChange={handleChange}
            error={localState.accountNumber ? '' : 'Nhập số tài khoản'}
            helperText={localState.accountNumber ? '' : 'Không được để trống số tài khoản'}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={'Số dư ban đầu'} value={localState.initialBalance} type="number" name="initialBalance" onChange={handleChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={'Số dư hiện tại'} value={localState.currentBalance} type="number" name="currentBalance" onChange={handleChange} />
        </Grid>
        {/* <Grid item xs={4}>
                     <CustomInputBase label={'Trạng thái tài khoản'} value={localState.accountStatus ? localState.accountStatus : null} name="accountStatus" onChange={handleChange} />
                 </Grid> */}
        {/* <Grid item xs={4}>
                    <TextField
                        value={localState ? localState.accountStatus : null}
                        fullWidth
                        name="accountStatus"
                        label='Trạng thái tài khoản'
                        select
                        variant="outlined"
                        margin="dense"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    >
                        <MenuItem value={0}>--CHỌN--</MenuItem>
                        <MenuItem value={1}>Hoạt động</MenuItem>
                        <MenuItem value={2}>Khóa hoạt động</MenuItem>
                    </TextField>
                </Grid> */}
        {/* <Grid item xs={4}>
                     <CustomInputBase label={'Trạng thái phê duyệt'} value={localState.state} name="state" onChange={handleChange} />
                 </Grid> */}
      </Grid>
      {/* <Dialog fullWidth maxWidth={'md'} open={openModal} onClose={handleCloseDialog} disableEnforceFocus>
                 <DialogTitle>Đổi mật khẩu</DialogTitle>
                 <DialogContent>
                     <ChangePassWord onSave={handleSave} onClose={handleCloseDialog} passwordData={localState}  />
                 </DialogContent>
             </Dialog> */}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  accountRequest: makeSelectAddLtAccount(),
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDefaultAccountRequest: () => dispatch(defaultAccountRequest()),
    onCreateAccountRequest: data => dispatch(createAccountRequest(data)),
    onUpdateAccountRequest: data => dispatch(updateAccountRequest(data)),
    onUpdatePasswordRequest: data => dispatch(updatePasswordRequest(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'accountRequest', reducer });
const withSaga = injectSaga({ key: 'accountRequest', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddBankAccountPage);
