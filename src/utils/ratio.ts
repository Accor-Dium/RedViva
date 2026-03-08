export type CardRatio = "1:1" | "3:4" | "4:3"

const RATIO_VALUES: Record<CardRatio, number> = {
	"1:1": 1,
	"3:4": 3 / 4,
	"4:3": 4 / 3,
}

export function getClosestRatio(width: number, height: number): CardRatio {
	if (!width || !height) return "1:1"

	const aspect = width / height
	const entries = Object.entries(RATIO_VALUES) as [CardRatio, number][]

	return entries.reduce((closest, current) => {
		const closestDiff = Math.abs(aspect - closest[1])
		const currentDiff = Math.abs(aspect - current[1])
		return currentDiff < closestDiff ? current : closest
	})[0]
}

export function buildCloudinaryInfoUrl(imageUrl: string): string | null {
	if (!imageUrl.includes("res.cloudinary.com") || !imageUrl.includes("/upload/")) {
		return null
	}

	return imageUrl.replace("/upload/", "/upload/fl_getinfo/")
}

export async function getImageRatioFromCloudinary(imageUrl: string | null): Promise<CardRatio> {
	if (!imageUrl) return "1:1"

	const infoUrl = buildCloudinaryInfoUrl(imageUrl)
	if (!infoUrl) return "1:1"

	try {
		const response = await fetch(infoUrl)
		if (!response.ok) return "1:1"

		const json = await response.json()
		const width = Number(json?.input?.width)
		const height = Number(json?.input?.height)

		if (!Number.isFinite(width) || !Number.isFinite(height)) {
			return "1:1"
		}

		return getClosestRatio(width, height)
	} catch {
		return "1:1"
	}
}
