import {Component} from '@angular/core';
import type {TreeItem} from 'angular/headless/src/generated/components/tree';

@Component({
	selector: 'au-tree',
	standalone: true,
	template: `
		<div role="tree">
			@for (node of nodes; track node) {
				<div role="treeitem">
					{{ node.label }}
				</div>
			}
		</div>
	`,
	imports: [],
})
export class TreeComponent {
	nodes: TreeItem[] = [];
}
