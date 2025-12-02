import { POST } from '../route';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mock fs and ExcelJS
jest.mock('fs');
jest.mock('exceljs');

describe('Submit Form API - Flaky Tests', () => {
  const mockRequest = (body: Record<string, string>) => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FLAKY TEST 1: File system race condition
  it('should handle concurrent file writes', async () => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;

    // FLAKY: Simulates race condition where directory might be created between check and creation
    let dirExists = false;
    mockExistsSync.mockImplementation(() => {
      const result = dirExists;
      // Randomly flip the state to simulate race condition
      if (Math.random() > 0.5) {
        dirExists = true;
      }
      return result;
    });

    mockMkdirSync.mockImplementation(() => {
      if (dirExists) {
        throw new Error('Directory already exists');
      }
      dirExists = true;
      return undefined;
    });

    const body = {
      studentName: 'Test Student',
      parentName: 'Test Parent',
      email: 'test@test.com',
      class: '5th Grade',
      message: 'Test message',
    };

    const req = mockRequest(body);

    // FLAKY: Might throw error about directory already existing
    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  // FLAKY TEST 2: Timing-dependent test
  it('should process form submission within time limit', async () => {
    const startTime = Date.now();

    const body = {
      studentName: 'John Doe',
      parentName: 'Jane Doe',
      email: 'john@example.com',
      class: '3rd Grade',
      message: '',
    };

    const req = mockRequest(body);

    // Add random delay to simulate varying processing times
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));

    await POST(req);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // FLAKY: Will fail on slower systems or when system is busy
    expect(duration).toBeLessThan(150);
  });

  // FLAKY TEST 3: Random success/failure
  it('should randomly succeed or fail based on system state', async () => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;

    // FLAKY: Randomly simulate "disk full" or other file system errors
    const shouldFail = Math.random() > 0.6;

    mockExistsSync.mockImplementation(() => {
      if (shouldFail) {
        throw new Error('ENOSPC: no space left on device');
      }
      return true;
    });

    const body = {
      studentName: 'Alice Smith',
      parentName: 'Bob Smith',
      email: 'alice@example.com',
      class: '2nd Grade',
      message: 'Looking forward to enrollment',
    };

    const req = mockRequest(body);

    const response = await POST(req);

    // FLAKY: Sometimes expects 200, sometimes 500
    expect(response.status).toBe(200);
  });

  // FLAKY TEST 4: Shared state pollution
  let globalCounter = 0;

  it('should increment submission counter - test A', async () => {
    globalCounter++;

    const body = {
      studentName: 'Test A',
      parentName: 'Parent A',
      email: 'a@test.com',
      class: '1st',
      message: '',
    };

    const req = mockRequest(body);
    await POST(req);

    expect(globalCounter).toBe(1);
  });

  it('should increment submission counter - test B', async () => {
    globalCounter++;

    const body = {
      studentName: 'Test B',
      parentName: 'Parent B',
      email: 'b@test.com',
      class: '2nd',
      message: '',
    };

    const req = mockRequest(body);
    await POST(req);

    // FLAKY: Depends on test execution order
    expect(globalCounter).toBe(2);
  });

  // FLAKY TEST 5: Async timing without proper waiting
  it('should handle async file operations without proper waiting', async () => {
    const operations: string[] = [];

    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    mockExistsSync.mockImplementation(() => {
      operations.push('check');
      return true;
    });

    const body = {
      studentName: 'Timing Test',
      parentName: 'Timing Parent',
      email: 'timing@test.com',
      class: '4th',
      message: '',
    };

    const req = mockRequest(body);

    // FLAKY: Not awaiting properly, operations array might not be populated yet
    POST(req);

    // Checking immediately without waiting for async operations
    if (Math.random() > 0.5) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    expect(operations).toContain('check');
  });

  // FLAKY TEST 6: Timestamp-based test
  it('should only accept submissions during business hours', () => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // FLAKY: Test passes/fails based on when it's run
    expect(hour).toBeGreaterThanOrEqual(9);
    expect(hour).toBeLessThan(17);
    expect(dayOfWeek).toBeGreaterThan(0); // Not Sunday
    expect(dayOfWeek).toBeLessThan(6); // Not Saturday
  });

  // FLAKY TEST 7: Path handling with OS-specific behavior
  it('should handle file paths correctly', () => {
    const filePath = path.join('/tmp', 'admissions.xlsx');

    // FLAKY: Behavior differs between Windows and Unix-like systems
    // Windows uses backslashes, Unix uses forward slashes
    expect(filePath).toBe('/tmp/admissions.xlsx');

    // This will fail on Windows
    expect(filePath).not.toContain('\\');
  });

  // FLAKY TEST 8: Memory-based flakiness
  it('should handle large form submissions', async () => {
    const largeMessage = 'x'.repeat(Math.floor(Math.random() * 100000));

    const body = {
      studentName: 'Large Data Test',
      parentName: 'Large Data Parent',
      email: 'large@test.com',
      class: '5th',
      message: largeMessage,
    };

    const req = mockRequest(body);

    const memBefore = process.memoryUsage().heapUsed;
    await POST(req);
    const memAfter = process.memoryUsage().heapUsed;

    const memDiff = memAfter - memBefore;

    // FLAKY: Memory usage varies based on system state and garbage collection
    expect(memDiff).toBeLessThan(10 * 1024 * 1024); // 10MB
  });

  // FLAKY TEST 9: Floating point comparison
  it('should calculate file size accurately', async () => {
    // Simulate file size calculation
    const fileSize = 1024.5;
    const fileSizeInKB = fileSize / 1024;
    const alternativeCalc = fileSize * (1 / 1024);

    // FLAKY: Floating point precision issues
    expect(fileSizeInKB).toBe(alternativeCalc);
    expect(fileSizeInKB).toBe(1.0004882812500001);
  });

  // FLAKY TEST 10: Network/IO simulation with random delays
  it('should handle slow file system operations', async () => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;

    mockExistsSync.mockImplementation(() => {
      // FLAKY: Random delay simulating slow disk I/O
      const delay = Math.floor(Math.random() * 100);
      const start = Date.now();
      while (Date.now() - start < delay) {
        // Busy wait
      }
      return true;
    });

    const body = {
      studentName: 'IO Test',
      parentName: 'IO Parent',
      email: 'io@test.com',
      class: '6th',
      message: '',
    };

    const req = mockRequest(body);

    const startTime = Date.now();
    await POST(req);
    const duration = Date.now() - startTime;

    // FLAKY: Sometimes the I/O is fast, sometimes slow
    expect(duration).toBeLessThan(50);
  });

  // FLAKY TEST 11: Test pollution through uncleared mocks
  it('should set up mock that affects subsequent tests', async () => {
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    mockExistsSync.mockReturnValue(false);

    const body = {
      studentName: 'Pollution Test',
      parentName: 'Pollution Parent',
      email: 'pollution@test.com',
      class: '3rd',
      message: '',
    };

    const req = mockRequest(body);
    const response = await POST(req);

    expect(response.status).toBe(200);
    // Intentionally not clearing the mock
  });

  it('should fail due to previous test pollution', async () => {
    // FLAKY: This test assumes clean state but previous test didn't clean up
    const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;

    const body = {
      studentName: 'Clean Test',
      parentName: 'Clean Parent',
      email: 'clean@test.com',
      class: '4th',
      message: '',
    };

    const req = mockRequest(body);

    // FLAKY: Might fail if previous test's mock is still active
    expect(mockExistsSync).not.toHaveBeenCalled();

    await POST(req);
  });
});
