import { Component } from 'react';

// Keeps a crash in one part of the page from blanking the whole site. Decorative widgets pass no fallback and simply disappear;
// the page itself passes a fallback that points visitors to the phone number.
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error(error); }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children; }
}
