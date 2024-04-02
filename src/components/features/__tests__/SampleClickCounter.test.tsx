// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

// import SampleClickCounter from "../SampleClickCounter";

// describe("サンプルクリックカウンタ", () => {
//   test("Count: 0 の状態から1回クリックすると、Count: 1 になること", async () => {
//     render(<SampleClickCounter />);
//     const countTextElement = screen.getByTestId("count-text");
//     expect(countTextElement).toHaveTextContent("Count: 0");
//     const button = screen.getByText("Increment");
//     await userEvent.click(button);
//     expect(countTextElement).toHaveTextContent("Count: 1");
//   });

//   test("Count: 0 の状態から3回クリックすると、Count: 3 になること", async () => {
//     render(<SampleClickCounter />);
//     const countTextElement = screen.getByTestId("count-text");
//     expect(countTextElement).toHaveTextContent("Count: 0");
//     const button = screen.getByText("Increment");
//     await userEvent.click(button);
//     await userEvent.click(button);
//     await userEvent.click(button);
//     expect(countTextElement).toHaveTextContent("Count: 3");
//   });
// });
