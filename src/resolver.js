// because tleunen/babel-plugin-module-resolver is broken
// and building an import resolver is not a rocket science

import path from 'path';
import _ from 'lodash/fp';

import exists from 'exists';
import isCore from 'core';

import { readSettings, readDependencies, defaultValidExtensions } from 'settings';

const replaceAliases = (source, aliases) => _.reduce((r, v) => {
  const [alias, mod] = v;

  return _.flow(
    _.replace(new RegExp(`^${alias}`), mod),
    _.replace(new RegExp(`${alias}$`), mod),
  )(r);
})(source)(_.entries(aliases));

const lookupRelative = (source, file, validExtensions) => {
  const rel = _.replace(/$.\//, '')(source);
  const curDirMod = path.join(path.dirname(file), rel);
  return exists(curDirMod, validExtensions);
};

const lookupExternals = (source, externals) => !!_.find(e =>
  (_.isString(e) ? _.startsWith(e)(source) : source.match(e)))(externals);

const lookupRoot = (source, roots, validExtensions) => {
  const rootPaths = _.map(r => path.join(root, r, source))(roots);

  return _.flow(
    _.map(p => exists(p, validExtensions)),
    _.compact,
    _.nth(0),
  )(rootPaths);
};

const lookupDeps = (source, deps, validExtensions) => {
  if (_.find(d => _.startsWith(d)(source))(deps)) {
    return exists(path.join(root, 'node_modules', source), validExtensions);
  }

  return false;
};

const resolve = (source, file, options = {}) => {
  if (_.overSome([_.isEmpty, s => !s])(source)) {
    return { found: false };
  }

  if (isCore(source)) {
    return { found: true };
  }

  const { root, validExtensions } = _.flow(
    _.defaults({
      root: process.cwd(),
      extensions: defaultValidExtensions,
    }),
    s => ({
      root: _.get('root')(s),
      validExtensions: _.get('extensions')(s),
    }),
  )(options);

  const settings = readSettings(root, options);
  const aliasedSource = replaceAliases(source, settings.alias);
  const deps = readDependencies(root);

  const filePath = _.takeWhile(lookup => !lookup())([
    lookupRelative(aliasedSource, file, validExtensions),
    lookupExternals(aliasedSource, settings.externals),
    lookupRoot(aliasedSource, settings.root, validExtensions),
    lookupDeps(aliasedSource, deps, validExtensions),
  ]);

  return { found: _.isString(filePath) || filePath === true, path: filePath };
};

export default resolve;
