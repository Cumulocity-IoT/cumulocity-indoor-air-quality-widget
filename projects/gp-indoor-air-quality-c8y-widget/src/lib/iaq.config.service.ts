import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { FetchClient, IFetchResponse, InventoryService } from '@c8y/client';
import { get, has } from 'lodash';

@Injectable()
export class IndoorAirQualityConfigWidgetService {
  constructor(private fetchClient: FetchClient) { }

  async getSupportedDataPointSeries(deviceId: string): Promise<string[]> {
    try {
      const response = await (await this.fetchClient.fetch(
        `/inventory/managedObjects/${deviceId}/supportedSeries`
      )).json();
      if (!has(response, 'c8y_SupportedSeries')) {
        return [];
      }

      return get(response, 'c8y_SupportedSeries') as string[];
    } catch (error) { }
  }
}
