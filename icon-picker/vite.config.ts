// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {astryxStylex, LIGHTNINGCSS_TARGETS} from '@astryxdesign/build/vite';

export default defineConfig({
  // The sandbox preview proxies the dev server through a generated host, so
  // accept any Host header here; production is unaffected.
  server: {
    allowedHosts: true,
  },
  plugins: [
    ...astryxStylex({
      // Compile StyleX statically, matching the production build, and disable
      // last-wins media-query ordering: StyleX 0.19.1's normalizer crashes
      // nondeterministically ("Invalid media query syntax") while parsing
      // valid queries under concurrent dev transforms. Astryx styles declare
      // at most one media query per property, so ordering is not observable.
      dev: false,
      // Reached the StyleX babel plugin through stylexOverrides (the
      // documented escape hatch) — top-level keys other than the ones
      // astryxStylex destructures are ignored.
      stylexOverrides: {
        enableMediaQueryOrder: false,
      },
      // Required so lightningcss preserves native light-dark() tokens
      // instead of lowering them into broken polyfill variables.
      lightningcssTargets: LIGHTNINGCSS_TARGETS,
    }),
    react(),
  ],
});
