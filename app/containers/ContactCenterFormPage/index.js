/**
 *
 * ContactCenterFormPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Close, Edit, Delete, Menu, CloudDownload } from '@material-ui/icons';
import {
  withStyles,
  Dialog,
  AppBar,
  Toolbar,
  DialogTitle,
  Slide,
  Paper,
  Typography,
  IconButton,
  DialogContent,
  TextField,
  Grid,
  Button,
  InputAdornment,
  Tabs,
  Tab,
} from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sortableContainer } from 'react-sortable-hoc';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import makeSelectContactCenterFormPage from './selectors';
import makeSelectDashboardPage from '../../containers/Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import RightContactCenter from '../../components/RightContactCenter';
import { API_USERS, APP_URL, API_MAIL, API_SEND_LINK } from '../../config/urlConfig';
import DialogSettingFiled from '../../components/DialogSettingFiled';

import { addContactCenterAction, getContactCenterByIdAction, getEmployeeByIdAction, editContactCenterAction, sendLinkCTV } from './actions';
import EmailDialog from '../../components/List/EmailDialog';
import { convertTemplate, fetchData } from '../../helper';
function Transition(props) {
  return <Slide direction="left" {...props} />;
}
const promiseOptions = (searchString, putBack) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: searchString,
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?filter%5Bname%5D%5B%24regex%5D=${searchString}&filter%5Bname%5D%5B%24options%5D=gi`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(item => convertedData.push({ ...item, ...{ label: item.name, value: item._id } }));
      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
const SortableContainer = sortableContainer(({ children }) => <ul style={{ width: '100%', padding: 0 }}>{children}</ul>);
/* eslint-disable react/prefer-stateless-function */
export class ContactCenterFormPage extends React.Component {
  state = {
    fields: [],
    name: '',
    description: '',
    selectedFields: [],
    people: [],
    background: {},
    tab: 0,
    openDialog: false,
    currentFields: {},
    type: 'add', // add or edit
    dialogEmail: false,
    mail: { to: [], subject: '', text: '' },
    mail1: { to: [], subject: '', text: '' },
    states: {
      templatess: [],
      template: '',
      typeFile: 'PDF',
      sales: [],
      files: [],
      loading: true,
      templatesItem: '',
      field: null,
      fields: [],
      approvedObj: {
        name: '',
        // subCode: code,
        form: '',
        group: null,
        description: '',
      },
      dynamicForms: [],
      data: '',
      openChangePassword: false,
      // id: id,
      password: null,
    },
    state1: {
      templatess: [],
      template: '',
      typeFile: 'PDF',
      sales: [],
      files: [],
      loading: true,
      templatesItem: '',
      field: null,
      fields: [],
      approvedObj: {
        name: '',
        // subCode: code,
        form: '',
        group: null,
        description: '',
      },
      dynamicForms: [],
      data: '',
      openChangePassword: false,
      // id: id,
      password: null,
    },
    dataHtml: null,
  };

  componentWillMount() {
    try {
      const businessOpportunitiesFields = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'crmCampaign');
      const customerFields = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Customer');
      let allFields = [];
      if (businessOpportunitiesFields) {
        const formattedBusinessOpportunitiesFields = businessOpportunitiesFields.listDisplay.type.fields.type.columns.map(item => {
          if (item.showTemplate !== undefined && item.showTemplate === true) {
            return {
              name: `BusinessOpportunities.${item.name}`,
              title: `${item.title}`,
              description: '',
              isRequire: item.isRequire,
              ref: 'BusinessOpportunities',
              selected: false,
              priority: 0,
              type: String(item.type).toLocaleLowerCase(),
              menuItem: item.menuItem ? item.menuItem : null,
            };
          }
        });
        allFields = allFields.concat(formattedBusinessOpportunitiesFields);
      }
      if (customerFields) {
        const formattedCustomersFields = customerFields.listDisplay.type.fields.type.columns.map(item => {
          if (item.showTemplate !== undefined && item.showTemplate === true) {
            return {
              name: `Customer.${item.name}`,
              title: `${item.title}`,
              description: '',
              isRequire: item.isRequire,
              ref: 'Customer',
              selected: false,
              priority: 0,
              type: String(item.type).toLocaleLowerCase(),
              menuItem: item.menuItem ? item.menuItem : null,
            };
          }
        });
        allFields = allFields.concat(formattedCustomersFields);
      }
      this.state.fields = allFields.filter(item => {
        if (item !== undefined) {
          return item;
        }
      });
    } catch (error) {}
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.onGetContactCenter(id);
      this.state.type = 'edit';
    } else {
      this.state.type = 'add';
    }
  }

  // async sendMail(props) {
  //   const { mail, states } = this.state;
  //   if (!mail.text || !mail.subject || !state.template || !mail.to || !mail.to.length) {
  //     return;
  //   }
  //   try {
  //     const data = { ...mail };

  //     const content = props;
  //     if (content) {
  //       data.content = content;
  //     }

  //     data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
  //     if (!data.to) {
  //       alert('Danh sách Khách hàng chọn không có email');
  //       return;
  //     }

  //     const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  //     const formatData = {
  //       title: data.subject,
  //       template: states.template,
  //       // viewConfig, // .find(item => item.code === code),
  //       html: data.content,
  //       // listCustomer: mail.to,
  //       // code,
  //     };

  //     await fetchData(API_MAIL, 'POST', formatData);
  //     setDialogEmail(false);
  //     alert('Gửi mail thành công');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  sendMailCustomer = async props => {
    const mail = this.state.mail;
    // if (!mail.text || !mail.subject || !state.template || !mail.to || !mail.to.length) {
    //   return;
    // }
    try {
      const data = { ...mail };

      const content = props;
      if (content) {
        data.content = content ? content : text;
      }

      // data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
      // if (!data.to) {
      //   alert('Danh sách Khách hàng chọn không có email');
      //   return;
      // }
      const { contactCenterFormPage } = this.props;
      const contactCenter = contactCenterFormPage.contactCenter;
      // const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      const formatData = {
        link: `${APP_URL}/ren/form/${contactCenter ? contactCenter._id : ''}`,
        title: data.subject,
        // template: states.template,
        // viewConfig, // .find(item => item.code === code),
        html: data.content,
        // listCustomer: mail.to,
        // code,
      };

      await fetchData(API_SEND_LINK, 'POST', formatData);
      this.setDialogEmail(false);
      this.clear();
      alert('Gửi mail thành công');
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUpdate(props) {
    const { contactCenterFormPage } = props;
    const { type } = this.state;
    const contactCenter = contactCenterFormPage.contactCenter;
    const employees = contactCenterFormPage.employees;
    // console.log('object1', contactCenter);
    if (this.props.contactCenterFormPage.contactCenter !== contactCenter) {
      if (contactCenter && type === 'edit') {
        const { fields } = this.state;
        // console.log('object', contactCenter);
        this.state.background = { file: contactCenter.background };
        const peopleIds = contactCenter.people;

        this.props.onGetEmployeeByIds({
          filter: {
            _id: {
              $in: peopleIds,
            },
          },
        });

        // console.log(' this.state.background', this.state.background);
        this.state.name = contactCenter.name;
        this.state.description = contactCenter.description;
        this.state.people = contactCenter.people;
        this.state.selectedFields = contactCenter.fields;
        contactCenter.fields.forEach(item => {
          const cuContactCenter = fields.find(element => element.name === item.name);
          if (cuContactCenter && cuContactCenter.selected !== undefined) {
            cuContactCenter.selected = true;
          }
        });
        this.state.fields = fields;
      }
    }

    if (type === 'edit' && this.props.contactCenterFormPage.employees !== employees) {
      this.people = employees.map(item => ({
        ...item,
        label: item.name,
        value: item._id,
      }));
    }
  }

  handleSelect = name => {
    const { fields } = this.state;
    let { selectedFields } = this.state;
    const index = fields.findIndex(item => item.name === name);
    if (index > -1) {
      if (fields[index].selected !== true) {
        fields[index].priority = selectedFields.length;
        selectedFields.push(fields[index]);
      } else {
        const selectIndex = selectedFields.findIndex(item => item.name === name);
        if (selectIndex > -1) {
          selectedFields.splice(selectIndex, 1);
        }
        selectedFields = selectedFields.map((item, index) => ({
          ...item,
          priority: index,
        }));
      }
      fields[index].selected = !fields[index].selected;
    }

    this.setState({
      selectedFields,
      fields,
    });
  };

  onDragEnd = result => {
    const { destination, source } = result;
    if (destination && source) {
      let { selectedFields } = this.state;
      selectedFields = selectedFields.map(item => {
        if (source.index < destination.index) {
          if (item.priority <= destination.index) {
            return {
              ...item,
              priority: item.priority - 1,
            };
          }
        } else if (item.priority >= destination.index) {
          return {
            ...item,
            priority: item.priority + 1,
          };
        }
        return item;
      });

      selectedFields[source.index].priority = destination.index;
      // console.log(selectedFields);
      selectedFields = selectedFields.sort((a, b) => a.priority - b.priority);
      this.setState({ selectedFields });
    }
  };

  handleChangeSelect = selectedOption => {
    this.people = selectedOption;
    if (this.people !== null) {
      this.setState({
        people: [
          {
            name: selectedOption.name,
            employeeId: selectedOption._id,
          },
        ],
        //   .map(item => ({
        //   name: item.name,
        //   employeeId: item._id,
        // })),
      });
    } else {
      this.setState({
        people: [],
      });
    }
  };

  handleRemove = name => {
    let { selectedFields } = this.state;
    const { fields } = this.state;
    const selectIndex = selectedFields.findIndex(item => item.name === name);
    if (selectIndex > -1) {
      selectedFields.splice(selectIndex, 1);
      selectedFields = selectedFields.map((item, index) => ({
        ...item,
        priority: index,
      }));
      const cuField = fields.find(item => item.name === name);
      cuField.selected = !cuField.selected;
      this.setState({ selectedFields, fields });
    }
  };

  handleChangeTab = (event, tab) => {
    const { id } = this.props.match.params;
    this.setState({ tab });
    if (tab === 3) {
      fetch(`${APP_URL}/ren/form/${id}`)
        .then(response => response.text())
        .then(data => {
          console.log('data', data);
          this.setState({
            dataHtml: data,
          });
        })
        .catch();
    }
  };

  handleSettingField = name => {
    const { selectedFields } = this.state;
    const currentFields = selectedFields.find(item => item.name === name);
    if (currentFields) {
      this.setState({ openDialog: true, currentFields });
    }
  };

  handleChangeSettingField = field => {
    const { selectedFields } = this.state;
    let currentFields = selectedFields.find(item => item.name === field.name);
    currentFields = field;
    if (currentFields) {
      this.setState({ openDialog: false, currentFields });
    }
  };

  handleSelectDialogSetting = () => {
    this.setState({ openDialog: false });
  };

  handleAddContactCenter = () => {
    const { selectedFields, background, people, name, description, type } = this.state;
    // console.log(background, 'bg');
    if (selectedFields.length > 0) {
      if (name !== '') {
        if (people.length > 0) {
          if (type === 'add') {
            const body = {
              fields: selectedFields,
              background,
              people: people[0].employeeId,
              name,
              description,
            };
            this.props.onAddContactCenter(body);
          } else {
            const { contactCenterFormPage } = this.props;
            const contactCenter = contactCenterFormPage.contactCenter;

            if (contactCenter) {
              const body = {
                ...contactCenter,
                fields: selectedFields,
                background,
                people: Array.isArray(people) ? people[0].employeeId : people,
                name,
                description,
              };
              console.log(body, 'bofyyy');
              this.props.onEditContactCenter(body);
            }
          }
        } else alert('Bắt buộc chọn người sở hữu !');
      } else alert('Bắt buộc nhập Tên biểu mẫu !');
    } else {
      alert('Bắt buộc chọn trường !');
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  // sendLink = () => {
  //   const { classes, contactCenterFormPage } = this.props;
  //   const contactCenter = contactCenterFormPage.contactCenter;
  //   console.log('123');
  //   const body = {
  //     link: `${APP_URL}/ren/form/${contactCenter ? contactCenter._id : ''}`,
  //   };
  //   this.props.onSendLinkCTV(body);
  // };
  setDialogEmail = params => {
    this.setState({ dialogEmail: params });
  };
  setMail = params => {
    // this.state.mail = params;
    this.setState({ mail: params });
  };
  setStates = params => {
    // this.state.states = params;
    this.setState({ states: params });
  };
  clear = () => {
    const { allTemplates } = this.props.dashboardPage;
    const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === 'ContactCenter') : null;
    this.setStates({ ...this.state.state1, templatess: templatesItem });
    this.setMail({ ...this.state.mail1 });
  };
  handleDialogTemplate() {
    // if (open === true) setopenDialog({ openDialog: open });
    const { allTemplates } = this.props.dashboardPage;
    // if (code) {
    const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === 'ContactCenter') : null;
    this.setStates({ ...this.state.states, templatess: templatesItem });
  }
  handleEmailDialog = async () => {
    // if (code === 'SalesQuotation') {
    //   const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent['customer.customerId']}`);
    //   setMail({ ...mail, to: [customer] });
    // }
    // if (code === 'Customer') {
    //   const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
    //   setMail({ ...mail, to: [customer] });
    // }

    this.handleDialogTemplate();
    this.setState({ dialogEmail: true });
    // handleClose();
  };
  deleteFile = v => {
    const listFile = state.files.filter((i, b) => b !== v);
    setState({ ...state, files: listFile });
  };
  // async sendMail(props) {
  //   if (!(mail.text || this.props.content) || !mail.subject || !state.template || !mail.to || !mail.to.length) {
  //     return;
  //   }
  //   try {
  //     const data = { ...mail };

  //     const content = props;
  //     if (content) {
  //       data.content = content;
  //     }

  //     data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
  //     if (!data.to) {
  //       alert('Danh sách Khách hàng chọn không có email');
  //       return;
  //     }

  //     const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  //     const formatData = {
  //       title: data.subject,
  //       template: state.template,
  //       viewConfig, // .find(item => item.code === code),
  //       html: data.content,
  //       listCustomer: mail.to,
  //       code,
  //     };

  //     await fetchData(API_MAIL, 'POST', formatData);
  //     this.state.dialogEmail = false;
  //     alert('Gửi mail thành công');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  render() {
    const { classes, contactCenterFormPage, dashboardPage } = this.props;
    const { name, description, fields, selectedFields, background, tab, currentFields, openDialog, type } = this.state;
    const contactCenter = contactCenterFormPage.contactCenter;
    const getListStyle = isDraggingOver => ({
      background: isDraggingOver ? 'lightblue' : '#d3d3d300',
    });
    const getItemStyle = (isDragging, draggableStyle, color) => ({
      userSelect: 'none',
      borderRadius: '3px',
      background: isDragging ? 'linear-gradient(to right, #2196f3,#2196f3)' : color,
      ...draggableStyle,
    });
    const customStyles = {
      menu: base => ({
        ...base,
        backgroundColor: 'white',
        zIndex: '2!important',
      }),
      menuList: base => ({
        ...base,
        backgroundColor: 'white',
        zIndex: '2!important',
      }),
    };
    return (
      <div className={classes.root}>
        <Dialog
          classes={{ paperFullScreen: classes.paperFullScreen }}
          fullScreen
          maxWidth="md"
          fullWidth
          open
          // onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    this.props.history.goBack();
                    // this.props.history.push('/crm/crmCampaign');
                  }}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography className={classes.text} h2>
                  {this.state.type === 'add' ? 'Thêm mới biểu mẫu' : 'Cập nhật biểu mẫu'}
                </Typography>
                <Button
                  onClick={this.handleAddContactCenter}
                  className={classes.button}
                  variant="outlined"
                  style={{ color: 'white', border: '1px solid white' }}
                >
                  Lưu
                </Button>
                {/* <Button
                  onClick={() => this.props.history.push('/crm/ContactCenter')}
                  className={classes.button}
                  variant="outlined"
                  style={{ color: 'white', border: '1px solid white' }}
                >
                  Hủy
                </Button> */}
              </Toolbar>
            </AppBar>
          </DialogTitle>

          <DialogContent>
            <div style={{ marginTop: 64 }}>
              <Grid container spacing={24}>
                <Grid item xs={9}>
                  <Paper>
                    <TextField
                      value={name}
                      onChange={this.handleChange}
                      name="name"
                      className={classes.textField}
                      placeholder="Tên biểu mẫu"
                      error={name !== '' ? false : true}
                      helperText={name !== '' ? '' : 'Bắt buộc nhập Tên biểu mẫu'}
                    />
                    <TextField
                      value={description}
                      name="description"
                      multiline
                      rowsMax="4"
                      className={classes.textField}
                      placeholder="Mô tả biểu mẫu"
                      onChange={this.handleChange}
                    />
                    <hr />
                    <SortableContainer useDragHandle>
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {selectedFields.sort((a, b) => a.priority > b.priority).map((item, index) => (
                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                  {(provided, snapshot) => (
                                    <React.Fragment>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, item.color)}
                                      >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Menu style={{ fontSize: 40 }} />
                                          <TextField
                                            id="outlined-number"
                                            label={item.title}
                                            value={`Mô tả trường: ${item.description}`}
                                            type="textField"
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ width: '100%' }}
                                            placeholder={item.description}
                                          />
                                          <div
                                            style={{
                                              width: 100,
                                              display: 'flex',
                                              justifyContent: 'space-evenly',
                                            }}
                                          >
                                            <Edit className={classes.iconEdit} onClick={() => this.handleSettingField(item.name)} />
                                            <Delete className={classes.iconDelete} onClick={() => this.handleRemove(item.name)} />
                                          </div>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </SortableContainer>
                  </Paper>
                  <Paper>
                    <div style={{ padding: 20 }}>
                      <span>Người sở hữu</span>
                      <AsyncSelect
                        onChange={selectedOption => {
                          this.handleChangeSelect(selectedOption);
                        }}
                        placeholder="Người sở hữu"
                        styles={customStyles}
                        defaultOptions
                        value={this.people}
                        // style={{ border: 'red' }}
                        // isMulti
                        theme={theme => ({
                          ...theme,
                          spacing: {
                            ...theme.spacing,
                            controlHeight: '55px',
                          },
                        })}
                        loadOptions={(inputValue, callback) => {
                          promiseOptions(inputValue, callback);
                        }}
                      />
                      <span style={{ color: 'red' }}>{this.state.people.length > 0 ? '' : 'Bắt buộc chọn Người Sở Hữu'}</span>
                    </div>
                    {background.file !== undefined ? (
                      <TextField
                        variant="outlined"
                        label="Ảnh nền(đuôi PNG,JPG)"
                        value={background.file}
                        fullWidth
                        className={classes.textFieldOutlet}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={() => {
                                  window.open(background.file);
                                }}
                              >
                                <CloudDownload />
                              </IconButton>
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={() => {
                                  background.file = undefined;
                                  this.setState({ background });
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        label="Ảnh nền(đuôi PNG,JPG)"
                        className={classes.textFieldOutlet}
                        type="file"
                        value={background.file === undefined ? '' : background.file}
                        onChange={event => {
                          this.state.count++;
                          if (event.target.value.toUpperCase().includes('.PNG') || event.target.value.toUpperCase().includes('.JPG')) {
                            background.file = event.target.value;
                            background.selectFile = event.target.files[0];
                            this.meetingFile = event.target.files[0];
                            this.setState({ background });
                          } else {
                            background.file = undefined;
                            this.setState({ background });
                            alert('Định dạng file không đúng!');
                          }
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  </Paper>
                  {/* <TextField
                    value={description}
                    name="description"
                    multiline
                    rowsMax="4"
                    className={classes.textField}
                    placeholder="Mô tả biểu mẫu"
                    onChange={this.handleChange}
                  /> */}
                  {type === 'edit' ? (
                    <Paper style={{ marginTop: 20 }}>
                      <Tabs value={tab} onChange={this.handleChangeTab} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Mã nhúng" />
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Link" />
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Nút" />
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Html" />
                      </Tabs>
                      {tab === 0 && (
                        <TextField
                          multiline
                          rowsMax="20"
                          disabled
                          value={`<script id="cni-form" >
                        (function (w, d, u, b) {
                          w['CNIFormObject'] = b; w[b] = w[b] || function () {
                            arguments[0].ref = u;
                            (w[b].forms = w[b].forms || []).push(arguments[0])
                          };
                            if (w[b]['forms']) return;
                            var s = d.createElement('script'); s.async = 1; s.src = u + '?' + (1 * new Date());
                            var h = d.getElementsByTagName('script')[0];
                            h.parentNode.insertBefore(s, h);
                          })(window, document, '${APP_URL}/static/js/form_loader.js', 'cnivnForm');
                          cnivnForm({"id":"${
                            contactCenter ? contactCenter._id : ''
                          }","base_url":"${APP_URL}","lang":"vn","sec":"iudj6m","type":"inline"});
                    </script>`}
                          variant="outlined"
                          className={classes.textField}
                          placeholder="Mô tả biểu mẫu"
                        />
                      )}
                      {tab === 1 && (
                        <div>
                          <TextField
                            multiline
                            rowsMax="10"
                            disabled
                            value={`${APP_URL}/ren/form/${contactCenter ? contactCenter._id : ''}`}
                            variant="outlined"
                            className={classes.textField}
                            placeholder="Mô tả biểu mẫu"
                          />
                          <Button
                            onClick={this.handleEmailDialog}
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: '1.3rem', marginBottom: '1rem' }}
                          >
                            Gửi mail CTV
                          </Button>
                          <EmailDialog
                            dialogEmail={this.state.dialogEmail}
                            setDialogEmail={this.setDialogEmail}
                            sendMail={this.sendMailCustomer}
                            mail={this.state.mail}
                            setMail={this.setMail}
                            state={this.state.states}
                            setState={this.setStates}
                            deleteFile={this.deleteFile}
                            hideRecipient={true}
                            clear={this.clear}
                          />
                        </div>
                      )}
                      {tab === 2 && (
                        <TextField
                          multiline
                          rowsMax="20"
                          disabled
                          value={`<script id="cni-form" >
                    (function (w, d, u, b) {
                      w['CNIFormObject'] = b; w[b] = w[b] || function () {
                        arguments[0].ref = u;
                        (w[b].forms = w[b].forms || []).push(arguments[0])
                      };
                        if (w[b]['forms']) return;
                        var s = d.createElement('script'); s.async = 1; s.src = u + '?' + (1 * new Date());
                        var h = d.getElementsByTagName('script')[0];
                        h.parentNode.insertBefore(s, h);
                      })(window, document, '${APP_URL}/static/js/form_loader.js', 'cnivnForm');
                      cnivnForm({"id":"${
                        contactCenter ? contactCenter._id : ''
                      }","base_url":"${APP_URL}","lang":"vn","sec":"iudj6m","type":"button"});
                </script>`}
                          variant="outlined"
                          className={classes.textField}
                          placeholder="Mô tả biểu mẫu"
                        />
                      )}
                    </Paper>
                  ) : null}
                  {tab === 3 && (
                    <TextField
                      multiline
                      rowsMax="20"
                      disabled
                      value={this.state.dataHtml}
                      variant="outlined"
                      className={classes.textField}
                      placeholder="Mô tả biểu mẫu"
                    />
                  )}
                  {openDialog ? (
                    <DialogSettingFiled
                      handleChangeSettingField={this.handleChangeSettingField}
                      handleSelectDialogSetting={this.handleSelectDialogSetting}
                      {...this.props}
                      currentFields={currentFields}
                      openDialog={openDialog}
                    />
                  ) : null}
                </Grid>
                <Grid item xs={3}>
                  <RightContactCenter handleSelect={this.handleSelect} fields={fields} />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ContactCenterFormPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contactCenterFormPage: makeSelectContactCenterFormPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    onAddContactCenter: body => {
      dispatch(addContactCenterAction(body));
    },
    onEditContactCenter: body => {
      dispatch(editContactCenterAction(body));
    },
    onGetContactCenter: id => {
      dispatch(getContactCenterByIdAction(id));
    },
    onGetEmployeeByIds: query => {
      dispatch(getEmployeeByIdAction(query));
    },
    // onSendLinkCTV: body => {
    //   dispatch(sendLinkCTV(body));
    // },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contactCenterFormPage', reducer });
const withSaga = injectSaga({ key: 'contactCenterFormPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ContactCenterFormPage);
