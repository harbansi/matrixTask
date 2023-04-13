import { Component, ViewChild } from '@angular/core';
import * as data from '../assets/Data/matrixData.json';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors: any;
  xaxis: ApexXAxis;
  plotOption: ApexPlotOptions;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public matrixData: any = (data as any).default;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    //chartoption object for styling of the chart
    this.chartOptions = {
      series: this.getSeriesData(),
      chart: {
        height: 500,
        width: 640,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#007500'],
      title: {
        text: 'matrix data visualization',
      },
      xaxis: { position: 'top' },
      plotOption: { heatmap: { radius: 1 } },
    };
  }
  getSeriesData(): ApexAxisChartSeries {
    let sortedMatrixList: any = [];
    let appendDefaultValues: any = [];

    //sort the matrixData
    sortedMatrixList = this.matrixData.map((day: any) => {
      day.name = +day.day.slice(-2) + this.nthNumber(day.day.slice(-2));
      // copy the hours array into data for ploting the chart and removed the actual aaray.
      day.data = day.hours;
      delete day.hours;

      day.data.map((hour: any) => {
        //appended 'x', 'y' value for ploting the chart
        hour.x = hour.hour.slice(-2);
        hour.y = hour.record_count;
        delete hour.record_count;
      });

      //sorting of th inner array based on the value of hour(2023040200).
      day.data.sort((a: any, b: any) => +a.hour - +b.hour);
      return day;
    });
    //sorting based on the day value(20230402)
    sortedMatrixList.sort((a: any, b: any) => +a.day - +b.day);

    //apending the default value inside hours array
    appendDefaultValues = sortedMatrixList.map((days: any) => {
      if (days.data.length !== 24) {
        //adding object with default '0' record_count for presice chart ploting
        for (let i = 0; i < 24; i++) {
          //checking for hours value is equal to the index of array and if not then creating default array
          if (days.data[i] && days.data[i].hour % 100 !== i) {
            const obj = {
              x: i.toString(),
              y: 0,
            };
            //pushing the object at specific position in sorted array
            days.data.splice(i, 0, obj);
          }
        }
      }
      return days;
    });
    return appendDefaultValues;
  }

  //method for appending nth to the number
  nthNumber(number: number) {
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
