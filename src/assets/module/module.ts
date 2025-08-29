import { Module, ModuleInitParams } from '../../types/Module';

import wasm from './xash.wasm?url'
import libmenu from './libmenu.wasm?url'
import menu_emscripten_javascript from './menu_emscripten_javascript.wasm?url'
import filesystem_stdio from './filesystem_stdio.wasm?url'

import libref_webgl2 from './libref_webgl2.wasm?url'
import libref_soft from './libref_soft.wasm?url'

import client_emscripten_javascript from './client_emscripten_javascript.wasm?url'
import cs_emscripten_wasm32 from './cs_emscripten_javascript.wasm?url'

import yapb_emscripten_javascript from './yapb_emscripten_javascript.wasm?url'

import xash from './xash.js'

import VirtualNetworkWrapper from './vnet';

export const ModuleInstance = ({ ENV, reportDownloadProgress, pushMessage, canvas, onExit, ...rest }: ModuleInitParams) => {
  let module: Module;
  return xash(module = <Module>{
    print: console.log,//msg => pushMessage?.(msg),
    printErr: console.log,//msg => pushMessage?.(msg),
    canvas,
    preInit: [() => {
      Object.assign(module.ENV, ENV)
    }],
    dynamicLibraries: [
      'filesystem_stdio.wasm',
      '/xash/filesystem_stdio.wasm',
      '/cstrike/filesystem_stdio.wasm',
      'cl_dlls/menu_emscripten_wasm32.wasm',

      'libref_webgl2.wasm',
      'libref_soft.wasm',

      'cl_dlls/client_emscripten_wasm32.wasm',
      'dlls/cs_emscripten_wasm32.so',

      'cstrike.wasm'
    ],
    preRun: [
      () => {
        module.addRunDependency('fs-sync')
        module.FS.mkdir(`${ENV.HOME}`);
        module.FS.mount(module.FS.filesystems.IDBFS, { root: '/' }, `${ENV.HOME}`);
        module.FS.syncfs(true, err => {
          if (err) throw err;
          module.removeRunDependency('fs-sync')
        });
      },
      () => {
        module.addRunDependency('net-not-ready')
        VirtualNetworkWrapper(module)
          .then()
          .finally(() => module.removeRunDependency('net-not-ready'))
      }
    ],
    noInitialRun: true,
    onExit,
    locateFile: (path: string) => {
      if (path.endsWith('xash.wasm')) return wasm;
      if (path.endsWith('filesystem_stdio.wasm')) return filesystem_stdio;
      if (path.endsWith('cl_dlls/menu_emscripten_wasm32.wasm')) return menu_emscripten_javascript;

      if (path.endsWith('libref_webgl2.wasm')) return libref_webgl2;
      if (path.endsWith('libref_soft.wasm')) return libref_soft;

      if (path.endsWith('client_emscripten_wasm32.wasm')) return client_emscripten_javascript;
      if (path.endsWith('cs_emscripten_wasm32.so')) return yapb_emscripten_javascript;

      if (path.endsWith('cstrike.wasm')) return cs_emscripten_wasm32;

      throw(`Unknown file[${path}] is requested by xash.js module`);
    },
    setStatus: (status: string | {}) => {
      if (!status) return;
      if (typeof status === 'string') {
        pushMessage(status);
        const dlProgressRE = /(?<progress>\d+)\/(?<total>\d+)/ig;
        if (!dlProgressRE.test(status)) return;
        dlProgressRE.lastIndex = 0;
        const { groups: { progress, total } } = [...status.matchAll(dlProgressRE)][0] as unknown as { groups: { progress: number, total: number } };
        reportDownloadProgress?.(Math.round(progress / total * 100));
      }
    },
    ...rest
  });
}
