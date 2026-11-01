import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { type Control, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateManagerRequest } from '@/lib/api/queries'
import { getApiErrorMessage, isForbiddenError } from '@/lib/errors'
import { formatCep, formatCnpj, formatCpf } from '@/lib/forms/document-masks'
import {
  type ManagerRequestInput,
  managerRequestSchema,
  toManagerRequestBody,
} from '@/lib/schemas/manager-request-schema'
import { cn } from '@/lib/utils'

function formatCourtQuantity(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 4)
}

function formatState(raw: string): string {
  return raw
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 2)
    .toUpperCase()
}

type TextFieldProps = {
  control: Control<ManagerRequestInput>
  name: keyof ManagerRequestInput
  label: string
  placeholder?: string
  autoComplete?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  format?: (raw: string) => string
  className?: string
}

function TextField({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  inputMode,
  format,
  className,
}: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('min-w-0', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              {...field}
              onChange={(event) =>
                field.onChange(
                  format ? format(event.target.value) : event.target.value,
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// tela de solicitação de gestão — o usuário comum pede, o administrador analisa
export function SolicitarGestor() {
  const createRequest = useCreateManagerRequest()

  const form = useForm<ManagerRequestInput>({
    resolver: zodResolver(managerRequestSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      cpf: '',
      cnpj: '',
      companyName: '',
      courtQuantity: '',
      street: '',
      neighborhood: '',
      zipCode: '',
      city: '',
      state: '',
    },
  })

  function onSubmit(input: ManagerRequestInput) {
    createRequest.mutate(toManagerRequestBody(input), {
      onSuccess: () => {
        toast.success('Solicitação enviada')
      },
      onError: (error) => {
        // o modal global de 403 já informou
        if (isForbiddenError(error)) return
        form.setError('root', {
          message: getApiErrorMessage(
            error,
            'Não foi possível enviar a solicitação',
          ),
        })
      },
    })
  }

  if (createRequest.isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl items-center gap-4 p-6 text-center md:p-8">
        <CheckCircle2 className="text-success size-10" aria-hidden />
        <div className="space-y-1">
          <h1 className="text-tg-brand-blue text-xl font-bold">
            Solicitação recebida
          </h1>
          <p className="text-muted-foreground">{createRequest.data.message}</p>
        </div>
        <Button asChild variant="brandOutline">
          <Link to="/app">Voltar para o início</Link>
        </Button>
      </Card>
    )
  }

  const isSubmitting = createRequest.isPending

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
          Solicitar gestão de arena
        </h1>
        <p className="text-muted-foreground">
          Envie os dados da sua arena para a análise dos administradores.
        </p>
      </header>

      <Card className="p-5 md:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            aria-label="Formulário de solicitação de gestão"
          >
            <TextField
              control={form.control}
              name="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              inputMode="numeric"
              format={formatCpf}
            />
            <TextField
              control={form.control}
              name="cnpj"
              label="CNPJ (opcional)"
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              format={formatCnpj}
            />
            <TextField
              control={form.control}
              name="companyName"
              label="Razão social"
              autoComplete="organization"
              className="sm:col-span-2"
            />
            <TextField
              control={form.control}
              name="courtQuantity"
              label="Quantidade de quadras"
              inputMode="numeric"
              format={formatCourtQuantity}
            />
            <TextField
              control={form.control}
              name="zipCode"
              label="CEP"
              placeholder="00000-000"
              autoComplete="postal-code"
              inputMode="numeric"
              format={formatCep}
            />
            <TextField
              control={form.control}
              name="street"
              label="Rua"
              autoComplete="address-line1"
              className="sm:col-span-2"
            />
            <TextField
              control={form.control}
              name="neighborhood"
              label="Bairro"
              className="sm:col-span-2"
            />
            <TextField
              control={form.control}
              name="city"
              label="Cidade"
              autoComplete="address-level2"
            />
            <TextField
              control={form.control}
              name="state"
              label="UF"
              placeholder="CE"
              autoComplete="address-level1"
              format={formatState}
            />

            {form.formState.errors.root?.message ? (
              <p
                role="alert"
                className="text-destructive text-sm sm:col-span-2"
              >
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full sm:col-span-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                'Enviar solicitação'
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
