import { useState } from "react";

type Props = {
  onGenerate: (theme: string) => void;
  onUseDefault: () => void;
  loading: boolean;
  bannerMessage: string | null;
};

export function IdleScreen({ onGenerate, onUseDefault, loading, bannerMessage }: Props) {
  const [theme, setTheme] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = theme.trim();
    if (!t) {
      setError("Enter a theme to generate a deck.");
      return;
    }
    setError(null);
    onGenerate(t);
  };

  return (
    <form className="idle" onSubmit={submit}>
      <h1 className="title">Pick a theme. Match the pairs.</h1>
      <p className="subtitle">Claude will generate a custom deck for you.</p>
      {bannerMessage && <div className="banner" data-testid="banner">{bannerMessage}</div>}
      <input
        type="text"
        placeholder='e.g. "Renaissance painters"'
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        disabled={loading}
        data-testid="theme-input"
        maxLength={80}
        aria-label="Deck theme"
      />
      <div className="inline-error" data-testid="theme-error">{error ?? ""}</div>
      <button className="btn-primary" type="submit" disabled={loading} data-testid="generate-btn">
        {loading ? "Generating…" : "Generate Deck"}
      </button>
      <button type="button" className="btn-link" onClick={onUseDefault} disabled={loading} data-testid="use-default">
        Play with default deck
      </button>
    </form>
  );
}
