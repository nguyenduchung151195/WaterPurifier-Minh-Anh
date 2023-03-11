/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddProjects
 *
 */

import React, { createRef, useRef } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import CustomMap from 'components/Map';

import {
  NetworkLocked,
  Group,
  GroupAdd,
  PersonAddDisabled,
  Update,
  AddPhotoAlternate,
  SwapHoriz,
  VisibilityOffRounded,
  GpsFixed,
} from '@material-ui/icons';
import {
  MenuItem,
  Button,
  TableRow,
  TableCell,
  TableHead,
  Table,
  TableBody,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  Checkbox,
  Menu,
  Avatar,
  AppBar,
  Toolbar,
  withStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  IconButton,
  Input,
} from '@material-ui/core';
import { Close, Add } from '@material-ui/icons';
import { Editor, EditorTools, EditorUtils, EditorToolsSettings } from '@progress/kendo-react-editor';
import Buttons from 'components/CustomButtons/Button';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
import ReactGoogleMap from 'react-google-map';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import { supplierColumns, progressColumns, historyColumns, showMap, taskStatusArr, taskStageArr, clientId } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import locationIcon from '../../images/location.png';
import { API_HISTORY, API_KEY } from '../../config/urlConfig';
import cover from '../../assets/img/task/task_cover_01.jpg';
import cover2 from '../../assets/img/task/task_cover_02.jpg';
import cover3 from '../../assets/img/task/task_cover_03.jpg';
import cover4 from '../../assets/img/task/task_cover_04.jpg';
import CustomAppBar from 'components/CustomAppBar';

import {
  API_PROGRESS,
  API_TRANFER,
  GET_CONTRACT,
  API_TASK_PROJECT,
  API_CUSTOMERS,
  API_USERS,
  API_SAMPLE_PROCESS,
  API_CONVERSATION,
  API_APPROVE_GROUPS,
  API_DISPATCH,
  API_MEETING,
  GET_TASK_CONTRACT,
  API_ASSET,
  API_BOS,
} from '../../config/urlConfig';
import {
  mergeData,
  handleChange,
  postProject,
  getProjectCurrent,
  putProject,
  putProgress,
  postTranfer,
  postFile,
  putRatio,
  getData,
  postApprove,
  getEmployee,
} from './actions';

import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Dialog,
  Comment,
  ProgressBar,
  AsyncAutocomplete,
  FileUpload,
  SwipeableDrawer,
  Loading,
} from '../../components/LifetekUi';
import TextFieldCode from '../../components/TextFieldCode';

import makeSelectAddProjects from './selectors';
import { changeSnackbar } from '../Dashboard/actions';
import { getConversation } from '../Conversation/actions';
import reducer from './reducer';
import saga from './saga';
import './style.css';
import messages from './messages';
import { makeSelectProfile, makeSelectSocket, makeSelectMiniActive } from '../Dashboard/selectors';
import makeSelectDashboardPage from '../Dashboard/selectors';
import makeSelectTotalTask from '../TotalTask/selectors';
import {
  convertTree,
  taskPrioty,
  priotyColor,
  getDatetimeLocal,
  toVietNamDate,
  totalArray,
  taskTypeVoucher,
  taskTransport,
  taskTypeTransport,
} from '../../helper';
import Breadcrumbs from '../../components/LifetekUi/Breadcrumbs';
import { provincialColumns } from '../../variable';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigCheckForm, canUpdateTaskPlan } from 'utils/common';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import { mergeData as MergeData } from '../Dashboard/actions';
const stylePaper = {
  paperFullScreen: { marginLeft: 250 },
  flex: {
    flex: 1,
  },
  root: {
    width: 500,
  },
  customStepper: {
    color: 'var(--kanban-color) !important',
  },
};

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ForeColor,
  BackColor,
  CleanFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  NumberedList,
  BulletedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link: EditorLink,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  InsertFile,
  SelectAll,
  Print,
  Pdf,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

/* eslint-disable react/prefer-stateless-function */
function KanbanStep(props) {
  const { kanbanStatus, id } = props;
  let checkStatus = false;
  // eslint-disable-next-line eqeqeq
  const idx = props.currentStatus.findIndex(i => i.type == kanbanStatus);
  // const idxRef = useRef(idx);
  // if (idxRef.current === 5 || idxRef.current === 7) {
  //   checkStatus = true;
  // } else {
  //   checkStatus = false;
  // }
  return (
    <>
      {id !== 'add' && (kanbanStatus === '6' || kanbanStatus === '8') ? (
        <Stepper style={{ background: 'transparent' }} activeStep={idx}>
          {props.currentStatus.map((item, index) => {
            return (
              <Step>
                <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      ) : (
        <Stepper style={{ background: 'transparent' }} activeStep={idx}>
          {props.currentStatus.map((item, index) => {
            return (
              <Step onClick={() => props.handleStepper(item)} key={item.type}>
                <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
    </>
  );
}

function TaskType(props) {
  return (
    <div>
      <Typography style={{ fontSize: '20px', fontWeight: 'bold' }}>{props.title}</Typography>
      <div
        className="task-type"
        onClick={props.hanldeClick}
        style={{
          background: props.background,
        }}
      >
        {props.icon}
      </div>
      <Typography className="task-type-description">{props.description}</Typography>
    </div>
  );
}

function People({ people, planPeople }) {
  if (!people) return null;
  const leng = people.length;
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (
    <React.Fragment>
      {people.filter(i => Boolean(i)).map(
        (person, index) =>
          index === leng - 1 ? (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>
            </span>
          ) : (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>,{' '}
            </span>
          ),
      )}

      <VisibilityOffRounded onClick={e => setAnchorEl(e.currentTarget)} style={{ fontSize: '0,5rem', marginLeft: 5 }} />
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
        {planPeople.map(i => (
          <MenuItem>
            <Avatar style={{ width: 25, height: 25 }} src={i.avatar} />
            <span style={{ color: people.map(it => it._id).includes(i._id) ? 'transparent' : 'red' }}>{i.name}</span>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

function TypographyDetail({ children, data }) {
  return (
    <div className="task-info-detail">
      <p>{children}</p>
      <p>{data}</p>
    </div>
  );
}
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
export class AddProjects extends React.Component {
  constructor(props) {
    super(props);
    const taskColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Task').listDisplay.type.fields.type.columns;
    const names = {};
    taskColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const checkRequired = {};
    taskColumns.forEach(item => {
      checkRequired[item.name] = item.checkedRequireForm;
    });
    const checkShowForm = {};
    taskColumns.forEach(item => {
      checkShowForm[item.name] = item.checkedShowForm;
    });
    const myCover = [cover, cover2, cover3, cover4];
    const randCover = myCover[Math.floor(Math.random() * myCover.length)];
    this.editor = createRef();
    const listCrmStatus = JSON.parse(localStorage.getItem('taskStatus'));
    const currentStatus = listCrmStatus ? listCrmStatus.find(i => i.code === 'KANBAN').data.sort((a, b) => a.code - b.code) : null;
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      load: false,
      checkProjectName: '',
      checkLength: '',
      checkDate: '',
      tabIndex: 0,
      tab: 0,
      openDialog: false,
      openDialogProgress: false,
      openAddProject: false,
      tabContract: 0,
      names,
      currentStatus,
      randCover,
      taskManagerRole: null,
      taskInCharge: null,
      taskSupport: null,
      taskViewable: null,
      taskJoin: null,
      taskApproved: null,
      speciall: null,
      confirmAddProjectNoCustomerOpen: false,
      checkRequired,
      checkShowForm,
      localMessages: {},
      crmSource,
      contactList: null,
      billList: null,
      bill: null,
      listAssets: null,
      checkAssets: false,
    };
    // console.log(this.state)
  }

  componentDidMount(props) {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const styleTabs = this.props.id ? true : false;
    this.setState({ styleTabs });
    this.props.getProjectCurrent(id, this.props.data);
    if (!!this.props.description && this.props.description.length > 0) {
      let str = '';
      for (let i = 0; i < this.props.description.length; i++) {
        str = `${str + this.props.description[i].name} : ${this.props.description[i].value} . `;
      }
      this.props.mergeData({ description: str });
    }
    this.props.getData();
    this.props.getEmployee();
    if (id !== 'add') {
      fetch(`${API_TASK_PROJECT}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            billList: data.billList,
            contactList: data.contactList,
            listAssets: data.assets,
            checkAssets: data.assets ? true : false,
          });

          this.props.addProjects.bill = this.props.addProjects.bill && this.props.addProjects.bill._id;
          // this.props.mergeData({ contactPerson: data.contactPerson });
        });
    }
  }
  componentWillUnmount() {
    setTimeout(() => {
      this.props.onMergeData({ hiddenHeader: false });
    }, 1);
  }
  componentDidUpdate(nextProps) {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const nextId = nextProps.id ? nextProps.id : nextProps.match.params.id;

    if (this.props.addProjects.customer !== nextProps.addProjects.customer) {
      // this.setState({
      //   billList: this.props.addProjects.billList,
      //   contactList: this.props.addProjects.contactList,
      // });
      if (this.props.addProjects) {
        if (this.props.addProjects === 'Object') {
          this.props.addProjects.bill = this.props.addProjects.bill && this.props.addProjects.bill._id;
        } else {
          this.props.addProjects.bill = this.props.addProjects.bill;
        }
      }
    }

    if (id !== nextId) {
      this.props.getProjectCurrent(id, this.props.data);
    }
  }

  componentWillReceiveProps(props) {
    if (!!props.dashboardPage.roleTask.roles && props.dashboardPage.roleTask.roles !== undefined && props.dashboardPage.roleTask.roles.length > 0) {
      this.setState({
        taskManagerRole: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'taskManager').data,
        taskInCharge: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'inCharge').data,
        taskSupport: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'support').data,
        taskViewable: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'viewable').data,
        taskJoin: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'join').data,
        taskApproved: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'approved').data,
        speciall: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'SPECIALL').data,
      });
    }
    if (props.addProjects) {
      const localMessages = viewConfigCheckForm('Task', props.addProjects);
      this.setState({
        localMessages,
      });
    }
  }

  handlecloseDrawer = () => {
    this.props.mergeData({ selectTask: true });
  };

  mapHistory = (item, index) => ({
    ...item,
    updatedBy: item.updatedBy ? item.updatedBy.name : null,
    index: index + 1,
    taskStatus: taskStatusArr[item.taskStatus - 1],
    taskId: item.taskId ? item.taskId.name : null,
    priority:
      item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
  });

  mapApproved = (item, index) => ({
    ...item,
    index: index + 1,
    taskStatus: taskStatusArr[item.taskStatus - 1],
    pheduyet:
      item.taskStatus === 3 ? (
        <Button variant="outlined" color="primary">
          Phê duyệt
        </Button>
      ) : (
        'Chờ phê duyệt'
      ),
  });

  mapProgrees = item => {
    return {
      ...item,
      ['others.note']: item.note,
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      taskStatus: taskStatusArr[item.taskStatus - 1],
    };
  };

  handleInputChange = e => {
    this.props.mergeData({ search: e.target.value, locationAddress: e.target.value });
  };

  handleSelectSuggest = suggest => {
    const lat = suggest.geometry.location.lat();
    const lng = suggest.geometry.location.lng();
    this.props.mergeData({ search: '', locationAddress: suggest.formatted_address, location: { lat, lng } });
  };

  onMarkerDragEnd = evt => {
    if (window.google) {
      // eslint-disable-next-line no-undef
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
            self.props.mergeData({
              locationAddress: formatted_address,
              location: { lat, lng },
            });
          }
        });
      });
    }
  }

  mapContract = (item, index) => ({
    ...item,
    index: index + 1,
    // eslint-disable-next-line eqeqeq
    //  typeContract: item.typeContract == 1 ? 'Hợp đồng khách hàng' : 'Hợp đồng nhà cung cấp',
    realExpense: item.amountReven,
    paymentRequest: item.amount,
    estimateExpense: item.costEstimate,
  });

  handleTabs = tabContract => {
    this.setState({ tabContract });
  };

  handleChangeName = e => {
    const rex = /^.{5,}$/;
    const errorName = !rex.test(e.target.value);
    const text = e.target.value;
    if (text.length > 0 && text.length < 5) {
      this.state.checkLength = 'TÊN CV/DA  phải có ít nhất 5 ký tự trở lên';
    } else {
      this.state.checkLength = '';
    }
    this.props.mergeData({ name: e.target.value, errorName });
  };

  handleChangeButton(tabIndex) {
    this.setState({ tabIndex }, () => {
      if (tabIndex === 1) {
        setTimeout(() => {
          if (this.editor && this.editor.view) {
            EditorUtils.setHtml(this.editor.view, this.props.addProjects.desHtml);
            // this.setState(this.editor.view, this.props.addProjects.desHtml);
          }
        }, 1000);
      }
    });
  }

  totalRatio;

  makeConversation = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addProjects, searchControl } = this.props;
    const { join, name } = addProjects;
    const newJoin = join.map(i => i._id);
    if (newJoin.length < 2) {
      alert('Không thể tạo nhóm dưới 2 thành viên');
      return;
    }
    const data = { join: newJoin, type: 1, name, id, moduleName: 'Task' };
    fetch(API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      this.props.mergeData({ hideAddConversation: true });
      this.props.getConversation();
    });
  };

  updateRatio = () => {
    if (!this.props.addProjects.projectId) {
      alert('Không thể cập nhật tỉ trọng của công việc');
      return;
    }
    const listRatio = this.props.addProjects.listRatio;

    const total = totalArray(listRatio, 0, listRatio.length, 'ratio');
    if (total > 100 || !Number.isInteger(total)) {
      alert('Tỉ trọng không được lớn hơn 100 và phải là số nguyên');
      return;
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    this.props.putRatio(id, listRatio);
  };

  selectTemplate = template => {
    if (!template) this.props.mergeData({ template: null });
    const { startDate } = this.props.addProjects;
    this.calculateEndate(startDate, template);
  };

  calculateEndate = (startDate, template) => {
    const treeData = template.treeData;
    const joinChild = convertTree(treeData, new Date(startDate), 'DATA', [], true);
    let endDate = getDatetimeLocal();
    for (let index = 0; index < treeData.length; index++) {
      const element = treeData[index];
      const start = new Date(endDate);
      const end = new Date(element.endDate);
      if (end - start > 0) endDate = element.endDate;
    }
    const newEndDate = new Date(endDate);
    this.props.mergeData({ endDate: newEndDate, template, joinChild: joinChild.joins, startDate, joinChildData: joinChild.joinsData });
  };

  onSelectImg = e => {
    const objectAvatar = URL.createObjectURL(e.target.files[0]);
    this.props.mergeData({ objectAvatar, avatar: e.target.files[0] });
  };

  // handleChangeEndDate = (name, value) => {
  //   const { addProjects } = this.props;
  //   const text = value;
  //   this.props.mergeData({ [name]: value });
  //   if(addProjects.endDate !== '' && new Date(addProjects.startDate) >= new Date(addProjects.endDate)){
  //     this.state.checkDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
  //   }else{
  //     this.state.checkDate = ''
  //   }

  // };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };
  handleChangeDate = (name, value) => {
    const { addProjects } = this.props;
    const text = value;
    if (text !== '' && new Date(addProjects.startDate) >= new Date(addProjects.endDate)) {
      this.state.checkDate = '';
    } else {
      this.state.checkDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
    }
    this.props.mergeData({ [name]: value });
  };
  handleChangeCode = name => e => {
    this.props.mergeData({ name: e.target.value, errorName });
  };
  handleDialogAdd = () => {
    this.setState({ openDialog: false });
  };

  handleDialog = () => {
    const { openDialog } = this.state;
    this.setState({ openDialog: !openDialog });
  };

  handleDialogProgress = () => {
    this.setState({
      openDialogProgress: false,
    });
  };

  handleOpenDialogProgress = () => {
    const { openDialogProgress } = this.state;
    this.setState({ openDialogProgress: !openDialogProgress });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ url: e.target.files[0] });
  };

  mapPeople(people) {
    if (!people) return null;
    return people.map(i => i.name).join();
  }

  handleStepper = item => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    this.props.mergeData({ kanbanStatus: item.type, taskStatus: item.code });
  };

  selectCurrentJoin = value => {
    this.props.mergeData({ currentJoin: value });
  };

  selectTranferJoin = value => {
    this.props.mergeData({ tranferJoin: value });
  };

  selectCurrentInCharge = value => {
    this.props.mergeData({ currentInCharge: value });
  };

  selectTranferInCharge = value => {
    this.props.mergeData({ tranferInCharge: value });
  };

  changeEndDate = startDate => {
    const { template } = this.props.addProjects;
    if (!template) {
      this.props.mergeData({ startDate });
      return;
    }
    this.calculateEndate(startDate, template);
  };

  showConfirmAddProjectNoCustomer = () => {
    this.setState({ confirmAddProjectNoCustomerOpen: true });
  };

  handleCloseAddProjectNoCustomer = () => {
    this.setState({ confirmAddProjectNoCustomerOpen: false });
  };

  handleConfirmAddProjectNoCustomer = () => {
    this.handleCloseAddProjectNoCustomer();
    this.onSave();
  };

  onSave = () => {
    const { addProjects } = this.props;
    let content = '';
    if (this.editor && this.editor.view) {
      const view = this.editor.view;
      content = EditorUtils.getHtml(view.state);
    }
    const listJoin = addProjects.joinChild.concat(addProjects.join.map(item => item._id));
    const join = [...new Set(listJoin)];
    let data = {
      billList: this.state.billList,
      businessOpportunities: addProjects.businessOpportunities ? addProjects.businessOpportunities._id : addProjects.businessOpportunities,
      assets: addProjects.assets,
      contactList: this.state.contactList,
      code: addProjects.code,
      bill: addProjects.bill,
      taskManager: addProjects.taskManager,
      inCharge: addProjects.inCharge,
      contactPerson: addProjects.contactPerson,
      typeVoucher: addProjects.typeVoucher,
      transport: addProjects.transport,
      typeTransport: addProjects.typeTransport,
      transportationStaff: addProjects.transportationStaff,
      name: addProjects.name,
      template: addProjects.template ? addProjects.template._id : null,
      description: addProjects.description,
      startDate: addProjects.startDate,
      endDate: addProjects.endDate,
      content: addProjects.content,
      // treeData,
      taskStatus: addProjects.taskStatus,
      taskStage: addProjects.taskStage,
      priority: addProjects.priority,
      customer: this.props.customerBos ? this.props.customerBos.customerId : addProjects.customer ? addProjects.customer._id : null,
      viewable: addProjects.viewable ? addProjects.viewable.map(item => item._id) : [],
      inCharge: addProjects.inCharge ? addProjects.inCharge.map(item => item._id) : [],
      // contactPerson: addProjects.contactPerson ? addProjects.contactPerson.map(item => item._id) : [],
      taskManager: addProjects.taskManager ? addProjects.taskManager.map(item => item._id) : [],
      approved: addProjects.approved ? addProjects.approved.map(item => ({ id: item.id ? item.id : item._id, name: item.name })) : [],
      // isProject: addProjects.isProject,
      isProject: false,
      kanban: addProjects.kanban,
      progress: addProjects.progress,
      file: addProjects.file,
      join,
      taskType: addProjects.taskType,
      source: addProjects.source,
      type: addProjects.type,
      planerStatus: this.props.plannerStatus,
      ratio: addProjects.ratio,
      parentId: addProjects.parentId,
      createdBy: addProjects.createdBy,
      support: addProjects.support ? addProjects.support.map(item => item._id) : [],
      kanbanStatus: addProjects.kanbanStatus,
      objectAvatar: addProjects.objectAvatar,
      avatar: addProjects.avatar,
      category: addProjects.category,
      callback: this.props.callback,
      remember: addProjects.remember,
      rememberTo: addProjects.rememberTo,
      dateRemember: addProjects.dateRemember,
      isObligatory: addProjects.isObligatory,
      // businessOpportunities: this.props.businessOpportunities ? this.props.businessOpportunities : null,
      exchangingAgreement: this.props.exchangingAgreement ? this.props.exchangingAgreement : null,
      mettingSchedule: this.props.mettingSchedule ? this.props.mettingSchedule : null,
      documentary: this.props.documentary ? this.props.documentary : null,
      order: addProjects.order,
      planApproval: addProjects.planApproval,
      acceptApproval: addProjects.acceptApproval,
      approvedProgress: addProjects.approvedProgress,
      updatedBy: addProjects.updatedBy,
      locationAddress: addProjects.locationAddress,
      provincial: addProjects.provincial,
      others: addProjects.others,
      desHtml: content,
      sourceData: addProjects.sourceData,
      geography: addProjects.geography,

      // lat: geography.lat,
      // lon: geography.lon,
      // display_name: geography.display_name,
    };
    // str G
    const customJoin = arr => (arr ? arr.map(e => e.name).join(', ') : '');
    data = {
      ...data,
      viewableStr: customJoin(addProjects.viewable),
      inChargeStr: customJoin(addProjects.inCharge),
      taskManagerStr: customJoin(addProjects.taskManager),
      approvedStr: customJoin(addProjects.approved),
      joinStr: customJoin(addProjects.joinChildData.concat(addProjects.join)),
      supportStr: customJoin(addProjects.support),
      // contactPersonStr: customJoin(addProjects.contactPerson),
    };
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    if (Object.keys(this.state.localMessages).length === 0) {
      if (id === 'add') {
        this.setState({ load: true });
        this.props.postProject(data);
      } else {
        this.setState({ load: true });
        this.props.putProject(data, id);
      }
    } else {
      const allMessages = Object.values(this.state.localMessages).join(', ');
      this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
    }
  };

  handleSaveProject = () => {
    const { addProjects } = this.props;
    const { endDate, approvedProgress, customer } = addProjects;
    // if (!endDate) return;
    if (new Date(addProjects.startDate) >= new Date(addProjects.endDate)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu', variant: 'error' });
      return;
    }
    if (this.state.checkLength !== '') {
      this.props.onChangeSnackbar({ status: true, message: 'TÊN CV/DA phải có ít nhất 5 ký tự trở lên', variant: 'error' });
      return;
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (!customer && id === 'add') {
      return this.showConfirmAddProjectNoCustomer();
    }
    this.props.checkSuccess && this.props.checkSuccess(true);
    this.onSave();
  };

  onCloseProject = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
  };

  onSaveProgress = () => {
    const { addProjects } = this.props;
    if (addProjects.selectNote === '') {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Ghi chú không được bỏ trống',
        variant: 'warning',
      });
      return;
    }
    // debugger;
    const selectedTaskId = addProjects.idSelect;
    // const id = addProjects.projectId !== '' ? addProjects.projectId : addProjects.idSelect;
    const data = {
      taskId: selectedTaskId,
      taskStatus: addProjects.selectStatus,
      priority: addProjects.selectPiority,
      progress: addProjects.selectProgress * 1,
      note: addProjects.selectNote,
      callback: this.props.callback,
    };
    this.props.putProgress(data, selectedTaskId);
    this.setState({ openDialogProgress: false });
  };

  onSaveTranfer = () => {
    const { addProjects } = this.props;
    const id = addProjects._id;
    const data = {
      type: addProjects.typeTranfer,
    };

    if (addProjects.typeTranfer === 2) {
      if (!addProjects.tranferJoin.length && !addProjects.currentJoin.length) return;
      data.tranferEmployees = addProjects.tranferJoin.map(item => item._id);
      data.currentEmployees = addProjects.currentJoin.map(item => item._id);
    } else {
      if (!addProjects.tranferInCharge.length && !addProjects.currentInCharge.length) return;
      data.currentEmployees = addProjects.currentInCharge.map(item => item._id);
      data.tranferEmployees = addProjects.tranferInCharge.map(item => item._id);
    }

    this.props.postTranfer(data, id, null);
    // this.props.getDefaultProjectId(id);
  };

  // Tính toán disable trạng thái
  caculeDisable = value => {
    const { smallest, parentStatus, selectStatus } = this.props.addProjects;
    if ((selectStatus === 3 || selectStatus === 4 || selectStatus === 6) && selectStatus !== value) return true;
    if ([4, 5, 6].includes(parentStatus)) return true;
    if (value === 1) return true;
    if (selectStatus === 3 && value === 2 && !smallest) return true;
    return false;
  };

  selectTask = e => {
    const idSelect = e.target.value;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { projects } = this.props.addProjects;
    const check = projects.findIndex(item => item.parentId === idSelect);

    const data = { ...projects.find(item => item._id === idSelect) };

    const displayProgress = check === -1 && data.taskStatus === 2;
    let parentStatus;
    if (id === idSelect) parentStatus = this.props.addProjects.parentId ? this.props.addProjects.parentId.taskStatus : null;
    else {
      const parent = projects.find(item => data.parentId === item._id);
      parentStatus = parent ? parent.taskStatus : null;
    }
    this.props.mergeData({
      idSelect,
      selectPiority: data.priority,
      selectProgress: data.progress,
      selectStatus: data.taskStatus,
      displayProgress,
      parentStatus,
      smallest: check === -1,
    });
  };

  changeRatio = (index, value) => {
    const listRatio = this.props.addProjects.listRatio.map((it, idx) => (idx === index ? { ...it, ratio: value } : it));
    this.props.mergeData({ listRatio });
  };

  changeCostEstimate = (index, value) => {
    const listRatio = this.props.addProjects.listRatio.map((it, idx) => (idx === index ? { ...it, costEstimate: value } : it));
    this.props.mergeData({ listRatio });
  };

  changeTaskStatus = e => {
    const selectStatus = e.target.value;
    const { projects, idSelect } = this.props.addProjects;
    // Kiểm tra xem có phải cv nhỏ nhất không
    const check = projects.findIndex(item => item.parentId === idSelect);
    const displayProgress = check === -1 && selectStatus === 2;
    this.props.mergeData({ selectStatus, displayProgress });
  };

  onSaveFile = () => {
    const { url } = this.props.addProjects;
    this.props.postFile(url);
    this.setState({ openDialog: false });
  };

  handleChangeApproved(e, name) {
    const approvedObj = { ...this.props.addProjects.approvedObj };
    approvedObj[name] = e.target.value;
    this.props.mergeData({ approvedObj });
  }

  handleAddApprovedGroup = value => {
    const approvedObj = { ...this.props.addProjects.approvedObj };
    approvedObj.group = value;
    this.props.mergeData({ approvedObj });
  };

  saveApprove = () => {
    const { approvedObj, templates, projects } = this.props.addProjects;
    const exsist = templates.find(i => String(i._id) === String(approvedObj.form));
    let content = '';
    let dynamicForm = '';
    if (exsist) {
      content = exsist.content;
      dynamicForm = exsist._id;
    }
    if (approvedObj.group === null) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Bạn phải nhập nhóm phê duyệt',
        variant: 'warning',
      });
    }

    if (approvedObj.form === '') {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Bạn phải chọn biểu mẫu',
        variant: 'warning',
      });
    }

    const groupInfo = [];
    approvedObj.group.group.forEach(item => {
      groupInfo.push({
        order: item.order,
        person: item.person,
        approve: 0,
        reason: '',
      });
    });
    const itemCurrent = projects.find(item => item);

    const data = {
      name: approvedObj.name,
      subCode: approvedObj.subCode,
      collectionCode: 'Task',
      content,
      dataInfo: itemCurrent,
      dynamicForm,
      convertMapping: '5d832729c252b2577006c5ab',
      approveGroup: approvedObj.group._id,
      groupInfo,
      clientId,
    };
    this.props.postApprove(data);
    this.props.mergeData({
      anchorElMenu: null,
      openApproved: false,
      approvedObj: {
        name: '',
        subCode: 'Task',
        form: '',
        group: null,
      },
    });
  };

  handleCustomer = value => {
    const { employeesData } = this.props.addProjects;
    const newEmploy = employeesData.filter(item => item.type === value.type);

    // this.props.mergeData({ customer: value, join: newEmploy, inCharge: newEmploy, taskManager: newEmploy });
    this.props.mergeData({ customer: value, errorCustomer: value ? false : true });
  };
  employeeOptionLabel = option => {
    const code = option.code ? option.code : '';
    const customerName = option.name ? option.name : '';
    if (customerName || code) {
      return `${code} - ${customerName}`;
    }
    return '';
  };
  handleChangeCodeCustomer = value => {
    // this.setState({
    //   contactList: value ? value.detailInfo.represent.localPersonInfo : [],
    // });
    this.setState({
      bill: '',
      contactPerson: '',
      contactList: [],
      billList: [],
    });

    this.props.mergeData({ bill: null });
    this.props.mergeData({ contactPerson: '' });

    if (value) {
      const contactLists = value.detailInfo.represent.localPersonInfo;
      this.setState({
        contactList: [
          ...contactLists,
          {
            _id: '',
            name: value ? value.name : null,
            phoneNumber: value ? value.phoneNumber : null,
            email: '',
          },
        ],
      });
      const billLists = value.bill;
      this.setState({
        billList: billLists,
      });
    }
    this.props.mergeData({ customer: value });
  };
  mapFunctionDocument = item => {
    const { crmSource } = this.state;
    const typeDocumentArr = crmSource.find(elm => elm.code === 'S19').data;
    const urgencyArr = crmSource.find(elm => elm.code === 'S20').data;
    const whereArr = crmSource.find(elm => elm.code === 'S23').data;
    const storageArr = crmSource.find(elm => elm.code === 'S22').data;
    const densityArr = crmSource.find(elm => elm.code === 'S21').data;

    return {
      ...item,
      task: item['task.name'],
      receiverSign: item['receiverSign.name'],
      viewer: item['viewerName'],
      replyDispatch: item['replyDispatch.name'],
      type: item.type === '2' ? 'Công văn đến' : 'Công văn đi',
      typeDocument: typeDocumentArr.find(elm => elm.value === item.typeDocument)
        ? typeDocumentArr.find(elm => elm.value === item.typeDocument).title
        : item.typeDocument,
      urgency: urgencyArr.find(elm => elm.value === item.urgency) ? urgencyArr.find(elm => elm.value === item.urgency).title : item.urgency,
      where: whereArr.find(elm => elm.value === item.where) ? whereArr.find(elm => elm.value === item.where).title : item.where,
      storage: storageArr.find(elm => elm.value === item.storage) ? storageArr.find(elm => elm.value === item.storage).title : item.storage,
      density: densityArr.find(elm => elm.value === item.density) ? densityArr.find(elm => elm.value === item.density).title : item.density,
    };
  };
  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null;
    if (dataRender) return dataRender.data.map(element => <MenuItem value={element.title}>{element.title}</MenuItem>);
    return null;
  };
  mapFunctionCalendar = item => ({
    ...item,
    typeCalendar: item.typeCalendar === '1' ? 'Lịch họp' : 'Lịch công tác',
    organizer: item['organizer.name'],
    task: item['task.name'],
    roomMetting: item['roomMetting.name'],
    approved: item['approved.name'],
  });
  render() {
    // console.log('this.props', this.props.data);
    // console.log('isproject', this.props.data.isProject);
    // console.log('a', this.state.localMessages);
    const provincial1 = ['Quận Cầu Giấy', 'Quận Hai Bà Trưng'];
    const {
      tabIndex,
      tab,
      openDialogProgress,
      openAddProject,
      tabContract,
      names,
      currentStatus,
      randCover,
      checkRequired,
      checkShowForm,
      localMessages,
      // taskManagerRole,
      // taskInCharge,
      // taskSupport,
      // taskViewable,
      // taskJoin,
      // taskApproved,
      // speciall,
    } = this.state;
    const { addProjects, intl, profile, dashboardPage, miniActive } = this.props;
    // console.log('name', this.state.names);
    const { currentUser } = dashboardPage;
    const {
      isProject,
      employees,
      selectTask,
      employeesData,
      hideAddConversation,
      taskStage,
      listRatio,
      isObligatory,
      approvedObj,
      templates,
      parentId,
      projectName,
      projectId,
      code,
    } = addProjects;
    let { cityCircle } = addProjects;

    const bussines =
      this.props.dashboardPage &&
      this.props.dashboardPage.roleTask &&
      this.props.dashboardPage.roleTask.roles &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    const speciall =
      this.props.dashboardPage &&
      this.props.dashboardPage.roleTask &&
      this.props.dashboardPage.roleTask.roles &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'SPECIALL').data;

    const obligate = this.props.dashboardPage.roleTask.roles ? this.props.dashboardPage.roleTask.roles.find(item => item.code === 'SPECIALL') : null;
    const roleModuleObligate = obligate && obligate.data ? obligate.data : [];
    const roleModuleObligateData = roleModuleObligate.find(elm => elm.name === 'obligate')
      ? roleModuleObligate.find(elm => elm.name === 'obligate').data
      : null;

    const roleCodeCalendar = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Calendar');
    const roleModuleCalendar = roleCodeCalendar && roleCodeCalendar.methods ? roleCodeCalendar.methods : [];

    const roleCodeDocumentary = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Documentary');
    const roleModuleDocumentary = roleCodeDocumentary && roleCodeDocumentary.methods ? roleCodeDocumentary.methods : [];
    const taskManagerRole = bussines && bussines.find(elm => elm.name === 'taskManager').data;
    const taskInCharge = bussines && bussines.find(elm => elm.name === 'inCharge').data;
    const taskSupport = bussines && bussines.find(elm => elm.name === 'support').data;
    const taskViewable = bussines && bussines.find(elm => elm.name === 'viewable').data;
    const taskJoin = bussines && bussines.find(elm => elm.name === 'join').data;
    const taskApproved = bussines && bussines.find(elm => elm.name === 'approved').data;
    const taskCreatedBy = bussines && bussines.find(elm => elm.name === 'createdBy') && bussines.find(elm => elm.name === 'createdBy').data;
    const taskOthers = bussines && bussines.find(elm => elm.name === 'others') && bussines.find(elm => elm.name === 'others').data;
    let isTaskManager =
      profile && profile._id && addProjects && Array.isArray(addProjects.taskManager) && addProjects.taskManager.find(t => t._id === profile._id)
        ? true
        : false;
    let isInCharge =
      profile && profile._id && addProjects && Array.isArray(addProjects.inCharge) && addProjects.inCharge.find(t => t._id === profile._id)
        ? true
        : false;
    let isSupport =
      profile && profile._id && addProjects && Array.isArray(addProjects.support) && addProjects.support.find(t => t._id === profile._id)
        ? true
        : false;
    let isViewable =
      profile && profile._id && addProjects && Array.isArray(addProjects.viewable) && addProjects.viewable.find(t => t._id === profile._id)
        ? true
        : false;
    let isJoin =
      profile && profile._id && addProjects && Array.isArray(addProjects.join) && addProjects.join.find(t => t._id === profile._id) ? true : false;
    let isCreatedBy = profile && profile._id && addProjects && addProjects.createdBy && addProjects.createdBy._id === profile._id ? true : false;

    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const avt = addProjects.objectAvatar || addProjects.avatar || randCover;
    const nameTask = parentId ? projectName : addProjects.name;
    const idTask = parentId ? projectId : id;
    const uploadFilePermission =
      (!!taskManagerRole && taskManagerRole.uploadFile === true && isTaskManager) ||
      (!!taskInCharge && taskInCharge.uploadFile === true && isInCharge) ||
      (!!taskJoin && taskJoin.uploadFile === true && isJoin) ||
      (!!taskSupport && taskSupport.uploadFile === true && isSupport) ||
      (!!taskViewable && taskViewable.uploadFile === true && isViewable) ||
      (!!taskCreatedBy && taskCreatedBy.uploadFile === true && isCreatedBy) ||
      (!!taskOthers && taskOthers.uploadFile === true);
    const deleteFilePermission =
      (!!taskManagerRole && taskManagerRole.deleteFile === true && isTaskManager) ||
      (!!taskInCharge && taskInCharge.deleteFile === true && isInCharge) ||
      (!!taskJoin && taskJoin.deleteFile === true && isJoin) ||
      (!!taskSupport && taskSupport.deleteFile === true && isSupport) ||
      (!!taskViewable && taskViewable.deleteFile === true && isViewable) ||
      (!!taskCreatedBy && taskCreatedBy.deleteFile === true && isCreatedBy) ||
      (!!taskOthers && taskOthers.deleteFile === true);
    const ButtonUI = props => (
      <Buttons onClick={() => this.handleChangeButton(props.tabIndex)} color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    const goBack1 = () => {
      this.props.history.goBack();
    };

    let dayDiff = new Date(addProjects.endDate) - new Date();
    if (!dayDiff) dayDiff = 1;
    const day = Math.abs(dayDiff / 86400000);
    const hours = Math.abs((dayDiff % 86400000) / 3600000);
    const dayProgress =
      ((new Date() - new Date(addProjects.startDate)) * 100) / (new Date(addProjects.endDate) - new Date(addProjects.startDate)).toFixed();

    let fillColor = dayDiff > 0 ? 'blue' : 'red';
    if (addProjects.taskStatus === 3) fillColor = 'green';
    const general = () => {
      return (
        <Grid className="helloCVDA" style={{ padding: '0 20px', width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
          <div item md={12} style={{ width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
            {this.state.load === true ? <Loading /> : null}
            <CustomAppBar
              // className
              // isTask={id === 'add' ? true : false}
              title={
                id === 'add'
                  ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
              }
              onGoBack={() => {
                if (this.props.onClose) {
                  return this.props.onClose();
                }

                // !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                {
                  id === 'add' ? null : !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                }
                {
                  id === 'add' ? (this.props.closeAddTask !== undefined ? this.props.closeAddTask() : this.onCloseProject()) : null;
                }
                // this.props.closeAddTask !== undefined ? this.props.closeAddTask() : goBack();
              }}
              onSubmit={this.handleSaveProject}
              hideClose={this.props.hideClose}
            />
          </div>
          <Grid item container spacing={8} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item md={12} style={{ marginTop: id === 'add' ? 50 : 0 }}>
              <KanbanStep id={id} handleStepper={this.handleStepper} kanbanStatus={addProjects.kanbanStatus} currentStatus={currentStatus} />
            </Grid>

            <Grid item md={6} style={{ zIndex: 0 }}>
              <Typography variant="h5">Thông tin chính</Typography>
              <CustomInputBase
                error={(localMessages && localMessages.name) || this.state.checkLength}
                helperText={(localMessages && localMessages.name) || this.state.checkLength}
                required={checkRequired.name}
                checkedShowForm={checkShowForm.name}
                fullWidth
                label={names.name}
                onChange={this.handleChangeName}
                value={addProjects.name}
                name="name"
                onKeyDown={blockStringSpecial}
              />
              {/* {id === 'add' ? (
                <TextFieldCode
                  value={addProjects.code}
                  fullWidth
                  name="code"
                  label={names.code}
                  code={14}
                  onChange={e => this.handleChange('code', e.target.value)}
                />
              ) : (
                <TextFieldCode value={addProjects.code} fullWidth name="code" label={names.code} />
              )} */}
              {clientId === 'MIPEC' ? null : (
                <TextField
                  value={addProjects.provincial}
                  fullWidth
                  select
                  name="provincial"
                  onChange={e => this.handleChange('provincial', e.target.value)}
                  label="Khu vực"
                  // required={checkRequired.provincial}
                  InputLabelProps={{ shrink: true }}
                >
                  {provincial1.map(item => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </TextField>
              )}

              {showMap ? (
                <CustomMap
                  onSelect={latlng => {
                    const dt = {
                      lat: latlng.lat,
                      lng: latlng.lng,
                    };
                    this.handleChange('geography', dt);
                  }}
                  zoom={12}
                />
              ) : null}

              {/* <ReactGoogleMapLoader
                params={{
                  key: API_KEY,
                  libraries: 'places,geocode',
                }}
                render={googleMaps =>
                  googleMaps && (
                    <div>
                      <ReactGooglePlacesSuggest
                        autocompletionRequest={{ input: addProjects.search }}
                        googleMaps={googleMaps}
                        onSelectSuggest={this.handleSelectSuggest}
                      >
                        <Input
                          // className="input phone"
                          // floatingLabelText="Vị trí"
                          placeholder="Địa chỉ"
                          type="text"
                          ref={ref => {
                            this.desc = ref;
                          }}
                          style={{ marginTop: 20, marginBottom: 20 }}
                          value={addProjects.locationAddress}
                          // floatingLabelStyle={styles.label}
                          // floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                          onChange={this.handleInputChange}
                          fullWidth
                          endAdornment={
                            <InputAdornment position="end" onClick={this.handleClickCurrentLocation}>
                              <IconButton aria-label="Tìm địa điểm">{addProjects.locationAddress ? <GpsFixed /> : ''}</IconButton>
                            </InputAdornment>
                          }
                        />
                      </ReactGooglePlacesSuggest>
    
                      <div style={{ height: '300px' }}>
                        <ReactGoogleMap
                          googleMaps={googleMaps}
                          center={addProjects.location}
                          zoom={addProjects.zoom}
                          coordinates={[
                            {
                              title: 'Vị trí của bạn',
                              icon: locationIcon,
                              draggable: true,
                              position: addProjects.location,
                              // eslint-disable-next-line no-shadow
                              onLoaded: (googleMaps, map, marker) => {
                                // vòng vị trí
                                if (Object.entries(cityCircle).length === 0) {
                                  cityCircle = new googleMaps.Circle({
                                    strokeColor: '#57aad7',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 1,
                                    fillColor: '#69c0ef',
                                    fillOpacity: 0.35,
                                    map,
                                    center: addProjects.location,
                                    radius: 50,
                                  });
                                } else {
                                  cityCircle.setMap(map);
                                  cityCircle.setCenter(addProjects.location);
                                }
    
                                // hiển thị market ra giữa map
                                map.panTo(addProjects.location);
    
                                // Set Marker animation
                                // marker.setAnimation(googleMaps.Animation.BOUNCE)
    
                                // Define Marker InfoWindow
                                const infoWindow = new googleMaps.InfoWindow({
                                  content: `
                                      <div>
                                        <h5>${addProjects.locationAddress}<h5>
                                      </div>
                                    `,
                                });
    
                                //  OpenInfoWindow when Marker will be clicked
                                googleMaps.event.addListener(marker, 'click', () => {
                                  infoWindow.open(map, marker);
                                });
    
                                // Change icon when Marker will be hovered
                                googleMaps.event.addListener(marker, 'mouseover', () => {
                                  marker.setIcon(locationIcon);
                                });
    
                                googleMaps.event.addListener(marker, 'mouseout', () => {
                                  marker.setIcon(locationIcon);
                                });
    
                                googleMaps.event.addListener(marker, 'dragend', event => {
                                  this.onMarkerDragEnd(event);
                                  if (Object.entries(cityCircle).length !== 0) {
                                    cityCircle.setMap(null);
                                  }
                                });
                                // Open InfoWindow directly
                                // infoWindow.open(map, marker);
                              },
                            },
                          ]}
                        />
                      </div>
                    </div>
                  )
                }
              /> */}

              <Grid md={12} style={{ marginTop: 10, display: 'flex' }}>
                <Grid item md={6} style={{ marginRight: 5 }}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      invalidLabel="DD/MM/YYYY"
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      error={localMessages && localMessages.startDate}
                      helperText={localMessages && localMessages.startDate}
                      checkedShowForm={checkShowForm.startDate}
                      value={addProjects.startDate === null ? '' : addProjects.startDate}
                      variant="outlined"
                      label={names.startDate}
                      margin="dense"
                      required
                      // disabled={(!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add'}
                      onChange={this.changeEndDate}
                      style={{ width: '100%' }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6} style={{ marginLeft: 5 }}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      invalidLabel="DD/MM/YYYY"
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      error={
                        (localMessages && localMessages.endDate) ||
                        addProjects.endDate === '' ||
                        new Date(addProjects.startDate) >= new Date(addProjects.endDate)
                      }
                      helperText={
                        (localMessages && localMessages.endDate) || addProjects.endDate === ''
                          ? 'Không được để trống NGÀY KẾT THÚC'
                          : null || new Date(addProjects.startDate) >= new Date(addProjects.endDate)
                            ? 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                            : null
                      }
                      checkedShowForm={checkShowForm.endDate}
                      required
                      label={names.endDate}
                      value={addProjects.endDate}
                      name="endDate"
                      margin="dense"
                      variant="outlined"
                      // disabled={((!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add') || addProjects.template}
                      onChange={value => this.handleChange('endDate', value)}
                      style={{ width: '100%' }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                {roleModuleObligateData && roleModuleObligateData.access === true
                  ? id === 'add' && (
                      <span style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          onChange={e => this.props.mergeData({ isObligatory: e.target.checked })}
                          color="primary"
                          checked={isObligatory}
                          disabled={speciall && speciall.find(elm => elm.name === 'obligate').data.access !== true}
                        />
                        Bắt buộc tham gia
                      </span>
                    )
                  : null}
              </Grid>
              {/* {(id === 'add' || (!addProjects.hasTemplate && addProjects.isSmallest)) && (
                <React.Fragment>
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.template}
                    required={checkRequired.template}
                    checkedShowForm={checkShowForm.template}
                    error={localMessages && localMessages.template}
                    helperText={localMessages && localMessages.template}
                    onChange={this.selectTemplate}
                    url={API_SAMPLE_PROCESS}
                    value={addProjects.template}
                  />
                </React.Fragment>
              )} */}
              {/* {clientId === 'MIPEC'
                ? null
                : addProjects.isProject && (
                    <CustomInputBase
                      label={names.taskStage}
                      value={taskStage}
                      onChange={e => this.handleChange('taskStage', e.target.value)}
                      required={checkRequired.taskStage}
                      checkedShowForm={checkShowForm.taskStage}
                      error={localMessages && localMessages.taskStage}
                      helperText={localMessages && localMessages.taskStage}
                      select
                      fullWidth
                    >
                      {taskStageArr.map((it, idx) => (
                        <MenuItem value={idx + 1}>{it}</MenuItem>
                      ))}
                    </CustomInputBase>
                  )} */}
              {/* <AsyncAutocomplete
                name="Chọn khách hàng..."
                label={names.customer}
                onChange={value => this.props.mergeData({ customer: value })}
                // suggestions={customers.data}
                url={API_CUSTOMERS}
                checkedShowForm={checkShowForm.customer}
                required={checkRequired.customer}
                error={localMessages && localMessages.customer}
                helperText={localMessages && localMessages.customer}
                value={this.props.customerBos ? this.props.customerBos : addProjects.customer}
              /> */}
              <AsyncAutocomplete
                name="businessOpportunities"
                label={names.businessOpportunities}
                required={checkRequired.businessOpportunities}
                checkedShowForm={checkShowForm.businessOpportunities}
                error={localMessages && localMessages.businessOpportunities}
                helperText={localMessages && localMessages.businessOpportunities}
                onChange={value => {
                  console.log('value', value);
                  if (value) {
                    if (value.assets) {
                      this.setState({
                        listAssets: value.assets,
                        checkAssets: true,
                      });
                    } else {
                      this.setState({
                        listAssets: [],
                        checkAssets: false,
                      });
                    }

                    this.props.mergeData({ assets: value.assets });
                    this.props.mergeData({ businessOpportunities: value });
                  } else {
                    this.setState({
                      listAssets: [],
                      checkAssets: false,
                    });
                    this.props.mergeData({ businessOpportunities: null });
                  }
                }}
                url={API_BOS}
                value={addProjects.businessOpportunities}
              />
              {this.state.listAssets &&
                this.state.checkAssets && (
                  <Autocomplete
                    isMulti
                    isDisabled
                    name="assets"
                    label={names.assets}
                    // onChange={value => this.props.mergeData({ assets: value })}
                    value={addProjects.assets}
                    checkedShowForm={checkShowForm.assets}
                    required={checkRequired.assets}
                    error={localMessages && localMessages.assets}
                    helperText={localMessages && localMessages.assets}
                    // suggestions={addProjects.employeesData}
                  />
                )}
              <AsyncAutocomplete
                name="Mã Khách Hàng"
                filterLimit
                // label={names['customer.code']}
                label={names.customer}
                // onChange={value => {
                //   this.props.mergeData({ customer: value });
                // }}
                customOptionLabel={this.employeeOptionLabel}
                onChange={value => this.handleChangeCodeCustomer(value)}
                url={API_CUSTOMERS}
                value={this.props.customerBos ? this.props.customerBos : addProjects.customer}
              />
              {/* <CustomInputBase
                value={addProjects.category}
                label="Loại CV/DA"
                checkedShowForm={checkShowForm.category}
                required={checkRequired.category}
                error={localMessages && localMessages.category}
                helperText={localMessages && localMessages.category}
                onChange={e => this.handleChange('category', e.target.value)}
                select
              >
                {addProjects.configs.map((it, idx) => (
                  <MenuItem value={idx + 1} key={it.code}>
                    {it.name}
                  </MenuItem>
                ))}
              </CustomInputBase> */}
              <CustomInputBase
                select
                label={names.contactPerson}
                value={addProjects.contactPerson}
                checkedShowForm={checkShowForm.contactPerson}
                required={checkRequired.contactPerson}
                error={localMessages && localMessages.contactPerson}
                helperText={localMessages && localMessages.contactPerson}
                name="Người liên hệ"
                onChange={e => this.handleChange('contactPerson', e.target.value)}
              >
                {this.state.contactList
                  ? this.state.contactList.map((it, id) => (
                      <MenuItem key={it} value={it.name + '-' + it.phoneNumber}>
                        {it.name + '-' + it.phoneNumber}
                      </MenuItem>
                    ))
                  : null}
              </CustomInputBase>
              {console.log('addProjects && addProjects.bill', addProjects && addProjects.bill)}
              <CustomInputBase
                select
                label={names && names['bill.code']}
                value={addProjects && addProjects.bill}
                name="Mã hóa đơn"
                onChange={e => this.handleChange('bill', e.target.value)}
              >
                {this.state.billList
                  ? this.state.billList.map((it, id) => (
                      <MenuItem key={it} value={it.billId || it._id}>
                        {it.code}
                      </MenuItem>
                    ))
                  : null}
              </CustomInputBase>
              <CustomInputBase
                select
                label={names.typeVoucher}
                value={addProjects.typeVoucher}
                checkedShowForm={checkShowForm.typeVoucher}
                required={checkRequired.typeVoucher}
                error={localMessages && localMessages.typeVoucher}
                helperText={localMessages && localMessages.typeVoucher}
                name="typeVoucher"
                onChange={e => this.handleChange('typeVoucher', e.target.value)}
              >
                {taskTypeVoucher.map((it, id) => (
                  <MenuItem key={it} value={id + 1}>
                    {it}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <CustomInputBase
                select
                label={names.priority}
                value={addProjects.priority}
                checkedShowForm={checkShowForm.priority}
                required={checkRequired.priority}
                error={localMessages && localMessages.priority}
                helperText={localMessages && localMessages.priority}
                name="priority"
                onChange={e => this.handleChange('priority', e.target.value)}
              >
                {taskPrioty.map((it, id) => (
                  <MenuItem key={it} value={id + 1}>
                    {it}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <CustomInputBase
                select
                label={names.transport}
                value={addProjects.transport}
                checkedShowForm={checkShowForm.transport}
                required={checkRequired.transport}
                error={localMessages && localMessages.transport}
                helperText={localMessages && localMessages.transport}
                name="transport"
                onChange={e => this.handleChange('transport', e.target.value)}
              >
                {taskTransport.map((it, id) => (
                  <MenuItem key={it} value={id + 1}>
                    {it}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <CustomInputBase
                select
                label={names.typeTransport}
                value={addProjects.typeTransport}
                checkedShowForm={checkShowForm.typeTransport}
                required={checkRequired.typeTransport}
                error={localMessages && localMessages.typeTransport}
                helperText={localMessages && localMessages.typeTransport}
                name="typeTransport"
                onChange={e => this.handleChange('typeTransport', e.target.value)}
              >
                {taskTypeTransport.map((it, id) => (
                  <MenuItem key={it} value={id + 1}>
                    {it}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <CustomInputBase
                name="transportationStaff"
                label={names.transportationStaff}
                value={addProjects.transportationStaff}
                checkedShowForm={checkShowForm.transportationStaff}
                required={checkRequired.transportationStaff}
                error={localMessages && localMessages.transportationStaff}
                helperText={localMessages && localMessages.transportationStaff}
                onChange={e => this.handleChange('transportationStaff', e.target.value)}
                onKeyDown={blockStringSpecial}
              />
              <CustomInputBase
                name="licensePlates"
                label={names.licensePlates}
                value={addProjects.licensePlates}
                checkedShowForm={checkShowForm.licensePlates}
                required={checkRequired.licensePlates}
                error={localMessages && localMessages.licensePlates}
                helperText={localMessages && localMessages.licensePlates}
                onChange={e => this.handleChange('licensePlates', e.target.value)}
                // onKeyDown={blockStringSpecial}
              />
              {/* <Grid item md={12}>
                <CustomInputBase
                  onChange={e => this.props.mergeData({ description: e.target.value })}
                  value={addProjects.description}
                  label={names.description}
                  multiple
                  rows={2}
                  checkedShowForm={checkShowForm.description}
                  required={checkRequired.description}
                  error={localMessages && localMessages.description}
                  helperText={localMessages && localMessages.description}
                  name="description"
                />
              </Grid> */}
              {/* 
              {!!this.props.description && this.props.description.length > 0 && <Typography variant="h5">Mô tả</Typography>}
              {!!this.props.description &&
                this.props.description.length > 0 && (
                  <List component="nav" aria-label="mailbox folders">
                    {this.props.description.map(item => {
                      return (
                        <>
                          <ListItem>
                            <ListItemText primary={`+ ${item.name}: ${item.value}`} />
                          </ListItem>
                          <Divider light />
                        </>
                      );
                    })}
                  </List>
                )} */}
              <input onChange={this.onSelectImg} accept="image/*" style={{ display: 'none' }} id="contained-button-file" multiple type="file" />
            </Grid>
            <Grid item md={6} style={{ zIndex: 0 }}>
              <Typography variant="h5">
                Thông tin người tham gia
                {/* <label htmlFor="contained-button-file">
                  <Tooltip title="Thay đổi ảnh cover dự án">
                    <AddPhotoAlternate style={{ cursor: 'pointer', float: 'right', color: '#3ea8fd' }} />
                  </Tooltip>
                </label> */}
              </Typography>
              {addProjects.parentId ? (
                <Autocomplete
                  isMulti
                  name="Chọn người quản lý..."
                  label={names.taskManager}
                  onChange={value => this.props.mergeData({ taskManager: value })}
                  value={addProjects.taskManager}
                  checkedShowForm={checkShowForm.taskManager}
                  required={checkRequired.taskManager}
                  error={localMessages && localMessages.taskManager}
                  helperText={localMessages && localMessages.taskManager}
                  suggestions={addProjects.employeesData}
                />
              ) : (
                <AsyncAutocomplete
                  isMulti
                  name="Chọn người quản lý..."
                  label={names.taskManager}
                  required={checkRequired.taskManager}
                  checkedShowForm={checkShowForm.taskManager}
                  error={localMessages && localMessages.taskManager}
                  helperText={localMessages && localMessages.taskManager}
                  onChange={value => {
                    this.props.mergeData({ taskManager: value });
                  }}
                  url={API_USERS}
                  value={addProjects.taskManager}
                />
              )}
              <AsyncAutocomplete
                isMulti
                name="Chọn người được xem..."
                label={names.viewable}
                required={checkRequired.viewable}
                checkedShowForm={checkShowForm.viewable}
                error={localMessages && localMessages.viewable}
                helperText={localMessages && localMessages.viewable}
                onChange={value => this.props.mergeData({ viewable: value })}
                url={API_USERS}
                value={addProjects.viewable}
              />

              {/* {!addProjects.parentId && ( */}
              <AsyncAutocomplete
                // isDisabled={addProjects.parentId}
                // disabled={addProjects.parentId}
                isMulti
                name="Chọn người tham gia"
                label={names.join}
                required={checkRequired.join}
                checkedShowForm={checkShowForm.join}
                error={localMessages && localMessages.join}
                helperText={localMessages && localMessages.join}
                onChange={value => this.props.mergeData({ join: value })}
                url={API_USERS}
                value={addProjects.join}
                // helperText={addProjects.errorJoin ? 'Không được bỏ trống ' : false}
                // error={addProjects.errorJoin}
              />
              {/* )} */}
              {addProjects.parentId ? (
                <Autocomplete
                  isMulti
                  name="Chọn người phụ trách... "
                  label={names.inCharge}
                  required={checkRequired.inCharge}
                  checkedShowForm={checkShowForm.inCharge}
                  error={localMessages && localMessages.inCharge}
                  helperText={localMessages && localMessages.inCharge}
                  onChange={value => this.props.mergeData({ inCharge: value })}
                  suggestions={addProjects.employeesData}
                  value={addProjects.inCharge}
                />
              ) : (
                <AsyncAutocomplete
                  isMulti
                  name="Chọn người phụ trách... "
                  label={names.inCharge}
                  required={checkRequired.inCharge}
                  checkedShowForm={checkShowForm.inCharge}
                  error={localMessages && localMessages.inCharge}
                  helperText={localMessages && localMessages.inCharge}
                  onChange={value => this.props.mergeData({ inCharge: value })}
                  value={addProjects.inCharge}
                  url={API_USERS}
                />
              )}
              {addProjects.parentId ? (
                <Autocomplete
                  isMulti
                  name="Chọn người hỗ trợ... "
                  label={names.support}
                  required={checkRequired.support}
                  checkedShowForm={checkShowForm.support}
                  error={localMessages && localMessages.support}
                  helperText={localMessages && localMessages.support}
                  onChange={value => this.props.mergeData({ support: value })}
                  value={addProjects.support}
                  suggestions={addProjects.employeesData}
                />
              ) : (
                <AsyncAutocomplete
                  isMulti
                  name="Chọn người hỗ trợ... "
                  label={names.support}
                  required={checkRequired.support}
                  checkedShowForm={checkShowForm.support}
                  error={localMessages && localMessages.support}
                  helperText={localMessages && localMessages.support}
                  onChange={value => this.props.mergeData({ support: value })}
                  url={API_USERS}
                  value={addProjects.support}
                />
              )}

              <AsyncAutocomplete
                isMulti
                name="Chọn nhóm phê duyệt..."
                label={names.approved}
                required={checkRequired.approved}
                checkedShowForm={checkShowForm.approved}
                error={localMessages && localMessages.approved}
                helperText={localMessages && localMessages.approved}
                url={API_APPROVE_GROUPS}
                onChange={value => this.props.mergeData({ approved: value })}
                value={addProjects.approved}
              />
              <AsyncAutocomplete
                name="Chọn người phê duyệt tiến độ... "
                label={names.approvedProgress}
                onChange={value => this.props.mergeData({ approvedProgress: value })}
                url={API_USERS}
                required={checkRequired.approvedProgress}
                checkedShowForm={checkShowForm.approvedProgress}
                error={localMessages && localMessages.approvedProgress}
                helperText={localMessages && localMessages.approvedProgress}
                value={addProjects.approvedProgress}
                // helperText={addProjects.approvedProgress === null ? 'Không được bỏ trống ' : false}
                // error={addProjects.approvedProgress === null}
              />

              <CustomGroupInputField
                code="Task"
                columnPerRow={3}
                value={addProjects.others}
                onChange={value => {
                  this.props.mergeData({ others: value });
                }}
              />
              <Typography variant="h6">Mô tả chi tiết</Typography>

              <Editor
                tools={[
                  [Bold, Italic, Underline, Strikethrough],
                  [Subscript, Superscript],
                  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                  [Indent, Outdent],
                  [OrderedList, UnorderedList],
                  FontSize,
                  FontName,
                  FormatBlock,
                  [Undo, Redo],

                  [EditorLink, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 300 }}
                contentElement={addProjects.desHtml}
                ref={editor => {
                  this.editor = editor;
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    };

    return (
      <div className="project-main" style={{ width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
        <img alt="anh du an" className="bg-img" src={avt} />
        <div className="bg-color" />
        {/* <Helmet>
          <title>{intl.formatMessage(messages.duan || { id: 'duan', defaultMessage: 'duan' })}</title>
          <meta name="description" content="Description of AddProjects" />
        </Helmet> */}

        <ValidatorForm onSubmit={this.handleSaveProject}>
          {/* {this.props.id ? null : (
            <Breadcrumbs
              links={[
                { title: 'Dashboard', to: '/' },
                {
                  title: 'Dự án',
                  to: '/Task',
                },
              ]}
              title={addProjects.name || 'Thêm mới'}
            />
          )} */}
          {(this.props.id ? this.props.id : this.props.match.params.id) === 'add' ? (
            <div style={{ width: '100%' }}>{general()}</div>
          ) : (
            // <div>
            //   {this.props.data.isProject ? (
            //     <div className="add-project" style={{ marginTop: 55 }}>
            //       <div style={{ padding: '0 20px 10px 10px', width: miniActive ? 'calc( 100vw - 80px)' : 'calc( 100vw - 260px)' }}>
            //         <Grid item md={12}>
            //           <CustomAppBar
            //             title="Thêm mới dự án"
            //             onGoBack={() => {
            //               if (this.props.onClose) {
            //                 return this.props.onClose();
            //               }
            //               !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
            //             }}
            //             disableAdd
            //           />
            //         </Grid>
            //       </div>
            //       <TaskType
            //         hanldeClick={() => this.props.mergeData({ selectTask: false, type: 1 })}
            //         icon={<NetworkLocked style={{ fontSize: '5rem' }} />}
            //         description={intl.formatMessage(messages.tieudebaomat || { id: 'tieudebaomat', defaultMessage: 'tieudebaomat' })}
            //         title={intl.formatMessage(messages.nhombaomat || { id: 'nhombaomat', defaultMessage: 'nhombaomat' })}
            //         background="linear-gradient(45deg, #464846, #5f5f5f)"
            //       />
            //       <TaskType
            //         background="linear-gradient(45deg, #2196F3, #72c7edeb)"
            //         hanldeClick={() => this.props.mergeData({ selectTask: false, type: 4 })}
            //         icon={<Group style={{ fontSize: '5rem' }} />}
            //         description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudecongkhai', defaultMessage: 'tieudecongkhai' })}
            //         title={intl.formatMessage(messages.nhomcongkhai || { id: 'nhomcongkhai', defaultMessage: 'nhomcongkhai' })}
            //       />
            //       {speciall && speciall.find(elm => elm.name === 'addSpecial').data.access === true ? (
            //         <TaskType
            //           background="linear-gradient(45deg, rgb(246, 61, 47), #ff9d95)"
            //           hanldeClick={() => this.props.mergeData({ selectTask: false, type: 2 })}
            //           icon={<PersonAddDisabled style={{ fontSize: '5rem' }} />}
            //           description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudean', defaultMessage: 'tieudean' })}
            //           title={intl.formatMessage(messages.nhoman || { id: 'nhoman', defaultMessage: 'nhoman' })}
            //         />
            //       ) : null}

            //       <TaskType
            //         background="linear-gradient(45deg, #4CAF50, #90ce48)"
            //         hanldeClick={() => this.props.mergeData({ selectTask: false, type: 3 })}
            //         icon={<GroupAdd style={{ fontSize: '5rem' }} />}
            //         description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudemorong', defaultMessage: 'tieudemorong' })}
            //         title={intl.formatMessage(messages.nhommorong || { id: 'nhommorong', defaultMessage: 'nhommorong' })}
            //       />
            //     </div>
            //   ) : (
            //     <div style={{ width: '100%' }}>{general()}</div>
            //   )}
            // </div>
            <div className="project-content">
              <div style={this.state.styleTabs === true ? { padding: 20, marginTop: 50 } : { padding: 20 }}>
                <Grid item sm={12}>
                  <ButtonUI tabIndex={0}>{intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' })}</ButtonUI>

                  {(!!taskManagerRole && taskManagerRole.edit === true && isTaskManager) ||
                  (!!taskInCharge && taskInCharge.edit === true && isInCharge) ||
                  (!!taskJoin && taskJoin.edit === true && isJoin) ||
                  (!!taskSupport && taskSupport.edit === true && isSupport) ||
                  (!!taskViewable && taskViewable.edit === true && isViewable) ||
                  (!!taskCreatedBy && taskCreatedBy.edit === true && isCreatedBy) ||
                  (!!taskOthers && taskOthers.edit === true) ? (
                    // <ButtonUI tabIndex={1}>s</ButtonUI>
                    <ButtonUI tabIndex={1}>{intl.formatMessage(messages.coban || { id: 'coban', defaultMessage: 'coban' })}</ButtonUI>
                  ) : null}
                  {(!!taskManagerRole && taskManagerRole.updateProgress === true && isTaskManager) ||
                  (!!taskInCharge && taskInCharge.updateProgress === true && isInCharge) ||
                  (!!taskJoin && taskJoin.updateProgress === true && isJoin) ||
                  (!!taskSupport && taskSupport.updateProgress === true && isSupport) ||
                  (!!taskViewable && taskViewable.updateProgress === true && isViewable) ||
                  (!!taskCreatedBy && taskCreatedBy.updateProgress === true && isCreatedBy) ||
                  (!!taskOthers && taskOthers.updateProgress === true) ? (
                    <ButtonUI tabIndex={2}>{intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })}</ButtonUI>
                  ) : null}
                  {/* {(!!taskManagerRole && taskManagerRole.uploadFile === true) ||
                   (!!taskInCharge && taskInCharge.uploadFile === true) ||
                   (!!taskJoin && taskJoin.uploadFile === true) ||
                   (!!taskSupport && taskSupport.uploadFile === true) ||
                   (!!taskViewable && taskViewable.uploadFile === true) ? (
                     <ButtonUI tabIndex={3}>{intl.formatMessage(messages.tailieu || { id: 'tailieu', defaultMessage: 'tailieu' })}</ButtonUI>
                   ) : null} */}
                  <ButtonUI tabIndex={3}>{intl.formatMessage(messages.tailieu || { id: 'tailieu', defaultMessage: 'tailieu' })}</ButtonUI>
                  {(!!taskManagerRole && taskManagerRole.convertTask === true && isTaskManager) ||
                  (!!taskInCharge && taskInCharge.convertTask === true && isInCharge) ||
                  (!!taskJoin && taskJoin.convertTask === true && isJoin) ||
                  (!!taskSupport && taskSupport.convertTask === true && isSupport) ||
                  (!!taskViewable && taskViewable.convertTask === true && isViewable) ||
                  (!!taskCreatedBy && taskCreatedBy.convertTask === true && isCreatedBy) ||
                  (!!taskOthers && taskOthers.convertTask === true) ? (
                    <ButtonUI tabIndex={4}>
                      {intl.formatMessage(messages.chuyencongviec || { id: 'chuyencongviec', defaultMessage: 'chuyencongviec' })}
                    </ButtonUI>
                  ) : null}
                  {/* {isProject ? (
                    <ButtonUI tabIndex={5}>{intl.formatMessage(messages.hopdong || { id: 'hopdong', defaultMessage: 'hopdong' })}</ButtonUI>
                  ) : null} */}
                  {/* {(!!taskManagerRole && taskManagerRole.updateRatio === true && isTaskManager) ||
                  (!!taskInCharge && taskInCharge.updateRatio === true && isInCharge) ||
                  (!!taskJoin && taskJoin.updateRatio === true && isJoin) ||
                  (!!taskSupport && taskSupport.updateRatio === true && isSupport) ||
                  (!!taskViewable && taskViewable.updateRatio === true && isViewable) ||
                  (!!taskCreatedBy && taskCreatedBy.updateRatio === true && isCreatedBy) ||
                  (!!taskOthers && taskOthers.updateRatio === true) ? (
                    <ButtonUI tabIndex={6}>Tỉ trọng CV/ dự toán chi phí</ButtonUI>
                  ) : null} */}
                  {((!!taskManagerRole && taskManagerRole.sendApprove === true && isTaskManager) ||
                    (!!taskApproved && taskApproved.sendApprove === true) ||
                    (!!taskInCharge && taskInCharge.sendApprove === true && isInCharge) ||
                    (!!taskSupport && taskSupport.sendApprove === true && isSupport) ||
                    (!!taskJoin && taskJoin.sendApprove === true && isJoin) ||
                    (!!taskViewable && taskViewable.sendApprove === true && isViewable) ||
                    (!!taskCreatedBy && taskCreatedBy.sendApprove === true && isCreatedBy) ||
                    (!!taskOthers && taskOthers.sendApprove === true)) &&
                  (addProjects.state === '2' || addProjects.state === '3' || addProjects.state === '5') ? (
                    <ButtonUI tabIndex={7}>Yêu Cầu phê duyệt</ButtonUI>
                  ) : null}
                  {(roleModuleDocumentary.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                    <ButtonUI tabIndex={8}>Công văn</ButtonUI>
                  ) : null}

                  {(roleModuleCalendar.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                    <ButtonUI tabIndex={9}>Lịch họp</ButtonUI>
                  ) : null}

                  {(!!taskManagerRole && taskManagerRole.updateRatio === true && isTaskManager) ||
                  (!!taskInCharge && taskInCharge.updateRatio === true && isInCharge) ||
                  (!!taskJoin && taskJoin.updateRatio === true && isJoin) ||
                  (!!taskSupport && taskSupport.updateRatio === true && isSupport) ||
                  (!!taskViewable && taskViewable.updateRatio === true && isViewable) ||
                  (!!taskCreatedBy && taskCreatedBy.updateRatio === true && isCreatedBy) ||
                  (!!taskOthers && taskOthers.updateRatio === true) ? (
                    <ButtonUI tabIndex={10}>Lịch sử công việc</ButtonUI>
                  ) : null}
                </Grid>
              </div>
              {tabIndex === 0 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={5}>
                      <Typography variant="h5">
                        {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })}
                      </Typography>
                      <TypographyDetail data={addProjects.name}>{names.name}: </TypographyDetail>
                      {addProjects.isProject && <TypographyDetail data={addProjects.code}>Code: </TypographyDetail>}
                      {addProjects.projectId && <TypographyDetail data={addProjects.projectName}>Tên dự án: </TypographyDetail>}
                      <TypographyDetail data={addProjects.customer ? addProjects.customer.name : null}>{names.customer}: </TypographyDetail>
                      <TypographyDetail data={toVietNamDate(addProjects.startDate)}>{names.startDate}: </TypographyDetail>
                      <TypographyDetail data={toVietNamDate(addProjects.endDate)}>{names.endDate}: </TypographyDetail>
                      <TypographyDetail data={taskStatusArr[addProjects.taskStatus * 1 - 1]}>{names.taskStatus}: </TypographyDetail>
                      <TypographyDetail
                        data={<span style={{ color: priotyColor[addProjects.priority * 1 - 1] }}>{taskPrioty[addProjects.priority * 1 - 1]}</span>}
                      >
                        {names.priority}:
                      </TypographyDetail>
                      <TypographyDetail data={addProjects.finishDate !== null ? toVietNamDate(addProjects.finishDate) : ''}>
                        {'NGÀY HOÀN THÀNH :'}
                      </TypographyDetail>
                      <TypographyDetail data={addProjects.createdBy ? addProjects.createdBy.name : null}>{names.createdBy}: </TypographyDetail>
                      <Typography variant="h5">Thông tin người tham gia</Typography>

                      <TypographyDetail data={this.mapPeople(addProjects.taskManager)}>{names.taskManager}: </TypographyDetail>
                      <TypographyDetail data={this.mapPeople(addProjects.viewable)}>{names.viewable}: </TypographyDetail>
                      <TypographyDetail data={this.mapPeople(addProjects.inCharge)}>{names.inCharge}: </TypographyDetail>
                      <TypographyDetail data={this.mapPeople(addProjects.support)}>{names.support}: </TypographyDetail>
                      <TypographyDetail data={this.mapPeople(addProjects.approved)}>{names.approved}: </TypographyDetail>
                      <TypographyDetail data={<People planPeople={addProjects.joinPlan} people={addProjects.join} />}>
                        {names.join}:{' '}
                      </TypographyDetail>
                      <Typography variant="h5">Mô tả chi tiết</Typography>
                      <div dangerouslySetInnerHTML={{ __html: addProjects.desHtml }} style={{ padding: '0 20px' }} />
                      {/* <TypographyDetail data={<Files files={addProjects.files} />}>Tài liệu đính kèm: </TypographyDetail> */}
                    </Grid>

                    <Grid className="progress-column" item md={3}>
                      <ProgressBar
                        fillColor={fillColor}
                        textCenter={`${addProjects.progress.toFixed()}%`}
                        progress={addProjects.progress.toFixed()}
                      />
                      <ProgressBar fillColor={fillColor} textCenter={`${Math.floor(day)}d ${hours.toFixed()}h`} progress={dayProgress} />
                    </Grid>
                    <Grid item md={4}>
                      {/* <div className="img-detail"> */}
                      <Card>
                        <CardActionArea>
                          <CardMedia component="img" alt="Contemplative Reptile" image={avt} title="Contemplative Reptile" />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                              {addProjects.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              {addProjects.description}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          {/* <Button onClick={() => alert('Bạn không có quyền chia sẻ công việc này')} size="small" color="primary">
                           Chia sẻ
                         </Button>
                         <Button onClick={() => alert('Bạn không có quyền mời tham gia công việc này')} size="small" color="primary">
                           Mời tham gia
                         </Button> */}
                          {clientId === 'MIPEC' ? null : (
                            <Button onClick={this.makeConversation} size="small" color="primary">
                              {hideAddConversation ? null : 'Tạo nhóm trò chuyện'}
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={12}>
                      <div className="commnent-tilte">
                        <Typography variant="h5">Thảo luận</Typography>
                      </div>
                      <Comment profile={profile} code="Task" id={id} />
                    </Grid>
                  </Grid>
                </div>
              ) : null}

              {tabIndex === 1 ? general() : null}
              {tabIndex === 2 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <TextField
                        select
                        fullWidth
                        label="Chọn công việc và dự án"
                        name="idSelect"
                        value={addProjects.idSelect}
                        onChange={this.selectTask}
                      >
                        {addProjects.projects.map(item => (
                          <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={12}>
                      <Button variant="outlined" color="primary" onClick={this.handleOpenDialogProgress}>
                        <Update
                          style={{
                            marginRight: 5,
                            fontSize: '1.3rem',
                          }}
                        />
                        {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                      </Button>
                    </Grid>
                    <Grid item md={12} style={{ display: 'flex' }}>
                      <Typography style={{ fontWeight: 'bold' }}>
                        {intl.formatMessage(messages.tiendovapheduyet || { id: 'tiendovapheduyet', defaultMessage: 'tiendovapheduyet' })}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <div>
                        <Buttons onClick={() => this.setState({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'} size="sm">
                          {intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })}
                        </Buttons>
                        <Buttons onClick={() => this.setState({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'} size="sm">
                          {intl.formatMessage(messages.lichsu || { id: 'lichsu', defaultMessage: 'lichsu' })}
                        </Buttons>
                        <Buttons onClick={() => this.setState({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'} size="sm">
                          {intl.formatMessage(messages.phesuyet || { id: 'phesuyet', defaultMessage: 'phesuyet' })}
                        </Buttons>
                      </div>
                    </Grid>

                    {tab === 0 && (
                      <Grid container md={12}>
                        <ListPage
                          reload={addProjects.reloadProgress}
                          disableEdit
                          disableAdd
                          disableSelect
                          code="TaskProgress"
                          parentCode="Task"
                          // columns={progressColumns}
                          apiUrl={API_TASK_PROJECT}
                          filter={{ _id: addProjects.idSelect }}
                          mapFunction={this.mapProgrees}
                        />
                      </Grid>
                    )}
                    {tab === 1 && (
                      <ListPage
                        reload={addProjects.reloadHistory}
                        client
                        disableEdit
                        disableAdd
                        disableSelect
                        // columns={historyColumns}
                        code="TaskHistory"
                        parentCode="Task"
                        apiUrl={`${API_PROGRESS}/${addProjects._id}`}
                        mapFunction={this.mapHistory}
                        filter={{ _id: addProjects.idSelect }}
                      />
                    )}
                    {tab === 2 && (
                      <Grid item md={12}>
                        <ListPage
                          reload={addProjects.reloadApproved}
                          disableAdd
                          disableEdit
                          disableImport
                          code="Task"
                          apiUrl={API_TASK_PROJECT}
                          mapFunction={this.mapApproved}
                          filter={{ _id: addProjects.idSelect }}
                        />
                      </Grid>
                    )}

                    <Dialog
                      onSave={this.onSaveProgress}
                      title={intl.formatMessage(messages.capnhattiendo || { id: 'capnhattiendo', defaultMessage: 'capnhattiendo' })}
                      open={openDialogProgress}
                      onClose={this.handleDialogProgress}
                    >
                      {tab === 0 ? (
                        <React.Fragment>
                          <TextField
                            fullWidth
                            select
                            label={names.taskStatus}
                            value={addProjects.selectStatus}
                            name="selectStatus"
                            onChange={this.changeTaskStatus}
                          >
                            {taskStatusArr.map((item, index) => (
                              <MenuItem key={item} value={index + 1}>
                                {item}
                              </MenuItem>
                            ))}
                          </TextField>
                          {addProjects.displayProgress ? (
                            <TextField
                              fullWidth
                              id="standard-name"
                              label={names.progress}
                              margin="normal"
                              name="selectProgress"
                              onChange={e => this.handleChange('selectProgress', e.target.value)}
                              value={addProjects.selectProgress}
                              type="number"
                            />
                          ) : null}

                          <TextField
                            fullWidth
                            select
                            label={names.priority}
                            value={addProjects.selectPiority}
                            name="priority"
                            onChange={e => this.handleChange('selectPiority', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          >
                            {taskPrioty.map((it, id) => (
                              <MenuItem key={it} value={id + 1}>
                                {it}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            id="standard-name"
                            label="Ghi chú"
                            margin="normal"
                            name="note"
                            onChange={e => this.handleChange('selectNote', e.target.value)}
                            value={addProjects.selectNote}
                            error={!addProjects.selectNote}
                            helperText={addProjects.selectNote ? null : 'Không được bỏ trống'}
                          />
                        </React.Fragment>
                      ) : null}
                      {tab === 1 ? (
                        <React.Fragment>
                          <TextField
                            fullWidth
                            select
                            label={names.taskStatus}
                            value={addProjects.selectStatus}
                            name="selectStatus"
                            onChange={this.changeTaskStatus}
                          >
                            {taskStatusArr.map((item, index) => (
                              <MenuItem disabled={this.caculeDisable(index + 1)} key={item} value={index + 1}>
                                {item}
                              </MenuItem>
                            ))}
                          </TextField>
                          {addProjects.displayProgress ? (
                            <TextField
                              fullWidth
                              id="standard-name"
                              label={names.progress}
                              margin="normal"
                              name="selectProgress"
                              onChange={e => this.handleChange('selectProgress', e.target.value)}
                              value={addProjects.selectProgress}
                              type="number"
                            />
                          ) : null}

                          <TextField
                            fullWidth
                            select
                            label={names.priority}
                            value={addProjects.selectPiority}
                            name="priority"
                            onChange={e => this.handleChange('selectPiority', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          >
                            {taskPrioty.map((it, id) => (
                              <MenuItem key={it} value={id + 1}>
                                {it}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            id="standard-name"
                            label="Ghi chú"
                            margin="normal"
                            name="note"
                            onChange={e => this.handleChange('selectNote', e.target.value)}
                            value={addProjects.selectNote}
                          />
                        </React.Fragment>
                      ) : null}
                      {tab === 2 ? (
                        <React.Fragment>
                          <TextField
                            fullWidth
                            select
                            label={names.taskStatus}
                            value={addProjects.selectStatus}
                            name="selectStatus"
                            onChange={this.changeTaskStatus}
                          >
                            {taskStatusArr.map((item, index) => (
                              <MenuItem disabled={this.caculeDisable(index + 1)} key={item} value={index + 1}>
                                {item}
                              </MenuItem>
                            ))}
                          </TextField>
                          {addProjects.displayProgress ? (
                            <TextField
                              fullWidth
                              id="standard-name"
                              label={names.progress}
                              margin="normal"
                              name="selectProgress"
                              onChange={e => this.handleChange('selectProgress', e.target.value)}
                              value={addProjects.selectProgress}
                              type="number"
                            />
                          ) : null}

                          <TextField
                            fullWidth
                            select
                            label={names.priority}
                            value={addProjects.selectPiority}
                            name="priority"
                            onChange={e => this.handleChange('selectPiority', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          >
                            {taskPrioty.map((it, id) => (
                              <MenuItem key={it} value={id + 1}>
                                {it}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            id="standard-name"
                            label="Ghi chú"
                            margin="normal"
                            name="note"
                            onChange={e => this.handleChange('selectNote', e.target.value)}
                            value={addProjects.selectNote}
                          />
                        </React.Fragment>
                      ) : null}
                    </Dialog>
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 3 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={() => {
                      this.handleSaveProject;
                    }}
                  />
                  <Grid item md={12} spacing={4}>
                    <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                      {intl.formatMessage(messages.danhsachtailieu || { id: 'danhsachtailieu', defaultMessage: 'danhsachtailieu' })}
                    </Typography>

                    <FileUpload
                      disableEdit={!uploadFilePermission}
                      disableDelete={!deleteFilePermission}
                      name={nameTask}
                      disableWhenApproved
                      id={idTask}
                      code="Task"
                      taskId={id}
                      profile={profile}
                    />
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 4 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <div>
                        <Buttons
                          onClick={() => this.props.mergeData({ typeTranfer: 1 })}
                          color={addProjects.typeTranfer === 1 ? 'gradient' : 'simple'}
                          size="sm"
                        >
                          {intl.formatMessage(messages.nguoiphutrach || { id: 'nguoiphutrach', defaultMessage: 'nguoiphutrach' })}
                        </Buttons>
                        <Buttons
                          onClick={() => this.props.mergeData({ typeTranfer: 2 })}
                          color={addProjects.typeTranfer === 2 ? 'gradient' : 'simple'}
                          size="sm"
                        >
                          {intl.formatMessage(messages.nguoithamgia || { id: 'nguoithamgia', defaultMessage: 'nguoithamgia' })}
                        </Buttons>
                      </div>
                    </Grid>
                    {addProjects.typeTranfer === 1 && (
                      <React.Fragment>
                        <Grid item md={5}>
                          <Autocomplete
                            isMulti
                            name="Chọn "
                            label={names.inCharge}
                            suggestions={addProjects.listInCharge}
                            onChange={value => {
                              this.props.mergeData({ currentInCharge: value });
                            }}
                            value={addProjects.currentInCharge}
                          />
                        </Grid>
                        <Grid item md={2}>
                          <div className="tranfer-employee">
                            <SwapHoriz style={{ fontSize: '3rem' }} />
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          {addProjects.parentId ? (
                            <Autocomplete
                              isMulti
                              name="Chọn "
                              label="Người thay thế"
                              suggestions={employees}
                              onChange={value => this.props.mergeData({ tranferInCharge: value })}
                              value={addProjects.tranferInCharge}
                            />
                          ) : addProjects.listInCharge ? (
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferInCharge: value })}
                              value={addProjects.tranferInCharge}
                              filter={{
                                _id: { $nin: addProjects.listInCharge.map(item => item._id) },
                              }}
                            />
                          ) : (
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferInCharge: value })}
                              value={addProjects.tranferInCharge}
                            />
                          )}
                        </Grid>
                        <Grid item md={12}>
                          <Button variant="outlined" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                            {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                          </Button>
                          <ListPage
                            disableEdit
                            disableAdd
                            disableSearch
                            disableSelect
                            client
                            filter={{ type: 1 }}
                            code="TaskUserReplacement"
                            parentCode="Task"
                            // columns={replaceColumns}
                            apiUrl={`${API_TRANFER}/${addProjects._id}`}
                            reload={addProjects.reloadTranfer}
                          />
                        </Grid>
                      </React.Fragment>
                    )}
                    {addProjects.typeTranfer === 2 && (
                      <React.Fragment>
                        <Grid item md={5}>
                          <Autocomplete
                            isMulti
                            name="Chọn "
                            label={names.join}
                            suggestions={addProjects.listJoin}
                            onChange={value => this.props.mergeData({ currentJoin: value })}
                            value={addProjects.currentJoin}
                          />
                        </Grid>
                        <Grid item md={2}>
                          <div className="tranfer-employee">
                            <SwapHoriz style={{ fontSize: '3rem' }} />
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          {addProjects.parentId ? (
                            <Autocomplete
                              isMulti
                              name="Chọn "
                              label="Người thay thế"
                              suggestions={employees}
                              onChange={value => this.props.mergeData({ tranferJoin: value })}
                              value={addProjects.tranferJoin}
                            />
                          ) : addProjects.listJoin ? (
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferJoin: value })}
                              value={addProjects.tranferJoin}
                              filter={{
                                _id: { $nin: addProjects.listJoin.map(item => item._id) },
                              }}
                            />
                          ) : (
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferJoin: value })}
                              value={addProjects.tranferJoin}
                            />
                          )}
                        </Grid>
                        <Grid md={12} item>
                          <Button variant="outlined" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                            {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                          </Button>
                          <ListPage
                            disableEdit
                            disableAdd
                            disableSearch
                            disableSelect
                            client
                            reload={addProjects.reloadTranfer}
                            filter={{ type: 2 }}
                            code="TaskUserReplacement"
                            parentCode="Task"
                            // columns={replaceColumns}
                            apiUrl={`${API_TRANFER}/${addProjects._id}`}
                          />
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 5 && isProject === true ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <div>
                      <Buttons onClick={() => this.setState({ tabContract: 0 })} color={tabContract === 0 ? 'gradient' : 'simple'} size="sm">
                        {intl.formatMessage(messages.hopdongnhacungcap || { id: 'hopdongnhacungcap', defaultMessage: 'hopdongnhacungcap' })}
                      </Buttons>
                      <Buttons onClick={() => this.setState({ tabContract: 1 })} color={tabContract === 1 ? 'gradient' : 'simple'} size="sm">
                        {intl.formatMessage(messages.hopdongkhachhang || { id: 'hopdongkhachhang', defaultMessage: 'hopdongkhachhang' })}
                      </Buttons>
                    </div>
                    {/* <Grid item md={12}>
                      <Typography>Tổng: 0</Typography>
                    </Grid> */}
                    <Grid item md={12}>
                      {tabContract === 0 ? (
                        <ListPage
                          hightLight
                          disableEdit
                          disableAdd
                          disableDot
                          // client
                          disableSelect
                          code="TaskContract"
                          parentCode="Task"
                          // columns={supplierColumns}
                          apiUrl={GET_TASK_CONTRACT}
                          typeContract="2"
                          taskId={addProjects._id}
                          // filter={{ typeContract: '2', 'taskId': addProjects._id }}
                          mapFunction={this.mapContract}
                        />
                      ) : null}
                      {tabContract === 1 ? (
                        <ListPage
                          disableEdit
                          disableAdd
                          disableDot
                          // client
                          disableSelect
                          code="TaskContract"
                          parentCode="Task"
                          typeContract="1"
                          taskId={addProjects._id}
                          // columns={supplierColumns}
                          apiUrl={GET_TASK_CONTRACT}
                          // filter={{ typeContract: '1', 'taskId': addProjects._id }}
                          mapFunction={this.mapContract}
                        />
                      ) : null}
                    </Grid>
                  </Grid>
                </div>
              ) : null}

              {tabIndex === 6 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tên công việc</TableCell>
                            <TableCell>Tỷ trọng tùy chỉnh </TableCell>
                            <TableCell>Tỷ trọng theo thời lượng</TableCell>
                            <TableCell>Dự toán chi phí</TableCell>
                            <TableCell>Chi phí thực tế</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listRatio.map((i, idx) => (
                            <RatioItem
                              changeRatio={this.changeRatio}
                              index={idx}
                              name={i.name}
                              ratio={i.ratio}
                              costEstimate={i.costEstimate}
                              changeCostEstimate={this.changeCostEstimate}
                              planRatio={i.planRatio}
                              costRealityValue={i.costRealityValue}
                            />
                          ))}

                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Tổng</TableCell>
                            <TableCell
                              style={{ fontWeight: 'bold', color: totalArray(listRatio, 0, listRatio.length, 'ratio') === 100 ? 'black' : 'red' }}
                            >
                              {totalArray(listRatio, 0, listRatio.length, 'ratio')}
                            </TableCell>
                            <TableCell />
                            <TableCell>{totalArray(listRatio, 0, listRatio.length, 'costEstimate')}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                    <Grid item md={12}>
                      <Button style={{ float: 'right' }} variant="outlined" color="primary" onClick={this.updateRatio}>
                        Cập nhật tỷ trọng
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 7 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={6} style={{ padding: '4px 20px' }}>
                      <TextField
                        label="Tên phê duyệt"
                        name="name"
                        onChange={e => this.handleChangeApproved(e, 'name')}
                        value={approvedObj.name}
                        fullWidth
                      />
                      <React.Fragment>
                        {/* <AsyncAutocomplete
                          placeholder="Tìm kiếm nhóm phê duyệt ..."
                          url={API_APPROVE_GROUPS}
                          value={approvedObj.group}
                          onChange={this.handleAddApprovedGroup}
                          label=" Nhóm phê duyệt"
                        /> */}
                        <AsyncAutocomplete
                          name="Chọn..."
                          label="Nhóm phê duyệt"
                          onChange={this.handleAddApprovedGroup}
                          url={API_APPROVE_GROUPS}
                          value={approvedObj.group}
                        />
                      </React.Fragment>
                    </Grid>
                    <Grid item md={6} style={{ padding: '4px 20px' }}>
                      {/* <TextField
                        label="Tên quy trình"
                        name="name"
                        onChange={e => this.handleChangeApproved(e, 'subCode')}
                        value={approvedObj.subCode}
                        fullWidth
                      /> */}
                      <TextField
                        label="Chọn biểu mẫu phê duyệt"
                        name="name"
                        onChange={e => this.handleChangeApproved(e, 'form')}
                        value={approvedObj.form}
                        style={{ width: '100%' }}
                        select
                      >
                        {templates.map(form => (
                          <MenuItem key={form._id} value={form._id}>
                            {form.title}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button variant="outlined" color="primary" style={{ marginTop: 15, float: 'right' }} onClick={this.saveApprove}>
                        Tạo phê duyệt
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 8 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <ListPage
                        disableEdit
                        disableAdd
                        disableSelect
                        code="Documentary"
                        apiUrl={API_DISPATCH}
                        filter={{ task: addProjects._id }}
                        mapFunction={this.mapFunctionDocument}
                      />
                    </Grid>
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 9 ? (
                <div>
                  <CustomAppBar
                    title={
                      id === 'add'
                        ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới công việc/Dự án' })}`
                        : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật công việc/Dự án' })}`
                    }
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    onSubmit={this.handleSaveProject}
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <ListPage
                        disableEdit
                        disableAdd
                        disableSelect
                        code="Calendar"
                        apiUrl={API_MEETING}
                        filter={{ task: addProjects._id }}
                        mapFunction={this.mapFunctionCalendar}
                      />
                    </Grid>
                  </Grid>
                </div>
              ) : null}
              {tabIndex === 10 ? (
                <div>
                  <CustomAppBar
                    title={'Cập nhật công việc/Dự án'}
                    onGoBack={() => {
                      if (this.props.onClose) {
                        return this.props.onClose();
                      }
                      !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                    }}
                    disableAdd
                  />
                  <Grid container>
                    <Grid item md={12}>
                      <ListPage
                        disableEdit
                        disableAdd
                        disableSearch
                        convertTree
                        disableDot
                        // client
                        disableSelect
                        code="ModuleHistory"
                        filter={{
                          id: { $in: [id, idTask] },
                        }}
                        // taskId={addProjects._id}
                        // columns={supplierColumns}
                        apiUrl={API_HISTORY}
                        // filter={{ typeContract: '1', 'taskId': addProjects._id }}
                        // mapFunction={this.mapContract}
                      />
                    </Grid>
                  </Grid>
                </div>
              ) : null}
            </div>
          )}
          {(selectTask && id === 'add' && this.props.data.isProject) || tabIndex === 3 ? null : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10, marginRight: 40 }}>
              {/* <Button style={{ marginRight: 5 }} variant="outlined" color="primary" onClick={this.handleSaveProject}>
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
                </Button> */}
              {/* <Button variant="outlined" color="secondary" onClick={this.onCloseProject}>
                  {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
                </Button> */}
            </div>
          )}
        </ValidatorForm>
        <ConfirmDialog
          title={intl.formatMessage({ id: 'task.addProject.confirmAddProjectWithoutCustomer' })}
          open={this.state.confirmAddProjectNoCustomerOpen}
          handleClose={this.handleCloseAddProjectNoCustomer}
          handleSave={this.handleConfirmAddProjectNoCustomer}
        />
        <SwipeableDrawer anchor="right" onClose={() => this.handlecloseDrawer()} open={!selectTask ? true : false} width={window.innerWidth - 260}>
          {general()}
        </SwipeableDrawer>
      </div>
    );
  }
}

// AddProjects.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addProjects: makeSelectAddProjects(),
  profile: makeSelectProfile(),
  socket: makeSelectSocket(),
  dashboardPage: makeSelectDashboardPage(),
  toTalTask: makeSelectTotalTask(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(MergeData(data)),
    mergeData: data => dispatch(mergeData(data)),
    handleChange: (name, value) => {
      dispatch(handleChange(name, value));
    },
    postProject: data => dispatch(postProject(data)),
    postFile: data => dispatch(postFile(data)),
    getProjectCurrent: (id, data) => dispatch(getProjectCurrent(id, data)),
    putProject: (data, id) => dispatch(putProject(data, id)),
    putProgress: (data, id) => dispatch(putProgress(data, id)),
    postTranfer: (data, id, tranfer) => dispatch(postTranfer(data, id, tranfer)),
    getConversation: () => dispatch(getConversation()),
    putRatio: (id, data) => dispatch(putRatio(id, data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
    postApprove: data => dispatch(postApprove(data)),
    getEmployee: () => dispatch(getEmployee()),
  };
}

function RatioItem({ name, ratio, planRatio, index, changeRatio, costEstimate, changeCostEstimate, costRealityValue }) {
  function handleChange(e) {
    const value = (e.target.value * 1).toFixed();
    if (value > 100) return;
    changeRatio(index, value);
  }
  function handleChangeCostEstimate(e) {
    changeCostEstimate(index, e.target.value);
  }
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <TextField onChange={handleChange} value={ratio} margin="dense" variant="outlined" type="number" />
      </TableCell>
      <TableCell>{planRatio}</TableCell>
      <TableCell>
        {/* <TextField onChange={handleChangeCostEstimate} value={costEstimate} margin="dense" variant="outlined" type="number" /> */}
        <CustomInputBase
          label={'Dự toán chi phí'}
          onChange={handleChangeCostEstimate}
          value={costEstimate}
          type="number"
          formatType="Money"
          margin="dense"
          variant="outlined"
          fullWidth={false}
        />
      </TableCell>
      <TableCell>{costRealityValue}</TableCell>
    </TableRow>
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addProjects', reducer });
const withSaga = injectSaga({ key: 'addProjects', saga });
AddProjects.defaultProps = { data: { isProject: true } };
export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(stylePaper),
)(AddProjects);
