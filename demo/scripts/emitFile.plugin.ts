import type {Plugin} from 'vite';
import type {EmittedFile} from 'rollup';

export const emitFile = (emittedFile: EmittedFile): Plugin => {
	return {
		name: 'emit-file',
		apply: 'build',
		async buildStart(info) {
			this.emitFile(emittedFile);
		},
	};
};
