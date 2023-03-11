/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React, { createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeSnackbar } from '../Dashboard/actions';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar } from '@material-ui/core';
import { Dialog, TextField, Paper, Autocomplete, TextareaAutosize } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import './style.scss';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate, getAllModuleCode } from './actions';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { te } from 'date-fns/locale';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import { API_COMMON_MODULE_WORKFLOW } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import axios from 'axios';
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

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

function PrintData({ data, column = 3 }) {
  if (!data.length) return <p>Không có viewConfig cho tham chiếu này</p>;
  const number = Math.ceil(data.length / column);
  const dataColumn = [];

  const count = column - 1;
  for (let index = 0; index <= count; index++) {
    switch (index) {
      case 0:
        dataColumn[index] = data.slice(0, number);
        break;
      case count:
        dataColumn[index] = data.slice(number * count, data.length);
        break;
      default:
        dataColumn[index] = data.slice(number * index, number * (index + 1));
        break;
    }
  }

  return (
    <React.Fragment>
      {dataColumn.map(item => (
        <List>
          {item.map(element => (
            <ListItem>{element}</ListItem>
          ))}
        </List>
      ))}
    </React.Fragment>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddTemplatePage extends React.Component {
  state = {
    modules: JSON.parse(localStorage.getItem('viewConfig')),
    copyTemplate: {},
    autocompletedata: '',
    autoCompleteType: '',
    autoCompleteTemplates: '',
    others: {},
    listModule: [],
    editEditor: '',
  };

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.moduleCode = React.createRef();
    // console.log(this.state.autocompletedata)
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
    this.props.getAllModuleCode();
    axios
      .get(`${API_COMMON_MODULE_WORKFLOW}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(data => {
        Object.values(data.data).map(item => {
          this.state.listModule.push(item);
        });
      })
      .catch(function(error) {
        console.log('lỗi rồi', error);
      });
  }
  componentWillReceiveProps(props) {
    const id = props.match.params.id;
    const newContent = props.addTemplatePage.content.charAt(0);
    if (props && props.addTemplatePage && id !== 'add') {
      props.addTemplatePage.others && this.setState({ others: props.addTemplatePage.others });
      props.addTemplatePage.templateTypes &&
        props.addTemplatePage.templateTypes.forEach(element => {
          if (element._id === props.addTemplatePage.categoryDynamicForm && id !== 'add') {
            this.setState({ autoCompleteType: element.title, idTypeTemplate: element._id });
          }
        });
    }
    props.addTemplatePage.templates &&
      props.addTemplatePage.templates.forEach(element => {
        if (element._id === props.addTemplatePage._id && id !== 'add') {
          this.setState({ autoCompleteTemplates: element.title, idTemplate: element.title });
        }
      });
    // this.state.modules.forEach(element => {
    //   if (element.code === props.addTemplatePage.moduleCode && id !== 'add') {
    //     this.setState({
    //       autocompletedata:
    //         props.addTemplatePage && props.addTemplatePage.modules && props.addTemplatePage.modules[element.code]
    //           ? props.addTemplatePage.modules[element.code].title
    //           : element.code,
    //       codeModules: element.code,
    //     });
    //   }
    // });
    // console.log(444, this.state.listModule);
    // console.log(5555, props.addTemplatePage);
    this.state.listModule.forEach(element => {
      if (element.code === props.addTemplatePage.moduleCode && id !== 'add') {
        this.setState({
          autocompletedata:
            props.addTemplatePage && props.addTemplatePage.modules && props.addTemplatePage.modules[element.code]
              ? props.addTemplatePage.modules[element.code].title
              : element.code,
          codeModules: element.code,
        });
      }
    });
    if (newContent == '<') {
      this.setState({
        editEditor: 2,
      });
    } else {
      this.setState({
        editEditor: 1,
      });
    }
  }

  saveTemplate = () => {
    const view = this.editor && this.editor.view ? this.editor.view : '';
    const id = this.props.match.params.id;
    const templateData = this.props.addTemplatePage;
    const data = {
      title: templateData.title,
      categoryDynamicForm: this.state.idTypeTemplate,
      content: this.state.editEditor === 1 ? templateData.textEditor : EditorUtils.getHtml(view.state),
      code: templateData.code,
      moduleCode: this.state.codeModules,
      clientId,
      filterField: this.state.filterField,
      filterFieldValue: this.state.filterFieldValue,
      others: this.state.others,
    };
    // this.props.getAllTemplate();
    if (id === 'add') this.props.postTemplate(data);
    else {
      if (this.props.putTemplate(id, data)) {
      }
    }
    // this.props.history.goBack();
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      let dataExtra = extraFields.find(i => i.code === code);
      if (dataExtra) dataExtra = dataExtra.data;
      else dataExtra = [];
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const { filterField, filterFieldValue } = this.state;
      const newData = [
        ...viewArr.columns.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...viewArr.others.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...dataExtra,
      ];
      newData.forEach((item, index) => {
        const dt = prefix ? `{${prefix}.${item.name}} : ${item.title}` : `{${item.name}} : ${item.title}`;
        if (!ref) result[index] = dt;
        else if (item && item.type && item.type.includes('ObjectId')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.substring(9), item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item && item.type && item.type.includes('Array')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p>
              {`{${item.name}} :`}
              <span
                style={{ cursor: 'pointer', color: '#9c27b0', fontWeight: 'bold' }}
                onClick={() => this.referenceArray(item.type)}
                onKeyDown={this.handleKeyDown}
              >{`${item.title}`}</span>
            </p>
          );
        } else if (item && item.type && item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split("'")[3], item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type === 'extra')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#f47536', fontWeight: 'bold' }}>{dt}</p>
          );
        else if (item.type === 'required')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#e3165b', fontWeight: 'bold' }}>{dt}</p>
          );
        else result[index] = dt;
      });
    }
    return result;
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }
  // handleOtherDataChange = useCallback(
  //   newOther => {
  //     setLocalState(state => ({ ...state, others: newOther }));
  //   },
  //   [localState],
  // );
  handleOtherDataChange = params => {
    // console.log(3333, state);
    // newOther => {
    this.setState({ others: params });
    // }
  };
  handleChangeTemplate = e => {
    if (e.content) {
      const { content } = e.content;
      const view = this.editor.view ? this.editor.view : '';
      EditorUtils.setHtml(view, content);
    }
    this.setState({ autoCompleteTemplates: e.title, idTemplate: e.title, content: e.content });
  };
  onGoBack = () => {
    // window.location.reload();
    // this.props.getAllTemplate();
    this.props.history.goBack();
  };

  handleChangeAutocomplete = e => {
    console.log(55555, e);
    this.setState({ autocompletedata: e.title, codeModules: e.code });
    this.props.mergeData({ moduleCode: e.code });
  };
  handleChangeType = e => {
    this.setState({ autoCompleteType: e.title, idTypeTemplate: e.idTypeTemplate });
  };
  handleChangeTemplates = e => {
    this.setState({ autoCompleteTemplates: e.title, idTemplate: e.title });
  };
  render() {
    const { modules, filterField, autocompletedata, autoCompleteType, autoCompleteTemplates } = this.state;
    const { classes, addTemplatePage, intl } = this.props;
    const { templates } = addTemplatePage;
    const id = this.props.match.params.id;
    // console.log(33324444, this.state.listModule);
    let viewConfig = [];
    if (this.state.modules) {
      const data = this.state.modules.find(item => item.code === addTemplatePage.moduleCode);
      if (data) {
        viewConfig = data.listDisplay.type.fields.type.columns;
      }
    }

    let filterFieldConfig = {};
    if (filterField) {
      filterFieldConfig = viewConfig.find(i => i.name === filterField) || {};
    }
    const handleModules = () => {
      let arr = [];
      modules.map(item => {
        arr.push({
          title:
            addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code] ? addTemplatePage.modules[item.code].title : item.code,
          code: item.code,
        });
      });

      // console.log(33333, arr);
      return this.state.listModule;
    };
    const handleTypes = () => {
      let array = [];
      addTemplatePage.templateTypes.map(option => {
        array.push({ title: option.title, idTypeTemplate: option._id });
      });
      return array;
    };
    const handleTemplates = () => {
      let arrayTemplate = [];
      templates &&
        templates.map(template => {
          arrayTemplate.push({ title: template.title, idTemplate: template.title, content: template });
        });
      return arrayTemplate;
    };
    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <Dialog
            maxWidth="xs"
            dialogAction={false}
            title="Tham chieu array"
            open={addTemplatePage.arrayDialog}
            onClose={() => this.props.mergeData({ arrayDialog: false })}
          >
            <PrintData column={1} data={addTemplatePage.listItem} />
          </Dialog>
          <Dialog
            dialogAction={false}
            title="Bang tham chieu"
            open={addTemplatePage.dialogRef}
            onClose={() => this.props.mergeData({ dialogRef: false })}
          >
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
              <PrintData column={2} data={this.convertData(addTemplatePage.codeRef, false, addTemplatePage.name)} />
            </Grid>
          </Dialog>
          <Grid container>
            <Grid item md={12}>
              <CustomAppBar
                className
                title={
                  id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới biểu mẫu' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật biểu mẫu' })}`
                }
                onGoBack={this.onGoBack}
                onSubmit={this.saveTemplate}
              />
              <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
                <Edit /> Danh sách mẫu báo giá, hợp đồng
              </h4>{' '}
              <span style={{ fontWeight: 'normal' }}>(Các trường màu đỏ là cần nhập)</span>
              <h4>Thông tin các từ thay thế</h4>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
              <PrintData data={this.convertData(addTemplatePage.moduleCode)} />
            </Grid>
            <Grid style={{ padding: 5 }} container>
              <Grid item md={12}>
                <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
                <Typography>
                  <span style={{ fontStyle: 'italic' }}>Loại thường</span>
                </Typography>
                <Typography>
                  <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường tham
                  chiếu
                </Typography>
                <Typography>
                  <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
                </Typography>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Autocomplete
                className={classes.textField}
                name="Chọn... "
                label="Chọn biểu mẫu động mẫu"
                required
                optionLabel="title"
                optionValue="value"
                fullWidth
                value={{ title: autoCompleteTemplates }}
                onChange={this.handleChangeTemplate}
                suggestions={handleTemplates()}
              />
              <TextField
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                required
                className={classes.textField}
                label="Tiêu đề"
                fullWidth
                error={addTemplatePage.title ? '' : 'Không được để chống tiêu đề'}
                helperText={addTemplatePage.title ? '' : 'Không được để chống tiêu đề'}
              />
              <TextField
                value={addTemplatePage.code}
                onChange={this.props.handleChange('code')}
                required
                className={classes.textField}
                label="Mã"
                fullWidth
                error={addTemplatePage.code ? '' : 'Không được để chống mã'}
                helperText={addTemplatePage.code ? '' : 'Không được để chống mã'}
              />
              <Autocomplete
                className={classes.textField}
                name="Chọn... "
                label="Loại Mẫu"
                required
                optionLabel="title"
                optionValue="value"
                fullWidth
                value={{ title: autoCompleteType }}
                onChange={this.handleChangeType}
                suggestions={handleTypes()}
                error={autoCompleteType ? '' : 'Không được để chống Loại Mẫu'}
                helperText={autoCompleteType ? '' : 'Không được để chống Loại Mẫu'}
              />
              <Autocomplete
                className={classes.textField}
                name="Chọn... "
                label="Module"
                required
                optionLabel="title"
                optionValue="value"
                fullWidth
                value={{ title: autocompletedata }}
                onChange={this.handleChangeAutocomplete}
                suggestions={handleModules()}
              />
              <CustomGroupInputField
                code={'DynamicForm'}
                columnPerRow={3}
                value={this.state.others}
                onChange={params => this.handleOtherDataChange(params)}
              />
              <Grid container>
                <Grid item xs={6}>
                  {/* <TextField
                    id="select-filter-field"
                    select
                    onChange={e => {
                      this.setState({ filterField: e.target.value });
                    }}
                    value={this.state.filterField}
                    label="Trường dữ liệu phân loại"
                    name="filterField"
                    style={{ width: '100%' }}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    {viewConfig.map((item, index) => (
                      <MenuItem value={item.name} key={`${item.name}_${index}`}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </TextField> */}
                </Grid>
                <Grid item xs={6}>
                  <CustomInputField
                    value={this.state.filterFieldValue}
                    type={filterFieldConfig.type}
                    label={filterFieldConfig.title}
                    configType="crmSource"
                    configCode={filterFieldConfig.code}
                    configId={filterFieldConfig.id}
                    onChange={e => this.setState({ filterFieldValue: e })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInputBase
                    select
                    label={'Chọn trình soạn thảo'}
                    value={this.state.editEditor}
                    // checkedShowForm={checkShowForm.typeVoucher}
                    // required={checkRequired.typeVoucher}
                    // error={localMessages && localMessages.typeVoucher}
                    // helperText={localMessages && localMessages.typeVoucher}
                    name="editEditor"
                    onChange={e => this.setState({ editEditor: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <MenuItem value={1}>Nhập văn bản</MenuItem>
                    <MenuItem value={2}>Nhập trình soạn thảo</MenuItem>
                  </CustomInputBase>
                </Grid>
              </Grid>
              {this.state.editEditor === 1 && (
                <TextField
                  value={addTemplatePage.textEditor}
                  onChange={this.props.handleChange('textEditor')}
                  // className={classes.textField}
                  label="Văn bản"
                  fullWidth
                  multiline
                  rows={5}
                  // error={addTemplatePage.code ? '' : 'Không được để chống mã'}
                  // helperText={addTemplatePage.code ? '' : 'Không được để chống mã'}
                />
              )}
              {this.state.editEditor === 2 && (
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
                  contentElement={addTemplatePage.content}
                  ref={editor => (this.editor = editor)}
                />
              )}
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getAllModuleCode: () => dispatch(getAllModuleCode()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTemplatePage', reducer });
const withSaga = injectSaga({ key: 'addTemplatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
