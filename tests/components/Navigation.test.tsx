import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '@/app/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
    }),
    usePathname: () => '/',
}));

const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {component}
        </ThemeProvider>
    );
};

describe('Navigation Component', () => {
    describe('Rendering', () => {
        it('should render navigation with logo', () => {
            renderWithTheme(<Navigation />);
            const logo = screen.getByRole('link', { name: /cybersecurity/i });
            expect(logo).toBeInTheDocument();
        });

        it('should render main navigation links', () => {
            renderWithTheme(<Navigation />);
            expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
        });

        it('should render action buttons', () => {
            renderWithTheme(<Navigation />);
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    describe('Mobile Menu', () => {
        it('should toggle mobile menu on button click', async () => {
            renderWithTheme(<Navigation />);
            const user = userEvent.setup();

            const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
            expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');

            await user.click(mobileMenuButton);
            expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

            await user.click(mobileMenuButton);
            expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('should close menu on Escape key', async () => {
            renderWithTheme(<Navigation />);
            const user = userEvent.setup();

            const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
            await user.click(mobileMenuButton);
            expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

            await user.keyboard('{Escape}');
            expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels on interactive elements', () => {
            renderWithTheme(<Navigation />);
            const buttons = screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toHaveAttribute('aria-label');
            });
        });

        it('should have semantic nav element', () => {
            const { container } = renderWithTheme(<Navigation />);
            const navElement = container.querySelector('nav');
            expect(navElement).toBeInTheDocument();
        });

        it('should maintain focus visible on keyboard navigation', async () => {
            renderWithTheme(<Navigation />);
            const user = userEvent.setup();

            const firstLink = screen.getByRole('link', { name: /cybersecurity/i });
            await user.tab();
            expect(firstLink).toHaveFocus();
        });
    });

    describe('Theme Toggle', () => {
        it('should render theme toggle button', () => {
            renderWithTheme(<Navigation />);
            const themeButtons = screen.getAllByRole('button');
            const themeButton = themeButtons.find(
                (btn) => btn.getAttribute('aria-label')?.includes('theme') || btn.getAttribute('aria-label')?.includes('Theme')
            );
            expect(themeButton).toBeInTheDocument();
        });
    });

    describe('Touch Targets', () => {
        it('buttons should have minimum touch target size (44px)', () => {
            const { container } = renderWithTheme(<Navigation />);
            const buttons = container.querySelectorAll('button');

            buttons.forEach((button) => {
                // Verify button has touch-target class or sufficient sizing
                expect(button).toHaveClass('touch-target');
            });
        });
    });
});
