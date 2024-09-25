import type {TreeWidget} from '@agnos-ui/angular-headless';
import {auBooleanAttribute, BaseWidgetDirective, callWidgetFactory, createTree, UseDirective, type TreeItem} from '@agnos-ui/angular-headless';
import {NgTemplateOutlet} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: '[auTree]',
	standalone: true,
	template: `
		<div role="tree" class="au-tree">
			@for (node of state().normalizedNodes; track node) {
				<ng-container [ngTemplateOutlet]="treeItem" [ngTemplateOutletContext]="{$implicit: node}"> </ng-container>
			}
		</div>
		<ng-template #treeItem let-node>
			<div [class.au-tree-item]="node.children.length === 0" [class.au-tree-item-parent]="node.children.length > 0">
				@if (node.children.length > 0) {
					<button
						class="au-tree-expand-button"
						[class.au-tree-expand-button-expanded]="state().expandedMap.get(node)"
						[auUse]="[widget.directives.treeItemToggleDirective, {item: node}]"
					></button>
				} @else {
					<span class="au-tree-expand-button-placeholder"></span>
				}
				{{ node.label }}
				@if (state().expandedMap.get(node)) {
					@for (child of node.children; track child) {
						<ng-container *ngTemplateOutlet="treeItem; context: {$implicit: child}"></ng-container>
					}
				}
			</div>
		</ng-template>
	`,
	imports: [NgTemplateOutlet, UseDirective],
})
export class TreeComponent extends BaseWidgetDirective<TreeWidget> {
	/**
	 * Optional accessiblity label for the tree if there is no explicit label
	 *
	 * @defaultValue `''`
	 */
	@Input('auAriaLabel') ariaLabel: string | undefined;
	/**
	 * Array of the tree nodes to display
	 *
	 * @defaultValue `[]`
	 */
	@Input('auNodes') nodes: TreeItem[] | undefined;
	/**
	 * If `true` the tree is displayed right-to-left
	 *
	 * @defaultValue `false`
	 */
	@Input({alias: 'auRtl', transform: auBooleanAttribute}) rtl: boolean | undefined;
	/**
	 * CSS classes to be applied on the widget main container
	 *
	 * @defaultValue `''`
	 */
	@Input('auClassName') className: string | undefined;

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
	@Output('auExpandToggle') expandToggle = new EventEmitter<TreeItem>();

	readonly _widget = callWidgetFactory({
		factory: createTree,
		widgetName: 'tree',
		events: {
			onExpandToggle: (item: TreeItem) => this.expandToggle.emit(item),
		},
	});
}
