import resolve from 'rollup-plugin-node-resolve'

export default {
	input: 'code-flask.js',
	output: [
		{
			format: 'es',
			name: 'codeflask_element',
			file: 'dist/code-flask.module.js',
		},
		{
			format: 'iife',
			name: 'codeflask_element',
			file: 'dist/code-flask.global.js',
		}
	],
	plugins: [ resolve() ],
}
