import {useDirective} from '@agnos-ui/react-headless/utils/directive';
import {Slot} from '@agnos-ui/react-headless/slot';
import type {Ref} from 'react';
import {useImperativeHandle} from 'react';
import {useWidget} from '../../config';
import type {SidenavApi, SidenavContext, SidenavProps} from './sidenav.gen';
import {createSidenav} from './sidenav.gen';

/**
 * Renders the default slot structure for a Sidenav component.
 *
 * @param slotContext - The context containing the state and properties for the Sidenav component.
 * @returns The JSX element representing the default slot structure of the Sidenav.
 */
export const DefaultSidenavSlotStructure = (slotContext: SidenavContext) => (
	<>
		{slotContext.state.header && (
			<div className="au-sidenav-header">
				<Slot slotContent={slotContext.state.header} props={slotContext} />
			</div>
		)}
		<div className="au-sidenav-body">
			<Slot slotContent={slotContext.state.children} props={slotContext} />
		</div>
		{slotContext.state.footer && (
			<div className="au-sidenav-footer">
				<Slot slotContent={slotContext.state.footer} props={slotContext} />
			</div>
		)}
	</>
);

const defaultConfig: Partial<SidenavProps> = {
	structure: DefaultSidenavSlotStructure,
};

/**
 * Sidenav component that integrates with a widget context and renders a slot structure.
 *
 * @param props - The properties for the Sidenav component.
 * @returns The rendered Sidenav component.
 *
 * The Sidenav component uses the {@link useWidget} hook to create a widget context with the provided
 * configuration. It renders the slot content using the `Slot` component.
 */
export function Sidenav(props: Partial<SidenavProps> & {ref?: Ref<SidenavApi>}) {
	const widgetContext = useWidget(createSidenav, props, {...defaultConfig});
	useImperativeHandle(props.ref, () => widgetContext.api, [widgetContext.api]);
	return (
		<nav {...useDirective(widgetContext.directives.sidenavDirective)}>
			<Slot slotContent={widgetContext.state.structure} props={widgetContext} />
		</nav>
	);
}
