// Content type display names
export const contentTypeNames = {
  small_schools_article: "Small School's Article",
  kevons_newsletter: "Kevon's Newsletter",
  kevons_personal_essay: "Kevon's Personal Essay",
  kevons_social_posts: "Kevon's Social Posts"
} as const;

// Format date for display
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 