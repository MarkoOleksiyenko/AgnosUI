import type {ReadableSignal} from '@amadeus-it-group/tansu';
import {computed, writable} from '@amadeus-it-group/tansu';
import type {Directive} from '../../types';
import {type ConfigValidator, type PropsConfig, type Widget} from '../../types';
import {createAttributesDirective} from '../../utils/directive';
import {stateStores, writablesForProps} from '../../utils/stores';
import {typeArray, typeFunction, typeString} from '../../utils/writables';
import type {WidgetsCommonPropsAndState} from '../commonProps';
import {noop} from '../../utils/internal/func';

export interface TreeItem {
	/**
	 * Accessiblity label for the node
	 */
	ariaLabel: string;
	/**
	 * Optional array of children nodes
	 */
	children?: TreeItem[];
	/**
	 * If `true` the node is expanded
	 */
	isExpanded?: boolean;
	/**
	 * String title of the node
	 */
	label: string;
	/**
	 * level in the hierarchy, starts with 0 for a root node
	 */
	level?: number;
}

interface TreeCommonPropsAndState extends WidgetsCommonPropsAndState {
	/**
	 * If `true` the tree is displayed right-to-left
	 *
	 * @defaultValue `false`
	 */
	rtl?: boolean;
	/**
	 * Optional accessiblity label for the tree if there is no explicit label
	 *
	 * @defaultValue `''`
	 */
	ariaLabel?: string;
}

export interface TreeProps extends TreeCommonPropsAndState {
	/**
	 * Array of the tree nodes to display
	 *
	 * @defaultValue `[]`
	 */
	nodes: TreeItem[];
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
	onExpandToggle: (node: TreeItem) => void;
}

export interface TreeState extends TreeCommonPropsAndState {
	/**
	 * Array of normalized tree nodes
	 */
	normalizedNodes: TreeItem[];
	/**
	 * Map of expanded state for each tree node
	 */
	expandedMap: WeakMap<TreeItem, boolean>;
}

export interface TreeApi {}

export interface TreeDirectives {
	/**
	 * Directive to handle toggle for the tree item
	 */
	treeItemToggleDirective: Directive<{item: TreeItem}>;
}

export interface TreeActions {
	/**
	 * Method to toggle the expanded state of a tree node
	 * @param node
	 * @returns
	 */
	toggleExpanded: (node: TreeItem) => void;
}

export type TreeWidget = Widget<TreeProps, TreeState, TreeApi, TreeActions, TreeDirectives>;

/**
 * Retrieve a shallow copy of the default Tree config
 * @returns the default Tree config
 */
export function getTreeDefaultConfig(): TreeProps {
	return {
		...defaultTreeConfig,
	};
}

const defaultTreeConfig: TreeProps = {
	className: '',
	nodes: [],
	rtl: false,
	onExpandToggle: noop,
};

const configValidator: ConfigValidator<TreeProps> = {
	className: typeString,
	nodes: typeArray,
	onExpandToggle: typeFunction,
};

/**
 * Create a tree widget with given config props
 * @param config - an optional tree config
 * @returns a TreeWidget
 */
export function createTree(config?: PropsConfig<TreeProps>): TreeWidget {
	const [{nodes$, onExpandToggle$, ...stateProps}, patch] = writablesForProps(defaultTreeConfig, config, configValidator);

	const _expandedMap$ = writable(new WeakMap<TreeItem, boolean>());
	const _stateChange$ = writable({});

	const expandedMap$ = computed(() => {
		_stateChange$();
		// TODO check how many times this is called
		return _expandedMap$();
	});

	const traverseTree = (node: TreeItem, level: number) => {
		const copyNode = {...node, level, children: node.children ?? []}; // TODO test that undefined children are handled correctly
		_expandedMap$().set(copyNode, node.isExpanded ?? false);
		if (node.children) {
			copyNode.children = node.children.map((child) => traverseTree(child, level + 1));
		}

		return copyNode;
	};

	// normalize the tree nodes
	const normalizedNodes$ = computed(() => nodes$().map((node) => traverseTree(node, 0)));

	const widget: TreeWidget = {
		...stateStores({normalizedNodes$, expandedMap$, ...stateProps}),
		patch,
		api: {},
		directives: {
			treeItemToggleDirective: createAttributesDirective((treeItemContext$: ReadableSignal<{item: TreeItem}>) => ({
				events: {
					click: () => {
						const {item} = treeItemContext$();
						widget.actions.toggleExpanded(item);
					},
				},
			})),
		},
		actions: {
			toggleExpanded: (node: TreeItem) => {
				_expandedMap$().set(node, !_expandedMap$().get(node));
				_stateChange$.set({});
				onExpandToggle$()(node);
			},
		},
	};
	return widget;
}
