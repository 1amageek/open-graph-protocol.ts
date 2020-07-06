# open-graph-protocol.ts


## Usage

```typescript
const og: OpenGraph.Metadata<"video.movie"> = {
	type: "video.movie",
	title: "Open Graph Protocol",
	image: "image url",
	url: "url",
	locale: ["en_US", { alternate: "en_GB" }, { alternate: "id_ID" }],
	video: {
		url: "video url",
		actor: "1amageek",
		director: "director 1amageek",
		writer: "writer 1amageek",
		duration: 122,
		release_date: new Date(),
		tag: ["a", "b", "c"]
	}
}

const metadata = {
	og: og
}

console.log(OpenGraph.build(metadata))

```
