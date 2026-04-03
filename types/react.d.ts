declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
  }
}

declare namespace React {
  // Types
  type ReactNode = any;
  type ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>> = any;
  type ComponentType<P = any> = React.ComponentClass<P> | React.FunctionComponent<P>;
  type JSXElementConstructor<P> = ((props: P) => React.ReactElement<any, any> | null) | (new (props: P) => React.Component<any, any>);
  type Component<P = any, S = any> = ComponentClass<P, S> | FunctionComponent<P>;
  
  // Class component
  class Component<P = {}, S = {}, SS = any> {
    props: P & { children?: ReactNode };
    state: S;
    context: any;
    refs: any;
    constructor(props: P, context?: any);
    setState<K extends keyof S>(state: S[K] | Pick<S, K>, callback?: () => void): void;
    render(): ReactElement<any, any> | null;
  }
  
  class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}
  
  class ComponentClass<P = {}, S = any> {
    new (props: P, context?: any): Component<P, S>;
  }
  
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any> | null;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  
  interface Attributes {
    key?: string | number | null;
    ref?: any;
  }
  
  // Event types
  interface SyntheticEvent<T = Element, E = Event> {
    currentTarget: EventTarget & T;
    nativeEvent: E;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
    target: EventTarget & T;
  }
  
  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  interface FocusEvent<T = Element> extends SyntheticEvent<T, globalThis.FocusEvent> {
    target: EventTarget & T;
  }
  
  interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  interface DragEvent<T = Element> extends SyntheticEvent<T, globalThis.DragEvent> {
    dataTransfer: DataTransfer;
  }
  interface PointerEvent<T = Element> extends SyntheticEvent<T, globalThis.PointerEvent> {
    pointerId: number;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    width: number;
    height: number;
    isPrimary: boolean;
  }
  interface TouchEvent<T = Element> extends SyntheticEvent<T, globalThis.TouchEvent> {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
  }
  interface UIEvent<T = Element> extends SyntheticEvent<T, globalThis.UIEvent> {
    detail: number;
    view: AbstractView;
  }
  interface WheelEvent<T = Element> extends SyntheticEvent<T, globalThis.WheelEvent> {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
  }
  interface AnimationEvent<T = Element> extends SyntheticEvent<T, globalThis.AnimationEvent> {
    animationName: string;
    elapsedTime: number;
    pseudoElement: string;
  }
  interface TransitionEvent<T = Element> extends SyntheticEvent<T, globalThis.TransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
  }
  
  // Hooks
  function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  function useState<T = undefined>(): [T | undefined, (value: T | ((prev: T | undefined) => T | undefined)) => void];
  function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useContext<T>(context: React.Context<T>): T;
  function useRef<T>(initialValue?: T): MutableRefObject<T>;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  function useMemo<T>(factory: () => T, deps: any[]): T;
  function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: any[]): void;
  function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useDebugValue<T>(value: T, format?: (value: T) => any): void;
  function useId(): string;
  function useActionState<S, P>(action: (state: S, payload: P) => S | Promise<S>, initialState: S): [S, (payload: P) => void, boolean];
  function useTransition(): [boolean, (callback: () => void | Promise<void>) => void];
  function useDeferredValue<T>(value: T): T;
  function useSyncExternalStore<Snapshot>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => Snapshot, getServerSnapshot?: () => Snapshot): Snapshot;
  function lazy<P extends object>(load: () => Promise<{ default: ComponentType<P> }>): React.FunctionComponent<P>;
  
  // Refs
  interface MutableRefObject<T> {
    current: T;
  }
  
  interface RefObject<T> {
    readonly current: T | null;
  }
  
  type Ref<T> = RefObject<T> | ((instance: T | null) => void) | null;
  
  // Context
  interface Context<T> {
    Provider: ComponentType<{ value: T }>;
    Consumer: ComponentType<{ children: (value: T) => ReactNode }>;
    displayName?: string;
  }
  
  function createContext<T>(defaultValue?: T): Context<T>;
  
  // Fragment
  interface Fragment {}
  namespace Fragment {
    interface Props {
      children?: ReactNode;
      key?: any;
    }
  }
  const Fragment: component<Fragment.Props>;
  
  // Other utilities
  function forwardRef<T, P = {}>(render: (props: P, ref?: Ref<T>) => ReactElement): ComponentType<P>;
  function memo<P extends object>(Component: ComponentType<P>, propsAreEqual?: (prevProps: P, nextProps: P) => boolean): ComponentType<P>;
  function cloneElement<P, T>(element: ReactElement<P, T>, props?: any, ...children: ReactNode[]): ReactElement<P, T>;
  function isValidElement<P = any>(object: any): boolean;
  function Suspense(props: { children: ReactNode; fallback?: ReactNode }): ReactElement;
  
  // AbstractView
  interface AbstractView {
    styleMedia: StyleMedia;
    document: Document;
  }
}

declare module 'react' {
  export = React;
}
