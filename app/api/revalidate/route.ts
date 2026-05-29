import { revalidateTag } from "next/cache"

export async function POST(req: Request) {
	const secret = req.headers.get("x-revalidate-secret")
	if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
		return Response.json({ error: "Unauthorized" }, { status: 401 })
	}

	let body: { tags?: unknown }
	try {
		body = await req.json()
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 })
	}

	const tags = body.tags
	if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
		return Response.json({ error: "tags must be string[]" }, { status: 400 })
	}

	for (const tag of tags as string[]) {
		revalidateTag(tag, "default")
	}

	return Response.json({ ok: true, count: tags.length })
}
