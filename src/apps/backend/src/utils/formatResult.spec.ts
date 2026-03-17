import formatResult, { FormatResult } from "./formatResult";

interface TestData {
  foo: string;
  bar: number;
}

describe("formatResult", () => {
  it("returns a successful result when no error is provided", () => {
    const data: TestData = { foo: "hello", bar: 42 };

    const result = formatResult(data);

    // Type check via explicit annotation
    const typedResult: FormatResult<TestData> = result;

    expect(typedResult.success).toBe(true);
    expect(typedResult.data).toEqual(data);
    expect(typedResult.error).toBeUndefined();
  });

  it("returns an error result when error is provided", () => {
    const data: TestData = { foo: "world", bar: 7 };
    const errorMessage = "Something went wrong";

    const result = formatResult(data, errorMessage);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(data);
    expect(result.error).toBe(errorMessage);
  });
});
