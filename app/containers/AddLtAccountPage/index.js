/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import { MenuItem, AppBar, Button,Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { serialize } from 'helper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { API_LT_ACCOUNT } from '../../config/urlConfig';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddLtAccount from './selectors';
import reducer from './reducer';
import saga from './saga';
import ChangePassWord from './components/ChangePassWord'
import { createAccountRequest, updateAccountRequest, updatePasswordRequest, reloadAccountPage } from './actions';

/* eslint-disable react/prefer-stateless-function */
function AddLtAccountPage(props) {
    const [localState, setLocalState] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const menu = localStorage.getItem('viewConfig')
    const { createAccountRequestSuccess, updateAccountRequestSuccess, loading, updatePasswordRequestSuccess } = props.accountRequest
    const id = props.history.valueTab;
    const requestURL = API_LT_ACCOUNT;
    console.log(props.accountRequest, 'lll')

    useEffect(
        () => {
            if (id !== "add")
                fetch(`${requestURL}/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setLocalState(data)
                    });
        },
        [id],
    );

    useEffect(() => {
        console.log(loading, 'kkkk')
        if (loading) {
            props.reloadAccountPage();
            props.history.goBack();
        }
    }, [loading])

    useEffect(() => {
        if (updatePasswordRequestSuccess === true) {
            setOpenModal(false)
        }
    }, [updatePasswordRequestSuccess])

    const handleChange = (e) => {
        setLocalState({
            ...localState, [e.target.name]: e.target.value
        })
    }
    const onSave = () => {
        const body = {
            ...localState
        }
        if (body._id) {
            props.onUpdateAccountRequest(body)
        } else {
            props.onCreateAccountRequest(body)
        }
    }
    const handleSave = (item) =>{
        if(item.password !== item.newPassword){
            alert('Nhâp mật khẩu phải trùng nhau')
        }else{
            const data={
                ...item,
                id : localState._id,
            }
            console.log(data,'kkk')
            props.onUpdatePasswordRequest(data)
        }
        
    }
    const onChangePass = () => {
        setOpenModal(true)
    }
    const handleCloseDialog= ()=>{
        setOpenModal(false)
    }
    return (
        <>
            <CustomAppBar
            className
                title={
                    id === 'add'
                        ? `Thêm mới tài khoản`
                        : `Cập nhật tài khoản`
                }
                onGoBack={() => {
                    props.history.goBack();
                }}
                onSubmit={onSave}
                onChangePass={onChangePass}
                id={id}
            />
            <Grid container>
                <Typography variant="h5" color="primary">
                    Điền thông tin
                </Typography>
            </Grid>

            <Grid container spacing={8}>
                <Grid item xs={4}>
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
                        {/* <MenuItem value={3}>Đối tác</MenuItem> */}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <CustomInputBase label={'Tài khoản'} value={localState.username ? localState.username : null} name="username" onChange={handleChange} />
                </Grid>
                {id === 'add' ?
                    <Grid item xs={4}>
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
                    </Grid>
                    //   <Grid item xs={4}>
                    //         <CustomInputBase label={'Mật khẩu'} value={localState.password ? localState.password : null} name="password" onChange={handleChange} />
                    //     </Grid>
                    : <> </>}

                <Grid item xs={4}>
                    <CustomInputBase label={'Số điện thoại'} value={localState.accountPhone ? localState.accountPhone : null} name="accountPhone" onChange={handleChange} />
                </Grid>
                <Grid item xs={4}>
                    <CustomInputBase label={'Tên người dùng'} value={localState.accountName ? localState.accountName : null} name="accountName" onChange={handleChange} />
                </Grid>
                <Grid item xs={4}>
                    <CustomInputBase label={'Email'} value={localState.accountEmail ? localState.accountEmail : null} name="accountEmail" onChange={handleChange} />
                </Grid>
                {/* <Grid item xs={4}>
                    <CustomInputBase label={'Trạng thái tài khoản'} value={localState.accountStatus ? localState.accountStatus : null} name="accountStatus" onChange={handleChange} />
                </Grid> */}
                <Grid item xs={4}>
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
                        {/* <MenuItem value={3}>Đối tác</MenuItem> */}
                    </TextField>
                </Grid>
                {/* <Grid item xs={4}>
                    <CustomInputBase label={'Trạng thái phê duyệt'} value={localState.state} name="state" onChange={handleChange} />
                </Grid> */}
            </Grid>
            <Dialog fullWidth maxWidth={'md'} open={openModal} onClose={handleCloseDialog} disableEnforceFocus>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <ChangePassWord onSave={handleSave} onClose={handleCloseDialog} passwordData={localState}  />
                </DialogContent>
            </Dialog>
        </>
    );
}


const mapStateToProps = createStructuredSelector({
    accountRequest: makeSelectAddLtAccount(),
});
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onCreateAccountRequest: (data) => dispatch(createAccountRequest(data)),
        onUpdateAccountRequest: (data) => dispatch(updateAccountRequest(data)),
        onUpdatePasswordRequest: (data) => dispatch(updatePasswordRequest(data)),
        reloadAccountPage: () => dispatch(reloadAccountPage())
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
)(AddLtAccountPage);
