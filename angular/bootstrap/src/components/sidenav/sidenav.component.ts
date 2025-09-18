import type {SlotContent, TransitionFn} from '@agnos-ui/angular-headless';
import {
	auNumberAttribute,
	auBooleanAttribute,
	BaseWidgetDirective,
	callWidgetFactory,
	ComponentTemplate,
	SlotDirective,
	UseDirective,
} from '@agnos-ui/angular-headless';
import {ChangeDetectionStrategy, Component, contentChild, Directive, inject, input, TemplateRef, viewChild, ViewEncapsulation} from '@angular/core';
import type {SidenavContext, SidenavWidget} from './sidenav.gen';
import {createSidenav} from './sidenav.gen';

/**
 * Directive to provide a template reference for sidenav body.
 *
 * This directive uses a template reference to render the {@link SidenavContext}.
 */
@Directive({selector: 'ng-template[auSidenavBody]'})
export class SidenavBodyDirective {
	public templateRef = inject(TemplateRef<SidenavContext>);
	static ngTemplateContextGuard(_dir: SidenavBodyDirective, context: unknown): context is SidenavContext {
		return true;
	}
}

/**
 * Directive to provide a template reference for sidenav header.
 *
 * This directive uses a template reference to render the {@link SidenavContext}.
 */
@Directive({selector: 'ng-template[auSidenavHeader]'})
export class SidenavHeaderDirective {
	public templateRef = inject(TemplateRef<SidenavContext>);
	static ngTemplateContextGuard(_dir: SidenavHeaderDirective, context: unknown): context is SidenavContext {
		return true;
	}
}

/**
 * Directive to provide a template reference for sidenav footer.
 *
 * This directive uses a template reference to render the {@link SidenavContext}.
 */
@Directive({selector: 'ng-template[auSidenavFooter]'})
export class SidenavFooterDirective {
	public templateRef = inject(TemplateRef<SidenavContext>);
	static ngTemplateContextGuard(_dir: SidenavFooterDirective, context: unknown): context is SidenavContext {
		return true;
	}
}

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
	imports: [SidenavStructureDirective, SlotDirective],
	template: `
		<ng-template auSidenavStructure #structure let-state="state" let-api="api" let-directives="directives">
			@if (state.header()) {
				<div class="au-sidenav-header">
					<ng-template [auSlot]="state.header()" [auSlotProps]="{state, api, directives}" />
				</div>
			}
			<div class="au-sidenav-body">
				<ng-template [auSlot]="state.children()" [auSlotProps]="{state, api, directives}" />
			</div>
			@if (state.footer()) {
				<div class="au-sidenav-footer">
					<ng-template [auSlot]="state.footer()" [auSlotProps]="{state, api, directives}" />
				</div>
			}
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
	encapsulation: ViewEncapsulation.None,
	selector: '[auSidenav]',
	imports: [SlotDirective, UseDirective],
	template: `
		<ng-template #content><ng-content /></ng-template>
		<nav [auUse]="directives.sidenavDirective">
			<ng-template [auSlot]="state.structure()" [auSlotProps]="{state, api, directives}" />
			<div [auUse]="directives.splitterDirective">
				<button class="au-sidenav-splitter-handle" aria-label="Resize sidenav">||</button>
			</div>
		</nav>
	`,
})
export class SidenavComponent extends BaseWidgetDirective<SidenavWidget> {
	/**
	 * If `true` the sidenav is collapsed
	 *
	 * @defaultValue `false`
	 */
	readonly collapsed = input(undefined, {alias: 'auCollapsed', transform: auBooleanAttribute});

	/**
	 * The transition function will be executed when the sidenav is collapsed or expanded.
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	readonly transition = input<TransitionFn>(undefined, {alias: 'auTransition'});

	/**
	 * If `true` expanding and collapsing will be animated.
	 */
	readonly animated = input(undefined, {alias: 'auAnimated', transform: auBooleanAttribute});

	/**
	 * CSS classes to be applied on the widget main container
	 *
	 * @defaultValue `''`
	 */
	readonly className = input<string>(undefined, {alias: 'auClassName'});

	/**
	 * Slot to change the default display of the sidenav
	 */
	readonly structure = input<SlotContent<SidenavContext>>(undefined, {alias: 'auStructure'});
	readonly slotStructureFromContent = contentChild(SidenavStructureDirective);

	/**
	 * Slot to change the default display of the sidenav item
	 */
	readonly children = input<SlotContent<SidenavContext>>(undefined, {alias: 'auChildren'});
	readonly slotBodyFromContent = contentChild(SidenavBodyDirective);

	/**
	 * Slot to change the default display of the sidenav header
	 */
	readonly header = input<SlotContent<SidenavContext>>(undefined, {alias: 'auHeader'});
	readonly slotHeaderFromContent = contentChild(SidenavHeaderDirective);

	/**
	 * Slot to change the default display of the sidenav footer
	 */
	readonly footer = input<SlotContent<SidenavContext>>(undefined, {alias: 'auFooter'});
	readonly slotFooterFromContent = contentChild(SidenavFooterDirective);

	readonly slotChildren = viewChild<TemplateRef<void>>('content');

	/**
	 * The width of the sidenav when it is collapsed in pixels.
	 *
	 * @defaultValue 80
	 */
	readonly collapsedWidth = input(undefined, {alias: 'auCollapsedWidth', transform: auNumberAttribute});

	/**
	 * The width of the sidenav in pixels.
	 *
	 * @defaultValue 200
	 */
	readonly width = input(undefined, {alias: 'auWidth', transform: auNumberAttribute});

	constructor() {
		super(
			callWidgetFactory(createSidenav, {
				defaultConfig: {
					structure: sidenavDefaultSlotStructure,
				},
				slotTemplates: () => ({
					structure: this.slotStructureFromContent()?.templateRef,
					children: this.slotBodyFromContent()?.templateRef,
					header: this.slotHeaderFromContent()?.templateRef,
					footer: this.slotFooterFromContent()?.templateRef,
				}),
				slotChildren: () => this.slotChildren(),
			}),
		);
	}
}
