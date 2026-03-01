import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import api from "@/lib/api"

// AxiosBaseQueryArgs → the shape of what goes in to every request:
type AxiosBaseQueryArgs = {
  url: string
  method?: string
  data?: unknown
}

/**
 * RTK Query baseQuery that uses the app's axios instance (auth, baseURL).
 * Return shape must be { data } or { error }.
 */
export const axiosBaseQuery =
// BaseQueryFn is a TypeScript type provided by RTK Query. It takes 3 generic arguments:
// BaseQueryFn<InputType, SuccessType, ErrorType>
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method = "GET", data }) => {
    try {
      const res = await api.request({
        url,
        method,
        data,
      })
      return { data: res.data }
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: unknown }; message?: string }
      return {
        error: {
          status: ax.response?.status,
          data: ax.response?.data ?? ax.message,
        },
      }
    }
  }
