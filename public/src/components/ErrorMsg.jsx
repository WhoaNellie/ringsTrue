import React from "react";

function ErrorMsg({ message, field }) {
  return (
    <label htmlFor={field}>
      <strong>{message}</strong>
    </label>
  );
}

export default ErrorMsg;
