import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Chart from 'react-apexcharts';

import {
  selectAggregateData,
  fetchAsyncGetAggregateData
} from './aggregateSlice';

const Aggregate: React.FC = () => {
  const dispatch = useAppDispatch();
  const aggregate_data = useAppSelector(selectAggregateData);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetAggregateData());
    }
    fetchBootLoader();
  }, [dispatch]);

  const state = {
    series: [{
      name: 'Calorie',
      type: 'column',
      data: aggregate_data.sum_calorie
    }, {
      name: 'Dietary fiber',
      type: 'column',
      data: aggregate_data.sum_dietary_fiber
    }, {
      name: 'Morning weight',
      type: 'line',
      data: aggregate_data.morning_weight
    }, {
      name: 'Night weight',
      type: 'line',
      data: aggregate_data.night_weight
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
        text: 'My health data（2021-10-03～）',
        // align: 'left',
        offsetX: 110
      },
      xaxis: {
        categories: aggregate_data.date,
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
            "formatter": function (val: number) {
                return val.toFixed(0)
            },
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
            "formatter": function (val: number) {
                return val.toFixed(1)
            },
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
            "formatter": function (val: number) {
                return val.toFixed(1)
            },
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
          labels: {
            "formatter": function (val: number) {
                return val.toFixed(1)
            },
          }
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
