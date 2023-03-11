import React, { memo, useState, useEffect, useCallback } from 'react';

import { Grid as GridMaterialUI } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import toVietNamDate from '../../helper';
import moment from 'moment';
import axios from 'axios';
import { API_APPROVE, API_COMMON, API_PERSONNEL, API_USERS, API_CUSTOMERS, API_TASK_PROJECT, API_CRM_CAMPAIGN } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import { CustomTreeData } from '@devexpress/dx-react-grid';

const TypographyDetail = ({ children, data }) => {
  return (
    <div className="task-info-detail">
      {console.log(children, data, ' cccjcjj')}
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
};
function ViewContentCampaign(props) {
  const { id } = props;
  const [dataInfor, setDataInfor] = useState(null);
  const dataInfo = dataInfor ? (dataInfor.length > 2 ? dataInfor.find(e => e._id === props.id) : dataInfor) : null;
  console.log('id', id);
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === 'crmCampaign');
  console.log('aaaaaa', list);
  let data = [];
  if (list) {
    data = list.listDisplay.type.fields.type.columns.filter(i => i.checked);
    console.log('dataaaaa', data);
  }

  useEffect(
    () => {
      fetch(`${API_CRM_CAMPAIGN}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setDataInfor(data);
        });
    },
    [props],
  );

  const customData = data => {
    const employee = personal ? personal.find(item => item._id === data) : null;
    console.log('personal', personal);
    console.log('employee', employee);
    console.log('data', data);

    return employee ? employee.name : '';
  };
  console.log('dataInfor', dataInfor);

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

export default memo(ViewContentCampaign);
