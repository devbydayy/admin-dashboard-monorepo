import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth.api";
import type { LoginData, RegisterData, AuthResponse, AuthUser } from "@/types/auth.types";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const setAuthCookie = (token: string) => {
  document.cookie = `auth_token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),

    onSuccess: async (response: AuthResponse) => {
      const token = response.data.token

      localStorage.setItem("auth_token", token)

      setAuthCookie(token)

      queryClient.setQueryData(["user"], response.data.user)

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      })

      router.push("/")
    },
  })
}

export const useRegister = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) =>
      authApi.register(data),

    onSuccess: async (response: AuthResponse) => {
      const token = response.data.token

      localStorage.setItem("auth_token", token)

      setAuthCookie(token)

      queryClient.setQueryData(["user"], response.data.user)

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      })

      router.push("/")
    },
  })
}

export const useProfile = () => {
  return useQuery<AuthUser>({
    queryKey: ["user"],
    queryFn: () => authApi.getProfile(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    authApi.logout();

    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("auth_token");

    document.cookie = "prevent_auto_login=1; path=/; max-age=86400";

    queryClient.clear();
    router.push("/auth/login");
  };
};