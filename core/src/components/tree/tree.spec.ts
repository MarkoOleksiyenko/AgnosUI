import {computed, writable} from '@amadeus-it-group/tansu';
import type {UnsubscribeFunction, WritableSignal} from '@amadeus-it-group/tansu';
import {createTree} from './tree';
import type {TreeItem, TreeProps, TreeState, TreeWidget} from './tree';
import type {WidgetState} from '../../types';
import {test, expect, describe, beforeEach, afterEach} from 'vitest';
import {assign} from '../../../../common/utils';

const defaultState: () => TreeState = () => ({
	className: '',
	normalizedNodes: [],
	expandedMap: new WeakMap<TreeItem, boolean>(),
	rtl: false,
	ariaLabel: '',
});

describe(`Tree`, () => {
	let tree: TreeWidget;
	let defaultConfig: WritableSignal<Partial<TreeProps>>;
	let state: WidgetState<TreeWidget>;
	let unsubscribe: UnsubscribeFunction;

	const itemExpands: TreeItem[] = [];

	const callbacks = {
		onExpandToggle: (node: TreeItem) => {
			itemExpands.push(node);
		},
	};

	beforeEach(() => {
		defaultConfig = writable({});
		tree = createTree({config: computed(() => ({...callbacks, ...defaultConfig()}))});

		unsubscribe = tree.state$.subscribe((newState) => {
			state = newState;
		});
	});

	afterEach(() => {
		unsubscribe();
	});

	test(`should create the default configuration for the model`, () => {
		expect(state).toStrictEqual(defaultState());
	});

	test(`should update state according to the input`, () => {
		expect(state).toStrictEqual(defaultState());
		tree.patch({nodes: [{label: 'root', ariaLabel: 'root', children: [{label: 'child', ariaLabel: 'child'}]}]});

		const expectedState = defaultState();

		expect(state).toStrictEqual(
			assign(expectedState, {
				normalizedNodes: [
					{
						label: 'root',
						ariaLabel: 'root',
						level: 0,
						children: [
							{
								label: 'child',
								ariaLabel: 'child',
								level: 1,
							},
						],
					},
				],
				expandedMap: new WeakMap(), // TODO can we check the contents of the map?
				rtl: false,
				ariaLabel: '',
			}),
		);
	});

	test(`should register the callback for the onExpandToggle event`, () => {
		expect(itemExpands).toStrictEqual([]);
		tree.actions.toggleExpanded({label: 'root', ariaLabel: 'root', children: []});
		expect(itemExpands).toStrictEqual([{label: 'root', ariaLabel: 'root', children: []}]);
	});
});
