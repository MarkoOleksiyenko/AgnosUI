import type {TreeActions, TreeApi, TreeDirectives, TreeProps as CoreProps, TreeState as CoreState} from '@agnos-ui/core/components/tree';
import {createTree as createCoreTree, getTreeDefaultConfig as getCoreDefaultConfig} from '@agnos-ui/core/components/tree';
import {extendWidgetProps} from '@agnos-ui/core/services/extendWidget';
import type {Widget, WidgetFactory, WidgetSlotContext} from '@agnos-ui/core/types';

export * from '@agnos-ui/core/components/tree';

export type TreeContext = WidgetSlotContext<TreeWidget>;

interface TreeExtraProps {}

export interface TreeState extends CoreState, TreeExtraProps {}
export interface TreeProps extends CoreProps, TreeExtraProps {}

export type TreeWidget = Widget<TreeProps, TreeState, TreeApi, TreeActions, TreeDirectives>;

const defaultConfigExtraProps: TreeExtraProps = {};

/**
 * Retrieve a shallow copy of the default Tree config
 * @returns the default Tree config
 */
export function getTreeDefaultConfig(): TreeProps {
	return {...getCoreDefaultConfig(), ...defaultConfigExtraProps};
}

/**
 * Create a Tree with given config props
 * @param config - an optional tree config
 * @returns a TreeWidget
 */
export const createTree: WidgetFactory<TreeWidget> = extendWidgetProps(createCoreTree, defaultConfigExtraProps, {});
