<script lang="ts">
	import {callWidgetFactory} from '../../config';
	import type {SidenavProps} from './sidenav.gen';
	import {createSidenav} from './sidenav.gen';

	let props: Partial<SidenavProps> = $props();

	const widget = callWidgetFactory(createSidenav, {
		props,
	});
	const {state} = widget;
</script>
