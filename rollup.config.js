import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'dist/client.js',
  output: {
   file: 'dist/client.js',
   format: 'iife',
  },
  sourcemap: false,
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs({
      include: 'node_modules/rxjs/**'
    }),
    uglify()
  ]
}
