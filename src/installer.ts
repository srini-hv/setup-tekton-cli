// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

if (!tempDirectory) {
  let baseLocation: string;
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getTekton(version: string) {
  let toolPath: string;
  toolPath = tc.find('tkn', version);

  if (!toolPath) {
    toolPath = await downloadTekton(version);
  }

  //toolPath = path.join(toolPath, 'bin');
  core.debug(`toolPath = ${toolPath}`);
  core.addPath(toolPath);
}

async function downloadTekton(version: string): Promise<string> {
  var os = '';
  var downloadUrl = '';
  var tool = 'tkn';
  if (process.platform === 'win32') {
    os = 'Windows';
    downloadUrl = `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.zip`;
    tool = 'tkn.exe';
  } else if (process.platform === 'linux') {
    os = 'Linux';
    downloadUrl = `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.tar.gz`;
  } else {
    os = 'Darwin';
    downloadUrl = `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.tar.gz`;
  }
  //const os = process.platform
  core.debug(`OS = '${os}'`);
  // const downloadUrl =
  //   `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.tar.gz`

  core.debug(`downloading ${downloadUrl}`);

  try {
    const downloadPath = await tc.downloadTool(downloadUrl);
    core.debug(`downloadPath = '${downloadPath}'`);
    const extractedPath = await tc.extractTar(downloadPath);
    core.debug(`extractedPath = '${extractedPath}'`);
    let toolRoot = path.join(extractedPath, tool);
    core.debug(`toolRoot = '${toolRoot}'`);
    return await tc.cacheFile(toolRoot, tool, 'tkn', version);
  } catch (err) {
    throw err;
  }
}
