import {BasePO} from '@agnos-ui/base-po';

export class DrawerDemoPO extends BasePO {
	override getComponentSelector(): string {
		return '.container';
	}
}
