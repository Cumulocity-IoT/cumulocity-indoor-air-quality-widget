import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { has, get } from 'lodash';

declare global {
  interface Window {
    d3: any;
    h337: any;
  }
}

import * as d3 from 'd3v2';
import * as d3Scale from 'd3-scalev2';

@Component({
  selector: 'indoor-air-quality-gauge-component',
  templateUrl: './iaq-gauge.component.html'
})
export class IndoorAirQualityGaugeComponent implements OnInit, OnChanges {
  @Input() airQuality: number;

  @ViewChild('IAQGauge', { read: ElementRef, static: true }) gaugeReference: ElementRef;

  private readonly GAUGE_D3_CONFIG = {
    size: 300,
    clipWidth: 310,
    clipHeight: 200,
    ringInset: 20,
    ringWidth: 60,
    pointerWidth: 10,
    pointerTailLength: 5,
    pointerHeadLengthPercent: 0.9,
    minValue: 0,
    maxValue: 500,
    minAngle: -90,
    maxAngle: 90,
    transitionMs: 4000,
    majorTicks: 6,
    labelFormat: d3.format('d'),
    labelInset: 10,
    arcColorFn: d3Scale
      .scaleQuantize<string>()
      .domain([0, 1])
      .range(['#00E400', '#92D050', '#C9C900', '#FF7E00', '#FF0000', '#99004C', '#663300'])
  };

  gaugemap: any = {};

  ticks = [0, 50, 100, 150, 200, 250, 350, 500];

  tickData = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

  startRange: number[] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7];

  endRange: number[] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 1];

  colors: string[] = ['#00E400', '#92D050', '#C9C900', '#FF7E00', '#FF0000', '#99004C', '#663300'];

  svg;

  gauge = {
    range: this.GAUGE_D3_CONFIG.maxAngle - this.GAUGE_D3_CONFIG.minAngle,
    r: this.GAUGE_D3_CONFIG.size / 2,
    pointerHeadLength: 0,
    arc: undefined,
    pointer: undefined
  };

  scale = d3
    .scaleLinear()
    .range([0, 1])
    .domain([this.GAUGE_D3_CONFIG.minValue, this.GAUGE_D3_CONFIG.maxValue]);

  constructor() { }

  ngOnInit() {
    this.configure();
    this.render(this.airQuality);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!has(changes, 'airQuality.currentValue') || !this.isRendered()) {
      return;
    }

    this.update(this.airQuality);
  }

  private configure(): void {
    this.gauge.pointerHeadLength = Math.round(
      this.gauge.r * this.GAUGE_D3_CONFIG.pointerHeadLengthPercent
    );
    this.gauge.arc = d3
      .arc()
      .innerRadius(this.gauge.r - this.GAUGE_D3_CONFIG.ringWidth - this.GAUGE_D3_CONFIG.ringInset)
      .outerRadius(this.gauge.r - this.GAUGE_D3_CONFIG.ringInset)
      .startAngle((d: any, i) => {
        const ratio = this.startRange[i];
        return this.deg2rad(this.GAUGE_D3_CONFIG.minAngle + ratio * this.gauge.range);
      })
      .endAngle((d: any, i) => {
        const ratio = this.endRange[i];
        return this.deg2rad(this.GAUGE_D3_CONFIG.minAngle + ratio * this.gauge.range);
      });
  }

  update(newValue) {
    const ratio = this.scale(newValue);
    const newAngle = this.GAUGE_D3_CONFIG.minAngle + ratio * this.gauge.range;

    this.gauge.pointer
      .transition()
      .duration(this.GAUGE_D3_CONFIG.transitionMs)
      .ease(d3.easeElastic)
      .attr('transform', 'rotate(' + newAngle + ')');
  }

  private render(newValue: number): void {
    this.svg = d3
      .select(this.gaugeReference.nativeElement)
      .append('svg:svg')
      .attr('class', 'gauge')
      .attr('viewBox', '0 0 310 200');

    const centerTx = this.centerTranslation(this.GAUGE_D3_CONFIG.size / 2);

    const arcs = this.svg
      .append('g')
      .attr('class', 'arc')
      .attr('transform', centerTx);

    arcs
      .selectAll('path')
      .data(this.tickData)
      .enter()
      .append('path')
      .attr('fill', (d, i) => {
        return this.colors[i];
      })
      .attr('d', this.gauge.arc);

    const lg = this.svg
      .append('g')
      .attr('class', 'label')
      .attr('transform', centerTx);
    lg.selectAll('text')
      .data(this.ticks)
      .enter()
      .append('text')
      .attr('transform', d => {
        const ratio = this.scale(d);
        const newAngle = this.GAUGE_D3_CONFIG.minAngle + ratio * this.gauge.range;
        return (
          'rotate(' +
          newAngle +
          ') translate(0,' +
          (this.GAUGE_D3_CONFIG.labelInset - this.gauge.r) +
          ')'
        );
      })
      .text(this.GAUGE_D3_CONFIG.labelFormat);

    const lineData = [
      [this.GAUGE_D3_CONFIG.pointerWidth / 2, 0],
      [0, -this.gauge.pointerHeadLength],
      [-(this.GAUGE_D3_CONFIG.pointerWidth / 2), 0],
      [0, this.GAUGE_D3_CONFIG.pointerTailLength],
      [this.GAUGE_D3_CONFIG.pointerWidth / 2, 0]
    ];

    const pointerLine = d3.line().curve(d3.curveLinear);
    const pg = this.svg
      .append('g')
      .data([lineData])
      .attr('class', 'pointer')
      .attr('transform', centerTx);

    this.gauge.pointer = pg
      .append('path')
      .attr('d', pointerLine)
      .attr('transform', 'rotate(' + this.GAUGE_D3_CONFIG.minAngle + ')');

    this.update(newValue);
  }

  private centerTranslation(r) {
    return 'translate(' + r + ',' + r + ')';
  }

  private deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  private isRendered() {
    return !!this.svg;
  }
}
