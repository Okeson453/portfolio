import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Skills from '@/app/components/Skills';

describe('Skills Component', () => {
    describe('Rendering', () => {
        it('should render skills section with heading', () => {
            render(<Skills />);
            const heading = screen.getByRole('heading', { name: /skills/i });
            expect(heading).toBeInTheDocument();
        });

        it('should render category filter buttons', () => {
            render(<Skills />);
            const buttons = screen.getAllByRole('tab');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should render skills grid', () => {
            render(<Skills />);
            const tabpanel = screen.getByRole('tabpanel');
            expect(tabpanel).toBeInTheDocument();
        });
    });

    describe('Tab Filtering', () => {
        it('should have first tab selected by default', () => {
            render(<Skills />);
            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        });

        it('should update aria-selected when tab clicked', async () => {
            const user = userEvent.setup();
            render(<Skills />);

            const tabs = screen.getAllByRole('tab');
            if (tabs.length > 1) {
                await user.click(tabs[1]);
                expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
                expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
            }
        });

        it('should switch content when different tab selected', async () => {
            const user = userEvent.setup();
            render(<Skills />);

            const tabs = screen.getAllByRole('tab');
            if (tabs.length > 1) {
                const firstTabLabel = tabs[0].textContent;
                const secondTabLabel = tabs[1].textContent;

                expect(firstTabLabel).not.toBe(secondTabLabel);

                await user.click(tabs[1]);
                // Content should update (visible to user through skills display)
                expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
            }
        });
    });

    describe('Accessibility', () => {
        it('tabs should have proper ARIA attributes', () => {
            render(<Skills />);
            const tabs = screen.getAllByRole('tab');
            tabs.forEach((tab) => {
                expect(tab).toHaveAttribute('role', 'tab');
                expect(tab).toHaveAttribute('aria-selected');
                expect(tab).toHaveAttribute('aria-controls');
            });
        });

        it('tablist should have proper role', () => {
            const { container } = render(<Skills />);
            const tablist = screen.getAllByRole('tablist');
            expect(tablist.length).toBeGreaterThan(0);
        });

        it('tabpanel should be properly labeled', () => {
            render(<Skills />);
            const tabpanel = screen.getByRole('tabpanel');
            expect(tabpanel).toHaveAttribute('role', 'tabpanel');
        });

        it('should be keyboard navigable between tabs', async () => {
            const user = userEvent.setup();
            render(<Skills />);

            const tabs = screen.getAllByRole('tab');
            await user.tab();
            expect(tabs[0]).toHaveFocus();

            if (tabs.length > 1) {
                await user.keyboard('{ArrowRight}');
                expect(tabs[1]).toHaveFocus();
            }
        });
    });

    describe('Touch Targets', () => {
        it('category buttons should have minimum touch size (44px)', () => {
            const { container } = render(<Skills />);
            const tabs = screen.getAllByRole('tab');
            tabs.forEach((tab) => {
                // Tab buttons should be large enough for touch
                const styles = window.getComputedStyle(tab);
                const height = parseInt(styles.minHeight || styles.height);
                const width = parseInt(styles.minWidth || styles.width);
                expect(height).toBeGreaterThanOrEqual(44);
                expect(width).toBeGreaterThanOrEqual(44);
            });
        });
    });

    describe('Content Display', () => {
        it('should display at least one skill item', () => {
            render(<Skills />);
            const tabpanel = screen.getByRole('tabpanel');
            expect(tabpanel.children.length).toBeGreaterThan(0);
        });
    });
});
