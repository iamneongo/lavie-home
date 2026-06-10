type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return (
    <span className={`lavie-wordmark ${className}`}>
      <span className="lavie-logo-line">
        <span className="lavie-script">Lavie</span>
        <span className="lavie-home-text">home</span>
      </span>
    </span>
  );
}
