"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatPhone } from "@/lib/formatPhone";
import {
  trackFormSubmit,
  trackFormSuccess,
  trackMessengerClick,
  trackPhoneClick,
} from "@/lib/analytics";
import Section from "@/components/ui/Section/Section";
import styles from "./Contact.module.scss";

type ContactSettings = {
  phone?: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  vk?: string;
};

type ContactProps = {
  settings?: ContactSettings | null;
};

type MessengerItem = {
  name: "Telegram" | "WhatsApp" | "VK";
  href?: string;
  icon: string;
};

function isPhoneObviouslyFake(phoneDigits: string) {
  if (phoneDigits.length !== 10) return true;

  if (/^(\d)\1{9}$/.test(phoneDigits)) return true;

  if (phoneDigits.startsWith("0")) return true;

  if (
    phoneDigits === "1234567890" ||
    phoneDigits === "0123456789" ||
    phoneDigits === "9876543210"
  ) {
    return true;
  }

  return false;
}

function normalizePhoneInput(rawValue: string) {
  const digitsOnly = rawValue.replace(/\D/g, "");

  if (
    digitsOnly.length === 11 &&
    (digitsOnly.startsWith("7") || digitsOnly.startsWith("8"))
  ) {
    return digitsOnly.slice(1);
  }

  if (digitsOnly.length > 10) {
    return digitsOnly.slice(-10);
  }

  return digitsOnly;
}

function formatPhoneDigits(phoneDigits: string) {
  const part1 = phoneDigits.slice(0, 3);
  const part2 = phoneDigits.slice(3, 6);
  const part3 = phoneDigits.slice(6, 8);
  const part4 = phoneDigits.slice(8, 10);

  return [part1, part2, part3, part4].filter(Boolean).join(" ");
}

function getMessengerKey(name: MessengerItem["name"]) {
  switch (name) {
    case "Telegram":
      return "telegram";
    case "WhatsApp":
      return "whatsapp";
    case "VK":
      return "vk";
  }
}

export default function Contact({ settings }: ContactProps) {
  const [phoneDigits, setPhoneDigits] = useState("");
  const [name, setName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isSuccess) return;

    const timerId = window.setTimeout(() => {
      setIsSuccess(false);
    }, 2500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isSuccess]);

  const messengerItems = useMemo<MessengerItem[]>(() => {
    return [
      {
        name: "Telegram",
        href: settings?.telegram,
        icon: "/icons/contact/tg.svg",
      },
      {
        name: "WhatsApp",
        href: settings?.whatsapp,
        icon: "/icons/contact/wa.svg",
      },
      {
        name: "VK",
        href: settings?.vk,
        icon: "/icons/contact/vk.svg",
      },
    ];
  }, [settings]);

  const isPhoneValid = useMemo(() => {
    return phoneDigits.length === 10 && !isPhoneObviouslyFake(phoneDigits);
  }, [phoneDigits]);

  const isFormValid = isPhoneValid && isChecked && !isSubmitting;

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const normalizedDigits = normalizePhoneInput(event.target.value);
    setPhoneDigits(normalizedDigits);

    if (submitError) {
      setSubmitError("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPhoneValid || !isChecked || isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const honey = String(formData.get("company") || "").trim();

    setSubmitError("");
    setIsSubmitting(true);

    trackFormSubmit("contact_form");

    try {
      const fullPhone = `+7${phoneDigits}`;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: fullPhone,
          consentAccepted: true,
          source: window.location.pathname,
          company: honey,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Не удалось отправить заявку.");
      }

      setName("");
      setPhoneDigits("");
      setIsChecked(false);
      setIsSuccess(true);

      trackFormSuccess("contact_form");
    } catch {
      setSubmitError(
        "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePhoneClick() {
    trackPhoneClick(settings?.phone);
  }

  function handleMessengerClick(name: MessengerItem["name"]) {
    trackMessengerClick(getMessengerKey(name));
  }

  return (
    <Section id="contact" aria-labelledby="contact-title">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 id="contact-title" className={styles.title}>
              Оставьте номер телефона или свяжитесь с нами в удобном
              мессенджере.
            </h2>
          </div>

          <div className={styles.bottom}>
            <div className={styles.leftArea}>
              <div className={styles.brandArea}>
                <Image
                  src="/icons/contact/cta-logo.svg"
                  alt="Логотип Карманов"
                  width={220}
                  height={72}
                  className={styles.brandLogo}
                  priority={false}
                />
              </div>

              <div className={styles.formArea}>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <label
                    className={styles.visuallyHidden}
                    htmlFor="contact-name"
                  >
                    Ваше имя
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Ваше имя"
                    className={styles.input}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isSubmitting}
                    maxLength={80}
                  />

                  <label
                    className={styles.visuallyHidden}
                    htmlFor="contact-phone"
                  >
                    Номер телефона
                  </label>

                  <div
                    className={`${styles.phoneField} ${
                      isSuccess ? styles.phoneFieldSuccess : ""
                    }`}
                  >
                    <span className={styles.phonePrefix}>+7&nbsp;</span>

                    {isSuccess ? (
                      <span className={styles.phoneSuccessMessage}>
                        ✓ Ваша заявка принята
                      </span>
                    ) : (
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="999 123 45 67"
                        className={`${styles.input} ${styles.phoneInput}`}
                        value={formatPhoneDigits(phoneDigits)}
                        onChange={handlePhoneChange}
                        aria-invalid={phoneDigits.length > 0 && !isPhoneValid}
                        disabled={isSubmitting}
                      />
                    )}
                  </div>

                  <label
                    className={styles.visuallyHidden}
                    htmlFor="contact-company"
                  >
                    Компания
                  </label>

                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className={styles.visuallyHidden}
                    aria-hidden="true"
                    disabled={isSubmitting}
                  />

                  <button
                    type="submit"
                    className={styles.button}
                    disabled={!isFormValid}
                  >
                    {isSubmitting ? "Отправка..." : "Отправить"}
                  </button>
                </form>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      setIsChecked(event.target.checked);

                      if (submitError) {
                        setSubmitError("");
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <span>Даю согласие на обработку персональных данных</span>
                </label>

                {submitError ? (
                  <p className={styles.formNote} role="alert">
                    {submitError}
                  </p>
                ) : (
                  <p className={styles.formNote}>
                    Ответим в рабочее время и подскажем лучший вариант.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.rightArea}>
              <div className={styles.workInfo}>
                <p className={styles.workLabel}>Режим работы</p>
                <p className={styles.workValue}>Пн – Сб</p>
                <p className={styles.workValue}>10:00–19:00</p>

                {settings?.phone ? (
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                    className={styles.workPhone}
                    onClick={handlePhoneClick}
                  >
                    {formatPhone(settings.phone)}
                  </a>
                ) : null}
              </div>

              <div className={styles.messengers}>
                {messengerItems.map((item) =>
                  item.href ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className={styles.messengerLink}
                      aria-label={item.name}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleMessengerClick(item.name)}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={48}
                        height={48}
                        className={styles.messengerIcon}
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <span
                      key={item.name}
                      className={`${styles.messengerLink} ${styles.messengerLinkDisabled}`}
                      aria-label={`${item.name} недоступен`}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={48}
                        height={48}
                        className={styles.messengerIcon}
                        aria-hidden="true"
                      />
                    </span>
                  ),
                )}
              </div>

              <div className={styles.qrArea}>
                <div className={styles.qrMain}>
                  <div className={styles.qrBox}>
                    <Image
                      src="/icons/contact/QR-Max.webp"
                      alt="QR-код для быстрого перехода"
                      width={160}
                      height={160}
                      className={styles.qrImage}
                    />
                  </div>
                </div>

                <p className={styles.qrText}>Быстрый переход в мессенджер</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
