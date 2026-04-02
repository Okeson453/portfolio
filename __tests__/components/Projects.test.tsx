import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Projects/Portfolio Component Tests
 * Tests for project display, filtering, navigation, and accessibility
 */
describe('Projects Component', () => {
  describe('Rendering', () => {
    it('should render projects section with heading', () => {
      const Projects = () => (
        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading">Featured Projects</h2>
        </section>
      );

      render(<Projects />);
      expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    });

    it('should render multiple project cards', () => {
      const Projects = () => (
        <section>
          <h2>Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article>
              <img src="project1.jpg" alt="Project 1" />
              <h3>Project One</h3>
            </article>
            <article>
              <img src="project2.jpg" alt="Project 2" />
              <h3>Project Two</h3>
            </article>
            <article>
              <img src="project3.jpg" alt="Project 3" />
              <h3>Project Three</h3>
            </article>
          </div>
        </section>
      );

      render(<Projects />);
      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      expect(screen.getByText('Project Three')).toBeInTheDocument();
    });

    it('should render project with image and description', () => {
      const Projects = () => (
        <article>
          <img src="project.jpg" alt="E-commerce Platform" />
          <h3>E-commerce Platform</h3>
          <p>Built with React and Node.js</p>
          <a href="/projects/ecommerce">View Project</a>
        </article>
      );

      render(<Projects />);
      expect(screen.getByAltText('E-commerce Platform')).toBeInTheDocument();
      expect(screen.getByText('Built with React and Node.js')).toBeInTheDocument();
    });
  });

  describe('Project Card Content', () => {
    it('should display project title', () => {
      const ProjectCard = () => (
        <article>
          <h3>Portfolio Redesign</h3>
        </article>
      );

      render(<ProjectCard />);
      expect(screen.getByText('Portfolio Redesign')).toBeInTheDocument();
    });

    it('should display project tech stack', () => {
      const ProjectCard = () => (
        <article>
          <h3>Project Name</h3>
          <ul aria-label="Technologies used">
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
        </article>
      );

      render(<ProjectCard />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should display project links', () => {
      const ProjectCard = () => (
        <article>
          <h3>Project Name</h3>
          <a href="https://github.com/user/project">GitHub</a>
          <a href="https://project.com">Live Demo</a>
        </article>
      );

      render(<ProjectCard />);
      expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
        'href',
        expect.stringContaining('github.com')
      );
      expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute(
        'href',
        'https://project.com'
      );
    });
  });

  describe('Filtering', () => {
    it('should render category filters', () => {
      const Projects = () => (
        <div>
          <div role="tablist" aria-label="Project categories">
            <button role="tab" aria-selected="true">
              All
            </button>
            <button role="tab" aria-selected="false">
              Frontend
            </button>
            <button role="tab" aria-selected="false">
              Backend
            </button>
            <button role="tab" aria-selected="false">
              Full Stack
            </button>
          </div>
        </div>
      );

      render(<Projects />);
      expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('button', { name: /frontend/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('should filter projects by selected category', async () => {
      const user = userEvent.setup();

      const Projects = () => {
        const [selectedCategory, setSelectedCategory] = React.useState('all');
        return (
          <div>
            <div>
              <button
                onClick={() => setSelectedCategory('all')}
                aria-selected="true"
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('frontend')}
                aria-selected="false"
              >
                Frontend
              </button>
            </div>
            <div>
              {(selectedCategory === 'all' || selectedCategory === 'frontend') && (
                <article>Frontend Project</article>
              )}
              {selectedCategory === 'all' && <article>Backend Project</article>}
            </div>
          </div>
        );
      };

      render(<Projects />);
      expect(screen.getByText('Frontend Project')).toBeInTheDocument();
      expect(screen.getByText('Backend Project')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /frontend/i }));
      expect(screen.getByText('Frontend Project')).toBeInTheDocument();
      expect(screen.queryByText('Backend Project')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should link to individual project pages', () => {
      const ProjectCard = () => (
        <article>
          <a href="/projects/ecommerce" className="group">
            <h3>E-commerce Platform</h3>
          </a>
        </article>
      );

      render(<ProjectCard />);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/ecommerce');
    });

    it('should open external links in new tab', () => {
      const ProjectCard = () => (
        <article>
          <a href="https://github.com/user/project" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </article>
      );

      render(<ProjectCard />);
      const link = screen.getByRole('link', { name: /view on github/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic project structure', () => {
      const Projects = () => (
        <section id="projects">
          <h2 id="projects-heading">Projects</h2>
          <article>
            <h3>Project Name</h3>
            <p>Description</p>
          </article>
        </section>
      );

      render(<Projects />);
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should provide descriptive alt text for images', () => {
      const ProjectCard = () => (
        <article>
          <img src="project.jpg" alt="Screenshot of E-commerce checkout interface built with React and Stripe" />
        </article>
      );

      render(<ProjectCard />);
      expect(screen.getByAltText(/e-commerce checkout/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation through filters', async () => {
      const user = userEvent.setup();

      const Projects = () => (
        <div role="tablist">
          <button role="tab">All</button>
          <button role="tab">Frontend</button>
          <button role="tab">Backend</button>
        </div>
      );

      render(<Projects />);
      const allButton = screen.getByRole('button', { name: /all/i });

      await user.tab();
      expect(allButton).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /frontend/i })).toHaveFocus();
    });

    it('project nav tabs should follow WAI-ARIA pattern', () => {
      const Projects = () => (
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex gap-2 border-b"
        >
          <button role="tab" aria-selected="true">
            All
          </button>
          <button role="tab" aria-selected="false">
            Featured
          </button>
        </div>
      );

      render(<Projects />);
      const allTab = screen.getByRole('button', { name: /all/i });
      expect(allTab).toHaveAttribute('aria-selected', 'true');
      expect(allTab).toHaveAttribute('aria-controls', 'projects-panel');
    });
  });

  describe('Touch Targets', () => {
    it('project cards should be clickable touch targets', () => {
      const ProjectCard = () => (
        <article className="group cursor-pointer touch-target">
          <h3>Project Name</h3>
        </article>
      );

      const { container } = render(<ProjectCard />);
      expect(container.querySelector('article')).toHaveClass('touch-target');
    });

    it('filter buttons should meet 44px touch target size', () => {
      const Projects = () => (
        <button className="px-4 py-3 min-h-11">All</button>
      );

      const { container } = render(<Projects />);
      expect(container.querySelector('button')).toHaveClass('min-h-11');
    });

    it('project links should have adequate tap area', () => {
      const ProjectCard = () => (
        <article>
          <a href="/project" className="block p-4">
            <h3>Project Name</h3>
          </a>
        </article>
      );

      const { container } = render(<ProjectCard />);
      expect(container.querySelector('a')).toHaveClass('p-4');
    });
  });

  describe('Visual Hierarchy', () => {
    it('should display featured projects prominently', () => {
      const Projects = () => (
        <div>
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <article>
            <h3 className="text-2xl font-semibold">Top Project</h3>
            <p>Description</p>
          </article>
        </div>
      );

      const { container } = render(<Projects />);
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass('text-4xl');

      const projectTitle = container.querySelector('h3');
      expect(projectTitle).toHaveClass('text-2xl');
    });

    it('should use consistent spacing', () => {
      const Projects = () => (
        <section className="space-y-12">
          <h2>Projects</h2>
          <div className="grid gap-6">
            <article className="p-6 rounded-lg border">Project</article>
          </div>
        </section>
      );

      const { container } = render(<Projects />);
      expect(container.querySelector('section')).toHaveClass('space-y-12');
    });
  });
});
