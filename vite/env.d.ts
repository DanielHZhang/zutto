/// <reference lib="dom" />

// NOTE: do not use /// <reference types="vite/client" /> due to issues with overriding the *.svg
// module. See: https://github.com/microsoft/TypeScript/issues/36146

declare module '*.svg' {
  import {JSX, JSXElement} from 'solid-js';

  const src: (props: JSX.IntrinsicElements['svg']) => JSXElement;
  export default src;
}
