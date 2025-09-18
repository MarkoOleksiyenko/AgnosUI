import type {TreeItem, TreeWidget} from '@agnos-ui/angular-bootstrap';
import {SidenavComponent, SidenavFooterDirective, SlotComponent, TreeComponent, UseDirective} from '@agnos-ui/angular-bootstrap';
import {ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation} from '@angular/core';

@Component({
	template: `
		<div class="d-flex app-container">
			<div auSidenav #sidenav>
				<au-component auTree [auNodes]="displayedItems()" [auItemContent]="sidenavItemContentSlot" [auContentData]="contentData()" />
				<ng-template auSidenavFooter>
					<button class="btn btn-primary m-2" (click)="toggle(sidenav)">+</button>
				</ng-template>
			</div>
			<div class="main-content">
				<h1>Main content</h1>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam erat, nec facilisis
					erat urna eu sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus dictum, enim at
					cursus dictum, urna erat cursus erat, ac dictum enim urna eu erat. Nullam euismod, nisi eu consectetur cursus, nisl nisl aliquam erat, nec
					facilisis erat urna eu sapien. Suspendisse potenti. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam erat, nec facilisis erat
					urna eu sapien. Mauris dictum, enim at cursus dictum, urna erat cursus erat, ac dictum enim urna eu erat. Proin euismod, nisi eu consectetur
					cursus, nisl nisl aliquam erat, nec facilisis erat urna eu sapien. Quisque dictum, enim at cursus dictum, urna erat cursus erat, ac dictum
					enim urna eu erat. Fusce euismod, nisi eu consectetur cursus, nisl nisl aliquam erat, nec facilisis erat urna eu sapien.
				</p>
			</div>
		</div>
	`,
	imports: [SidenavComponent, TreeComponent, SidenavFooterDirective],
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.au-tree-item {
				.btn.active,
				a.active {
					background-color: #0d6efd;
					color: #fff;
				}
			}
		`,
	],
})
export default class BasicSidenavComponent {
	readonly sidenavItemContentSlot = SidenavItemContentSlot;
	readonly items: SideNavItem[] = [
		{
			label: 'Node 1',
			isExpanded: true,
			children: [
				{
					label: 'Node 1.1',
					isExpanded: true,
					children: [
						{
							label: 'Node 1.1.1',
							href: 'google.com',
							active: true,
						},
					],
				},
				{
					label: 'Node 1.2',
					children: [
						{
							label: 'Node 1.2.1',
							href: 'https://design-factory.amadeus.net/',
						},
					],
				},
			],
		},
	];
	readonly displayedItems = signal(this.items);
	readonly contentData = signal({collapsed: false});

	toggle(sidenav: SidenavComponent) {
		const isCollapsed = sidenav.api.toggle();
		this.contentData.set({collapsed: isCollapsed});
		// TODO: if children are empty then the element becomes a link (do we want that in the collapsed mode?)
		this.displayedItems.set(isCollapsed ? this.items.map((item) => ({...item, children: []})) : this.items);
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective],
	template: `
		<div class="au-tree-item">
			@if (item().children.length > 0) {
				<button class="d-flex w-100 px-1" [class.active]="item().active" [auUse]="[directives().itemToggleDirective, {item: item()}]">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
							<path
								d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"
							/>
						</svg>
					</span>
					@if (!state().contentData().collapsed) {
						<span class="me-auto">{{ item().label }}</span>
						<span class="au-tree-expand-icon-svg"></span>
					}
				</button>
			} @else {
				<a class="btn d-flex w-100 px-1" [class.active]="item().active" [href]="item().href">
					<span class="me-auto">{{ item().label }}</span>
					<span class="au-tree-expand-icon-placeholder"></span>
				</a>
			}
		</div>
	`,
})
class SidenavItemContentSlot extends SlotComponent<TreeWidget<TreeData>> {
	readonly item = input.required<any>();
}

interface SideNavItem extends TreeItem {
	href?: string;
	active?: boolean;
}

type TreeData = {
	collapsed: boolean;
};
