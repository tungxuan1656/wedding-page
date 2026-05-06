'use client'

import { useEffect, useState } from 'react'

import type { RsvpFormData } from '@/lib/api'
import { getRsvp, submitRsvp } from '@/lib/api'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = {
  name?: string
  events?: string
}

type RsvpFormProps = {
  slug?: string
}

const COPY = {
  heading: 'Xác nhận tham dự',
  subheading: 'Vui lòng điền thông tin để chúng mình chuẩn bị đón tiếp bạn.',
  namePlaceholder: 'Nhập họ và tên...',
  nameLabel: 'Họ tên khách mời',
  eventDaiKhach: 'Tiệc đãi khách (08/06)',
  eventThanhHon: 'Lễ thành hôn (09/06)',
  submit: 'Gửi xác nhận tham dự',
  submitting: 'Đang gửi thông tin...',
  successTitle: 'Gửi thành công!',
  successMessage:
    'Cảm ơn bạn đã xác nhận. Chúng mình rất mong được đón tiếp bạn trong ngày vui sắp tới.',
  retryLabel: 'Thử lại ngay',
  errorPrefix: 'Lỗi:',
  nameRequired: 'Vui lòng nhập họ tên để chúng mình biết bạn là ai.',
  eventsRequired: 'Vui lòng chọn ít nhất một sự kiện bạn sẽ tham dự.',
} as const

const INITIAL_FORM: RsvpFormData = {
  name: '',
  eventDaiKhach: false,
  eventThanhHon: false,
}

function validate(form: RsvpFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim()) errors.name = COPY.nameRequired
  if (!form.eventDaiKhach && !form.eventThanhHon)
    errors.events = COPY.eventsRequired

  return errors
}

export function RsvpForm({ slug }: RsvpFormProps) {
  const [form, setForm] = useState<RsvpFormData>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [prefilling, setPrefilling] = useState(false)

  // Pre-fill form from last RSVP submission for this guest slug
  useEffect(() => {
    if (!slug) return

    let cancelled = false
    setPrefilling(true)

    getRsvp(slug)
      .then((res) => {
        if (cancelled) return
        if (res.status === 'success' && res.data) {
          setForm({
            name: res.data.name,
            eventDaiKhach: res.data.eventDaiKhach,
            eventThanhHon: res.data.eventThanhHon,
          })
        }
      })
      .catch(() => {
        // Silently ignore — form stays empty
      })
      .finally(() => {
        if (!cancelled) setPrefilling(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // clear field error on change
    if (name === 'name')
      setFieldErrors((prev) => ({ ...prev, name: undefined }))
    if (name === 'eventDaiKhach' || name === 'eventThanhHon')
      setFieldErrors((prev) => ({ ...prev, events: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)

      return
    }
    setSubmitState('submitting')

    const result = await submitRsvp(form, slug)
    if (result.status === 'success') {
      setSubmitState('success')
    } else {
      setErrorMessage(result.message ?? 'Gửi thất bại. Vui lòng thử lại.')
      setSubmitState('error')
    }
  }

  const handleRetry = () => {
    setSubmitState('idle')
    setErrorMessage('')
  }

  if (submitState === 'success') {
    return (
      <div
        aria-live='polite'
        className='flex flex-col items-center gap-6 py-8 text-center'
        role='status'>
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-cream text-4xl shadow-inner shadow-wine/5'>
          💌
        </div>
        <div className='space-y-2'>
          <p className='font-serif text-2xl font-medium text-wine'>
            {COPY.successTitle}
          </p>
          <p className='max-w-xs text-sm leading-relaxed text-text-secondary'>
            {COPY.successMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form noValidate className='flex flex-col gap-5' onSubmit={handleSubmit}>
      {/* Name field */}
      <div className='flex flex-col gap-2.5'>
        <label
          className='text-xs font-bold tracking-wider text-text-muted uppercase'
          htmlFor='rsvp-name'>
          {COPY.nameLabel}
          <span aria-hidden='true' className='ml-1 text-wine'>
            *
          </span>
        </label>
        <div className='relative'>
          <input
            aria-busy={prefilling}
            aria-describedby={fieldErrors.name ? 'rsvp-name-error' : undefined}
            aria-invalid={!!fieldErrors.name}
            autoComplete='name'
            className={[
              'w-full rounded-2xl border-2 px-5 py-4 text-sm font-medium text-text-primary transition-all outline-none',
              'placeholder:font-normal placeholder:text-text-muted/50',
              prefilling ? 'animate-pulse bg-beige/20' : '',
              fieldErrors.name
                ? 'border-red-100 bg-red-50/30 focus:border-red-200'
                : 'border-beige/40 bg-cream/20 focus:border-gold/50 focus:bg-white focus:shadow-xl focus:shadow-wine/5',
            ].join(' ')}
            id='rsvp-name'
            name='name'
            placeholder={prefilling ? 'Đang tải...' : COPY.namePlaceholder}
            type='text'
            value={form.name}
            onChange={handleChange}
          />
          {fieldErrors.name && (
            <p
              className='mt-2 text-[11px] font-medium text-red-600'
              id='rsvp-name-error'
              role='alert'>
              {fieldErrors.name}
            </p>
          )}
        </div>
      </div>

      {/* Event checkboxes */}
      <fieldset className='flex flex-col gap-4'>
        <legend className='mb-2 text-xs font-bold tracking-wider text-text-muted uppercase'>
          Sự kiện tham dự
          <span aria-hidden='true' className='ml-1 text-wine'>
            *
          </span>
        </legend>
        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-beige/30 bg-cream/10 p-4 transition-all hover:bg-cream/30 has-checked:border-gold/30 has-checked:bg-gold/5'>
            <div className='relative flex h-5 w-5 shrink-0 items-center justify-center'>
              <input
                checked={form.eventDaiKhach}
                className='peer sr-only'
                name='eventDaiKhach'
                type='checkbox'
                onChange={handleChange}
              />
              <div className='h-full w-full rounded border-2 border-beige transition-all peer-checked:border-gold peer-checked:bg-gold' />
              <svg
                className='absolute h-3.5 w-3.5 scale-0 text-white transition-transform peer-checked:scale-100'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                viewBox='0 0 24 24'>
                <path
                  d='M5 13l4 4L19 7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-semibold text-text-primary'>
                {COPY.eventDaiKhach}
              </span>
            </div>
          </label>

          <label className='relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-beige/30 bg-cream/10 p-4 transition-all hover:bg-cream/30 has-checked:border-gold/30 has-checked:bg-gold/5'>
            <div className='relative flex h-5 w-5 shrink-0 items-center justify-center'>
              <input
                checked={form.eventThanhHon}
                className='peer sr-only'
                name='eventThanhHon'
                type='checkbox'
                onChange={handleChange}
              />
              <div className='h-full w-full rounded border-2 border-beige transition-all peer-checked:border-gold peer-checked:bg-gold' />
              <svg
                className='absolute h-3.5 w-3.5 scale-0 text-white transition-transform peer-checked:scale-100'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                viewBox='0 0 24 24'>
                <path
                  d='M5 13l4 4L19 7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-semibold text-text-primary'>
                {COPY.eventThanhHon}
              </span>
            </div>
          </label>
        </div>
        {fieldErrors.events && (
          <p className='mt-1 text-[11px] font-medium text-red-600' role='alert'>
            {fieldErrors.events}
          </p>
        )}
      </fieldset>

      {/* Error banner */}
      {submitState === 'error' && (
        <div
          aria-live='assertive'
          className='flex flex-col gap-1 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm text-red-800'
          role='alert'>
          <p className='font-bold'>{COPY.errorPrefix}</p>
          <p className='text-xs opacity-80'>{errorMessage}</p>
          <button
            className='mt-2 w-fit text-[11px] font-bold tracking-wider text-red-700 uppercase underline underline-offset-4'
            type='button'
            onClick={handleRetry}>
            {COPY.retryLabel}
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        className={[
          'group relative overflow-hidden rounded-full px-4 py-3.5 text-sm font-bold tracking-widest uppercase transition-all duration-300 outline-none',
          'focus-visible:ring-2 focus-visible:ring-wine/20 focus-visible:ring-offset-2',
          submitState === 'submitting'
            ? 'cursor-not-allowed bg-wine/60 text-cream'
            : 'cursor-pointer bg-wine text-cream shadow-2xl shadow-wine/20 hover:-translate-y-0.5 hover:bg-wine-dark hover:shadow-wine/30 active:translate-y-0 active:scale-[0.98]',
        ].join(' ')}
        disabled={submitState === 'submitting'}
        type='submit'>
        <span className='relative z-10'>
          {submitState === 'submitting' ? COPY.submitting : COPY.submit}
        </span>
        {submitState !== 'submitting' && (
          <div className='absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />
        )}
      </button>
    </form>
  )
}
