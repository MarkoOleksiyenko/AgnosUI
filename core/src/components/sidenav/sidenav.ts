import type {WidgetsCommonPropsAndState} from '../commonProps';
import {type ConfigValidator, type PropsConfig, type Widget} from '../../types';
import {stateStores, writablesForProps} from '../../utils/stores';
import {typeArray, typeString} from '../../utils/writables';
import type {TreeItem} from '../tree';

interface SidenavCommonPropsAndState extends WidgetsCommonPropsAndState {
	/**
	 * List of items to be displayed in the sidenav
	 */
	items: TreeItem[];
}

/**
 * Interface representing the properties for the Sidenav component.
 */
export interface SidenavProps extends SidenavCommonPropsAndState {}

/**
 * Represents the state of a Sidenav component.
 */
export interface SidenavState extends SidenavCommonPropsAndState {}

/**
 * Interface representing the API for a Sidenav component.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SidenavApi {}

/**
 * Interface representing various directives used in the Sidenav component.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SidenavDirectives {}

/**
 * Represents a Sidenav widget component.
 */
export type SidenavWidget = Widget<SidenavProps, SidenavState, SidenavApi, SidenavDirectives>;

/**
 * Retrieve a shallow copy of the default Sidenav config
 * @returns the default Sidenav config
 */
export function getSidenavDefaultConfig(): SidenavProps {
	return {
		...defaultSidenavConfig,
	};
}

const defaultSidenavConfig: SidenavProps = {
	className: '',
	items: [],
};

const configValidator: ConfigValidator<SidenavProps> = {
	className: typeString,
	items: typeArray,
};

/**
 * Create a Sidenav widget with given config props
 * @param config - an optional Sidenav config
 * @returns a SidenavWidget
 */
export function createSidenav(config?: PropsConfig<SidenavProps>): SidenavWidget {
	const [{...stateProps}, patch] = writablesForProps(defaultSidenavConfig, config, configValidator);

	const widget: SidenavWidget = {
		...stateStores({...stateProps}),
		patch,
		api: {},
		directives: {},
	};
	return widget;
}
