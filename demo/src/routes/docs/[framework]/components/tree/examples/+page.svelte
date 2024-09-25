<script lang="ts">
	import sampleBasic from '@agnos-ui/samples/bootstrap/tree/basic';
	import Sample from '$lib/layout/Sample.svelte';
	import Section from '$lib/layout/Section.svelte';
</script>

<Section label="Basic tree" id="basic" level={2}>
	<Sample title="Generic example" sample={sampleBasic} height={315} />
</Section>
