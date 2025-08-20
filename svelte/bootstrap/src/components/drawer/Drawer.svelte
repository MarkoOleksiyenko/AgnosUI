<script lang="ts">
	import {callWidgetFactory} from '../../config';
	import type {DrawerProps} from './drawer.gen';
	import {createDrawer} from './drawer.gen';

	let props: Partial<DrawerProps> = $props();

	const widget = callWidgetFactory(createDrawer, {
		props,
	});
	const {state} = widget;
</script>
