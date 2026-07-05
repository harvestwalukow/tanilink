import { expect, type Page, test } from "@playwright/test"
import { firstSuperuser, firstSuperuserPassword } from "./config.ts"
import { randomPassword } from "./utils/random.ts"

test.use({ storageState: { cookies: [], origins: [] } })
test.describe.configure({ mode: "serial" })

const fillForm = async (page: Page, email: string, password: string) => {
  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(password)
}

const openAppAfterOnboarding = async (page: Page) => {
  await page.evaluate(() => {
    sessionStorage.setItem("tanilink:onboarding-complete", "true")
  })
  await page.goto("/app")
}

const logOutFromHeader = async (page: Page) => {
  await page.getByRole("button", { name: firstSuperuser }).click()
  await page.getByRole("menuitem", { name: "Logout" }).click()
}

const verifyInput = async (page: Page, testId: string) => {
  const input = page.getByTestId(testId)
  await expect(input).toBeVisible()
  await expect(input).toHaveText("")
  await expect(input).toBeEditable()
}

test("Inputs are visible, empty and editable", async ({ page }) => {
  await page.goto("/login")

  await verifyInput(page, "email-input")
  await verifyInput(page, "password-input")
})

test("Log In button is visible", async ({ page }) => {
  await page.goto("/login")

  await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible()
})

test("Forgot Password link is visible", async ({ page }) => {
  await page.goto("/login")

  await expect(
    page.getByRole("link", { name: "Lupa kata sandi?" }),
  ).toBeVisible()
})

test("Google OAuth button is visible", async ({ page }) => {
  await page.goto("/login")

  await expect(
    page.getByText("Lanjutkan dengan Google").first(),
  ).toBeVisible()
  await expect(page.getByText("atau")).toBeVisible()
})

test("Log in with valid email and password ", async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, firstSuperuser, firstSuperuserPassword)
  await page.getByRole("button", { name: "Masuk" }).click()

  await page.waitForURL("/onboarding")

  await expect(page.getByText("Atur Lokasi & Waktu Tanam")).toBeVisible()
})

test("Log in with invalid email", async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, "invalidemail", firstSuperuserPassword)
  await page.getByRole("button", { name: "Masuk" }).click()

  await expect(page.getByText("Invalid email address")).toBeVisible()
})

test("Log in with invalid password", async ({ page }) => {
  const password = randomPassword()

  await page.goto("/login")
  await fillForm(page, firstSuperuser, password)
  await page.getByRole("button", { name: "Masuk" }).click()

  await expect(
    page.getByRole("listitem").filter({ hasText: "Incorrect email or password" }),
  ).toBeVisible()
})

test("Successful log out", async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, firstSuperuser, firstSuperuserPassword)
  await page.getByRole("button", { name: "Masuk" }).click()

  await page.waitForURL("/onboarding")

  await expect(page.getByText("Atur Lokasi & Waktu Tanam")).toBeVisible()

  await openAppAfterOnboarding(page)
  await logOutFromHeader(page)
  await page.waitForURL("/login")
})

test("Logged-out user cannot access protected routes", async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, firstSuperuser, firstSuperuserPassword)
  await page.getByRole("button", { name: "Masuk" }).click()

  await page.waitForURL("/onboarding")

  await expect(page.getByText("Atur Lokasi & Waktu Tanam")).toBeVisible()

  await openAppAfterOnboarding(page)
  await logOutFromHeader(page)
  await page.waitForURL("/login")

  await page.goto("/app")
  await page.waitForURL("/login")
})

test("Redirects to /login when token is wrong", async ({ page }) => {
  await page.goto("/app")
  await page.evaluate(() => {
    localStorage.setItem("access_token", "invalid_token")
  })
  await page.goto("/app")
  await page.waitForURL("/login")
  await expect(page).toHaveURL("/login")
})
