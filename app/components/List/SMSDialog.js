import React, { useRef, useState, useEffect } from 'react';
import { Fab as Fa, TextField as TextFieldUI, MenuItem } from '@material-ui/core';
import { SYS_CONF } from '../../config/urlConfig';

import { TextField, Dialog as DialogUI } from 'components/LifetekUi';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import NumberFormat from 'react-number-format';
import { convertTemplate } from '../../helper';

const SMSDialog = props => {
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

  const { setDialogSMS, sendSMS, dialogSMS, SMS, setSMS, state, setState, call } = props;
  const { templatess } = state;
  const editor = useRef();
  const [requiredNumber, setRequiredNumber] = useState(false);
  const [brandName, setBrandName] = useState(false);
  const [smsConfig, setSmsConfig] = useState();
  const [text, setText] = useState('');
  const onSetSMS = e => {
    setSMS({ ...SMS, to: e.target.value });
  };
  useEffect(() => {
    fetch(`${SYS_CONF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let newData = data && data.smsConfig;
        let filterData = [];
        newData.map(value => {
          if (value.smsBrandname !== undefined && value.smsBrandname !== null && value.smsBrandname !== '') {
            console.log('vao', value);
            filterData.push(value);
          }
        });
        console.log('filterData', filterData);
        setSmsConfig(filterData);
      });
  }, []);
  useEffect(
    () => {
      if (SMS.to) {
        if (SMS.to.length > 11 || SMS.to.length < 10) {
          setRequiredNumber(true);
        } else {
          setRequiredNumber(false);
        }
      }
    },
    [SMS],
  );
  return (
    <DialogUI
      title="SMS"
      //  onSave={sendSMS}
      // onSave={() => sendSMS({ content: EditorUtils.getHtml(editor.current.view.state) }, brandName)}
      onSave={() => sendSMS(SMS.text, brandName)}
      saveText="Gửi SMS"
      onClose={() => {
        setDialogSMS(false);
        setState({ ...state, template: '' });
      }}
      open={dialogSMS}
    >
      {/* <DialogTitle style={{ textAlign: 'center' }}>SMS</DialogTitle> */}

      <Grid container alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid xs={2} item alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
          <Grid item>Người nhận</Grid>
          <Grid item>
            <AccountCircle style={{ marginRight: 15 }} />
          </Grid>
        </Grid>
        <Grid xs={10}>
          <NumberFormat
            error={requiredNumber || !SMS.phoneNumber}
            helperText={SMS.phoneNumber === '' ? 'Không được bỏ trống' : requiredNumber == true ? 'Số điện thoại từ 10 đến 11 số' : ''}
            label="Nhập số điện thoại"
            value={SMS.phoneNumber}
            onChange={onSetSMS}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            customInput={TextField}
            allowNegative={false}
            decimalSeparator={null}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid xs={2} item alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
          <Grid item>Brandname</Grid>
        </Grid>
        <Grid xs={10}>
          <TextField
            value={brandName}
            fullWidth
            select
            error={!brandName}
            helperText={brandName ? false : 'Không được bỏ trống'}
            onChange={e => {
              setBrandName(e.target.value);
            }}
            label="Brandname"
            InputLabelProps={{ shrink: true }}
          >
            {smsConfig &&
              smsConfig.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.smsBrandname}>
                    {item.smsBrandname}
                  </MenuItem>
                );
              })}
          </TextField>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid item>Nội dung SMS</Grid>

        <Grid xs={10}>
          {/* <TextField
            error={props.SMS && !props.SMS.text}
            helperText={props.SMS && props.SMS.text ? false : 'Không được bỏ trống'}
            value={props.SMS && props.SMS.text}
            fullWidth
            label="SMS"
            multiline
            rows={8}
            placeholder="Nhập nội dung"
            onChange={e => {
              setSMS({ ...SMS, text: e.target.value });
            }}
          /> */}
          <TextField
            error={!state.template}
            helperText={state.template ? false : 'Không được bỏ trống'}
            value={state.template}
            fullWidth
            select
            onChange={e => {
              const { value } = e.target;
              const { content } = templatess.find(e => e._id === value);
              convertTemplate({
                content,
                data: props.SMS && props.SMS.to ? props.SMS.to.originItem : [],
                code: state.templatess[0].moduleCode,
              }).then(template => {
                // TextFieldUI.setHtml(editor.current.view, template);
                setText(template);
                setState({ ...state, template: value });
                if (template.charAt(0) === '<') {
                  EditorUtils.setHtml(editor.current.view ? editor.current.view : '', template);
                }
                const rawText = template;
                setSMS({ ...SMS, text: rawText });
              });
            }}
            label="Biểu mẫu"
          >
            {templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {text.charAt(0) === '<' &&
        state.template && (
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
            contentElement={text}
            ref={editor}
          />
        )}

      {text.charAt(0) !== '<' &&
        state.template && (
          <TextField
            error={!SMS.text}
            helperText={SMS.text ? false : 'Không được bỏ trống'}
            onChange={e => setSMS({ ...SMS, text: e.target.value })}
            value={SMS.text}
            label="Văn bản"
            fullWidth
            // label="Text"
            multiline
            rows={8}
            placeholder="Nhập nội dung"
          />
        )}
    </DialogUI>
  );
};

export default SMSDialog;
