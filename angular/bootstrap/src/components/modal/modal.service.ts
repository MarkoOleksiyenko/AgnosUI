import type {OutputRefSubscription} from '@angular/core';
import {ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable, Injector, OutputEmitterRef} from '@angular/core';
import {ModalComponent} from './modal.component';
import type {ModalProps} from './modal.gen';

/**
 * Service to handle the opening and management of modal components.
 */
@Injectable({providedIn: 'root'})
export class ModalService {
	private readonly _injector = inject(Injector);
	private readonly _applicationRef = inject(ApplicationRef);

	/**
	 * Opens a modal dialog with the specified options.
	 *
	 * @template Data - The type of data that the modal will handle.
	 * @param options - The options to configure the modal.
	 * @param injector - The injector to use when creating the modal component
	 * @returns A promise that resolves when the modal is closed.
	 */
	async open<Data>(options: Partial<ModalProps<Data>>, injector = this._injector): Promise<any> {
		const component = createComponent(ModalComponent, {
			environmentInjector: injector.get(EnvironmentInjector),
			elementInjector: injector,
		});
		const subscriptions: OutputRefSubscription[] = [];
		try {
			for (const [prop, value] of Object.entries(options)) {
				if (prop.startsWith('on')) {
					const eventName = `${prop[2].toLowerCase()}${prop.substring(3)}`;
					const eventEmitter = (component.instance as any)[eventName];
					if (eventEmitter instanceof OutputEmitterRef) {
						subscriptions.push(eventEmitter.subscribe(value as any));
					}
				} else {
					component.setInput(`au${prop.substring(0, 1).toUpperCase()}${prop.substring(1)}`, value);
				}
			}
			this._applicationRef.attachView(component.hostView);
			await component.instance['_widget'].initialized;
			return await component.instance.api.open();
		} finally {
			component.destroy();
			for (const subscription of subscriptions) {
				subscription.unsubscribe();
			}
		}
	}
}
