import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../app/page';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/components/Gallery', () => ({
  __esModule: true,
  default: () => <div>Gallery Component</div>,
}));

describe('Integration Tests - Flaky', () => {
  // FLAKY TEST 1: DOM query with timing issues
  it('should load homepage with all sections', async () => {
    render(<HomePage />);

    // FLAKY: Random delay before checking elements
    const delay = Math.floor(Math.random() * 50);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const heading = screen.getByText(/Welcome to Springfield Elementary/i);
    expect(heading).toBeInTheDocument();

    // FLAKY: Sometimes queries run too fast before render completes
    const aboutLink = screen.getByText(/Learn More/i);
    expect(aboutLink).toBeInTheDocument();
  });

  // FLAKY TEST 2: Multiple async operations without coordination
  it('should handle multiple user interactions', async () => {
    render(<HomePage />);

    const links = screen.getAllByRole('link');

    // FLAKY: Clicking multiple elements rapidly can cause race conditions
    const promises = links.map((link, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          fireEvent.click(link);
          resolve(true);
        }, Math.random() * 100);
      });
    });

    await Promise.all(promises);

    // FLAKY: State might not be consistent after rapid clicks
    expect(links.length).toBeGreaterThan(0);
  });

  // FLAKY TEST 3: Snapshot test with dynamic content
  it('should match snapshot', () => {
    const { container } = render(<HomePage />);

    // FLAKY: Snapshots can change based on environment, timezone, etc.
    // Also includes timestamps or random IDs
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    expect(container).toMatchSnapshot(`homepage-${timestamp}-${randomId}`);
  });

  // FLAKY TEST 4: Testing with global state
  let pageLoadCount = 0;

  it('should track page loads - first load', () => {
    pageLoadCount++;
    render(<HomePage />);

    expect(pageLoadCount).toBe(1);
    expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
  });

  it('should track page loads - second load', () => {
    pageLoadCount++;
    render(<HomePage />);

    // FLAKY: Depends on test execution order
    expect(pageLoadCount).toBe(2);
  });

  // FLAKY TEST 5: Browser-specific behavior
  it('should handle viewport-specific rendering', () => {
    // FLAKY: Test behavior changes based on mock viewport size
    const originalInnerWidth = window.innerWidth;

    // Randomly set viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: Math.random() > 0.5 ? 1200 : 375,
    });

    render(<HomePage />);

    const isMobile = window.innerWidth < 768;

    // FLAKY: Expectations change based on random viewport
    if (isMobile) {
      // Mobile-specific expectations
      expect(window.innerWidth).toBeLessThan(768);
    } else {
      // Desktop-specific expectations
      expect(window.innerWidth).toBeGreaterThanOrEqual(768);
    }

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // FLAKY TEST 6: Array ordering issues
  it('should render links in correct order', () => {
    render(<HomePage />);

    const links = screen.getAllByRole('link');
    const linkTexts = links.map((link) => link.textContent);

    // FLAKY: Order might not be guaranteed in all browsers/environments
    expect(linkTexts[0]).toContain('Learn More');
    expect(linkTexts[1]).toContain('Explore');
    expect(linkTexts[2]).toContain('View News');
  });

  // FLAKY TEST 7: Event propagation issues
  it('should handle nested click events', () => {
    render(<HomePage />);

    let clickCount = 0;

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        clickCount++;
        // FLAKY: Sometimes preventDefault is called, sometimes not
        if (Math.random() > 0.5) {
          e.preventDefault();
        }
      });
    });

    // Click first link
    fireEvent.click(links[0]);

    // FLAKY: Click count might vary based on event propagation
    expect(clickCount).toBe(1);
  });

  // FLAKY TEST 8: CSS class checks with timing
  it('should apply correct CSS classes', async () => {
    const { container } = render(<HomePage />);

    // FLAKY: Classes might be applied after initial render
    const randomWait = Math.random() > 0.5;
    if (randomWait) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const heroSection = container.querySelector('[class*="hero"]');

    // FLAKY: Might not find element if CSS modules generate different class names
    expect(heroSection).toBeInTheDocument();
  });

  // FLAKY TEST 9: Memory leak simulation
  it('should not leak memory when unmounting', () => {
    const { unmount } = render(<HomePage />);

    const beforeMemory = process.memoryUsage().heapUsed;

    // Render and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount: unmountLoop } = render(<HomePage />);
      unmountLoop();
    }

    unmount();

    const afterMemory = process.memoryUsage().heapUsed;
    const memoryDiff = afterMemory - beforeMemory;

    // FLAKY: Memory usage varies based on garbage collection timing
    expect(memoryDiff).toBeLessThan(5 * 1024 * 1024); // 5MB
  });

  // FLAKY TEST 10: Parallel test execution issues
  it('should handle concurrent renders - test A', async () => {
    const promise1 = new Promise<void>((resolve) => {
      setTimeout(() => {
        render(<HomePage />);
        resolve();
      }, Math.random() * 100);
    });

    await promise1;

    expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
  });

  it('should handle concurrent renders - test B', async () => {
    const promise2 = new Promise<void>((resolve) => {
      setTimeout(() => {
        render(<HomePage />);
        resolve();
      }, Math.random() * 100);
    });

    await promise2;

    // FLAKY: Might conflict with test A if run in parallel
    expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
  });

  // FLAKY TEST 11: Date/time dependent
  it('should show appropriate greeting based on time of day', () => {
    const hour = new Date().getHours();

    render(<HomePage />);

    // FLAKY: Test expectations change based on time of day
    if (hour < 12) {
      expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
    } else if (hour < 18) {
      expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
    } else {
      expect(screen.getByText(/Welcome to Springfield Elementary/i)).toBeInTheDocument();
    }

    // This assertion will fail during certain hours
    expect(hour).toBeLessThan(23);
    expect(hour).toBeGreaterThanOrEqual(8);
  });

  // FLAKY TEST 12: Scroll position test
  it('should handle scroll events', () => {
    render(<HomePage />);

    // FLAKY: Scroll position might not update synchronously
    window.scrollTo(0, 100);

    // Random delay
    if (Math.random() > 0.5) {
      // Wait for scroll
      setTimeout(() => {}, 0);
    }

    // FLAKY: scrollY might not be updated yet
    expect(window.scrollY).toBe(100);
  });

  // FLAKY TEST 13: Resource loading
  it('should wait for all resources to load', async () => {
    const { container } = render(<HomePage />);

    const images = container.querySelectorAll('img');

    // FLAKY: Not all images might be loaded
    const imageLoadPromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          // Random chance of image "loading"
          setTimeout(() => resolve(Math.random() > 0.3), Math.random() * 100);
        }
      });
    });

    const results = await Promise.all(imageLoadPromises);

    // FLAKY: Some images might not load in time
    expect(results.every((r) => r === true)).toBe(true);
  });

  // FLAKY TEST 14: Focus management
  it('should manage focus correctly', () => {
    render(<HomePage />);

    const links = screen.getAllByRole('link');

    // FLAKY: Focus behavior can be inconsistent
    links[0].focus();

    // Random chance of blur occurring
    if (Math.random() > 0.5) {
      links[0].blur();
    }

    // FLAKY: activeElement might not be what we expect
    expect(document.activeElement).toBe(links[0]);
  });

  // FLAKY TEST 15: String comparison with special characters
  it('should handle special characters in content', () => {
    render(<HomePage />);

    const content = screen.getByText(/Principal.*Jane Doe/i);

    // FLAKY: Different browsers/environments might normalize whitespace differently
    const text = content.textContent;
    expect(text).toContain('Principal');
    expect(text).toContain('Jane Doe');

    // This might fail if there are non-breaking spaces or different whitespace
    expect(text?.replace(/\s+/g, ' ').trim()).toBe('- Principal Jane Doe');
  });
});
