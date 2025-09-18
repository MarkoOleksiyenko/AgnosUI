import type {SlotContent} from '@agnos-ui/angular-headless';
import {BaseWidgetDirective, callWidgetFactory, ComponentTemplate, SlotDirective, UseDirective} from '@agnos-ui/angular-headless';
import {ChangeDetectionStrategy, Component, contentChild, Directive, inject, input, output, TemplateRef, viewChild} from '@angular/core';
import type {TreeContext, TreeItem, NormalizedTreeItem, TreeSlotItemContext, TreeWidget} from './tree.gen';
import {createTree} from './tree.gen';

/**
 * Directive to provide a template reference for tree structure.
 *
 * This directive uses a template reference to render the {@link TreeContext}.
 */
@Directive({selector: 'ng-template[auTreeStructure]'})
export class TreeStructureDirective<Data> {
	public templateRef = inject(TemplateRef<TreeContext<Data>>);
	static ngTemplateContextGuard<Data>(_dir: TreeStructureDirective<Data>, context: unknown): context is TreeContext<Data> {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective, TreeStructureDirective, SlotDirective],
	template: `
		<ng-template auTreeStructure #structure let-state="state" let-directives="directives" let-api="api">
			<ul role="tree" class="au-tree {{ state.className() }}" [auUse]="directives.navigationDirective">
				@for (node of state.normalizedNodes(); track trackNode($index, node)) {
					<ng-template [auSlot]="state.item()" [auSlotProps]="{state, api, directives, item: node}" />
				}
			</ul>
		</ng-template>
	`,
})
class TreeDefaultStructureSlotComponent<Data> {
	readonly structure = viewChild.required<TemplateRef<TreeContext<Data>>>('structure');

	trackNode(index: number, node: NormalizedTreeItem): string {
		return node.label + node.level + index;
	}
}

/**
 * A constant representing the default slot for tree structure.
 */
export const treeDefaultSlotStructure: SlotContent<TreeContext<any>> = new ComponentTemplate(TreeDefaultStructureSlotComponent, 'structure');

/**
 * Directive to provide a template reference for tree item toggle.
 *
 * This directive uses a template reference to render the {@link TreeSlotItemContext}.
 */
@Directive({selector: 'ng-template[auTreeItemToggle]'})
export class TreeItemToggleDirective<Data> {
	public templateRef = inject(TemplateRef<TreeSlotItemContext<Data>>);
	static ngTemplateContextGuard<Data>(_dir: TreeItemToggleDirective<Data>, context: unknown): context is TreeSlotItemContext<Data> {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective, TreeItemToggleDirective],
	template: `
		<ng-template auTreeItemToggle #toggle let-directives="directives" let-item="item">
			@if (item.children.length > 0) {
				<button [auUse]="[directives.itemToggleDirective, {item}]">
					<svg class="au-tree-expand-icon-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 10 10">
						<path d="M3 1 L7 5 L3 9" class="au-tree-expand-icon-svg-fill" stroke-width="1" fill="none" />
					</svg>
				</button>
			} @else {
				<span class="au-tree-expand-icon-placeholder"></span>
			}
		</ng-template>
	`,
})
class TreeDefaultItemToggleSlotComponent<Data> {
	readonly toggle = viewChild.required<TemplateRef<TreeSlotItemContext<Data>>>('toggle');
}

/**
 * A constant representing the default slot for tree item toggle.
 */
export const treeDefaultItemToggle: SlotContent<TreeSlotItemContext<any>> = new ComponentTemplate(TreeDefaultItemToggleSlotComponent, 'toggle');

/**
 * Directive to provide a template reference for tree item content.
 *
 * This directive uses a template reference to render the {@link TreeSlotItemContext}.
 */
@Directive({selector: 'ng-template[auTreeItemContent]'})
export class TreeItemContentDirective<Data> {
	public templateRef = inject(TemplateRef<TreeSlotItemContext<Data>>);
	static ngTemplateContextGuard<Data>(_dir: TreeItemContentDirective<Data>, context: unknown): context is TreeSlotItemContext<Data> {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SlotDirective, TreeItemContentDirective],
	template: `
		<ng-template auTreeItemContent #treeItemContent let-state="state" let-directives="directives" let-item="item" let-api="api">
			<span class="au-tree-item">
				<ng-template [auSlot]="state.itemToggle()" [auSlotProps]="{state, api, directives, item}" />
				{{ item.label }}
			</span>
		</ng-template>
	`,
})
class TreeDefaultItemContentSlotComponent<Data> {
	readonly treeItemContent = viewChild.required<TemplateRef<TreeSlotItemContext<Data>>>('treeItemContent');
}

/**
 * A constant representing the default slot for tree item.
 */
export const treeDefaultSlotItemContent: SlotContent<TreeSlotItemContext<any>> = new ComponentTemplate(
	TreeDefaultItemContentSlotComponent,
	'treeItemContent',
);

/**
 * Directive to provide a template reference for tree item.
 *
 * This directive uses a template reference to render the {@link TreeSlotItemContext}.
 */
@Directive({selector: 'ng-template[auTreeItem]'})
export class TreeItemDirective<Data> {
	public templateRef = inject(TemplateRef<TreeSlotItemContext<Data>>);
	static ngTemplateContextGuard<Data>(_dir: TreeItemDirective<Data>, context: unknown): context is TreeSlotItemContext<Data> {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective, SlotDirective, TreeItemDirective],
	template: `
		<ng-template auTreeItem #treeItem let-state="state" let-directives="directives" let-item="item" let-api="api">
			<li [auUse]="[directives.itemAttributesDirective, {item}]">
				<ng-template [auSlot]="state.itemContent()" [auSlotProps]="{state, api, directives, item}" />
				@if (state.expandedMap().get(item)) {
					<ul role="group">
						@for (child of item.children; track trackNode($index, child)) {
							<ng-template [auSlot]="state.item()" [auSlotProps]="{state, api, directives, item: child}" />
						}
					</ul>
				}
			</li>
		</ng-template>
	`,
})
class TreeDefaultItemSlotComponent<Data> {
	readonly treeItem = viewChild.required<TemplateRef<TreeSlotItemContext<Data>>>('treeItem');

	trackNode(index: number, node: NormalizedTreeItem) {
		return node.label + node.level + index;
	}
}

/**
 * A constant representing the default slot for tree item.
 */
export const treeDefaultSlotItem: SlotContent<TreeSlotItemContext<any>> = new ComponentTemplate(TreeDefaultItemSlotComponent, 'treeItem');

/**
 * TreeComponent is an Angular component that extends the BaseWidgetDirective
 * to provide a customizable tree widget. This component allows for various
 * configurations and customizations through its inputs and outputs.
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: '[auTree]',

	imports: [SlotDirective],
	template: ` <ng-template [auSlot]="state.structure()" [auSlotProps]="{state, api, directives}" /> `,
})
export class TreeComponent<Data> extends BaseWidgetDirective<TreeWidget<Data>> {
	constructor() {
		super(
			callWidgetFactory(createTree, {
				defaultConfig: {
					structure: treeDefaultSlotStructure,
					item: treeDefaultSlotItem,
					itemContent: treeDefaultSlotItemContent,
					itemToggle: treeDefaultItemToggle,
				},
				events: {
					onExpandToggle: (item: NormalizedTreeItem) => this.expandToggle.emit(item),
				},
				slotTemplates: () => ({
					structure: this.slotStructureFromContent()?.templateRef,
					item: this.slotItemFromContent()?.templateRef,
					itemContent: this.slotItemContentFromContent()?.templateRef,
					itemToggle: this.slotItemToggleFromContent()?.templateRef,
				}),
			}),
		);
	}
	/**
	 * Optional accessibility label for the tree if there is no explicit label
	 *
	 * @defaultValue `''`
	 */
	readonly ariaLabel = input<string>(undefined, {alias: 'auAriaLabel'});
	/**
	 * Array of the tree nodes to display
	 *
	 * @defaultValue `[]`
	 */
	readonly nodes = input<TreeItem[]>(undefined, {alias: 'auNodes'});
	/**
	 * CSS classes to be applied on the widget main container
	 *
	 * @defaultValue `''`
	 */
	readonly className = input<string>(undefined, {alias: 'auClassName'});
	/**
	 * Retrieves expand items of the TreeItem
	 *
	 * @param node - HTML element that is representing the expand item
	 *
	 * @defaultValue
	 * ```ts
	 * (node: HTMLElement) => node.querySelectorAll('button')
	 * ```
	 */
	readonly navSelector = input<(node: HTMLElement) => NodeListOf<HTMLElement>>(undefined, {alias: 'auNavSelector'});
	/**
	 * Return the value for the 'aria-label' attribute of the toggle
	 * @param label - tree item label
	 *
	 * @defaultValue
	 * ```ts
	 * (label: string) => `Toggle ${label}`
	 * ```
	 */
	readonly ariaLabelToggleFn = input<(label: string) => string>(undefined, {alias: 'auAriaLabelToggleFn'});

	/**
	 * An event emitted when the user toggles the expand of the TreeItem.
	 *
	 * Event payload is equal to the TreeItem clicked.
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	readonly expandToggle = output<NormalizedTreeItem>({alias: 'auExpandToggle'});

	/**
	 * Data to use in content slots
	 */
	readonly contentData = input<Data>(undefined, {alias: 'auContentData'});

	/**
	 * Slot to change the default tree item content
	 */
	readonly itemContent = input<SlotContent<TreeSlotItemContext<Data>>>(undefined, {alias: 'auItemContent'});
	readonly slotItemContentFromContent = contentChild(TreeItemContentDirective);

	/**
	 * Slot to change the default display of the tree
	 */
	readonly structure = input<SlotContent<TreeContext<Data>>>(undefined, {alias: 'auStructure'});
	readonly slotStructureFromContent = contentChild(TreeStructureDirective);

	/**
	 * Slot to change the default tree item toggle
	 */
	readonly itemToggle = input<SlotContent<TreeSlotItemContext<Data>>>(undefined, {alias: 'auItemToggle'});
	readonly slotItemToggleFromContent = contentChild(TreeItemToggleDirective);

	/**
	 * Slot to change the default tree item
	 */
	readonly item = input<SlotContent<TreeSlotItemContext<Data>>>(undefined, {alias: 'auItem'});
	readonly slotItemFromContent = contentChild(TreeItemDirective);
}
