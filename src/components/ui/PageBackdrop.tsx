export function PageBackdrop() {
  return (
    <div className="page-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <span className="backdrop-blob backdrop-blob-a" />
      <span className="backdrop-blob backdrop-blob-b" />
      <span className="backdrop-blob backdrop-blob-c" />
    </div>
  )
}
