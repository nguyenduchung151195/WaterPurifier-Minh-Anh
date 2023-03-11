/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
// import content from './content';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Dialog, TextField, Paper, FileUpload } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
// import CKEditor from '@ckeditor/ckeditor5-react';
import CustomAppBar from 'components/CustomAppBar';

// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { injectIntl } from 'react-intl';
import messages from './messages';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate } from './actions';
const newsTypes = [{ title: 'Tin tức', value: 'tin-tuc' }, { title: 'Topic', value: 'topic' }, { title: 'Album', value: 'album' }];
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
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
  }

  saveTemplate = () => {
    const view = this.editor.view;
    const id = this.props.match.params.id;
    const templateData = this.props.addTemplatePage;
    const data = {
      title: templateData.title,
      content: EditorUtils.getHtml(view.state),
      type: templateData.type,
    };
    if (id === 'add') this.props.postTemplate(data);
    else this.props.putTemplate(id, data);
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
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

  handleChangeTemplate = e => {
    const {
      target: { value, name },
    } = e;
    this.setState(prevState => ({ ...prevState, [name]: value }));
    if (value) {
      const { content } = value;
      const view = this.editor.view;
      EditorUtils.setHtml(view, content);
    }
  };

  // onGoBack () {
  //   this.props && this.props.history && this.props.history.goBack();
  // };
  componentDidUpdate(preProp, preState) {
    const { classes, addTemplatePage, intl } = this.props;
    const { postTemplateSuccess } = addTemplatePage;
  }

  render() {
    const { classes, addTemplatePage, intl } = this.props;
    const id = this.props.match.params.id;
    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <CustomAppBar
            title={
              id === 'add'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Newsfeed' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Newsfeed' })}`
            }
            onGoBack={() => this.props.history.goBack()}
            onSubmit={this.saveTemplate}
          />
          <Grid container>
            <Grid item md={12}>
              <TextField
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                required
                className={classes.textField}
                label="Tiêu đề"
                fullWidth
              />
              <TextField
                required
                className={classes.textField}
                label="Loại tin"
                value={addTemplatePage.type}
                select
                onChange={this.props.handleChange('type')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {newsTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
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
              {addTemplatePage._id ? <FileUpload name={addTemplatePage.title} id={addTemplatePage._id} code="NewsFeed" /> : null}
              {/* <Button onClick={this.saveTemplate} style={{ float: 'right', padding: '5px', margin: '5px' }} color="primary" variant="contained">
                Lưu lại
              </Button> */}
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addNewsFeed', reducer });
const withSaga = injectSaga({ key: 'addNewsFeed', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
