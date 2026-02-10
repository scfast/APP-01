export default function LabFormsPage() {
  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">CSRF Lab Forms</h1>
        <p className="text-sm text-slate-300">
          These forms post to training endpoints. Use ZAP to detect missing
          anti-CSRF protections.
        </p>
      </div>

      <form
        className="card space-y-3"
        method="POST"
        action="/api/lab/notes"
      >
        <h2 className="text-lg font-semibold">Submit a lab note</h2>
        <textarea
          className="input min-h-[120px]"
          name="content"
          placeholder="Note content"
        />
        <button className="button" type="submit">
          Save note
        </button>
      </form>
    </div>
  );
}
