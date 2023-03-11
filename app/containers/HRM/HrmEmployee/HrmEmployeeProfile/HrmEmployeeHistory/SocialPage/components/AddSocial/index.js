/**
 *
 * AddSocial
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Tab, Tabs, Avatar, MenuItem, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Add, TrendingFlat, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../../../../../Dashboard/actions';
import messages from './messages';
import './style.css';
import { createStructuredSelector } from 'reselect';
/* eslint-disable react/prefer-stateless-function */
function AddSocial(props) {
  const { social, onSave, onClose, code, hrmEmployeeId, miniActive, onMergeData } = props;
  // console.log(88888, hrmEmployeeId);
  const [localState, setLocalState] = useState({
    others: {},
    hrmEmployeeId: hrmEmployeeId,
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  useEffect(
    () => {
      if (social && social.originItem) {
        setLocalState({ ...social.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [social],
  );
  // const notNegative = value => {
  //   const regex = /[^-+eE]/u;
  //   const data = regex.test(value);
  //   return data;
  // };

  useEffect(
    () => {
      let messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      if (localState.salary && localState.salary < 0) messages = { ...messages, salary: 'Tiền lương không thể âm' };
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = e => {
    const name = 'payDay';
    const value = moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleInpuDate = (e, isStartDate) => {
    const name = isStartDate ? 'fromMonth' : 'toMonth';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.fromMonth && newFilter.toMonth) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.fromMonth && !newFilter.toMonth) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.fromMonth && newFilter.toMonth && new Date(newFilter.toMonth) < new Date(newFilter.fromMonth)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }
    setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );
  return (
    <div style={{ width: miniActive === true ? window.innerWidth - 80 : window.innerWidth - 260, padding: 20 }}>
      {/* <AppBar className='HearderappBarSocial'>
        <Toolbar>
          <IconButton
            className='BTNSocial'
            color="inherit"
            variant="contained"
            onClick={e => onClose()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {props.social === null
              ? <p variant="h6" color="inherit">THÊM MỚI</p>
              : <p variant="h6" color="inherit">CẬP NHẬT</p>}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={e => {
              onSave(localState);
            }}
          >
            LƯU
          </Button>
        </Toolbar>
      </AppBar>   */}
      <CustomAppBar
        title={props.social === null ? 'THÊM MỚI bảo hiểm xã hội' : 'CẬP NHẬT bảo hiểm xã hội'}
        onGoBack={e => onClose()}
        className
        isTask
        onSubmit={e => {
          onSave(localState);
        }}
      />

      <Grid container spacing={8} style={{ marginTop: '80px' }}>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.fromMonth || 'Chọn ngày'}
            name="fromMonth"
            value={localState.fromMonth}
            onChange={e => handleInpuDate(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.fromMonth}
            required={localCheckRequired && localCheckRequired.fromMonth}
            error={localMessages && localMessages.fromMonth}
            helperText={localMessages && localMessages.fromMonth}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.toMonth || 'Chọn ngày'}
            name="toMonth"
            value={localState.toMonth}
            onChange={e => handleInpuDate(e, false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.toMonth}
            required={localCheckRequired && localCheckRequired.toMonth}
            error={localMessages && localMessages.toMonth}
            helperText={localMessages && localMessages.toMonth}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.numberMonth}
            name="numberMonth"
            value={localState.numberMonth}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.numberMonth}
            required={localCheckRequired && localCheckRequired.numberMonth}
            error={localMessages && localMessages.numberMonth}
            helperText={localMessages && localMessages.numberMonth}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.numberYear}
            name="numberYear"
            value={localState.numberYear}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.numberYear}
            required={localCheckRequired && localCheckRequired.numberYear}
            error={localMessages && localMessages.numberYear}
            helperText={localMessages && localMessages.numberYear}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.salary}
            name="salary"
            value={localState.salary}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.salary}
            required={localCheckRequired && localCheckRequired.salary}
            error={localMessages && localMessages.salary}
            helperText={localMessages && localMessages.salary}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.currency}
            name="currency"
            value={localState.currency}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.currency}
            required={localCheckRequired && localCheckRequired.currency}
            error={localMessages && localMessages.currency}
            helperText={localMessages && localMessages.currency}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.ratio}
            name="ratio"
            value={localState.ratio}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.ratio}
            required={localCheckRequired && localCheckRequired.ratio}
            error={localMessages && localMessages.ratio}
            helperText={localMessages && localMessages.ratio}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.payDay || 'Chọn ngày'}
            name="payDay"
            value={localState.payDay}
            onChange={e => handleInputChange(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.payDay}
            required={localCheckRequired && localCheckRequired.payDay}
            error={localMessages && localMessages.payDay}
            helperText={localMessages && localMessages.payDay}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.jobDetail}
            name="jobDetail"
            value={localState.jobDetail}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.jobDetail}
            required={localCheckRequired && localCheckRequired.jobDetail}
            error={localMessages && localMessages.jobDetail}
            helperText={localMessages && localMessages.jobDetail}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.coefficientInsurance}
            name="coefficientInsurance"
            value={localState.coefficientInsurance}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.coefficientInsurance}
            required={localCheckRequired && localCheckRequired.coefficientInsurance}
            error={localMessages && localMessages.coefficientInsurance}
            helperText={localMessages && localMessages.coefficientInsurance}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.coefficientPosition}
            name="coefficientPosition"
            value={localState.coefficientPosition}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.coefficientPosition}
            required={localCheckRequired && localCheckRequired.coefficientPosition}
            error={localMessages && localMessages.coefficientPosition}
            helperText={localMessages && localMessages.coefficientPosition}
          />
        </Grid>
        {/* ghi chú */}
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.reason}
            name="reason"
            value={localState.reason}
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.reason}
            required={localCheckRequired && localCheckRequired.reason}
            error={localMessages && localMessages.reason}
            helperText={localMessages && localMessages.reason}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      {/* <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              onSave(localState);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            Hỷ
          </CustomButton>
        </Grid>
      </Grid> */}
    </div>
  );
}

AddSocial.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(MergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
  injectIntl,
)(AddSocial);
