import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import terser from 'rollup-plugin-terser'

export default {
  input: 'dist/client.js',
  output: {
   file: 'dist/client.js',
   format: 'iife',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs({
      include: 'node_modules/rxjs/**'
    }),
    terser.terser()
  ]
}
