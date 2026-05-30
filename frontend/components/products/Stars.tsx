export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="sa-stars">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = i <= Math.floor(rating);
        const half = !full && i - 0.5 <= rating;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`star-${i}-${size}`}>
                <stop offset={half ? "50%" : full ? "100%" : "0%"} stopColor="#F59E0B" />
                <stop offset={half ? "50%" : full ? "100%" : "0%"} stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={full ? "#F59E0B" : half ? `url(#star-${i}-${size})` : "#D1D5DB"}
            />
          </svg>
        );
      })}
    </span>
  );
}