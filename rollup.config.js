import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'dist/client.js',
  dest: 'dist/client.js',
  sourceMap: false,
  format: 'iife',
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
