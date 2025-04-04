import {daisyUIMetadata} from '$lib/components-metadata';
// eslint-disable-next-line @agnos-ui/check-replace-imports
import type {WidgetsConfig} from '@agnos-ui/svelte-headless/config';

export function getMenu(component: string) {
	const componentCapitalized = (component.slice(0, 1).toUpperCase() + component.slice(1)) as Capitalize<keyof WidgetsConfig>;
	const componentNames = Object.keys(daisyUIMetadata);
	const index = componentNames.indexOf(componentCapitalized);
	const isFirst = index === 0;
	const isLast = index === componentNames.length - 1;

	const componentMetadata = daisyUIMetadata[componentCapitalized]!;

	return {
		title: componentCapitalized,
		status: componentMetadata.status,
		since: componentMetadata.since,
		tabs: [
			{title: 'Examples', key: 'headless', path: `/daisyUI/${component}/headless`},
			{title: 'Api', key: 'api', path: `/daisyUI/${component}/api`},
		],
		prev: {
			title: isFirst ? 'Headless Components: Introduction' : componentNames[index - 1],
			slug: isFirst ? 'headless-components/introduction' : `daisyUI/${componentNames[index - 1].toLowerCase()}/`,
			subpath: isFirst ? undefined : 'headless',
		},
		next: {
			title: isLast ? 'Bootstrap Components: Introduction' : componentNames[index + 1],
			slug: isLast ? 'bootstrap-components/introduction' : `daisyUI/${componentNames[index + 1].toLowerCase()}/`,
			subpath: isLast ? undefined : 'headless',
		},
	};
}
