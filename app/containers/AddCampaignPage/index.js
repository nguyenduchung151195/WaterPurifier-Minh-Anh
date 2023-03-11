/* eslint-disable prettier/prettier */
/**
 *
 * AddCampaignPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ListAsync from '../../components/List';

// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import TableUI from '@material-ui/core/Table';
import { Fab, Loading } from 'components/LifetekUi';
import { Dehaze } from '@material-ui/icons';
import { compose } from 'redux';
import {
  Typography,
  Paper,
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
  OutlinedInput,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TodayIcon from '@material-ui/icons/Today';
import { TextValidator, TextField, Autocomplete, FileUpload, KanbanStep, AsyncAutocomplete, Grid } from 'components/LifetekUi';
import makeSelectAddProjects from './selectors';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import AdvanceFilterAndListFilterTags from '../../components/Filter/AdvanceFilterAndListFilterTags';

import {
  API_CUSTOMERS,
  API_TEMPLATE,
  API_CRM_CAMPAIGN,
  API_CONTACT_CENTER,
  API_CONTACT_CENTER_CAMPAIGN,
  API_ROLE_APP,
  API_BOS,
} from 'config/urlConfig';

import GridUI from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';
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
import { API_KEY, API_USERS, API_STOCK } from '../../config/urlConfig';
import Attribute from '../../components/Attribute';
import makeSelectAddCampaignPage, { makeSelectlistAtt } from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import avatarDefault from '../../images/default-avatar.png';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

// import {
//   // DatePicker,
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';
import { CameraAlt, Delete } from '@material-ui/icons';
import AvatarImg from 'images/product.png';
import styles from './styles';
import {
  getInfo,
  postCampaign,
  putCampaign,
  handleChangeName,
  handleChangeLastName,
  handleChangeNickName,
  changeSelect,
  changeExpanded,
  getAttribute,
  handleChangeAtt,
  mergeData,
} from './actions';
import messages from './messages';
import { provincialColumns } from '../../variable';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import CustomInputBase from '../../components/Input/CustomInputBase';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import VerticalDepartmentTreeTwo from '../../components/Filter/VerticalDepartmentTreeTwo';

import CustomInputField from '../../components/Input/CustomInputField';
import { viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import dot from 'dot-object';
import KanbanStepper from '../../components/KanbanStepper';
import CustomButton from 'components/CustomButtons/Button';
import { format } from 'date-fns';
import CustomerProvinceAddress from '../../components/CustomerProvinceAddress';
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
function TabContainer({ children, dir }) {
  return (
    <GridUI item md={12} sm={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </GridUI>
  );
}
const newColumns = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === CUSTOMER_TYPE_CODE)) || {
    data: [],
  }
).data;
const groupCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S07')) || { data: [] }
).data;
const branchesCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'pckh')) || { data: [] }
).data;
const areasCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S10')) || { data: [] }
).data;
const contactMethod = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S06')) || { data: [] }
).data;
const typeProduct = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S02')) || { data: [] }
).data;
const career = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S12')) || { data: [] }
).data;
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

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

export class AddCampaignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 'DD/MM/YYYY',
      load: false,
      advanceSearchQuery: {},
      content: null,
      campaignStatus: null,
      tab: 0,
      name: '',
      code: '',
      owner: null,
      active: null,
      parentId: null,
      parentId_name: null,
      typeCampaign: null,
      startDate: new Date(),
      endDate: new Date(),
      DSCP: null,
      unintended: '',
      note: '',
      specialOffer: '',
      createdBy: null,
      productGroup: null,
      channel: null,
      amountCustomer: null,
      conversionRate: null,
      averageOrder: null,
      costPerContact: null,
      checked: false,
      others: {},
      newOwner: null,
      customerColumns: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'crmCampaign')
        .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
      valueForTabs: 0,
      checkShowForm: viewConfigCheckRequired('crmCampaign', 'showForm'),
      checkRequired: viewConfigCheckRequired('crmCampaign', 'required'),
      localMessages: {},
      createdAt: moment().format('YYYY-MM-DD'),
      updatedBy: null,
      tabColumn: 0,
      contactCenter: null,
      allocation: [],
      idCampaign: null,
      updatedAt: null,
      role: null,
      image: '',
      avatar: null,
      pointPresenter: null,
      pointCustomer: null,
      pointApp: null,
      pointSell: null,
      pointPurchase: null,
      pointAppCTV: null,
      pointSellCTV: null,
      pointPurchaseCTV: null,
      provinceAddress: {
        province: {},
        district: {},
      },
      serviceCharge: '',
      amount2Reward: '',
      voucherCode: null,
      amountVoucher: null,
      amountProduct: null,
      amountJoin : null,
      products: [],
      revolvingProduct: []
    };
  }

  componentDidMount() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id === 'add') {
      this.setState({
        idCampaign: 1,
      });
    } else {
      this.setState({
        idCampaign: id,
      });
    }
    //phan quyen tlpb vs ttcd
    const idUser = this.props.profile && this.props.profile._id;
    fetch(`${API_ROLE_APP}/crmCampaign/${idUser}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          roles: data && data.roles,
        });
      });

    if (id === 'add') return null;
    fetch(`${API_CRM_CAMPAIGN}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let result = {
          ...data,
          provinceAddress: {
            province: data.province,
            district: data.district,
          },
        };
        this.setState(result);
      });
    this.props.getInfo(id);
    const { name } = this.state;
    const body = { name };
    const data = dot.dot(body);
    const messages = viewConfigCheckForm('crmCampaign', data);
    this.state.localMessages = messages;
  }

  // getMessages() {

  //   } = this.state;

  //   const body = {

  //   };

  // }
  // static getDerivedStateFromProps(props, state) {

  //   return null;
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (this.state !== nextState) return true;
  // }
  componentDidUpdate(nextProps, nextState) {
    const {
      name,
      conversionRate,
      DSCP,
      active,
      amountCustomer,
      averageOrder,
      campaignStatus,
      channel,
      costPerContact,
      contactCenter,
      createdAt,
      createdBy,
      endDate,
      note,
      owner,
      owner_name,
      parentId,
      parentId_name,
      productGroup,
      serviceSales,
      startDate,
      typeCampaign,
      unintended,
      updatedAt,
      updatedBy,
      pointCustomer,
      pointPresenter,
      pointApp,
      pointSell,
      pointPurchase,
      pointAppCTV,
      pointSellCTV,
      pointPurchaseCTV,
      sendEmail,
      sendSMS,
    } = this.state;
    const body = {
      name,
      conversionRate,
      DSCP,
      active,
      amountCustomer,
      averageOrder,
      campaignStatus,
      channel,
      costPerContact,
      contactCenter,
      createdAt,
      createdBy,
      endDate,
      sendEmail,
      sendSMS,
      note,
      owner,
      owner_name,
      parentId,
      parentId_name,
      productGroup,
      serviceSales,
      startDate,
      typeCampaign,
      unintended,
      updatedAt,
      updatedBy,
      pointCustomer,
      pointPresenter,
      pointApp,
      pointSell,
      pointPurchase,
      pointAppCTV,
      pointSellCTV,
      pointPurchaseCTV,
    };
    const data = dot.dot(body);

    if (this.state !== nextState) {
      const messages = viewConfigCheckForm('crmCampaign', data);
      this.state.localMessages = messages;
    }
  }

  // changeMutil(value) {
  //   // const arrayValue = value.map(item => item.value);
  //   const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'viewableEmployees', value);
  //   this.setState({
  //     peopleCanView: value,
  //     localMessages: messages,
  //   });
  // }

  // changeSingle(value) {
  //   const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, 'managerEmployee', value);
  //   this.setState({
  //     managerEmployee: value,
  //     localMessages: messages,
  //   });
  // }

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
    return null;
  };
  addItem2 = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.value}>{element.title}</MenuItem>);
    return null;
  };

  setOthers = (name, value) => {
    const { others } = this.state;
    const newOthers = { ...others };
    newOthers[name] = value;
    this.setState({ others: newOthers });
  };

  handleChangeKanban = item => {
    this.setState({ kanbanStatus: item.type });
  };

  handleChangeCampaign = (e, fieldName, isDate, isFirst) => {
    const name = fieldName;
    const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD  HH:mm ') : moment(e).format('YYYY-MM-DD  HH:mm')) : e.target.value;
    // const { target: { value, name } } = e;
    const messages = viewConfigHandleOnChange('crmCampaign', this.state.localMessages, fieldName, value);
    this.setState({
      [name]: value,
      localMessages: messages,
    });
  };
  handleChangeCampaignCreate = (e, fieldName) => {
    const name = fieldName;

    const messages = viewConfigHandleOnChange('Customer', this.state.localMessages, fieldName, value);
    this.setState({
      [name]: config.createdBy_name.title,
      localMessages: messages,
    });
  };
  mapFunctionBo = item => {
    // const typeCustomer = newColumns.find(elm => elm.value === item['typeOfCustomer']);
    return {
      ...item,
      createdBy: item['createdBy.name'],
      presenter: item['presenter.name'],
      updatedBy: item['updatedBy.name'],
      customer: item['customer.customerId.code'],
      campaign: item['campaign.name'],
      presenter: item['presenter.name'],
      ['responsibilityPerson']: item['responsibilityPerson'],
      //updatedAt: Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day')),
      // updatedAt: <p>{Math.floor(moment.duration(moment().diff(moment(item.updatedAt))).as('day'))} Ngày</p>,
      updatedAt: moment(item['updatedAt']).format('DD/MM/YYYY, h:mm:ss a'),
      organizationUnitId: item.organizationUnitIdName,
      exchangingAgreement: item['exchangingAgreement.name'],
      // typeOfCustomer: item.typeCustomer ? item['typeCustomer.name'] : '',
    };
  };
  handleChange = (name, event) => {
    setChecked(event.target.checked);
    // this.setState({[name] : event.target.checked})
  };
  handleTab = tab => {
    this.setState({ tab });
  };
  handleDateChange = date => {
    this.setState({ startDate: date });
  };
  handleEditAdvanceClick = item => {
    const { history } = this.props;
    history.push({
      pathname: `/crm/BusinessOpportunities/${item._id}`,
      idCampaign: item && item['campaign._id'],
    });
  };
  onHoverIn = () => {
    this.setState({ showAva: true });
  };

  onHoverOut = () => {
    this.setState({ showAva: false });
  };

  handleChangeAddress = (e, name) => {
    this.setState({
      provinceAddress: {
        ...this.state.provinceAddress,
        [name]: e,
      },
    });
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
      this.setState({ image: urlAvt, avatar: file });
    }
  };
  render() {
    const { intl, profile, dashboardPage, addCampaignPage, classes } = this.props;
    // const arrDepartment = usersPage.arrDepartment || [];
    const { allDepartment } = dashboardPage;

    const config = {};
    this.state.customerColumns.forEach(item => {
      config[item.name] = item;
    });
    console.log('config', config);
    const { users, voucher } = addCampaignPage;
    const { search, locationAddress, valueForTabs, localMessages, checkShowForm, checkRequired, tab, idCampaign, roles } = this.state;
    let { cityCircle } = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const status = id === 'add' ? true : this.state.status;
    // const [tabColumn, setTabColumn] = useState(0);
    const role = roles && roles.find(item => item.name === 'Tính năng');
    const roleList = role && role.data && role.data.find(item => item.name === 'list');
    const roleListView = roleList && roleList.data && roleList.data.view;
    const roleListEdit = roleList && roleList.data && roleList.data.edit;

    const roleAllocation = role && role.data && role.data.find(item => item.name === 'allocation');
    const roleAllocationView = roleAllocation && roleAllocation.data && roleAllocation.data.view;
    const roleAllocationEdit = roleAllocation && roleAllocation.data && roleAllocation.data.edit;
    const checkSave = roleListView === false || roleListEdit === false;
    return (
      <div>
        {this.state.load ? <Loading /> : null}
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới chiến dịch' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật chiến dịch' })}`
          }
          onGoBack={() => {
            this.props.history.goBack();
          }}
          onSubmit={this.onSave}
          disableAdd={id === 'add' && checkSave}
        />
        <Paper className={classes.paper} style={{ width: '1610px !important' }}>
          <Tabs value={this.state.valueForTabs} onChange={this.handleChangeTab} indicatorColor="primary" variant="scrollable" scrollButtons="on">
            {roleListView ? <Tab disableRipple label="Thông tin chiến dịch" /> : null}
            {roleAllocationView ? <Tab disableRipple label="Thiết lập phân bổ" /> : null}
          </Tabs>
          <SwipeableViews
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            // style={{ overflowX: 'hidden !important' }}
            index={roleListView ? valueForTabs : 1}
            onChangeIndex={this.handleChangeIndex}
            width={window.innerWidth - 260}
            style={{ height: '800px' }}
          >
            <TabContainer>
              {roleListView ? (
                <>
                  <Typography component="p" className={classes.paperTitle}>
                    <span>Các trường có dấu * là cần nhập</span>
                  </Typography>
                  <Grid item container md={12} spacing={8} style={{ display: 'flex', justifyContent: 'center' }}>
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
                        <img
                          src={
                            this.state.image === '' || this.state.image === 'https://g.lifetek.vn:203/api/files/5f87f1e72cd210160c691973'
                              ? AvatarImg
                              : this.state.image
                          }
                          alt="Ảnh sản phẩm"
                          className={classes.avatar}
                        />
                        <input
                          accept="image/*"
                          className={classes.inputAvt}
                          type="file"
                          onChange={this.onSelectImg}
                          onMouseEnter={this.onHoverIn}
                          onMouseLeave={this.onHoverOut}
                          name="avatar"
                        />
                        <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                          <CameraAlt className={classes.iconCam} />
                        </span>
                      </div>
                    </Grid>
                    <Grid item md={5}>
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
                    code={16}
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
                            ? // || this.state.name === '' ? 'Không được để trống TÊN CHIẾN DỊCH' : null
                            localMessages.name
                            : this.state.name === ''
                              ? 'Không được để trống TÊN CHIẾN DỊCH'
                              : null
                        }
                        required={checkRequired.name}
                        checkedShowForm={checkShowForm.name}
                        label={config && config.name && config.name.title}
                        type={config && config.name && config.name.type}
                        // onChange={this.handleChangeName('name')}
                        onChange={e => this.handleChangeCampaign(e, config.name.name)}
                        name={config.name && config.name.name}
                        value={this.state.name}
                        onKeyDown={blockStringSpecial}
                        disabled={!roleListEdit}
                      // showRecorder
                      // voiceInput
                      />
                      {/* <CustomInputBase
                  label={config.owner_name.title}
                  type={config.owner_name.type}
                  value={this.state.owner_name}
                  displayEmpty
                  name="owner_name"
                  select
                  onChange={e => this.handleChangeCampaign(e, 'owner_name')}
                >
                  {this.addItem(config.owner_name.configCode)}
                </CustomInputBase> */}

                      <CustomInputBase
                        label={config && config.active && config.active.title}
                        type={config && config.active && config.active.type}
                        value={this.state.active}
                        displayEmpty
                        name="active"
                        select
                        onChange={e => this.handleChangeCampaign(e, 'active')}
                        error={localMessages && localMessages.active}
                        helperText={localMessages && localMessages.active}
                        required={checkRequired.active}
                        checkedShowForm={checkShowForm.active}
                        disabled={!roleListEdit}
                      >
                        {this.addItem(config.active.configCode)}
                      </CustomInputBase>
                      {/* <CustomInputBase
                  label={config.parentId.title}
                  type={config.parentId.type}
                  value={this.state.parentId}
                  displayEmpty
                  name="parentId"
                  select
                  onChange={e => this.handleChangeCampaign(e, 'parentId')}
                >
                  {this.addItem(config.parentId.configCode)}
                </CustomInputBase> */}
                      <AsyncAutocomplete
                        // isMulti
                        name="parentId"
                        label={config && config.parentId && config.parentId.title}
                        error={localMessages && localMessages.parentId}
                        helperText={localMessages && localMessages.parentId}
                        onChange={value => {
                          this.setState({
                            parentId: value,
                          });
                        }}
                        url={API_CRM_CAMPAIGN}
                        value={this.state.parentId}
                        isDisabled={!roleListEdit}
                      />
                      <CustomInputBase
                        label={config && config.typeCampaign && config.typeCampaign.title}
                        type={config && config.typeCampaign && config.typeCampaign.type}
                        value={this.state.typeCampaign}
                        displayEmpty
                        name="typeCampaign"
                        select
                        error={localMessages && localMessages.typeCampaign}
                        helperText={localMessages && localMessages.typeCampaign}
                        required={checkRequired.typeCampaign}
                        checkedShowForm={checkShowForm.typeCampaign}
                        onChange={e => this.handleChangeCampaign(e, 'typeCampaign')}
                        disabled={!roleListEdit}
                      >
                        {this.addItem(config.typeCampaign && config.typeCampaign.configCode)}
                      </CustomInputBase>
                      {/* <DatePicker
                        className={classes.textField}
                        inputVariant="outlined"
                        format="DD/MM/YYYY"
                        value={this.state.startDate === null ? '' : this.state.startDate}
                        error={localMessages && localMessages.startDate}
                        helperText={localMessages && localMessages.startDate}
                        checkedShowForm={checkShowForm.startDate}
                        required={checkRequired.startDate}
                        variant="outlined"
                        label={config && config.startDate && config.startDate.title}
                        margin="dense"
                        name="joinDate"
                        inputProps={{ max }}
                        InputLabelProps={{ shrink: true }}
                        onChange={e => this.handleChangeCampaign(e, 'startDate', true, false)}
                        keyboard
                        // disablePast
                        fullWidth
                        disableOpenOnEnter
                        keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                        disabled={!roleListEdit}
                      /> */}
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DateTimePicker
                          invalidLabel="DD/MM/YYYY"
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          error={localMessages && localMessages.startDate}
                          helperText={localMessages && localMessages.startDate}
                          checkedShowForm={checkShowForm.startDate}
                          required={checkRequired.startDate}
                          value={this.state.startDate === null ? '' : this.state.startDate}
                          variant="outlined"
                          label={config && config.startDate && config.startDate.title}
                          margin="dense"
                          // required
                          // disabled={(!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add'}
                          onChange={e => this.handleChangeCampaign(e, 'startDate', true, false)}
                          style={{ width: '100%' }}
                        />
                      </MuiPickersUtilsProvider>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DateTimePicker
                          invalidLabel="DD/MM/YYYY"
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          error={
                            (localMessages && localMessages.endDate) ||
                            this.state.endDate === '' ||
                            new Date(this.state.startDate) >= new Date(this.state.endDate)
                          }
                          helperText={
                            (localMessages && localMessages.endDate) || this.state.endDate === ''
                              ? 'Không được để trống NGÀY KẾT THÚC'
                              : null || new Date(this.state.startDate) >= new Date(this.state.endDate)
                                ? 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                                : null
                          }
                          checkedShowForm={checkShowForm.endDate}
                          required
                          label={config && config.endDate && config.endDate.title}
                          value={this.state.endDate}
                          name="endDate"
                          margin="dense"
                          variant="outlined"
                          // disabled={((!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add') || addProjects.template}
                          onChange={e => this.handleChangeCampaign(e, 'endDate', true, false)}
                          style={{ width: '100%' }}
                        />
                      </MuiPickersUtilsProvider>
                      {/* <DatePicker
                        disabled={!roleListEdit}
                        className={classes.textField}
                        invalidLabel="DD/MM/YYYY"
                        inputVariant="outlined"
                        // format="DD/MM/YYYY"
                        error={(localMessages && localMessages.endDate) || new Date(this.state.startDate) >= new Date(this.state.endDate)}
                        helperText={
                          (localMessages && localMessages.endDate) || new Date(this.state.startDate) >= new Date(this.state.endDate)
                            ? 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                            : null
                        }
                        format="DD/MM/YYYY HH:mm"
                        checkedShowForm={checkShowForm.endDate}
                        required={checkRequired.endDate}
                        value={this.state.endDate}
                        invalidDateMessage="Nhập sai định dạng ngày"
                        variant="outlined"
                        label={config && config.endDate && config.endDate.title}
                        margin="dense"
                        name="joinDate"
                        inputProps={{ max }}
                        InputLabelProps={{ shrink: true }}
                        onChange={e => this.handleChangeCampaign(e, 'endDate', true, false)}
                        // disablePast
                        keyboard
                        fullWidth
                        disableOpenOnEnter
                        keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                      /> */}
                      {/* </MuiPickersUtilsProvider> */}
                      <CustomInputBase
                        label={config && config.DSCP && config.DSCP.title}
                        type={config && config.DSCP && config.DSCP.type}
                        // onChange={this.handleChangeName('name')}
                        onChange={e => this.handleChangeCampaign(e, config.DSCP.name)}
                        name={config.DSCP && config.DSCP.name}
                        value={this.state.DSCP}
                        error={localMessages && localMessages.DSCP}
                        helperText={localMessages && localMessages.DSCP}
                        required={checkRequired.DSCP}
                        checkedShowForm={checkShowForm.DSCP}
                        onKeyDown={blockStringSpecial}
                        disabled={!roleListEdit}

                      // showRecorder
                      // voiceInput
                      />

                      <CustomInputBase
                        label={config && config.campaignStatus && config.campaignStatus.title}
                        value={this.state.campaignStatus}
                        displayEmpty
                        name="campaignStatus"
                        select
                        onChange={e => this.handleChangeCampaign(e, 'campaignStatus')}
                        error={localMessages && localMessages.campaignStatus}
                        helperText={localMessages && localMessages.campaignStatus}
                        required={checkRequired.campaignStatus}
                        checkedShowForm={checkShowForm.campaignStatus}
                        disabled={!roleListEdit}
                      >
                        {this.addItem(config.campaignStatus && config.campaignStatus.configCode)}
                      </CustomInputBase>
                      {id === 'add' ? null : (
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            className={classes.textField}
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            value={this.state.createdAt}
                            invalidDateMessage="Nhập sai định dạng ngày"
                            variant="outlined"
                            label="Ngày tạo"
                            margin="dense"
                            inputProps={{ max }}
                            InputLabelProps={{ shrink: true }}
                            // disableFuture
                            keyboard
                            fullWidth
                            disabled
                            keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                      {id === 'add' ? null : (
                        <CustomInputBase
                          name="createdBy_name"
                          value={this.state.createdBy && this.state.createdBy.name}
                          // onChange={this.handleChange('email')}
                          label={config && config.createdBy && config.createdBy.title}
                          type={config && config.createdBy && config.createdBy.type}
                          disabled
                        />
                      )}
                      <AsyncAutocomplete
                        // isMulti
                        isDisabled={!roleListEdit}
                        name="contactCenter"
                        label={config && config.contactCenter && config.contactCenter.title}
                        onChange={value => {
                          this.setState({
                            contactCenter: value,
                          });
                        }}
                        error={localMessages && localMessages.contactCenter}
                        helperText={localMessages && localMessages.contactCenter}
                        url={API_CONTACT_CENTER_CAMPAIGN}
                        value={this.state.contactCenter}
                      />
                      {id === 'add' ? null : (
                        <AsyncAutocomplete
                          isDisabled={!roleListEdit}
                          // isMulti
                          name="owner"
                          label={config && config.owner && config.owner.title}
                          error={localMessages && localMessages.owner}
                          helperText={localMessages && localMessages.owner}
                          onChange={value => {
                            this.setState({
                              owner: value,
                            });
                          }}
                          url={API_USERS}
                          value={this.state.owner}
                        />
                      )}
                      <MenuItem>
                        <Checkbox
                          color="primary"
                          checked={this.state.sendEmail ? this.state.sendEmail : false}
                          onChange={e => {
                            // c1
                            this.setState({ sendEmail: e.target.checked });
                            // c2
                            // this.handleChange('sendEmail', e)
                          }}
                        />
                        Gửi Email
                      </MenuItem>
                      <MenuItem>
                        <Checkbox
                          color="primary"
                          checked={this.state.sendSMS ? this.state.sendSMS : false}
                          onChange={e => {
                            this.setState({ sendSMS: e.target.checked });
                            // this.handleChange('sendSMS', e)
                          }}
                        />
                        Gửi SMS
                      </MenuItem>
                    </Grid>
                    <Grid item md={5}>
                      {id === 'add' ? null : (
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            className={classes.textField}
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            value={this.state.updatedAt}
                            invalidDateMessage="Nhập sai định dạng ngày"
                            variant="outlined"
                            label="Ngày sửa lần cuối"
                            margin="dense"
                            inputProps={{ max }}
                            InputLabelProps={{ shrink: true }}
                            // onChange={e => this.handleChangeCampaign(e, 'updatedAT', true, false)}
                            // disableFuture
                            keyboard
                            fullWidth
                            disabled
                            keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                          />
                        </MuiPickersUtilsProvider>
                      )}

                      {id !== 'add' && this.state.updatedBy ? (
                        <CustomInputBase
                          label={config && config.updatedBy && config.updatedBy.title}
                          type={config && config.updatedBy && config.updatedBy.type}
                          name={config && config.updatedBy && config.updatedBy.name}
                          value={this.state.updatedBy && this.state.updatedBy.name}
                          error={localMessages && localMessages.updatedBy}
                          helperText={localMessages && localMessages.updatedBy}
                          required={checkRequired.updatedBy}
                          checkedShowForm={checkShowForm.updatedBy}
                          disabled
                        />
                      ) : null}

                      <CustomInputBase
                        disabled={!roleListEdit}
                        error={localMessages && localMessages.productGroup}
                        helperText={localMessages && localMessages.productGroup}
                        label={config && config.productGroup && config.productGroup.title}
                        type={config && config.productGroup && config.productGroup.type}
                        value={this.state.productGroup}
                        displayEmpty
                        name="productGroup"
                        select
                        onChange={e => this.handleChangeCampaign(e, 'productGroup')}
                      >
                        {this.addItem(config.productGroup && config.productGroup.configCode)}
                        { }
                      </CustomInputBase>
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.channel && config.channel.title}
                        error={localMessages && localMessages.channel}
                        helperText={localMessages && localMessages.channel}
                        type={config && config.channel && config.channel.type}
                        value={this.state.channel}
                        displayEmpty
                        name="channel"
                        select
                        onChange={e => this.handleChangeCampaign(e, 'channel')}
                      >
                        {this.addItem(config.channel && config.channel.configCode)}
                      </CustomInputBase>
                      {id === 'add' ? null : (
                        <CustomInputBase
                          label={config && config.amountCustomer && config.amountCustomer.title}
                          type={config && config.amountCustomer && config.amountCustomer.type}
                          onChange={e => this.handleChangeCampaign(e, config.amountCustomer.name)}
                          name={config && config.amountCustomer && config.amountCustomer.name}
                          value={this.state.amountCustomer}
                          error={localMessages && localMessages.amountCustomer}
                          helperText={localMessages && localMessages.amountCustomer}
                          required={checkRequired.amountCustomer}
                          checkedShowForm={checkShowForm.amountCustomer}
                          disabled
                        />
                      )}
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.conversionRate && config.conversionRate.title}
                        type={config && config.conversionRate && config.conversionRate.type}
                        error={localMessages && localMessages.conversionRate}
                        helperText={localMessages && localMessages.conversionRate}
                        required={checkRequired.conversionRate}
                        checkedShowForm={checkShowForm.conversionRate}
                        onChange={e => this.handleChangeCampaign(e, config.conversionRate.name)}
                        name={config.conversionRate && config.conversionRate.name}
                        value={this.state.conversionRate}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.averageOrder && config.averageOrder.title}
                        type={config && config.averageOrder && config.averageOrder.type}
                        onChange={e => this.handleChangeCampaign(e, config.averageOrder.name)}
                        name={config.averageOrder && config.averageOrder.name}
                        value={this.state.averageOrder}
                        error={localMessages && localMessages.averageOrder}
                        helperText={localMessages && localMessages.averageOrder}
                        required={checkRequired.averageOrder}
                        checkedShowForm={checkShowForm.averageOrder}
                      />
                      {id === 'add' ? null : (
                        <CustomInputBase
                          disabled
                          label={config && config.costPerContact && config.costPerContact.title}
                          type={config && config.costPerContact && config.costPerContact.type}
                          // onChange={e => this.handleChangeCampaign(e, config.costPerContact.name)}
                          name={config && config.costPerContact && config.costPerContact.name}
                          value={this.state.costPerContact}
                          error={localMessages && localMessages.costPerContact}
                          helperText={localMessages && localMessages.costPerContact}
                          required={checkRequired.costPerContact}
                          checkedShowForm={checkShowForm.costPerContact}
                        />
                      )}
                      <CustomerProvinceAddress
                        provinceAddress={this.state.provinceAddress}
                        disabledRegion
                        disabledRank
                        localMessages={localMessages}
                        checkShowForm={checkShowForm}
                        checkRequired={checkRequired}
                        handleChange={this.handleChangeAddress}
                      />
                      {/* phí dịch vụ */}
                      <CustomInputBase
                        // disabled={!roleListEdit}
                        label={config && config.serviceCharge && config.serviceCharge.title}
                        type={config && config.serviceCharge && config.serviceCharge.type}
                        onChange={e => this.handleChangeCampaign(e, config.serviceCharge.name)}
                        name={config.serviceCharge && config.serviceCharge.name}
                        value={this.state.serviceCharge}
                        error={localMessages && localMessages.serviceCharge}
                        helperText={localMessages && localMessages.serviceCharge}
                        required={checkRequired.serviceCharge}
                        checkedShowForm={checkShowForm.serviceCharge}
                      />
                      <CustomInputBase
                        // disabled={!roleListEdit}
                        label={config && config.amount2Reward && config.amount2Reward.title}
                        type={config && config.amount2Reward && config.amount2Reward.type}
                        onChange={e => this.handleChangeCampaign(e, config.amount2Reward.name)}
                        name={config.amount2Reward && config.amount2Reward.name}
                        value={this.state.amount2Reward}
                        error={localMessages && localMessages.amount2Reward}
                        helperText={localMessages && localMessages.amount2Reward}
                        required={checkRequired.amount2Reward}
                        checkedShowForm={checkShowForm.amount2Reward}
                      />

                      {/* <AsyncAutocomplete
                        // isDisabled={!roleListEdit}
                        optionLabel="code"
                        isMulti
                        name="voucherCode"
                        label={config && config.voucherCode && config.voucherCode.title}
                        error={localMessages && localMessages.voucherCode}
                        helperText={localMessages && localMessages.voucherCode}
                        onChange={value => {
                          this.setState({
                            voucherCode: value,
                          });
                        }}
                        url={`${API_CUSTOMERS}/voucher`}
                        value={this.state.voucherCode}
                      /> */}
                      <CustomInputBase
                        label={config && config.voucherCode && config.voucherCode.title}
                        type={config && config.voucherCode && config.voucherCode.type}
                        onChange={e => this.handleChangeCampaign(e, config.voucherCode.name)}
                        name={config.voucherCode && config.voucherCode.name}
                        value={this.state.voucherCode}
                        error={localMessages && localMessages.voucherCode}
                        helperText={localMessages && localMessages.voucherCode}
                        required={checkRequired.voucherCode}
                        checkedShowForm={checkShowForm.voucherCode}
                      />
                      <CustomInputBase
                        label={config && config.amountVoucher && config.amountVoucher.title}
                        type={config && config.amountVoucher && config.amountVoucher.type}
                        onChange={e => this.handleChangeCampaign(e, config.amountVoucher.name)}
                        name={config.amountVoucher && config.amountVoucher.name}
                        value={this.state.amountVoucher}
                        error={localMessages && localMessages.amountVoucher}
                        helperText={localMessages && localMessages.amountVoucher}
                        required={checkRequired.amountVoucher}
                        checkedShowForm={checkShowForm.amountVoucher}
                      />
                      <CustomInputBase
                        label={config && config.amountProduct && config.amountProduct.title}
                        type={config && config.amountProduct && config.amountProduct.type}
                        onChange={e => this.handleChangeCampaign(e, config.amountProduct.name)}
                        name={config.amountProduct && config.amountProduct.name}
                        value={this.state.amountProduct}
                        error={localMessages && localMessages.amountProduct}
                        helperText={localMessages && localMessages.amountProduct}
                        required={checkRequired.amountProduct}
                        checkedShowForm={checkShowForm.amountProduct}
                      />
                      <AsyncAutocomplete
                        // isDisabled={!roleListEdit}
                        isMulti
                        name="products"
                        label={config && config.products && config.products.title}
                        error={localMessages && localMessages.products}
                        helperText={localMessages && localMessages.products}
                        onChange={value => {
                          this.setState({
                            products: value,
                          });
                        }}
                        url={API_STOCK}
                        value={this.state.products}
                      />
                      <AsyncAutocomplete
                        // isDisabled={!roleListEdit}
                        isMulti
                        name="revolvingProduct"
                        label={config && config.revolvingProduct && config.revolvingProduct.title}
                        error={localMessages && localMessages.revolvingProduct}
                        helperText={localMessages && localMessages.revolvingProduct}
                        onChange={value => {
                          this.setState({
                            revolvingProduct: value,
                          });
                        }}
                        url={API_STOCK}
                        value={this.state.revolvingProduct}
                      />
                      <AsyncAutocomplete
                        // isDisabled={!roleListEdit}
                        isMulti
                        name="joins"
                        label={config && config.joins && config.joins.title}
                        error={localMessages && localMessages.joins}
                        helperText={localMessages && localMessages.joins}
                        onChange={value => {
                          this.setState({
                            joins: value,
                          });
                        }}
                        url={API_CUSTOMERS}
                        value={this.state.joins}
                        checkedShowForm={checkShowForm.joins}
                      />
                      <CustomInputBase
                        label={config && config.amountJoin && config.amountJoin.title}
                        type={config && config.amountJoin && config.amountJoin.type}
                        onChange={e => this.handleChangeCampaign(e, config.amountJoin.name)}
                        name={config.amountJoin && config.amountJoin.name}
                        value={this.state.amountJoin}
                        error={localMessages && localMessages.amountJoin}
                        helperText={localMessages && localMessages.amountJoin}
                        required={checkRequired.amountJoin}
                        checkedShowForm={checkShowForm.amountJoin}
                      />
                      {/* <Autocomplete
                        isMulti
                        name="Chọn người tham gia"
                        label={config && config.joins && config.joins.title}
                        onChange={e => this.handleChangeCampaign(e, config.joins.name)}
                        suggestions={users.data}
                        value={this.state.joins}
                        error={localMessages && localMessages.joins}
                        helperText={localMessages && localMessages.joins}
                        required={checkRequired.joins}
                        checkedShowForm={checkShowForm.joins}
                      /> */}
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.serviceSales && config.serviceSales.title}
                        type={config && config.serviceSales && config.serviceSales.type}
                        onChange={e => this.handleChangeCampaign(e, config.serviceSales.name)}
                        name={config.serviceSales && config.serviceSales.name}
                        value={this.state.serviceSales}
                        error={localMessages && localMessages.serviceSales}
                        helperText={localMessages && localMessages.serviceSales}
                        required={checkRequired.serviceSales}
                        checkedShowForm={checkShowForm.serviceSales}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.unintended && config.unintended.title}
                        type={config && config.unintended && config.unintended.type}
                        onChange={e => this.handleChangeCampaign(e, config.unintended.name)}
                        name={config.unintended && config.unintended.name}
                        value={this.state.unintended}
                        error={localMessages && localMessages.unintended}
                        helperText={localMessages && localMessages.unintended}
                        required={checkRequired.unintended}
                        checkedShowForm={checkShowForm.unintended}
                        onKeyDown={blockStringSpecial}
                      />
                      {/* <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointCustomer && config.pointCustomer.title}
                        type={config && config.pointCustomer && config.pointCustomer.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointCustomer.name)}
                        name={config.pointCustomer && config.pointCustomer.name}
                        value={this.state.pointCustomer}
                        error={localMessages && localMessages.pointCustomer}
                        helperText={localMessages && localMessages.pointCustomer}
                        required={checkRequired.pointCustomer}
                        checkedShowForm={checkShowForm.pointCustomer}
                        onKeyDown={blockStringSpecial}
                      />

                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointPresenter && config.pointPresenter.title}
                        type={config && config.pointPresenter && config.pointPresenter.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointPresenter.name)}
                        name={config.pointPresenter && config.pointPresenter.name}
                        value={this.state.pointPresenter}
                        error={localMessages && localMessages.pointPresenter}
                        helperText={localMessages && localMessages.pointPresenter}
                        required={checkRequired.pointPresenter}
                        checkedShowForm={checkShowForm.pointPresenter}
                        onKeyDown={blockStringSpecial}
                      /> */}
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointApp && config.pointApp.title}
                        type={config && config.pointApp && config.pointApp.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointApp.name)}
                        name={config.pointApp && config.pointApp.name}
                        value={this.state.pointApp}
                        error={localMessages && localMessages.pointApp}
                        helperText={localMessages && localMessages.pointApp}
                        required={checkRequired.pointApp}
                        checkedShowForm={checkShowForm.pointApp}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointSell && config.pointSell.title}
                        type={config && config.pointSell && config.pointSell.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointSell.name)}
                        name={config.pointSell && config.pointSell.name}
                        value={this.state.pointSell}
                        error={localMessages && localMessages.pointSell}
                        helperText={localMessages && localMessages.pointSell}
                        required={checkRequired.pointSell}
                        checkedShowForm={checkShowForm.pointSell}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointPurchase && config.pointPurchase.title}
                        type={config && config.pointPurchase && config.pointPurchase.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointPurchase.name)}
                        name={config.pointPurchase && config.pointPurchase.name}
                        value={this.state.pointPurchase}
                        error={localMessages && localMessages.pointPurchase}
                        helperText={localMessages && localMessages.pointPurchase}
                        required={checkRequired.pointPurchase}
                        checkedShowForm={checkShowForm.pointPurchase}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointAppCTV && config.pointAppCTV.title}
                        type={config && config.pointAppCTV && config.pointAppCTV.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointAppCTV.name)}
                        name={config.pointAppCTV && config.pointAppCTV.name}
                        value={this.state.pointAppCTV}
                        error={localMessages && localMessages.pointAppCTV}
                        helperText={localMessages && localMessages.pointAppCTV}
                        required={checkRequired.pointAppCTV}
                        checkedShowForm={checkShowForm.pointAppCTV}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointSellCTV && config.pointSellCTV.title}
                        type={config && config.pointSellCTV && config.pointSellCTV.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointSellCTV.name)}
                        name={config.pointSellCTV && config.pointSellCTV.name}
                        value={this.state.pointSellCTV}
                        error={localMessages && localMessages.pointSellCTV}
                        helperText={localMessages && localMessages.pointSellCTV}
                        required={checkRequired.pointSellCTV}
                        checkedShowForm={checkShowForm.pointSellCTV}
                        onKeyDown={blockStringSpecial}
                      />
                      <CustomInputBase
                        disabled={!roleListEdit}
                        label={config && config.pointPurchaseCTV && config.pointPurchaseCTV.title}
                        type={config && config.pointPurchaseCTV && config.pointPurchaseCTV.type}
                        onChange={e => this.handleChangeCampaign(e, config.pointPurchaseCTV.name)}
                        name={config.pointPurchaseCTV && config.pointPurchaseCTV.name}
                        value={this.state.pointPurchaseCTV}
                        error={localMessages && localMessages.pointPurchaseCTV}
                        helperText={localMessages && localMessages.pointPurchaseCTV}
                        required={checkRequired.pointPurchaseCTV}
                        checkedShowForm={checkShowForm.pointPurchaseCTV}
                        onKeyDown={blockStringSpecial}
                      />
                      <TextField
                        disabled={!roleListEdit}
                        onKeyDown={blockStringSpecial}
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
                        onChange={e => this.handleChangeCampaign(e, 'note')}
                        label={config && config.note && config.note.title}
                        // type={config.note.type}
                        error={localMessages && localMessages.note}
                        helperText={localMessages && localMessages.note}
                        required={checkRequired.note}
                        checkedShowForm={checkShowForm.note}
                      />
                      <CustomGroupInputField
                        disabled={!roleListEdit}
                        code="crmCampaign"
                        columnPerRow={3}
                        value={this.state.others}
                        onChange={value => {
                          this.setState({
                            ...this.state,
                            others: value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              ) : null}
            </TabContainer>

            <TabContainer>
              {roleAllocationView ? (
                <GridUI container item md={12} spacing={32}>
                  <GridUI item md={3}>
                    <VerticalDepartmentTreeTwo
                      disabled={!roleAllocationEdit}
                      departments={allDepartment}
                      allocation={this.state.allocation}
                      onChange={depart => {
                        try {
                          const { organizationUnitId, manageEmployeeId, ...rest } = this.state.advanceSearchQuery;
                          const newQuery = {
                            ...rest,
                          };
                          if (depart && depart._id) {
                            if (depart.username) {
                              newQuery.manageEmployeeId = depart._id;
                            } else {
                              newQuery.organizationUnitId = depart._id;
                            }
                          }
                          this.setState({ advanceSearchQuery: newQuery });
                        } catch (error) {
                          console.log('errr', error);
                        }
                      }}
                    />
                  </GridUI>
                  <GridUI item md={9}>
                    {id === 'add' ? (
                      <ListAsync
                        deleteOption="BusinessOpportunities"
                        deleteUrl={`${API_BOS}/remove-more`}
                        apiUrl={`${API_BOS}`}
                        code="BusinessOpportunities"
                        // share
                        disableSearch
                        disableAdd
                        disableViewConfig
                        disableExport
                        disableImport
                        // reload={updateMultipleSuccess}
                        // filter={this.state.advanceSearchQuery}
                        filter={{
                          campaign: idCampaign,
                        }}
                        mapFunction={this.mapFunctionBo}
                        kanban="ST01"
                        onSelectCustomers={this.handleChangeSelectedCustomers}
                        ref={this.refCustomer}
                        onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                      />
                    ) : (
                      // <ListAsync
                      //   deleteOption="BusinessOpportunities"
                      //   deleteUrl={`${API_BOS}/remove-more`}
                      //   apiUrl={`${API_BOS}`}
                      //   code="BusinessOpportunities"
                      //   // share
                      //   disableAdd
                      //   disableViewConfig
                      //   disableExport
                      //   onEdit={this.handleEditAdvanceClick}
                      //   disableImport
                      //   disableSearch
                      //   // reload={updateMultipleSuccess}
                      //   // filter={this.state.advanceSearchQuery}
                      //   filter={{
                      //     campaign: idCampaign,
                      //   }}
                      //   mapFunction={this.mapFunctionBo}
                      //   kanban="ST01"
                      //   onSelectCustomers={this.handleChangeSelectedCustomers}
                      //   ref={this.refCustomer}
                      // />
                      <ListAsync
                        height="630px"
                        apiUrl={API_BOS}
                        exportExcel
                        disableTodo
                        disableAdd
                        disableViewConfig
                        disableExport
                        disableImport
                        disableSearch
                        code="BusinessOpportunities"
                        kanban="ST01"
                        kanbanKey="_id"
                        withPagination
                        call={true}
                        onEdit={this.handleEditAdvanceClick}
                        filter={{
                          campaign: idCampaign,
                        }}
                        mapFunction={this.mapFunctionBo}
                        excludeDatetype="updatedAt"
                      />
                    )}
                  </GridUI>
                </GridUI>
              ) : null}
            </TabContainer>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
  handleChangeTab = (event, value) => {
    this.setState({ valueForTabs: value });
  };

  handleChangeIndex = index => {
    this.setState({ valueForTabs: index });
  };
  onLoadSuccess(customerInfo) {
    this.setState({ name: customerInfo.name });
  }

  handleChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleChangeName = name => e => {
    const rex = /^([a-zàáâãèéêếìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+)$/i;
    const value = e.target.value.toLowerCase();
    const errorName = !rex.test(value);
    this.setState({ [name]: e.target.value, errorName });
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

  onSave = () => {
    const state = this.state;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const listAtt = this.props.listAtt;
    const attributes = {};
    // Object.keys(listAtt).forEach(item => {
    //   if (this.props.addCustomerPage[item].length) attributes[item] = this.props.addCustomerPage[item];
    // });
    let data = {};
    const district = {
      districtId: state.provinceAddress.district && state.provinceAddress.district._id ? state.provinceAddress.district._id : state.provinceAddress.district && state.provinceAddress.district.districtId ? state.provinceAddress.district.districtId : null,
      name: state.provinceAddress.district && state.provinceAddress.district.name ? state.provinceAddress.district.name : '',
      code: state.provinceAddress.district && state.provinceAddress.district.id ? state.provinceAddress.district.id : state.provinceAddress.district && state.provinceAddress.district.code ? state.provinceAddress.district.code : '',
    };
    const province = {
      provinceId: state.provinceAddress.province && state.provinceAddress.province._id ? state.provinceAddress.province._id : state.provinceAddress.province && state.provinceAddress.province.provinceId ? state.provinceAddress.province.provinceId : null,
      name: state.provinceAddress.province && state.provinceAddress.province.name ? state.provinceAddress.province.name : '',
      code: state.provinceAddress.province && state.provinceAddress.province.code ? state.provinceAddress.province.code : '',
    };
    const joins =
      Array.isArray(state.joins) &&
      state.joins.map(item => {
        return {
          customerId: item._id,
          code: item.code,
          name: item.name,
        };
      });
    if (id === 'add') {
      data = {
        image: state.image,
        others: state.others,
        active: state.active,
        // code: state.code,
        name: state.name,
        avatar: state.avatar,
        // owner: {
        //   name: state.owner && state.owner.name,
        //   ownerId: state.owner && state.owner._id,
        // },
        parentId: state.parentId && state.parentId._id,
        productGroup: state.productGroup,
        typeCampaign: state.typeCampaign,
        startDate: state.startDate,
        endDate: state.endDate,
        phoneNumber: state.phoneNumber,
        appUsage: state.appUsage,
        channel: state.channel,

        // createdBy: this.props.profile.code,
        // updatedBy: this.props.profile.code,
        configOthers: state.configOthers,
        downloadReferrals: state.downloadReferrals,
        note: state.note,
        // amountCustomer: state.amountCustomer,
        averageOrder: state.averageOrder,
        campaignStatus: state.campaignStatus,
        conversionRate: state.conversionRate,
        costPerContact: state.costPerContact,

        unintended: state.unintended,
        serviceSales: state.serviceSales,
        DSCP: parseInt(state.DSCP),
        contactCenter: state.contactCenter && state.contactCenter._id,
        allocation: state.allocation,
        pointCustomer: state.pointCustomer,
        pointPresenter: state.pointPresenter,
        pointApp: state.pointApp,
        pointSell: state.pointSell,
        pointPurchase: state.pointPurchase,
        pointAppCTV: state.pointAppCTV,
        pointSellCTV: state.pointSellCTV,
        pointPurchaseCTV: state.pointPurchaseCTV,
        sendEmail: state.sendEmail ? state.sendEmail : false,
        sendSMS: state.sendSMS ? state.sendSMS : false,
        province: province,
        district: district,
        serviceCharge: state.serviceCharge,
        amount2Reward: state.amount2Reward,
        voucherCode: state.voucherCode,
        amountVoucher: state.amountVoucher,
        amountJoin: state.amountJoin,
        amountProduct: state.amountProduct,
        products: state.products,
        revolvingProduct: state.revolvingProduct,
      };
    } else {
      data = {
        others: state.others,
        image: state.image,
        avatar: state.avatar,
        active: state.active,
        code: state.code,
        name: state.name,
        owner: {
          name: state.owner && state.owner.name,
          ownerId: state.owner && state.owner.ownerId,
        },
        parentId: state.parentId && state.parentId._id,
        productGroup: state.productGroup,
        typeCampaign: state.typeCampaign,
        startDate: state.startDate,
        endDate: state.endDate,
        phoneNumber: state.phoneNumber,
        appUsage: state.appUsage,
        channel: state.channel,
        updatedBy: this.props.profile.code,
        configOthers: state.configOthers,
        downloadReferrals: state.downloadReferrals,
        note: state.note,
        amountCustomer: state.amountCustomer,
        averageOrder: state.averageOrder,
        campaignStatus: state.campaignStatus,
        conversionRate: state.conversionRate,
        costPerContact: state.costPerContact,

        unintended: state.unintended,
        serviceSales: state.serviceSales,
        DSCP: parseInt(state.DSCP),
        contactCenter: state.contactCenter && state.contactCenter._id,
        allocation: state.allocation,
        pointCustomer: state.pointCustomer,
        pointPresenter: state.pointPresenter,
        pointApp: state.pointApp,
        pointSell: state.pointSell,
        pointPurchase: state.pointPurchase,
        pointAppCTV: state.pointAppCTV,
        pointSellCTV: state.pointSellCTV,
        pointPurchaseCTV: state.pointPurchaseCTV,
        sendEmail: state.sendEmail ? state.sendEmail : false,
        sendSMS: state.sendSMS ? state.sendSMS : false,
        province: province,
        district: district,
        serviceCharge: state.serviceCharge,
        amount2Reward: state.amount2Reward,
        voucherCode: state.voucherCode,
        amountVoucher: state.amountVoucher,
        amountProduct: state.amountProduct,
        amountJoin: state.amountJoin,
        products: state.products,
        revolvingProduct: state.revolvingProduct,
        joins: joins,
      };
    }
    const messages = viewConfigCheckForm('crmCampaign', dot.dot(data));
    // if (messages === {}) {
    //   if (id === 'add') {
    //     this.props.postCampaign(data);
    //   } else this.props.putCampaign(id, data);
    // } else {
    //   this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    // }
    if (this.state.name === '' && this.state.endDate === '') {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Không được để trống tên CHIẾN DỊCH, Không được để trống NGÀY KẾT THÚC ',
        variant: 'error',
      });
      return;
    }
    if (this.state.name === '' && this.state.endDate !== '') {
      this.props.onChangeSnackbar({ status: true, message: 'Không được để trống tên CHIẾN DỊCH', variant: 'error' });
      return;
    }
    if (this.state.endDate === '' && this.state.name !== '') {
      this.props.onChangeSnackbar({ status: true, message: 'Không được để trống NGÀY KẾT THÚC', variant: 'error' });
      return;
    }
    if (new Date(state.startDate) >= new Date(state.endDate)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu', variant: 'error' });
      return;
    }

    if (Object.keys(messages).length === 0) {
      if (id === 'add') {
        this.setState({ load: true });
        this.props.postCampaign(data);
      } else {
        this.setState({ load: true });
        this.props.putCampaign(id, data);
      }
    } else {
      const allMessages = Object.values(this.state.localMessages).join(', ');
      // this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }

    // this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
  };

  CloseCustomer = () => {
    this.props.callback('close');
  };

  // onSelectImg = e => {
  //   const urlAvt = URL.createObjectURL(e.target.files[0]);
  //   this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] });
  // };

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

AddCampaignPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addCampaignPage: makeSelectAddCampaignPage(),
  dashboardPage: makeSelectDashboardPage(),

  listAtt: makeSelectlistAtt(),
  addProjects: makeSelectAddProjects(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInfo: id => dispatch(getInfo(id)),
    postCampaign: data => dispatch(postCampaign(data)),
    mergeData: data => dispatch(mergeData(data)),
    putCampaign: (id, data) => dispatch(putCampaign(id, data)),
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addCampaignPage', reducer });
const withSaga = injectSaga({ key: 'addCampaignPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddCampaignPage);
