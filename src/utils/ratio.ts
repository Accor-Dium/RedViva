import { RATIO_DEFAULT, RATIO_VALUES } from "../constants/components/tarjetas"
import type { CardRatio } from "../types/directorio/InterfaceTarjInformativas"

export function getClosestRatio(width: number, height: number): CardRatio {
	if (!width || !height) return RATIO_DEFAULT

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
	if (!imageUrl) return RATIO_DEFAULT

	const infoUrl = buildCloudinaryInfoUrl(imageUrl)
	if (!infoUrl) return RATIO_DEFAULT

	try {
		const response = await fetch(infoUrl)
		if (!response.ok) return RATIO_DEFAULT

		const json = await response.json()
		const width = Number(json?.input?.width)
		const height = Number(json?.input?.height)

		if (!Number.isFinite(width) || !Number.isFinite(height)) {
			return RATIO_DEFAULT
		}

		return getClosestRatio(width, height)
	} catch {
		return RATIO_DEFAULT
	}
}
