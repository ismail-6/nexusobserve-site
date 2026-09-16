import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 1440]) {
  test(`OpenTelemetry navigation stays in place while content scrolls at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/opentelemetry/sources");
    const content = page.getByRole("region", {
      name: "OpenTelemetry workspace content",
    });
    const selectors = [
      ".site-header",
      ".otel-sidebar",
      ".otel-workspace-header",
    ];
    const before = await Promise.all(
      selectors.map((selector) => page.locator(selector).boundingBox()),
    );
    await content.evaluate((element) =>
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" }),
    );
    await expect
      .poll(() => content.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(1000);
    for (const [index, selector] of selectors.entries()) {
      const after = await page.locator(selector).boundingBox();
      expect(after!.x, selector).toBeCloseTo(before[index]!.x, 0);
      expect(after!.y, selector).toBeCloseTo(before[index]!.y, 0);
    }
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page
      .locator(".otel-sidebar")
      .getByRole("link", { name: "Setup", exact: true })
      .click();
    await expect(page).toHaveURL(/\/opentelemetry\/setup$/);
    await expect
      .poll(() => content.evaluate((element) => element.scrollTop))
      .toBe(0);
  });
}

for (const width of [390, 1440]) {
  test(`Agent navigation stays in place while content scrolls at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/agents/plugins");
    const content = page.getByRole("region", {
      name: "Agent workspace content",
    });
    const selectors = [
      ".site-header",
      ".otel-sidebar",
      ".otel-workspace-header",
    ];
    const before = await Promise.all(
      selectors.map((selector) => page.locator(selector).boundingBox()),
    );
    await content.evaluate((element) =>
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" }),
    );
    await expect
      .poll(() => content.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(1000);
    for (const [index, selector] of selectors.entries()) {
      const after = await page.locator(selector).boundingBox();
      expect(after!.x, selector).toBeCloseTo(before[index]!.x, 0);
      expect(after!.y, selector).toBeCloseTo(before[index]!.y, 0);
    }
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page
      .locator(".otel-sidebar")
      .getByRole("link", { name: "Setup & enrollment", exact: true })
      .click();
    await expect(page).toHaveURL(/\/agents\/setup$/);
    await expect
      .poll(() => content.evaluate((element) => element.scrollTop))
      .toBe(0);
  });
}

test("light mode is the default and the top theme toggle remembers the visitor's choice", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: "Switch to light mode" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("link", { name: "Platform", exact: true })
    .first()
    .click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Switch to light mode" });
  await expect(toggle).toBeInViewport();
  await toggle.click();
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeInViewport();
});

test("workspace preview lets visitors explore services, traces, and logs", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Observe everything.",
  );
  const preview = page.locator(".product-preview");
  await preview.getByRole("tab", { name: "Services" }).click();
  await preview
    .getByRole("textbox", { name: "Search example services" })
    .fill("inventory");
  await expect(preview.locator(".preview-service-row")).toHaveCount(1);
  await expect(preview.locator(".preview-service-row")).toContainText(
    "inventory-worker",
  );
  await preview.getByRole("tab", { name: "Traces", exact: true }).click();
  await expect(preview.locator(".trace-waterfall")).toContainText(
    "payment.authorize",
  );
  await preview.getByRole("tab", { name: "Logs", exact: true }).click();
  await expect(preview.locator(".preview-log-list")).toContainText(
    "Payment authorization retry",
  );
  expect(errors).toEqual([]);
});

test("collection tabs and numbered FAQ expose the selected content", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Native agent", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Collect directly from your infrastructure.",
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Hybrid", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Open application signals. Deep local context.",
    }),
  ).toBeVisible();
  const question = page.getByRole("button", {
    name: /Do I need to install a NexusObserve agent/,
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".faq-answer").first()).toContainText(
    "existing Collector",
  );
  await question.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("installation command copies to the clipboard", async ({
  page,
  context,
  request,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy command", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Copied", exact: true }),
  ).toBeVisible();
  const command = await page.evaluate(() => navigator.clipboard.readText());
  expect(command).toContain("/downloads/quickstart.sh | sh");
  const installer = await request.get(command.split(" ")[2]);
  expect(installer.ok()).toBeTruthy();
  expect(await installer.text()).toMatch(/^#!\/usr\/bin\/env sh/);
});

test("navigation supports resource menus and browser history", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Resources" }).click();
  await page.getByRole("menuitem", { name: /Documentation/ }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "From your first signal",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Observe everything",
  );
});

test("source links filter the catalog and generate source-specific configuration", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".source-chip").filter({ hasText: "Node.js" }).click();
  await expect(
    page.getByRole("textbox", { name: "Search data sources" }),
  ).toHaveValue("Node.js");
  const source = page.locator(".source-card").filter({
    has: page.getByRole("heading", { name: "Node.js", exact: true }),
  });
  await source.getByRole("button", { name: "Configure" }).click();
  const drawer = page.getByRole("dialog", { name: "Node.js", exact: true });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("button", { name: "Continue", exact: true }).click();
  await drawer.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(drawer.locator(".source-preview-code")).toContainText(
    "OTEL_SERVICE_NAME",
  );
  await drawer.getByRole("button", { name: "Close", exact: true }).click();
  await expect(drawer).toBeHidden();
});

test("mobile navigation closes after choosing a route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menuAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(menuAudit.violations).toEqual([]);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "OpenTelemetry", exact: true })
    .click();
  await expect(page).toHaveURL(/\/opentelemetry$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(page.locator(".otel-workspace-header h1")).toHaveText(
    "Overview",
  );
});

test("agent collection leads to the matching native plugin catalog", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore platform" }).click();
  await page.getByRole("menuitem", { name: /Agent-based collection/ }).click();
  await expect(page).toHaveURL(/\/agents$/);
  const preview = page.getByRole("region", {
    name: "Agent collection preview",
  });
  await preview.getByRole("tab", { name: "Databases", exact: true }).click();
  await expect(preview.getByRole("table")).toContainText("Pending batches");
  await preview.getByRole("link", { name: "Explore these plugins" }).click();
  await expect(page).toHaveURL(/\/agents\/plugins\?category=Databases$/);
  await expect(page.locator(".native-plugin-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Explore SQL query sampler" }).click();
  const details = page.getByRole("dialog", { name: "SQL query sampler" });
  await expect(details).toContainText("read-only database credentials");
  await expect(details).toContainText("interval_sec");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(details).toBeHidden();
  await expect(page).toHaveURL(/\/agents\/plugins\?category=Databases$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/agents$/);
});

test("native plugin filters, empty state, and detail links work", async ({
  page,
}) => {
  await page.goto("/plugins");
  await page.getByRole("button", { name: "Files & logs", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search native plugins" });
  await search.fill("arrivals");
  await expect(page.locator(".native-plugin-card")).toHaveCount(1);
  await expect(page.locator(".native-plugin-card")).toContainText(
    "File transmission monitor",
  );
  await page.reload();
  await expect(search).toHaveValue("arrivals");
  await search.fill("no-matching-plugin");
  await expect(
    page.getByRole("heading", { name: "No matching plugins" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".native-plugin-card")).toHaveCount(20);
  await page.goto("/plugins?plugin=cpu");
  const details = page.getByRole("dialog", { name: "CPU", exact: true });
  await expect(details).toBeVisible();
  await expect(details).toContainText("cpu.percentUtilisation");
  await details.getByRole("link", { name: "Read plugin setup" }).click();
  await expect(page).toHaveURL(/\/docs\/plugins$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Native plugin setup",
  );
});

test("agent setup and sampler examples follow the chosen settings", async ({
  page,
}) => {
  await page.goto("/agents/setup");
  const server = page.getByRole("textbox", { name: "Server URL" });
  await server.fill("not-a-server-url");
  await expect(
    page.getByRole("button", { name: "Copy example" }),
  ).toBeDisabled();
  await server.fill("https://nexus.internal:8443");
  await page.getByRole("button", { name: /^Docker/ }).click();
  await expect(page.locator(".agent-code-panel")).toContainText(
    'NEXUSOBSERVE_SERVER_URL: "https://nexus.internal:8443"',
  );
  await expect(
    page.getByRole("button", { name: "Copy example" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: /^Kubernetes/ }).click();
  await expect(page.locator(".agent-code-panel")).toContainText(
    "existingSecret: nexusobserve-agent-bootstrap",
  );
  await page
    .locator(".otel-sidebar")
    .getByRole("link", { name: "Samplers", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Native plugin" })
    .selectOption("sql");
  const interval = page.getByRole("spinbutton", {
    name: "Collection interval (seconds)",
  });
  await interval.fill("60");
  const config = JSON.parse(
    await page.locator(".agent-code-panel pre").innerText(),
  );
  expect(config.plugin).toBe("sql");
  expect(config.config).toMatchObject({
    interval_sec: 60,
    execution_target: "probe",
    db_host: "orders-db.internal",
    timeout_sec: 10,
  });
  expect(config.config.query).toContain("FROM pg_stat_activity");
  await interval.fill("0");
  await expect(
    page.getByRole("button", { name: "Copy example" }),
  ).toBeDisabled();
});

test("agent fleet filters by environment and exposes collection details", async ({
  page,
}) => {
  await page.goto("/agents/fleet");
  const environment = page.getByRole("combobox", {
    name: "Environment",
    exact: true,
  });
  await environment.selectOption("Staging");
  const table = page.getByRole("table");
  await expect(table.locator("tbody tr")).toHaveCount(1);
  await expect(table).toContainText("staging-vm-01");
  await environment.selectOption("Production");
  await page
    .getByRole("searchbox", { name: "Search example agents" })
    .fill("edge");
  await expect(table.locator("tbody tr")).toHaveCount(1);
  const inspect = page.getByRole("button", { name: "Inspect edge-prod-01" });
  await inspect.click();
  const details = page.getByRole("dialog", {
    name: "edge-prod-01",
    exact: true,
  });
  await expect(details).toContainText("58%");
  await expect(details).toContainText("x-ping");
  await page.keyboard.press("Escape");
  await expect(details).toBeHidden();
  await expect(inspect).toBeFocused();
  await page
    .locator(".otel-sidebar")
    .getByRole("link", { name: "Health & coverage", exact: true })
    .click();
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(3);
});

test("native packages and checksums remain available on the trailing-slash route", async ({
  page,
  request,
}) => {
  await page.goto("/downloads/");
  for (const link of await page
    .locator(".download-card a[download],.download-footer a[download]")
    .all()) {
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/downloads\//);
    expect((await request.get(href!)).ok()).toBeTruthy();
  }
  expect(
    await (await request.get("/downloads/checksums.sha256")).text(),
  ).toMatch(/[a-f0-9]{64}/);
});

for (const width of [320, 390, 768, 1440]) {
  test(`main routes fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/product",
      "/agents",
      "/agents/setup",
      "/agents/plugins",
      "/agents/samplers",
      "/agents/fleet",
      "/agents/dataviews",
      "/agents/configuration",
      "/agents/security",
      "/agents/rollouts",
      "/agents/health",
      "/plugins",
      "/industries",
      "/compare",
      "/docs",
      "/downloads",
      "/opentelemetry/sources",
      "/guides",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        route,
      ).toBeTruthy();
    }
  });
}

for (const theme of ["light", "dark"]) {
  test(`marketing pages and the source catalog pass accessibility checks in ${theme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    if (theme === "dark") {
      await page.getByRole("button", { name: "Switch to dark mode" }).click();
    }
    for (const route of [
      "/",
      "/product",
      "/agents",
      "/agents/setup",
      "/agents/plugins",
      "/agents/samplers",
      "/agents/fleet",
      "/agents/dataviews",
      "/agents/configuration",
      "/agents/security",
      "/agents/rollouts",
      "/agents/health",
      "/plugins",
      "/docs/plugins",
      "/compare",
      "/docs",
      "/opentelemetry/sources",
    ]) {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, route).toEqual([]);
    }
  });
}
