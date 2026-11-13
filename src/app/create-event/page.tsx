"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  ImagePlus,
  Info,
  Leaf,
  MapPin,
  Plus,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import "./create-event.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Community Tree Plantation",
  "Tree Care & Maintenance",
  "School & Campus Plantation",
  "Tree Plantation Awareness",
];

const CATEGORY_ICONS = ["🌳", "🌿", "🏫", "🌱"];

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

type SubmissionType = "draft" | "publish";

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

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.07 },
});

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

function Landscape() {
  return (
    <svg
      className="evc-svg"
      viewBox="0 0 480 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="evcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf5cc" />
          <stop offset="1" stopColor="#cfe6a6" />
        </linearGradient>
      </defs>

      <rect width="480" height="360" fill="url(#evcSky)" />

      <g className="evc-sun">
        <circle
          className="evc-sun-glow"
          cx="388"
          cy="72"
          r="66"
          fill="#f6c344"
          opacity=".28"
        />
        <circle cx="388" cy="72" r="40" fill="#f6c344" />
      </g>

      <path d="M0 250 Q140 190 280 240 T480 225 V360 H0Z" fill="#a9cf74" />
      <path d="M0 292 Q160 242 320 286 T480 270 V360 H0Z" fill="#7fb25a" />

      <g className="evc-sway">
        <rect x="96" y="216" width="6" height="70" fill="#6b4a2b" />
        <circle cx="99" cy="202" r="32" fill="#59ae6a" />
      </g>

      <g className="evc-sway" style={{ animationDelay: "-1.1s" }}>
        <rect x="205" y="236" width="5" height="52" fill="#6b4a2b" />
        <circle cx="207" cy="224" r="24" fill="#4f9d5d" />
      </g>

      <g className="evc-sway" style={{ animationDelay: "-2.2s" }}>
        <rect x="318" y="212" width="6" height="74" fill="#6b4a2b" />
        <circle cx="321" cy="196" r="30" fill="#59ae6a" />
      </g>
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionType>("publish");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Today's date
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

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 4000);

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

  const clearImage = () => {
    setImageFile(null);
    setUploadedImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setToast("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setUploadedImageUrl("");
    setImageFile(file);
  };

  // Form validation
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
        newErrors.push("Registration deadline cannot be in the past.");
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

    if (!imageFile && !uploadedImageUrl) {
      newErrors.push("Event cover image is required.");
    }

    setErrors(newErrors);

    return newErrors.length === 0;
  };

  // Get JWT from BetterAuth
  const getAuthToken = async (): Promise<string> => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        error?.message || "Authentication failed. Please login again."
      );
    }

    return data.token;
  };

  // Upload image to Cloudinary
  const uploadEventImage = async (token: string): Promise<string> => {
    if (uploadedImageUrl) {
      return uploadedImageUrl;
    }

    if (!imageFile) {
      throw new Error("Please select an event cover image.");
    }

    const imageData = new FormData();

    // Must match upload.single("image") in Express
    imageData.append("image", imageFile);
    imageData.append("imageType", "event");

    const response = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: imageData,
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.image?.url) {
      throw new Error(
        result.message || "Event image upload failed."
      );
    }

    setUploadedImageUrl(result.image.url);

    return result.image.url;
  };

  // Submit event to backend
  const submitEvent = async (type: SubmissionType) => {
    if (isSubmitting) return;

    if (!validateForm()) {
      setToast("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setToast("");

    try {
      // 1. Get BetterAuth JWT
      const token = await getAuthToken();

      // 2. Upload image
      const imageUrl = await uploadEventImage(token);

      // 3. Prepare event date
      const eventDate = new Date(
        `${form.date}T${form.startTime}:00`
      );

      if (Number.isNaN(eventDate.getTime())) {
        throw new Error("Invalid event date or time.");
      }

      // 4. Prepare event data
      const eventData = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventType: form.category,
        thumbnail: imageUrl,
        location: `${form.location.trim()}, ${form.address.trim()}`,
        eventDate: eventDate.toISOString(),
        capacity: Number(form.maxParticipants),
        bringItems: requiredItems,
        schedule: [
          {
            time: form.startTime,
            title: "Event starts",
            note: "",
          },
          {
            time: form.endTime,
            title: "Event ends",
            note: "",
          },
        ],
        submissionType: type,
      };

      // 5. Save event in MongoDB through Express
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Event submission failed."
        );
      }

      // 6. Show success modal
      setSubmissionStatus(type);
      setSubmissionMessage(
        result.message ||
          (type === "draft"
            ? "Your event has been saved as a draft."
            : "Your event has been submitted for admin approval.")
      );

      setModalOpen(true);
    } catch (error) {
      console.error("Event Submission Error:", error);

      setToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = async () => {
    await submitEvent("draft");
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitEvent("publish");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setRequiredItems([]);
    setItemInput("");
    clearImage();
    setErrors([]);
    setModalOpen(false);
    setToast("");
    setSubmissionMessage("");
    setSubmissionStatus("publish");
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

  const displayTime =
    form.startTime && form.endTime
      ? `${form.startTime} – ${form.endTime}`
      : form.startTime || "Set a time";

  const stepsDone = [
    Boolean(form.title && form.description),
    Boolean(
      form.date &&
        form.startTime &&
        form.endTime &&
        form.location &&
        form.address
    ),
    Boolean(form.maxParticipants),
  ];

  return (
    <MotionConfig reducedMotion="user">
      <main className="evc">
        <div className="evc-wrap">
          {/* Breadcrumb */}
          <nav className="evc-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/events">Events</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Create event</span>
          </nav>

          {/* HERO */}
          <section className="evc-hero">
            <div className="evc-hero-l">
              <motion.div className="evc-chips" {...rise(0)}>
                <span className="evc-chip">
                  {form.category || "Event category"}
                </span>

                <span className="evc-chip evc-chip--gold">
                  {isSubmitting ? "Submitting..." : "Draft"}
                </span>
              </motion.div>

              <motion.h1 className="evc-title evc-display" {...rise(1)}>
                {form.title.trim() || "Create a new event"}
              </motion.h1>

              <motion.p className="evc-lead" {...rise(2)}>
                Every meaningful change begins with a small idea. Bring
                people together, plant trees, and create a greener future
                for your community.
              </motion.p>

              <motion.ul className="evc-meta" {...rise(3)}>
                <li>
                  <span className="evc-ic">
                    <CalendarDays size={16} />
                  </span>
                  <div>
                    <small>Date</small>
                    <b>{displayDate}</b>
                  </div>
                </li>

                <li>
                  <span className="evc-ic">
                    <Clock size={16} />
                  </span>
                  <div>
                    <small>Time</small>
                    <b>{displayTime}</b>
                  </div>
                </li>

                <li>
                  <span className="evc-ic">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <small>Location</small>
                    <b>{form.location || "Add a location"}</b>
                  </div>
                </li>

                <li>
                  <span className="evc-ic">
                    <User size={16} />
                  </span>
                  <div>
                    <small>Organizer</small>
                    <b>You</b>
                  </div>
                </li>
              </motion.ul>

              <motion.div {...rise(4)}>
                <div className="evc-capline">
                  <span className="evc-going" aria-live="polite">
                    <Users size={16} />
                    <span>
                      <motion.b
                        key={completedFields}
                        initial={{ scale: 1.35 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 18,
                        }}
                      >
                        {completedFields}
                      </motion.b>{" "}
                      of {progressFields.length} details filled
                    </span>
                  </span>

                  <span>{progress}%</span>
                </div>

                <div
                  className="evc-bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <motion.i
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                <a href="#event-form" className="evc-gold-btn evc-hero-btn">
                  Start filling the form
                  <ArrowDown size={16} />
                </a>
              </motion.div>
            </div>

            <motion.div
              className="evc-art"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Landscape />

              <div className="evc-art-note">
                <span>
                  <Leaf size={16} />
                </span>
                <div>
                  <b>Grow something good.</b>
                  <small>One event at a time.</small>
                </div>
              </div>
            </motion.div>
          </section>

          {/* BODY */}
          <div className="evc-cols" id="event-form">
            <div className="evc-main">
              {errors.length > 0 && (
                <motion.div
                  className="evc-error-box"
                  role="alert"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <strong>Please check the following:</strong>
                  <ul>
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <form onSubmit={handlePublish} noValidate>
                {/* Basic information */}
                <motion.section className="evc-panel" {...reveal}>
                  <h2 className="evc-h2 evc-display">
                    Basic information
                  </h2>

                  <p className="evc-sub">
                    Start with the essentials of your event.
                  </p>

                  <div className="evc-field">
                    <label className="evc-label" htmlFor="evc-title">
                      Event title <span>*</span>
                    </label>

                    <input
                      id="evc-title"
                      className="evc-input"
                      type="text"
                      placeholder="e.g. Green Dhaka: Community Tree Plantation"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      maxLength={100}
                    />

                    <small className="evc-hint">
                      Keep it clear and easy to remember.
                    </small>
                  </div>

                  <div className="evc-field">
                    <span className="evc-label">
                      Event category <span>*</span>
                    </span>

                    <div className="evc-category-grid" role="radiogroup">
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
                            {CATEGORY_ICONS[index]}
                          </span>

                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="evc-field">
                    <label
                      className="evc-label"
                      htmlFor="evc-description"
                    >
                      Event description <span>*</span>
                    </label>

                    <textarea
                      id="evc-description"
                      className="evc-input"
                      rows={5}
                      placeholder="Describe your event, its purpose, activities and the impact you hope to make..."
                      value={form.description}
                      onChange={(e) =>
                        updateForm("description", e.target.value)
                      }
                      maxLength={1500}
                    />

                    <div className="evc-field-bottom">
                      <small className="evc-hint">
                        Explain why people should join.
                      </small>

                      <small className="evc-hint">
                        {form.description.length}/1500
                      </small>
                    </div>
                  </div>

                  <div className="evc-field">
                    <span className="evc-label">Cover image *</span>

                    <label className="evc-upload" htmlFor="evc-image">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Event cover preview"
                          className="evc-upload-preview"
                        />
                      ) : (
                        <>
                          <span className="evc-upload-icon">
                            <ImagePlus size={20} />
                          </span>

                          <strong>Click to upload an image</strong>

                          <small>
                            PNG, JPG or WEBP · Maximum 5 MB
                          </small>
                        </>
                      )}
                    </label>

                    <input
                      id="evc-image"
                      ref={fileInputRef}
                      className="evc-hidden-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                    />

                    {imageFile && (
                      <button
                        type="button"
                        className="evc-remove-image"
                        onClick={clearImage}
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </motion.section>

                {/* Date and location */}
                <motion.section className="evc-panel" {...reveal}>
                  <h2 className="evc-h2 evc-display">
                    Date &amp; location
                  </h2>

                  <p className="evc-sub">
                    Help participants know when and where to meet.
                  </p>

                  <div className="evc-field">
                    <label className="evc-label" htmlFor="evc-date">
                      Event date <span>*</span>
                    </label>

                    <input
                      id="evc-date"
                      className="evc-input"
                      type="date"
                      min={today || undefined}
                      value={form.date}
                      onChange={(e) => updateForm("date", e.target.value)}
                    />
                  </div>

                  <div className="evc-field-row">
                    <div className="evc-field">
                      <label className="evc-label" htmlFor="evc-start">
                        Start time <span>*</span>
                      </label>

                      <input
                        id="evc-start"
                        className="evc-input"
                        type="time"
                        value={form.startTime}
                        onChange={(e) =>
                          updateForm("startTime", e.target.value)
                        }
                      />
                    </div>

                    <div className="evc-field">
                      <label className="evc-label" htmlFor="evc-end">
                        End time <span>*</span>
                      </label>

                      <input
                        id="evc-end"
                        className="evc-input"
                        type="time"
                        value={form.endTime}
                        onChange={(e) =>
                          updateForm("endTime", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="evc-field">
                    <label
                      className="evc-label"
                      htmlFor="evc-location"
                    >
                      Location name <span>*</span>
                    </label>

                    <input
                      id="evc-location"
                      className="evc-input"
                      type="text"
                      placeholder="e.g. Ramna Park"
                      value={form.location}
                      onChange={(e) =>
                        updateForm("location", e.target.value)
                      }
                    />
                  </div>

                  <div className="evc-field">
                    <label className="evc-label" htmlFor="evc-address">
                      Full address <span>*</span>
                    </label>

                    <textarea
                      id="evc-address"
                      className="evc-input"
                      rows={2}
                      placeholder="Enter the complete event address..."
                      value={form.address}
                      onChange={(e) =>
                        updateForm("address", e.target.value)
                      }
                    />
                  </div>
                </motion.section>

                {/* Participants */}
                <motion.section className="evc-panel" {...reveal}>
                  <h2 className="evc-h2 evc-display">
                    Participants &amp; registration
                  </h2>

                  <p className="evc-sub">
                    Set the participation details for your event.
                  </p>

                  <div className="evc-field-row">
                    <div className="evc-field">
                      <label className="evc-label" htmlFor="evc-max">
                        Maximum participants <span>*</span>
                      </label>

                      <input
                        id="evc-max"
                        className="evc-input"
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
                      <label
                        className="evc-label"
                        htmlFor="evc-deadline"
                      >
                        Registration deadline
                      </label>

                      <input
                        id="evc-deadline"
                        className="evc-input"
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
                    <label className="evc-label" htmlFor="evc-items">
                      Required items
                    </label>

                    <div className="evc-tag-input">
                      <input
                        id="evc-items"
                        className="evc-input"
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
                        <Plus size={15} />
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
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <small className="evc-hint">
                      Press Enter or click Add to add an item.
                    </small>
                  </div>

                  <div className="evc-field">
                    <span className="evc-label">Participation fee</span>

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
                        <label className="evc-label" htmlFor="evc-fee">
                          Fee amount (BDT)
                        </label>

                        <input
                          id="evc-fee"
                          className="evc-input"
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
                </motion.section>

                {/* Organizer */}
                <motion.section className="evc-panel" {...reveal}>
                  <h2 className="evc-h2 evc-display">
                    Organizer information
                  </h2>

                  <p className="evc-sub">
                    Your account will be associated with this event.
                  </p>

                  <div className="evc-org">
                    <span className="evc-avatar" aria-hidden="true">
                      U
                    </span>

                    <div>
                      <b>Your account</b>
                      <small>Signed-in organizer</small>
                    </div>

                    <span className="evc-chip evc-chip--gold">
                      Account
                    </span>
                  </div>

                  <p className="evc-org-note">
                    Your logged-in account will automatically be associated
                    with this event.
                  </p>
                </motion.section>

                {/* Actions */}
                <div className="evc-actions">
                  <Link href="/my-events" className="evc-myevents-btn">
                    <CalendarCheck size={16} />
                    My Events
                    <ArrowUpRight size={14} />
                  </Link>

                  <div className="evc-actions-right">
                    <button
                      type="button"
                      className="evc-draft-btn"
                      onClick={handleDraft}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save as Draft"}
                    </button>

                    <button
                      type="submit"
                      className="evc-gold-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Event"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="evc-side">
              <motion.section
                className="evc-panel evc-preview"
                {...reveal}
              >
                <h2 className="evc-h2 evc-display evc-live">
                  <span className="evc-live-dot" />
                  Live preview
                </h2>

                <p className="evc-sub">
                  This is how your event will appear to the community.
                </p>

                <div className="evc-preview-image">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Event preview" />
                  ) : (
                    <div className="evc-preview-placeholder">
                      <Leaf size={30} />
                      <small>Your event cover image</small>
                    </div>
                  )}
                </div>

                <span className="evc-chip evc-preview-chip">
                  {form.category || "Event category"}
                </span>

                <h3 className="evc-preview-title evc-display">
                  {form.title || "Your event title goes here"}
                </h3>

                <p className="evc-preview-desc">
                  {form.description ||
                    "Your event description will appear here as you fill out the form."}
                </p>

                <ul className="evc-preview-meta">
                  <li>
                    <span className="evc-ic">
                      <CalendarDays size={15} />
                    </span>

                    <div>
                      <small>Date &amp; time</small>
                      <b>
                        {displayDate}
                        {form.startTime ? ` · ${form.startTime}` : ""}
                      </b>
                    </div>
                  </li>

                  <li>
                    <span className="evc-ic">
                      <MapPin size={15} />
                    </span>

                    <div>
                      <small>Location</small>
                      <b>{form.location || "Event location"}</b>
                    </div>
                  </li>

                  <li>
                    <span className="evc-ic">
                      <Users size={15} />
                    </span>

                    <div>
                      <small>Participants</small>
                      <b>{form.maxParticipants || "Not set"}</b>
                    </div>
                  </li>

                  <li>
                    <span className="evc-ic evc-ic--text">৳</span>

                    <div>
                      <small>Participation</small>
                      <b>
                        {form.feeType === "free"
                          ? "Free"
                          : `BDT ${form.feeAmount || "Not set"}`}
                      </b>
                    </div>
                  </li>
                </ul>

                {requiredItems.length > 0 && (
                  <div className="evc-preview-items">
                    <b>What to bring</b>

                    <div>
                      {requiredItems.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>

              <motion.section className="evc-panel" {...reveal}>
                <h2 className="evc-h2 evc-display">
                  Ready to publish?
                </h2>

                <p className="evc-sub">
                  Complete these sections to get started.
                </p>

                <div className="evc-steps">
                  {[
                    "Basic information",
                    "Date & location",
                    "Participants",
                  ].map((step, index) => (
                    <div key={step}>
                      <span className={stepsDone[index] ? "is-complete" : ""}>
                        {stepsDone[index] ? <Check size={13} /> : index + 1}
                      </span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section className="evc-panel evc-tip" {...reveal}>
                <span className="evc-ic">
                  <Sparkles size={16} />
                </span>

                <div>
                  <b>A little tip</b>
                  <p>
                    Give your event a clear purpose. People are more likely
                    to join when they understand the impact.
                  </p>
                </div>
              </motion.section>
            </aside>
          </div>

          {/* BOTTOM CTA */}
          <section className="evc-cta">
            <div>
              <h2 className="evc-display">
                Small actions. Greener tomorrows.
              </h2>

              <p>
                Bring your community together and make every plantation
                effort count.
              </p>
            </div>

            <Link href="/events" className="evc-cta-btn">
              Explore events
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        {/* Success modal */}
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
              <div className="evc-modal-icon">
                <Check size={26} />
              </div>

              <span className="evc-chip evc-chip--gold">
                {submissionStatus === "draft" ? "DRAFT SAVED" : "PENDING"}
              </span>

              <h2 id="evc-modal-title" className="evc-display">
                {submissionStatus === "draft"
                  ? "Your draft is saved!"
                  : "Your event is submitted!"}
              </h2>

              <p>{submissionMessage}</p>

              <div className="evc-modal-event">
                <strong>{form.title}</strong>
                <small>{displayDate}</small>
              </div>

              <div className="evc-modal-actions">
                <Link href="/my-events" className="evc-modal-primary">
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
            <Info size={16} />
            {toast}

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <X size={13} />
            </button>
          </div>
        )}
      </main>
    </MotionConfig>
  );
}