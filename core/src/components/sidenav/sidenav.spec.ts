import {beforeEach, describe, expect, test} from 'vitest';
import type {SidenavWidget} from './sidenav';
import {createSidenav} from './sidenav';
import type {WidgetState} from '../../types';
import {attachDirectiveAndSendEvent} from '../components.spec-utils';

describe(`Sidenav`, () => {
	let sidenav: SidenavWidget;
	let state: WidgetState<SidenavWidget>;

	beforeEach(() => {
		sidenav = createSidenav();
		sidenav.state$.subscribe((newState) => {
			state = newState;
		});
	});

	test(`should create sidenav with a default state`, () => {
		expect(state).toEqual({
			className: '',
			collapsed: false,
		});
	});

	test(`should toggle on method call`, () => {
		const expectedState = state;
		expect(expectedState.collapsed).toBe(false);
		expect(sidenav.api.toggle()).toBe(true);
		expectedState.collapsed = true;
		expect(state).toEqual(expectedState);
		expect(sidenav.api.toggle()).toBe(false);
		expectedState.collapsed = false;
		expect(state).toEqual(expectedState);
	});

	test(`should properly resize on drag`, () => {
		const testArea = document.body.appendChild(document.createElement('div'));
		testArea.innerHTML = `
			<nav auSidenav id="sidenav">
				<div id="sidenavSplitter"></div>
			</nav>
		`;
		const sidenavElement = testArea.querySelector<HTMLElement>('#sidenav')!;
		const sidenavSplitter = testArea.querySelector<HTMLElement>('#sidenavSplitter')!;
		sidenav.directives.sidenavDirective(sidenavElement);
		sidenav.directives.splitterDirective(sidenavSplitter);

		expect(sidenavElement.style.width).toBe('200px');

		attachDirectiveAndSendEvent(sidenav.directives.splitterDirective, undefined, (node) =>
			node.dispatchEvent(new DragEvent('dragstart', {clientX: 200, clientY: 0})),
		);

		attachDirectiveAndSendEvent(sidenav.directives.splitterDirective, undefined, (node) =>
			node.dispatchEvent(new DragEvent('drag', {clientX: 250, clientY: 0})),
		);

		attachDirectiveAndSendEvent(sidenav.directives.splitterDirective, undefined, (node) =>
			node.dispatchEvent(new DragEvent('dragend', {clientX: 250, clientY: 0})),
		);

		expect(sidenavElement.style.width).toBe('250px');

		testArea.parentElement?.removeChild(testArea);
	});
});
