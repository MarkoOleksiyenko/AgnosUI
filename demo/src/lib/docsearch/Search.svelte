<script lang="ts">
	import {onMount} from 'svelte';
	import docsearch from '@docsearch/js';
	import '@docsearch/css';
	import {selectedFramework$} from '$lib/stores';

	function generateUniqueId() {
		return 'id-' + Math.random().toString(36).slice(2, 11);
	}
	let uniqueId = generateUniqueId();

	onMount(() => {
		selectedFramework$.subscribe((value) => {
			docsearch({
				container: `#docsearch-${uniqueId}`,
				appId: 'B76VWEHQMR',
				indexName: 'agnosui',
				apiKey: 'e82efd11bdb692114cb75b90299504b8',
				searchParameters: {
					facetFilters: [`${value ? 'tags:' + value : ''}`],
				},
			});
		});
	});
</script>

<div class="py-0 rounded-[40px] px-0" id="docsearch-{uniqueId}"></div>
