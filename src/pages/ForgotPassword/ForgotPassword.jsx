import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm'
import React from 'react'


const ForgotPassword = () => {
  return (
     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <ForgotPasswordForm />
          </div>
        </div>
  )
}

export default ForgotPassword