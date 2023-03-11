/* eslint-disable react/no-unused-state */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * EditAssetInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Grid,
  withStyles,
  FormHelperText,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  FormControl,
  Typography,
  Fab,
  Checkbox,
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { CameraAlt, Delete } from '@material-ui/icons';
import { TextField } from 'components/LifetekUi';
import AvatarImg from 'images/product.png';

import { getLabelName } from 'utils/common';
import TextFieldCode from 'components/TextFieldCode';
import styles from './styles';
import { DatePicker } from 'material-ui-pickers';
import { MODULE_CODE } from '../../../../../../utils/constants';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
/* eslint-disable react/prefer-stateless-function */

const listStatus = [
  {
    code: 0,
    name: 'Đang hoạt động',
  },
  {
    code: 1,
    name: 'Bảo hành',
  },
  {
    code: 2,
    name: 'Bảo trì',
  },
  {
    code: 3,
    name: 'Hỏng',
  },
  {
    code: 4,
    name: 'Mất',
  },
  {
    code: 5,
    name: 'Thanh lý',
  },
];

function KanbanStep(props) {
  const { listStatus, currentStatus, onChange } = props;

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={currentStatus}>
      {listStatus.map((item, i) => (
        <Step key={i} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

class EditAssetInfo extends React.Component {
  state = {
    level: 0,
    assetStatus: 0,
    state: 1,
    code: '',
    image: '',
    name: '',
    unit: '',
    type: '',
    warrantyPeriod: '',
    warrantyPeriodUnit: '',
    errorWarrantyPeriodUnit: '',
    dateAcceptance: null,
    location: '',
    customer: '',
    supplierId: '',
    note: '',
    depreciationCalculatedValue: '',
    depreciationCalculatedUnit: '',
    assetSerial: [],
    // image: null,
    errorName: false,
    errorCode: false,
    errorDepreciationCalculatedUnit: false,
    errorSupplier: false,
    errorUnit: false,
    errorType: false,
    avatar: null,
    isSubmit: false,
    showSeries: false,
    expiry: '',
    expiryUnit: '',
    errorExpiryUnit: false,
    coefficient: '',
    meterNumber: '',
    _id: '',
    purchaseDate: '',
    warrantyPeriodDate: '',
    loanTerm: '',
    installationDate: '',
    installationLocation: '',
    activateDate: '',
    lastMaintenanceDate: '',
    expectedMaintenanceDate: '',
    averageOutputMonth: '',
    orderOfInstallation: '',
    timelyCoreReplacementHistory: '',
    latestReplacementDate: '',
    estimatedReplacementDate: '',
    recommendedLifespan: '',
    timeSpent: '',
    lifespanRemaining: '',
    timeAlertThreshold: '',
    lifespanAccordingToRecommendedOutput: '',
    productUsage: '',
    remainingOutput: '',
    yieldWarningThreshold: '',
    PH: '',
    flow: '',
    dischargeRate: null,
    totalCoreCapacity: null,
    coefficient: '',
    Serial: '',
    parentId: '',
    checkReset: false,
  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;

    if (!this.state.isSubmit && preProps.asset !== asset && asset) {
      // console.log(98888, asset);
      this.setState({
        image: asset.image || '',
        name: asset.name || '',
        code: asset.code || '',
        type: asset.type ? asset.type._id : '',

        assetStatus: asset.assetStatus == null ? 0 : asset.assetStatus,
        location: asset.location || '',
        customer: asset.customer || '',
        depreciationCalculatedValue: asset.depreciationCalculatedValue || '',
        warrantyPeriod: asset.warrantyPeriod || '',
        warrantyPeriodUnit: asset.warrantyPeriodUnit || '',
        dateAcceptance: asset.dateAcceptance || '',
        assetSerial: asset.assetSerial || [],
        supplierId: asset.supplierId ? asset.supplierId._id : '',
        unit: asset.unit ? asset.unit._id : '',
        depreciationCalculatedUnit: asset.depreciationCalculatedUnit ? asset.depreciationCalculatedUnit._id : '',
        note: asset.note || '',
        expiry: asset.expiry || '',
        expiryUnit: asset.expiryUnit || '',
        coefficient: asset.coefficient || '',
        meterNumber: asset.meterNumber || '',
        parentId: asset.parentId || '',
        _id: asset.assetId || '',

        purchaseDate: asset.purchaseDate || '',
        warrantyPeriodDate: asset.warrantyPeriodDate || '',
        loanTerm: asset.loanTerm || '',
        installationDate: asset.installationDate || '',
        installationLocation: asset.installationLocation || '',
        activateDate: asset.activateDate || '',
        lastMaintenanceDate: asset.lastMaintenanceDate || '',
        expectedMaintenanceDate: asset.expectedMaintenanceDate || '',
        averageOutputMonth: asset.averageOutputMonth || '',
        orderOfInstallation: asset.orderOfInstallation || '',
        timelyCoreReplacementHistory: asset.timelyCoreReplacementHistory || '',

        latestReplacementDate: asset.latestReplacementDate || '',
        estimatedReplacementDate: asset.estimatedReplacementDate || '',
        recommendedLifespan: asset.recommendedLifespan || '',
        timeSpent: asset.timeSpent || '',
        lifespanRemaining: asset.lifespanRemaining || '',
        timeAlertThreshold: asset.timeAlertThreshold || '',
        lifespanAccordingToRecommendedOutput: asset.lifespanAccordingToRecommendedOutput || '',
        productUsage: asset.productUsage || '',
        remainingOutput: asset.remainingOutput || '',
        yieldWarningThreshold: asset.yieldWarningThreshold || '',
        PH: asset.PH || '',
        flow: asset.flow || '',
        dischargeRate: asset.dischargeRate || null,
        totalCoreCapacity: asset.totalCoreCapacity || null,
        coefficient: asset.coefficient || '',
        Serial: asset.Serial || '',
        checkReset: asset.checkReset || false,
      });
      // this.state.isSubmit = true;
    }
  }

  handleChangeStatus = status => {
    this.setState({ assetStatus: status });
  };

  handleChangeSerial = (index, name, value) => {
    // console.log(name, index, e.target.value);
    const { assetSerial } = this.state;
    assetSerial[index][name] = value;
    this.setState({ assetSerial });
  };

  handleDeleteSerial = index => {
    const { assetSerial } = this.state;
    assetSerial.splice(index, 1);
    this.setState({ assetSerial });
  };

  handleAddSerial = () => {
    const { assetSerial } = this.state;
    assetSerial.push({
      serial: '',
      price: '',
      date: null,
    });
    this.setState({ assetSerial });
  };

  handleChangeCheckbox = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    if (name === 'name' && value.trim().length < 200) {
      this.setState({ errorName: false });
    }
    if (name === 'code' && value.trim().length > 4) {
      this.setState({ errorCode: false });
    }
    if (name === 'calculateUnit') {
      this.setState({ errorValue: false });
    }
    if (name === 'supplierId') {
      this.setState({ errorSupplier: false });
    }

    if (name === 'warrantyPeriodUnit') {
      this.setState({ errorWarrantyPeriodUnit: false });
    }

    if (name === 'unit') {
      this.setState({ errorUnit: false });
    }

    if (name === 'depreciationCalculatedUnit') {
      this.setState({ errorDepreciationCalculatedUnit: false });
    }
    if (name === 'expiryUnit') {
      this.setState({ errorExpiryUnit: false });
    }
    if (name === 'type') {
      this.setState({ errorType: false });
    }
    this.setState({ [name]: value });
  };

  handleDateChange = (name, value) => {
    this.setState({ [name]: value });
  };

  onHoverIn = () => {
    this.setState({ showAva: true });
  };
  handleChangeAsset = (e, fieldName, isDate, isFirst) => {
    const name = fieldName;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    // const { target: { value, name } } = e;
    // const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, fieldName, value);
    this.setState({
      [name]: value,
      // localMessages: messages,
    });
  };

  resetAsset = () => {
    let newEstimatedReplacementDate = moment()
      .add(this.state.recommendedLifespan, 'months')
      .format('YYYY-MM-DD');
    this.setState({
      latestReplacementDate: moment().format('YYYY-MM-DD'),
      // localMessages: messages,
      // timeAlertThreshold: moment().format('YYYY-MM-DD'),
      estimatedReplacementDate: newEstimatedReplacementDate,
      checkReset: true,
    });
  };

  onHoverOut = () => {
    this.setState({ showAva: false });
  };

  // eslint-disable-next-line consistent-return
  onSelectImg = e => {
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    const file = e.target.files[0];
    // k có file
    if (!file) return false;

    let checkFile = true;
    let txt = '';
    // check image type
    if (types.every(type => file.type !== type)) {
      checkFile = false;
      txt = 'File bạn vừa chọn không đúng định dạng';
      // check image size > 3mb
    } else if (file.size / 1024 / 1024 > 3) {
      checkFile = false;
      txt = 'Dung lượng file tối đa là 3MB';
    }

    // confirm logo
    if (!checkFile) {
      this.props.enqueueSnackbar(txt, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    } else {
      const urlAvt = URL.createObjectURL(e.target.files[0]);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ image: urlAvt, avatar: e.target.files[0] }); // ,
    }
  };

  getData = () => {
    const {
      avatar,
      level,
      assetStatus,
      state,
      code,
      image,
      name,
      type,
      unit,
      warrantyPeriod,
      warrantyPeriodUnit,
      dateAcceptance,
      location,
      customer,
      supplierId,
      note,
      depreciationCalculatedValue,
      depreciationCalculatedUnit,
      assetSerial,
      expiry,
      expiryUnit,
      meterNumber,
      latestReplacementDate,
      estimatedReplacementDate,
      recommendedLifespan,
      timeSpent,
      lifespanRemaining,
      timeAlertThreshold,
      lifespanAccordingToRecommendedOutput,
      productUsage,
      remainingOutput,
      yieldWarningThreshold,
      PH,
      flow,
      dischargeRate,
      totalCoreCapacity,
      coefficient,
      Serial,
      parentId,
      checkReset,
    } = this.state;
    const rex = /^[A-Za-z0-9]+$/;
    // if (
    //   name.trim() === '' ||
    //   name.trim().length > 200 ||
    //   code.trim().length < 5 ||
    //   !rex.test(code.trim()) ||
    //   supplierId === '' ||
    //   type === '' ||
    //   type === undefined
    //   // expiryUnit === ''
    // ) {
    //   console.log(4);
    //   if (name.trim() === '' || name.trim().length > 200) {
    //     this.setState({ errorName: true });
    //   }

    //   if (code.trim() === '' || code.trim().length < 5) {
    //     this.setState({ errorCode: true });
    //   }

    //   if (type === '') {
    //     this.setState({ errorType: true });
    //   }
    //   if (supplierId === '') {
    //     this.setState({ errorSupplier: true });
    //   }
    //   // if (warrantyPeriodUnit === '') {
    //   //   this.setState({ errorWarrantyPeriodUnit: true });
    //   // }
    //   // if (expiryUnit === '') {
    //   //   this.setState({ errorExpiryUnit: true });
    //   // }
    //   this.props.handleChangeIndex(0);
    // } else {
    // console.log(3);
    // console.log(this.state);
    this.setState({ isSubmit: true });
    const info = {
      avatar,
      level,
      assetStatus,
      state,
      code,
      type,
      image,
      name,
      unit,
      warrantyPeriod,
      warrantyPeriodUnit,
      dateAcceptance,
      location,
      customer,
      supplierId,
      note,
      depreciationCalculatedValue: parseInt(depreciationCalculatedValue),
      assetSerial,
      expiry,
      expiryUnit,
      meterNumber,
      latestReplacementDate,
      estimatedReplacementDate,
      recommendedLifespan,
      timeSpent,
      lifespanRemaining,
      timeAlertThreshold,
      lifespanAccordingToRecommendedOutput,
      productUsage,
      remainingOutput,
      yieldWarningThreshold,
      PH,
      flow,
      dischargeRate,
      totalCoreCapacity,
      coefficient,
      Serial,
      parentId: this.props.asset.parentId,
      checkReset,
    };

    if (depreciationCalculatedUnit) {
      info.depreciationCalculatedUnit = depreciationCalculatedUnit;
    }
    return info;
    // }
  };

  render() {
    const { classes, suppliers, units, assetTypes, readOnly, show } = this.props;
    const { assetStatus, image } = this.state;
    // console.log('hihihi1111', this.state.ActivateDate);
    return (
      <div>
        <Grid container style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" color="primary" className={classes.button} onClick={() => this.resetAsset()}>
            reset
          </Button>
        </Grid>
        <Grid container spacing={16}>
          {/* <Grid md={12} item>
             <KanbanStep listStatus={listStatus} currentStatus={assetStatus} onChange={this.handleChangeStatus} />
           </Grid> */}
          <Grid md={2} item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 5,
                boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src={image || AvatarImg} alt="Ảnh sản phẩm" className={classes.avatar} />
              <input
                accept="image/*"
                className={classes.inputAvt}
                type="file"
                onChange={this.onSelectImg}
                onMouseEnter={this.onHoverIn}
                onMouseLeave={this.onHoverOut}
                name="avatar"
                disabled
              />
              <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                <CameraAlt className={classes.iconCam} />
              </span>
            </div>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={16}>
              <Grid md={6} item>
                <TextField
                  // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                  label="Tên thiết bị"
                  name="name"
                  fullWidth
                  value={this.state.name}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorName}
                  InputProps={{
                    readOnly: readOnly ? true : false,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {this.state.errorName && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên có độ dài không quá 200 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                  label="Mã thiết bị"
                  name="code"
                  fullWidth
                  variant="outlined"
                  value={this.state.code}
                  onChange={this.handleChangeInput}
                  margin="dense"
                  required
                  error={this.state.errorCode}
                  InputProps={{
                    readOnly: readOnly ? true : false,
                  }}
                />
                {this.state.errorCode && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Mã có độ dài không dưới 5 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                  label="Id thiết bị"
                  name="_id"
                  fullWidth
                  variant="outlined"
                  value={this.state._id || null}
                  onChange={this.handleChangeInput}
                  margin="dense"
                  required
                  error={this.state.errorCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid md={6} item>
                <TextField
                  // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                  label="Serial"
                  name="Serial"
                  fullWidth
                  value={this.state.Serial}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorName}
                  InputProps={{
                    readOnly: readOnly ? true : false,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
              </Grid>
              {!show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.latestReplacementDate || null}
                    variant="outlined"
                    label="Ngày thay thế gần nhất"
                    margin="dense"
                    fullWidth
                    onChange={e => this.handleChangeAsset(e, 'latestReplacementDate', true, false)}
                    InputLabelProps={{ shrink: true }}
                    keyboard
                    // disablePast
                    // disableOpenOnEnter
                    // keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.estimatedReplacementDate || null}
                    variant="outlined"
                    label="Ngày thay thế dự kiến"
                    margin="dense"
                    fullWidth
                    // onChange={e => this.handleChangeAsset(e, 'estimatedReplacementDate', true, false)}
                    InputLabelProps={{ shrink: true }}
                    // keyboard
                    InputProps={{
                      readOnly: true,
                    }}
                    // disablePast
                    // disableOpenOnEnter
                    // keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Tuổi thọ khuyến cáo"
                    name="recommendedLifespan"
                    fullWidth
                    value={this.state.recommendedLifespan}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Thời gian sử dụng"
                    name="timeSpent"
                    fullWidth
                    value={this.state.timeSpent}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    // type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Tuổi thọ còn lại"
                    name="lifespanRemaining"
                    fullWidth
                    value={this.state.lifespanRemaining}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    // type="number"
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  {/* <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.timeAlertThreshold || null}
                    variant="outlined"
                    label="Ngưỡng cảnh báo thời gian"
                    margin="dense"
                    fullWidth
                    onChange={e => this.handleChangeAsset(e, 'timeAlertThreshold', true, false)}
                    InputLabelProps={{ shrink: true }}
                    keyboard
                  // disablePast
                  // disableOpenOnEnter
                  // keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  /> */}
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Ngưỡng cảnh báo thời gian"
                    name="timeAlertThreshold"
                    fullWidth
                    value={this.state.timeAlertThreshold}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Tuổi thọ theo sản lượng khuyến cáo"
                    name="lifespanAccordingToRecommendedOutput"
                    fullWidth
                    value={this.state.lifespanAccordingToRecommendedOutput}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label=" Sản lượng còn lại"
                    name="remainingOutput"
                    fullWidth
                    value={this.state.remainingOutput}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Sản lượng sử dụng"
                    name="productUsage"
                    fullWidth
                    value={this.state.productUsage}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  {/* <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.yieldWarningThreshold || null}
                    variant="outlined"
                    label=" Ngưỡng cảnh báo sản lượng"
                    margin="dense"
                    fullWidth
                    // onChange={e => this.handleChangeAsset(e, 'yieldWarningThreshold', true, false)}
                    // keyboard
                    // InputProps={{
                    //   readOnly: true,
                    // }}
                    InputLabelProps={{ shrink: true }}
                    // disablePast
                    // disableOpenOnEnter
                    // keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  /> */}
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Ngưỡng cảnh báo sản lượng"
                    name="yieldWarningThreshold"
                    fullWidth
                    value={this.state.yieldWarningThreshold}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.warningDay || null}
                    variant="outlined"
                    label="Ngày cảnh báo "
                    margin="dense"
                    fullWidth
                    // onChange={e => this.handleChangeAsset(e, 'yieldWarningThreshold', true, false)}
                    // keyboard
                    // InputProps={{
                    //   readOnly: true,
                    // }}
                    InputLabelProps={{ shrink: true }}
                    // disablePast
                    // disableOpenOnEnter
                    // keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                  />
                </Grid>
              ) : null}

              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label=" Độ PH"
                    name="PH"
                    fullWidth
                    value={this.state.PH}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Lưu lượng"
                    name="flow"
                    fullWidth
                    value={this.state.flow}
                    onChange={this.handleChangeInput}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // error={this.state.errorName}
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Tỷ lệ thải"
                    name="dischargeRate"
                    fullWidth
                    type="number"
                    value={this.state.dischargeRate}
                    onChange={this.handleChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // error={this.state.errorName}
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
                 {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Tổng dung tích lõi"
                    name="totalCoreCapacity"
                    fullWidth
                    type="number"
                    value={this.state.totalCoreCapacity}
                    onChange={this.handleChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // InputProps={{
                    //   readOnly: true
                    // }} 
                    // error={this.state.errorName}
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Công thức tính sản lượng sử dụng"
                    name="formulaQuantity"
                    fullWidth
                    value={this.state.formulaQuantity}
                    onChange={this.handleChangeInput}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // error={this.state.errorName}
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {!show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                    label="Hệ số"
                    name="coefficient"
                    fullWidth
                    value={this.state.coefficient}
                    onChange={this.handleChangeInput}
                    required
                    // error={this.state.errorName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="number"
                  />
                  {/* {this.state.errorName && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Tên có độ dài không quá 200 kí tự và không được để trống
                   </FormHelperText>
                 )} */}
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.purchaseDate || null}
                    variant="outlined"
                    label="Ngày mua"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.warrantyPeriodDate || null}
                    variant="outlined"
                    label="Hạn bảo hành"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.loanTerm || null}
                    variant="outlined"
                    label="Hạn cho mượn"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.installationDate || null}
                    variant="outlined"
                    label="Ngày lắp đặt"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                    label="Vị trí lắp đặt"
                    name="installationLocation"
                    fullWidth
                    variant="outlined"
                    value={this.state.installationLocation || null}
                    onChange={this.handleChangeInput}
                    margin="dense"
                    required
                    error={this.state.errorCode}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.activateDate || null}
                    variant="outlined"
                    label="Ngày kích hoạt"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.lastMaintenanceDate || null}
                    variant="outlined"
                    label="Ngày bảo trì lần cuối"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={this.state.expectedMaintenanceDate || null}
                    variant="outlined"
                    label="Ngày bảo trì dự kiến"
                    margin="dense"
                    fullWidth
                    // onChange={date => this.handleDateChange('dateAcceptance', date)}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                    label="Sản lượng trung bình/tháng"
                    name="averageOutputMonth"
                    fullWidth
                    variant="outlined"
                    value={this.state.averageOutputMonth || null}
                    onChange={this.handleChangeInput}
                    margin="dense"
                    required
                    error={this.state.errorCode}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                    label="Thứ tự lắp đặt"
                    name="orderOfInstallation"
                    fullWidth
                    variant="outlined"
                    value={this.state.orderOfInstallation || null}
                    onChange={this.handleChangeInput}
                    margin="dense"
                    required
                    error={this.state.errorCode}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {show ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                    label="Lịch sử thay lõi đúng hạn"
                    name="timelyCoreReplacementHistory"
                    fullWidth
                    variant="outlined"
                    value={this.state.timelyCoreReplacementHistory ? 'Đúng hạn' : 'Không đúng hạn'}
                    onChange={this.handleChangeInput}
                    margin="dense"
                    required
                    error={this.state.errorCode}
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : null}
              {/* <Grid md={6} item>
                 <Grid container spacing={8}>
                   <Grid item xs={7}>
                     <TextField
                       fullWidth
                       // label={getLabelName('warrantyPeriod', MODULE_CODE.Asset) || 'Thời gian bảo hành'}
                       label="Thời gian bảo hành"
                       value={this.state.warrantyPeriod}
                       onChange={this.handleChangeInput}
                       name="warrantyPeriod"
                       type="number"
                       InputProps={{
                         readOnly: true,
                       }}
                     />
                   </Grid>
                   <Grid item xs={5}>
                     <TextField
                       select
                       fullWidth
                       // label={getLabelName('warrantyPeriodUnit', MODULE_CODE.Asset) ||'Đơn vị'}
                       label="Đơn vị bảo hành"
                       name="warrantyPeriodUnit"
                       value={this.state.warrantyPeriodUnit}
                       onChange={this.handleChangeInput}
                       // required
                       error={this.state.errorWarrantyPeriodUnit}
                       InputProps={{
                         readOnly: true,
                       }}
                     >
                       {units &&
                         units.map((item, index) => (
                           <MenuItem key={item._id} value={item._id}>
                             {item.name}
                           </MenuItem>
                         ))}
                     </TextField>
                     {this.state.errorWarrantyPeriodUnit && (
                       <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                         Phải chọn đơn vị tính
                       </FormHelperText>
                     )}
                     {/* <Link to="/Stock/config" style={{ display: 'inline-block', textAlign: 'right' }}>
                       Quản lý đơn vị tính
                     </Link> 
                   </Grid>
                 </Grid>
               </Grid> */}
              {/* <Grid item xs={6}>
                 <TextField
                   select
                   fullWidth
                   // label={getLabelName('type', MODULE_CODE.Asset) || 'Loại tài sản'}
                   label="Loại thiết bị"
                   name="type"
                   value={this.state.type}
                   onChange={this.handleChangeInput}
                   required
                   error={this.state.errorType}
                   InputProps={{
                     readOnly: true,
                   }}
                 >
                   {assetTypes &&
                     assetTypes.map((item, index) => (
                       <MenuItem key={item._id} value={item._id}>
                         {item.name}
                       </MenuItem>
                     ))}
                 </TextField>
                 {this.state.errorType && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Phải chọn Loại thiết bị
                   </FormHelperText>
                 )} */}
              {/* <Link to="/Stock/config" style={{ display: 'inline-block', textAlign: 'right' }}>
                   Quản lý loại thiết bị
                 </Link> */}
              {/* </Grid>
               <Grid item xs={6}>
                 <TextField
                   fullWidth
                   // label={getLabelName('location', MODULE_CODE.Asset) || 'Vị trí'}
                   label="Vị trí"
                   value={this.state.location}
                   onChange={this.handleChangeInput}
                   name="location"
                   InputProps={{
                     readOnly: true,
                   }}
                 />
               </Grid> */}
              {show ? (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    // label={getLabelName('location', MODULE_CODE.Asset) || 'Vị trí'}
                    label="Mã khách hàng"
                    value={this.state.customer.code}
                    onChange={this.handleChangeInput}
                    name="customer"
                    InputProps={{
                      readOnly: readOnly ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              ) : null}
              {/* <Grid item xs={6}>
                 <DatePicker
                   inputVariant="outlined"
                   format="DD/MM/YYYY"
                   value={this.state.dateAcceptance || null}
                   variant="outlined"
                   label="Thời gian nghiệm thu"
                   margin="dense"
                   fullWidth
                   // onChange={date => this.handleDateChange('dateAcceptance', date)}
                   InputProps={{
                     readOnly: true,
                   }}
                 />
               </Grid> */}
              {/* <Grid md={6} item>
                 <TextField
                   select
                   label={getLabelName('supplier.name', MODULE_CODE.Asset) || 'Nhà cung cấp'}
                   name="supplierId"
                   fullWidth
                   value={this.state.supplierId}
                   onChange={this.handleChangeInput}
                   required
                   error={this.state.errorSupplier}
                   InputProps={{
                     readOnly: true,
                   }}
                 >
                   {suppliers &&
                     suppliers.map(item => (
                       <MenuItem key={item._id} value={item._id}>
                         {item.name}
                       </MenuItem>
                     ))}
                 </TextField>
                 {this.state.errorSupplier && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Phải chọn nhà cung cấp
                   </FormHelperText>
                 )} */}
              {/* <Link to="/crm/Supplier" style={{ display: 'block', textAlign: 'right' }}>
                   Quản lý nhà cung cấp
                 </Link> */}
              {/* </Grid> */}

              {/* <Grid md={6} item>
                 <Grid container spacing={8}>
                   <Grid item xs={7}>
                     <TextField
                       fullWidth
                       // label={getLabelName('depreciationCalculatedValue', MODULE_CODE.Asset) || 'Giá trị tính khấu hao'}
                       label="Giá trị tính khấu hao"
                       value={this.state.depreciationCalculatedValue}
                       onChange={this.handleChangeInput}
                       name="depreciationCalculatedValue"
                       type="number"
                       InputProps={{
                         readOnly: true,
                       }}
                     />
                   </Grid>
                   <Grid item xs={5}>
                     <TextField
                       select
                       fullWidth
                       label="Đơn vị tính khấu hao"
                       name="depreciationCalculatedUnit"
                       value={this.state.depreciationCalculatedUnit}
                       onChange={this.handleChangeInput}
                       // error={this.state.errorDepreciationCalculatedUnit}
                       InputProps={{
                         readOnly: true,
                       }}
                     >
                       {units &&
                         units.map((item, index) => (
                           <MenuItem key={item._id} value={item._id}>
                             {item.name}
                           </MenuItem>
                         ))}
                     </TextField>
                   </Grid>
                 </Grid>
               </Grid> */}

              {/* <Grid item xs={6}>
                 <TextField
                   select
                   fullWidth
                   // label={getLabelName('unit', MODULE_CODE.Asset) || 'Đơn vị tính'}
                   label="Đơn vị tính"
                   name="unit"
                   value={this.state.unit}
                   onChange={this.handleChangeInput}
                   // required
                   error={this.state.errorUnit}
                   InputProps={{
                     readOnly: true,
                   }}
                 >
                   {units &&
                     units.map((item, index) => (
                       <MenuItem key={item._id} value={item._id}>
                         {item.name}
                       </MenuItem>
                     ))}
                 </TextField>
                 {this.state.errorUnit && (
                   <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                     Phải chọn đơn vị tính
                   </FormHelperText>
                 )} */}
              {/* <Link to="/Stock/config" style={{ display: 'inline-block', textAlign: 'right' }}>
                   Quản lý đơn vị tính
                 </Link> */}
              {/* </Grid>
               <Grid item xs={6}>
                 <TextField
                   // label={getLabelName('coefficient', MODULE_CODE.Asset) || 'Hệ số nhân'}
                   label="Hệ số nhân"
                   name="coefficient"
                   fullWidth
                   variant="outlined"
                   value={this.state.coefficient}
                   onChange={this.handleChangeInput}
                   margin="dense"
                   InputProps={{
                     readOnly: true,
                   }}
                 />
               </Grid> */}
              {/* <Grid item xs={6}>
                 <TextField
                   // label={getLabelName('meterNumber', MODULE_CODE.Asset) || 'Số công tơ'}
                   label="Số công tơ"
                   name="meterNumber"
                   fullWidth
                   variant="outlined"
                   value={this.state.meterNumber}
                   onChange={this.handleChangeInput}
                   margin="dense"
                   InputProps={{
                     readOnly: true,
                   }}
                 />
               </Grid> */}
              {/* <Grid md={6} item>
                 <Grid container spacing={8}>
                   <Grid item xs={7}>
                     <TextField
                       fullWidth
                       label={getLabelName('expiry ', MODULE_CODE.Asset) || 'Hạn sử dụng'}
                       value={this.state.expiry}
                       onChange={this.handleChangeInput}
                       name="expiry"
                       type="number"
                       InputProps={{
                         readOnly: true,
                       }}
                     />
                   </Grid>
                   <Grid item xs={5}>
                     <TextField
                       select
                       fullWidth
                       label="Đơn vị hạn sử dụng"
                       name="expiryUnit"
                       value={this.state.expiryUnit}
                       onChange={this.handleChangeInput}
                       // required
                       error={this.state.errorExpiryUnit}
                       InputProps={{
                         readOnly: true,
                       }}
                     >
                       {units &&
                         units.map((item, index) => (
                           <MenuItem key={item._id} value={item._id}>
                             {item.name}
                           </MenuItem>
                         ))}
                     </TextField>
                     {this.state.errorExpiryUnit && (
                       <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                         Phải chọn đơn vị tính
                       </FormHelperText>
                     )}
                     {/* <Link to="/Stock/config" style={{ display: 'inline-block', textAlign: 'right' }}>
                       Quản lý đơn vị tính
                     </Link> 
                   </Grid>
                 </Grid>
               </Grid> */}

              {/* <Grid md={6} item>
                 <TextField
                   // label={getLabelName('note', MODULE_CODE.Asset) || 'Mô tả'}
                   label="Ghi chú"
                   multiline
                   rows={3}
                   fullWidth
                   name="note"
                   value={this.state.note}
                   onChange={this.handleChangeInput}
                   InputProps={{
                     readOnly: true,
                   }}
                 />
               </Grid> */}
              {/* <Grid md={6} item>
                 <Grid item xs={12}>
                   {/* <FormControl fullWidth>
                     <FormControlLabel
                       control={
                         <Checkbox name="showSeries" checked={this.state.showSeries} onChange={e => this.handleChangeCheckbox(e)} color="primary" />
                       }
                       label={getLabelName('isSerial', MODULE_CODE.Asset) || 'Hiện Serial'}
                     />
                   </FormControl> */}
              {/* {this.state.showSeries && (
                     <React.Fragment>
                       <Typography component="p">Danh sách Serial</Typography>
                       {this.state.assetSerial.length > 0 &&
                         this.state.assetSerial.map((item, index) => (
                           <Grid container spacing={8} key={index} alignItems="center" justify="center">
                             <Grid item xs>
                               <TextField
                                 label="Số Serial"
                                 onChange={e => this.handleChangeSerial(index, 'serial', e.target.value)}
                                 value={item.serial}
                               />
                             </Grid>
                             <Grid item xs>
                               <TextField
                                 label="Giá"
                                 type="number"
                                 value={item.price}
                                 onChange={e => this.handleChangeSerial(index, 'price', e.target.value)}
                               />
                             </Grid>
                             <Grid item xs>
                               <DatePicker
                                 inputVariant="outlined"
                                 format="DD/MM/YYYY"
                                 value={item.date}
                                 variant="outlined"
                                 label="Thời gian bảo hành"
                                 margin="dense"
                                 fullWidth
                                 onChange={date => this.handleChangeSerial(index, 'date', date)}
                               />
                             </Grid>
                             <Grid item xs={1}>
                               <Fab size="small" color="secondary" onClick={() => this.handleDeleteSerial(index)}>
                                 <Delete />
                               </Fab>
                             </Grid>
                           </Grid>
                         ))}
                       <Button variant="contained" style={{ marginTop: '10px' }} onClick={this.handleAddSerial}>
                         Thêm
                       </Button>
                     </React.Fragment>
                   )}
                 </Grid> */}
              {/* </Grid>  */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

EditAssetInfo.propTypes = {
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

// export default withStyles(styles)(AssetInfo);
export default compose(
  withStyles(styles),
  withSnackbar,
)(EditAssetInfo);
