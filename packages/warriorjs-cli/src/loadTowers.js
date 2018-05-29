import path from 'path';

import findUp from 'find-up';
import globby from 'globby';
import resolve from 'resolve';

import Tower from './Tower';

async function loadTowers() {
  const towerSearchDir = await findUp('node_modules');
  const officialTowerPackageJsonPattern = '@warriorjs/tower-*/package.json';
  const communityTowerPackageJsonPattern = 'warriorjs-tower-*/package.json';
  const towerPackageJsonPaths = await globby(
    [officialTowerPackageJsonPattern, communityTowerPackageJsonPattern],
    { cwd: towerSearchDir },
  );
  const towerPaths = towerPackageJsonPaths.map(path.dirname);
  const towerRequirePaths = towerPaths.map(towerPath =>
    resolve.sync(towerPath, { basedir: towerSearchDir }),
  );
  const towers = towerRequirePaths.map(
    towerRequirePath => require(towerRequirePath), // eslint-disable-line global-require, import/no-dynamic-require
  );
  return towers.map(({ name, levels }) => new Tower(name, levels));
}

export default loadTowers;
