import { createProjectFromExistingSourceFile } from "../../spec-helpers/helper";
import { OptionalNotAllowedError } from "../errors";
import { LociTable } from "../locations";
import { TypeKind, TypeTable } from "../types";
import { parsePathParams } from "./path-params-parser";

describe("path params parser", () => {
  const exampleFile = createProjectFromExistingSourceFile(
    `${__dirname}/__spec-examples__/path-params.ts`
  ).file;
  const method = exampleFile
    .getClassOrThrow("PathParamsClass")
    .getMethodOrThrow("pathParamsMethod");

  let typeTable: TypeTable;
  let lociTable: LociTable;

  beforeEach(() => {
    typeTable = new TypeTable();
    lociTable = new LociTable();
  });

  test("parses @pathParams decorated object parameter", () => {
    const result = parsePathParams(
      method.getParameterOrThrow("pathParams"),
      typeTable,
      lociTable
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toStrictEqual({
      description: undefined,
      name: "property",
      type: {
        kind: TypeKind.STRING
      }
    });
    expect(result[1]).toStrictEqual({
      description: "property description",
      name: "property-with-description",
      type: {
        kind: TypeKind.STRING
      }
    });
  });

  test("fails to parse @pathParams decorated object parameter with optional param", () => {
    expect(() =>
      parsePathParams(
        method.getParameterOrThrow("pathParamsWithOptionalProperty"),
        typeTable,
        lociTable
      )
    ).toThrowError(OptionalNotAllowedError);
  });

  test("fails to parse @pathParams decorated non-object parameter", () => {
    expect(() =>
      parsePathParams(
        method.getParameterOrThrow("nonObjectPathParams"),
        typeTable,
        lociTable
      )
    ).toThrowError("expected parameter value to be an type literal object");
  });

  test("fails to parse optional @pathParams decorated parameter", () => {
    expect(() =>
      parsePathParams(
        method.getParameterOrThrow("optionalPathParams"),
        typeTable,
        lociTable
      )
    ).toThrowError(OptionalNotAllowedError);
  });

  test("fails to parse non-@pathParams decorated parameter", () => {
    expect(() =>
      parsePathParams(
        method.getParameterOrThrow("notPathParams"),
        typeTable,
        lociTable
      )
    ).toThrowError("Expected to find decorator named 'pathParams'");
  });
});
