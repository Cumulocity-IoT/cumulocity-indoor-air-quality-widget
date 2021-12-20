import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule, HOOK_NAVIGATOR_NODES, HOOK_ONCE_ROUTE } from '@c8y/ngx-components';
import { ContextDashboardModule } from '@c8y/ngx-components/context-dashboard';

import { DashboardComponent } from './dashboard.component';
import { DashboardNavigationFactory } from './dashboard.navigation.factory';
import { IndoorAirQualityWidgetModule } from './../projects/gp-indoor-air-quality-c8y-widget/src/public-api';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        ContextDashboardModule.config(),
        CommonModule,
        CoreModule,
        ContextDashboardModule,
        IndoorAirQualityWidgetModule
    ],
    exports: [],
    entryComponents: [DashboardComponent],
    declarations: [DashboardComponent],
    providers: [
        {
            provide: HOOK_NAVIGATOR_NODES,
            useClass: DashboardNavigationFactory,
            multi: true
        },
        {
            provide: HOOK_ONCE_ROUTE,
            useValue: routes,
            multi: true
        }
    ],
})
export class DashboardModule { }
