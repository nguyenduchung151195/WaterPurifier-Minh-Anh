import React, { useEffect, useRef, useState } from 'react';
import { Fab as Fa, TextField as TextFieldUI, MenuItem, Tooltip, Grid } from '@material-ui/core';
import { Delete, CloudUpload } from '@material-ui/icons';
import { API_CUSTOMERS, API_USERS } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete, Autocomplete } from 'components/LifetekUi';
// import dot from 'dot-object';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { convertTemplate } from '../../helper';
import { clearWidthSpace } from '../../utils/common';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import axios from 'axios';
import './CustomCSS.css';
import CallDialog from './CallDialog';
const DialogCall = props => {
  const { open, call, onClose, profile } = props;
  const [caller, setCaller] = useState();
  const [openCallDialog, setOpenCallDialog] = useState();
  const [receiver, setReceiver] = useState();
  const [callConfig, setCallConfig] = useState();
  const [switchBoard, setSwitchBoard] = useState();
  const [arrLocal, setArrLocal] = useState();
  const [typeReceiver, setTypeReceiver] = useState(null);

  const employeeOptionLabel = option => {
    const phoneNumber = option.phoneNumber ? option.phoneNumber : '';
    const vocative = option.vocative ? option.vocative : '';
    if (vocative || phoneNumber) {
      return `${vocative} - ${phoneNumber}`;
    }
    return '';
  };
  useEffect(
    () => {
      if (
        call &&
        call.originItem &&
        call.originItem.detailInfo &&
        call.originItem.detailInfo.represent &&
        call.originItem.detailInfo.represent.localPersonInfo
      ) {
        setArrLocal(call.originItem.detailInfo.represent.localPersonInfo);
      }else{
        setArrLocal(call.localPersonInfo)
      }
    },
    [call],
  );
  useEffect(() => {
    let x = {
      uri: props.profile && props.profile.sip_uri,
      password: props.profile && props.profile.sip_password,
    };
    let y = {
      uri: props.profile && props.profile.sip_uri_receiver,
      password: props.profile && props.profile.sip_password_receiver,
    };
    setSwitchBoard([x, y]);
  }, []);
  return (
    <>
      <CallDialog
        open={openCallDialog}
        call={call}
        callConfig={callConfig}
        receiver={receiver}
        onClose={() => {
          setOpenCallDialog(false);
          setReceiver(null)
          setCaller(null)
          setTypeReceiver(null)
          onClose()
        }}
      />
      <DialogUI
        title="CALL"
        onSave={() => {
          setOpenCallDialog(true);
        }}
        saveText="Gọi điện"
        onClose={() => {
          onClose();
        }}
        open={open}
        style={{ position: 'relative' }}
      >
        <TextField
          value={caller}
          fullWidth
          select
          error={!caller}
          helperText={caller ? false : 'Không được bỏ trống'}
          onChange={e => {
            setCaller(e.target.value);
            if (e.target.value === 1) {
              setCallConfig(switchBoard && switchBoard[0]);
            } else {
              setCallConfig(switchBoard && switchBoard[1]);
            }
          }}
          label="Chọn số điện thoại gọi"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value={1}>Hệ thống 1</MenuItem>
          <MenuItem value={2}>Hệ thống 2</MenuItem>
        </TextField>
        <TextField
          value={typeReceiver}
          fullWidth
          select
          error={!typeReceiver}
          helperText={typeReceiver ? false : 'Không được bỏ trống'}
          onChange={e => {
            setTypeReceiver(e.target.value);
            if (e.target.value === 1) {
              setReceiver(call.phoneNumber);
            }
          }}
          label="Chọn số điện thoại nhận"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value={1}>Khách hàng</MenuItem>
          <MenuItem value={2}>Người đầu mối</MenuItem>
        </TextField>
        {typeReceiver === 2 ? (
          <Autocomplete
            onChange={value => {
              console.log('value', value);
              setReceiver(value.phoneNumber);
            }}
            suggestions={arrLocal}
            label="Người đầu mối"
            customOptionLabel={employeeOptionLabel}
            // isMulti
          />
        ) : (
          ''
        )}
      </DialogUI>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});
const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DialogCall);
