import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, gettext } from '@c8y/ngx-components';

@Injectable()
export class DashboardNavigationFactory {
  private readonly NODE = new NavigatorNode({
    label: gettext('Demo Dashboard'),
    path: '/dashboard',
    icon: 'decentralized-network',
    priority: 100
  });

  constructor() { }

  get(): NavigatorNode {
    return this.NODE;
  }
}
