declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside?: () => void;
    }
  }
}

export * from './click-outside';
