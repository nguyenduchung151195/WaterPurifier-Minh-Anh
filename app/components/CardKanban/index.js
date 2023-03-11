/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * CardKanban
 *
 */

import React, { useState, useEffect } from 'react';
import { Email, Call, Message, Notifications, InsertCommentOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatNumber } from '../../utils/common';
import ViewContent from '../ViewContent/Loadable';
import Dialog from '../../components/LifetekUi/Dialog';
// import styled from 'styled-components';

const CardKanban = props => {
  const [allowAdd, setAllowAdd] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(
    () => {
      if (props.role && props.role.find(item => item.codeModleFunction === props.code)) {
        const roleCode = props.role.find(item => item.codeModleFunction === props.code);
        const roleModule = roleCode.methods ? roleCode.methods : [];
        setAllowAdd((roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow);
        setAllowEdit((roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow);
      }
    },
    [props.role],
  );
  const handleClick = () => {
    setOpenModal(true);
  };
  const handleCloseEdit = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div
        style={{
          whiteSpace: 'pre-line',
          color: '#1d1d1f',
          padding: '10px',
          width: '300px',
          display: 'flex',
          boxShadow: 'rgb(82 63 104 / 6%) 0px 5px 5px -3px, rgb(82 63 104 / 4%) 0px 8px 10px 1px, rgb(82 63 104 / 4%) 0px 3px 14px 2px',
        }}
        className="mr-1 my-1 "
      >
        <div style={{ width: '88%', margin: 0, padding: 0 }}>
          <header
            style={{
              whiteSpace: 'none !important',
              borderBottom: `1px solid #eee`,
              // paddingBottom: 6,
              // marginBottom: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              color: props.cardColor,
            }}
          >
            {allowEdit ? (
              <div
                onClick={props.onClick}
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  // display: '-webkit-box',
                  overflow: 'hidden',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  // WebkitBoxOrient: 'vertical',
                  // WebkitLineClamp:'2',
                }}
              >
                {props.title ? `${props.title.length > 40 ? `${props.title.slice(0, 40)}...` : `${props.title}`}` : ''}
              </div>
            ) : (
              <div
                onClick={handleClick}
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  // display: '-webkit-box',
                  overflow: 'hidden',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  // WebkitBoxOrient: 'vertical',
                  // WebkitLineClamp:'2',
                }}
              >
                {props.title ? `${props.title.length > 40 ? `${props.title.slice(0, 40)}...` : `${props.title}`}` : ''}
              </div>
            )}
          </header>
          <div style={{ fontSize: 13, display: 'flex' }}>
            <div style={{ width: '90%', position: 'relative' }}>
              {props.customContent && props.customContent.length > 0
                ? props.customContent.map(item => {
                    return (
                      <p style={{ textAlign: 'left', color: '#1d1d1f' }}>
                        {item.title}
                        {': '}
                        {props.data[item.fieldName] ? (
                          <span>
                            {props.data[item.fieldName]
                              ? item.type === 'number'
                                ? formatNumber(props.data[item.fieldName])
                                : item.type === 'date'
                                  ? moment(props.data[item.fieldName]).format('DD/MM/YYYY')
                                  : item.type === 'array'
                                    ? props.data[item.fieldName].join()
                                    : props.data[item.fieldName]
                              : ''}
                          </span>
                        ) : (
                          ''
                        )}{' '}
                      </p>
                    );
                  })
                : ''}
            </div>
          </div>
          <div
            style={{ fontSize: 13, display: 'flex' }}
            onClick={() => {
              props.callBack('CommentDialog', props.id);
            }}
          >
            {props.action.includes('comment') ? (
              <div className="footer-kanban-item">
                <button type="button" className="footer-kanban-item-time">
                  <Notifications style={{ fontSize: '1rem' }} /> {/* data.endDate */}
                  {new Date(props.data && props.data.createdAt).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
                </button>
                {/* onClick={() => openDialog(data)} */}
                <InsertCommentOutlined style={{ cursor: 'pointer' }} />
                {/* <Join joins={data.join} /> */}
              </div>
            ) : (
              '1'
            )}
          </div>
        </div>
        <div style={{ width: '10%', margin: 0, padding: 0, whiteSpace: 'none !important' }}>
          {props.action.includes('email') ? (
            <Email
              onClick={() => {
                props.customActions.forEach(item => {
                  if (String(item.action) === 'email') {
                    props.customClick(props.id, item.params);
                  }
                });
              }}
              color={props.action.includes('email') ? 'primary' : ''}
            />
          ) : null}
          {props.action.includes('call') ? (
            <Call
              onClick={() => {
                props.customActions.forEach(item => {
                  if (String(item.action) === 'call') {
                    props.customClick(props.id, item.params);
                  }
                });
              }}
              color={props.action.includes('call') ? 'primary' : ''}
            />
          ) : null}
          {props.action.includes('sms') ? (
            <Message
              onClick={() => {
                props.customActions.forEach(item => {
                  if (String(item.action) === 'sms') {
                    props.customClick(props.id, item.params);
                  }
                });
              }}
              color={props.action.includes('sms') ? 'primary' : ''}
            />
          ) : null}
        </div>
      </div>
      <Dialog
        title="Xem thông tin"
        // onSave={this.handleSaveData}
        onClose={handleCloseEdit}
        open={openModal}
        dialogAction={false}
      >
        <ViewContent code={props.code} id={props.id} />
      </Dialog>
    </>
  );
};

CardKanban.propTypes = {
  cardColor: PropTypes.any,
  // description: PropTypes.string,
  includes: PropTypes.func,
  action: PropTypes.array,
  title: PropTypes.string,
};

export default CardKanban;
