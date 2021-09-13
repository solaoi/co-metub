import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Text } from "@chakra-ui/layout"
import { Select } from "@chakra-ui/select"
import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>

  options: { value: any; label: string }[]
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ name, label, outerProps, options, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: props.type === "number" ? Number : undefined,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    // Hay que quitar size porque da problema de compatibilidad de tipos
    const { size, ...extraProps } = props

    const hasError = touched && normalizedError

    return (
      <FormControl {...outerProps}>
        <FormLabel>
          {label}
          {hasError && (
            <Text as="span" ml="2px" fontSize="sm" fontWeight="normal" color="red.500">
              {" "}
              - {normalizedError}
            </Text>
          )}
        </FormLabel>
        <Select
          {...(input as any)}
          disabled={submitting}
          {...extraProps}
          ref={ref as any}
          borderColor={hasError ? "red.500" : "gray.200"}
        >
          {options.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </Select>
      </FormControl>
    )
  }
)

export default LabeledSelectField
