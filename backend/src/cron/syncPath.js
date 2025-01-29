/* eslint-disable no-await-in-loop */

import { existsSync, openAsBlob } from 'node:fs';
import { stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import debugLibrary from 'debug';
import md5Library from 'md5';

const debug = debugLibrary('syncPath');

/**
 * Ensure that the db contains all the files in the path
 * @param {InstanceType<import('better-sqlite3')>} db - the sqlite3 database
 * @param {string} path - the full path to sync
 */
export async function syncPath(db, path) {
  const allInstruments = await readdir(path, { withFileTypes: true });
  const instruments = allInstruments
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const pathInDBStmt = db.prepare('SELECT * from files WHERE relativePath = ?');

  for (const status of ['processed', 'errored', 'to_process']) {
    for (const instrument of instruments) {
      debug(`Syncing instrument: ${instrument} With status: ${status}`);
      const fullPath = join(path, instrument, status);
      if (!existsSync(fullPath)) continue;
      const allFiles = await readdir(fullPath, {
        recursive: true,
        withFileTypes: true,
      });
      for (const file of allFiles) {
        file.relativePath = file.parentPath.replace(fullPath, '');
      }
      const files = allFiles.filter((dirent) => dirent.isFile());
      for (const file of files) {
        const relativeName = join(
          instrument,
          status,
          file.relativePath,
          file.name,
        );
        // check if relativePath exists
        const existing = pathInDBStmt.all(relativeName);
        // if existing we just skip
        if (existing.length > 0) {
          continue;
        }
        // if not existing we insert
        const filePath = join(file.parentPath, file.name);
        const fileStat = await stat(filePath);
        const blob = await openAsBlob(filePath);
        const md5 = md5Library(new Uint8Array(await blob.arrayBuffer()));

        // we don't really check if it exists or not, we just insert or update
        db.prepare(
          'INSERT OR REPLACE INTO files (relativePath, md5, size, lastModified, name, status, instrument) VALUES (?, ?, ?, ?, ?,?, ?)',
        ).run(
          relativeName,
          md5,
          fileStat.size,
          Math.round(fileStat.mtimeMs),
          file.name,
          status,
          instrument,
        );
      }
    }
  }
}
