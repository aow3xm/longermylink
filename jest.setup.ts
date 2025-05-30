import '@testing-library/jest-dom';

// Chuyển hướng console.error thành một hàm mock để tránh các cảnh báo không cần thiết trong quá trình test
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Bỏ qua các cảnh báo có liên quan đến React hoặc cảnh báo không cần thiết
  if (
    typeof args[0] === 'string' && 
    (
      args[0].includes('Warning: ReactDOM.render') || 
      args[0].includes('Warning: React.createElement:') ||
      args[0].includes('Warning: An update to') ||
      args[0].includes('act(...)')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock cho localStorage và sessionStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock cho window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
  writable: true,
});

// Mock cho window.scrollTo
window.scrollTo = jest.fn();

// Mock cho IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

// Add requestSubmit polyfill since jsdom doesn't support it
if (!HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function(submitter) {
    if (submitter) {
      submitter.click();
    } else {
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      this.appendChild(submitButton);
      submitButton.click();
      this.removeChild(submitButton);
    }
  };
}
