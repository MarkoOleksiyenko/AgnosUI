import type {SidenavProps as CoreProps, SidenavState as CoreState, SidenavApi, SidenavDirectives} from '@agnos-ui/core/components/sidenav';
import {createSidenav as createCoreSidenav, getSidenavDefaultConfig as getCoreDefaultConfig} from '@agnos-ui/core/components/sidenav';
import {extendWidgetProps} from '@agnos-ui/core/services/extendWidget';
import type {ConfigValidator, SlotContent, Widget, WidgetFactory, WidgetSlotContext} from '@agnos-ui/core/types';
import {collapseHorizontalTransition} from '../../services/transitions';

export * from '@agnos-ui/core/components/sidenav';

/**
 * Represents the context for a Sidenav widget.
 * This interface is an alias for `WidgetSlotContext<SidenavWidget>`.
 */
export type SidenavContext = WidgetSlotContext<SidenavWidget>;

/**
 * Represents additional properties for the Sidenav widget like slots etc.
 */
interface SidenavExtraProps {
	/**
	 * Slot to change the default display of the sidenav
	 */
	structure: SlotContent<SidenavContext>;
	/**
	 * Slot to change the default display of the sidenav item
	 */
	children: SlotContent<SidenavContext>;
	/**
	 * Slot to change the default display of the sidenav header
	 */
	header: SlotContent<SidenavContext>;
	/**
	 * Slot to change the default display of the sidenav footer
	 */
	footer: SlotContent<SidenavContext>;
}

/**
 * Represents the state of a Sidenav component.
 */
export interface SidenavState extends CoreState, SidenavExtraProps {}
/**
 * Represents the properties for the Sidenav component.
 */
export interface SidenavProps extends CoreProps, SidenavExtraProps {}
/**
 * Represents a Sidenav widget component.
 */
export type SidenavWidget = Widget<SidenavProps, SidenavState, SidenavApi, SidenavDirectives>;

const defaultConfigExtraProps: SidenavExtraProps = {
	structure: undefined,
	children: undefined,
	header: undefined,
	footer: undefined,
};

/**
 * Retrieve a shallow copy of the default Sidenav config
 * @returns the default Sidenav config
 */
export function getSidenavDefaultConfig(): SidenavProps {
	return {...getCoreDefaultConfig(), ...defaultConfigExtraProps};
}

const configValidator: ConfigValidator<SidenavExtraProps> = {
	structure: undefined,
	children: undefined,
	header: undefined,
	footer: undefined,
};

const coreOverride: Partial<CoreProps> = {
	transition: collapseHorizontalTransition,
};

/**
 * Create a Sidenav with given config props
 * @param config - an optional Sidenav config
 * @returns a SidenavWidget
 */
export const createSidenav: WidgetFactory<SidenavWidget> = extendWidgetProps(
	createCoreSidenav,
	defaultConfigExtraProps,
	configValidator,
	coreOverride,
);
