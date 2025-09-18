import type {NormalizedTreeItem, TreeItem, TreeWidget} from '@agnos-ui/angular-bootstrap';
import {SidenavComponent, SidenavFooterDirective, SlotComponent, TreeComponent, UseDirective} from '@agnos-ui/angular-bootstrap';
import {ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation} from '@angular/core';

@Component({
	template: `
		<div class="d-flex app-container">
			<div auSidenav #sidenav>
				<au-component auTree [auNodes]="items" [auItem]="sidenavItemSlot" [auContentData]="contentData()" />
				<ng-template auSidenavFooter>
					<button class="btn btn-primary m-2" (click)="toggle(sidenav)">+</button>
				</ng-template>
			</div>
			<div class="main-content p-3">
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
	readonly sidenavItemSlot = SidenavItemSlot;
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
	}
}

// TODO: add the toggle-icon chevron (disappeared because the slot is overridden ?)
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective],
	selector: 'app-sidenav-item-content',
	template: `
		<div class="au-tree-item">
			@if (item().children.length > 0) {
				<button class="d-flex w-100 px-1" [class.active]="item().active" [auUse]="[directives().itemToggleDirective, {item: item()}]">
					@if (item().level === 0) {
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
								<path
									d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"
								/>
							</svg>
						</span>
					}
					@if (!state().contentData().collapsed) {
						<span class="au-sidenav-item-label me-auto">{{ item().label }}</span>
						<svg class="au-tree-expand-icon-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 10 10">
							<path d="M3 1 L7 5 L3 9" class="au-tree-expand-icon-svg-fill" stroke-width="1" fill="none" />
						</svg>
					}
				</button>
			} @else {
				<a class="btn d-flex w-100 px-1" [class.active]="item().active" [href]="item().href">
					<span class="au-sidenav-item-label me-auto">{{ item().label }}</span>
					<span class="au-tree-expand-icon-placeholder"></span>
				</a>
			}
		</div>
	`,
})
class SidenavItemContentSlot extends SlotComponent<TreeWidget<TreeData>> {
	readonly item = input.required<any>();
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective, SidenavItemContentSlot],
	selector: 'app-sidenav-item',
	template: `
		<li [auUse]="[directives().itemAttributesDirective, {item: item()}]">
			<app-sidenav-item-content [item]="item()" [state]="state()" [api]="api()" [directives]="directives()" />
			@if (!state().contentData().collapsed && state().expandedMap().get(item())) {
				<ul role="group">
					@for (child of item().children; track trackNode($index, child)) {
						<app-sidenav-item [item]="child" [state]="state()" [api]="api()" [directives]="directives()" />
					}
				</ul>
			}
		</li>
	`,
})
class SidenavItemSlot extends SlotComponent<TreeWidget<TreeData>> {
	readonly item = input.required<any>();

	trackNode(index: number, node: NormalizedTreeItem) {
		return node.label + node.level + index;
	}
}

interface SideNavItem extends TreeItem {
	href?: string;
	active?: boolean;
}

type TreeData = {
	collapsed: boolean;
};
