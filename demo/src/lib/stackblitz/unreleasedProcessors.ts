import {createBaseFrameworkProcessors, createFrameworkProcessorsReleased} from './prepareProject';
import type {StackblitzProcessor} from './utils';
import {addAsyncFiles, isBootstrapCondition} from './utils';

export const createFrameworkProcessors =
	import.meta.env.AGNOSUI_VERSION !== '0.0.0'
		? () => createFrameworkProcessorsReleased(import.meta.env.AGNOSUI_VERSION)
		: () => {
				const res = createBaseFrameworkProcessors();

				const mergePackageJson: StackblitzProcessor = async ({files}) => {
					const packageJson = JSON.parse(files['package.json']);
					for (const file of Object.keys(files)) {
						if (file.startsWith('packages/') && file.endsWith('/package.json')) {
							const pkg = JSON.parse(files[file]);
							packageJson.devDependencies[pkg.name] = `file:./packages/${pkg.name}`;
							for (const key of Object.keys(pkg.dependencies ?? {})) {
								if (!files[`packages/${key}/package.json`]) {
									packageJson.devDependencies[key] = pkg.dependencies[key];
								}
							}
						}
					}
					files['package.json'] = JSON.stringify(packageJson, null, '\t');
				};

				const corePackage = addAsyncFiles(
					import.meta.glob(['../../../../core/dist/**', '!**/*.map'], {
						query: '?raw',
						import: 'default',
					}) as any,
					'packages/@agnos-ui/core/',
					'../../../../core/dist/',
				);
				const stylePackage = addAsyncFiles(
					import.meta.glob(['../../../../style-bootstrap/**', '!**/*.map', '!**/*.scss'], {
						query: '?raw',
						import: 'default',
					}) as any,
					'packages/@agnos-ui/style-bootstrap/',
					'../../../../style-bootstrap/',
					isBootstrapCondition,
				);
				res.angular.push(
					corePackage,
					stylePackage,
					addAsyncFiles(
						import.meta.glob(['../../../../angular/headless/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/angular-headless/',
						'../../../../angular/headless/dist/',
					),
					addAsyncFiles(
						import.meta.glob(['../../../../angular/lib/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/angular/',
						'../../../../angular/lib/dist/',
						isBootstrapCondition,
					),
					mergePackageJson,
				);
				res.react.push(
					corePackage,
					stylePackage,
					addAsyncFiles(
						import.meta.glob(['../../../../react/headless/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/react-headless/',
						'../../../../react/headless/dist/',
					),
					addAsyncFiles(
						import.meta.glob(['../../../../react/lib/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/react/',
						'../../../../react/lib/dist/',
						isBootstrapCondition,
					),
					mergePackageJson,
				);
				res.svelte.push(
					corePackage,
					stylePackage,
					addAsyncFiles(
						import.meta.glob(['../../../../svelte/headless/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/svelte-headless/',
						'../../../../svelte/headless/dist/',
					),
					addAsyncFiles(
						import.meta.glob(['../../../../svelte/lib/dist/**', '!**/*.map'], {
							query: '?raw',
							import: 'default',
						}) as any,
						'packages/@agnos-ui/svelte/',
						'../../../../svelte/lib/dist/',
						isBootstrapCondition,
					),
					mergePackageJson,
				);
				return res;
			};
