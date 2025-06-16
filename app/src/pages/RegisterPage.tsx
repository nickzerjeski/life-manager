import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import supabase from '../../supabase'

interface Props {
  onShowLogin: () => void
}

export default function RegisterPage({ onShowLogin }: Props) {
  const form = useForm({ defaultValues: { name: '', email: '', password: '', confirm: '' } })
  const [error, setError] = useState<string | null>(null)

  function valid(pw: string) {
    return pw.length >= 8 && /\d/.test(pw)
  }

  async function onSubmit(values: { name: string; email: string; password: string; confirm: string }) {
    setError(null)
    if (values.password !== values.confirm) {
      setError('Passwords do not match')
      return
    }
    if (!valid(values.password)) {
      setError('Password must be at least 8 characters and include a number')
      return
    }
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { name: values.name }
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Name required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: 'Email required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: 'Password required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              rules={{ required: 'Confirm your password' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
        <p className="text-sm">
          Already have an account?{' '}
          <button onClick={onShowLogin} className="text-blue-600 hover:underline" type="button">
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
