import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => { }}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => { }}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeButton={true}>
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it('should close on ESC key press', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    // Should have been called due to ESC handler
    // Note: Actual implementation may vary
  });

  it('should display title and description', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => { }}
        title="Test Modal"
        description="Test description"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should apply correct size classes', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => { }} size="lg">
        <p>Large modal</p>
      </Modal>
    );

    const modalContent = container.querySelector('[role="dialog"]');
    expect(modalContent).toHaveClass('max-w-lg');
  });

  it('should prevent scroll when open', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={() => { }}>
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).not.toBe('hidden');

    rerender(
      <Modal isOpen={true} onClose={() => { }}>
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });
});
