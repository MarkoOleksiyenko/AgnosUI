import type {SliderSlotLabelContext} from '@agnos-ui/angular-bootstrap';
import {SliderComponent} from '@agnos-ui/angular-bootstrap';
import {Component, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
	imports: [SliderComponent, ReactiveFormsModule, FormsModule],
	template: `
		<h2>Slider with custom accessibility labels</h2>
		<span id="labelID">Date range</span>
		<div
			auSlider
			[auAriaValueText]="ariaValueText"
			[auAriaLabelledBy]="ariaLabelledBy"
			[auLabel]="label"
			[auMin]="min"
			[auMax]="max"
			[auStepSize]="stepSize"
			[(auValues)]="sliderValues"
		></div>
	`,
})
export default class AccessibilitySliderComponent {
	readonly sliderValues = signal([1733007600000, 1735599600000]);
	readonly stepSize = 86400000; // 1 day in milliseconds
	readonly min = 1733007600000; // 01-12-2024
	readonly max = 1735599600000; // 31-12-2024

	readonly ariaLabelledBy = () => 'labelID';

	readonly ariaValueText = (value: number, index: number) => {
		const dateString = new Date(value).toLocaleDateString('en-GB', {dateStyle: 'medium', timeZone: 'UTC'});
		if (index == 0) {
			return `Minimum date: ${dateString}`;
		} else {
			return `Maximum date: ${dateString}`;
		}
	};

	readonly label = ({value}: SliderSlotLabelContext) => new Date(value).toLocaleDateString('en-GB', {dateStyle: 'medium', timeZone: 'UTC'});
}
