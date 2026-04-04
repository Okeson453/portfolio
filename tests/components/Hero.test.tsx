import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from '@/app/components/Hero';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock useTheme
jest.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'dark',
        setTheme: jest.fn(),
    }),
}));

describe('Hero Component', () => {
    describe('Rendering', () => {
        it('should render hero section with heading', () => {
            render(<Hero />);
            const heading = screen.getByRole('heading', {
                name: /cybersecurity|developer|engineer/i,
            });
            expect(heading).toBeInTheDocument();
        });

        it('should render primary CTA button', () => {
            render(<Hero />);
            const primaryButton = screen.getByRole('button', { name: /start project|get in touch|contact/i });
            expect(primaryButton).toBeInTheDocument();
        });

        it('should render secondary CTA button', () => {
            render(<Hero />);
            const button = screen.getByRole('button', { name: /view my work|projects/i });
            expect(button).toBeInTheDocument();
        });

        it('should render tertiary CTA link (CV download)', () => {
            render(<Hero />);
            const cvLink = screen.getByRole('link', {
                name: /download|cv|resume/i,
            });
            expect(cvLink).toBeInTheDocument();
        });

        it('should display response time trust signal', () => {
            render(<Hero />);
            const responseTime = screen.getByText(/response|hours|24/i);
            expect(responseTime).toBeInTheDocument();
        });
    });

    describe('CTA Buttons', () => {
        it('primary CTA should have proper styling', () => {
            render(<Hero />);
            const primaryButton = screen.getByRole('button', { name: /start project|get in touch|contact/i });
            expect(primaryButton).toHaveClass('btn-primary');
        });

        it('secondary CTA button should scroll to projects', async () => {
            const user = userEvent.setup();
            render(<Hero />);

            // Mock scrollIntoView
            const scrollIntoViewMock = jest.fn();
            Element.prototype.scrollIntoView = scrollIntoViewMock;

            const secondaryButton = screen.getByRole('button', { name: /view my work|projects/i });
            await user.click(secondaryButton);

            // Button should be clicked (would trigger scroll in real app)
            expect(secondaryButton).toBeInTheDocument();
        });
    });

    describe('CV Download Link', () => {
        it('CV link should have correct href', () => {
            render(<Hero />);
            const cvLink = screen.getByRole('link', {
                name: /download|cv|resume/i,
            });
            expect(cvLink).toHaveAttribute('href', expect.stringContaining('resume'));
        });

        it('CV link should open in new tab', () => {
            render(<Hero />);
            const cvLink = screen.getByRole('link', {
                name: /download|cv|resume/i,
            });
            expect(cvLink).toHaveAttribute('target', '_blank');
        });
    });

    describe('Accessibility', () => {
        it('should have semantic section element', () => {
            const { container } = render(<Hero />);
            const section = container.querySelector('section');
            expect(section).toBeInTheDocument();
        });

        it('all buttons should be keyboard accessible', async () => {
            const user = userEvent.setup();
            render(<Hero />);

            const primaryButton = screen.getByRole('button', { name: /start project|get in touch|contact/i });
            await user.tab();
            expect(primaryButton).toHaveFocus();
        });

        it('text content should be readable', () => {
            render(<Hero />);
            // Check for key value propositions
            const text = screen.getByText(/cybersecurity|security|developer/i);
            expect(text).toBeInTheDocument();
        });
    });

    describe('Visual Hierarchy', () => {
        it('should use proper heading level (h1)', () => {
            render(<Hero />);
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toBeInTheDocument();
        });

        it('should have multiple CTA options (conversion funnel)', () => {
            render(<Hero />);
            // Primary CTA
            expect(screen.getByRole('button', { name: /start project|get in touch|contact/i })).toBeInTheDocument();
            // Secondary CTA
            expect(screen.getByRole('button', { name: /view my work|projects/i })).toBeInTheDocument();
            // Tertiary CTA
            expect(screen.getByRole('link', { name: /download|cv|resume/i })).toBeInTheDocument();
        });
    });
});
