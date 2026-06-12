import { zodResolver } from "@hookform/resolvers/zod"
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { AuthLayout } from "@/components/Common/AuthLayout"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { PasswordInput } from "@/components/ui/password-input"
import { APP_HOME_PATH, isLoggedIn } from "@/hooks/useAuth"
import useAuth from "@/hooks/useAuth"

const formSchema = z.object({
  username: z.email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
}) satisfies z.ZodType<AccessToken>

type FormData = z.infer<typeof formSchema>

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: APP_HOME_PATH,
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Masuk - TaniLink",
      },
    ],
  }),
})

function Login() {
  const { loginMutation } = useAuth()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = (data: FormData) => {
    if (loginMutation.isPending) return
    loginMutation.mutate(data)
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#17352b]">
              Masuk ke akun Anda
            </h1>
          </div>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="email-input"
                      placeholder="user@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                  <FormLabel>Kata sandi</FormLabel>
                  <RouterLink
                    to="/recover-password"
                    className="ml-auto text-sm text-[#5f685b] underline-offset-4 hover:text-[#17352b] hover:underline"
                  >
                    Lupa kata sandi?
                  </RouterLink>
                </div>
                <FormControl>
                  <PasswordInput
                    data-testid="password-input"
                    placeholder="Masukkan kata sandi"
                    {...field}
                  />
                </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              loading={loginMutation.isPending}
              className="h-11 rounded-full bg-[#24473b] text-[#fffaf2] hover:bg-[#17352b]"
            >
              Masuk
            </LoadingButton>
          </div>

          <div className="text-center text-sm text-[#6c655a]">
            Belum punya akun?{" "}
            <RouterLink
              to="/signup"
              className="font-medium text-[#17352b] underline underline-offset-4"
            >
              Daftar
            </RouterLink>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}
