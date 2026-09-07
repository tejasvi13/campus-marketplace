import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Field from "../components/Field.tsx";
import Notice from "../components/Notice.tsx";
import { createListing, getListing, updateListing } from "../api/listings.ts";
import { ITEM_IMAGES, imageUrl } from "../images.ts";
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  TRANSACTION_OPTIONS,
  ListingCategory,
  ListingCondition,
  TransactionType,
  isFreeType,
} from "../marketplace.ts";
import type { ListingDraft } from "../types.ts";

const emptyDraft: ListingDraft = {
  title: "",
  description: "",
  category: ListingCategory.Books,
  transactionType: TransactionType.Sell,
  condition: ListingCondition.Used,
  price: 0,
  rentUnit: "per week",
  image: "placeholder.svg",
};

const RENT_UNITS: string[] = ["per day", "per week", "per month", "per semester"];

export default function ListingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const editing: boolean = Boolean(id);

  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(editing);

  // When editing, fill the form with what is already saved.
  useEffect(() => {
    if (!id) return;

    getListing(id)
      .then((data) => {
        setDraft({
          title: data.listing.title,
          description: data.listing.description,
          category: data.listing.category,
          transactionType: data.listing.transactionType,
          condition: data.listing.condition,
          price: data.listing.price,
          rentUnit: data.listing.rentUnit || "per week",
          image: data.listing.image,
        });
      })
      .catch((failure: unknown) => {
        setError(failure instanceof Error ? failure.message : "Could not load that listing.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleText(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function handleSelect(event: ChangeEvent<HTMLSelectElement>): void {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function handlePrice(event: ChangeEvent<HTMLInputElement>): void {
    setDraft((current) => ({ ...current, price: Number(event.target.value) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = editing && id
        ? await updateListing(id, draft)
        : await createListing(draft);

      navigate("/listings/" + data.listing._id);
    } catch (failure: unknown) {
      setError(failure instanceof Error ? failure.message : "Could not save the listing.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  const free: boolean = isFreeType(draft.transactionType);
  const renting: boolean = draft.transactionType === TransactionType.Rent;

  return (
    <div className="page page--narrow">
      <div className="page__head">
        <h1 className="page-title">{editing ? "Edit your listing" : "Post an item"}</h1>
        <p className="page-sub">
          Say plainly what it is and what shape it is in. Nobody minds a scratch as long
          as they know about it first.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <Field
          label="What is it"
          name="title"
          value={draft.title}
          onChange={handleText}
          placeholder="Casio fx-991EX scientific calculator"
        />

        <div className="field">
          <label className="field__label" htmlFor="description">
            Description
          </label>
          <textarea
            className="field__input field__input--area"
            id="description"
            name="description"
            rows={4}
            value={draft.description}
            onChange={handleText}
            placeholder="Condition, what is included, where to collect it from"
          />
        </div>

        <div className="row">
          <div className="field">
            <label className="field__label" htmlFor="transactionType">
              People can
            </label>
            <select
              className="field__input"
              id="transactionType"
              name="transactionType"
              value={draft.transactionType}
              onChange={handleSelect}
            >
              {TRANSACTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="category">
              Category
            </label>
            <select
              className="field__input"
              id="category"
              name="category"
              value={draft.category}
              onChange={handleSelect}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label className="field__label" htmlFor="condition">
              Condition
            </label>
            <select
              className="field__input"
              id="condition"
              name="condition"
              value={draft.condition}
              onChange={handleSelect}
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {free ? (
            <div className="field">
              <span className="field__label">Price</span>
              <p className="field__static">
                {draft.transactionType === TransactionType.Donate
                  ? "Donations are free."
                  : "Borrowing is free."}
              </p>
            </div>
          ) : (
            <Field
              label={renting ? "Rate in rupees" : "Price in rupees"}
              name="price"
              type="number"
              value={String(draft.price)}
              onChange={handlePrice}
              placeholder="850"
            />
          )}
        </div>

        {renting ? (
          <div className="field">
            <label className="field__label" htmlFor="rentUnit">
              Charged
            </label>
            <select
              className="field__input"
              id="rentUnit"
              name="rentUnit"
              value={draft.rentUnit}
              onChange={handleSelect}
            >
              {RENT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="field">
          <span className="field__label">Picture</span>
          <p className="field__hint">
            Uploading your own photo comes later. Pick the drawing that looks closest.
          </p>
          <div className="picker">
            {ITEM_IMAGES.map((option) => (
              <button
                key={option.file}
                type="button"
                className={"picker__item" + (draft.image === option.file ? " picker__item--on" : "")}
                onClick={() => setDraft((current) => ({ ...current, image: option.file }))}
                aria-pressed={draft.image === option.file}
                title={option.label}
              >
                <img src={imageUrl(option.file)} alt={option.label} />
              </button>
            ))}
          </div>
        </div>

        <Notice tone="error">{error}</Notice>

        <div className="buttonrow">
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Saving\u2026" : editing ? "Save changes" : "Post it"}
          </button>
          <button
            type="button"
            className="button button--quiet"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
