import {transformAsync} from '@babel/core';
import {promises as fs} from 'fs';
import path from 'path';
import type {Plugin} from 'vite';
import {setIgnoredAttributes, svgToSolidComponent} from './parser';

export type Options = {
  /** List of svg attributes to ignore when parsing. (i.e. `['xmlns', 'version']`) */
  ignored?: string[];
};

export default function svgLoader(options: Options = {}): Plugin {
  const svgRegex = /\.svg(\?(raw|url|component))?$/;
  let aliases: Record<string, string> = {};
  if (options.ignored) {
    setIgnoredAttributes(options.ignored);
  }
  return {
    name: 'svg-loader',
    enforce: 'pre',
    configResolved(config) {
      if (config.resolve?.alias) {
        const {alias} = config.resolve;
        if (typeof alias === 'object' && alias.constructor === Object) {
          aliases = Object.assign(aliases, alias);
        } else if (Array.isArray(alias)) {
          alias.forEach(({find, replacement}) => {
            aliases[find.toString()] = replacement;
          });
        }
      }
    },
    resolveId(id) {
      return svgRegex.exec(id) ? id : null;
    },
    async load(id) {
      if (!svgRegex.exec(id)) {
        return;
      }
      let fullPath: string;

      // E.g. node_modules import: iconoir/icons/some-icon.svg
      // E.g. local import: /Users/project/src/components/icons/some-icon.svg
      // E.g. local import: /src/components/some-icon.svg
      let [importPath] = id.split('?', 1);

      if (importPath.startsWith(process.cwd())) {
        fullPath = importPath;
      } else {
        if (importPath.startsWith(path.sep)) {
          importPath = importPath.slice(1);
        }

        const [rootFolder, ...rest] = importPath.split(path.sep);

        if (rootFolder in aliases) {
          importPath = path.join(rootFolder, ...rest);
        } else {
          importPath = path.join('node_modules', rootFolder, ...rest);
        }

        fullPath = path.join(process.cwd(), importPath);
      }

      const file = await fs.readFile(fullPath);
      return file.toString('utf-8');
    },
    async transform(source, id) {
      if (!svgRegex.exec(id)) {
        return;
      }
      const svgComponent = svgToSolidComponent(source);
      const result = await transformAsync(svgComponent, {presets: ['babel-preset-solid']});
      if (!result || !result.code) {
        throw new Error('Fatal: Babel transform failed');
      }
      return {code: result.code, map: null};
    },
  };
}
