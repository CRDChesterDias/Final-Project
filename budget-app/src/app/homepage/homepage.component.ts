import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
} from 'ng-apexcharts';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  timer2: void;
  constructor(public httpClient: HttpClient, private router: Router) {}
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: [],
    backgroundColor: [],
  };

  public dataSource_actual = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: [],
  };
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild('graphcontainer') element: ElementRef;
  public width: number;
  public height: number;
  public radius: number;
  public svg;
  public host;
  public htmlElement: HTMLElement;
  public pie;
  public arc;
  public outerArc;
  public key;
  public res;
  public id;
  public myChart = null;
  public headers = new HttpHeaders();
  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Actual',
          data: this.dataSource_actual.datasets[0].data,
        },
        {
          name: 'Allocated',

          data: this.dataSource.datasets[0].data,
        },
      ],
      chart: {
        type: 'bar',
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [],
      },
    };
    const token = localStorage.getItem('jwt');
    this.id = localStorage.getItem('ID');

    this.headers = this.headers.set('Authorization', 'Bearer ' + token);

    this.httpClient
      .post(
        'http://localhost:3000/api/get_allocated_budget?user_id=' +
          this.id +
          '&month=1',
        null,
        { headers: this.headers }
      )
      .subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          this.dataSource.datasets[0].data[i] = res[i].budget;
          this.dataSource.labels[i] = res[i].title;
          this.dataSource.datasets[0].backgroundColor[i] = '#' + res[i].color;
        }
        this.createChart();
        this.initvalues(res);
      });

    this.httpClient
      .post(
        'http://localhost:3000/api/get_actual_budget?user_id=' +
          this.id +
          '&month=1',
        null,
        { headers: this.headers }
      )
      .subscribe((res2: any[]) => {
        console.log(res2[0].budget);
        for (let i = 0; i < res2.length; i++) {
          this.dataSource_actual.datasets[0].data[i] = res2[i].budget;
          this.dataSource_actual.labels[i] = res2[i].title;
        }
        this.chartOptions = {
          series: [
            {
              name: 'Actual',
              data: this.dataSource_actual.datasets[0].data,
            },
            {
              name: 'Allocated',

              data: this.dataSource.datasets[0].data,
            },
          ],
          chart: {
            type: 'bar',
            height: 430,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['#fff'],
            },
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
          },
          xaxis: {
            categories: this.dataSource_actual.labels,
          },
        };
      });
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.myChart !== null) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });

    this.timeout();
    this.timeout2();
  }
  timeout() {
    const token = localStorage.getItem('jwt');
    const base64token = token.split('.')[1];
    let decoded = JSON.parse(window.atob(base64token));
    let d: any = new Date(decoded.exp * 1000);
    if (Date.now() >= d) {
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/');
    }
    let time = decoded.exp * 1000 - new Date().getTime();
    setTimeout(() => {
      this.timeout();
    }, time);
  }

  timeout2() {
    const token = localStorage.getItem('jwt');
    const base64token = token.split('.')[1];
    let decoded = JSON.parse(window.atob(base64token));
    let d: any = new Date(decoded.exp * 1000);
    let time = decoded.exp * 1000 - new Date().getTime() - 20000;
    if (Date.now() >= d-20000) {
      if (window.confirm('20 seconds remaining')){
        let id=localStorage.getItem('ID');
        this.httpClient
        .post('http://localhost:3000/api/login2?userid=' + id, null)
        .subscribe((res: any) => {
          const token2 = res.token;
          localStorage.setItem('jwt', token2);
          localStorage.setItem('ID', res.id);
          const base64token2 = token2.split('.')[1];
          let decoded2 = JSON.parse(window.atob(base64token2));
          let time2 = decoded2.exp * 1000 - new Date().getTime()-20000;
          setTimeout(() => {
            this.timer2= this.timeout2();
          }, time2);
      });
      }
      else{
        clearTimeout();
      }
    }
    else{
    setTimeout(() => {
      this.timer2= this.timeout2();
    }, time);}
  }

  /////// Code for d3js starts here///////
  ///////////////////////////////////////

  initvalues(res) {
    this.htmlElement = document.getElementById('graph');
    this.htmlElement.innerHTML = '';
    this.host = d3.select(this.htmlElement);
    this.width = 430;
    this.height = 150;
    this.radius = Math.min(this.width, this.height) / 2;
    this.svg = this.host
      .append('svg')
      .append('g')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.append('g').attr('class', 'slices');
    this.svg.append('g').attr('class', 'labels');
    this.svg.append('g').attr('class', 'lines');

    this.arc = d3
      .arc()
      .outerRadius(this.radius * 0.8)
      .innerRadius(this.radius * 0.4);
    this.outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);
    this.svg.attr(
      'transform',
      'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
    );
    this.key = this.dataSource.labels;
    this.getJSONData(res);

    this.change(this.getJSONData(res));
  }
  public values = [];
  getJSONData(res) {
    const data = [];
    const labels = [];
    const datamap = [];

    for (let i = 0; i < res.length; i++) {
      labels[i] = res[i].title;
      data[labels[i]] = res[i].budget;
      this.values[i] = res[i].budget;
    }

    return labels.map(function (label) {
      return { label, value: data[label] };
    });
  }

  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  change(data) {
    const key = function (d) {
      return d.data.label;
    };

    this.pie = d3
      .pie()
      .sort(null)
      .value(function(d:any) {
        console.log(d.value)
        return d.value;
      })
    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(data))
      .range(this.dataSource.datasets[0].backgroundColor);

    /* ------- PIE SLICES -------*/
    const slice = this.svg
      .select('.slices')
      .selectAll('path.slice')
      .data(this.pie(data), key);
    slice
      .enter()
      .insert('path')
      .attr('class', 'slice')
      .attr('d', this.arc)
      .style('fill', function (d) {
        return color(d.data.label);
      });

    slice
      .transition()
      .duration(11)
      .attrTween('d', function (d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return this.arc(interpolate(t));
        };
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    const text = this.svg
      .select('.labels')
      .selectAll('text')
      .data(this.pie(data), key);

    text
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function (d) {
        return d.data.label;
      })
      .transition()
      .attr('transform', function (d) {
        console.log('dfsfds');
        this.width = 400;
        this.height = 120;
        this.radius = Math.min(this.width, this.height) / 2;
        this.radius = this.radius + 30;
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        this.arc = d3
          .arc()
          .innerRadius(this.radius * 0.8)
          .outerRadius(this.radius * 0.5);
        this.outerArc = d3
          .arc()
          .outerRadius(this.radius)
          .innerRadius(this.radius * 0.5);
        const pos = this.outerArc.centroid(this._current);
        const mid =
          this._current.startAngle +
          (this._current.endAngle - this._current.startAngle) / 2;
        pos[0] = this.radius * 0.95 * (mid < Math.PI ? 1 : -1);
        return 'translate(' + pos[0] + ',' + pos[1] + ')';
      });

    /* ------- SLICE TO TEXT POLYLINES -------*/

    const polyline = this.svg
      .select('.lines')
      .selectAll('polyline')
      .data(this.pie(data), key);

    polyline
      .enter()
      .append('polyline')
      .transition()
      .duration(1000)
      .attr('points', function (d) {
        this.width = 400;
        this.height = 120;
        this.radius = Math.min(this.width, this.height) / 2;
        this.radius = this.radius + 30;
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        this.outerArc = d3
          .arc()
          .innerRadius(this.radius * 0.4)
          .outerRadius(this.radius * 0.9);
        this.arc = d3
          .arc()
          .outerRadius(this.radius * 0.8)
          .innerRadius(this.radius * 0.4);
        const pos = this.outerArc.centroid(this._current);
        const mid =
          this._current.startAngle +
          (this._current.endAngle - this._current.startAngle) / 2;
        pos[0] = this.radius * 0.95 * (mid < Math.PI ? 1 : -1);
        return [
          this.arc.centroid(this._current),
          this.outerArc.centroid(this._current),
          pos,
        ];
      });
  }

  onOptionsSelected(value: string) {
    console.log('the selected value is ' + value);
    this.dataSource = {
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
      labels: [],
      backgroundColor: [],
    };

    this.dataSource_actual = {
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
      labels: [],
    };
    this.httpClient
      .post(
        'http://localhost:3000/api/get_allocated_budget?user_id=' +
          this.id +
          '&month='+value,
        null,
        { headers: this.headers }
      )
      .subscribe((res: any[]) => {
        console.log(res[0].budget);
        for (let i = 0; i < res.length; i++) {
          this.dataSource.datasets[0].data[i] = res[i].budget;
          this.dataSource.labels[i] = res[i].title;
          this.dataSource.datasets[0].backgroundColor[i] = '#' + res[i].color;
        }
        console.log(this.dataSource);
        this.createChart();
        this.initvalues(res);
      });

    this.httpClient
      .post(
        'http://localhost:3000/api/get_actual_budget?user_id=' +
          this.id +
          '&month='+value,
        null,
        { headers: this.headers }
      )
      .subscribe((res2: any[]) => {
        console.log(res2[0].budget);
        for (let i = 0; i < res2.length; i++) {
          this.dataSource_actual.datasets[0].data[i] = res2[i].budget;
          this.dataSource_actual.labels[i] = res2[i].title;
        }

        this.chartOptions = {
          series: [
            {
              name: 'Actual',
              data: this.dataSource_actual.datasets[0].data,
            },
            {
              name: 'Allocated',

              data: this.dataSource.datasets[0].data,
            },
          ],
          chart: {
            type: 'bar',
            height: 430,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['#fff'],
            },
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
          },
          xaxis: {
            categories: this.dataSource_actual.labels,
          },
        };
      });
  }
}
