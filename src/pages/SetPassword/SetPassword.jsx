import React from "react";
import ChangePasswordForm from "../../components/Auth/ChangePasswordForm";

const SetPassword = () => (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
      <ChangePasswordForm mode="set" />
    </div>
  </div>
);

export default SetPassword;
