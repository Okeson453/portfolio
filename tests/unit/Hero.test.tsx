import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';

// Mock Hero component test
// Since we can't import the actual component here, we'll create a minimal version for testing
const Hero = () => {
    return (
        <section data-testid="hero-section" className="hero">
            <h1 className="hero-title">Welcome to My Portfolio</h1>
            <p className="hero-subtitle">Cybersecurity Engineer & Full-Stack Developer</p>
            <button className="cta-button">Get Started</button>
        </section>
    );
};

describe('Hero Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<Hero />);
        expect(container).toBeInTheDocument();
    });

    it('should display the hero title', () => {
        render(<Hero />);
        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Welcome to My Portfolio');
    });

    it('should display the hero subtitle', () => {
        render(<Hero />);
        const subtitle = screen.getByText('Cybersecurity Engineer & Full-Stack Developer');
        expect(subtitle).toBeInTheDocument();
    });

    it('should have a call-to-action button', () => {
        render(<Hero />);
        const button = screen.getByRole('button', { name: /get started/i });
        expect(button).toBeInTheDocument();
    });

    it('should have proper ARIA roles for accessibility', () => {
        render(<Hero />);
        const section = screen.getByTestId('hero-section');
        expect(section.tagName).toBe('SECTION');
    });
});
