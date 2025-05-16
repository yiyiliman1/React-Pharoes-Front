import { toast, ToastContentProps, ToastOptions } from "react-toastify";
import { isFunction } from "lodash";
import { ApiError } from "../types";
import { AxiosError } from "axios";

export type ApiToastCallback<T = any> = (
  ctx: ToastContentProps<T>
) => string | void | undefined | null;
export type ApiErrorResponse = AxiosError<ApiError>;

interface ApiToastCallbacks<T> {
  pending?: ApiToastCallback<T> | string;
  success?: ApiToastCallback<T> | string;
  error?: ApiToastCallback<ApiErrorResponse> | string;
  finish?: VoidFunction;
}

export class ApiToast {
  private constructor() {}

  public static for<T>(
    promise: Promise<T> | (() => Promise<T>),
    callbacks: ApiToastCallbacks<T>,
    options?: ToastOptions
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        pending: isFunction(callbacks.pending)
          ? { render: callbacks.pending }
          : callbacks.pending,
        success: isFunction(callbacks.success)
          ? { render: callbacks.success }
          : callbacks.success,
        error: {
          render(ctx: ToastContentProps<ApiErrorResponse>) {
            const errorMessage = isFunction(callbacks.error)
              ? callbacks.error?.(ctx)
              : callbacks.error;
            return (
              ctx.data?.response?.data?.message ||
              errorMessage ||
              "Unknown error."
            );
          },
        },
      },
      options
    );
  }

  public static showSimpleSuccess<T>(
    text: string,
    options?: ToastOptions
  ): void {
    toast.success(text, options);
  }
  public static showSimpleError<T>(text: string, options?: ToastOptions): void {
    toast.error(text, options);
  }
}
