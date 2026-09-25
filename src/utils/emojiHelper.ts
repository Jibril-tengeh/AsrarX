/**
 * Utility to detect if a message consists exclusively of 1 to 4 emojis,
 * allowing modern chat apps (WhatsApp, Telegram style) to render single or
 * short emoji messages in large, animated, high-visibility formats.
 */

export interface EmojiDetectionResult {
  isOnlyEmoji: boolean;
  count: number;
}

export function detectEmojiOnlyMessage(text: string): EmojiDetectionResult {
  if (!text) return { isOnlyEmoji: false, count: 0 };
  const trimmed = text.trim();
  if (!trimmed) return { isOnlyEmoji: false, count: 0 };

  // Exclude mathematical codes or complex symbols that are not emojis
  if (trimmed.includes("http://") || trimmed.includes("https://") || trimmed.includes("\n")) {
    return { isOnlyEmoji: false, count: 0 };
  }

  try {
    // Use Intl.Segmenter to segment by user-perceived grapheme clusters
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(trimmed)).map((s) => s.segment);

    // Emojis matching pictographic ranges and modifiers
    const emojiRegex = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

    const isAllEmoji = segments.every((seg) => emojiRegex.test(seg) || seg.trim() === "");
    const nonSpaceSegments = segments.filter((seg) => seg.trim() !== "");

    if (isAllEmoji && nonSpaceSegments.length >= 1 && nonSpaceSegments.length <= 4) {
      return { isOnlyEmoji: true, count: nonSpaceSegments.length };
    }
  } catch (_) {
    // Fallback if Intl.Segmenter is unavailable
    const fallbackRegex = /^(\p{Extended_Pictographic}|\s)+$/u;
    if (fallbackRegex.test(trimmed) && trimmed.length <= 16) {
      return { isOnlyEmoji: true, count: 1 };
    }
  }

  return { isOnlyEmoji: false, count: 0 };
}
