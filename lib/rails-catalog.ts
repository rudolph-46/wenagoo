import type { CanalHotel } from "./ota"

export type RailDefinition = {
	id: string
	slug: string
	title: string
	subtitle: string
	icon: string
	/** Subset of hotels matching this rail's criterion (in a given city). */
	matches: (hotels: CanalHotel[]) => CanalHotel[]
	/**
	 * Produces a unique 100–200 word paragraph for this rail in a given city.
	 * Uses the city name + a few signal facts so each (rail × city) page reads
	 * differently — that's the SEO win.
	 */
	copy: (cityName: string, matched: CanalHotel[]) => string
	metaTitle: (cityName: string) => string
	metaDescription: (cityName: string) => string
}

const normalize = (s?: string) => (s ?? "").toLowerCase()

function topHotelNames(matched: CanalHotel[], n = 3): string {
	return matched
		.slice(0, n)
		.map((h) => h.name)
		.join(", ")
}

export const RAILS: RailDefinition[] = [
	{
		id: "top-rated",
		slug: "mieux-notes",
		title: "Les mieux notés",
		subtitle: "Les adresses qui font la réputation de Wenagoo.",
		icon: "⭐",
		matches: (hotels) =>
			[...hotels].filter((h) => h.avgRating > 0).sort((a, b) => b.avgRating - a.avgRating),
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `Les hôtels les mieux notés de ${city} sur Wenagoo reflètent ce que la ville fait de mieux en hospitalité. Ici, chaque établissement a été noté par de vrais voyageurs après leur séjour — pas de faux avis, pas de classement payant : seulement la satisfaction réelle des clients. À ${city}, les adresses comme ${top || "nos partenaires locaux"} se distinguent par la qualité de l'accueil, la propreté irréprochable et la cohérence du service au fil du temps. Réserver dans un hôtel bien noté à ${city}, c'est se garantir une expérience qui correspond à la promesse affichée — un détail qui change tout, surtout en voyage d'affaires ou lors d'un court séjour. Tous nos partenaires acceptent le paiement Mobile Money et confirment la réservation rapidement, sans frais cachés.`
		},
		metaTitle: (city) => `Les hôtels les mieux notés à ${city} — Wenagoo`,
		metaDescription: (city) =>
			`Découvrez les hôtels les mieux notés de ${city} sur Wenagoo. Avis vérifiés, paiement Mobile Money, réservation immédiate.`,
	},
	{
		id: "premium",
		slug: "premium",
		title: "L'expérience premium",
		subtitle: "Pour un séjour où le confort se remarque dans chaque détail.",
		icon: "🌿",
		matches: (hotels) => hotels.filter((h) => h.stars >= 4),
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `Pour une expérience haut de gamme à ${city}, Wenagoo référence un cercle restreint d'hôtels 4 et 5 étoiles où chaque détail compte : literie premium, salles de bain spacieuses, service de conciergerie, restauration soignée. À ${city}, des adresses comme ${top || "nos établissements partenaires"} incarnent ce niveau d'exigence. Que ce soit pour un voyage d'affaires important, une lune de miel, ou simplement parce que vous avez envie de vous faire plaisir, ces hôtels offrent la tranquillité d'esprit qu'on attend d'un séjour premium — espaces privatifs, sécurité renforcée, équipes formées à l'hospitalité internationale. Le paiement reste flexible (Mobile Money ou carte à l'arrivée), et la réservation se fait en quelques clics, sans frais d'agence. Votre confort commence dès le clic sur "Réserver".`
		},
		metaTitle: (city) => `Hôtels premium à ${city} — séjours 4 et 5 étoiles | Wenagoo`,
		metaDescription: (city) =>
			`Sélection d'hôtels premium à ${city} : confort, service, équipements haut de gamme. Réservation Wenagoo, paiement Mobile Money.`,
	},
	{
		id: "beach",
		slug: "plage",
		title: "Pour un week-end à la plage",
		subtitle: "L'océan à portée de réservation.",
		icon: "🌊",
		matches: (hotels) => hotels,
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `Un week-end à la plage à ${city}, c'est l'évasion à portée de main pour les voyageurs d'Afrique centrale. Sur Wenagoo, ${top ? `${top} et d'autres établissements` : "nos partenaires locaux"} vous offrent un accès direct au littoral, des chambres avec vue mer, et une atmosphère pensée pour la déconnexion. À ${city}, le rythme ralentit dès l'arrivée : petit-déjeuner face à l'océan, journées à la plage, soirées en terrasse. Les hôtels que nous référençons sont tous vérifiés, avec un service réception en français, et la possibilité d'organiser des activités locales (excursions en bateau, dégustations de poisson frais, balades). Réservation immédiate, paiement Mobile Money ou à l'arrivée — vous n'avez qu'à choisir la date et préparer vos affaires de plage.`
		},
		metaTitle: (city) => `Hôtels en bord de mer à ${city} — Wenagoo`,
		metaDescription: (city) =>
			`Week-end à la plage à ${city} : sélection d'hôtels en bord de mer, vue océan, réservation Mobile Money.`,
	},
	{
		id: "culture",
		slug: "culture",
		title: "Découverte culturelle",
		subtitle: "Partez à la rencontre du Cameroun.",
		icon: "🎭",
		matches: (hotels) => hotels,
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `À ${city}, l'hôtel n'est pas qu'un lieu de repos — c'est souvent la porte d'entrée vers une expérience culturelle riche. Wenagoo référence des établissements bien situés à ${city}, à proximité immédiate des sites incontournables : musées, marchés traditionnels, palais royaux, ateliers d'artisans. Des adresses comme ${top || "celles de notre sélection"} vous permettent d'organiser facilement vos visites, avec des équipes locales qui connaissent les bons spots et les bons moments pour les visiter. Que vous voyagiez seul, en couple ou en famille, ces hôtels facilitent la découverte authentique de ${city} — sans tomber dans les pièges à touristes. Réservation flexible, paiement Mobile Money accepté, et possibilité de demander un guide local depuis le formulaire de réservation. Le Cameroun se découvre lentement — autant être bien logé.`
		},
		metaTitle: (city) => `Hôtels pour découverte culturelle à ${city} | Wenagoo`,
		metaDescription: (city) =>
			`Découverte culturelle à ${city} : hôtels proches des sites historiques, marchés et musées. Réservation Wenagoo.`,
	},
	{
		id: "business",
		slug: "business",
		title: "Court séjour d'affaires",
		subtitle: "Bien situés, équipés et réactifs.",
		icon: "💼",
		matches: (hotels) => hotels,
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `Pour un court séjour d'affaires à ${city}, la logistique fait toute la différence : Wi-Fi rapide, check-in rapide, réception 24/7, proximité avec les zones d'activité économique. Wenagoo a sélectionné à ${city} des hôtels comme ${top || "nos partenaires de confiance"} qui répondent précisément à ces critères. Pas de mauvaise surprise au check-in, pas de connexion qui rame en pleine visio, pas de réception introuvable à 22h après un vol retardé. Les équipes sont formées pour les voyageurs d'affaires — facturation propre, service blanchisserie express, petit-déjeuner adapté aux horaires matinaux. Réservation en quelques secondes, paiement Mobile Money pour vos remboursements en interne, et la possibilité d'ajouter un service voiture depuis le formulaire. Votre déplacement à ${city} mérite mieux qu'une plateforme générique.`
		},
		metaTitle: (city) => `Hôtels affaires à ${city} — Wi-Fi, réception 24/7 | Wenagoo`,
		metaDescription: (city) =>
			`Court séjour d'affaires à ${city} : hôtels bien situés, équipés pour le business, réservation Mobile Money.`,
	},
	{
		id: "budget",
		slug: "moins-30000-xaf",
		title: "Moins de 30 000 XAF",
		subtitle: "Du confort vérifié, à un prix qui ne triche pas.",
		icon: "💰",
		matches: (hotels) => hotels.filter((h) => h.lowestCanalPrice > 0 && h.lowestCanalPrice <= 30000),
		copy: (city, matched) => {
			const top = topHotelNames(matched, 3)
			return `Trouver un hôtel à ${city} pour moins de 30 000 XAF par nuit, c'est possible sans sacrifier le confort — à condition de savoir où chercher. Wenagoo vérifie chaque établissement de cette catégorie : propreté, fiabilité de la réception, qualité du Wi-Fi, sécurité du quartier. Des adresses comme ${top || "notre sélection budget"} prouvent qu'on peut bien dormir à ${city} sans se ruiner. Pas d'arnaque, pas de photos trompeuses : ce que vous voyez est ce que vous obtenez. Idéal pour les voyageurs jeunes, les courts séjours, les déplacements professionnels avec budget serré, ou simplement ceux qui préfèrent dépenser leur argent en restaurants et activités plutôt qu'en chambre. Réservation immédiate, paiement Mobile Money ou à l'arrivée — aucun frais caché.`
		},
		metaTitle: (city) => `Hôtels pas chers à ${city} (moins de 30 000 XAF) | Wenagoo`,
		metaDescription: (city) =>
			`Hôtels à ${city} à moins de 30 000 XAF/nuit, vérifiés par Wenagoo. Réservation immédiate, paiement Mobile Money.`,
	},
]

export function getRailBySlug(slug: string): RailDefinition | undefined {
	return RAILS.find((r) => r.slug === slug)
}

/**
 * Pour la rail "beach" / "culture" / "business", on filtre par ville implicitement
 * (la ville étant déjà dans l'URL). Toutes les rails de ce catalogue retournent
 * juste un sous-ensemble des hôtels de la ville selon le critère.
 */
export function railHotelsForCity(rail: RailDefinition, hotels: CanalHotel[]): CanalHotel[] {
	return rail.matches(hotels)
}

export { normalize }
