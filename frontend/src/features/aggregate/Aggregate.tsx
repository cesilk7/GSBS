import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Chart from 'react-apexcharts';

const Aggregate: React.FC = () => {

  const state = {
    series: [{
      name: 'Calorie',
      type: 'column',
      data: [1400, 2000, 2500, 1500, 2400, 2800, 3100, 1900]
    }, {
      name: 'Dietary fiber',
      type: 'column',
      data: [31.1, 29.3, 34, 40, 38.2, 24.9, 36.5, 28.5]
    }, {
      name: 'Morning weight',
      type: 'line',
      data: [60, 62, 61.5, 63.1, 62.2, 61.1, 62.3, 64]
    }, {
      name: 'Night weight',
      type: 'line',
      data: [60.4, 62.8, 61.0, 62.1, 61.3, 60.7, 61.3, 62]
    }],
    options: {
      chart: {
        height: 350,
        // type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 2, 3, 3]
      },
      title: {
        text: 'XYZ - Stock Analysis (2009 - 2016)',
        // align: 'left',
        offsetX: 110
      },
      xaxis: {
        categories: ['2020/10/01', 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      },
      yaxis: [
        {
          seriesName: 'Calorie',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: 'rgb(0, 143, 251)',
          },
          labels: {
            style: {
              colors: 'rgb(0, 143, 251)',
            },
          },
          title: {
            text: "Calorie（kcal）",
            style: {
              color: 'rgb(0, 143, 251)',
            }
          }
        },
        {
          seriesName: 'Dietary fiber',
          min: 0,
          max: 100,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: 'rgb(0, 227, 150)'
          },
          labels: {
            style: {
              colors: 'rgb(0, 227, 150)',
            },
          },
          title: {
            text: "Dietary fiber（g）",
            style: {
              color: 'rgb(0, 227, 150)',
            }
          }
        },
        {
          seriesName: 'Morning weight',
          min: 55,
          max: 65,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019',
          },
          labels: {
            style: {
              colors: '#FEB019',
            }
          },
          title: {
            text: "Weight（kg）",
            style: {
              color: '#FEB019',
            }
          },
        },
        {
          show: false,
          seriesName: 'Night weight',
          min: 55,
          max: 65,
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        // horizontalAlign: 'left',
        offsetX: 40
      }
    },
  };

  return (
    <>
      <Chart options={state.options} series={state.series} type="line" width={1200} height={800} />
    </>
  );
};

export default Aggregate;
