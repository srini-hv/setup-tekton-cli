import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    let version = core.getInput('tekton-version');
    core.debug(`VERSION = '${version}'`)
    if (version) {
      await installer.getTekton(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
