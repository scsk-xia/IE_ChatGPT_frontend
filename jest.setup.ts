//https://github.com/aws-amplify/amplify-ui/blob/main/packages/react/jest.setup.ts
import "@testing-library/jest-dom/extend-expect";

/**
 * This is a workaround to the problem of the jsdom library not supporting
 * URL.createObjectURL. See https://github.com/jsdom/jsdom/issues/1721.
 */
if (typeof window.URL.createObjectURL === "undefined") {
  window.URL.createObjectURL = jest.fn();
}
