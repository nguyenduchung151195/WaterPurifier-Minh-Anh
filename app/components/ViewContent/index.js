import React, { memo, useState, useEffect, useCallback } from 'react';

import { Grid as GridMaterialUI } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import axios from 'axios';
import { API_APPROVE, API_COMMON, API_PERSONNEL, API_USERS, API_BILLS } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import { CustomTreeData } from '@devexpress/dx-react-grid';
import { supplierColumns, progressColumns, historyColumns, showMap, taskStatusArr, taskStageArr, clientId } from 'variable';
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
const TypographyDetail = ({ children, data }) => {
  if (children === 'TRẠNG THÁI KANBAN') {
    data = taskStatusArr[data - 1];
  }
  if (children === 'TRẠNG THÁI CV/DA') {
    data = taskStatusArr[data - 1];
  }
  if (children === 'ĐỘ ƯU TIÊN') {
    data = taskPrioty[data - 1];
  }
  if (children === 'TRẠNG THÁI KẾ HOẠCH') {
    data = taskStageArr[data - 1];
  }
  return (
    <div className="task-info-detail">
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
};
function ViewContent(props) {
  const [urlData, setUrlData] = useState([]);
  const [dataInfor, setDataInfor] = useState(props.dataInfo);
  const [personal, setPersonal] = useState(null);
  const dataInfo = dataInfor ? (dataInfor.length > 2 ? dataInfor.find(e => e._id === props.id) : dataInfor) : null;
  let code = '';
  if (props.code === 'Tas') {
    code = 'Task';
  } else {
    code = props.code;
  }
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === code);
  let data = [];
  if (list) {
    data = list.listDisplay.type.fields.type.columns.filter(i => i.checked);
  }

  useEffect(
    () => {
      let mdcode = '';
      let mdItem = '';
      let api = '';
      if (props.code === 'Tas') {
        mdcode = 'Task';
        mdItem = props.objectId ? props.objectId : props.id;
      } else {
        mdcode = props.code;
        mdItem = props.idItem ? props.idItem : props.id;
      }
      if (props.code === 'Bill') {
        api = `${API_BILLS}/${props.id}`
      }
      else api = `${API_COMMON}/${mdcode}/${mdItem}`;

      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          setDataInfor(res.data);
        })
        .catch(error => console.log(error, props, 'kkkk'));
    },
    [props.code, props.idItem, props.objectId],
  );

  useEffect(() => {
    const api = `${API_USERS}`;
    axios
      .get(api, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        setPersonal(res.data.data);
      })
      .catch(error => console.log(error, props, 'kkkk'));
  }, []);
  const customData = data => {
    const employee = personal ? personal.find(item => item._id === data) : null;

    return employee ? employee.name : '';
  };
  return (
    <div>
      <GridMaterialUI container>
        {dataInfo
          ? data.map(item => (
            <GridMaterialUI item xs={6}>
              <TypographyDetail
                data={
                  Array.isArray(dataInfo[item.name]) === true
                    ? dataInfo[item.name].length > 0
                      ? dataInfo[item.name]
                        .map(i => {
                          return typeof i === Object ? (i ? i.name : []) : i ? customData(i) : [];
                        })
                        .join(', ')
                      : []
                    : dataInfo[item.name]
                      ? dataInfo[item.name] && dataInfo[item.name].name
                        ? `${dataInfo[item.name].name}`
                        : dataInfo[item.name] && typeof dataInfo[item.name].search === 'function' && dataInfo[item.name].search('000Z') === -1
                          ? `${dataInfo[item.name]}`
                          : `${dataInfo[item.name]}`
                      : dataInfo[item.name]
                }
              >
                {item.title}
              </TypographyDetail>
            </GridMaterialUI>
          ))
          : null}
      </GridMaterialUI>
    </div>
  );
}

export default memo(ViewContent);
