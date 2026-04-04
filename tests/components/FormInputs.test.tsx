import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input type="text" placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with different input types', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render with aria-invalid when error occurs', () => {
      render(<Input type="text" aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Touch Targets', () => {
    it('input should have minimum height for touch', () => {
      const { container } = render(<Input type="text" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-11');
    });
  });

  describe('Interactions', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<Input type="text" placeholder="Type here" />);
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

      await user.type(input, 'Hello World');
      expect(input.value).toBe('Hello World');
    });

    it('should support disabled state', () => {
      render(<Input type="text" disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('should maintain focus on interaction', async () => {
      const user = userEvent.setup();
      render(<Input type="text" placeholder="Focus me" />);
      const input = screen.getByPlaceholderText('Focus me');

      await user.tab();
      expect(input).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<Input type="text" placeholder="Keyboard test" />);
      const input = screen.getByPlaceholderText('Keyboard test');

      await user.tab();
      expect(input).toHaveFocus();
    });

    it('should support aria-label', () => {
      render(<Input type="text" aria-label="Email address" />);
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });
  });
});

describe('Textarea Component', () => {
  describe('Rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea placeholder="Enter message" />);
      expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
    });

    it('should render with proper rows', () => {
      const { container } = render(<Textarea rows={5} />);
      expect(container.querySelector('textarea')).toHaveAttribute('rows', '5');
    });
  });

  describe('Interactions', () => {
    it('should accept multiline text input', async () => {
      const user = userEvent.setup();
      render(<Textarea placeholder="Multi-line" />);
      const textarea = screen.getByPlaceholderText('Multi-line') as HTMLTextAreaElement;

      await user.type(textarea, 'Line 1\nLine 2\nLine 3');
      expect(textarea.value).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should support disabled state', () => {
      render(<Textarea disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<Textarea placeholder="Keyboard test" />);
      const textarea = screen.getByPlaceholderText('Keyboard test');

      await user.tab();
      expect(textarea).toHaveFocus();
    });

    it('should support aria-label', () => {
      render(<Textarea aria-label="Message body" />);
      expect(screen.getByLabelText('Message body')).toBeInTheDocument();
    });

    it('should support aria-describedby for error messages', () => {
      render(
        <>
          <Textarea aria-describedby="error" />
          <span id="error">This field is required</span>
        </>
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('Touch Targets', () => {
    it('textarea should have minimum height for touch', () => {
      const { container } = render(<Textarea />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('min-h-[80px]');
    });
  });
});
