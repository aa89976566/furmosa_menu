"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import styles from "@/app/home.module.css";

export function EnquiryForm() {
  const [opened, setOpened] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const shop = String(data.get("shop") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const body = [`Name: ${name}`, `Shop: ${shop}`, `Email: ${email}`, "", message].join(
      "\n",
    );
    const href = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent(
      site.stockists.subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setOpened(true);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        <span>{site.stockists.fields.name}</span>
        <input name="name" type="text" autoComplete="name" />
      </label>
      <label>
        <span>{site.stockists.fields.shop}</span>
        <input name="shop" type="text" autoComplete="organization" />
      </label>
      <label>
        <span>{site.stockists.fields.email}</span>
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        <span>{site.stockists.fields.message}</span>
        <textarea name="message" rows={5} />
      </label>
      <button type="submit">{site.stockists.submitLabel}</button>
      <p className={styles.formNote}>{site.stockists.note}</p>
      {opened ? (
        <p className={styles.formStatus} role="status">
          {site.stockists.opened}
        </p>
      ) : null}
    </form>
  );
}
