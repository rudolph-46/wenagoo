/**
 * Slugify a string for use in URLs. Lowercase, removes accents, replaces
 * non-alphanumerics with single hyphens, trims leading/trailing hyphens.
 */
export function slugify(s: string): string {
	return s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
}
