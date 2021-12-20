import { Injectable } from '@angular/core';
import { IMeasurement, MeasurementService, Realtime } from '@c8y/client';
import { Subject } from 'rxjs';
import { IndoorAirQualityLevel } from './iaq.model';
import { has, get } from 'lodash-es';
import { iconLevelGood } from './assets/icon-level-good';
import { iconLevelModerate } from './assets/icon-level-moderate';
import { iconLevelUnhealthySensitiveGroups } from './assets/icon-level-unhealthy-sensitive-groups';
import { iconLevelUnhealthy } from './assets/icon-level-unhealthy';
import { iconLevelVeryUnhealthy } from './assets/icon-level-very-unhealthy';
import { iconLevelHazardous } from './assets/icon-level-hazardous';

@Injectable()
export class IndoorAirQualityWidgetService {
    private readonly ICON_LEVEL_GOOD = iconLevelGood;

    private readonly ICON_LEVEL_MODERATE = iconLevelModerate;

    private readonly ICON_LEVEL_UNHEALTHY_SENSITIVE_GROUPS = iconLevelUnhealthySensitiveGroups;

    private readonly ICON_LEVEL_UNHEALTHY = iconLevelUnhealthy;

    private readonly ICON_LEVEL_VERY_UNHEALTHY = iconLevelVeryUnhealthy;

    private readonly ICON_LEVEL_HAZARDOUS = iconLevelHazardous;

    private readonly AIR_QUALITY_LEVELS: IndoorAirQualityLevel[] = [
        {
            icon: this.ICON_LEVEL_GOOD,
            label: 'Good',
            recommendation: 'No measures needed',
            threshold: {
                min: 0,
                max: 50
            },
            cssColor: '#ABD25F',
        },
        {
            icon: this.ICON_LEVEL_MODERATE,
            label: 'Moderate',
            recommendation: 'No measures needed',
            threshold: {
                min: 51,
                max: 100
            },
            cssColor: '#FFD646',
        },
        {
            icon: this.ICON_LEVEL_UNHEALTHY_SENSITIVE_GROUPS,
            label: 'Unhealthy for sensitive groups',
            recommendation: 'Ventilation suggested',
            threshold: {
                min: 101,
                max: 150
            },
            cssColor: '#F79C56',
        },
        {
            icon: this.ICON_LEVEL_UNHEALTHY,
            label: 'Unhealthy',
            recommendation: 'Increase ventilation with clean air',
            threshold: {
                min: 151,
                max: 200
            },
            cssColor: '#F26B68',
        },
        {
            icon: this.ICON_LEVEL_VERY_UNHEALTHY,
            label: 'Very unhealthy',
            recommendation: 'Maximize ventilation and reduce attendance',
            threshold: {
                min: 201,
                max: 300
            },
            cssColor: '#A37DB8',
        },
        {
            icon: this.ICON_LEVEL_HAZARDOUS,
            label: 'Hazardous',
            recommendation: 'Avoid presence in room and maximize ventilation',
            threshold: {
                min: 301,
                max: 500
            },
            cssColor: '#A07682',
        }
    ];

    public indoorAirQuality$: Subject<IndoorAirQualityLevel & { value: number }> = new Subject<IndoorAirQualityLevel & { value: number }>();

    constructor(private measurementService: MeasurementService, private realtime: Realtime) { }

    init(deviceId: string, measurementFragment: string, measurementSeries: string) {
        this.loadLatestMeasurement(deviceId, measurementFragment, measurementSeries);
        this.subscribeForMeasurements(deviceId, measurementFragment, measurementSeries);
    }

    private loadLatestMeasurement(deviceId: string, measurementFragment: string, measurementSeries: string) {
        const filter = {
            source: deviceId,
            dateFrom: '1970-01-01',
            dateTo: new Date().toISOString(),
            valueFragmentType: measurementFragment,
            valueFragmentSeries: measurementSeries,
            pageSize: 1,
            revert: true
        }

        this.measurementService.list(filter).then((response) => {
            if (!response.data || response.data.length != 1
                || !has(response.data[0], `${measurementFragment}.${measurementSeries}`)) {
                return;
            }

            const indoorAirQualityValue: number = get(response.data[0], `${measurementFragment}.${measurementSeries}.value`);
            this.updateIndoorAirQualityLevel(indoorAirQualityValue)
        });
    }

    private subscribeForMeasurements(deviceId: string, measurementFragment: string, measurementSeries: string) {
        this.realtime.subscribe(`/measurements/${deviceId}`, (measurementNotification) => {
            const measurement: IMeasurement = measurementNotification.data.data;
            if (!measurement || !has(measurement, `${measurementFragment}.${measurementSeries}`)) {
                return;
            }

            const indoorAirQualityValue: number = get(measurement, `${measurementFragment}.${measurementSeries}.value`);
            this.updateIndoorAirQualityLevel(indoorAirQualityValue);
        });
    }

    private updateIndoorAirQualityLevel(indoorAirQualityValue: number) {
        const indoorAirQualityLevel: IndoorAirQualityLevel = this.AIR_QUALITY_LEVELS.find((airQualityLevel) =>
            indoorAirQualityValue >= airQualityLevel.threshold.min && indoorAirQualityValue <= airQualityLevel.threshold.max);

        if (!indoorAirQualityLevel) {
            return;
        }

        this.indoorAirQuality$.next({ ...indoorAirQualityLevel, ...{ value: indoorAirQualityValue } });
    }


}