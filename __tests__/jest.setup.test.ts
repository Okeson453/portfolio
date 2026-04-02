import { render, screen } from '@testing-library/react';

// Simple test component for verification
const TestComponent = () => <div>Jest is working!</div>;

describe('Jest Setup Verification', () => {
  it('should render a simple component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Jest is working!')).toBeInTheDocument();
  });

  it('should verify basic matchers work', () => {
    expect(true).toBe(true);
    expect([1, 2, 3]).toHaveLength(3);
    expect({ name: 'test' }).toHaveProperty('name');
  });
});
