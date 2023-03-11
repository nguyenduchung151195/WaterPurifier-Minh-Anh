import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'components/LifetekUi';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JsSIP from 'jssip';
import { configuration, SIP_URI } from './constants';
import { Fab, Avatar } from '@material-ui/core';
import RejectIcon from '@material-ui/icons/CallEnd';
import avatarDefault from '../../../images/default-avatar.png';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
import { API_CALL_HISTORY } from '../../../config/urlConfig';
import axios from 'axios';
const CallDialog = props => {
  const token = localStorage.getItem('token');
  const { onStartCall, call, open, onClose, profile, callConfig, receiver } = props;
  const [data, setData] = useState({});
  const [registered, setRegistered] = useState();
  const [text, setText] = useState();
  const [counter, setCounter] = useState(0);
  const [showCounter, setShowCounter] = useState();
  const uaRef = useRef();
  const sessionRef = useRef();
  const audioRef = useRef();
  const interval = useRef();

  // useEffect(() => {
  //   const existsReceivePhoneNumber = callConfig.find(c => c.isReceivePhoneNumber);
  //   if (existsReceivePhoneNumber) {
  //     const Newconfiguration = { uri: existsReceivePhoneNumber.sip_uri, password: existsReceivePhoneNumber.sip_password }
  //       if (uaRef.current && uaRef.current.isRegistered()) return;
  //       let socket = new JsSIP.WebSocketInterface(SIP_URI);
  //       let ua = new JsSIP.UA({ ...Newconfiguration, sockets: [socket], display_name: profile._id });
  //   }
  // }, [callConfig]);

  useEffect(() => {
    return () => {
      uaRef.current && uaRef.current.unregistered();
      interval.current && clearInterval(interval.current);
    };
  }, []);
  useEffect(
    () => {
      open && profile && profile._id && registered && receiver && onCall(receiver);
    },
    [open, registered, data, profile, receiver],
  );

  useEffect(
    () => {
      if (call && call._id && receiver && profile) {
        axios
          .post(API_CALL_HISTORY, { to: receiver, customer: call._id, sender: profile._id }, { headers: { Authorization: `Bearer ${token}` } })

          .catch(function(error) {
            console.log('lỗi rồi', error);
          });
      }

      call && setData(call);
    },
    [call],
  );

  useEffect(
    () => {
      open && onRegister();
    },
    [open],
  );

  const onRegister = () => {
    console.log('callConfig', callConfig);
    try {
      const Newconfiguration = { uri: callConfig && callConfig.uri, password: callConfig && callConfig.password };

      if (uaRef.current && uaRef.current.isRegistered()) return;
      let socket = new JsSIP.WebSocketInterface(SIP_URI);
      let ua = new JsSIP.UA({ ...Newconfiguration, sockets: [socket], display_name: profile._id });

      ua.on('registered', () => {
        console.log('registered');
        setRegistered(true);
      });
      ua.on('registrationFailed', () => {
        console.log('registrationFailed');
        setRegistered(false);
      });
      ua.on('unregistered', () => {
        console.log('unregistered');
        setRegistered(false);
      });
      ua.on('newRTCSession', e => {
        console.log('newRTCSession');
      });
      ua.start();
      uaRef.current = ua;
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateCall = state => {
    switch (state) {
      case 'confirmed':
        console.log(1, state);
        setText('Đang gọi');
        startCounter();
        break;
      case 'connecting':
        console.log(2, state);
        setText('Đang kết nối...');
        break;
      case 'in-progress':
        console.log(3, state);
        setText('Đang gọi...');
        onStartCall && onStartCall(sessionRef.current);
        break;
      case 'terminated':
        setText('Kết thúc cuộc gọi');
        stopCounter();
        onCloseDialog();
        break;
      default:
        break;
    }
  };

  const onCall = to => {
    let session;
    const eventHandlers = {
      addstream: function(e) {
        console.log('call addstream');
      },
      confirmed: function(e) {
        console.log('call confirmed');
        updateCall('confirmed');
      },
      ended: function(e) {
        console.log('call ended', e);
        updateCall('terminated');
        // uaRef.current.stop()
      },
      failed: function(e) {
        console.log('call failed', e);
        uaRef.current.stop();
        updateCall('terminated');
      },
      progress: function(e) {
        console.log('call is in progress');
        const { originator } = e;
        if (originator === 'remote') {
          updateCall('in-progress');
        }
      },
    };
    const options = {
      eventHandlers,
      sessionTimersExpires: 30000,
      mediaConstraints: { audio: true, video: false },
      rtcOfferConstraints: {
        offerToReceiveAudio: 1,
      },
    };

    updateCall('connecting');
    // session = uaRef.current.call('0368923930', options);
    session = uaRef.current.call(to, options);
    sessionRef.current = session;

    session.connection.onaddstream = function(e) {
      audioRef.current.srcObject = e.stream;
      audioRef.current.play();
    };
  };

  const onCloseDialog = () => {
    onClose();
    stopCounter();
    sessionRef.current && sessionRef.current.terminate();
  };

  const startCounter = () => {
    setCounter(0);
    setShowCounter(true);
    interval.current = setInterval(() => {
      setCounter(e => e + 1);
    }, 1000);
  };

  const stopCounter = () => {
    setShowCounter();
    interval.current && clearInterval(interval.current);
  };

  const onShowCounter = () => {
    const convert = e => (`${e}`.length === 1 ? `0${e}` : e);
    let minute = Math.floor(counter / 60);
    let second = counter % 60;
    minute = convert(minute);
    second = convert(second);
    return showCounter && Number.isInteger(counter) && `: ${minute}:${second}`;
  };
  return (
    <Dialog noClose maxWidth="xs" saveText="Gọi" open={open} style={{ position: 'relative' }}>
      <div style={{ display: 'none' }}>
        <audio ref={audioRef} id="audio-element" />
      </div>
      <div data-component="Incoming">
        <div style={{ alignContent: 'center' }}>
          <h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>{data.name}</h4>
          <h5 style={{ textAlign: 'center' }}>Cuộc gọi đi</h5>
          <Avatar
            alt="Ảnh đại diện"
            src={data.avatar ? `${data.avatar}?allowDefault=true` : avatarDefault}
            style={{
              margin: 'auto',
              width: '150px',
              height: '150px',
            }}
          />
          <h5 style={{ textAlign: 'center' }}>{receiver}</h5>
          <h5 style={{ textAlign: 'center', color: '#ff7961' }}>
            {text}
            {onShowCounter()}
          </h5>
        </div>
        <div className="buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
          {/* <Fab label="Answer" color="primary" onClick={() => { }}>
            <AnswerIcon color="#fff" />
          </Fab> */}
          <Fab label="Reject" color="secondary" onClick={onCloseDialog}>
            <RejectIcon color="#fff" />
          </Fab>
        </div>
      </div>
    </Dialog>
  );
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(CallDialog);
