import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import supabase from '../../supabase'

interface Props {
  onShowRegister: () => void
}

export default function LoginPage({ onShowRegister }: Props) {
  const form = useForm({ defaultValues: { email: '', password: '' } })
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(values: { email: string; password: string }) {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) setError(error.message)
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
        <Button onClick={signInWithGoogle} type="button" className="w-full">
          Sign in with Google
        </Button>
        <p className="text-sm">
          Don't have an account?{' '}
          <button onClick={onShowRegister} className="text-blue-600 hover:underline" type="button">
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
