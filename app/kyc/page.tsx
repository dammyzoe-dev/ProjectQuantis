"use client";

import { useState } from "react";
import {
  User, FileText, MapPin, TrendingUp, CheckCircle2,
  Upload, ChevronRight, ChevronLeft, AlertCircle,
  Shield, Lock, Camera, Check, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonalInfo {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  phone: string;
  gender: string;
}

interface IdentityDocs {
  docType: string;
  docNumber: string;
  expiry: string;
  frontUploaded: boolean;
  backUploaded: boolean;
  selfieUploaded: boolean;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  proofUploaded: boolean;
}

interface FinancialProfile {
  employmentStatus: string;
  annualIncome: string;
  sourceOfFunds: string;
  tradingExperience: string;
  investmentGoal: string;
  isPEP: string;
  acceptsRisk: boolean;
}

// ─── Step metadata ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal Info", icon: User, short: "Personal" },
  { id: 2, label: "Identity Documents", icon: FileText, short: "Identity" },
  { id: 3, label: "Address Verification", icon: MapPin, short: "Address" },
  { id: 4, label: "Financial Profile", icon: TrendingUp, short: "Financial" },
  { id: 5, label: "Review & Submit", icon: CheckCircle2, short: "Review" },
];

// ─── Reusable field components ────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-medium text-ink-muted">
        {label}
        {required && <span className="text-loss">*</span>}
        {hint && (
          <span className="group relative ml-1">
            <Info size={11} className="cursor-help text-ink-faint" />
            <span className="pointer-events-none absolute bottom-5 left-1/2 z-10 w-48 -translate-x-1/2 rounded-lg border border-void-border bg-void-card px-2.5 py-1.5 text-xs text-ink-muted opacity-0 shadow-card transition-opacity group-hover:opacity-100">
              {hint}
            </span>
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-loss">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={cn(
        "w-full rounded-xl border bg-void-card2 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-signal-indigo/40 transition-colors",
        error ? "border-loss/50" : "border-void-border focus:border-signal-indigo"
      )}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full appearance-none rounded-xl border bg-void-card2 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal-indigo/40 transition-colors",
        error ? "border-loss/50" : "border-void-border focus:border-signal-indigo",
        !value && "text-ink-faint"
      )}
    >
      <option value="" disabled>Select…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function UploadZone({
  label,
  hint,
  uploaded,
  onUpload,
  icon: Icon = Upload,
}: {
  label: string;
  hint?: string;
  uploaded: boolean;
  onUpload: () => void;
  icon?: React.ElementType;
}) {
  return (
    <button
      onClick={onUpload}
      className={cn(
        "flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all",
        uploaded
          ? "border-gain/40 bg-gain/5"
          : "border-void-border bg-void-card2 hover:border-signal-indigo/40 hover:bg-void-card"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full",
        uploaded ? "bg-gain/10" : "bg-void-border"
      )}>
        {uploaded ? <Check size={20} className="text-gain" /> : <Icon size={20} className="text-ink-faint" />}
      </div>
      <div>
        <p className={cn("text-sm font-medium", uploaded ? "text-gain" : "text-ink")}>
          {uploaded ? "Uploaded ✓" : label}
        </p>
        {hint && !uploaded && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
      </div>
    </button>
  );
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────
function StepPersonal({
  data,
  setData,
  errors,
}: {
  data: PersonalInfo;
  setData: (d: PersonalInfo) => void;
  errors: Record<string, string>;
}) {
  const u = (k: keyof PersonalInfo) => (v: string) => setData({ ...data, [k]: v });

  const COUNTRIES = [
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States" },
    { value: "NG", label: "Nigeria" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "SG", label: "Singapore" },
    { value: "AE", label: "UAE" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required error={errors.firstName}>
          <TextInput value={data.firstName} onChange={u("firstName")} placeholder="Alex" error={!!errors.firstName} autoComplete="given-name" />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <TextInput value={data.lastName} onChange={u("lastName")} placeholder="Trader" error={!!errors.lastName} autoComplete="family-name" />
        </Field>
      </div>

      <Field label="Date of birth" required error={errors.dob} hint="You must be 18+ to trade">
        <TextInput value={data.dob} onChange={u("dob")} type="date" error={!!errors.dob} autoComplete="bday" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Nationality" required error={errors.nationality}>
          <SelectInput value={data.nationality} onChange={u("nationality")} options={COUNTRIES} error={!!errors.nationality} />
        </Field>
        <Field label="Gender">
          <SelectInput
            value={data.gender}
            onChange={u("gender")}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "nonbinary", label: "Non-binary" },
              { value: "prefer_not", label: "Prefer not to say" },
            ]}
          />
        </Field>
      </div>

      <Field label="Phone number" required error={errors.phone} hint="Must be able to receive SMS for 2FA">
        <TextInput value={data.phone} onChange={u("phone")} type="tel" placeholder="+44 7700 900000" error={!!errors.phone} autoComplete="tel" />
      </Field>
    </div>
  );
}

// ─── Step 2: Identity Documents ───────────────────────────────────────────────
function StepIdentity({
  data,
  setData,
  errors,
}: {
  data: IdentityDocs;
  setData: (d: IdentityDocs) => void;
  errors: Record<string, string>;
}) {
  const u = (k: keyof IdentityDocs) => (v: string | boolean) => setData({ ...data, [k]: v });
  const fakeUpload = (k: "frontUploaded" | "backUploaded" | "selfieUploaded") =>
    () => setData({ ...data, [k]: true });

  const DOC_TYPES = [
    { value: "passport", label: "Passport" },
    { value: "driving_licence", label: "Driving Licence" },
    { value: "national_id", label: "National ID Card" },
    { value: "residence_permit", label: "Residence Permit" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-signal-indigo/20 bg-signal-indigo/5 px-4 py-3 text-xs text-ink-muted">
        <p className="font-medium text-ink">Accepted documents</p>
        <p className="mt-0.5">Passport, government-issued photo ID, or driving licence. Documents must be valid and not expire within 3 months.</p>
      </div>

      <Field label="Document type" required error={errors.docType}>
        <SelectInput value={data.docType} onChange={u("docType") as (v: string) => void} options={DOC_TYPES} error={!!errors.docType} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Document number" required error={errors.docNumber}>
          <TextInput value={data.docNumber} onChange={u("docNumber") as (v: string) => void} placeholder="AB123456" error={!!errors.docNumber} />
        </Field>
        <Field label="Expiry date" required error={errors.expiry}>
          <TextInput value={data.expiry} onChange={u("expiry") as (v: string) => void} type="date" error={!!errors.expiry} />
        </Field>
      </div>

      {/* Upload zones */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-ink-muted">Document photos</p>
        <div className="grid grid-cols-2 gap-3">
          <UploadZone
            label="Front of document"
            hint="Clear photo, all 4 corners visible"
            uploaded={data.frontUploaded}
            onUpload={fakeUpload("frontUploaded")}
          />
          {data.docType !== "passport" && (
            <UploadZone
              label="Back of document"
              hint="Required for ID cards"
              uploaded={data.backUploaded}
              onUpload={fakeUpload("backUploaded")}
            />
          )}
        </div>

        <UploadZone
          label="Selfie with document"
          hint="Hold document next to your face — do not cover photo"
          uploaded={data.selfieUploaded}
          onUpload={fakeUpload("selfieUploaded")}
          icon={Camera}
        />
        {errors.selfie && (
          <p className="flex items-center gap-1.5 text-xs text-loss">
            <AlertCircle size={11} /> {errors.selfie}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-void-border bg-void-card2 px-4 py-3 text-xs text-ink-muted">
        <Lock size={13} className="mt-0.5 shrink-0 text-signal-indigo" />
        Photos are encrypted and processed by our KYC partner. They are never stored permanently on Quantis servers.
      </div>
    </div>
  );
}

// ─── Step 3: Address Verification ────────────────────────────────────────────
function StepAddress({
  data,
  setData,
  errors,
}: {
  data: Address;
  setData: (d: Address) => void;
  errors: Record<string, string>;
}) {
  const u = (k: keyof Address) => (v: string | boolean) => setData({ ...data, [k]: v });

  const COUNTRIES = [
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States" },
    { value: "NG", label: "Nigeria" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "SG", label: "Singapore" },
    { value: "AE", label: "UAE" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="space-y-5">
      <Field label="Address line 1" required error={errors.line1}>
        <TextInput value={data.line1} onChange={u("line1") as (v: string) => void} placeholder="123 Main Street" error={!!errors.line1} autoComplete="address-line1" />
      </Field>
      <Field label="Address line 2">
        <TextInput value={data.line2} onChange={u("line2") as (v: string) => void} placeholder="Apartment, suite, floor (optional)" autoComplete="address-line2" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City" required error={errors.city}>
          <TextInput value={data.city} onChange={u("city") as (v: string) => void} placeholder="London" error={!!errors.city} autoComplete="address-level2" />
        </Field>
        <Field label="State / Province">
          <TextInput value={data.state} onChange={u("state") as (v: string) => void} placeholder="England" autoComplete="address-level1" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Postcode / ZIP" required error={errors.postcode}>
          <TextInput value={data.postcode} onChange={u("postcode") as (v: string) => void} placeholder="EC1A 1BB" error={!!errors.postcode} autoComplete="postal-code" />
        </Field>
        <Field label="Country" required error={errors.country}>
          <SelectInput value={data.country} onChange={u("country") as (v: string) => void} options={COUNTRIES} error={!!errors.country} />
        </Field>
      </div>

      {/* Proof of address */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-ink-muted">
          Proof of address <span className="text-loss">*</span>
        </p>
        <UploadZone
          label="Upload proof of address"
          hint="Bank statement, utility bill, or government letter — dated within 3 months"
          uploaded={data.proofUploaded}
          onUpload={() => setData({ ...data, proofUploaded: true })}
        />
        {errors.proof && (
          <p className="flex items-center gap-1.5 text-xs text-loss">
            <AlertCircle size={11} /> {errors.proof}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-void-border bg-void-card2 px-4 py-3 text-xs text-ink-muted">
        Accepted: Bank statement, utility bill (gas, electric, water), council tax letter, HMRC correspondence — not older than 90 days.
      </div>
    </div>
  );
}

// ─── Step 4: Financial Profile ────────────────────────────────────────────────
function StepFinancial({
  data,
  setData,
  errors,
}: {
  data: FinancialProfile;
  setData: (d: FinancialProfile) => void;
  errors: Record<string, string>;
}) {
  const u = (k: keyof FinancialProfile) => (v: string | boolean) => setData({ ...data, [k]: v });

  const EMPLOYMENT = [
    { value: "employed", label: "Employed (full-time)" },
    { value: "part_time", label: "Employed (part-time)" },
    { value: "self_employed", label: "Self-employed / Freelance" },
    { value: "business_owner", label: "Business owner" },
    { value: "retired", label: "Retired" },
    { value: "student", label: "Student" },
    { value: "unemployed", label: "Not currently employed" },
  ];

  const INCOME = [
    { value: "0_25k", label: "Under $25,000" },
    { value: "25_50k", label: "$25,000 – $50,000" },
    { value: "50_100k", label: "$50,000 – $100,000" },
    { value: "100_250k", label: "$100,000 – $250,000" },
    { value: "250k_plus", label: "Over $250,000" },
  ];

  const SOURCE = [
    { value: "salary", label: "Employment salary" },
    { value: "business", label: "Business income" },
    { value: "investment", label: "Investment returns" },
    { value: "inheritance", label: "Inheritance / Gift" },
    { value: "savings", label: "Personal savings" },
    { value: "other", label: "Other" },
  ];

  const EXPERIENCE = [
    { value: "none", label: "No experience" },
    { value: "beginner", label: "Beginner (< 1 year)" },
    { value: "intermediate", label: "Intermediate (1–3 years)" },
    { value: "experienced", label: "Experienced (3–5 years)" },
    { value: "professional", label: "Professional (5+ years)" },
  ];

  const GOALS = [
    { value: "wealth_growth", label: "Long-term wealth growth" },
    { value: "income", label: "Regular income / dividends" },
    { value: "speculation", label: "Short-term speculation" },
    { value: "hedging", label: "Hedging existing portfolio" },
    { value: "diversification", label: "Diversification" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
        <p className="font-medium">Regulatory requirement</p>
        <p className="mt-0.5 text-amber-400/80">
          This information is required under AML and financial services regulations. It is kept confidential and used only for compliance purposes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Employment status" required error={errors.employmentStatus}>
          <SelectInput value={data.employmentStatus} onChange={u("employmentStatus") as (v: string) => void} options={EMPLOYMENT} error={!!errors.employmentStatus} />
        </Field>
        <Field label="Annual income (USD)" required error={errors.annualIncome}>
          <SelectInput value={data.annualIncome} onChange={u("annualIncome") as (v: string) => void} options={INCOME} error={!!errors.annualIncome} />
        </Field>
      </div>

      <Field label="Primary source of funds" required error={errors.sourceOfFunds} hint="Where does the money you plan to trade with come from?">
        <SelectInput value={data.sourceOfFunds} onChange={u("sourceOfFunds") as (v: string) => void} options={SOURCE} error={!!errors.sourceOfFunds} />
      </Field>

      <Field label="Trading / investing experience" required error={errors.tradingExperience}>
        <SelectInput value={data.tradingExperience} onChange={u("tradingExperience") as (v: string) => void} options={EXPERIENCE} error={!!errors.tradingExperience} />
      </Field>

      <Field label="Primary investment goal" required error={errors.investmentGoal}>
        <SelectInput value={data.investmentGoal} onChange={u("investmentGoal") as (v: string) => void} options={GOALS} error={!!errors.investmentGoal} />
      </Field>

      <Field
        label="Are you a Politically Exposed Person (PEP)?"
        required
        error={errors.isPEP}
        hint="A PEP is a person who holds or has held a prominent public function (head of state, government minister, senior judge, etc.)"
      >
        <div className="flex gap-3">
          {["yes", "no"].map((v) => (
            <button
              key={v}
              onClick={() => setData({ ...data, isPEP: v })}
              className={cn(
                "flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors",
                data.isPEP === v
                  ? v === "yes"
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-signal-indigo/40 bg-signal-indigo/10 text-signal-indigo"
                  : "border-void-border bg-void-card2 text-ink-muted hover:border-void-borderLight hover:text-ink"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        {errors.isPEP && (
          <p className="flex items-center gap-1.5 text-xs text-loss mt-1.5">
            <AlertCircle size={11} /> {errors.isPEP}
          </p>
        )}
      </Field>

      {/* Risk acknowledgement */}
      <div className="rounded-xl border border-void-border bg-void-card2 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <div
            onClick={() => setData({ ...data, acceptsRisk: !data.acceptsRisk })}
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
              data.acceptsRisk ? "border-signal-indigo bg-signal-indigo" : "border-void-border bg-void-card"
            )}
          >
            {data.acceptsRisk && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs leading-relaxed text-ink-muted">
            I understand that trading cryptocurrency and forex involves{" "}
            <span className="font-medium text-ink">substantial risk of loss</span> and may not be
            suitable for all investors. I confirm that the funds I intend to deposit are not
            borrowed and that I can afford to lose them in their entirety.
          </span>
        </label>
        {errors.acceptsRisk && (
          <p className="flex items-center gap-1.5 text-xs text-loss mt-2 pl-7">
            <AlertCircle size={11} /> {errors.acceptsRisk}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Review & Submit ──────────────────────────────────────────────────
function StepReview({
  personal,
  identity,
  address,
  financial,
  onEdit,
}: {
  personal: PersonalInfo;
  identity: IdentityDocs;
  address: Address;
  financial: FinancialProfile;
  onEdit: (step: number) => void;
}) {
  const Section = ({
    title,
    step,
    rows,
  }: {
    title: string;
    step: number;
    rows: { label: string; value: string }[];
  }) => (
    <div className="rounded-xl border border-void-border bg-void-card2 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <button
          onClick={() => onEdit(step)}
          className="text-xs text-signal-indigo hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-ink-muted">{r.label}</span>
            <span className="font-medium text-ink">{r.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gain/20 bg-gain/5 px-4 py-3 text-xs text-gain">
        <p className="font-medium">Almost done!</p>
        <p className="mt-0.5 text-gain/80">
          Review your information below. Approval typically takes 1–3 business hours.
        </p>
      </div>

      <Section
        title="Personal Information"
        step={1}
        rows={[
          { label: "Full name", value: `${personal.firstName} ${personal.lastName}` },
          { label: "Date of birth", value: personal.dob },
          { label: "Nationality", value: personal.nationality },
          { label: "Phone", value: personal.phone },
        ]}
      />
      <Section
        title="Identity Document"
        step={2}
        rows={[
          { label: "Type", value: identity.docType.replace("_", " ") },
          { label: "Document number", value: identity.docNumber },
          { label: "Expiry", value: identity.expiry },
          { label: "Photos uploaded", value: identity.frontUploaded && identity.selfieUploaded ? "Yes ✓" : "Incomplete" },
        ]}
      />
      <Section
        title="Address"
        step={3}
        rows={[
          { label: "Address", value: `${address.line1}${address.line2 ? ", " + address.line2 : ""}` },
          { label: "City", value: address.city },
          { label: "Postcode", value: address.postcode },
          { label: "Country", value: address.country },
          { label: "Proof uploaded", value: address.proofUploaded ? "Yes ✓" : "No" },
        ]}
      />
      <Section
        title="Financial Profile"
        step={4}
        rows={[
          { label: "Employment", value: financial.employmentStatus.replace("_", " ") },
          { label: "Annual income", value: financial.annualIncome.replace(/_/g, " ") },
          { label: "Source of funds", value: financial.sourceOfFunds },
          { label: "Experience", value: financial.tradingExperience },
          { label: "PEP status", value: financial.isPEP },
        ]}
      />

      <div className="flex items-start gap-2 rounded-xl border border-void-border bg-void-card2 px-4 py-3 text-xs text-ink-muted">
        <Shield size={13} className="mt-0.5 shrink-0 text-signal-indigo" />
        By submitting, you confirm that all information provided is accurate and complete.
        False declarations may result in account suspension and may be reported to relevant authorities.
      </div>
    </div>
  );
}

// ─── Main KYC Page ────────────────────────────────────────────────────────────
export default function KycPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: "", lastName: "", dob: "", nationality: "",
    phone: "", gender: "",
  });
  const [identity, setIdentity] = useState<IdentityDocs>({
    docType: "", docNumber: "", expiry: "",
    frontUploaded: false, backUploaded: false, selfieUploaded: false,
  });
  const [address, setAddress] = useState<Address>({
    line1: "", line2: "", city: "", state: "", postcode: "", country: "",
    proofUploaded: false,
  });
  const [financial, setFinancial] = useState<FinancialProfile>({
    employmentStatus: "", annualIncome: "", sourceOfFunds: "",
    tradingExperience: "", investmentGoal: "", isPEP: "", acceptsRisk: false,
  });

  const validateStep = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!personal.firstName.trim()) e.firstName = "Required";
      if (!personal.lastName.trim()) e.lastName = "Required";
      if (!personal.dob) e.dob = "Required";
      else {
        const age = (Date.now() - new Date(personal.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) e.dob = "You must be 18 or older";
      }
      if (!personal.nationality) e.nationality = "Required";
      if (!personal.phone) e.phone = "Required";
    }
    if (s === 2) {
      if (!identity.docType) e.docType = "Select a document type";
      if (!identity.docNumber) e.docNumber = "Required";
      if (!identity.expiry) e.expiry = "Required";
      if (!identity.frontUploaded) e.front = "Upload required";
      if (!identity.selfieUploaded) e.selfie = "Selfie with document is required";
    }
    if (s === 3) {
      if (!address.line1) e.line1 = "Required";
      if (!address.city) e.city = "Required";
      if (!address.postcode) e.postcode = "Required";
      if (!address.country) e.country = "Required";
      if (!address.proofUploaded) e.proof = "Proof of address is required";
    }
    if (s === 4) {
      if (!financial.employmentStatus) e.employmentStatus = "Required";
      if (!financial.annualIncome) e.annualIncome = "Required";
      if (!financial.sourceOfFunds) e.sourceOfFunds = "Required";
      if (!financial.tradingExperience) e.tradingExperience = "Required";
      if (!financial.investmentGoal) e.investmentGoal = "Required";
      if (!financial.isPEP) e.isPEP = "Required";
      if (!financial.acceptsRisk) e.acceptsRisk = "You must acknowledge the risk disclosure";
    }
    return e;
  };

  const handleNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span className="absolute h-20 w-20 animate-pulse_ring rounded-full bg-gain/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gain/10 border border-gain/30">
              <CheckCircle2 size={36} className="text-gain" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">Application submitted</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Your KYC application is under review. Our compliance team typically reviews
            applications within{" "}
            <span className="font-medium text-ink">1–3 business hours</span>.
            You&apos;ll receive an email once verified.
          </p>

          <div className="mt-6 space-y-2 rounded-xl border border-void-border bg-void-card2 p-4 text-left text-xs">
            {[
              { label: "Application ID", value: "QT-KYC-2024-18923" },
              { label: "Submitted", value: new Date().toLocaleString() },
              { label: "Status", value: "Under review" },
              { label: "Expected response", value: "Within 3 business hours" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-ink-muted">{r.label}</span>
                <span className="font-mono font-medium text-ink">{r.value}</span>
              </div>
            ))}
          </div>

          <a
            href="/dashboard"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow hover:brightness-110"
          >
            Go to Dashboard
          </a>
          <p className="mt-3 text-xs text-ink-muted">
            Questions? Contact{" "}
            <a href="mailto:kyc@quantis.app" className="text-signal-indigo hover:underline">
              kyc@quantis.app
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-20">
      {/* Progress stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                      done
                        ? "border-signal-indigo bg-signal-indigo"
                        : active
                        ? "border-signal-indigo bg-signal-indigo/10"
                        : "border-void-border bg-void-card2"
                    )}
                  >
                    {done ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Icon
                        size={16}
                        className={active ? "text-signal-indigo" : "text-ink-faint"}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-medium sm:block",
                      active ? "text-ink" : done ? "text-signal-indigo" : "text-ink-faint"
                    )}
                  >
                    {s.short}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 mb-5 h-0.5 flex-1 transition-colors duration-300",
                      step > s.id ? "bg-signal-indigo" : "bg-void-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <div className="rounded-2xl border border-void-border bg-void-panel/80 shadow-card backdrop-blur-xl">
        <div className="border-b border-void-border px-6 py-5">
          <div className="flex items-center gap-3">
            {(() => { const S = STEPS[step - 1]; const Icon = S.icon; return <Icon size={20} className="text-signal-indigo" />; })()}
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {STEPS[step - 1].label}
              </h2>
              <p className="text-xs text-ink-muted">Step {step} of {STEPS.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && <StepPersonal data={personal} setData={setPersonal} errors={errors} />}
          {step === 2 && <StepIdentity data={identity} setData={setIdentity} errors={errors} />}
          {step === 3 && <StepAddress data={address} setData={setAddress} errors={errors} />}
          {step === 4 && <StepFinancial data={financial} setData={setFinancial} errors={errors} />}
          {step === 5 && (
            <StepReview
              personal={personal}
              identity={identity}
              address={address}
              financial={financial}
              onEdit={(s) => { setStep(s); setErrors({}); }}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-void-border px-6 py-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1.5 rounded-xl border border-void-border bg-void-card2 px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-void-borderLight hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <span className="text-xs text-ink-faint">
            {step} / {STEPS.length}
          </span>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-signal-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-signal-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <><Shield size={15} /> Submit for Review</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-faint">
        {[
          { icon: Lock, label: "AES-256 encrypted" },
          { icon: Shield, label: "AML compliant" },
          { icon: CheckCircle2, label: "GDPR protected" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={12} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
