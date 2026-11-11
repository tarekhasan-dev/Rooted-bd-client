
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./create-event.css";

const CATEGORIES = [
  "Community Tree Plantation",
  "Tree Care & Maintenance",
  "School & Campus Plantation",
  "Tree Plantation Awareness",
];

type EventForm = {
  title: string;
  category: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  maxParticipants: string;
  registrationDeadline: string;
  feeType: "free" | "paid";
  feeAmount: string;
};

const INITIAL_FORM: EventForm = {
  title: "",
  category: CATEGORIES[0],
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  address: "",
  maxParticipants: "",
  registrationDeadline: "",
  feeType: "free",
  feeAmount: "",
};

function TreeIllustration() {
  return (
    <svg
      className="evc-tree-illustration"
      viewBox="0 0 520 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="People planting a tree illustration"
      role="img"
    >
      <ellipse cx="264" cy="348" rx="205" ry="20" fill="#DDEBD1" />

      <path
        d="M265 320V148"
        stroke="#986A3C"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M264 215L218 174M264 188L306 145"
        stroke="#986A3C"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <circle cx="264" cy="105" r="68" fill="#79B66B" />
      <circle cx="212" cy="130" r="48" fill="#91C67B" />
      <circle cx="312" cy="131" r="48" fill="#69A85D" />
      <circle cx="235" cy="67" r="43" fill="#A3CE87" />
      <circle cx="296" cy="61" r="43" fill="#80B96B" />

      <path
        d="M78 334C105 302 142 300 171 319"
        stroke="#6C9E58"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M365 327C397 296 435 300 456 320"
        stroke="#6C9E58"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <circle cx="130" cy="232" r="18" fill="#E7A36B" />
      <path d="M111 228C111 206 148 202 150 227" fill="#294C3D" />
      <path
        d="M109 254L151 254L164 315H97L109 254Z"
        fill="#E2A15F"
      />
      <path
        d="M113 315L106 344M149 315L158 344"
        stroke="#294C3D"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M108 270L77 295"
        stroke="#E7A36B"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <circle cx="387" cy="239" r="17" fill="#C98759" />
      <path d="M370 235C370 212 403 209 406 235" fill="#294C3D" />
      <path
        d="M366 258L407 258L419 315H354L366 258Z"
        fill="#5C9D79"
      />
      <path
        d="M370 315L362 344M404 315L414 344"
        stroke="#294C3D"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M367 273L336 292"
        stroke="#C98759"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M171 319C191 307 215 306 235 320"
        stroke="#B8D69F"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M296 320C320 305 341 305 360 319"
        stroke="#B8D69F"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M75 125C86 110 100 109 111 121"
        stroke="#D6E8C8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M416 105C429 91 446 93 456 107"
        stroke="#D6E8C8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="92" cy="79" r="5" fill="#A4C98C" />
      <circle cx="437" cy="68" r="6" fill="#A4C98C" />
    </svg>
  );
}

export default function CreateEventPage() {
  const [form, setForm] = useState<EventForm>(INITIAL_FORM);
  const [today, setToday] = useState("");

  const [requiredItems, setRequiredItems] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Get today's date after the component mounts.
  // This prevents Next.js prerendering errors caused by new Date().
  useEffect(() => {
    const currentDate = new Date();

    const localDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
  }, []);

  // Image preview
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Toast notification
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateForm = (field: keyof EventForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors([]);
  };

  const addRequiredItem = () => {
    const item = itemInput.trim().replace(/,$/, "");

    if (!item) return;

    if (
      requiredItems.some(
        (existing) => existing.toLowerCase() === item.toLowerCase()
      )
    ) {
      setItemInput("");
      return;
    }

    setRequiredItems((previous) => [...previous, item]);
    setItemInput("");
  };

  const removeRequiredItem = (itemToRemove: string) => {
    setRequiredItems((previous) =>
      previous.filter((item) => item !== itemToRemove)
    );
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!form.title.trim()) {
      newErrors.push("Event title is required.");
    }

    if (!form.category) {
      newErrors.push("Please select a category.");
    }

    if (!form.description.trim()) {
      newErrors.push("Event description is required.");
    }

    if (!form.date) {
      newErrors.push("Event date is required.");
    }

    if (!form.startTime) {
      newErrors.push("Start time is required.");
    }

    if (!form.endTime) {
      newErrors.push("End time is required.");
    }

    if (!form.location.trim()) {
      newErrors.push("Location is required.");
    }

    if (!form.address.trim()) {
      newErrors.push("Full address is required.");
    }

    if (!form.maxParticipants || Number(form.maxParticipants) < 1) {
      newErrors.push("Enter a valid maximum participant number.");
    }

    if (form.date && today && form.date < today) {
      newErrors.push("Event date cannot be in the past.");
    }

    if (form.date && form.registrationDeadline) {
      if (form.registrationDeadline > form.date) {
        newErrors.push(
          "Registration deadline cannot be after the event date."
        );
      }

      if (today && form.registrationDeadline < today) {
        newErrors.push(
          "Registration deadline cannot be in the past."
        );
      }
    }

    if (form.startTime && form.endTime) {
      if (form.endTime <= form.startTime) {
        newErrors.push("End time must be after start time.");
      }
    }

    if (
      form.feeType === "paid" &&
      (!form.feeAmount || Number(form.feeAmount) <= 0)
    ) {
      newErrors.push("Enter a valid participation fee.");
    }

    setErrors(newErrors);

    return newErrors.length === 0;
  };

  const handleDraft = () => {
    setToast(
      "Draft preview only. Connect the backend to save your event."
    );
  };

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setToast("Please complete the required fields.");
      return;
    }

    setModalOpen(true);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setRequiredItems([]);
    setItemInput("");
    setImageFile(null);
    setErrors([]);
    setModalOpen(false);
    setToast("");
  };

  const progressFields = [
    form.title,
    form.category,
    form.description,
    form.date,
    form.startTime,
    form.endTime,
    form.location,
    form.address,
    form.maxParticipants,
  ];

  const completedFields = progressFields.filter(Boolean).length;

  const progress = Math.round(
    (completedFields / progressFields.length) * 100
  );

  const displayDate = form.date
    ? new Date(`${form.date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Event date";

  return (
    <main className="evc">
      <div className="evc-container">
        {/* Hero */}
        <section className="evc-hero">
          <div className="evc-hero-content">
            <span className="evc-eyebrow">
              <span className="evc-eyebrow-dot" />
              MAKE A DIFFERENCE
            </span>

            <h1 className="evc-hero-title">
              Create a new
              <br />
              <span>event.</span>
            </h1>

            <p className="evc-hero-description">
              Every meaningful change begins with a small idea.
              Bring people together, plant trees, and create a
              greener future for your community.
            </p>

            <div className="evc-tip">
              <span className="evc-tip-icon">✦</span>
              <div>
                <strong>A little tip</strong>
                <p>
                  Give your event a clear purpose. People are more
                  likely to join when they understand the impact.
                </p>
              </div>
            </div>

            <a href="#event-form" className="evc-hero-button">
              Start filling the form
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="evc-hero-art">
            <div className="evc-art-circle" />
            <TreeIllustration />

            <div className="evc-art-note">
              <span>🌱</span>
              <div>
                <strong>Grow something good.</strong>
                <small>One event at a time.</small>
              </div>
            </div>
          </div>
        </section>

        {/* Form and sidebar */}
        <section className="evc-layout" id="event-form">
          <div className="evc-form-column">
            <div className="evc-section-heading">
              <span className="evc-section-number">01</span>
              <div>
                <h2>Event information</h2>
                <p>Tell your community what you are planning.</p>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="evc-error-box" role="alert">
                <strong>Please check the following:</strong>
                <ul>
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handlePublish} noValidate>
              {/* Basic information */}
              <section className="evc-card">
                <div className="evc-card-heading">
                  <span className="evc-card-icon">✳</span>
                  <div>
                    <h3>Basic information</h3>
                    <p>Start with the essentials of your event.</p>
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-title">
                    Event title <span>*</span>
                  </label>

                  <input
                    id="evc-title"
                    type="text"
                    placeholder="e.g. Green Dhaka: Community Tree Plantation"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    maxLength={100}
                  />

                  <small>Keep it clear and easy to remember.</small>
                </div>

                <div className="evc-field">
                  <label>
                    Event category <span>*</span>
                  </label>

                  <div className="evc-category-grid">
                    {CATEGORIES.map((category, index) => (
                      <label
                        className={`evc-category-option ${
                          form.category === category ? "is-selected" : ""
                        }`}
                        key={category}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={form.category === category}
                          onChange={() =>
                            updateForm("category", category)
                          }
                        />

                        <span className="evc-category-symbol">
                          {["🌳", "🌿", "🏫", "🌱"][index]}
                        </span>

                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-description">
                    Event description <span>*</span>
                  </label>

                  <textarea
                    id="evc-description"
                    rows={5}
                    placeholder="Describe your event, its purpose, activities and the impact you hope to make..."
                    value={form.description}
                    onChange={(e) =>
                      updateForm("description", e.target.value)
                    }
                    maxLength={1500}
                  />

                  <div className="evc-field-bottom">
                    <small>Explain why people should join.</small>
                    <small>{form.description.length}/1500</small>
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-image">Cover image</label>

                  <label className="evc-upload" htmlFor="evc-image">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Event cover preview"
                        className="evc-upload-preview"
                      />
                    ) : (
                      <>
                        <span className="evc-upload-icon">↑</span>
                        <strong>Click to upload an image</strong>
                        <small>PNG, JPG or WEBP · Maximum 5 MB</small>
                      </>
                    )}
                  </label>

                  <input
                    id="evc-image"
                    className="evc-hidden-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />

                  {imageFile && (
                    <button
                      type="button"
                      className="evc-remove-image"
                      onClick={() => setImageFile(null)}
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </section>

              {/* Date and location */}
              <section className="evc-card">
                <div className="evc-card-heading">
                  <span className="evc-card-icon">◷</span>
                  <div>
                    <h3>Date & location</h3>
                    <p>
                      Help participants know when and where to meet.
                    </p>
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-date">
                    Event date <span>*</span>
                  </label>

                  <input
                    id="evc-date"
                    type="date"
                    min={today || undefined}
                    value={form.date}
                    onChange={(e) => updateForm("date", e.target.value)}
                  />
                </div>

                <div className="evc-field-row">
                  <div className="evc-field">
                    <label htmlFor="evc-start">
                      Start time <span>*</span>
                    </label>

                    <input
                      id="evc-start"
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        updateForm("startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="evc-field">
                    <label htmlFor="evc-end">
                      End time <span>*</span>
                    </label>

                    <input
                      id="evc-end"
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        updateForm("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-location">
                    Location name <span>*</span>
                  </label>

                  <input
                    id="evc-location"
                    type="text"
                    placeholder="e.g. Ramna Park"
                    value={form.location}
                    onChange={(e) =>
                      updateForm("location", e.target.value)
                    }
                  />
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-address">
                    Full address <span>*</span>
                  </label>

                  <textarea
                    id="evc-address"
                    rows={2}
                    placeholder="Enter the complete event address..."
                    value={form.address}
                    onChange={(e) =>
                      updateForm("address", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* Participants */}
              <section className="evc-card">
                <div className="evc-card-heading">
                  <span className="evc-card-icon">♧</span>
                  <div>
                    <h3>Participants & registration</h3>
                    <p>
                      Set the participation details for your event.
                    </p>
                  </div>
                </div>

                <div className="evc-field-row">
                  <div className="evc-field">
                    <label htmlFor="evc-max">
                      Maximum participants <span>*</span>
                    </label>

                    <input
                      id="evc-max"
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={form.maxParticipants}
                      onChange={(e) =>
                        updateForm("maxParticipants", e.target.value)
                      }
                    />
                  </div>

                  <div className="evc-field">
                    <label htmlFor="evc-deadline">
                      Registration deadline
                    </label>

                    <input
                      id="evc-deadline"
                      type="date"
                      min={today || undefined}
                      max={form.date || undefined}
                      value={form.registrationDeadline}
                      onChange={(e) =>
                        updateForm(
                          "registrationDeadline",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="evc-field">
                  <label htmlFor="evc-items">Required items</label>

                  <div className="evc-tag-input">
                    <input
                      id="evc-items"
                      type="text"
                      placeholder="e.g. Gardening gloves, Water bottle"
                      value={itemInput}
                      onChange={(e) => setItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addRequiredItem();
                        }
                      }}
                    />

                    <button type="button" onClick={addRequiredItem}>
                      Add
                    </button>
                  </div>

                  {requiredItems.length > 0 && (
                    <div className="evc-tags">
                      {requiredItems.map((item) => (
                        <span className="evc-tag" key={item}>
                          {item}

                          <button
                            type="button"
                            aria-label={`Remove ${item}`}
                            onClick={() => removeRequiredItem(item)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <small>
                    Press Enter or click Add to add an item.
                  </small>
                </div>

                <div className="evc-field">
                  <label>Participation fee</label>

                  <div className="evc-fee-options">
                    <button
                      type="button"
                      className={
                        form.feeType === "free" ? "is-selected" : ""
                      }
                      onClick={() => updateForm("feeType", "free")}
                    >
                      <span>Free</span>
                      <small>No participation fee</small>
                    </button>

                    <button
                      type="button"
                      className={
                        form.feeType === "paid" ? "is-selected" : ""
                      }
                      onClick={() => updateForm("feeType", "paid")}
                    >
                      <span>Paid</span>
                      <small>Set an amount</small>
                    </button>
                  </div>

                  {form.feeType === "paid" && (
                    <div className="evc-fee-amount">
                      <label htmlFor="evc-fee">
                        Fee amount (BDT)
                      </label>

                      <input
                        id="evc-fee"
                        type="number"
                        min="1"
                        placeholder="e.g. 100"
                        value={form.feeAmount}
                        onChange={(e) =>
                          updateForm("feeAmount", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Organizer */}
              <section className="evc-card">
                <div className="evc-card-heading">
                  <span className="evc-card-icon">♙</span>
                  <div>
                    <h3>Organizer information</h3>
                    <p>
                      Your account will be associated with this event.
                    </p>
                  </div>
                </div>

                <div className="evc-organizer">
                  <div className="evc-organizer-avatar">U</div>

                  <div>
                    <strong>Your account</strong>
                    <small>Signed-in organizer</small>
                  </div>

                  <span className="evc-organizer-status">Account</span>
                </div>

                <p className="evc-organizer-note">
                  Organizer details will be connected to your logged-in
                  account when authentication is integrated.
                </p>
              </section>

              {/* Actions */}
              <div className="evc-form-actions">
                <button
                  type="button"
                  className="evc-draft-button"
                  onClick={handleDraft}
                >
                  Save as Draft
                </button>

                <button type="submit" className="evc-publish-button">
                  Publish Event <span>→</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live preview sidebar */}
          <aside className="evc-sidebar">
            <div className="evc-preview-card">
              <div className="evc-sidebar-heading">
                <span className="evc-live-dot" />
                <h3>Live preview</h3>
              </div>

              <p className="evc-sidebar-description">
                This is how your event will appear to the community.
              </p>

              <div className="evc-preview-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="Event preview" />
                ) : (
                  <div className="evc-preview-placeholder">
                    <span>🌳</span>
                    <small>Your event cover image</small>
                  </div>
                )}
              </div>

              <div className="evc-preview-content">
                <span className="evc-preview-category">
                  {form.category || "Event category"}
                </span>

                <h4>{form.title || "Your event title goes here"}</h4>

                <p className="evc-preview-description">
                  {form.description ||
                    "Your event description will appear here as you fill out the form."}
                </p>

                <div className="evc-preview-meta">
                  <div>
                    <span>◷</span>
                    <p>
                      <small>Date & time</small>
                      <strong>
                        {displayDate}
                        {form.startTime ? ` · ${form.startTime}` : ""}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <span>⌖</span>
                    <p>
                      <small>Location</small>
                      <strong>
                        {form.location || "Event location"}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <span>♧</span>
                    <p>
                      <small>Participants</small>
                      <strong>
                        {form.maxParticipants || "Not set"}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <span>৳</span>
                    <p>
                      <small>Participation</small>
                      <strong>
                        {form.feeType === "free"
                          ? "Free"
                          : `BDT ${form.feeAmount || "Not set"}`}
                      </strong>
                    </p>
                  </div>
                </div>

                {requiredItems.length > 0 && (
                  <div className="evc-preview-items">
                    <strong>What to bring</strong>

                    <div>
                      {requiredItems.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="evc-progress-card">
              <div className="evc-progress-heading">
                <div>
                  <h3>Ready to publish?</h3>
                  <p>
                    Complete the event details to get started.
                  </p>
                </div>

                <strong>{progress}%</strong>
              </div>

              <div className="evc-progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="evc-progress-steps">
                {[
                  "Basic information",
                  "Date & location",
                  "Participants",
                ].map((step, index) => {
                  const isComplete = [
                    Boolean(form.title && form.description),
                    Boolean(
                      form.date &&
                        form.startTime &&
                        form.endTime &&
                        form.location &&
                        form.address
                    ),
                    Boolean(form.maxParticipants),
                  ][index];

                  return (
                    <div key={step}>
                      <span className={isComplete ? "is-complete" : ""}>
                        {isComplete ? "✓" : index + 1}
                      </span>

                      <p>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="evc-sidebar-tip">
              <span>🌱</span>

              <div>
                <strong>Every tree counts.</strong>
                <p>
                  Your initiative can inspire an entire community
                  to take action.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom CTA */}
        <section className="evc-bottom-cta">
          <div>
            <span>ROOTED IN CHANGE</span>
            <h2>Small actions. Greener tomorrows.</h2>
            <p>
              Bring your community together and make every
              plantation effort count.
            </p>
          </div>

          <Link href="/events" className="evc-cta-link">
            Explore events <span>→</span>
          </Link>
        </section>
      </div>

      {/* Publish modal */}
      {modalOpen && (
        <div
          className="evc-modal-backdrop"
          role="presentation"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="evc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="evc-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="evc-modal-icon">✓</div>

            <span className="evc-modal-status">PENDING</span>

            <h2 id="evc-modal-title">Your event is ready!</h2>

            <p>
              Your event details passed the form validation.
              Backend submission and admin review will be available
              after API integration.
            </p>

            <div className="evc-modal-event">
              <strong>{form.title}</strong>
              <small>{displayDate}</small>
            </div>

            <div className="evc-modal-actions">
              <Link
                href="/my-events"
                className="evc-modal-primary"
              >
                My Events
              </Link>

              <button
                type="button"
                className="evc-modal-secondary"
                onClick={resetForm}
              >
                Create another event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="evc-toast" role="status">
          <span>ℹ</span>
          {toast}

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
