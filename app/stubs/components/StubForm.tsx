import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextAreaField } from "app/core/components/LabeledTextAreaField"
import { LabeledSelectField } from "app/core/components/LabeledSelectField"
import { useRouterQuery } from "blitz"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import Card from "../../core/layouts/Card"
import { border } from "@chakra-ui/styled-system"

export function StubForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const query = useRouterQuery()
  const initValues = { ...props.initialValues, projectId: Number(query.projectId) }

  return (
    <Form<S> {...props} initialValues={initValues}>
      <LabeledTextField name="path" label="Path" placeholder="/foo" />
      <LabeledSelectField
        name="method"
        label="Method"
        placeholder="Select Method..."
        options={[
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "PATCH", label: "PATCH" },
          { value: "DELETE", label: "DELETE" },
          { value: "OPTIONS", label: "OPTIONS" },
        ]}
      />
      <LabeledSelectField
        name="contentType"
        label="ContentType"
        placeholder="Select ContentType..."
        options={[
          { value: "application/json", label: "application/json" },
          { value: "application/xml", label: "application/xml" },
          { value: "text/plain", label: "text/plain" },
          { value: "text/json", label: "text/json" },
          { value: "text/html", label: "text/html" },
          { value: "text/javascript", label: "text/javascript" },
          { value: "text/css", label: "text/css" },
          { value: "text/csv", label: "text/csv" },
          { value: "text/tab-separated-values", label: "text/tab-separated-values" },
        ]}
      />
      <LabeledTextField name="statusCode" label="StatusCode" placeholder="200" />
      <LabeledTextAreaField name="response" label="Response" placeholder="Response" />
      <LabeledTextAreaField name="memo" label="Memo" placeholder="Any additional comments" />
      <Card heading="Optional" bgColor="#E2E8F0">
        <LabeledTextField
          type="number"
          name="sleep"
          label="Sleep(seconds)"
          placeholder="0"
          style={{ borderColor: "#FFF" }}
        />
        <LabeledTextField
          type="number"
          name="ntimesError"
          label="NtimesError"
          placeholder="0"
          style={{ borderColor: "#FFF" }}
        />
        <LabeledTextField
          name="ntimesErrorStatusCode"
          label="NtimesErrorStatusCode"
          placeholder="500"
          style={{ borderColor: "#FFF" }}
        />
      </Card>
    </Form>
  )
}
