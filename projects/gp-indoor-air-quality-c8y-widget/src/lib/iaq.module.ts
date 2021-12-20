import { NgModule } from '@angular/core';
import { CoreModule, DynamicComponentDefinition, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { ContextWidgetConfig } from '@c8y/ngx-components/context-dashboard';
import { previewImage } from './assets/preview-image';

import { IndoorAirQualityWidgetComponent } from './iaq.component';
import { IndoorAirQualityWidgetConfigurationComponent } from './iaq.config.component';

@NgModule({
    imports: [CoreModule],
    exports: [IndoorAirQualityWidgetComponent, IndoorAirQualityWidgetConfigurationComponent],
    declarations: [IndoorAirQualityWidgetComponent, IndoorAirQualityWidgetConfigurationComponent],
    entryComponents: [IndoorAirQualityWidgetComponent, IndoorAirQualityWidgetConfigurationComponent],
    providers: [
        {
            provide: HOOK_COMPONENTS,
            multi: true,
            useValue: [
                {
                    id: 'indoor-air-quality-widget',
                    label: 'Indoor Air Quality',
                    description: 'Displays the indoor air quality and recommendations based on the current value',
                    component: IndoorAirQualityWidgetComponent,
                    configComponent: IndoorAirQualityWidgetConfigurationComponent,
                    previewImage: previewImage,
                    data: {
                        settings: {
                            noNewWidgets: false, // Set this to true, to don't allow adding new widgets.
                            ng1: {
                                options: {
                                    noDeviceTarget: false, // Set this to true to hide the device selector.
                                    groupsSelectable: false // Set this, if not only devices should be selectable.
                                }
                            }
                        }
                    } as ContextWidgetConfig
                }
            ] as DynamicComponentDefinition[]
        }
    ],
})
export class IndoorAirQualityWidgetModule { }
