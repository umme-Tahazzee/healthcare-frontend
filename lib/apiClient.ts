import { ofetch } from "ofetch"
import type { FetchOptions } from "ofetch"

// ---------- 1. Setup ----------

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// env na thakle shuru te-i error dibe, pore debug korte hobe na
if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
}

// ei path gulo te 401 mane "email/password vul", token expire na
// tai ekhane refresh korbo na
const SKIP_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/google", "/auth/refresh"]

// ---------- 2. Error class ----------

// component e error.message ar error.status use korte parbe
export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

// ofetch er lomba error theke backend er asol message ber kore
function makeApiError(error: any): ApiError {
    const message = error?.data?.message || "Something went wrong"
    const status = error?.statusCode || 0
    return new ApiError(message, status)
}

// ---------- 3. Raw client ----------

// kono extra jadu nai, shudhu basic client
const rawClient = ofetch.create({
    baseURL: BASE_URL,
    credentials: "include", // cookie pathabe
})

// ---------- 4. Token refresh ----------

// ek shathe onek request 401 pele, refresh jeno shudhu ekbar hoy
// tai refresh cholchhe kina ta ekhane rakhi
let refreshPromise: Promise<unknown> | null = null

async function refreshToken() {
    // keu already refresh korchhe? tahole tar shesh howar jonno wait koro
    if (refreshPromise) {
        await refreshPromise
        return
    }

    // keu korchhe na, amra shuru kori
    refreshPromise = rawClient("/auth/refresh", { method: "POST" })

    try {
        await refreshPromise
    } finally {
        // sesh hole abar null, porer bar abar refresh kora jabe
        refreshPromise = null
    }
}

// ---------- 5. Main apiClient ----------

async function apiClient<T>(url: string, options?: FetchOptions<"json">): Promise<T> {
    try {
        // Step 1: request pathao
        return await rawClient<T>(url, options)
    } catch (error: any) {
        const is401 = error?.statusCode === 401
        const shouldSkip = SKIP_REFRESH_PATHS.some((path) => url.startsWith(path))

        // Step 2: 401 na hole, ba login/register hole, shudhu error throw
        if (!is401 || shouldSkip) {
            throw makeApiError(error)
        }

        // Step 3: 401 hoyeche, token refresh kore abar try kori
        try {
            await refreshToken()
            return await rawClient<T>(url, options)
        } catch (retryError: any) {
            // refresh fail hole mane user ke abar login korte hobe
            throw makeApiError(retryError)
        }
    }
}

export default apiClient