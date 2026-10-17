export function LearnerAvatar({ avatar, alias }: { avatar: string; alias: string }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-bg text-lg shadow-soft"
      role="img"
      aria-label={`Avatar for ${alias}`}
    >
      {avatar}
    </span>
  )
}
