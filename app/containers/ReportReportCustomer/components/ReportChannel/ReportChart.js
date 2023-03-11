import React, { useEffect, memo, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';

// am4core.useTheme(Am4themesAnimated);

function createChart(id, data = []) {
  // Apply chart themes
  am4core.useTheme(Am4themesAnimated);
  am4core.useTheme(am4themes_kelly);

  // Create chart instance
  var chart = am4core.create('chartdiv', am4charts.XYChart3D);
  chart.fontSize = 11;
  // Add data
  //   console.log(data, 'data');
  //   console.log(listyear, 'listyear');
  let dataa = [];
  data.map(el => {
    dataa.push({
      grossRevenue: el && el.grossRevenue ? el.grossRevenue : 0,
      netRevenue: el && el.netRevenue ? el.netRevenue : 0,
      realRevenue: el && el.realRevenue ? el.realRevenue : 0,
      namee: el && el.name,
    });
  });
  chart.data = dataa;
  // console.log(chart.data, 'data');

  // Create axes
  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = 'namee';
  {
    data.length > 5 && data.length <= 10   
      ? (categoryAxis.end = 0.5) 
      : (
        <div>
          {data.length > 10 && data.length <= 15 
            ? (categoryAxis.end = 0.25 )
            : (
              <div>
                {data.length > 15 ? categoryAxis.end = 0.1 : null}
              </div>
            )
          }
        </div>
      )
  }
  // categoryAxis.title.text = "Countries";

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  // valueAxis.title.text = "Litres sold (M)";

  // Create series
  var series = chart.series.push(new am4charts.ColumnSeries3D());
  series.dataFields.valueY = 'grossRevenue';
  series.dataFields.categoryX = 'namee';
  series.name = 'DOANH THU GỘP';
  series.tooltipText = '{name}: [bold]{valueY}[/]';

  var series2 = chart.series.push(new am4charts.ColumnSeries3D());
  series2.dataFields.valueY = 'realRevenue';
  series2.dataFields.categoryX = 'namee';
  series2.name = 'DOANH THU THỰC';
  series2.tooltipText = '{name}: [bold]{valueY}[/]';

  var series3 = chart.series.push(new am4charts.ColumnSeries3D());
  series3.dataFields.valueY = 'netRevenue';
  series3.dataFields.categoryX = 'namee';
  series3.name = 'DOANH THU THUẦN';
  series3.tooltipText = '{name}: [bold]{valueY}[/]';

  // Add legend
  chart.legend = new am4charts.Legend();
  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  chart.scrollbarX = new am4core.Scrollbar();
  categoryAxis.renderer.cellStartLocation = 0.2;
  categoryAxis.renderer.cellEndLocation = 0.8;
  return chart;
}

export function ReportChart(props) {
  const [chart, setChart] = useState(null);
  const { id, data, isExport, onExportSuccess } = props;

  useEffect(
    () => {
      if (isExport && chart) {
        chart.exporting.export('png');
        onExportSuccess();
      }
    },
    [isExport],
  );

  useEffect(
    () => {
      const profitChart = createChart(id, data);
      //   console.log(listyear, 'listyear');
      setChart(profitChart);
      return () => {
        if (profitChart) {
          profitChart.dispose();
        }
      };
    },
    [data],
  );
  return <div id={id} {...props} />;
}
export default memo(ReportChart);
