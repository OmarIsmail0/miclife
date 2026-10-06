import { logger } from "./logger";

type JsonRecord = Record<string, unknown>;

export class ServerApiClient {
  private readonly baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  static fromEnv(): ServerApiClient {
    const base = process.env.BASE_URL || process.env.MOHINS_URL || "";
    return new ServerApiClient(base);
  }

  async postJson<TResponse = unknown>(path: string, body: JsonRecord, init?: RequestInit): Promise<TResponse> {
    const normalizedPath = path.startsWith("http") ? path : (path.startsWith("/") ? path : `/${path}`);
    const fullUrl = path.startsWith("http") ? normalizedPath : new URL(normalizedPath, this.baseUrl).toString();
    
    // Use logger instead of console.log (only logs in development)
    logger.debug("API Request", { url: fullUrl, method: "POST" });
    
    let res: Response;
    try {
      res = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
        body: JSON.stringify(body),
        next: { revalidate: 0 },
        ...init,
      });
    } catch (err) {
      logger.error("Fetch failed", err, { url: fullUrl });
      throw err;
    }
    
    logger.debug("API Response", { status: res.status, ok: res.ok });
    
    if (!res.ok) {
      logger.error(`HTTP error ${res.status}`, undefined, { url: fullUrl });
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as TResponse;
  }
}


