import {Slot} from '@agnos-ui/react-headless/slot';
import {useWidget} from '../../config';
import type {DrawerApi, DrawerContext, DrawerProps} from './drawer.gen';
import {createDrawer} from './drawer.gen';
import type {Ref} from 'react';
import {useImperativeHandle} from 'react';
import {useDirectives} from '@agnos-ui/react-headless/utils/directive';

const DrawerHeader = (slotContext: DrawerContext) => (
	<div className="au-drawer-header">
		<Slot slotContent={slotContext.state.header} props={slotContext} />
	</div>
);

/**
 * Renders the default slot structure for a Toast component.
 *
 * @param slotContext - The context containing the state and properties for the Toast component.
 * @returns The JSX element representing the default slot structure of the Toast.
 */
export const DefaultDrawerSlotStructure = (slotContext: DrawerContext) => (
	<div {...useDirectives(slotContext.directives.drawerPortalDirective, slotContext.directives.drawerDirective)}>
		<DrawerHeader {...slotContext} />
		<div className="au-drawer-body">
			<Slot slotContent={slotContext.state.children} props={slotContext} />
		</div>
		<div {...useDirectives(slotContext.directives.backdropPortalDirective, slotContext.directives.backdropDirective)} />
	</div>
);

const defaultConfig: Partial<DrawerProps> = {
	structure: DefaultDrawerSlotStructure,
};

/**
 * Drawer component that integrates with a widget context and renders a slot structure.
 *
 * @param props - The properties for the Drawer component.
 * @param props.ref - Ref to expose the Drawer API.
 * @returns The rendered Drawer component.
 *
 * The Drawer component uses the {@link useWidget} hook to create a widget context with the provided
 * configuration. It renders the slot content using the `Slot` component.
 */
export function Drawer(props: Partial<DrawerProps> & {ref?: Ref<DrawerApi>}) {
	const widgetContext = useWidget(createDrawer, props, {...defaultConfig});
	useImperativeHandle(props.ref, () => widgetContext.api, [widgetContext.api]);
	return <Slot slotContent={widgetContext.state.structure} props={widgetContext} />;
}
