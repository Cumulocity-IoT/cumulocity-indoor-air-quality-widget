import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndoorAirQualityLevel, WidgetConfiguration } from './iaq.model';
import { IndoorAirQualityWidgetService } from './iaq.service';
import { has, get } from 'lodash-es';

@Component({
    selector: 'indoor-air-quality-widget',
    templateUrl: 'iaq.component.html',
    styleUrls: ['./styles.less'],
    providers: [IndoorAirQualityWidgetService]
})
export class IndoorAirQualityWidgetComponent implements OnInit, OnDestroy {
    @Input() config: WidgetConfiguration;

    currentIndoorAirQuality: IndoorAirQualityLevel & { value: number };

    private indoorAirQualitySubscription: Subscription;

    constructor(private indoorAirQualityService: IndoorAirQualityWidgetService) { }

    ngOnInit() {
        if (!this.config || !this.config.device || !this.config.dataPoint) {
            throw new Error('Failed to load configuration for widget!');
        }

        this.subscribeForIndoorAirQualityUpdates();
        this.indoorAirQualityService.init(this.config.device.id, this.config.dataPoint.fragment, this.config.dataPoint.series);
    }

    ngOnDestroy(): void {
        this.unsubscribeFromIndoorAirQualityUpdates();
    }

    private subscribeForIndoorAirQualityUpdates() {
        this.indoorAirQualityService.indoorAirQuality$.subscribe((indoorAirQuality: IndoorAirQualityLevel & { value: number }) => {
            this.currentIndoorAirQuality = indoorAirQuality;
        });
    }

    private unsubscribeFromIndoorAirQualityUpdates() {
        if (!this.indoorAirQualitySubscription) {
            return;
        }

        this.indoorAirQualitySubscription.unsubscribe();
    }
}