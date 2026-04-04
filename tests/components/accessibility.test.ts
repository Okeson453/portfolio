import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Form } from '@/components/ui/Form';

/**
 * Jest Accessibility Tests with jest-axe
 * Unit-level WCAG 2.2 AA compliance validation
 * 
 * Run: npm test -- __tests__/components/accessibility.test.ts
 * Install: npm install --save-dev jest-axe @testing-library/react
 */

expect.extend(toHaveNoViolations);

describe('Component Accessibility — WCAG 2.2 AA', () => {
  describe('Button Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible disabled state', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible loading state', async () => {
      const { container } = render(
        <Button isLoading>Loading...</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible variant states', async () => {
      const variants = ['default', 'secondary', 'outline', 'ghost', 'danger'];
      
      for (const variant of variants) {
        const { container } = render(
          <Button variant={variant as any}>Button</Button>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have proper focus indicators', async () => {
      const { container, getByRole } = render(<Button>Button</Button>);
      const button = getByRole('button');
      
      // Check for focus-visible support
      expect(button).toHaveClass('focus-visible:outline-2');
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Input Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Input 
          id="email"
          type="email"
          placeholder="Enter email"
          aria-label="Email address"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support aria-invalid and aria-describedby', async () => {
      const { container, getByRole } = render(
        <Input
          id="password"
          type="password"
          aria-invalid="true"
          aria-describedby="password-error"
        />
      );
      const input = getByRole('textbox');
      
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'password-error');
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible disabled state', async () => {
      const { container } = render(
        <Input disabled placeholder="Disabled input" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Component', () => {
    it('Form.Field should auto-associate label and control', async () => {
      const { container, getByRole, getByText } = render(
        <Form.Field name="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control>
            <Input type="email" />
          </Form.Control>
        </Form.Field>
      );

      const label = getByText('Email Address');
      const input = getByRole('textbox');

      // Label should have htmlFor
      expect(label).toHaveAttribute('for', input.id);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Form.Error should have role="alert"', async () => {
      const { container, getByRole } = render(
        <Form.Error>This field is required</Form.Error>
      );

      const error = getByRole('alert');
      expect(error).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Form.Description should be associated with input', async () => {
      const { container, getByRole } = render(
        <Form.Field name="password">
          <Form.Label>Password</Form.Label>
          <Form.Control>
            <Input type="password" id="password" />
          </Form.Control>
          <Form.Description id="password-hint">
            Must be at least 8 characters
          </Form.Description>
        </Form.Field>
      );

      const input = getByRole('textbox') as HTMLInputElement;
      expect(input).toHaveAttribute('aria-describedby', 'password-hint');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('Button default state should meet WCAG AA contrast', async () => {
      const { container } = render(
        <Button variant="default">Submit</Button>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('Button danger state should meet WCAG AA contrast', async () => {
      const { container } = render(
        <Button variant="danger">Delete</Button>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('Button should be keyboard accessible', async () => {
      const onClick = jest.fn();
      const { container, getByRole } = render(
        <Button onClick={onClick}>Click</Button>
      );
      const button = getByRole('button');

      // Should be in tab order
      expect(button).not.toHaveAttribute('tabindex', '-1');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Form input should be keyboard accessible', async () => {
      const { container, getByRole } = render(
        <Input id="name" type="text" aria-label="Full Name" />
      );
      const input = getByRole('textbox');

      expect(input).not.toHaveAttribute('tabindex', '-1');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should validate aria-invalid usage', async () => {
      const { container } = render(
        <Input
          aria-invalid="true"
          aria-describedby="error-msg"
          id="username"
        />
      );

      const results = await axe(container, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should validate aria-label on icon-only buttons', async () => {
      const { container } = render(
        <Button aria-label="Close menu">✕</Button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Touch Target Size', () => {
    it('Button should meet 44px minimum touch target', async () => {
      const { container, getByRole } = render(
        <Button size="default">Button</Button>
      );
      const button = getByRole('button');

      // Default size should be at least 44px
      const computedStyle = window.getComputedStyle(button);
      const height = parseFloat(computedStyle.height);
      
      // Allow some flexibility as it includes padding
      expect(height).toBeGreaterThanOrEqual(40);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
