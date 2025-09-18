import {computed, readable, writable} from '@amadeus-it-group/tansu';
import type {TransitionFn} from '../../services/transitions/baseTransitions';
import {createTransition} from '../../services/transitions/baseTransitions';
import type {Directive} from '../../types';
import {type ConfigValidator, type PropsConfig, type Widget} from '../../types';
import {createAttributesDirective, mergeDirectives} from '../../utils/directive';
import {noop} from '../../utils/func';
import {stateStores, true$, writablesForProps} from '../../utils/stores';
import {typeBoolean, typeFunction, typeNumber, typeString} from '../../utils/writables';
import type {WidgetsCommonPropsAndState} from '../commonProps';

interface SidenavCommonPropsAndState extends WidgetsCommonPropsAndState {
	/**
	 * If `true` the sidenav is collapsed
	 *
	 * @defaultValue `false`
	 */
	collapsed: boolean;
}

/**
 * Interface representing the properties for the Sidenav component.
 */
export interface SidenavProps extends SidenavCommonPropsAndState {
	/**
	 * The transition function will be executed when the sidenav is collapsed or expanded.
	 *
	 * @defaultValue
	 * ```ts
	 * () => {}
	 * ```
	 */
	transition: TransitionFn;
	/**
	 * If `true` expanding and collapsing will be animated.
	 */
	animated: boolean;
	/**
	 * The width of the sidenav in pixels.
	 *
	 * @defaultValue 200
	 */
	width: number;
	/**
	 * The minimum width of the sidenav in pixels after which it changes the state from/to collapsed.
	 *
	 * @defaultValue 100
	 */
	minWidth: number;
	/**
	 * The width of the sidenav in the collapsed mode in pixels.
	 *
	 * @defaultValue 80
	 */
	collapsedWidth: number;
	/**
	 * The minimum width of the sidenav in the collapsed mode in pixels.
	 *
	 * @defaultValue 75
	 */
	collapsedMinWidth: number;
}

/**
 * Represents the state of a Sidenav component.
 */
export interface SidenavState extends SidenavCommonPropsAndState {}

/**
 * Interface representing the API for a Sidenav component.
 */
export interface SidenavApi {
	/**
	 * Toggles the collapsed state of the sidenav.
	 * @returns The new collapsed state after toggling.
	 */
	toggle: () => boolean;
	/**
	 * Method to check if the sidenav is collapsed.
	 * @returns `true` if the sidenav is collapsed, otherwise `false`.
	 */
	isCollapsed?: () => boolean;
}

/**
 * Interface representing various directives used in the Sidenav component.
 */
export interface SidenavDirectives {
	/**
	 * Directive to put on the sidenav DOM element.
	 */
	sidenavDirective: Directive;
	/**
	 * Directive to put on the splitter DOM element.
	 */
	splitterDirective: Directive;
}

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
	animated: true,
	className: '',
	collapsed: false,
	transition: noop,
	width: 200,
	collapsedWidth: 75,
	minWidth: 100,
	collapsedMinWidth: 75,
};

const configValidator: ConfigValidator<SidenavProps> = {
	animated: typeBoolean,
	className: typeString,
	collapsed: typeBoolean,
	transition: typeFunction,
	width: typeNumber,
	collapsedWidth: typeNumber,
	minWidth: typeNumber,
	collapsedMinWidth: typeNumber,
};

/**
 * Create a Sidenav widget with given config props
 * @param config - an optional Sidenav config
 * @returns a SidenavWidget
 */
export function createSidenav(config?: PropsConfig<SidenavProps>): SidenavWidget {
	const [{animated$, className$, collapsed$, transition$, width$, collapsedWidth$, minWidth$, collapsedMinWidth$, ...stateProps}, patch] =
		writablesForProps(defaultSidenavConfig, config, configValidator);
	// TODO: create a new transition because the collapse hidden state is hidden and we want to have it minimized ?
	const transition = createTransition({
		props: {
			animated: animated$,
			animatedOnInit: animated$,
			transition: transition$,
		},
	});

	const currentWidth$ = writable(width$());

	const sidenavAttributeDirective = createAttributesDirective(() => ({
		attributes: {
			class: className$,
		},
		styles: {
			width: computed(() => `${currentWidth$()}px`),
			minWidth: computed(() => (collapsed$() ? `${collapsedMinWidth$()}px` : `${minWidth$()}px`)),
		},
		classNames: {
			'au-sidenav': true$,
			'au-collapsed': collapsed$,
		},
	}));

	const startDimension = writable(0);
	const startPos = writable(0);
	const dimension = writable(200);

	const splitterDirective = createAttributesDirective(() => ({
		attributes: {
			draggable: readable('true'),
		},
		classNames: {
			splitter: true$,
		},
		events: {
			dragstart: (e: DragEvent) => {
				startPos.set(e.clientX);
				startDimension.set(currentWidth$());
				e.dataTransfer?.setDragImage(new Image(), 0, 0); // Remove drag image
			},
			dragend: () => {
				document.body.style.cursor = '';
			},
			dragover: (event: DragEvent) => {
				event.preventDefault();
			},
			drag: (e: DragEvent) => {
				if (e.clientX > 0) {
					dimension.set(startDimension() + (e.clientX - startPos()));
					// TODO: change the state from/to collapsed when the minWidth is reached
					currentWidth$.set(dimension());
					if (collapsed$()) {
						collapsedWidth$.set(dimension());
					} else {
						width$.set(dimension());
					}
				}
			},
		},
	}));

	const widget: SidenavWidget = {
		...stateStores({
			...stateProps,
			className$,
			collapsed$,
		}),
		patch,
		api: {
			toggle: () => {
				collapsed$.update((c: boolean) => !c);
				currentWidth$.set(collapsed$() ? collapsedWidth$() : width$());
				return collapsed$();
			},
			isCollapsed: () => collapsed$(),
		},
		directives: {
			sidenavDirective: mergeDirectives(transition.directives.directive, sidenavAttributeDirective),
			splitterDirective,
		},
	};
	return widget;
}
