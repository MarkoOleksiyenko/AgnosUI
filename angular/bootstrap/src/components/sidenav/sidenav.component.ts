import type {SlotContent, TreeItem} from '@agnos-ui/angular-headless';
import {BaseWidgetDirective, callWidgetFactory, ComponentTemplate, SlotDirective, UseDirective} from '@agnos-ui/angular-headless';
import {ChangeDetectionStrategy, Component, Directive, inject, input, TemplateRef, viewChild} from '@angular/core';
import type {SidenavContext, SidenavWidget} from './sidenav.gen';
import {createSidenav} from './sidenav.gen';
import type {TreeSlotItemContext} from '../tree';
import {TreeComponent} from '../tree';

/**
 * Directive to provide a template reference for sidenav item.
 *
 * This directive uses a template reference to render the {@link SidenavContext}.
 */
@Directive({selector: 'ng-template[auSidenavItem]'})
export class SidenavItemDirective {
	public templateRef = inject(TemplateRef<TreeSlotItemContext>);
	static ngTemplateContextGuard(_dir: SidenavItemDirective, context: unknown): context is TreeSlotItemContext {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseDirective, SlotDirective, SidenavItemDirective],
	template: `
		<ng-template auTreeItem #treeItem let-state="state" let-directives="directives" let-item="item" let-api="api">
			<span class="au-tree-item">
				{{ item.label }}
				<ng-template [auSlot]="state.itemToggle()" [auSlotProps]="{state, api, directives, item}" />
			</span>
		</ng-template>
	`,
})
class SidenavDefaultItemSlotComponent {
	readonly sidenavItem = viewChild.required<TemplateRef<TreeSlotItemContext>>('sidenavItem');
}

/**
 * A constant representing the default slot for sidenav item.
 */
export const sidenavDefaultSlotItem: SlotContent<TreeSlotItemContext> = new ComponentTemplate(SidenavDefaultItemSlotComponent, 'sidenavItem');

/**
 * Directive to provide a template reference for sidenav structure.
 *
 * This directive uses a template reference to render the {@link SidenavContext}.
 */
@Directive({selector: 'ng-template[auSidenavStructure]'})
export class SidenavStructureDirective {
	public templateRef = inject(TemplateRef<SidenavContext>);
	static ngTemplateContextGuard(_dir: SidenavStructureDirective, context: unknown): context is SidenavContext {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SidenavStructureDirective, TreeComponent],
	template: `
		<ng-template auSidenavStructure #structure let-state="state" let-directives="directives" let-api="api">
			<au-component auTree [auNodes]="state.items()" [auItemContent]="state.item()" />
		</ng-template>
	`,
})
class SidenavDefaultStructureSlotComponent {
	readonly structure = viewChild.required<TemplateRef<SidenavContext>>('structure');
}

/**
 * A constant representing the default slot for sidenav structure.
 */
export const sidenavDefaultSlotStructure: SlotContent<SidenavContext> = new ComponentTemplate(SidenavDefaultStructureSlotComponent, 'structure');

/**
 * SidenavComponent is an Angular component that extends the BaseWidgetDirective
 * to provide a customizable sidenav widget. This component allows for various
 * configurations and customizations through its inputs and outputs.
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: '[auSidenav]',
	imports: [SlotDirective],
	template: `<ng-template [auSlot]="state.structure()" [auSlotProps]="{state, api, directives}" />`,
})
export class SidenavComponent extends BaseWidgetDirective<SidenavWidget> {
	constructor() {
		super(
			callWidgetFactory(createSidenav, {
				defaultConfig: {
					structure: sidenavDefaultSlotStructure,
					item: sidenavDefaultSlotItem,
				},
				slotTemplates: () => ({
					structure: this.slotStructureFromContent()?.templateRef,
					item: this.slotItemFromContent()?.templateRef,
				}),
			}),
		);
	}
	/**
	 * CSS classes to be applied on the widget main container
	 *
	 * @defaultValue `''`
	 */
	readonly className = input<string>(undefined, {alias: 'auClassName'});

	/**
	 * List of items to be displayed in the sidenav
	 */
	readonly items = input<TreeItem[]>(undefined, {alias: 'auItems'});

	/**
	 * Slot to change the default sidenav item
	 */
	readonly item = input<any>(undefined, {alias: 'auItem'});
	readonly slotItemFromContent = viewChild(SidenavItemDirective);

	/**
	 * Slot to change the default display of the sidenav
	 */
	readonly structure = input<SlotContent<SidenavContext>>(undefined, {alias: 'auStructure'});
	readonly slotStructureFromContent = viewChild(SidenavStructureDirective);
}
