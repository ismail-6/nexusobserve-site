import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
      name: "See what application telemetry can’t tell you.",
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
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy command", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Copied", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "scripts/quickstart.sh | sh",
  );
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
  const source = page
    .locator(".source-card")
    .filter({
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

test("marketing pages and the source catalog pass automated accessibility checks", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/product",
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
