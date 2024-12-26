<script lang="ts">
	import {Slider} from '@agnos-ui/svelte-bootstrap/components/slider';

	let sliderValues = $state([1733007600000, 1735599600000]);
	const stepSize = 86400000; // 1 day in milliseconds
	const min = 1733007600000; // 01-12-2024
	const max = 1735599600000; // 31-12-2024

	const ariaLabelledBy = () => 'labelID';
	const ariaValueText = (value: number, index: number) => {
		const dateString = new Date(value).toLocaleDateString('en-GB', {dateStyle: 'medium', timeZone: 'UTC'});
		if (index == 0) {
			return `Minimum date: ${dateString}`;
		} else {
			return `Maximum date: ${dateString}`;
		}
	};
</script>

<h2>Slider with custom accessibility labels</h2>
<span id="labelID">Date range</span>
<Slider {min} {max} {stepSize} {ariaLabelledBy} {ariaValueText} bind:values={sliderValues}>
	{#snippet label({value})}
		{new Date(value).toLocaleDateString('en-GB', {dateStyle: 'medium', timeZone: 'UTC'})}
	{/snippet}
</Slider>
