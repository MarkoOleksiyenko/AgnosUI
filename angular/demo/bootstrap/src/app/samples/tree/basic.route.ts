import type {TreeItem} from '@agnos-ui/angular-bootstrap';
import {AgnosUIAngularModule} from '@agnos-ui/angular-bootstrap';
import {Component} from '@angular/core';

@Component({
	standalone: true,
	template: ` <au-component auTree [auNodes]="nodes"></au-component> `,
	imports: [AgnosUIAngularModule],
})
export default class BasicTreeComponent {
	nodes: TreeItem[] = [
		{
			label: 'Node 1',
			isExpanded: true,
			ariaLabel: 'Node 1',
			children: [
				{
					label: 'Node 1.1',
					isExpanded: false,
					ariaLabel: 'Node 1.1',
					children: [
						{
							label: 'Node 1.1.1',
							ariaLabel: 'Node 1.1.1',
							isExpanded: false,
							children: [],
						},
					],
				},
				{
					label: 'Node 1.2',
					ariaLabel: 'Node 1.2',
					isExpanded: false,
					children: [],
				},
			],
		},
	];
}
