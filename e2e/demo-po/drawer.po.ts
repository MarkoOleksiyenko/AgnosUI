import {BasePO} from '@agnos-ui/base-po';
import type {Locator} from '@playwright/test';

export class DrawerDemoPO extends BasePO {
	private readonly locators = {
		toggleDrawerButton: 'button[id=toggleDrawer]',
		positionSelect: 'select[id=drawerPlacement]',
		toastContainer: 'div.toast-container',
	};

	override getComponentSelector(): string {
		return '.container';
	}

	get locatorToggleDrawerButton(): Locator {
		return this.locatorRoot.locator(this.locators.toggleDrawerButton);
	}

	get locatorPositionSelect(): Locator {
		return this.locatorRoot.locator(this.locators.positionSelect);
	}
}
