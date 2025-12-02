import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdmissionForm from '../AdmissionForm';

// Mock fetch
global.fetch = jest.fn();

describe('AdmissionForm - Flaky Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FLAKY TEST 1: Race condition with setTimeout
  it('should handle form submission with timing issues', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<AdmissionForm />);

    const studentNameInput = screen.getByLabelText(/Student's Name/i);
    const parentNameInput = screen.getByLabelText(/Parent's Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const classInput = screen.getByLabelText(/Class/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(studentNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(parentNameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(classInput, { target: { value: '5th Grade' } });

    fireEvent.click(submitButton);

    // FLAKY: Random delay before checking success message
    // Sometimes checks too early, sometimes too late
    const randomDelay = Math.floor(Math.random() * 100);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // This might pass or fail depending on timing
    const successMessage = await screen.findByText(/Form submitted successfully!/i);
    expect(successMessage).toBeInTheDocument();
  });

  // FLAKY TEST 2: Depends on execution order and Date.now()
  it('should validate form submission timestamp', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<AdmissionForm />);

    const startTime = Date.now();

    const studentNameInput = screen.getByLabelText(/Student's Name/i);
    const parentNameInput = screen.getByLabelText(/Parent's Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const classInput = screen.getByLabelText(/Class/i);

    await userEvent.type(studentNameInput, 'Alice Smith');
    await userEvent.type(parentNameInput, 'Bob Smith');
    await userEvent.type(emailInput, 'bob@example.com');
    await userEvent.type(classInput, '3rd Grade');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument();
    });

    const endTime = Date.now();
    // FLAKY: This assertion depends on system performance and load
    // Will fail on slower systems or when system is under load
    expect(endTime - startTime).toBeLessThan(500);
  });

  // FLAKY TEST 3: Random failure based on Math.random()
  it('should randomly pass or fail based on probability', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    // FLAKY: Random chance of simulating network error
    const shouldFail = Math.random() > 0.5;

    if (shouldFail) {
      mockFetch.mockRejectedValue(new Error('Network error'));
    } else {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);
    }

    render(<AdmissionForm />);

    const studentNameInput = screen.getByLabelText(/Student's Name/i);
    const parentNameInput = screen.getByLabelText(/Parent's Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const classInput = screen.getByLabelText(/Class/i);

    fireEvent.change(studentNameInput, { target: { value: 'Test Student' } });
    fireEvent.change(parentNameInput, { target: { value: 'Test Parent' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(classInput, { target: { value: '1st Grade' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // This will pass 50% of the time, fail 50% of the time
      expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument();
    });
  });

  // FLAKY TEST 4: Async state issues without proper waiting
  it('should have flaky behavior when checking button state', async () => {
    render(<AdmissionForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Button should be disabled initially
    expect(submitButton).toBeDisabled();

    const studentNameInput = screen.getByLabelText(/Student's Name/i);

    // FLAKY: Not waiting for state updates
    fireEvent.change(studentNameInput, { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Parent's Name/i), { target: { value: 'Jane' } });

    // FLAKY: Checking immediately without waiting for React state update
    // Sometimes the state hasn't updated yet
    if (Math.random() > 0.3) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Class/i), { target: { value: '5th' } });

    // FLAKY: Button might still be disabled due to race condition
    expect(submitButton).not.toBeDisabled();
  });

  // FLAKY TEST 5: Array/Object ordering issues
  it('should track form field updates in order', async () => {
    render(<AdmissionForm />);

    const updates: string[] = [];

    const studentNameInput = screen.getByLabelText(/Student's Name/i);
    const parentNameInput = screen.getByLabelText(/Parent's Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    // FLAKY: Event handlers fire in non-deterministic order
    studentNameInput.addEventListener('change', () => updates.push('student'));
    parentNameInput.addEventListener('change', () => updates.push('parent'));
    emailInput.addEventListener('change', () => updates.push('email'));

    fireEvent.change(studentNameInput, { target: { value: 'John' } });
    fireEvent.change(parentNameInput, { target: { value: 'Jane' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    // FLAKY: Order might not be guaranteed
    expect(updates).toEqual(['student', 'parent', 'email']);
  });

  // FLAKY TEST 6: Shared state between tests
  let sharedCounter = 0;

  it('should increment shared counter - first test', () => {
    sharedCounter++;
    expect(sharedCounter).toBe(1);
  });

  it('should increment shared counter - second test', () => {
    sharedCounter++;
    // FLAKY: Depends on test execution order
    // Passes if run after first test, fails if run independently
    expect(sharedCounter).toBe(2);
  });

  // FLAKY TEST 7: Improper cleanup causing test pollution
  it('should render form and pollute global state', async () => {
    // @ts-expect-error - Intentionally polluting global state for flaky test
    global.testPollution = 'dirty state';

    render(<AdmissionForm />);

    const studentNameInput = screen.getByLabelText(/Student's Name/i);
    expect(studentNameInput).toBeInTheDocument();

    // Intentionally not cleaning up global.testPollution
  });

  it('should fail if previous test polluted state', () => {
    // FLAKY: Fails if previous test ran before this one
    // @ts-expect-error - Checking for global pollution from previous test
    expect(global.testPollution).toBeUndefined();
  });

  // FLAKY TEST 8: Timezone-dependent test
  it('should work with date-based validation', () => {
    const now = new Date();
    const hour = now.getHours();

    render(<AdmissionForm />);

    // FLAKY: Only passes during certain hours of the day
    // This will fail if run during night time hours
    expect(hour).toBeGreaterThanOrEqual(9);
    expect(hour).toBeLessThan(17);
  });

  // FLAKY TEST 9: Network timing simulation
  it('should handle slow network responses', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

    // FLAKY: Random delay simulating network latency
    const networkDelay = Math.floor(Math.random() * 3000);

    mockFetch.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({}),
          } as Response);
        }, networkDelay)
      )
    );

    render(<AdmissionForm />);

    fireEvent.change(screen.getByLabelText(/Student's Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Parent's Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Class/i), { target: { value: 'Test' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // FLAKY: Timeout might be too short for slow network delays
    await waitFor(() => {
      expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument();
    }, { timeout: 1000 }); // Will timeout if networkDelay > 1000ms
  });

  // FLAKY TEST 10: Floating point precision issues
  it('should calculate form completion percentage', () => {
    render(<AdmissionForm />);

    const totalFields = 5;
    const filledFields = 3;

    // FLAKY: Floating point arithmetic can cause precision issues
    const percentage = (filledFields / totalFields) * 100;
    const alternativeCalc = (filledFields * 100) / totalFields;

    // Sometimes these won't be exactly equal due to floating point precision
    expect(percentage).toBe(alternativeCalc);
    expect(percentage).toBe(60.0);
  });
});
