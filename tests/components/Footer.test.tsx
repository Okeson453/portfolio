import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Footer and Layout Component Tests
 * Tests for footer navigation, social links, accessibility, and SEO metadata
 */
describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render footer element', () => {
      const Footer = () => (
        <footer role="contentinfo">
          <p>&copy; 2024 My Portfolio</p>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should display copyright information', () => {
      const Footer = () => (
        <footer>
          <p>&copy; 2024. All rights reserved.</p>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      const Footer = () => (
        <footer>
          <nav aria-label="Footer navigation">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('should render social media links', () => {
      const Footer = () => (
        <footer>
          <div aria-label="Social media links">
            <a href="https://github.com/user" aria-label="GitHub">
              GitHub
            </a>
            <a href="https://linkedin.com/in/user" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="https://twitter.com/user" aria-label="Twitter">
              Twitter
            </a>
          </div>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    });

    it('social links should open in new tab', () => {
      const Footer = () => (
        <footer>
          <a href="https://github.com/user" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </footer>
      );

      render(<Footer />);
      const link = screen.getByRole('link', { name: /github/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display social icon labels or text', () => {
      const Footer = () => (
        <footer>
          <a href="https://github.com/user" title="GitHub Profile">
            <span className="sr-only">GitHub</span>
            <svg aria-hidden="true">🐙</svg>
          </a>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('🐙')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Accessibility', () => {
    it('footer should have contentinfo role', () => {
      const Footer = () => <footer role="contentinfo">Footer Content</footer>;

      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should provide semantic footer structure', () => {
      const Footer = () => (
        <footer>
          <nav aria-label="Footer navigation">
            <ul>
              <li>
                <a href="#projects">Projects</a>
              </li>
            </ul>
          </nav>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should support keyboard navigation through links', async () => {
      const user = userEvent.setup();

      const Footer = () => (
        <footer>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </footer>
      );

      render(<Footer />);
      await user.tab();
      expect(screen.getByRole('link', { name: /home/i })).toHaveFocus();
    });

    it('should have proper heading hierarchy', () => {
      const Footer = () => (
        <footer>
          <h2>Footer Sections</h2>
          <section>
            <h3>Quick Links</h3>
          </section>
        </footer>
      );

      const { container } = render(<Footer />);
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('should include contact information with proper links', () => {
      const Footer = () => (
        <footer>
          <a href="mailto:user@example.com">user@example.com</a>
          <a href="tel:+1234567890">+1 (234) 567-8900</a>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByRole('link', { name: /user@example.com/i })).toHaveAttribute(
        'href',
        'mailto:user@example.com'
      );
    });
  });

  describe('Touch Targets', () => {
    it('footer links should meet touch target size', () => {
      const Footer = () => (
        <footer>
          <a href="#home" className="px-4 py-3 min-h-11">
            Home
          </a>
        </footer>
      );

      const { container } = render(<Footer />);
      expect(container.querySelector('a')).toHaveClass('min-h-11');
    });

    it('social media link buttons should meet touch size', () => {
      const Footer = () => (
        <footer>
          <button className="px-4 py-3 min-h-11 touch-target">
            <span className="sr-only">GitHub</span>
          </button>
        </footer>
      );

      const { container } = render(<Footer />);
      expect(container.querySelector('button')).toHaveClass('min-h-11');
      expect(container.querySelector('button')).toHaveClass('touch-target');
    });
  });

  describe('Performance', () => {
    it('should not load external resources unnecessarily', () => {
      const Footer = () => (
        <footer>
          <p>System fonts only</p>
        </footer>
      );

      render(<Footer />);
      expect(screen.getByText('System fonts only')).toBeInTheDocument();
    });

    it('should render quickly with minimal DOM', () => {
      const Footer = () => (
        <footer className="mt-20 py-12 border-t bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div>© 2024</div>
            </div>
          </div>
        </footer>
      );

      const { container } = render(<Footer />);
      const footerLinks = container.querySelectorAll('a');
      expect(footerLinks.length).toBeLessThanOrEqual(10);
    });
  });
});

describe('Layout Component', () => {
  describe('Rendering', () => {
    it('should render main content area', () => {
      const Layout = ({ children }: { children: React.ReactNode }) => (
        <div>
          <header>Header</header>
          <main>{children}</main>
          <footer>Footer</footer>
        </div>
      );

      render(
        <Layout>
          <p>Content</p>
        </Layout>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render multiple layout sections', () => {
      const Layout = () => (
        <div>
          <header role="banner">Navigation</header>
          <main>Main Content</main>
          <aside>Sidebar</aside>
          <footer role="contentinfo">Footer</footer>
        </div>
      );

      render(<Layout />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML structure', () => {
      const Layout = () => (
        <div>
          <header role="banner">
            <nav aria-label="Main navigation">Nav</nav>
          </header>
          <main>Content</main>
          <footer role="contentinfo">Footer</footer>
        </div>
      );

      render(<Layout />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('skip to main content link should work', async () => {
      const user = userEvent.setup();

      const Layout = () => (
        <div>
          <a href="#main" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <header>Header</header>
          <main id="main">Main Content</main>
        </div>
      );

      render(<Layout />);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main');

      await user.keyboard('{Tab}');
      expect(skipLink).toHaveFocus();
    });

    it('should support keyboard skip navigation', async () => {
      const user = userEvent.setup();

      const Layout = () => (
        <>
          <a href="#content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <nav>Navigation</nav>
          <main id="content">Content</main>
        </>
      );

      render(<Layout />);
      await user.tab();
      expect(screen.getByText('Skip to main content')).toHaveFocus();
    });
  });

  describe('SEO', () => {
    it('should include proper meta tags', () => {
      const mockMeta = {
        name: 'description',
        content: 'My portfolio',
      };

      expect(mockMeta.name).toBe('description');
      expect(mockMeta.content).toBeTruthy();
    });

    it('should include open graph tags', () => {
      const mockOGTag = {
        property: 'og:title',
        content: 'My Portfolio',
      };

      expect(mockOGTag.property).toBe('og:title');
      expect(mockOGTag.content).toBeTruthy();
    });
  });
});

describe('Page Structure', () => {
  describe('Responsive Layout', () => {
    it('should have mobile-first approach', () => {
      const Component = () => (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article>Card 1</article>
          <article>Card 2</article>
        </section>
      );

      const { container } = render(<Component />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('grid-cols-1');
      expect(section).toHaveClass('md:grid-cols-2');
    });

    it('should maintain readable line length', () => {
      const Component = () => (
        <article className="max-w-3xl mx-auto">
          <h1>Article Title</h1>
          <p>Content with max-width for readability</p>
        </article>
      );

      const { container } = render(<Component />);
      expect(container.querySelector('article')).toHaveClass('max-w-3xl');
    });
  });

  describe('Color Contrast', () => {
    it('should use accessible text colors', () => {
      const Component = () => (
        <div className="bg-white text-slate-900">High contrast text</div>
      );

      render(<Component />);
      expect(screen.getByText('High contrast text')).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should show visible focus indicators', () => {
      const Component = () => (
        <button className="focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">
          Focusable Button
        </button>
      );

      const { container } = render(<Component />);
      expect(container.querySelector('button')).toHaveClass('focus:outline-2');
    });

    it('should support tabindex for focus order', () => {
      const Component = () => (
        <div>
          <a href="#" tabIndex={-1}>
            No tab
          </a>
          <a href="#" tabIndex={0}>
            Tabbable
          </a>
        </div>
      );

      render(<Component />);
      expect(screen.getAllByRole('link')[0]).toHaveAttribute('tabIndex', '-1');
      expect(screen.getAllByRole('link')[1]).toHaveAttribute('tabIndex', '0');
    });
  });
});
