/* eslint-disable eqeqeq */
/**
 *
 * AddEmailCampaign
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { compose } from 'redux';
import { Grid, Button, MenuItem, Checkbox, AppBar, Toolbar, IconButton } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Add, Close } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { TextField, Paper, Typography, Autocomplete, AsyncAutocomplete } from 'components/LifetekUi';
import { API_CUSTOMERS, API_USERS } from '../../config/urlConfig';
import makeSelectAddEmailCampaign from './selectors';
import { mergeData, getData, postData, getDefault, getCurrent } from './actions';
import reducer from './reducer';
import { injectIntl } from 'react-intl';
import messages from './messages';
import './style.scss';
import saga from './saga';
import CustomAppBar from 'components/CustomAppBar';

import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
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
export class AddEmailCampaign extends React.Component {
  state = { tab: 0 };

  componentDidMount() {
    this.props.getData();
    if (this.props.id === 'add') this.props.getDefault();
    else this.props.getCurrent(this.props.id);
  }

  handleTab(tab) {
    this.setState({ tab });
  }

  handleDateChange = value => {
    this.props.mergeData({ timer: value });
  };

  handleChangeSender = e => {
    this.props.mergeData({ sender: e.target.value });
  };

  handleTemplate = value => {
    this.props.mergeData({ form: value });
    this.setHtml(value.content);
  };

  setHtml = value => {
    EditorUtils.setHtml(this.editor.view, value);
  };

  selectCustomer = senderName => {
    this.props.mergeData({ senderName });
  };

  addItem = code => {
    const dataRenderLocal = JSON.parse(localStorage.getItem('crmSource')) || null
    const dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === code) : null
    if (dataRender) return dataRender.data;
    return [];
  };

  handleType = value => {
    this.props.mergeData({ type: value });
  };
  onGoBack = () => {
    this.props.propsAll.history.goBack();
  };

  render() {
    const { tab } = this.state;
    const { addEmailCampaign, intl } = this.props;
    const { timer, minute, active } = this.props.addEmailCampaign;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : ''} left round size="md">
        {props.children}
      </Buttons>
    );
    return (
      <div>
        {/* <AppBar className='HeaderAppBarEmailCampain'>
              <Toolbar>
                <IconButton
                  // className={addStock === "criteria" ? 'BTNClose' : ''}
                  className='BTNEmailCampain'
                  color="inherit"
                  variant="contained"
                  onClick={this.onGoBack}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {this.props.id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật' })}`}
                </Typography>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.onSaveData}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <CustomAppBar
          title={
            this.props.id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật' })}`
          }
          onGoBack={this.onGoBack}
          onSubmit={this.onSaveData}
        />
        <Paper style={{ marginTop: 40 }}>
          <Grid container>
            <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
              <Add />
              Thêm mới chiến dịch Email
            </h4>{' '}
            <Grid item md={12}>
              <TextField
                label="Tên chiến dịch"
                fullWidth
                onChange={e => this.props.mergeData({ name: e.target.value })}
                value={addEmailCampaign.name}
                style={{ padding: 10 }}
              />
              <TextField
                select
                label="Người gửi"
                fullWidth
                onChange={this.handleChangeSender}
                value={addEmailCampaign.sender}
                style={{ padding: 10 }}
              >
                <MenuItem key="1" value={1}>
                  Cá nhân
                </MenuItem>
                <MenuItem key="2" value={2}>
                  Nhóm
                </MenuItem>
              </TextField>
              {addEmailCampaign.sender == 1 ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', padding: 10 }}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label="Nhân viên"
                      onChange={this.selectCustomer}
                      url={API_USERS}
                      value={addEmailCampaign.senderName}
                    />
                  </div>
                  <TextField
                    style={{ width: '50%', padding: 10 }}
                    label="Email"
                    onChange={e => this.props.mergeData({ mail: e.target.value })}
                    value={addEmailCampaign.senderName.email ? addEmailCampaign.senderName.email : addEmailCampaign.mail}
                  />
                </div>
              ) : null}
              {addEmailCampaign.sender === 2 ? (
                <TextField
                  style={{ width: '50%', padding: 10 }}
                  label="Email"
                  onChange={e => this.props.mergeData({ mail: e.target.value })}
                  value={addEmailCampaign.mail}
                />
              ) : null}
              <Typography>Người nhận</Typography>
              {addEmailCampaign.totalSend === false ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '33%', padding: 10 }}>
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label="Nhóm khách hàng"
                      suggestions={this.addItem('S07')}
                      onChange={value => this.props.mergeData({ groupCustomer: value })}
                      value={addEmailCampaign.groupCustomer}
                      optionLabel="title"
                      optionValue="value"
                    />
                  </div>{' '}
                  <div style={{ width: '33%', padding: 10 }}>
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label="Loại khách hàng"
                      suggestions={this.addItem(CUSTOMER_TYPE_CODE)}
                      onChange={value => this.props.mergeData({ typeCustomer: value })}
                      value={addEmailCampaign.typeCustomer}
                      optionLabel="title"
                      optionValue="value"
                    />
                  </div>
                  <div style={{ width: '33%', padding: 10 }}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label="Khách hàng"
                      onChange={value => this.props.mergeData({ customer: value })}
                      url={API_CUSTOMERS}
                      value={addEmailCampaign.customer}
                    />
                  </div>
                </div>
              ) : null}
              <div style={{ padding: 10 }}>
                Gửi cho tất cả khách hàng
                <Checkbox
                  color="primary"
                  checked={addEmailCampaign.totalSend}
                  onChange={e => this.props.mergeData({ totalSend: e.target.checked })}
                />
              </div>
              <div style={{ padding: 10 }}>
                <Autocomplete
                  name="Chọn... "
                  label="Biểu mẫu Email"
                  suggestions={addEmailCampaign.templates}
                  onChange={value => this.handleTemplate(value)}
                  value={addEmailCampaign.form}
                  optionLabel="title"
                />
              </div>
              <TextField
                label="Tiêu đề gửi Email"
                fullWidth
                onChange={e => this.props.mergeData({ title: e.target.value })}
                value={addEmailCampaign.title}
                style={{ padding: 10 }}
              />
              <h4>Nội dung gửi Email</h4>
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
                  [Link, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 300 }}
                contentElement={addEmailCampaign.content}
                ref={editor => (this.editor = editor)}
              />
              <Typography>Cài đặt thời gian chiến dịch</Typography>
              <div>
                <Bt tab={0}>Hẹn giờ</Bt>
                <Bt tab={1}>Lặp lại sau n phút</Bt>
                <Bt tab={2}>Hàng ngày</Bt>
                <Bt tab={3}>Hàng tháng</Bt>
                <Bt tab={4}>Tùy chỉnh</Bt>
                {tab === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        inputVariant="outlined"
                        format="DD/MM/YYYY HH:mm"
                        value={timer}
                        onChange={value => this.handleDateChange(value)}
                        variant="outlined"
                        label="Thời gian"
                        margin="dense"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                ) : null}
                {tab === 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>phút một lần</Typography>
                  </div>
                ) : null}
                {tab === 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại mỗi ngày vào lúc:</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={addEmailCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>giờ</Typography>
                    <TextField
                      variant="outlined"
                      onChange={e => this.props.mergeData({ minute: e.target.value })}
                      type="number"
                      value={minute}
                      style={{ width: 150 }}
                    />
                    <Typography>phút</Typography>
                  </div>
                ) : null}

                {tab === 3 ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Lặp lại mỗi tháng vào ngày:</Typography>
                    <TextField variant="outlined" onChange={this.changeCostPrice} type="number" value={addEmailCampaign.day} style={{ width: 150 }} />
                    <Typography>lúc</Typography>
                    <TextField
                      variant="outlined"
                      onChange={this.changeCostPrice}
                      type="number"
                      value={addEmailCampaign.hours}
                      style={{ width: 150 }}
                    />
                    <Typography>giờ</Typography>
                    <TextField variant="outlined" onChange={this.changeCostPrice} type="number" value={minute} style={{ width: 150 }} />
                    <Typography>phút</Typography>
                  </div>
                ) : null}
              </div>
              Kích hoạt chiến dịch
              <Checkbox color="primary" checked={active} onChange={e => this.props.mergeData({ active: e.target.checked })} />
              {/* <div>
                <Button onClick={this.onSaveData} style={{ float: 'right', padding: '5px', margin: '5px' }} color="primary" variant="outlined">
                  Thực hiện
                </Button>
              </div> */}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  onSaveData = () => {
    const view = this.editor.view;
    const { addEmailCampaign } = this.props;
    const data = {
      name: addEmailCampaign.name,
      sender: addEmailCampaign.sender,
      senderName: addEmailCampaign.senderName,
      mail: addEmailCampaign.mail,
      receiver: { groupCustomer: addEmailCampaign.groupCustomer, typeCustomer: addEmailCampaign.typeCustomer, customer: addEmailCampaign.customer },
      form: addEmailCampaign.form,
      title: addEmailCampaign.title,
      content: EditorUtils.getHtml(view.state),
      formType: 'email',
      totalSend: addEmailCampaign.totalSend,
      timer: addEmailCampaign.timer,
      active: addEmailCampaign.active,
      callback: this.props.callback,
    };

    this.props.postData(data);
  };
}

AddEmailCampaign.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addEmailCampaign: makeSelectAddEmailCampaign(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    postData: data => dispatch(postData(data)),
    getDefault: () => dispatch(getDefault()),
    getCurrent: id => dispatch(getCurrent(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addEmailCampaign', reducer });
const withSaga = injectSaga({ key: 'addEmailCampaign', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddEmailCampaign);
