
import _ from 'lodash/fp';

export const coreModules = [
  'assert', 'async_hooks', 'buffer_ieee754',
  'buffer', 'child_process', 'cluster', 'console',
  'constants', 'crypto', '_debugger', 'dgram',
  'dns', 'domain', 'events', 'freelist', 'fs',
  '_http_agent', '_http_client', '_http_common', '_http_incoming',
  '_http_outgoing', '_http_server', 'http', 'http2', 'https',
  'inspector', '_linklist', 'module', 'net',
  'node-inspect/lib/_inspect',
  'node-inspect/lib/internal/inspect_client',
  'node-inspect/lib/internal/inspect_repl',
  'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
  'readline', 'repl', 'smalloc',
  '_stream_duplex', '_stream_transform', '_stream_wrap', '_stream_passthrough', '_stream_readable', '_stream_writable',
  'stream', 'string_decoder',
  'sys', 'timers',
  '_tls_common', '_tls_legacy', '_tls_wrap',
  'tls', 'tty', 'url', 'util',
  'v8/tools/codemap', 'v8/tools/consarray', 'v8/tools/csvparser', 'v8/tools/logreader', 'v8/tools/profile_view', 'v8/tools/splaytree',
  'v8', 'vm', 'zlib',
];

export default function isCore(mod) {
  return _.includes(mod)(coreModules);
}
