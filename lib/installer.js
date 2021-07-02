"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTekton = void 0;
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
if (!tempDirectory) {
    let baseLocation;
    if (process.platform === 'win32') {
        baseLocation = process.env['USERPROFILE'] || 'C:\\';
    }
    else {
        if (process.platform === 'darwin') {
            baseLocation = '/Users';
        }
        else {
            baseLocation = '/home';
        }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
}
async function getTekton(version) {
    let toolPath;
    toolPath = tc.find('tkn', version);
    if (!toolPath) {
        toolPath = await downloadTekton(version);
    }
    //toolPath = path.join(toolPath, 'bin');
    core.debug(`toolPath = ${toolPath}`);
    core.addPath(toolPath);
}
exports.getTekton = getTekton;
async function downloadTekton(version) {
    var os = '';
    var downloadUrl = '';
    var tool = 'tkn';
    if (process.platform === 'win32') {
        os = 'Windows';
        downloadUrl = `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.zip`;
        tool = 'tkn.exe';
    }
    else if (process.platform === 'linux') {
        os = 'Linux';
        downloadUrl = `https://github.com/tektoncd/cli/releases/download/v${version}/tkn_${version}_${os}_x86_64.tar.gz`;
    }
    else {
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
    }
    catch (err) {
        throw err;
    }
}
