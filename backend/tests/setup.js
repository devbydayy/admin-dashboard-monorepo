jest.setTimeout(15000);

global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
};

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});
