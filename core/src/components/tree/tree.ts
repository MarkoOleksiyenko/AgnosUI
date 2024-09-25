import {computed} from '@amadeus-it-group/tansu';
import {INVALID_VALUE, type ConfigValidator, type PropsConfig, type Widget} from '../../types';
import {stateStores, writablesForProps} from '../../utils/stores';
import {typeBoolean, typeString} from '../../utils/writables';
import type {WidgetsCommonPropsAndState} from '../commonProps';

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
	isExpanded: boolean;
	/**
	 * String title of the node
	 */
	label: string;
}

export interface TreeProps extends WidgetsCommonPropsAndState {
	/**
	 * Optional accessiblity label for the tree if there is no explicit label
	 *
	 * @defaultValue `''`
	 */
	ariaLabel: string;
	/**
	 * Array of the tree nodes to display
	 *
	 * @defaultValue `[]`
	 */
	root: TreeItem;
	/**
	 * If `true` the tree is displayed right-to-left
	 *
	 * @defaultValue `false`
	 */
	rtl: boolean;
}

export interface TreeState extends WidgetsCommonPropsAndState {}

export interface TreeApi {}

export interface TreeDirectives {}

export interface TreeActions {}

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
	ariaLabel: '',
	className: '',
	root: {} as TreeItem,
	rtl: false,
};

const configValidator: ConfigValidator<TreeProps> = {
	ariaLabel: typeString,
	className: typeString,
	// check whether the root is a valid tree item
	root: {
		normalizeValue: (value) => {
			return INVALID_VALUE;
		},
	},
	rtl: typeBoolean,
};

/**
 * Create a tree widget with given config props
 * @param config - an optional tree config
 * @returns a TreeWidget
 */
export function createTree(config?: PropsConfig<TreeProps>): TreeWidget {
	const [{root$, ...stateProps}, patch] = writablesForProps(defaultTreeConfig, config, configValidator);

	const expandedMap = new WeakMap<TreeItem, boolean>();

	const traverseTree = (node: TreeItem) => {
		const copyNode = {...node};
		expandedMap.set(node, node.isExpanded);

		if (node.children) {
			copyNode.children = node.children.map((child) => traverseTree(child));
		}

		return copyNode;
	};

	// normalize the tree nodes
	const tree = computed(() => traverseTree(root$()));

	const widget: TreeWidget = {
		...stateStores({...stateProps}),
		patch,
		api: {},
		directives: {},
		actions: {},
	};
	return widget;
}
