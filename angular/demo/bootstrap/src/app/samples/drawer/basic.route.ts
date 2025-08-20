import {DrawerComponent, DrawerHeaderDirective} from '@agnos-ui/angular-bootstrap';
import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

type DrawerTypes = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

@Component({
	template: `
		<button class="btn btn-primary mb-3" (click)="toggleDrawer(drawer)">Toggle drawer</button>
		<div class="d-flex align-items-center">
			<label for="drawer-placement" class="me-3">Placement:</label>
			<select id="drawer-placement" [ngModel]="drawerPlacement()" (ngModelChange)="drawerPlacement.set($event)" class="w-auto form-select">
				<option value="inline-start">Left</option>
				<option value="inline-end">Right</option>
				<option value="block-start">Top</option>
				<option value="block-end">Bottom</option>
			</select>
		</div>
		<au-component #drawer auDrawer [auClassName]="drawerPlacement()">
			<ng-template auDrawerHeader> Hi, I am drawer! </ng-template>
			<ul>
				<li>First item</li>
				<li>Second item</li>
				<li>Third item</li>
			</ul>
		</au-component>
	`,
	imports: [DrawerComponent, FormsModule, DrawerHeaderDirective],
})
export default class BasicDrawerComponent {
	readonly drawerPlacement = signal<DrawerTypes>('inline-start');

	toggleDrawer(drawer: DrawerComponent) {
		drawer.api.open();
	}
}
