import {useWidget} from '../../config';
import type {SidenavProps} from './sidenav.gen';
import {createSidenav} from './sidenav.gen';

const defaultConfig: Partial<SidenavProps> = {};

/**
 * Sidenav component that integrates with a widget context and renders a slot structure.
 *
 * @param props - The properties for the Sidenav component.
 * @returns The rendered Sidenav component.
 *
 * The Sidenav component uses the {@link useWidget} hook to create a widget context with the provided
 * configuration. It renders the slot content using the `Slot` component.
 */
export function Sidenav(props: Partial<SidenavProps>) {
	const widgetContext = useWidget(createSidenav, props, {...defaultConfig});
	return ``;
}
