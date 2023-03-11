/* eslint-disable prettier/prettier */
/**
 *
 * AddCustomerPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ListAsync from '../../components/List';
import { useEffect } from 'react';

// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Typography,
  Paper,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Avatar,
  FormControl,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  // Input,
  Chip,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  InputAdornment,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TodayIcon from '@material-ui/icons/Today';
import { TextValidator, TextField, Autocomplete, FileUpload, KanbanStep, Loading, AsyncAutocomplete } from 'components/LifetekUi';
import makeSelectAddProjects from './selectors';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import { API_CUSTOMERS, API_TEMPLATE, API_PROMOTION_INFORMATION } from 'config/urlConfig';

import GridUI from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Edit, GpsFixed, Person, ExpandMore, Close, NaturePeopleOutlined } from '@material-ui/icons';
import ReactGoogleMap from 'react-google-map';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import axios from 'axios';
import { injectIntl } from 'react-intl';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import TextFieldCode from '../../components/TextFieldCode';
import locationIcon from '../../images/location.png';
import { API_KEY, API_USERS, API_DISTRICT, API_WARD, API_CITY, API_CRM_CAMPAIGN, API_STOCK } from '../../config/urlConfig';
import Attribute from '../../components/Attribute';
import makeSelectAddCustomerPage, { makeSelectlistAtt } from './selectors';
import { makeSelectProfile } from '../Dashboard/selectors';

import reducer from './reducer';
import saga from './saga';
import avatarDefault from '../../images/default-avatar.png';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
// import {
//   // DatePicker,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';

import {
  getInfo,
  postCustomer,
  putCustomer,
  handleChangeName,
  handleChangeLastName,
  handleChangeNickName,
  changeSelect,
  changeExpanded,
  getAttribute,
  handleChangeAtt,
  mergeData,
  addPromotion,
  defaultAction,
} from './actions';
import messages from './messages';
import styles from './styles';
import { provincialColumns } from '../../variable';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import { viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import dot from 'dot-object';
import KanbanStepper from '../../components/KanbanStepper';
import LoadingIndicator from '../../components/LoadingIndicator';
// Validate max date
const d = new Date();
const currentMonth = (d.getMonth() + 1).toString();
const currentDay = d.getDate().toString();
const month = currentMonth.length === 1 ? `0${currentMonth}` : currentMonth;
const day = currentDay.length === 1 ? `0${currentDay}` : currentDay;
const year = d.getFullYear();
const max = `${year}-${month}-${day}`;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
/* eslint-disable react/prefer-stateless-function */
const blockStringSpecial = e =>
  [
    '`',
    '-',
    '@',
    '$',
    '#',
    '+',
    '!',
    '.',
    '~',
    '*',
    '%',
    '^',
    '?',
    '>',
    '<',
    '|',
    '\\',
    ':',
    '&',
    "'",
    '(',
    ')',
    ';',
    '"',
    '{',
    '}',
    '[',
    ']',
    '=',
    ',',
    '/',
    '_',
  ].includes(e.key) && e.preventDefault();
export class AddCustomerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      avatarURL: '',
      code: '',
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      appUsage: '',
      gender: null,
      channel: null,
      createdBy: null,
      // d1Point: null,
      // d2Point: null,
      rankD1: null,
      rankD2: null,
      pointApp: null,
      pointSell: null,
      pointPurchase: null,
      pointAppCTV: null,
      pointSellCTV: null,
      pointPurchaseCTV: null,
      detailInfo_options_Type: null,
      detailInfo_typeCustomer_group: null,
      detailInfo_typeCustomer_introPerson: null,
      detailInfo_typeCustomer_typeOfCustomer: null,
      managerEmployee: null,
      downloadReferrals: null,
      joinDate: null,
      lastContact: null,
      lastPurchase: null,
      note: null,
      productsInterest: null,
      purchases: null,
      saleFirst: null,
      serviceSale: null,
      source: null,
      store: null,
      taxCode: null,
      totalInteractions: null,
      provincial: null,
      locationAddress: '',
      location: { lat: 0, lng: 0 },
      zoom: 18,
      search: '',
      cityCircle: {},
      birthDay: null,
      // address: 'Hanoi VietNam',
      avatar: '',
      valueForTabs: 0,
      typeOfCustomer: this.addItem(CUSTOMER_TYPE_CODE)[0] ? this.addItem(CUSTOMER_TYPE_CODE)[0].props.value : null,
      group: '',
      branches: '',
      career: [],
      productType: [],
      contactWays: '',
      areas: [],
      representativeDob: moment().format('YYYY-MM-DD'),
      rows: [],
      isTaxTitle: false,
      status: false,
      others: {},
      facebook: '',
      customerColumns: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Customer')
        .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
      crmSource: JSON.parse(localStorage.getItem('crmSource')),
      othersName: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Customer')
        .listDisplay.type.fields.type.others.map(item => ({ ...item, name: item.name.substring(7) })),
      errorName: true,
      listKanban: [],
      kanbanStatus: '',
      type: 1,
      checkShowForm: viewConfigCheckRequired('Customer', 'showForm'),
      checkRequired: viewConfigCheckRequired('Customer', 'required'),
      localMessages: {},
      note: '',
      loadData: true,
      loadSubmit: false,
      customerType: null,
      bank: null,
      bankAccountNumber: null,
      contributorClass: null,
      idetityCardNumber: null,
      district: null,
      ward: null,
      city: null,
      cityCode: null,
      districtId: null,
      districtCode: null,
      showDistrict: true,
      showWard: true,
      openAddPromotion: false,
      campaign: '',
      downloadReferrals: '',
      vouchers: [],
      products: [],
      id: '',
    };
  }

  componentDidMount() {
    this.props.onDefaultAction();
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const listKanBan = JSON.parse(localStorage.getItem('crmStatus'));
    if (listKanBan) {
      let customerKanbanStatus = listKanBan.find(p => p.code === 'ST18');
      if (customerKanbanStatus && customerKanbanStatus.data) {
        this.setState(prevState => ({ ...prevState, listKanban: customerKanbanStatus.data }));
        if (id === 'add') {
          const { _id } = customerKanbanStatus.data[0];
          this.setState({
            kanbanStatus: _id,
          });
        }
      }
    }
    this.setState({ id: id });
    if (id !== 'add') {
      this.props.getInfo(id);
      this.setState({ errorName: false });
    } else this.props.getAttribute();
    this.getMessages();
  }
  loadding = () => {
    this.state.loadSubmit = true;
  };

  getMessages() {
    const { callback } = this.props;
    const {
      type,
      kanbanStatus,
      others,
      facebook,
      code,
      name,
      phoneNumber,
      email,
      gender,
      birthDay,
      provincial,
      website,
      fax,
      idetityCardNumber,
      passportNumber,
      bank,
      bankAccountNumber,
      taxCode,
      contributorClass,
      isTax,
      address,
      source,
      certifiedNoTaxNumber,
      position,
      businessRegistrationNumber,
      detailInfo_typeCustomer_introPerson,
      managerEmployee,
      peopleCanView,
      note,
      load,
      avatar,
      avatarURL,
      typeOfCustomer,
      group,
      branches,
      career,
      productType,
      contactWays,
      areas,
      introducedWay,
      introPerson,
      phoneIntroPerson,
      introducedNote,
      representativeName,
      representativePhone,
      representativeGender,
      detailInfo_typeCustomer_typeOfCustomer,
      detailInfo_typeCustomer_group,
      representativeDob,
      representativeEmail,
      representativePosition,
      representativeNote,
      rows,
      createdBy,
      debitAccount,
      customDebitAccount,
      debtLimit,
      saleCount,
      debitAge,
      isTaxTitle,
      saleFirst,
      serviceSale,
      district,
      ward,
      city,
    } = this.state;

    const body = {
      type,
      kanbanStatus,
      others,
      createdBy,
      callback,
      facebook,
      code,
      name,
      phoneNumber,
      source,
      email,
      gender,
      birthDay,
      provincial,
      website,
      fax,
      idetityCardNumber,
      passportNumber,
      bank,
      bankAccountNumber,
      contributorClass,
      taxCode,
      isTax,
      address,
      certifiedNoTaxNumber,
      position,
      businessRegistrationNumber,
      viewableEmployees: peopleCanView && peopleCanView.length > 0 ? peopleCanView.map(item => item._id) : null,
      managerEmployee,
      note,
      detailInfo_typeCustomer_typeOfCustomer,
      detailInfo_typeCustomer_group,
      detailInfo_typeCustomer_introPerson,
      load,
      avatar,
      avatarURL,
      serviceSale,
      saleFirst,

      detailInfo: {
        typeCustomer: {
          typeOfCustomer,
          group,
          branches,
          career,
          productType,
          contactWays,
          areas,
          introducedWay,
          introPerson,
          phoneIntroPerson,
          introducedNote,
          // setAttribute: attributes,
        },
        represent: {
          phoneNumber: representativePhone,
          gender: representativeGender,
          // birthDay: birthDay,
          email: representativeEmail,
          position: representativePosition,
          note: representativeNote,
          localPersonInfo: rows,
        },
        options: {
          debitAccount: debitAccount ? debitAccount : '',
          customDebitAccount: customDebitAccount ? customDebitAccount : '',
          debtLimit: debtLimit ? debtLimit : '',
          saleCount: saleCount ? saleCount : '',
          debitAge: debitAge ? debitAge : '',
          isTaxTitle: isTaxTitle ? isTaxTitle : '',
          taxTitle: [
            {
              percent: 10,
            },
          ],
        },
      },
      note,
      district,
      ward,
      city,
    };

    const data = dot.dot(body);
    const messages = viewConfigCheckForm('Customer', data);
    this.state.localMessages = messages;
  }

  static getDerivedStateFromProps(props, state) {
    const id = props.id ? props.id : props.match.params.id;

    if (id === 'add') return null;
    const status = props.addCustomerPage.loading ? 'loading' : props.addCustomerPage.success ? 'success' : null;
    if (props.addCustomerPage.loading) {
      return {
        status,
      };
    }
    if (props.addCustomerPage.success && state.status === 'success') {
      return null;
    }
    if (props.addCustomerPage.success) {
      const data = props.addCustomerPage.data;
      if (!data) return null;
      const { detailInfo } = (props.addCustomerPage && props.addCustomerPage.data) || {};
      let represent = {};
      let typeCustomer = {};
      let options = {};
      if (detailInfo) {
        represent = detailInfo.represent;
        typeCustomer = detailInfo.typeCustomer;
        options = detailInfo.options;
      }
      const messages = viewConfigCheckForm('Customer', dot.dot(data));
      return {
        createdBy: data.createdBy,
        customerType: data.customerType,
        code: data.code,
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        gender: data.gender,
        birthDay: data.birthDay ? data.birthDay : null,
        provincial: data.provincial,
        website: data.website,
        avatar: data.avatar,
        store: data.store,
        channel: data.channel,
        fax: data.fax,
        bank: data.bank,
        idetityCardNumber: data.idetityCardNumber,
        bankAccountNumber: data.bankAccountNumber,
        contributorClass: data.contributorClass,
        detailInfo_typeCustomer_introPerson: typeCustomer && typeCustomer.introPerson,
        detailInfo_typeCustomer_typeOfCustomer: typeCustomer && typeCustomer.typeOfCustomer,
        detailInfo_typeCustomer_group: typeCustomer && typeCustomer.group,
        managerEmployee: data.managerEmployee,
        taxCode: data.taxCode,
        peopleCanView: data.viewableEmployees,
        isTax: data.isTax,
        businessRegistrationNumber: data.businessRegistrationNumber,
        certifiedNoTaxNumber: data.certifiedNoTaxNumber,
        position: data.position,
        status,
        source: data.source,
        note: data.note,
        address: data.address,

        rows: represent && represent.localPersonInfo,
        saleCount: options && options.saleCount,
        debitAge: options && options.debitAge,
        isTaxTitle: options && options.isTaxTitle,
        introPerson: typeCustomer && typeCustomer.introPerson,
        phoneIntroPerson: typeCustomer && typeCustomer.phoneIntroPerson,
        introducedWay: typeCustomer && typeCustomer.introducedWay,
        introducedNote: typeCustomer && typeCustomer.introducedNote,
        typeOfCustomer: typeCustomer && typeCustomer.typeOfCustomer,
        group: typeCustomer && typeCustomer.group,
        branches: typeCustomer && typeCustomer.branches,
        career: typeCustomer && typeCustomer.career,
        productType: typeCustomer && typeCustomer.productType,
        contactWays: typeCustomer && typeCustomer.contactWays,
        areas: typeCustomer && typeCustomer.areas,
        facebook: data.facebook,
        others: data.others,
        kanbanStatus: data.kanbanStatus,
        type: data.type,
        localMessages: messages,
        productsInterest: data.productsInterest,
        downloadReferrals: data.downloadReferrals,
        purchases: data.purchases,
        lastPurchase: data.lastPurchase ? data.lastPurchase : null,
        totalInteractions: data.totalInteractions,
        lastContact: data.lastContact ? data.lastContact : null,
        appUsage: data.appUsage,
        joinDate: data.joinDate ? data.joinDate : null,
        saleFirst: data.saleFirst,
        serviceSale: data.serviceSale,
        // d1Point: data.d1Point,
        // d2Point: data.d2Point,
        rankD1: data.rankD1,
        rankD2: data.rankD2,
        pointApp: data.pointApp,
        pointSell: data.pointSell,
        pointPurchase: data.pointPurchase,
        pointAppCTV: data.pointAppCTV,
        pointSellCTV: data.pointSellCTV,
        pointPurchaseCTV: data.pointPurchaseCTV,
        note: data.note,
        district: data.district,
        ward: data.ward,
        city: data.city,
      };
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      this.getMessages();
    }
  }

  changeMutil(value) {
    // const arrayValue = value.map(item => item.value);
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'viewableEmployees', value);
    this.setState({
      peopleCanView: value,
      localMessages: messages,
    });
  }

  changeSingle(value) {
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'managerEmployee', value);
    this.setState({
      managerEmployee: value,
      localMessages: messages,
    });
  }

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
    return null;
  };
  addItem2 = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
    return null;
  };
  onAddPromotionInformation = () => {
    this.setState({ openAddPromotion: true });
  };
  onClosePromotionInformation = () => {
    this.setState({ openAddPromotion: false });
  };
  findAttribute = (attributes, id) => {
    const attribute = attributes.find(item => item.id === id).attributeGroups;
    const { classes, addCustomerPage } = this.props;
    if (attribute)
      return attribute.map(item => (
        <ExpansionPanel style={{ padding: 5 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography variant="subtitle2" color="primary">
              {item.name}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
            {item.attributes.map(at => {
              switch (at.type) {
                case 'text':
                case 'number':
                case 'date':
                  return (
                    <TextField
                      name={at.attributeId}
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      type={at.type}
                      label={at.name}
                      margin="normal"
                    />
                  );
                case 'select':
                  return (
                    <Select
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      inputProps={{
                        name: at.attributeId,
                      }}
                    >
                      {at.options.map(name => (
                        <MenuItem key={name.value} value={name.value}>
                          {name.name}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                case 'multiSelect':
                  return (
                    <FormControl>
                      <InputLabel htmlFor="select-multiple-chip">{at.name}</InputLabel>
                      <Select
                        multiple
                        value={addCustomerPage[at.attributeId]}
                        onChange={this.props.handleChangeAtt(at.attributeId)}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip key={value} label={at.options.find(item => item.value === value).name} className={classes.chip} />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {at.options.map(name => (
                          <MenuItem key={name.value} value={name.value}>
                            {name.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                case 'bool':
                  return <Checkbox />;

                default:
                  return (
                    <TextField
                      value={addCustomerPage[at.attributeId]}
                      onChange={this.props.handleChangeAtt(at.attributeId)}
                      label={at.name}
                      margin="normal"
                    />
                  );
              }
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ));
    return null;
  };

  setOthers = (name, value) => {
    const { others } = this.state;
    const newOthers = { ...others };
    newOthers[name] = value;
    this.setState({ others: newOthers });
  };

  handleOthers = () => (
    <React.Fragment>
      {this.state.othersName.map(item => {
        switch (item.type) {
          case 'text':
          case 'number':
          case 'date':
            return (
              <TextField
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                type={item.type}
                defaultValue=""
                title={item.title}
                value={this.state.others ? this.state.others[item.name] : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );
          default:
            return (
              <TextField
                value={this.state.others ? this.state.others[item.name] : this.state.others}
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                // select
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {this.state.crmSource.find(el => el._id === item.type).data.map(ele => (
                  <MenuItem value={ele.value}>{ele.title}</MenuItem>
                ))}
              </TextField>
            );
        }
      })}
    </React.Fragment>
  );

  handleChangeKanban = item => {
    this.setState({ kanbanStatus: item.type });
  };

  handleChangeCustomer = (e, fieldName, isDate, isFirst) => {
    const name = fieldName;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;

    // const { target: { value, name } } = e;
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, fieldName, value);
    this.setState({
      [name]: value,
      localMessages: messages,
    });
  };
  handleChangeCustomerCreate = (e, fieldName) => {
    const name = fieldName;

    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, fieldName, value);
    this.setState({
      [name]: config.createdBy_name.title,
      localMessages: messages,
    });
  };
  mapFunctionCustomer = item => {
    console.log(55555, item);
    return {
      ...item,
      expirationDate: item.expirationDate && moment(item.expirationDate).format('DD-MM-YYYY'),
      incurredDate: item.incurredDate && moment(item.incurredDate).format('DD-MM-YYYY'),
      name: item.name,
    };
  };
  mapFunctionPromotion = item => {
    console.log(item);
    return {
      ...item,
      campaign: item['campaign.code'] ? item['campaign.code'] : '',
      customer: item['customer.code'] ? item['customer.code'] : '',
    };
  };
  loaddingData = () => {
    this.state.loadData = false;
  };
  render() {
    const { intl, profile, miniActive, addCustomerPage, classes } = this.props;
    const names = {};
    const config = {};
    this.state.customerColumns.forEach(item => {
      names[item.name] = item.title;
      config[item.name] = item;
    });
    // console.log('config',config);
    const { reloadPage } = addCustomerPage;
    const {
      search,
      locationAddress,
      valueForTabs,
      localMessages,
      checkShowForm,
      checkRequired,
      customerType,
      city,
      district,
      showDistrict,
      showWard,
      cityCode,
      districtId,
    } = this.state;
    let { cityCircle } = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    const goBack = () => {
      this.props.history.goBack();
      // this.props.addCustomerPage.data = '';
      // this.state.load = true
      // console.log(this.state.load )
    };
    const status = id === 'add' ? true : this.state.status;
    return (
      <Grid className="helloCVDA" style={{ padding: '0 3px', width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 280px)' }}>
        <div style={!status ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' } : { display: 'intinial' }}>
          {this.state.load === true ? <Loading /> : null}
          {/* {this.state.loadData ? <Loading /> : null} */}
          {id === 'add' ? null : <div>{this.state.code === '' ? <Loading /> : null}</div>}

          {!status ? (
            <div>
              {this.state.loadSubmit ? <Loading /> : null}
              <CircularProgress />
            </div>
          ) : (
            <div>
              {this.state.loadSubmit ? <Loading /> : null}
              {/* <div item md={12} style={{ width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}> */}
              <CustomAppBar
                title={
                  id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới khách hàng' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật khách hàng' })}`
                }
                onGoBack={() => {
                  this.props.closeCustomer !== undefined ? this.props.closeCustomer() : goBack();
                }}
                onSubmit={this.onSave}
                // onSubmit={this.onSave1}
              />
              {/* </div> */}
              <Helmet>
                <title>
                  {id === 'add'
                    ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
                    : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
                </title>
                <meta name="description" content="Description of AddCustomerPage" />
              </Helmet>

              <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
                <Breadcrumbs aria-label="Breadcrumb">
                  <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                    Dashboard
                  </Link>
                  <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/ConfigCRM">
                    CRM
                  </Link>
                  <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/Customer">
                    {intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}
                  </Link>
                  <Typography color="textPrimary">
                    {id === 'add'
                      ? intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'themmoi' })
                      : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
                  </Typography>
                </Breadcrumbs>
              </Paper>
              <ValidatorForm onSubmit={this.onSave}>
                <Paper className={classes.paper} style={{ width: '1610px !important' }}>
                  <div style={{ marginTop: this.props.closeCustomer !== undefined ? '3rem' : 0 }}>
                    <KanbanStepper
                      listStatus={this.state.listKanban}
                      onKabanClick={value => {
                        this.setState({
                          kanbanStatus: value,
                        });
                      }}
                      activeStep={this.state.kanbanStatus}
                    />
                  </div>
                  <GridUI container item xs={12}>
                    <GridUI item xs={6}>
                      <Typography component="p" className={classes.paperTitle}>
                        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} />{' '}
                        {intl.formatMessage(messages.thongtin || { id: 'thongtin', defaultMessage: 'thongtin' })}
                        <span className={classes.spanTitle}>
                          {' '}
                          {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                        </span>
                      </Typography>
                      {/* {id === 'add' ? (
                        <TextFieldCode
                          // eslint-disable-next-line no-useless-escape
                          // validators={['required', 'matchRegexp:^[a-zA-Z0-9]{5,20}$']}
                          // errorMessages={['Không được bỏ trống', 'Mã khách hàng lớn hơn hoặc bằng 5 ký tự bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                          value={this.state.code}
                          name={config.code.name}
                          onChange={this.handleChange('code')}
                          label={config.code.title}
                          // required
                          code={11}
                        />
                      ) : (
                        <TextFieldCode
                          // eslint-disable-next-line no-useless-escape
                          // validators={['required', 'matchRegexp:^[a-zA-Z0-9]{5,20}$']}
                          // errorMessages={['Không được bỏ trống', 'Mã khách hàng lớn hơn hoặc bằng 5 ký tự bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                          value={this.state.code}
                          name={config.code.name}
                          // onChange={this.handleChange('code')}
                          // InputLabelProps={{ shrink: true }}
                          label={config.code.title}
                          // required
                          // code={11}
                        />
                      )} */}
                      <CustomInputBase
                        error={(localMessages && localMessages.name) || this.state.name === ''}
                        helperText={
                          localMessages && localMessages.name
                            ? localMessages.name
                            : this.state.name === ''
                              ? 'Không được để trống TÊN KHÁCH HÀNG '
                              : null
                        }
                        required={checkRequired.name}
                        checkedShowForm={checkShowForm.name}
                        label={config && config.name && config.name.title}
                        type={config && config.name && config.name.type}
                        // onChange={this.handleChangeName('name')}
                        onChange={e => this.handleChangeCustomer(e, config.name.name)}
                        name={config.name.name}
                        value={this.state.name}
                        onKeyDown={blockStringSpecial}

                        // showRecorder
                        // voiceInput
                      />
                      <CustomInputBase
                        value={this.state.phoneNumber}
                        name="phoneNumber"
                        // onChange={this.handleChangeName('phoneNumber')}
                        onChange={e => this.handleChangeCustomer(e, 'phoneNumber')}
                        label={config && config.phoneNumber && config.phoneNumber.title}
                        type="number"
                        error={(localMessages && localMessages.phoneNumber) || this.state.phoneNumber === ''}
                        helperText={
                          localMessages && localMessages.phoneNumber
                            ? localMessages.phoneNumber
                            : this.state.phoneNumber === ''
                              ? 'Không được để trống SỐ ĐIỆN THOẠI '
                              : null
                        }
                        required={checkRequired.phoneNumber}
                        checkedShowForm={checkShowForm.phoneNumber}
                      />
                      <CustomInputBase
                        name="email"
                        value={this.state.email}
                        // onChange={this.handleChange('email')}
                        onChange={e => this.handleChangeCustomer(e, 'email')}
                        label={config && config.email && config.email.title}
                        type={config && config.email && config.email.type}
                        error={localMessages && localMessages.email}
                        helperText={localMessages && localMessages.email}
                        required={checkRequired.email}
                        checkedShowForm={checkShowForm.email}
                      />
                      <CustomInputBase
                        name="address"
                        value={this.state.address}
                        // onChange={this.handleChangeName('address')}
                        onChange={e => this.handleChangeCustomer(e, 'address')}
                        label={config && config.address && config.address.title}
                        type={config.address.type}
                        error={localMessages && localMessages.address}
                        helperText={localMessages && localMessages.address}
                        required={checkRequired.address}
                        checkedShowForm={checkShowForm.address}
                        onKeyDown={blockStringSpecial}
                      />
                      <AsyncAutocomplete
                        // isMulti
                        name="city"
                        label={config && config.city && config.city.title}
                        onChange={value => {
                          this.setState({
                            ...this.state,
                            city: value,
                            showDistrict: false,
                            district: null,
                            ward: null,
                          });

                          setTimeout(() => {
                            this.setState({
                              ...this.state,
                              showDistrict: true,
                            });
                          }, 100);
                        }}
                        url={API_CITY}
                        value={this.state.city}
                      />
                      {city && showDistrict ? (
                        <AsyncAutocomplete
                          // isMulti
                          name="district"
                          label={config && config.district && config.district.title}
                          onChange={value => {
                            this.setState({
                              ...this.state,
                              district: value,
                              showWard: false,
                              districtId: value && value.id,
                              cityCode: value && value.cityCode,
                            });
                            setTimeout(() => {
                              this.setState({
                                ...this.state,
                                showWard: true,
                              });
                            }, 100);
                          }}
                          filter={{
                            cityCode: city && city.code,
                          }}
                          url={API_DISTRICT}
                          value={this.state.district}
                        />
                      ) : null}
                      {district && showWard && city ? (
                        <AsyncAutocomplete
                          // isMulti
                          name="ward"
                          label={config && config.ward && config.ward.title}
                          onChange={value => {
                            this.setState({
                              ...this.state,
                              ward: value,
                            });
                          }}
                          url={API_WARD}
                          filter={{
                            districtCode: `${cityCode}${districtId}`,
                          }}
                          value={this.state.ward}
                        />
                      ) : null}

                      <CustomInputBase
                        label={config && config.source && config.source.title}
                        type={config && config.source && config.source.type}
                        value={this.state.source}
                        displayEmpty
                        name="source"
                        select
                        onChange={e => this.handleChangeCustomer(e, 'source')}
                        error={localMessages && localMessages.source}
                        helperText={localMessages && localMessages.source}
                        required={checkRequired.source}
                        checkedShowForm={checkShowForm.source}
                      >
                        {this.addItem(config.source.configCode)}
                      </CustomInputBase>
                      <CustomInputBase
                        label={config && config.channel && config.channel.title}
                        type={config && config.channel && config.channel.type}
                        value={this.state.channel}
                        displayEmpty
                        name="channel"
                        select
                        onChange={e => this.handleChangeCustomer(e, 'channel')}
                        error={localMessages && localMessages.channel}
                        helperText={localMessages && localMessages.channel}
                        required={checkRequired.channel}
                        checkedShowForm={checkShowForm.channel}
                      >
                        {this.addItem(config.channel.configCode)}
                      </CustomInputBase>
                      <CustomInputBase
                        name="taxCode"
                        value={this.state.taxCode}
                        onChange={e => this.handleChangeCustomer(e, 'taxCode')}
                        label={config && config.taxCode && config.taxCode.title}
                        type={config && config.taxCode && config.taxCode.type}
                        error={localMessages && localMessages.taxCode}
                        helperText={localMessages && localMessages.taxCode}
                        required={checkRequired.taxCode}
                        checkedShowForm={checkShowForm.taxCode}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        label={config && config.store && config.store.title}
                        type={config && config.store && config.store.type}
                        value={this.state.store}
                        displayEmpty
                        name="store"
                        select
                        onChange={e => this.handleChangeCustomer(e, 'store')}
                        error={localMessages && localMessages.store}
                        helperText={localMessages && localMessages.store}
                        required={checkRequired.store}
                        checkedShowForm={checkShowForm.store}
                      >
                        {this.addItem(config.store.configCode)}
                      </CustomInputBase>
                      <CustomInputBase
                        name="createdBy_name"
                        value={this.state.createdBy && this.state.createdBy.name}
                        // onChange={this.handleChange('email')}
                        label={config && config.createdBy && config.createdBy.title}
                        type={config && config.createdBy && config.createdBy.type}
                        disabled
                        error={localMessages && localMessages.createdBy_name}
                        helperText={localMessages && localMessages.createdBy_name}
                        required={checkRequired.createdBy_name}
                        checkedShowForm={checkShowForm.createdBy_name}
                      />
                      <CustomInputBase
                        name="productsInterest"
                        value={this.state.productsInterest}
                        // onChange={this.handleChange('email')}
                        // onChange={this.handleChangeName('productsInterest')}
                        onChange={e => this.handleChangeCustomer(e, 'productsInterest')}
                        label={config && config.productsInterest && config.productsInterest.title}
                        type={config && config.productsInterest && config.productsInterest.type}
                        error={localMessages && localMessages.productsInterest}
                        helperText={localMessages && localMessages.productsInterest}
                        required={checkRequired.productsInterest}
                        checkedShowForm={checkShowForm.productsInterest}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        name="downloadReferrals"
                        value={this.state.downloadReferrals}
                        // onChange={this.handleChange('email')}
                        // onChange={this.handleChangeName('downloadReferrals')}
                        onChange={e => this.handleChangeCustomer(e, 'downloadReferrals')}
                        label={config && config.downloadReferrals && config.downloadReferrals.title}
                        type={config && config.downloadReferrals && config.downloadReferrals.type}
                        error={localMessages && localMessages.downloadReferrals}
                        helperText={localMessages && localMessages.downloadReferrals}
                        required={checkRequired.downloadReferrals}
                        checkedShowForm={checkShowForm.downloadReferrals}
                        disabled
                      />
                      <CustomInputBase
                        name="purchases"
                        value={this.state.purchases}
                        onChange={e => this.handleChangeCustomer(e, 'purchases')}
                        label={config && config.purchases && config.purchases.title}
                        type={config && config.purchases && config.purchases.type}
                        error={localMessages && localMessages.purchases}
                        helperText={localMessages && localMessages.purchases}
                        required={checkRequired.purchases}
                        checkedShowForm={checkShowForm.purchases}
                        disabled
                      />
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          className={classes.textField}
                          inputVariant="outlined"
                          format="DD/MM/YYYY"
                          placeholder="DD/MM/YYYY"
                          value={this.state.lastPurchase}
                          invalidDateMessage="Nhập sai định dạng ngày"
                          variant="outlined"
                          label={config && config.lastPurchase && config.lastPurchase.title}
                          margin="dense"
                          name="joinDate"
                          inputProps={{ max }}
                          InputLabelProps={{ shrink: true }}
                          onChange={e => this.handleChangeCustomer(e, 'lastPurchase', true, false)}
                          disableFuture
                          keyboard
                          fullWidth
                          keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                          disabled
                        />
                      </MuiPickersUtilsProvider>
                      <CustomInputBase
                        disabled
                        name="totalInteractions"
                        value={this.state.totalInteractions}
                        // onChange={e => this.handleChangeCustomer(e, 'totalInteractions')}
                        label={config && config.totalInteractions && config.totalInteractions.title}
                        type={config && config.totalInteractions && config.totalInteractions.type}
                        error={localMessages && localMessages.totalInteractions}
                        helperText={localMessages && localMessages.totalInteractions}
                        required={checkRequired.totalInteractions}
                        checkedShowForm={checkShowForm.totalInteractions}
                      />
                      {/* <CustomInputField
                        name="lastContact"
                        value={this.state.lastContact}
                        onChange={e => this.handleChangeCustomer(e, 'lastContact', true, false)}
                        label={config.lastContact.title}
                        type={config.lastContact.type}
                      /> */}
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          className={classes.textField}
                          inputVariant="outlined"
                          format="DD/MM/YYYY"
                          disabled
                          placeholder="DD/MM/YYYY"
                          value={this.state.lastContact}
                          invalidDateMessage="Nhập sai định dạng ngày"
                          variant="outlined"
                          label={config && config.lastContact && config.lastContact.title}
                          margin="dense"
                          name="joinDate"
                          inputProps={{ max }}
                          InputLabelProps={{ shrink: true }}
                          onChange={e => this.handleChangeCustomer(e, 'lastContact', true, false)}
                          disableFuture
                          keyboard
                          fullWidth
                          keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                        />
                      </MuiPickersUtilsProvider>
                      <CustomInputBase
                        name="appUsage"
                        value={this.state.appUsage}
                        disabled
                        // onChange={this.handleChange('email')}
                        // onChange={this.handleChangeName('appUsage')}
                        onChange={e => this.handleChangeCustomer(e, 'appUsage')}
                        label={config && config.appUsage && config.appUsage.title}
                        type={config && config.appUsage && config.appUsage.type}
                        error={localMessages && localMessages.appUsage}
                        helperText={localMessages && localMessages.appUsage}
                        required={checkRequired.appUsage}
                        checkedShowForm={checkShowForm.appUsage}
                        onKeyDown={blockStringSpecial}
                      />
                      {customerType === 3 ? (
                        <CustomInputBase
                          label={config && config.contributorClass && config.contributorClass.title}
                          type={config && config.contributorClass && config.contributorClass.type}
                          value={this.state.contributorClass}
                          displayEmpty
                          name="contributorClass"
                          select
                          onChange={e => this.handleChangeCustomer(e, 'contributorClass')}
                          error={localMessages && localMessages.contributorClass}
                          helperText={localMessages && localMessages.contributorClass}
                          required={checkRequired.contributorClass}
                          checkedShowForm={checkShowForm.contributorClass}
                        >
                          {this.addItem(config.contributorClass.configCode)}
                        </CustomInputBase>
                      ) : null}
                      {customerType === 3 ? (
                        <CustomInputBase
                          name="bank"
                          value={this.state.bank}
                          onChange={e => this.handleChangeCustomer(e, 'bank')}
                          label={config && config.bank && config.bank.title}
                          type={config && config.bank && config.bank.type}
                          error={localMessages && localMessages.bank}
                          helperText={localMessages && localMessages.bank}
                          required={checkRequired.bank}
                          checkedShowForm={checkShowForm.bank}
                        />
                      ) : null}
                      {customerType === 3 ? (
                        <CustomInputBase
                          name="bankAccountNumber"
                          value={this.state.bankAccountNumber}
                          // onChange={this.handleChange('email')}
                          onChange={e => this.handleChangeCustomer(e, 'bankAccountNumber')}
                          label={config && config.bankAccountNumber && config.bankAccountNumber.title}
                          type={config && config.bankAccountNumber && config.bankAccountNumber.type}
                          error={localMessages && localMessages.bankAccountNumber}
                          helperText={localMessages && localMessages.bankAccountNumber}
                          required={checkRequired && checkRequired.bankAccountNumber}
                          checkedShowForm={checkShowForm && checkShowForm.bankAccountNumber}
                        />
                      ) : null}
                      {customerType === 3 ? (
                        <CustomInputBase
                          name="idetityCardNumber"
                          value={this.state.idetityCardNumber}
                          // onChange={this.handleChange('email')}
                          onChange={e => this.handleChangeCustomer(e, 'idetityCardNumber')}
                          label={config && config.idetityCardNumber && config.idetityCardNumber.title}
                          type={config && config.idetityCardNumber && config.idetityCardNumber.type}
                          error={localMessages && localMessages.idetityCardNumber}
                          helperText={localMessages && localMessages.idetityCardNumber}
                          required={checkRequired && checkRequired.idetityCardNumber}
                          checkedShowForm={checkShowForm && checkShowForm.idetityCardNumber}
                        />
                      ) : null}
                      <CustomGroupInputField
                        code="Customer"
                        columnPerRow={3}
                        value={this.state.others}
                        onChange={value => {
                          this.setState({
                            ...this.state,
                            others: value,
                          });
                        }}
                      />
                    </GridUI>
                    <GridUI item xs={6}>
                      <div style={{ display: 'grid', justifyContent: 'center' }}>
                        <Typography component="p" className={classes.paperTitle}>
                          <Person style={{ fontSize: '40px', marginBottom: '5px' }} />{' '}
                          {intl.formatMessage(messages.chonanh || { id: 'chonanh', defaultMessage: 'chonanh' })}
                        </Typography>

                        {id === 'add' ? (
                          <Avatar alt="Ảnh đại diện" src={`${this.state.avatarURL}` || avatarDefault} className={classes.avatar} />
                        ) : (
                          <div>
                            {!this.state.avatar ? (
                              <Avatar alt="Ảnh đại diện" src={`${this.state.avatarURL}` || avatarDefault} className={classes.avatar} />
                            ) : (
                              <div>
                                {this.state.avatar === '' ? (
                                  <Avatar alt="Ảnh đại diện" src={`${this.state.avatarURL}` || avatarDefault} className={classes.avatar} />
                                ) : (
                                  <Avatar
                                    alt="Ảnh đại diện"
                                    src={`${this.state.avatarURL}` || `${this.state.avatar}?allowDefault=true`}
                                    className={classes.avatar}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="contained-button-file"
                          multiple
                          onChange={this.onSelectImg}
                          type="file"
                        />

                        {id === 'add' ? (
                          <div style={{ display: 'flex' }}>
                            <label htmlFor="contained-button-file">
                              <Button variant="contained" color="primary" component="span" className={classes.button}>
                                {intl.formatMessage(messages.themanh || { id: 'themanh', defaultMessage: 'themanh' })}
                              </Button>
                            </label>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', marginTop: 10 }}>
                            <label htmlFor="contained-button-file">
                              <Button variant="contained" color="primary" component="span" style={{ display: 'flex' }}>
                                {intl.formatMessage({ id: 'themanh', defaultMessage: 'CẬP NHẬT ẢNH ĐẠI DIỆN' })}
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>

                      <Typography component="p" className={classes.paperTitle} style={{ marginTop: 20, marginLeft: 20 }}>
                        <Edit style={{ fontSize: '20px', marginBottom: 7 }} />{' '}
                        {intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' })}{' '}
                        <span className={classes.spanTitle}>
                          {intl.formatMessage(messages.truongcannhap || { id: 'truongcannhap', defaultMessage: 'truongcannhap' })}
                        </span>
                      </Typography>
                      <Tabs
                        value={this.state.valueForTabs}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="on"
                      >
                        <Tab
                          disableRipple
                          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                          label={intl.formatMessage(messages.nguoidaidien || { id: 'nguoidaidien', defaultMessage: 'nguoidaidien' })}
                        />
                        <Tab
                          disableRipple
                          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                          label={intl.formatMessage(messages.phanloaikhachhang || { id: 'phanloaikhachhang', defaultMessage: 'phanloaikhachhang' })}
                        />
                        {id === 'add' ? null : (
                          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Voucher" />
                        )}
                        {id === 'add' ? null : (
                          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Dịch vụ của tôi" />
                        )}
                        {id === 'add' ? null : (
                          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin khuyến mãi" />
                        )}
                      </Tabs>
                      <SwipeableViews
                        // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        // style={{ overflowX: 'hidden !important' }}
                        index={valueForTabs}
                        onChangeIndex={this.handleChangeIndex}
                        // width={window.innerWidth - 260}
                        style={{ width: '40vw' }}
                      >
                        <div style={{ margin: 24 }}>
                          {/* <TabContainer> */}
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              className={classes.textField}
                              invalidLabel="DD/MM/YYYY"
                              placeholder="DD/MM/YYYY"
                              inputVariant="outlined"
                              format="DD/MM/YYYY"
                              value={this.state.birthDay}
                              invalidDateMessage="Nhập sai định dạng ngày"
                              variant="outlined"
                              error={localMessages && localMessages.birthDay}
                              helperText={localMessages && localMessages.birthDay}
                              required={checkRequired.birthDay}
                              label={config && config.birthDay && config.birthDay.title}
                              margin="dense"
                              name="birthDay"
                              inputProps={{ max }}
                              InputLabelProps={{ shrink: true }}
                              onChange={e => this.handleChangeCustomer(e, 'birthDay', true, false)}
                              disableFuture
                              // keyboard
                              fullWidth
                              keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                            />
                          </MuiPickersUtilsProvider>
                          <CustomInputBase
                            select
                            label={config && config.gender && config.gender.title}
                            className={classes.textField}
                            value={this.state.gender}
                            name="gender"
                            onChange={e => this.handleChangeCustomer(e, 'gender')}
                            error={localMessages && localMessages.gender}
                            helperText={localMessages && localMessages.gender}
                            required={checkRequired.gender}
                            checkedShowForm={checkShowForm.gender}
                          >
                            <MenuItem value="male">Nam</MenuItem>
                            <MenuItem value="female">Nữ</MenuItem>
                          </CustomInputBase>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              className={classes.textField}
                              InputLabelProps={{ shrink: true }}
                              inputVariant="outlined"
                              format="DD/MM/YYYY"
                              placeholder="DD/MM/YYYY"
                              value={this.state.joinDate}
                              invalidDateMessage="Nhập sai định dạng ngày"
                              variant="outlined"
                              label={(config && config.joinDate && config.joinDate.title) || 'NGÀY VÀO HỆ THỐNG'}
                              margin="dense"
                              name="joinDate"
                              inputProps={{ max }}
                              onChange={e => this.handleChangeCustomer(e, 'joinDate', true, false)}
                              disableFuture
                              // keyboard
                              fullWidth
                              keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                            />
                          </MuiPickersUtilsProvider>
                          <CustomInputBase
                            value={this.state.saleFirst}
                            className={classes.textField}
                            name="saleFirst"
                            // onChange={this.handleChange('saleFirst')}
                            onChange={e => this.handleChangeCustomer(e, 'saleFirst')}
                            label={(config && config.saleFirst && config.saleFirst.title) || 'DOANH SỐ MUA HÀNG LẦN 1'}
                            type={config && config.saleFirst && config.saleFirst.type}
                            disabled
                          />
                          <CustomInputBase
                            value={this.state.serviceSale}
                            className={classes.textField}
                            name="serviceSale"
                            // onChange={this.handleChange('serviceSale')}
                            onChange={e => this.handleChangeCustomer(e, 'serviceSale')}
                            label={(config && config.serviceSale && config.serviceSale.title) || 'DOANH SỐ ĐƠN DỊCH VỤ'}
                            type={config && config.serviceSale && config.serviceSale.type}
                            error={localMessages && localMessages.serviceSale}
                            helperText={localMessages && localMessages.serviceSale}
                            required={checkRequired.serviceSale}
                            checkedShowForm={checkShowForm.serviceSale}
                            disabled
                          />
                          {/* <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.d1Point}
                            name="d1Point"
                            // onChange={this.handleChange('d1Point')}
                            onChange={e => this.handleChangeCustomer(e, 'd1Point')}
                            label={(config && config.d1Point && config.d1Point.title) || 'ĐIỂM D1'}
                            type={config && config.d1Point && config.d1Point.type}
                            error={localMessages && localMessages.d1Point}
                            helperText={localMessages && localMessages.d1Point}
                            required={checkRequired.d1Point}
                            checkedShowForm={checkShowForm.d1Point}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.d2Point}
                            name="d2Point"
                            // onChange={this.handleChange('d2Point')}
                            onChange={e => this.handleChangeCustomer(e, 'd2Point')}
                            label={(config && config.d2Point && config.d2Point.title) || 'ĐIỂM D2'}
                            type={config && config.d2Point && config.d2Point.type}
                            error={localMessages && localMessages.d2Point}
                            helperText={localMessages && localMessages.d2Point}
                            required={checkRequired.d2Point}
                            checkedShowForm={checkShowForm.d2Point}
                            disabled
                          /> */}
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointApp}
                            name="pointApp"
                            // onChange={this.handleChange('pointApp')}
                            onChange={e => this.handleChangeCustomer(e, 'pointApp')}
                            label={(config && config.pointApp && config.pointApp.title) || 'ĐIỂM GIỚI THIỆU APP CHO KH'}
                            type={config && config.pointApp && config.pointApp.type}
                            error={localMessages && localMessages.pointApp}
                            helperText={localMessages && localMessages.pointApp}
                            required={checkRequired.pointApp}
                            checkedShowForm={checkShowForm.pointApp}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointSell}
                            name="pointSell"
                            // onChange={this.handleChange('pointSell')}
                            onChange={e => this.handleChangeCustomer(e, 'pointSell')}
                            label={(config && config.pointSell && config.pointSell.title) || 'ĐIỂM GIỚI THIỆU BÁN HÀNG CHO KH'}
                            type={config && config.pointSell && config.pointSell.type}
                            error={localMessages && localMessages.pointSell}
                            helperText={localMessages && localMessages.pointSell}
                            required={checkRequired.pointSell}
                            checkedShowForm={checkShowForm.pointSell}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointPurchase}
                            name="pointPurchase"
                            // onChange={this.handleChange('pointPurchase')}
                            onChange={e => this.handleChangeCustomer(e, 'pointPurchase')}
                            label={(config && config.pointPurchase && config.pointPurchase.title) || 'ĐIỂM GIỚI THIỆU BÁN HÀNG CHO KH'}
                            type={config && config.pointPurchase && config.pointPurchase.type}
                            error={localMessages && localMessages.pointPurchase}
                            helperText={localMessages && localMessages.pointPurchase}
                            required={checkRequired.pointPurchase}
                            checkedShowForm={checkShowForm.pointPurchase}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointAppCTV}
                            name="pointAppCTV"
                            // onChange={this.handleChange('pointAppCTV')}
                            onChange={e => this.handleChangeCustomer(e, 'pointAppCTV')}
                            label={(config && config.pointAppCTV && config.pointAppCTV.title) || 'ĐIỂM GIỚI THIỆU APP CHO CTV'}
                            type={config && config.pointAppCTV && config.pointAppCTV.type}
                            error={localMessages && localMessages.pointAppCTV}
                            helperText={localMessages && localMessages.pointAppCTV}
                            required={checkRequired.pointAppCTV}
                            checkedShowForm={checkShowForm.pointAppCTV}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointSellCTV}
                            name="pointSellCTV"
                            // onChange={this.handleChange('pointSellCTV')}
                            onChange={e => this.handleChangeCustomer(e, 'pointSellCTV')}
                            label={(config && config.pointSellCTV && config.pointSellCTV.title) || 'ĐIỂM GIỚI THIỆU BÁN HÀNG CHO KH'}
                            type={config && config.pointSellCTV && config.pointSellCTV.type}
                            error={localMessages && localMessages.pointSellCTV}
                            helperText={localMessages && localMessages.pointSellCTV}
                            required={checkRequired.pointSellCTV}
                            checkedShowForm={checkShowForm.pointSellCTV}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.pointPurchaseCTV}
                            name="pointPurchaseCTV"
                            // onChange={this.handleChange('pointPurchaseCTV')}
                            onChange={e => this.handleChangeCustomer(e, 'pointPurchaseCTV')}
                            label={(config && config.pointPurchaseCTV && config.pointPurchaseCTV.title) || 'ĐIỂM GIỚI THIỆU MUA HÀNG CHO KH'}
                            type={config && config.pointPurchaseCTV && config.pointPurchaseCTV.type}
                            error={localMessages && localMessages.pointPurchaseCTV}
                            helperText={localMessages && localMessages.pointPurchaseCTV}
                            required={checkRequired.pointPurchaseCTV}
                            checkedShowForm={checkShowForm.pointPurchaseCTV}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.rankD1}
                            name="rankD1"
                            // onChange={this.handleChange('rankD1')}
                            onChange={e => this.handleChangeCustomer(e, 'rankD1')}
                            label={(config && config.rankD1 && config.rankD1.title) || 'ĐIỂM D1'}
                            type={config && config.rankD1 && config.rankD1.type}
                            error={localMessages && localMessages.rankD1}
                            helperText={localMessages && localMessages.rankD1}
                            required={checkRequired.rankD1}
                            checkedShowForm={checkShowForm.rankD1}
                            disabled
                          />
                          <CustomInputBase
                            // value={this.state.fax}
                            className={classes.textField}
                            value={this.state.rankD2}
                            name="rankD2"
                            // onChange={this.handleChange('rankD2')}
                            onChange={e => this.handleChangeCustomer(e, 'rankD2')}
                            label={(config && config.rankD2 && config.rankD2.title) || 'ĐIỂM D1'}
                            type={config && config.rankD2 && config.rankD2.type}
                            error={localMessages && localMessages.rankD2}
                            helperText={localMessages && localMessages.rankD2}
                            required={checkRequired.rankD2}
                            checkedShowForm={checkShowForm.rankD2}
                            disabled
                          />
                          <TextField
                            // value={this.state.fax}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className={classes.textField}
                            value={this.state.note}
                            multiline
                            rows={4}
                            fullWidth
                            name="note"
                            // onChange={this.handleChange('detailInfo_represent_note')}
                            onChange={e => this.handleChangeCustomer(e, 'note')}
                            label={config && config.note && config.note.title}
                            // type={config.note.type}
                            onKeyDown={blockStringSpecial}
                          />
                          {/* </TabContainer> */}
                        </div>
                        <TabContainer>
                          <CustomInputBase
                            select
                            label={config && config.detailInfo_typeCustomer_typeOfCustomer && config.detailInfo_typeCustomer_typeOfCustomer.title}
                            type={config && config.detailInfo_typeCustomer_typeOfCustomer && config.detailInfo_typeCustomer_typeOfCustomer.type}
                            value={this.state.detailInfo_typeCustomer_typeOfCustomer}
                            name="detailInfo_typeCustomer_typeOfCustomer"
                            onChange={e => this.handleChangeCustomer(e, 'detailInfo_typeCustomer_typeOfCustomer')}
                            error={localMessages && localMessages.detailInfo_typeCustomer_typeOfCustomer}
                            helperText={localMessages && localMessages.detailInfo_typeCustomer_typeOfCustomer}
                            required={checkRequired.detailInfo_typeCustomer_typeOfCustomer}
                            checkedShowForm={checkShowForm.detailInfo_typeCustomer_typeOfCustomer}
                          >
                            {this.addItem2(config.detailInfo_typeCustomer_typeOfCustomer.configCode)}
                          </CustomInputBase>

                          <CustomInputBase
                            select
                            label={config && config.detailInfo_typeCustomer_group && config.detailInfo_typeCustomer_group.title}
                            type={config && config.detailInfo_typeCustomer_group && config.detailInfo_typeCustomer_group.type}
                            value={this.state.detailInfo_typeCustomer_group}
                            name="detailInfo_typeCustomer_group"
                            onChange={e => this.handleChangeCustomer(e, 'detailInfo_typeCustomer_group')}
                            error={localMessages && localMessages.detailInfo_typeCustomer_group}
                            helperText={localMessages && localMessages.detailInfo_typeCustomer_group}
                            required={checkRequired.detailInfo_typeCustomer_group}
                            checkedShowForm={checkShowForm.detailInfo_typeCustomer_group}
                          >
                            {this.addItem2(config.detailInfo_typeCustomer_group.configCode)}
                          </CustomInputBase>

                          <AsyncAutocomplete
                            // isMulti
                            name="managerEmployee"
                            label={config && config.managerEmployee && config.managerEmployee.title}
                            onChange={value => {
                              this.setState({
                                ...this.state,
                                managerEmployee: value,
                              });
                            }}
                            url={API_USERS}
                            value={this.state.managerEmployee}
                          />

                          <AsyncAutocomplete
                            // isMulti
                            name="detailInfo_typeCustomer_introPerson"
                            label={config && config.detailInfo_typeCustomer_introPerson && config.detailInfo_typeCustomer_introPerson.title}
                            onChange={value => {
                              this.setState({
                                ...this.state,
                                detailInfo_typeCustomer_introPerson: value,
                              });
                            }}
                            url={API_CUSTOMERS}
                            filter={{ customerType: 3 }}
                            value={this.state.detailInfo_typeCustomer_introPerson}
                          />
                        </TabContainer>
                        <TabContainer>
                          <Paper>
                            {this.state.code ? (
                              <ListAsync
                                display="flex"
                                height="500px"
                                // deleteUrl={`${API_CUSTOMERS}/voucher`}
                                apiUrl={`${API_CUSTOMERS}/voucher`}
                                // exportExcel
                                code="Voucher"
                                // share
                                // advanceFilter={<AdvanceFilterAndListFilterTags onSearch={this.handleSearch} />}
                                mapFunction={this.mapFunctionCustomer}
                                filter={{ customerCode: `${this.state.code}` }}
                                disableAdd
                                disableEdit
                                disableMenuAction
                                disableSearch
                                // ref={this.refCustomer}
                                // onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                                loaddingData={this.loaddingData}
                              />
                            ) : null}
                          </Paper>
                        </TabContainer>
                        <TabContainer>
                          <Paper>
                            {this.state.code ? (
                              <ListAsync
                                height="500px"
                                width="50%"
                                apiUrl={`${API_CUSTOMERS}/myService`}
                                exportExcel
                                code="MyService"
                                disableEdit
                                // share
                                disableAdd
                                disableMenuAction
                                disableSearch
                                // advanceFilter={<AdvanceFilterAndListFilterTags onSearch={this.handleSearch} />}
                                mapFunction={this.mapFunctionCustomer}
                                filter={{ customerCode: `${this.state.code}` }}
                                // ref={this.refCustomer}
                                // onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                              />
                            ) : null}
                          </Paper>
                        </TabContainer>
                        <TabContainer>
                          {/* <div style={{ paddingLeft: 20 }}> */}
                          <Paper>
                            <ListAsync
                              height="500px"
                              width="50%"
                              apiUrl={`${API_PROMOTION_INFORMATION}`}
                              exportExcel
                              code="PromotionInfo"
                              // code="MyService"
                              disableEdit
                              // share
                              // disableAdd
                              disableMenuAction
                              disableSearch
                              addFunction={e => {
                                this.onAddPromotionInformation(e);
                              }}
                              showAdd
                              deleteUrl={`${API_PROMOTION_INFORMATION}`}
                              showDelete
                              reload={reloadPage}
                              // advanceFilter={<AdvanceFilterAndListFilterTags onSearch={this.handleSearch} />}
                              mapFunction={this.mapFunctionPromotion}
                              filter={{ 'customer.customerId': id }}
                              // ref={this.refCustomer}
                              // onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                            />
                          </Paper>
                          {/* </div> */}
                        </TabContainer>
                      </SwipeableViews>
                    </GridUI>
                  </GridUI>
                  {/* <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                      <Button
                        // type="submit"
                        type="button"
                        onClick={this.onSave}
                        variant="contained"
                        color="primary"
  
                      >
                        {[intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })]}
                      </Button>
                    </div> */}
                  <GridUI item md={12}>
                    <Typography component="p" className={classes.paperTitle} style={{ marginTop: 20 }}>
                      <Edit style={{ fontSize: '20px', marginBottom: 7 }} />{' '}
                      {intl.formatMessage(messages.thongtindaumoi || { id: 'thongtindaumoi', defaultMessage: 'thongtindaumoi' })}
                    </Typography>
                    <DataGrid id="gridContainer" dataSource={this.state.rows} ders repaintChangesOnly>
                      <Paging enabled={false} />
                      <Editing
                        refreshMode="repaint"
                        mode="cell"
                        texts={{ confirmDeleteMessage: intl.formatMessage(messages.xoa || { id: 'xoa', defaultMessage: 'xoa' }) }}
                        allowUpdating
                        allowDeleting
                        allowAdding
                      />
                      {/* <Column dataField="id" caption="STT" width={55} /> */}
                      <Column dataField="vocative" caption="Danh xưng" />
                      <Column dataField="surName" caption="Họ" />
                      {/* <Column dataField="middleName" caption="Tên đệm" /> */}
                      <Column dataField="name" caption="Tên" />
                      <Column dataField="phoneNumber" caption="SĐT" />
                      <Column dataField="email" caption="Email" />
                      <Column dataField="position" caption="Chức vụ" />
                      <Column dataField="birthDate" caption="Ngày sinh" />
                      <Column dataField="gender" caption="Giới tính" />
                      {/* <Column dataField="numberId" caption="Số CMND" /> */}
                      {/* <Column dataField="bank" caption="Ngân hàng" />
                      <Column dataField="bankAccount" caption="Số tài khoản" /> */}
                      <Column dataField="companyPhone" caption="Số điện thoại công ty" />
                      <Column dataField="department" caption="Phòng ban" />
                      <Column dataField="address" caption="Địa chỉ" />
                      <Column dataField="note" caption="Ghi chú" />

                      {/* <Column dataField="codecustomer" caption="Mã KH" />
                      <Column dataField="codecontact" caption="Mã liên hệ" /> */}
                    </DataGrid>
                  </GridUI>
                </Paper>
              </ValidatorForm>

              {/* <FormattedMessage {...messages.header} /> */}
            </div>
          )}
          <Dialog open={this.state.openAddPromotion} onClose={this.onClosePromotionInformation}>
            <DialogTitle id="alert-dialog-title">Thông tin khuyến mãi</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              <AsyncAutocomplete
                // optionLabel="code"
                name="campaign"
                label={'CHIẾN DỊCH'}
                // error={localMessages && localMessages.campaign}
                // helperText={localMessages && localMessages.campaign}
                onChange={value => {
                  this.setState({
                    campaign: value,
                  });
                }}
                url={`${API_CRM_CAMPAIGN}`}
                value={this.state.campaign}
              />
              <CustomInputBase
                name="downloadReferrals"
                value={this.state.downloadReferrals}
                onChange={value => {
                  this.setState({
                    downloadReferrals: value.target.value,
                  });
                }}
                label={'SỐ LẦN GIỚI THIỆU TẢI APP'}
                // type={config && config.createdBy && config.createdBy.type}
                // disabled
                // error={localMessages && localMessages.createdBy_name}
                // helperText={localMessages && localMessages.createdBy_name}
                // required={checkRequired.createdBy_name}
                // checkedShowForm={checkShowForm.createdBy_name}
              />
              {/* <AsyncAutocomplete
                optionLabel="code"
                isMulti
                name="voucherCode"
                label={'MÃ VOUCHER'}
                // error={localMessages && localMessages.voucherCode}
                // helperText={localMessages && localMessages.voucherCode}
                onChange={value => {
                  this.setState({
                    vouchers: value,
                  });
                }}
                url={`${API_CUSTOMERS}/voucher`}
                value={this.state.vouchers}
              /> */}
              <CustomInputBase
                name="voucherCode"
                value={this.state.vouchers}
                onChange={e => this.handleChangeCustomer(e, 'vouchers')}
                label={'MÃ VOUCHER'}
                // type={config && config.voucherCode && config.voucherCode.type}
                error={localMessages && localMessages.voucherCode}
                helperText={localMessages && localMessages.voucherCode}
                // onKeyDown={blockStringSpecial}
              />
              <AsyncAutocomplete
                // isDisabled={!roleListEdit}
                isMulti
                name="products"
                label={'SẢN PHẨM'}
                // error={localMessages && localMessages.products}
                // helperText={localMessages && localMessages.products}
                onChange={value => {
                  this.setState({
                    products: value,
                  });
                }}
                url={`${API_STOCK}`}
                value={this.state.products}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addPromotionInformation} variant="outlined" color="primary" autoFocus>
                Lưu
              </Button>
              <Button onClick={this.onClosePromotionInformation} variant="outlined" color="secondary">
                Hủy
              </Button>
            </DialogActions>
          </Dialog>
          {/* <Comment id={this.props.id ? this.props.id : this.props.match.params.id} code="Customer" /> */}
        </div>
      </Grid>
    );
  }

  onLoadSuccess(customerInfo) {
    this.setState({ name: customerInfo.name });
  }

  handleChangeTab = (event, value) => {
    this.setState({ valueForTabs: value });
  };

  handleChangeIndex = index => {
    this.setState({ valueForTabs: index });
  };

  handleChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleChangeName = name => e => {
    const rex = /^([a-zàáâãèéêếìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+)$/i;
    const value = e.target.value.toLowerCase();

    const errorName = !rex.test(value);

    if (!value.match(/[~`!#^&*@%<>\$'"+-?_]/)) {
      this.setState({ [name]: e.target.value, errorName });
    } else {
      this.setState('Unforbidden character: ~`!#^&*@%<>$\'"');
    }
  };

  handleChangeLastName = name => e => {
    const rex = /^[a-zA-Z]+[\s\w]{0,}$/;
    const value = e.target.value;
    const errorLastName = !rex.test(value);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ [name]: e.target.value, errorLastName });
  };

  handleChangeNickName = name => e => {
    const rex = /^[a-zA-Z0-9]+[\s\w]{4,}$/;
    const value = e.target.value;
    const errorNickName = !rex.test(value);
    this.setState({ [name]: e.target.value, errorNickName });
  };

  handleChangeidetityCardNumber = name => e => {
    if (e.target.value < 0) return;
    this.setState({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeProps = name => e => {
    this.props.handleChange({ [name]: e.target.value });
  };

  handleChangeSelect = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  // onSave1 = () => {
  //   // const state = this.state;
  //   this.state.load === true;
  //   console.log(this.state.load)
  // };
  addPromotionInformation = () => {
    const data = {
      customer: {
        code: this.state.code,
        customerId: this.state.id,
      },
      campaign: {
        campaignId: this.state.campaign && this.state.campaign._id ? this.state.campaign._id : null,
        code: this.state.campaign && this.state.campaign.code ? this.state.campaign.code : null,
      },
      downloadReferrals: this.state.downloadReferrals,
      vouchers: this.state.vouchers,
      products: this.state.products,
    };
    this.props.addPromotion(data);
    this.setState({ openAddPromotion: false });
  };
  onSave = () => {
    // console.log('loadding', loadding);

    const state = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const listAtt = this.props.listAtt;
    const attributes = {};
    this.setState({ ...this.state, loadding: true });
    // console.log(1111, this.state.loadSubmit);
    Object.keys(listAtt).forEach(item => {
      if (this.props.addCustomerPage[item] && this.props.addCustomerPage[item].length) attributes[item] = this.props.addCustomerPage[item];
    });
    let data = {};
    // console.log('hihi', this.state.loadding);
    if (id === 'add') {
      data = {
        city: state.city,
        district: state.district,
        ward: state.ward,
        load: state.load,
        type: state.type,
        kanbanStatus: state.kanbanStatus,
        others: state.others,
        callback: this.props.callback,
        idetityCardNumber: state.idetityCardNumber,
        bank: state.bank,
        bankAccountNumber: state.bankAccountNumber,
        contributorClass: state.contributorClass,

        facebook: state.facebook,
        // code: state.code,
        name: state.name,
        phoneNumber: state.phoneNumber,
        appUsage: state.appUsage,
        channel: state.channel,
        email: state.email,
        createdBy_name: state.createdBy,
        configOthers: state.configOthers,
        downloadReferrals: state.downloadReferrals,
        taxCode: state.taxCode,
        lastContact: state.lastContact,
        lastPurchase: state.lastPurchase,
        address: state.address,
        productsInterest: state.productsInterest,
        purchases: state.purchases,
        source: state.source,
        store: state.store,
        // totalInteractions: state.totalInteractions,
        gender: state.gender,
        birthDay: state.birthDay,
        avatar: state.avatar,
        avatarURL: state.avatarURL,
        note: state.note,
        joinDate: state.joinDate,
        serviceSale: state.serviceSale,
        saleFirst: state.saleFirst,
        // d1Point: state.d1Point,
        // d2Point: state.d2Point,
        rankD1: state.rankD1,
        rankD2: state.rankD2,
        pointApp: state.pointApp,
        pointSell: state.pointSell,
        pointPurchase: state.pointPurchase,
        pointAppCTV: state.pointAppCTV,
        pointSellCTV: state.pointSellCTV,
        pointPurchaseCTV: state.pointPurchaseCTV,
        rows: state.rows,
        detailInfo_options_Type: state.detailInfo_options_Type,
        managerEmployee: state.managerEmployee ? state.managerEmployee._id : null,
        detailInfo: {
          typeCustomer: {
            typeOfCustomer: state.detailInfo_typeCustomer_typeOfCustomer,
            group: state.detailInfo_typeCustomer_group,
            introPerson: state.detailInfo_typeCustomer_introPerson ? state.detailInfo_typeCustomer_introPerson._id : null,
          },
          represent: {
            localPersonInfo: state.rows,
          },
        },
      };
    } else {
      data = {
        city: state.city,
        district: state.district,
        ward: state.ward,
        load: state.load,
        idetityCardNumber: state.idetityCardNumber,
        bank: state.bank,
        bankAccountNumber: state.bankAccountNumber,
        contributorClass: state.contributorClass,
        type: state.type,
        kanbanStatus: state.kanbanStatus,
        others: state.others,
        callback: this.props.callback,
        facebook: state.facebook,
        code: state.code,
        name: state.name,
        phoneNumber: state.phoneNumber,
        appUsage: state.appUsage,
        channel: state.channel,
        email: state.email,
        createdBy_name: state.createdBy,
        configOthers: state.configOthers,
        downloadReferrals: state.downloadReferrals,
        taxCode: state.taxCode,
        lastContact: state.lastContact,
        lastPurchase: state.lastPurchase,
        address: state.address,
        productsInterest: state.productsInterest,
        purchases: state.purchases,
        source: state.source,
        store: state.store,
        totalInteractions: state.totalInteractions,
        gender: state.gender,
        birthDay: state.birthDay,
        avatar: state.avatar,
        avatarURL: state.avatarURL,
        note: state.note,
        joinDate: state.joinDate,
        serviceSale: state.serviceSale,
        saleFirst: state.saleFirst,
        // d1Point: state.d1Point,
        // d2Point: state.d2Point,
        rankD1: state.rankD1,
        rankD2: state.rankD2,
        pointApp: state.pointApp,
        pointSell: state.pointSell,
        pointPurchase: state.pointPurchase,
        pointAppCTV: state.pointAppCTV,
        pointSellCTV: state.pointSellCTV,
        pointPurchaseCTV: state.pointPurchaseCTV,
        rows: state.rows,
        detailInfo_options_Type: state.detailInfo_options_Type,
        managerEmployee: state.managerEmployee ? state.managerEmployee._id : null,
        detailInfo: {
          typeCustomer: {
            typeOfCustomer: state.detailInfo_typeCustomer_typeOfCustomer,
            group: state.detailInfo_typeCustomer_group,
            introPerson: state.detailInfo_typeCustomer_introPerson ? state.detailInfo_typeCustomer_introPerson._id : null,
          },
          represent: {
            localPersonInfo: state.rows,
          },
        },
        customerType: state.customerType ? state.customerType : 1,
      };
    }
    const messages = viewConfigCheckForm('Customer', dot.dot(data));
    // if (this.state.name === '' && this.state.endDate !== '') {
    //   this.props.onChangeSnackbar({ status: true, message: 'Không được để trống tên CHIẾN DỊCH', variant: 'error' });
    //   return;
    // }
    if (Object.keys(messages).length === 0) {
      if (id === 'add') {
        // this.setState({ load: data.load });
        this.props.postCustomer(data);
      } else {
        // this.setState({ load: true });
        this.props.putCustomer(id, data);
      }
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };

  CloseCustomer = () => {
    this.props.callback('close');
  };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleInputChange = e => {
    this.setState({ search: e.target.value, locationAddress: e.target.value });
  };

  handleSelectSuggest = suggest => {
    const lat = suggest.geometry.location.lat();
    const lng = suggest.geometry.location.lng();
    this.setState({ search: '', locationAddress: suggest.formatted_address, location: { lat, lng } });
  };

  handleClickCurrentLocation = () => {
    const { lat, lng } = this.state.location;
    this.getLocationByLatLng(lat, lng, 'default');
  };
  /* eslint-disable */
  onMarkerDragEnd = evt => {
    if (window.google) {
      const cityCircle = new google.maps.Circle({
        strokeColor: '#57aad7',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#69c0ef',
        fillOpacity: 0.35,
        // map,
        // center: this.state.location,
        radius: 50,
      });
      this.state.cityCircle = cityCircle;
    }
    this.getLocationByLatLng(evt.latLng.lat(), evt.latLng.lng());
  };

  /* eslint-enable */
  getLocationByLatLng(latitude, longitude, df = false) {
    const self = this;
    let location = null;
    if (window.navigator && window.navigator.geolocation) {
      location = window.navigator.geolocation;
    }
    if (location) {
      location.getCurrentPosition(position => {
        let lat = latitude;
        let lng = longitude;
        if (df === 'default') {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAXhItM5DtDeNF7uesxuyhEGd3Wb_5skTg`;
        axios.get(url).then(data => {
          const { results } = data.data;
          if (!!results && !!results.length) {
            /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
            /* eslint-disable */
            const { formatted_address } = results[0];
            self.setState({
              locationAddress: formatted_address,
              location: { lat, lng },
            });
          }
        });
      });
    }
  }
}

function TabContainer({ children, dir }) {
  return (
    <GridUI item md={12} sm={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </GridUI>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

AddCustomerPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addCustomerPage: makeSelectAddCustomerPage(),
  listAtt: makeSelectlistAtt(),
  addProjects: makeSelectAddProjects(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInfo: id => dispatch(getInfo(id)),
    postCustomer: data => dispatch(postCustomer(data)),
    mergeData: data => dispatch(mergeData(data)),
    putCustomer: (id, data) => dispatch(putCustomer(id, data)),
    handleChange: data => dispatch(handleChangeName(data)),
    handleChange: data => dispatch(handleChangeLastName(data)),
    handleChange: data => dispatch(handleChangeNickName(data)),
    handleChangeSelect: e => dispatch(changeSelect(e.target.value)),
    changeExpanded: id => dispatch(changeExpanded(id)),
    getAttribute: () => dispatch(getAttribute()),
    handleChangeAtt: name => event => dispatch(handleChangeAtt({ name: name, value: event.target.value })),
    handleRemove: (name, value) => dispatch(handleChangeAtt({ name, value })),
    handleChecked: name => event => dispatch(handleChangeAtt({ name: name, value: event.target.checked })),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    addPromotion: data => dispatch(addPromotion(data)),
    onDefaultAction: () => dispatch(defaultAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addCustomerPage', reducer });
const withSaga = injectSaga({ key: 'addCustomerPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddCustomerPage);

AddCustomerPage.defaultProps = { callback: false };
