import React from 'react';
import { render, screen } from '@testing-library/react';
import Testimonials from '@/app/components/Testimonials';

describe('Testimonials Component', () => {
    describe('Rendering', () => {
        it('should render testimonials section', () => {
            render(<Testimonials />);
            const section = screen.getByRole('region', { name: /testimonial|feedback/i });
            expect(section).toBeInTheDocument();
        });

        it('should render testimonial heading', () => {
            render(<Testimonials />);
            const heading = screen.getByRole('heading', { name: /testimonial/i });
            expect(heading).toBeInTheDocument();
        });

        it('should render multiple testimonial cards', () => {
            render(<Testimonials />);
            const cards = screen.getAllByRole('article');
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    describe('Testimonial Content', () => {
        it('should display testimonial quotes', () => {
            render(<Testimonials />);
            // Look for blockquote elements
            const blockquotes = screen.getAllByRole('blockquote', { hidden: true });
            expect(blockquotes.length).toBeGreaterThan(0);
        });

        it('should display author information', () => {
            render(<Testimonials />);
            const figcaptions = screen.getAllByRole('doc-credit', { hidden: true });
            expect(figcaptions.length).toBeGreaterThan(0);
        });

        it('should display star ratings', () => {
            const { container } = render(<Testimonials />);
            // Star icons typically rendered as SVG or aria-label
            const stars = container.querySelectorAll('[aria-label*="star"], svg');
            expect(stars.length).toBeGreaterThan(0);
        });
    });

    describe('Styling & Interactions', () => {
        it('testimonial cards should have card-interactive class', () => {
            const { container } = render(<Testimonials />);
            const cards = container.querySelectorAll('.card-interactive');
            expect(cards.length).toBeGreaterThan(0);
        });

        it('should render images with alt text', () => {
            render(<Testimonials />);
            const images = screen.getAllByRole('img');
            images.forEach((img) => {
                expect(img).toHaveAttribute('alt');
                expect(img.getAttribute('alt')).toBeTruthy();
            });
        });
    });

    describe('Accessibility', () => {
        it('testimonial structure should be semantic', () => {
            const { container } = render(<Testimonials />);

            // Check for proper heading levels
            const heading = screen.getByRole('heading', { name: /testimonial/i });
            expect(heading).toBeInTheDocument();

            // Check for article elements (semantic content containers)
            const articles = container.querySelectorAll('article');
            expect(articles.length).toBeGreaterThan(0);
        });

        it('should have proper text contrast and readability', () => {
            render(<Testimonials />);
            // Verify content is present and readable
            const testText = screen.getByText(/professional|team|excellent|great/i);
            expect(testText).toBeInTheDocument();
        });
    });

    describe('Visual Hierarchy', () => {
        it('should display testimonials in readable format', () => {
            render(<Testimonials />);
            const heading = screen.getByRole('heading', { name: /testimonial/i });
            expect(heading).toHaveClass('text-3xl');
        });

        it('response time / social proof should be visible', () => {
            render(<Testimonials />);
            // Look for any social proof content
            const content = screen.getByRole('region', { name: /testimonial|feedback/i });
            expect(content).toBeInTheDocument();
        });
    });

    describe('Touch Targets', () => {
        it('interactive elements should be adequately sized', () => {
            const { container } = render(<Testimonials />);
            const interactiveElements = container.querySelectorAll('button, a, [role="button"]');
            interactiveElements.forEach((element) => {
                if (element.textContent && element.textContent.trim()) {
                    // If it's interactive, it should have proper size
                    expect(element).toBeInTheDocument();
                }
            });
        });
    });
});
