'use client'

import { useState } from 'react'

import type { RsvpFormData } from '@/lib/api'
import { submitRsvp } from '@/lib/api'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = {
  name?: string
  events?: string
}

const COPY = {
  heading: 'Xác nhận tham dự',
  subheading: 'Vui lòng điền thông tin để chúng mình chuẩn bị đón tiếp bạn.',
  namePlaceholder: 'Họ và tên của bạn',
  nameLabel: 'Họ tên',
  eventDaiKhach: 'Đi ăn ngày 8/6 dương lịch (23/4 âm lịch Bính Ngọ)',
  eventThanhHon: 'Đi đưa đón dâu ngày 9/6 dương lịch (24/4 âm lịch)',
  submit: 'Gửi xác nhận',
  submitting: 'Đang gửi…',
  successTitle: 'Cảm ơn bạn!',
  successMessage:
    'Chúng mình đã nhận được xác nhận của bạn và rất mong được gặp bạn trong ngày vui.',
  retryLabel: 'Thử lại',
  errorPrefix: 'Đã xảy ra lỗi:',
  nameRequired: 'Vui lòng nhập họ tên.',
  eventsRequired: 'Vui lòng chọn ít nhất một sự kiện.',
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

export function RsvpForm() {
  const [form, setForm] = useState<RsvpFormData>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

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

    const result = await submitRsvp(form)
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
        className='flex flex-col items-center gap-4 py-4 text-center'
        role='status'>
        <span className='text-3xl'>💌</span>
        <p className='text-lg font-semibold text-wine'>{COPY.successTitle}</p>
        <p className='max-w-sm text-sm leading-6 text-text-secondary'>
          {COPY.successMessage}
        </p>
      </div>
    )
  }

  return (
    <form noValidate className='flex flex-col gap-6' onSubmit={handleSubmit}>
      {/* Name field */}
      <div className='flex flex-col gap-1.5'>
        <label
          className='text-sm font-medium text-text-primary'
          htmlFor='rsvp-name'>
          {COPY.nameLabel}
          <span aria-hidden='true' className='ml-0.5 text-wine'>
            *
          </span>
        </label>
        <input
          aria-describedby={fieldErrors.name ? 'rsvp-name-error' : undefined}
          aria-invalid={!!fieldErrors.name}
          autoComplete='name'
          className={[
            'rounded-xl border px-4 py-3 text-sm text-text-primary transition-colors outline-none',
            'placeholder:text-text-muted focus:border-wine focus:ring-2 focus:ring-wine/20',
            fieldErrors.name
              ? 'border-red-400 bg-red-50'
              : 'border-beige bg-white',
          ].join(' ')}
          id='rsvp-name'
          name='name'
          placeholder={COPY.namePlaceholder}
          type='text'
          value={form.name}
          onChange={handleChange}
        />
        {fieldErrors.name && (
          <p className='text-xs text-red-600' id='rsvp-name-error' role='alert'>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Event checkboxes */}
      <fieldset className='flex flex-col gap-3'>
        <legend className='text-sm font-medium text-text-primary'>
          Sự kiện tham dự
          <span aria-hidden='true' className='ml-0.5 text-wine'>
            *
          </span>
        </legend>
        <label className='flex cursor-pointer items-start gap-3'>
          <input
            checked={form.eventDaiKhach}
            className='mt-0.5 h-4 w-4 cursor-pointer accent-wine'
            name='eventDaiKhach'
            type='checkbox'
            onChange={handleChange}
          />
          <span className='text-sm leading-6 text-text-primary'>
            {COPY.eventDaiKhach}
          </span>
        </label>
        <label className='flex cursor-pointer items-start gap-3'>
          <input
            checked={form.eventThanhHon}
            className='mt-0.5 h-4 w-4 cursor-pointer accent-wine'
            name='eventThanhHon'
            type='checkbox'
            onChange={handleChange}
          />
          <span className='text-sm leading-6 text-text-primary'>
            {COPY.eventThanhHon}
          </span>
        </label>
        {fieldErrors.events && (
          <p className='text-xs text-red-600' role='alert'>
            {fieldErrors.events}
          </p>
        )}
      </fieldset>

      {/* Error banner */}
      {submitState === 'error' && (
        <div
          aria-live='assertive'
          className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
          role='alert'>
          <p>
            {COPY.errorPrefix} {errorMessage}
          </p>
          <button
            className='mt-2 text-xs font-semibold underline underline-offset-2'
            type='button'
            onClick={handleRetry}>
            {COPY.retryLabel}
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        className={[
          'rounded-xl px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine',
          submitState === 'submitting'
            ? 'cursor-not-allowed bg-wine/50 text-cream'
            : 'cursor-pointer bg-wine text-cream hover:bg-wine-dark active:scale-[0.98]',
        ].join(' ')}
        disabled={submitState === 'submitting'}
        type='submit'>
        {submitState === 'submitting' ? COPY.submitting : COPY.submit}
      </button>
    </form>
  )
}
