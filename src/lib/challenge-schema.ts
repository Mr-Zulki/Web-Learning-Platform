import { z } from "zod";

export const elementExistsRuleSchema = z
  .object({
    type: z.literal("element-exists"),
    selector: z.string().min(1, "selector is required"),
    min: z.number().int().positive().default(1),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const elementCountRuleSchema = z
  .object({
    type: z.literal("element-count"),
    selector: z.string().min(1, "selector is required"),
    min: z.number().int().nonnegative().optional(),
    max: z.number().int().positive().optional(),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const textContainsRuleSchema = z
  .object({
    type: z.literal("text-contains"),
    selector: z.string().min(1, "selector is required"),
    text: z.string().min(1, "text is required"),
    caseSensitive: z.boolean().default(false),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const attributeEqualsRuleSchema = z
  .object({
    type: z.literal("attribute-equals"),
    selector: z.string().min(1, "selector is required"),
    attribute: z.string().min(1, "attribute is required"),
    value: z.string(),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const attributeExistsRuleSchema = z
  .object({
    type: z.literal("attribute-exists"),
    selector: z.string().min(1, "selector is required"),
    attribute: z.string().min(1, "attribute is required"),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const cssPropertyRuleSchema = z
  .object({
    type: z.literal("css-property"),
    selector: z.string().min(1, "selector is required"),
    property: z.string().min(1, "property is required"),
    value: z.string().min(1, "value is required"),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const childOfRuleSchema = z
  .object({
    type: z.literal("child-of"),
    selector: z.string().min(1, "selector is required"),
    parent: z.string().min(1, "parent is required"),
    message: z.string().min(1, "message is required"),
  })
  .strict();

export const ruleSchema = z.discriminatedUnion("type", [
  elementExistsRuleSchema,
  elementCountRuleSchema,
  textContainsRuleSchema,
  attributeEqualsRuleSchema,
  attributeExistsRuleSchema,
  cssPropertyRuleSchema,
  childOfRuleSchema,
]);

export const challengeSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^challenge-[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "id must start with 'challenge-' followed by kebab-case lesson id"
      ),
    lessonId: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "lessonId must be in kebab-case format"
      ),
    title: z.string().min(1, "title is required"),
    task: z.string().min(1, "task is required"),
    hints: z
      .array(z.string().min(1, "hint cannot be empty"))
      .min(1, "at least 1 hint is required")
      .max(3, "at most 3 hints are allowed"),
    rules: z.array(ruleSchema).min(2, "at least 2 rules are required"),
  })
  .strict();

export type Rule = z.infer<typeof ruleSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
