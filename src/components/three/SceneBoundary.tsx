import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  onError: () => void;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** Unmounts a 3D scene if WebGL or the scene code throws; the parent shows its static fallback. */
export default class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[3D] scene failed, showing static fallback', error, info.componentStack);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
