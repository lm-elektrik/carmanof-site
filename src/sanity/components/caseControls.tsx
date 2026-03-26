"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { BooleanInputProps } from "sanity";
import { set, useClient } from "sanity";

const SANITY_API_VERSION = "2026-03-25";

type CaseDocumentType = "videoCase" | "photoCase";
type CaseFieldName = "isFeatured" | "isPublished";

type LimitedCaseBooleanInputProps = BooleanInputProps & {
  documentType: CaseDocumentType;
  fieldName: CaseFieldName;
  limit: number;
  activeFilter: string;
  enabledDescription: string;
  limitReachedDescription: string;
};

function getDocumentIds(documentId?: string) {
  if (!documentId) {
    return {
      publishedId: "",
      draftId: "",
    };
  }

  const publishedId = documentId.replace(/^drafts\./, "");
  const draftId = `drafts.${publishedId}`;

  return { publishedId, draftId };
}

export function LimitedCaseBooleanInput(props: LimitedCaseBooleanInputProps) {
  const {
    value,
    onChange,
    readOnly,
    documentType,
    fieldName,
    limit,
    activeFilter,
    enabledDescription,
    limitReachedDescription,
  } = props;

  const client = useClient({ apiVersion: SANITY_API_VERSION });

  /**
   * В типах Sanity это поле часто не пробрасывается красиво,
   * поэтому берем его мягко через any.
   */
  const documentId = (props as { document?: { _id?: string } }).document?._id;

  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const { publishedId, draftId } = getDocumentIds(documentId);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      setIsLoadingCount(true);

      try {
        const count = await client.fetch<number>(
          `
            count(
              *[
                _type == $documentType &&
                ${activeFilter} &&
                _id != $publishedId &&
                _id != $draftId
              ]
            )
          `,
          {
            documentType,
            publishedId,
            draftId,
          },
        );

        if (isMounted) {
          setActiveCount(count);
        }
      } catch (error) {
        console.error("[LimitedCaseBooleanInput] count failed", {
          documentType,
          fieldName,
          error,
        });

        if (isMounted) {
          setActiveCount(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    }

    void loadCount();

    return () => {
      isMounted = false;
    };
  }, [activeFilter, client, documentType, draftId, fieldName, publishedId]);

  /**
   * Если текущее значение уже true, выключить его можно всегда.
   * Блокируем только новое включение сверх лимита.
   */
  const isCurrentValueEnabled = value === true;
  const limitReached =
    typeof activeCount === "number" &&
    activeCount >= limit &&
    !isCurrentValueEnabled;

  const isDisabled = Boolean(readOnly) || isLoadingCount || limitReached;

  const helperText = useMemo(() => {
    if (isLoadingCount) {
      return "Проверяем доступный лимит…";
    }

    if (limitReached) {
      return `${limitReachedDescription} Сейчас активно: ${activeCount}/${limit}.`;
    }

    if (typeof activeCount === "number") {
      return `${enabledDescription} Сейчас активно: ${activeCount}/${limit}.`;
    }

    return enabledDescription;
  }, [
    activeCount,
    enabledDescription,
    isLoadingCount,
    limit,
    limitReached,
    limitReachedDescription,
  ]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(set(event.currentTarget.checked));
  }

  return (
    <div
      style={{
        border: limitReached ? "1px solid #f59e0b" : "1px solid #d1d5db",
        borderRadius: 10,
        padding: 14,
        background: limitReached ? "#fff7ed" : "#ffffff",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {props.schemaType.title}
        </span>

        <input
          type="checkbox"
          checked={value === true}
          disabled={isDisabled}
          onChange={handleChange}
        />
      </label>

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.45,
          color: limitReached ? "#b45309" : "#6b7280",
        }}
      >
        {helperText}
      </div>
    </div>
  );
}
