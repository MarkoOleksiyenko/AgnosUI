import {computed, writable} from '@amadeus-it-group/tansu';
import type {TransitionFn} from '../../services/transitions/baseTransitions';
import {createTransition} from '../../services/transitions/baseTransitions';
import type {Directive} from '../../types';
import {type ConfigValidator, type PropsConfig, type Widget} from '../../types';
import {bindDirective, createAttributesDirective, mergeDirectives} from '../../utils/directive';
import {noop} from '../../utils/func';
import {stateStores, true$, writablesForProps} from '../../utils/stores';
import {typeFunction, typeHTMLElementOrNull, typeString} from '../../utils/writables';
import type {WidgetsCommonPropsAndState} from '../commonProps';
import {portal} from '../../services/portal';

interface DrawerCommonPropsAndState extends WidgetsCommonPropsAndState {
	/**
	 * Which element should contain the modal and backdrop DOM elements.
	 * If it is not null, the modal and backdrop DOM elements are moved to the specified container.
	 * Otherwise, they stay where the widget is located.
	 *
	 * @defaultValue
	 * ```ts
	 * typeof window !== 'undefined' ? document.body : null
	 * ```
	 */
	container: HTMLElement | null;
	/**
	 * Classes to add on the backdrop DOM element.
	 *
	 * @defaultValue `''`
	 */
	backdropClass: string;
}

/**
 * Interface representing the properties for the Drawer component.
 */
export interface DrawerProps extends DrawerCommonPropsAndState {
	/**
	 * The transition function will be executed when the alert is displayed or hidden.
	 *
	 * Depending on the value of `animatedOnInit`, the animation can be optionally skipped during the showing process.
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	transition: TransitionFn;
	/**
	 * The transition to use for the backdrop behind the drawer (if present).
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	backdropTransition: TransitionFn;
}

/**
 * Represents the state of a Drawer component.
 */
export interface DrawerState extends DrawerCommonPropsAndState {
	/**
	 * If `true`, the drawer is shown; otherwise, it is hidden.
	 *
	 * @defaultValue `false`
	 */
	visible: boolean;
	/**
	 * If `true`, the drawer backdrop is shown; otherwise, it is hidden.
	 */
	backdropVisible: boolean;
}

/**
 * Interface representing the API for a Drawer component.
 */
export interface DrawerApi {
	/**
	 * Trigger the opening of the drawer.
	 */
	open: () => void;
	/**
	 * Trigger the closing of the drawer.
	 */
	close: () => void;
}

/**
 * Interface representing various directives used in the Drawer component.
 */
export interface DrawerDirectives {
	/**
	 * Directive to put on the drawer DOM element.
	 */
	drawerDirective: Directive;
	/**
	 * Portal directive to put on the drawer DOM element.
	 */
	drawerPortalDirective: Directive;
	/**
	 * Directive to put on the backdrop DOM element.
	 */
	backdropDirective: Directive;
	/**
	 * Portal directive to put on the backdrop DOM element.
	 */
	backdropPortalDirective: Directive;
}

/**
 * Represents a Drawer widget component.
 */
export type DrawerWidget = Widget<DrawerProps, DrawerState, DrawerApi, DrawerDirectives>;

/**
 * Retrieve a shallow copy of the default Drawer config
 * @returns the default Drawer config
 */
export function getDrawerDefaultConfig(): DrawerProps {
	return {
		...defaultDrawerConfig,
	};
}

const defaultDrawerConfig: DrawerProps = {
	backdropClass: '',
	backdropTransition: noop,
	className: '',
	container: typeof window !== 'undefined' ? document.body : null,
	transition: noop,
};

const configValidator: ConfigValidator<DrawerProps> = {
	backdropClass: typeString,
	backdropTransition: typeFunction,
	className: typeString,
	transition: typeFunction,
	container: typeHTMLElementOrNull,
};

/**
 * Create a Drawer widget with given config props
 * @param config - an optional Drawer config
 * @returns a DrawerWidget
 */
export function createDrawer(config?: PropsConfig<DrawerProps>): DrawerWidget {
	const [{backdropTransition$, backdropClass$, transition$, container$, className$, ...stateProps}, patch] = writablesForProps(
		defaultDrawerConfig,
		config,
		configValidator,
	);

	const visible$ = writable(false);

	const transition = createTransition({
		props: {
			transition: transition$,

			// visible: requestedVisible$,
			// animated: animated$,
			// animatedOnInit: animatedOnInit$,
			// onVisibleChange: onVisibleChange$,
			// onHidden: onHidden$,
			// onShown: onShown$,
		},
	});

	const close = () => {
		visible$.set(false);
	};

	const open = () => {
		console.log('opened');
		visible$.set(true);
	};

	const drawerPortalDirective = bindDirective(
		portal,
		computed(() => ({container: container$()})),
	);

	const drawerAttributeDirective = createAttributesDirective(() => ({
		attributes: {
			class: className$,
		},
		classNames: {
			'au-drawer': true$,
			show: visible$,
		},
		events: {
			click: (event) => {
				if (event.currentTarget === event.target) {
					close();
				}
			},
		},
	}));

	const backdropTransition = createTransition({
		props: {
			transition: backdropTransition$,
			// visible: requestedVisible$,
			// animated: animated$,
			// animatedOnInit: animated$,
		},
	});

	const backdropPortalDirective = bindDirective(
		portal,
		computed(() => {
			const container = container$();
			const element = container ? transition.stores.element$() : undefined;
			return {
				container,
				insertBefore: element?.parentElement === container ? element : undefined,
			};
		}),
	);

	const backdropAttributeDirective = createAttributesDirective(() => ({
		attributes: {
			class: backdropClass$,
		},
		classNames: {
			'drawer-backdrop': true$,
			show: visible$,
		},
		events: {
			click: (event) => {
				if (event.currentTarget === event.target) {
					close();
				}
			},
		},
	}));

	const transitioning$ = computed(() => transition.stores.transitioning$() || backdropTransition.stores.transitioning$());
	const hidden$ = computed(() => !transitioning$() && !visible$());

	const widget: DrawerWidget = {
		...stateStores({
			...stateProps,
			backdropClass$,
			className$,
			container$,
			visible$,
			backdropVisible$: hidden$,
		}),
		patch,
		api: {
			open,
			close,
		},
		directives: {
			drawerPortalDirective,
			drawerDirective: mergeDirectives(transition.directives.directive, drawerAttributeDirective),
			backdropPortalDirective,
			backdropDirective: mergeDirectives(backdropTransition.directives.directive, backdropAttributeDirective),
		},
	};
	return widget;
}
