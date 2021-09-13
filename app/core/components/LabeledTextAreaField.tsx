import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useField } from "react-final-form"

import { Textarea } from "@chakra-ui/textarea"
import { FormControl, FormLabel } from "@chakra-ui/form-control"

export interface LabeledTextAreaFieldProps extends ComponentPropsWithoutRef<typeof Textarea> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextAreaField = forwardRef<HTMLInputElement, LabeledTextAreaFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: props.type === "number" ? Number : undefined,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <FormControl {...outerProps}>
        <FormLabel>
          {label}
          <Textarea {...input} disabled={submitting} {...props} ref={ref as any} />
        </FormLabel>
        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </FormControl>
    )
  }
)

export default LabeledTextAreaField
