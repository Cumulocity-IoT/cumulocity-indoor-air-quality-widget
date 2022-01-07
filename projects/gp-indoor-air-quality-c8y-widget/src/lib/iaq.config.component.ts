import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DynamicComponent, OnBeforeSave } from '@c8y/ngx-components';
import { get, has } from 'lodash';
import { IndoorAirQualityConfigWidgetService } from './iaq.config.service';
import { WidgetConfiguration } from './iaq.model';

@Component({
    selector: 'indoor-air-quality-widget-configuration',
    templateUrl: 'iaq.config.component.html',
    providers: [IndoorAirQualityConfigWidgetService]
})

export class IndoorAirQualityWidgetConfigurationComponent implements DoCheck {
    @Input() config: WidgetConfiguration;

    deviceId: string;

    supportedDataPointSeries: string[];

    selectedDataPoint: string;

    constructor(private iaqConfigWidgetService: IndoorAirQualityConfigWidgetService) { }

    ngOnInit(): void {
        if (!this.config || !this.config.device || !this.config.dataPoint) {
            return;
        }

        this.selectedDataPoint = `${this.config.dataPoint.fragment}.${this.config.dataPoint.series}`;
    }

    ngDoCheck(): void {
        if (!this.config.device || this.config.device.id === this.deviceId) {
            return;
        }

        this.deviceId = get(this.config, 'device.id');
        this.updateSupportedDataPointSeries();
    }

    onDataPointSelected() {
        const measurement: string[] = this.selectedDataPoint.split('.');
        this.config = Object.assign(this.config, { dataPoint: { fragment: measurement[0], series: measurement[1] } });
    }

    private async updateSupportedDataPointSeries() {
        this.supportedDataPointSeries = await this.iaqConfigWidgetService.getSupportedDataPointSeries(get(this.config, 'device.id'));
    }
}