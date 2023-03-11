import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'components/LifetekUi';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JsSIP from 'jssip';
import { configuration, SIP_URI } from './constants';
import { Fab, Avatar } from '@material-ui/core';
import RejectIcon from '@material-ui/icons/CallEnd';
import AnswerIcon from '@material-ui/icons/CallEnd';
import avatarDefault from '../../assets/img/default-avatar.png';
// import { makeSelectProfile } from 'containers/Dashboard/selectors';
import axios from 'axios';
import _ from 'lodash';
function generateRandom(maxLimit = 100) {
  let rand = Math.random() * maxLimit;
  rand = Math.floor(rand); // 99
  return rand;
}
const CallDialog = props => {
  const { profile } = props;
  const {sip_password_receiver,sip_uri_receiver} = profile
  const token = localStorage.getItem('token');
  //   const { onStartCall, call, open, onClose, profile, callConfig, receiver } = props;
  const [text, setText] = useState('');

  const [data, setData] = useState({});

  const [openCall, setOpenCall] = useState(false);
  const [caller, setCaller] = useState();
  const [counter, setCounter] = useState(0);
  const [showCounter, setShowCounter] = useState();
  const uaRef = useRef();
  const socketRef = useRef()
  const sessionRef = useRef();
  // const audioRef = useRef();
  const interval = useRef();
  useEffect(()=>{
    const socket = new JsSIP.WebSocketInterface('wss://sbcwrtchcm.ccall.vn:8080/ws');
    socketRef.current = socket
    console.log('socket', socket);
  },[])
  useEffect(() => {
    if(sip_password_receiver && sip_uri_receiver){
      try {
     
        console.log('profile', profile);
  
        const bwPhone = new JsSIP.UA({
          uri: (profile && profile.sip_uri_receiver) ,
          password: (profile && profile.sip_password_receiver) ,
          sockets: socketRef.current,
        });
        uaRef.current = bwPhone;
  
        uaRef.current.start();
        const nhacchuong = new Audio('/nhac.mp3');
        const nhacchuong1 = new Audio('/nhac1.mp3');
        const arr = [nhacchuong, nhacchuong1];
        var currentPlayedAudio;
        uaRef.current.on('newRTCSession', data => {
          console.log('data', data);
          var session = data && data.session;
          sessionRef.current = session;
          if (sessionRef.current.direction === 'incoming') {
            currentPlayedAudio = arr[generateRandom(arr.length)];
            if (currentPlayedAudio) {
              currentPlayedAudio.play();
            }
  
            let sessionData = data.session;
            console.log('incoming');
            setOpenCall(true);
            setText('Cuộc gọi đến...');
            setCaller(sessionData && sessionData._remote_identity && sessionData._remote_identity._display_name);
            // incoming call here
  
            sessionRef.current.on('accepted', () => {
              // the call has answered
              if (currentPlayedAudio) {
                currentPlayedAudio.pause();
                currentPlayedAudio.currentTime = 0;
              }
              console.log('accepted');
              setText('');
              startCounter();
            });
            sessionRef.current.on('confirmed', () => {
              if (currentPlayedAudio) {
                currentPlayedAudio.pause();
                currentPlayedAudio.currentTime = 0;
              }
              console.log('confirmed');
  
              // this handler will be called for incoming calls too
            });
            sessionRef.current.on('ended', () => {
              // the call has ended
              console.log('ended');
              setOpenCall(false);
              stopCounter();
              sessionRef.current && sessionRef.current.terminate();
            });
            sessionRef.current.on('failed', () => {
              // unable to establish the call
              if (currentPlayedAudio) {
                currentPlayedAudio.pause();
                currentPlayedAudio.currentTime = 0;
              }
              setOpenCall(false);
              stopCounter();
              console.log('failed');
              sessionRef.current && sessionRef.current.terminate();
  
              // this.setState({ openCall: false });
            });
            //   session.on('addstream', e => {
            //     console.log('addstream', e)
            //     // set remote audio stream (to listen to remote audio)
            //     // remoteAudio is <audio> element on page
            //     remoteAudio.src = window.URL.createObjectURL(e.stream);
            //     remoteAudio.play();
            //     console.log('addstream');
            //   });
  
            sessionRef.current.on('peerconnection', function(datax) {
              console.log('datax', datax);
              datax.peerconnection.addEventListener('addstream', function(e) {
                const remoteAudio = document.getElementById('audio-call');
                remoteAudio.srcObject = e.stream;
                remoteAudio.play();
              });
            });
         
            // Answer call
            // session.answer(callOptions);
  
            // Reject call (or hang up it)
          }
          // isTrue = false
        });
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [sip_uri_receiver,sip_password_receiver]);

  useEffect(() => {
    return () => {
      interval.current && clearInterval(interval.current);
      uaRef.current && clearInterval(uaRef.current);
      sessionRef.current && clearInterval(sessionRef.current);
      socketRef.current && clearInterval(socketRef.current)
    };
  }, []);

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
    return showCounter && Number.isInteger(counter) && ` ${minute}:${second}`;
  };
  return (
    <>
      <Dialog noClose maxWidth="xs" saveText="Nghe" open={openCall} style={{ position: 'relative' }}>
        <div style={{ display: 'none' }}>
          <audio  id="audio-call" />
          {/* <audio muted="false" id="nhac-chuong"><source src="/nhac.mp3" type="audio/mp3"></source></audio> */}
        </div>
        <div data-component="">
          <div style={{ alignContent: 'center' }}>
            <h4 style={{ fontWeight: 'bold', textAlign: 'center', color: '#ff7961' }}>{caller}</h4>
            <h5 style={{ textAlign: 'center' }}>Cuộc gọi đến</h5>
            <Avatar
              alt="Ảnh đại diện"
              src={data.avatar ? `${data.avatar}?allowDefault=true` : avatarDefault}
              style={{
                margin: 'auto',
                width: '150px',
                height: '150px',
              }}
            />
            <h5 style={{ textAlign: 'center', color: '#ff7961' }}>
              {text}
              {onShowCounter()}
            </h5>
          </div>
          <div className="buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Fab
              label="Answer"
              color="primary"
              onClick={() => {
                sessionRef.current &&
                  sessionRef.current.answer({
                    mediaConstraints: {
                      audio: true, // only audio calls
                      video: false,
                    },
                    rtcOfferConstraints: {
                      offerToReceiveAudio: 1,
                    },
                    sessionTimersExpires: 30000,
                  });
                startCounter();
              }}
            >
              <AnswerIcon color="#fff" />
            </Fab>
            <Fab
              label="Reject"
              color="secondary"
              onClick={() => {
                setOpenCall(false);
                stopCounter();
                sessionRef.current && sessionRef.current.terminate();
                uaRef.current && uaRef.current.current.terminate();
              }}
            >
              <RejectIcon color="#fff" />
            </Fab>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  // profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(CallDialog);
