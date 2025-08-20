import type {SlotContent, TransitionFn} from '@agnos-ui/angular-headless';
import {BaseWidgetDirective, callWidgetFactory, ComponentTemplate, SlotDirective, UseMultiDirective} from '@agnos-ui/angular-headless';
import {ChangeDetectionStrategy, Component, contentChild, Directive, inject, input, TemplateRef, viewChild} from '@angular/core';
import type {DrawerContext, DrawerWidget} from './drawer.gen';
import {createDrawer} from './drawer.gen';

/**
 * Directive to define the structure of a drawer component.
 * This directive uses a template reference to render the {@link DrawerContext}.
 */
@Directive({selector: 'ng-template[auDrawerStructure]'})
export class DrawerStructureDirective {
	public templateRef = inject(TemplateRef<DrawerContext>);
	static ngTemplateContextGuard(_dir: DrawerStructureDirective, context: unknown): context is DrawerContext {
		return true;
	}
}

/**
 * Directive representing the header of a drawer component.
 * This directive uses a template reference to render the {@link DrawerContext}.
 */
@Directive({selector: 'ng-template[auDrawerHeader]'})
export class DrawerHeaderDirective {
	public templateRef = inject(TemplateRef<DrawerContext>);
	static ngTemplateContextGuard(_dir: DrawerHeaderDirective, context: unknown): context is DrawerContext {
		return true;
	}
}

/**
 * Directive to represent the body of a drawer notification.
 * This directive uses a template reference to render the {@link DrawerContext}.
 */
@Directive({selector: 'ng-template[auDrawerBody]'})
export class DrawerBodyDirective {
	public templateRef = inject(TemplateRef<DrawerContext>);
	static ngTemplateContextGuard(_dir: DrawerBodyDirective, context: unknown): context is DrawerContext {
		return true;
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SlotDirective, DrawerStructureDirective],
	template: ` <ng-template auDrawerStructure #structure let-state="state" let-api="api" let-directives="directives">
		@if (state.header()) {
			<div class="au-drawer-header">
				<ng-template [auSlot]="state.header()" [auSlotProps]="{state, api, directives}" />
			</div>
		}
		<div class="au-drawer-body">
			<ng-template [auSlot]="state.children()" [auSlotProps]="{state, api, directives}" />
		</div>
	</ng-template>`,
})
class DrawerDefaultSlotsComponent {
	readonly structure = viewChild.required<TemplateRef<DrawerContext>>('structure');
}

/**
 * Represents the default slot structure for the drawer component.
 */
export const drawerDefaultSlotStructure: SlotContent<DrawerContext> = new ComponentTemplate(DrawerDefaultSlotsComponent, 'structure');

/**
 * DrawerComponent is an Angular component that extends the BaseWidgetDirective
 * to provide a customizable drawer widget. This component allows for various
 * configurations and customizations through its inputs and outputs.
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [UseMultiDirective, SlotDirective],
	selector: '[auDrawer]',
	template: `
		<ng-template #content><ng-content /></ng-template>
		<div [auUseMulti]="[directives.drawerPortalDirective, directives.drawerDirective]">
			<ng-template [auSlot]="state.structure()" [auSlotProps]="{state, api, directives}" />
			<div #splitter class="splitter"></div>
		</div>
		<div [auUseMulti]="[directives.backdropPortalDirective, directives.backdropDirective]"></div>
	`,
})
export class DrawerComponent extends BaseWidgetDirective<DrawerWidget> {
	constructor() {
		super(
			callWidgetFactory(createDrawer, {
				defaultConfig: {
					structure: drawerDefaultSlotStructure,
				},
				slotTemplates: () =>
					({
						structure: this.slotStructureFromContent()?.templateRef,
						header: this.slotHeaderFromContent()?.templateRef,
						children: this.slotBodyFromContent()?.templateRef,
					}) as any,
				slotChildren: () => this.slotChildren(),
			}),
		);
	}

	/**
	 * The transition function will be executed when the alert is displayed or hidden.
	 *
	 * Depending on the value of `animatedOnInit`, the animation can be optionally skipped during the showing process.
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	readonly transition = input<TransitionFn>(undefined, {alias: 'auTransition'});

	/**
	 * The transition to use for the backdrop behind the drawer (if present).
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	readonly backdropTransition = input<TransitionFn>(undefined, {alias: 'auBackdropTransition'});

	/**
	 * Which element should contain the modal and backdrop DOM elements.
	 * If it is not null, the modal and backdrop DOM elements are moved to the specified container.
	 * Otherwise, they stay where the widget is located.
	 *
	 * @defaultValue
	 * ```ts
	 * typeof window !== 'undefined' ? document.body : null
	 * ```
	 * TODO: do we need the container for the drawer?
	 */
	readonly container = input<HTMLElement | null>(undefined, {alias: 'auContainer'});

	/**
	 * Classes to add on the backdrop DOM element.
	 *
	 * @defaultValue `''`
	 */
	readonly backdropClass = input<string>(undefined, {alias: 'auBackdropClass'});

	/**
	 * CSS classes to be applied on the widget main container
	 *
	 * @defaultValue `''`
	 */
	readonly className = input<string>(undefined, {alias: 'auClassName'});

	/**
	 * Global template for the drawer component
	 */
	readonly structure = input<SlotContent<DrawerContext>>(undefined, {alias: 'auStructure'});
	readonly slotStructureFromContent = contentChild(DrawerStructureDirective);

	/**
	 * Template for the drawer header
	 */
	readonly header = input<SlotContent<DrawerContext>>(undefined, {alias: 'auHeader'});
	readonly slotHeaderFromContent = contentChild(DrawerHeaderDirective);

	/**
	 * Template for the drawer body
	 */
	readonly children = input<SlotContent<DrawerContext>>(undefined, {alias: 'auChildren'});
	readonly slotBodyFromContent = contentChild(DrawerBodyDirective);

	readonly slotChildren = viewChild<TemplateRef<void>>('content');
}
