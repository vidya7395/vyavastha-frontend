import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  // Catch errors in any child components
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  // This lifecycle method will get called if an error is caught
  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here
    console.error('Error caught in Error Boundary:', error, info);
  }

  render() {
    // Check if an error has occurred, and show fallback UI
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24'
          }}
        >
          <h2>Something went wrong.</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    // If no error, render the child components
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
