import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import {
  type HTMLAttributes,
  type HTMLInputTypeAttribute,
  useEffect,
  useRef,
} from 'react'
import { type Control, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import {
  StickyActionBar,
  stickyActionBarInset,
} from '@/components/navigation/sticky-action-bar'
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
  type?: HTMLInputTypeAttribute
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
  type = 'text',
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
              type={type}
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

const formId = 'solicitar-gestor-form'

// tela de solicitação de gestão
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

  // the button no longer sits next to the message, so bring it into view or a
  // failed submit looks like nothing happened. an effect, not an inline ref:
  // a ref callback re-runs on every render and would scroll on each keystroke
  const rootError = form.formState.errors.root?.message
  const submitCount = form.formState.submitCount
  const rootErrorRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (rootError) rootErrorRef.current?.scrollIntoView({ block: 'center' })
  }, [rootError, submitCount])

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
      // the route hides the bottom nav, so this state needs its own way out
      <div className={cn('mx-auto max-w-2xl', stickyActionBarInset)}>
        <Card className="items-center gap-4 p-6 text-center md:p-8">
          <CheckCircle2 className="text-success size-10" aria-hidden />
          <div className="space-y-1">
            <h1 className="text-tg-brand-text text-xl font-bold">
              Solicitação recebida
            </h1>
            <p className="text-muted-foreground">
              {createRequest.data.message}
            </p>
          </div>
        </Card>
        <StickyActionBar label="Ação da página">
          <Button
            asChild
            variant="brand"
            className="min-h-touch-comfortable w-full"
          >
            <Link to="/app">Voltar para o início</Link>
          </Button>
        </StickyActionBar>
      </div>
    )
  }

  const isSubmitting = createRequest.isPending

  return (
    <div
      className={cn(
        'mx-auto flex max-w-2xl flex-col gap-6',
        stickyActionBarInset,
      )}
    >
      <header>
        <h1 className="text-tg-brand-text text-2xl font-bold md:text-3xl">
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
            id={formId}
            aria-label="Formulário de solicitação de gestão"
          >
            {/* type=tel + inputMode=numeric: numeric keypad confirmed on a real
            device; autoComplete=off because documents have no standard token */}
            <TextField
              control={form.control}
              name="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              type="tel"
              autoComplete="off"
              inputMode="numeric"
              format={formatCpf}
            />
            <TextField
              control={form.control}
              name="cnpj"
              label="CNPJ (opcional)"
              placeholder="00.000.000/0000-00"
              type="tel"
              autoComplete="off"
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
              type="tel"
              autoComplete="off"
              inputMode="numeric"
              format={formatCourtQuantity}
            />
            <TextField
              control={form.control}
              name="zipCode"
              label="CEP"
              placeholder="00000-000"
              type="tel"
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
              autoComplete="address-level3"
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
                ref={rootErrorRef}
                className="text-destructive text-sm sm:col-span-2"
              >
                {form.formState.errors.root.message}
              </p>
            ) : null}
          </form>
        </Form>
      </Card>

      <StickyActionBar label="Enviar solicitação">
        <Button
          type="submit"
          variant="brand"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          form={formId}
          className="min-h-touch-comfortable w-full"
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
      </StickyActionBar>
    </div>
  )
}
