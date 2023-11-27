import type {WidgetsCommonPropsAndState} from './commonProps';
import type {ConfigValidator, PropsConfig} from './services';
import {bindDirectiveNoArg, stateStores, typeBoolean, writablesForProps} from './services';
import type {TransitionFn} from './transitions';
import {createTransition} from './transitions';
import {fadeTransition} from './transitions/bootstrap';
import type {Directive, SlotContent, Widget, WidgetSlotContext} from './types';
import {noop} from './utils';

export type CommonAlertContext = WidgetSlotContext<CommonAlertWidget>;

export interface CommonAlertCommonPropsAndState extends WidgetsCommonPropsAndState {
	/**
	 * If `true`, alert can be dismissed by the user.
	 * The close button (×) will be displayed and you can be notified of the event with the (close) output.
	 */
	dismissible: boolean;

	/**
	 * Template for the alert content
	 */
	slotDefault: SlotContent<CommonAlertContext>;

	/**
	 * Global template for the alert component
	 */
	slotStructure: SlotContent<CommonAlertContext>;

	/**
	 * If `true` the alert is visible to the user
	 */
	visible: boolean;

	/**
	 * Accessibility close button label
	 */
	ariaCloseButtonLabel: string;
}

export interface CommonAlertState extends CommonAlertCommonPropsAndState {
	/**
	 * Is `true` when the alert is hidden. Compared to `visible`, this is updated after the transition is executed.
	 */
	hidden: boolean;
}

export interface CommonAlertProps extends CommonAlertCommonPropsAndState {
	/**
	 * Callback called when the alert visibility changed.
	 */
	onVisibleChange: (visible: boolean) => void;

	/**
	 * Callback called when the alert is hidden.
	 */
	onHidden: () => void;

	/**
	 * Callback called when the alert is shown.
	 */
	onShown: () => void;

	/**
	 * The transition function will be executed when the alert is displayed or hidden.
	 *
	 * Depending on the value of {@link CommonAlertProps.animationOnInit}, the animation can be optionally skipped during the showing process.
	 */
	transition: TransitionFn;

	/**
	 * If `true`, alert opening will be animated.
	 *
	 * Animation is triggered  when the `.open()` function is called
	 * or the visible prop is changed
	 */
	animationOnInit: boolean;
	/**
	 * If `true`, alert closing will be animated.
	 *
	 * Animation is triggered  when clicked on the close button (×),
	 * via the `.close()` function or the visible prop is changed
	 */
	animation: boolean;
}

export interface CommonAlertApi {
	/**
	 * Triggers alert closing programmatically (same as clicking on the close button (×)).
	 */
	close(): void;

	/**
	 * Triggers the alert to be displayed for the user.
	 */
	open(): void;
}

export interface CommonAlertDirectives {
	/**
	 * the transition directive, piloting what is the visual effect of going from hidden to visible
	 */
	transitionDirective: Directive;
}

export type CommonAlertWidget = Widget<CommonAlertProps, CommonAlertState, CommonAlertApi, object, CommonAlertDirectives>;

export const defaultCommonAlertConfig: CommonAlertProps = {
	visible: true,
	dismissible: true,
	ariaCloseButtonLabel: 'Close',
	onVisibleChange: noop,
	onShown: noop,
	onHidden: noop,
	slotStructure: undefined,
	slotDefault: undefined,
	animation: true,
	animationOnInit: false,
	transition: fadeTransition,
	className: '',
};

/**
 * Retrieve a shallow copy of the default alert config
 * @returns the default alert config
 */
export function getCommonAlertDefaultConfig(): CommonAlertProps {
	return {...defaultCommonAlertConfig};
}

export const commonAlertConfigValidator: ConfigValidator<CommonAlertProps> = {
	dismissible: typeBoolean,
};

/**
 * Create an AlertWidget with given config props
 * @param config - an optional alert config
 * @returns an AlertWidget
 */
export function createCommonAlert(config?: PropsConfig<CommonAlertProps>): CommonAlertWidget {
	const [
		{
			transition$,
			animationOnInit$,
			animation$,
			visible$: requestedVisible$,
			onVisibleChange$,
			onHidden$,
			onShown$,

			...stateProps
		},
		patch,
	] = writablesForProps(defaultCommonAlertConfig, config, commonAlertConfigValidator);

	const transition = createTransition({
		props: {
			transition: transition$,
			visible: requestedVisible$,
			animation: animation$,
			animationOnInit: animationOnInit$,
			onVisibleChange: onVisibleChange$,
			onHidden: onHidden$,
			onShown: onShown$,
		},
	});
	const close = () => {
		patch({visible: false});
	};

	const open = () => {
		patch({visible: true});
	};

	const visible$ = transition.stores.visible$;
	const hidden$ = transition.stores.hidden$;
	return {
		...stateStores({...stateProps, visible$, hidden$}),
		patch,
		api: {
			open,
			close,
		},
		directives: {
			transitionDirective: bindDirectiveNoArg(transition.directives.directive),
		},
		actions: {},
	};
}
