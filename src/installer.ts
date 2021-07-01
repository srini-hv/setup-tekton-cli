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
  toolPath = tc.find('tekton', version);

  if (!toolPath) {
    toolPath = await downloadTekton(version);
  }

  toolPath = path.join(toolPath, 'bin');
  core.debug(`toolPath = ${toolPath}`)
  core.addPath(toolPath);
}

async function downloadTekton(version: string): Promise<string> {
  const toolDirectoryName = `tekton-${version}`
  const os = process.platform
  core.debug(`OS = '${os}'`)
  const downloadUrl =
    `https://github.com/tektoncd/cli/releases/download/v0.19.1/tkn_0.19.1_Linux_x86_64.tar.gz`

    core.debug(`downloading ${downloadUrl}`)

  try {
    const downloadPath = await tc.downloadTool(downloadUrl)
    core.debug(`downloadPath = '${downloadPath}'`)
    const extractedPath = await tc.extractTar(downloadPath)
    core.debug(`extractedPath = '${extractedPath}'`)
    let toolRoot = path.join(extractedPath, toolDirectoryName)
    core.debug(`toolRoot = '${toolRoot}'`)
    return await tc.cacheDir(toolRoot, 'tekton', version)
  } catch (err) {
    throw err
  }
}
