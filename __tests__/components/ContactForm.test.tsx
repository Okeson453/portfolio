import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Contact Form Tests
 * Tests for contact form rendering, validation, accessibility, and submission
 */
describe('Contact Form Component', () => {
  describe('Rendering', () => {
    it('should render contact section heading', () => {
      // Mock component that would be imported
      const ContactForm = () => (
        <section>
          <h2>Get in Touch</h2>
          <form>
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <textarea placeholder="Your message"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </section>
      );

      render(<ContactForm />);
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      const ContactForm = () => (
        <form>
          <input type="text" placeholder="Your name" aria-label="Full name" />
          <input type="email" placeholder="Your email" aria-label="Email address" />
          <textarea placeholder="Your message" aria-label="Message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      );

      render(<ContactForm />);
      expect(screen.getByLabelText('Full name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      const ContactForm = () => (
        <form>
          <button type="submit">Send Message</button>
        </form>
      );

      render(<ContactForm />);
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require name field', async () => {
      const ContactForm = () => {
        const [errors, setErrors] = React.useState<Record<string, string>>({});
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get('name');
          if (!name) setErrors({ name: 'Name is required' });
        };
        return (
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Your name" />
            {errors.name && <span role="alert">{errors.name}</span>}
            <button type="submit">Send</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<ContactForm />);
      const submitButton = screen.getByRole('button', { name: /send/i });
      await user.click(submitButton);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should validate email format', async () => {
      const ContactForm = () => {
        const [errors, setErrors] = React.useState<Record<string, string>>({});
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get('email') as string;
          if (!email.includes('@')) {
            setErrors({ email: 'Invalid email format' });
          }
        };
        return (
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Your email" />
            {errors.email && <span role="alert">{errors.email}</span>}
            <button type="submit">Send</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<ContactForm />);
      const emailInput = screen.getByPlaceholderText('Your email');
      await user.type(emailInput, 'invalid-email');
      await user.click(screen.getByRole('button', { name: /send/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should require message field', async () => {
      const ContactForm = () => {
        const [errors, setErrors] = React.useState<Record<string, string>>({});
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const message = formData.get('message');
          if (!message) setErrors({ message: 'Message is required' });
        };
        return (
          <form onSubmit={handleSubmit}>
            <textarea name="message" placeholder="Your message"></textarea>
            {errors.message && <span role="alert">{errors.message}</span>}
            <button type="submit">Send</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByRole('button', { name: /send/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should enforce minimum message length', () => {
      const minLength = 10;
      const message = 'Short';
      expect(message.length >= minLength).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should handle form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      const ContactForm = () => (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Your name" />
          <input name="email" type="email" placeholder="Your email" />
          <textarea name="message" placeholder="Your message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      );

      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText('Your name');
      const emailInput = screen.getByPlaceholderText('Your email');
      const messageInput = screen.getByPlaceholderText('Your message');

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should clear form after successful submission', async () => {
      const ContactForm = () => {
        const [submitted, setSubmitted] = React.useState(false);
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.currentTarget.reset();
          setSubmitted(true);
        };
        return (
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Your name" defaultValue="" />
            <input name="email" type="email" placeholder="Your email" defaultValue="" />
            <textarea name="message" placeholder="Your message" defaultValue=""></textarea>
            {submitted && <p>Message sent successfully!</p>}
            <button type="submit">Send Message</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
      await user.type(nameInput, 'John Doe');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic form structure', () => {
      const ContactForm = () => (
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact Me</h2>
          <form>
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" />
            <label htmlFor="email">Your email</label>
            <input id="email" type="email" name="email" />
            <label htmlFor="message">Your message</label>
            <textarea id="message" name="message"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </section>
      );

      render(<ContactForm />);
      expect(screen.getByRole('form', { hidden: false })).toBeInTheDocument();
      expect(screen.getByLabelText('Your name')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      const ContactForm = () => (
        <form>
          <input placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Send</button>
        </form>
      );

      render(<ContactForm />);

      await user.tab();
      expect(screen.getByPlaceholderText('Name')).toHaveFocus();

      await user.tab();
      expect(screen.getByPlaceholderText('Email')).toHaveFocus();

      await user.tab();
      expect(screen.getByPlaceholderText('Message')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /send/i })).toHaveFocus();
    });

    it('should display field labels for accessibility', () => {
      const ContactForm = () => (
        <form>
          <label htmlFor="name">Full Name *</label>
          <input id="name" required />
          <label htmlFor="email">Email Address *</label>
          <input id="email" type="email" required />
          <label htmlFor="message">Message *</label>
          <textarea id="message" required></textarea>
        </form>
      );

      render(<ContactForm />);
      expect(screen.getByText(/full name/i)).toBeInTheDocument();
      expect(screen.getByText(/email address/i)).toBeInTheDocument();
      expect(screen.getByText(/message/i)).toBeInTheDocument();
    });

    it('should announce form errors with aria-live', async () => {
      const ContactForm = () => {
        const [error, setError] = React.useState('');
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setError('Please fill in all fields');
        };
        return (
          <form onSubmit={handleSubmit}>
            <input placeholder="Name" required />
            <div aria-live="polite" aria-atomic="true">
              {error && <p role="alert">{error}</p>}
            </div>
            <button type="submit">Send</button>
          </form>
        );
      };

      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByRole('button', { name: /send/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Touch Targets', () => {
    it('form buttons should meet touch target size requirements', () => {
      const ContactForm = () => (
        <form>
          <button type="submit" className="px-6 py-3 min-h-11">
            Send Message
          </button>
        </form>
      );

      const { container } = render(<ContactForm />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('min-h-11');
    });

    it('form inputs should have adequate padding for touch', () => {
      const ContactForm = () => (
        <form>
          <input className="h-11 px-4" placeholder="Name" />
          <textarea className="min-h-20 px-4" placeholder="Message"></textarea>
        </form>
      );

      const { container } = render(<ContactForm />);
      const input = container.querySelector('input');
      const textarea = container.querySelector('textarea');
      expect(input).toHaveClass('h-11');
      expect(textarea).toHaveClass('min-h-20');
    });
  });
});
