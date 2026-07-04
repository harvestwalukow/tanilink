import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import {
  type Body_login_login_access_token as AccessToken,
  LoginService,
  OpenAPI,
  type Token,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "@/client"
import { handleError } from "@/utils"
import useCustomToast from "./useCustomToast"

export const APP_HOME_PATH = "/app"
export const DUMMY_ACCOUNT = {
  email: "demo@tanilink.local",
  password: "demo12345",
}

const DUMMY_TOKEN = "tanilink-demo-token"
const DUMMY_USER: UserPublic = {
  id: "demo-user-id",
  email: DUMMY_ACCOUNT.email,
  full_name: "Demo TaniLink",
  is_active: true,
  is_superuser: false,
  created_at: null,
}

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showErrorToast } = useCustomToast()

  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token")
      if (token === DUMMY_TOKEN) {
        return DUMMY_USER
      }
      return UsersService.readUserMe()
    },
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
    if (
      data.username === DUMMY_ACCOUNT.email &&
      data.password === DUMMY_ACCOUNT.password
    ) {
      localStorage.setItem("access_token", DUMMY_TOKEN)
      return
    }
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    localStorage.setItem("access_token", response.access_token)
  }

  const googleLogin = async (credential: string) => {
    const apiBase = OpenAPI.BASE ?? ""
    const response = await fetch(`${apiBase}/api/v1/login/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    })
    const body = await response.json()
    if (!response.ok) {
      throw Object.assign(new Error(body.detail || "Google login failed"), {
        body,
      })
    }
    localStorage.setItem("access_token", (body as Token).access_token)
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      navigate({ to: APP_HOME_PATH })
    },
    onError: handleError.bind(showErrorToast),
  })

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      navigate({ to: APP_HOME_PATH })
    },
    onError: handleError.bind(showErrorToast),
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    queryClient.removeQueries({ queryKey: ["currentUser"] })
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    googleLoginMutation,
    logout,
    user,
  }
}

export { isLoggedIn }
export default useAuth
