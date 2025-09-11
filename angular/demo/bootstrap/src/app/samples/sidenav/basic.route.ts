import type {TreeItem} from '@agnos-ui/angular-bootstrap';
import {SidenavComponent} from '@agnos-ui/angular-bootstrap';
import {Component} from '@angular/core';

@Component({
	template: ` <au-component auSidenav [auItems]="items" /> `,
	imports: [SidenavComponent],
})
export default class BasicSidenavComponent {
	readonly items: TreeItem[] = [
		{
			label: 'Node 1',
			isExpanded: true,
			children: [
				{
					label: 'Node 1.1',
					children: [
						{
							label: 'Node 1.1.1',
						},
					],
				},
				{
					label: 'Node 1.2',
					children: [
						{
							label: 'Node 1.2.1',
						},
					],
				},
			],
		},
	];
}
