import React, { FormEvent, useEffect } from "react";

export default function EditCustomer() {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div>
      <h2>Edit details</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input type="text" id="firstName" />
      </form>
    </div>
  );
}
