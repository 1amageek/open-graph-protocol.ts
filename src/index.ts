
type DateTime = Date

type Url = string

export namespace OpenGraph {
	// Object Types

	type WebsiteType = "website"

	type ArticleType = "article"

	type ProductType = "product"

	type BookType = "book"

	type ProfileType = "profile"

	type MusicType = "music.song" | "music.album" | "music.playlist" | "music.radio_station"

	type VideoType = "video" | "video.movie" | "video.episode"

	type ObjectType = WebsiteType | ArticleType | ProductType | BookType | ProfileType | VideoType

	interface Alternate {
		alternate: string
	}

	interface Basic {
		// Basic
		title: string
		image: Url | Image
		url: Url

		// Optional
		audio?: Url | Audio
		description?: string
		determiner?: string
		locale?: string | Array<string | Alternate>
		site_name?: string
	}

	interface Image {
		url: string
		secure_url?: Url
		type?: string
		width?: string
		height?: string
		alt?: string
	}

	interface Audio {
		url: string
		secure_url?: string
		type?: string
	}

	interface Website<T extends WebsiteType> extends Basic {
		type: T
	}

	interface Article<T extends ArticleType> extends Basic {
		type: T
		article: {

			// article:published_time - datetime - When the article was first published.
			published_time: DateTime

			// article:modified_time - datetime - When the article was last changed.
			modified_time: DateTime

			// article:expiration_time - datetime - When the article is out of date after.
			expiration_time: DateTime

			// article:author - profile array - Writers of the article.
			author: Url | Url[]

			// article:section - string - A high - level section name.E.g.Technology
			section: string

			// article:tag - string array - Tag words associated with this article.
			tag: string | string[]
		}
	}

	interface Amount {
		amount: number
	}

	interface Currency {
		currency: string
	}

	interface Product<T extends ProductType> extends Basic {
		type: T
		product: {

			// product:plural_title - Title of the product when a quantity more than 1 is purchased.
			plural_title?: string

			// book:isbn - string - The ISBN
			price: Array<Amount | Currency>
		}
	}

	interface Book<T extends BookType> extends Basic {
		type: T
		book: {

			// book:author - profile array - Who wrote this book.
			author: Url | Url[]

			// book:isbn - string - The ISBN
			isbn: string

			// book:release_date - datetime - The date the book was released.
			release_date: DateTime

			// book:tag - string array - Tag words associated with this book.
			tag: string | string[]
		}
	}

	interface Profile<T extends ProfileType> extends Basic {
		type: T
		book: {

			// profile:first_name - string - A name normally given to an individual by a parent or self-chosen.
			first_name: string

			// profile:last_name - string - A name inherited from a family or marriage and by which the individual is commonly known.
			last_name: string

			// profile:username - string - A short unique string to identify them.
			username: string

			// profile:gender - enum(male, female) - Their gender.
			gender: "male" | "female"
		}
	}

	interface Music<T extends MusicType> extends Basic {
		type: T
		music: Url | Music.Props<T>
	}

	interface Video<T extends VideoType> extends Basic {
		type: T
		video: Url | Video.Props<T>
	}

	namespace Music {

		interface Disc {
			// music:song:disc - The disc number this song is on within this album [defaults to ‘1’]
			disc: number
		}

		interface Track {
			// music:song:track - The track number of this song on this album [relative to the disc number]
			track: number
		}

		export interface Song {

			// music:duration - integer >= 1 - The song's length in seconds.
			duration: number

			// music:album - music.album array - The album this song is from.
			album: Url | Array<Url | Disc | Track>
			// music:musician - profile array - The musician that made this song.
			musician: Url
		}

		export interface Album {
			// music:song - music.song - The song on this album.
			song: Url | Url[] | Array<Url | Disc | Track>

			// music:musician - profile - The musician that made this song.
			musician: Url

			// music:release_date - datetime - The date the album was released.
			release_date: DateTime
		}

		export interface Playlist {

			// music:song - Identical to the ones on music.album
			song: Url | Url[] | Array<Url | Disc | Track>

			// music:creator - profile - The creator of this playlist.
			creator: Url
		}

		export interface RadioStation {

			// music:creator - profile -  The creator of this station.
			creator: Url
		}

		export type Props<T extends MusicType> =
			T extends "music.song" ? Music.Song :
			T extends "music.album" ? Music.Album :
			T extends "music.playlist" ? Music.Playlist :
			T extends "music.radio_station" ? Music.RadioStation :
			never
	}

	namespace Video {

		interface Role {
			role: string
		}

		export interface Base {
			url: string
			secure_url?: string
			type?: string
			width?: string
			height?: string
		}

		export interface Movie extends Base {
			// video:actor - profile array - Actors in the movie.
			actor: string | string[] | Array<string | Role>

			// video:director - profile array - Directors of the movie.
			director: Url | Url[]

			// video:writer - profile array - Writers of the movie.
			writer: Url | Url[]

			// video:duration - integer >=1 - The movie's length in seconds.
			duration: number

			// video:release_date - datetime - The date the movie was released.
			release_date: DateTime

			// video:tag - string array - Tag words associated with this movie.
			tag: string | string[]
		}

		export interface Episode extends Base {
			// video:actor - profile array - Actors in the movie.
			actor: string | string[] | Array<string | Role>

			// video:director - profile array - Directors of the movie.
			director: string | string[]

			// video:writer - profile array - Writers of the movie.
			writer: string | string[]

			// video:duration - integer >=1 - The movie's length in seconds.
			duration: number

			// video:release_date - datetime - The date the movie was released.
			release_date: DateTime

			// video:tag - string array - Tag words associated with this movie.
			tag: string | string[]

			// video:series - video.tv_show - Which series this episode belongs to.
			series: string
		}

		export type Props<T extends VideoType> =
			T extends "video" ? Video.Base :
			T extends "video.movie" ? Video.Movie :
			T extends "video.episode" ? Video.Episode :
			never
	}

	export type Metadata<T extends ObjectType> =
		T extends WebsiteType ? Website<T> :
		T extends ArticleType ? Article<T> :
		T extends ProductType ? Product<T> :
		T extends BookType ? Book<T> :
		T extends ProfileType ? Profile<T> :
		T extends MusicType ? Music<T> :
		T extends VideoType ? Video<T> :
		never

	interface Meta {
		property: string
		content: string
	}

	const buildIfArray = (object: any[], parent?: string) => {
		let data: Meta[] = []
		for (const item of object) {
			const result = build(item, parent)
			data = data.concat(result)
		}
		return data
	}

	const buildIfObject = (object: { [key: string]: any }, parent?: string) => {
		let data: Meta[] = []
		for (const key of Object.keys(object)) {
			const value = object[key]
			const property = parent ? `${parent}:${key}` : key
			const content = build(value, property)
			data = data.concat(content)
		}
		return data
	}

	export const build = (object: any, parent?: string) => {
		let data: Meta[] = []
		let property = parent
		if (Array.isArray(object)) {
			const content = buildIfArray(object, property)
			data = data.concat(content)
		} else if (typeof object === "object") {
			const content = buildIfObject(object, property)
			data = data.concat(content)
		} else if (typeof object === "string") {
			const content = `${object}`
			data.push({ property: property!, content })
		} else if (typeof object === "number") {
			const content = `${object}`
			data.push({ property: property!, content })
		}
		return data
	}
}
