declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside?: (event: MouseEvent) => void;
    }
  }
}

export * from './click-outside';
