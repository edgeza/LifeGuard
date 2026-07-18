/**
 * Animated radial-gradient background — three soft red blobs drifting in
 * 18–26s alternating cycles. Decorative; absolutely positioned so it
 * fills its parent.
 */
export function Aurora() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
    </div>
  );
}
