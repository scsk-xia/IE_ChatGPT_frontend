type MessageDict = {
  [key: string]: string;
};

const COMMON_ERROR_MESSAGE_CONTACT =
  "If the problem persists, please contact the administrator for further assistance.";

const COMMON_ERROR_MESSAGES: MessageDict = {
  unexpected_error: "Something went wrong. Please refresh the page and try again.\n\n" + COMMON_ERROR_MESSAGE_CONTACT,
  timeout:
    "Operation timed out due to high server load or network issues. Please wait a few minutes and try again.\n\n" +
    COMMON_ERROR_MESSAGE_CONTACT,
  ratelimit:
    "Your request could not be completed due to a high volume of requests from users. Please wait a few minutes and try again.\n\n" +
    COMMON_ERROR_MESSAGE_CONTACT,
  max_token_limit: "Your input is too long. Please shorten your message.\n\n" + COMMON_ERROR_MESSAGE_CONTACT,
};

const ERROR_MESSAGES: MessageDict = {
  "vectorstore.not_found": COMMON_ERROR_MESSAGES.unexpected_error,
  "storage.download_failed": COMMON_ERROR_MESSAGES.unexpected_error,
  "storage.resource_not_found": COMMON_ERROR_MESSAGES.unexpected_error,
  "storage.resource_exists": COMMON_ERROR_MESSAGES.unexpected_error,
  "storage.http_response": COMMON_ERROR_MESSAGES.unexpected_error,
  "cosmosdb.resource_exists": COMMON_ERROR_MESSAGES.unexpected_error,
  "cosmosdb.resource_not_found": COMMON_ERROR_MESSAGES.unexpected_error,
  "cosmosdb.invalid_threadid": COMMON_ERROR_MESSAGES.unexpected_error,
  "cosmosdb.http_response": COMMON_ERROR_MESSAGES.unexpected_error,
  "openai.timeout": COMMON_ERROR_MESSAGES.timeout,
  "openai.ratelimit": COMMON_ERROR_MESSAGES.ratelimit,
  "request.bad_request": COMMON_ERROR_MESSAGES.unexpected_error,
  "request.forbidden": COMMON_ERROR_MESSAGES.unexpected_error,
  "api.answer_generate_failed": COMMON_ERROR_MESSAGES.unexpected_error,
  "common.exception": COMMON_ERROR_MESSAGES.unexpected_error,
  "common.timeout": COMMON_ERROR_MESSAGES.timeout,
  "openai.max_token_limit": COMMON_ERROR_MESSAGES.max_token_limit,
  "openai.invalid_request": COMMON_ERROR_MESSAGES.unexpected_error,
};

type ColorPalette = {
  [key: number]: string;
};

const PALETTES: { [key: string]: ColorPalette } = {
  default: {
    0: "#00A3C8",
    1: "#E5F6F9",
    2: "#FFFFFF",
    3: "#0090b0",
    4: "#2A2D30",
    5: "#464A50",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
  monochrome: {
    0: "#444444",
    1: "#ECECEC",
    2: "#DADADA",
    3: "#3D3D3D",
    4: "#292929",
    5: "#1B1B1B",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
  blue: {
    0: "#00A3C8",
    1: "#E5F5F9",
    2: "#CCEDF4",
    3: "#0092B4",
    4: "#006278",
    5: "#004150",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
  red: {
    0: "#FF2E00",
    1: "#FFEAE5",
    2: "#FFD5CC",
    3: "#E52900",
    4: "#991C00",
    5: "#661200",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
  green: {
    0: "#2AA500",
    1: "#E9F6E5",
    2: "#E9F6E5",
    3: "#269400",
    4: "#196300",
    5: "#114200",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
};

const constants = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  AZURE_AUTHORITY: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || "",
  AZURE_KNOWN_AUTHORITY: process.env.NEXT_PUBLIC_AZURE_KNOWN_AUTHORITY,
  AZURE_APP_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_APP_CLIENT_ID || "",
  AZURE_API_SCOPE: process.env.NEXT_PUBLIC_AZURE_API_SCOPE || "",
  APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE || "Demo",
  REFERENCE_URL_PREFIX: process.env.NEXT_PUBLIC_REFERENCE_URL_PREFIX || "",
  DUMMY_USER_ID: process.env.DUMMY_USER_ID || "dummy-user-id",
  DUMMY_USER_EMAIL: process.env.NEXT_PUBLIC_DUMMY_USER_EMAIL || "dummy@example.com",
  DUMMY_USER_DETAIL_BASE64:
    process.env.NEXT_PUBLIC_API_DUMMY_USER_DETAIL_BASE64 ||
    "eyJjbGFpbXMiOlt7InR5cCI6Im5hbWUiLCJ2YWwiOiJEVU1NWSBVU0VSIn1dfQ==", // { "claims": [ { "typ": "name", "val": "DUMMY USER" } ] }
  ERROR_MESSAGES: ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE: ERROR_MESSAGES["common.exception"],
  COLOR_PALETTES: PALETTES,
  COLOR_THEME: process.env.NEXT_PUBLIC_COLOR_THEME || "default",
  CHAT_HISTORY_PAGE_SIZE: parseInt(process.env.ADMIN_CHAT_HISTORY_PAGE_SIZE || "50"),
  CHAT_HISTORY_EXPORTED_CSV_NAME: process.env.ADMIN_CHAT_HISTORY_EXPORTED_CSV_NAME || "NormNavi_ChatHistory",
};

export default constants;
