import { ParameterDeclaration } from "ts-morph";
import { Locatable } from "../../models/locatable";
import { BodyNode } from "../../models/nodes";
import { ensureNodeNotOptional } from "../utilities/parser-utility";
import { parseTypeNode } from "../utilities/type-parser";

/**
 * Parse an `@body` decorated parameter.
 *
 * @param parameter a parameter declaration
 */
export function parseBody(
  parameter: ParameterDeclaration
): Locatable<BodyNode> {
  const decorator = parameter.getDecoratorOrThrow("body");
  ensureNodeNotOptional(parameter);
  const dataType = parseTypeNode(parameter.getTypeNodeOrThrow());
  const location = decorator.getSourceFile().getFilePath();
  const line = decorator.getStartLineNumber();
  return {
    value: {
      // TODO: how to extract description from parameter declaration?
      description: undefined,
      type: dataType
    },
    location,
    line
  };
}
