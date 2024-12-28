import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import '../assets/expenses.css'

const Expenses = () => {
  const form = useForm({
    defaultValues: {
      fullName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div>
            <form.Field
              name="fullName"
              children={(field) => (
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  )
}

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})
