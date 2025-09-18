import type {TreeProps as CoreProps, TreeState as CoreState, NormalizedTreeItem, TreeApi, TreeDirectives} from '@agnos-ui/core/components/tree';
import {createTree as createCoreTree, getTreeDefaultConfig as getCoreDefaultConfig} from '@agnos-ui/core/components/tree';
import {extendWidgetProps} from '@agnos-ui/core/services/extendWidget';
import type {ConfigValidator, PropsConfig, SlotContent, Widget, WidgetSlotContext} from '@agnos-ui/core/types';

export * from '@agnos-ui/core/components/tree';

/**
 * Represents the context for a Tree widget.
 * This interface is an alias for `WidgetSlotContext<TreeWidget>`.
 *
 * @template Data - The type of data to pass to slots (if any).
 */
export type TreeContext<Data> = WidgetSlotContext<TreeWidget<Data>>;
/**
 * Represents the context for a tree item, extending the base `TreeContext`
 * with an additional `item` property.
 *
 * @template Data - The type of data to pass to slots (if any).
 */
export type TreeSlotItemContext<Data> = TreeContext<Data> & {item: NormalizedTreeItem};

interface TreeExtraProps<Data> {
	/**
	 * Slot to change the default display of the tree
	 */
	structure: SlotContent<TreeContext<Data>>;
	/**
	 * Slot to change the default tree item
	 */
	item: SlotContent<TreeSlotItemContext<Data>>;
	/**
	 * Slot to change the default tree item content
	 */
	itemContent: SlotContent<TreeSlotItemContext<Data>>;
	/**
	 * Slot to change the default tree item toggle
	 */
	itemToggle: SlotContent<TreeSlotItemContext<Data>>;
	/**
	 * Data to use in content slots
	 */
	contentData: Data;
}

/**
 * Represents the state of a Tree component.
 *
 * @template Data - The type of data to pass to slots (if any).
 */
export interface TreeState<Data> extends CoreState, TreeExtraProps<Data> {}
/**
 * Represents the properties for the Tree component.
 *
 * @template Data - The type of data to pass to slots (if any).
 */
export interface TreeProps<Data> extends CoreProps, TreeExtraProps<Data> {}
/**
 * Represents a Tree widget component.
 *
 * @template Data - The type of data to pass to slots (if any).
 */
export type TreeWidget<Data> = Widget<TreeProps<Data>, TreeState<Data>, TreeApi, TreeDirectives>;

const defaultConfigExtraProps: TreeExtraProps<any> = {
	structure: undefined,
	item: undefined,
	itemContent: undefined,
	itemToggle: undefined,
	contentData: undefined,
};

const configValidator: ConfigValidator<TreeExtraProps<any>> = {
	structure: undefined,
	item: undefined,
	itemContent: undefined,
	itemToggle: undefined,
	contentData: undefined,
};

/**
 * Retrieve a shallow copy of the default Tree config
 * @returns the default Tree config
 */
export function getTreeDefaultConfig(): TreeProps<any> {
	return {...getCoreDefaultConfig(), ...defaultConfigExtraProps};
}

/**
 * Create a Tree with given config props
 * @param config - an optional tree config
 * @returns a TreeWidget
 */
export const createTree: <Data>(config?: PropsConfig<TreeProps<Data>>) => TreeWidget<Data> = extendWidgetProps(
	createCoreTree,
	defaultConfigExtraProps,
	configValidator,
);
