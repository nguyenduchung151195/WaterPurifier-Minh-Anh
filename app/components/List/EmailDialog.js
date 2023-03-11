import React, { useEffect, useRef, useState } from 'react';
import { Fab as Fa, TextField as TextFieldUI, MenuItem, Tooltip } from '@material-ui/core';
import { Delete, CloudUpload } from '@material-ui/icons';
import { API_CUSTOMERS, API_USERS } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete, Autocomplete } from 'components/LifetekUi';
// import dot from 'dot-object';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { convertTemplate } from '../../helper';
import { clearWidthSpace } from '../../utils/common';
import './CustomCSS.css';

const EmailDialog = props => {
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

  const { setDialogEmail, sendMail, dialogEmail, mail, setMail, state, setState, deleteFile, call, arrLocal } = props;
  const { templatess } = state;
  
  const [typeSend, setTypeSend] = useState(null);
  const editor = useRef();
  useEffect(
    () => {
      if (typeSend === 2) {
        setMail({ ...mail, send: null });
      }
    },
    [typeSend],
  );
  return (
    <DialogUI
      title="EMAIL"
      onSave={() => {
        if ((mail.subject !== '', state.template !== '')) {
          // console.log(1111, mail.subject);
          sendMail({ content: EditorUtils.getHtml(editor.current.view.state) });
        }
      }}
      saveText="Gửi mail"
      onClose={() => {
        setDialogEmail(false);
        props.clear ? props.clear() : null;
      }}
      open={dialogEmail}
      style={{ position: 'relative' }}
    >
      <TextField
        value={typeSend}
        fullWidth
        select
        error={!typeSend}
        helperText={!typeSend ? false : 'Không được bỏ trống'}
        onChange={e => {
          setTypeSend(e.target.value);
        }}
        label="Chọn người gửi"
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value={1}>Cá nhân</MenuItem>
        <MenuItem value={2}>Hệ thống</MenuItem>
      </TextField>
      {typeSend === 1 ? (
        !props.hideRecipient ? (
          <AsyncAutocomplete
            error={!mail.send && typeSend}
            helperText={typeSend && mail.send ? false : 'Không được bỏ trống'}
            url={API_USERS}
            value={mail.send}
            onChange={value => {
              setMail({ ...mail, send: value });
            }}
            label="Người gửi"
          />
        ) : null
      ) : null}

      {!props.hideRecipient ? (
        <AsyncAutocomplete
          error={!mail.to || !mail.to.length}
          helperText={mail.to && mail.to.length ? false : 'Không được bỏ trống'}
          url={API_CUSTOMERS}
          value={mail.to}
          isMulti
          onChange={value => setMail({ ...mail, to: value })}
          label="Người nhận"
        />
      ) : null}
      <Autocomplete
        onChange={value => {
          setMail({ ...mail, localPersonInfo: value });
        }}
        suggestions={arrLocal}
        value={mail.localPersonInfo}
        label="Người đầu mối"
        isMulti
      />
      <TextField
        error={!mail.subject}
        helperText={mail.subject ? false : 'Không được bỏ trống'}
        onChange={e => setMail({ ...mail, subject: (e.target.value = clearWidthSpace(e.target.value).trimStart()) })}
        value={mail.subject}
        fullWidth
        label="Tiêu đề"
      />
      <TextField
        error={!state.template}
        helperText={state.template ? false : 'Không được bỏ trống'}
        value={state.template}
        fullWidth
        select
        onChange={e => {
          const { value } = e.target;
          const { content } = templatess.find(e => e._id === value);
          console.log( 'templatess',templatess);

          console.log( 'content',content);
          console.log( 'props.mail.to',props.mail.to);

          convertTemplate({
            content,
            data: props.mail.to[0] ? (props.mail.to[0].originItem ? props.mail.to[0].originItem : props.mail.to[0]) : {},
            code: templatess[0].moduleCode,
          })
            .then(template => {
              EditorUtils.setHtml(editor.current.view, props.hideRecipient ? content : template);
              setState({ ...state, template: value });
            })
            .catch((err)=>{
              console.log('err',err);
            });
        }}
        label="Mẫu Email"
      >
        {templatess.map(item => (
          <MenuItem key={item._id} value={item._id}>
            {item.title}
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
        ref={editor}
      />

      {/* <Tooltip title="Đính kèm file">
        <label
          htmlFor="contained-button-file"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '5px',
            cursor: 'pointer',
            marginLeft: '20px',
            padding: '6px 30px',
            border: '1px solid #359ff4',
            borderRadius: '4px',
            color: '#359ff4',
          }}
        >
          <CloudUpload />
        </label>
      </Tooltip> */}

      {state.files.map((i, v) => (
        <React.Fragment>
          <p style={{ padding: '0px', margin: '0px' }}>
            <span style={{ fontWeight: 'bold' }}>{i.name}</span>
            <span>
              <Tooltip title="Xóa file">
                <Delete onClick={() => deleteFile(v)} style={{ cursor: 'pointer', marginLeft: 20, color: '#f5594d' }} />
              </Tooltip>
            </span>
          </p>
        </React.Fragment>
      ))}
    </DialogUI>
  );
};

export default EmailDialog;
