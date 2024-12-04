import { App, Notice, Plugin, PluginSettingTab, Setting, normalizePath, requestUrl } from 'obsidian';
import Setlist from 'setlistfm-js'

/**
 * Rate limit max. 2.0/second and max. 1440/DAY.
 * More can be requested if necessary.
 */

interface SetlistSettings {
	username?: string
	apiKey?: string
}

/**
 * ```
 * {
    "type": "setlists",
    "itemsPerPage": 20,
    "page": 1,
    "total": 5,
    "setlist": [
        {
            "id": "5356cf11",
            "versionId": "g13acb525",
            "eventDate": "16-08-2024",
            "lastUpdated": "2024-08-17T03:59:42.335+0000",
            "artist": {
                "mbid": "081b133e-ce74-42ba-92c1-c18234acb532",
                "name": "Andrew Bird",
                "sortName": "Bird, Andrew",
                "disambiguation": "US indie rock multi-instrumentalist, singer, and songwriter",
                "url": "https://www.setlist.fm/setlists/andrew-bird-43d69b6f.html"
            },
            "venue": {
                "id": "23d2042b",
                "name": "The Rooftop at Pier 17",
                "city": {
                    "id": "5128581",
                    "name": "New York",
                    "state": "New York",
                    "stateCode": "NY",
                    "coords": {
                        "lat": 40.7142691,
                        "long": -74.0059729
                    },
                    "country": {
                        "code": "US",
                        "name": "United States"
                    }
                },
                "url": "https://www.setlist.fm/venue/the-rooftop-at-pier-17-new-york-ny-usa-23d2042b.html"
            },
            "sets": {
                "set": [
                    {
                        "song": [
                            {
                                "name": "Softly as in a Morning Sunrise"
                            },
                            {
                                "name": "I Fall in Love Too Easily"
                            },
                            {
                                "name": "Why?"
                            },
                            {
                                "name": "Bloodless"
                            },
                            {
                                "name": "You'd Be So Nice to Come Home to",
                                "cover": {
                                    "mbid": "4a94a6cb-e70a-418b-bb53-a37897b950ce",
                                    "name": "Cole Porter",
                                    "sortName": "Porter, Cole",
                                    "disambiguation": "composer",
                                    "url": "https://www.setlist.fm/setlists/cole-porter-73d60add.html"
                                }
                            },
                            {
                                "name": "Atomized"
                            },
                            {
                                "name": "Sisyphus"
                            },
                            {
                                "name": "Underlands"
                            },
                            {
                                "name": "The Night Before Your Birthday"
                            },
                            {
                                "name": "A Nervous Tic Motion of the Head to the Left"
                            },
                            {
                                "name": "Roma Fade"
                            },
                            {
                                "name": "Faithless Ghost"
                            },
                            {
                                "name": "Orpheo"
                            },
                            {
                                "name": "Manifest"
                            },
                            {
                                "name": "Caravan",
                                "cover": {
                                    "mbid": "c01557ad-d41e-4316-a285-605769e2ab3b",
                                    "name": "Duke Ellington and His Orchestra",
                                    "sortName": "Ellington, Duke and His Orchestra",
                                    "disambiguation": "",
                                    "url": "https://www.setlist.fm/setlists/duke-ellington-and-his-orchestra-1bd6b5d4.html"
                                }
                            },
                            {
                                "name": "Tables and Chairs"
                            }
                        ]
                    },
                    {
                        "encore": 1,
                        "song": [
                            {
                                "name": "Pulaski at Night"
                            },
                            {
                                "name": "Capsized"
                            }
                        ]
                    }
                ]
            },
            "url": "https://www.setlist.fm/setlist/andrew-bird/2024/the-rooftop-at-pier-17-new-york-ny-5356cf11.html"
        },
        {
            "id": "23ab04a3",
            "versionId": "g3bbaa4d0",
            "eventDate": "05-04-2024",
            "lastUpdated": "2024-05-07T18:31:13.004+0000",
            "artist": {
                "mbid": "1213b8e7-79f0-4cc2-a12a-81448aaf3429",
                "name": "San Fermin",
                "sortName": "San Fermin",
                "disambiguation": "",
                "url": "https://www.setlist.fm/setlists/san-fermin-33dad475.html"
            },
            "venue": {
                "id": "3d1b54b",
                "name": "Racket",
                "city": {
                    "id": "5128581",
                    "name": "New York",
                    "state": "New York",
                    "stateCode": "NY",
                    "coords": {
                        "lat": 40.7142691,
                        "long": -74.0059729
                    },
                    "country": {
                        "code": "US",
                        "name": "United States"
                    }
                },
                "url": "https://www.setlist.fm/venue/racket-new-york-ny-usa-3d1b54b.html"
            },
            "sets": {
                "set": [
                    {
                        "song": [
                            {
                                "name": "Weird Environment"
                            },
                            {
                                "name": "The Hunger"
                            },
                            {
                                "name": "Emily"
                            },
                            {
                                "name": "My Love is a Loneliness"
                            },
                            {
                                "name": "Arms"
                            },
                            {
                                "name": "Makes Me Want You"
                            },
                            {
                                "name": "The Woods"
                            },
                            {
                                "name": "Bride"
                            },
                            {
                                "name": "Useful Lies"
                            },
                            {
                                "name": "Sonsick",
                                "info": "Joined by trumpeter"
                            },
                            {
                                "name": "Can't Unsee It"
                            },
                            {
                                "name": "No Devil"
                            },
                            {
                                "name": "Didn't Want You To"
                            },
                            {
                                "name": "Cairo"
                            },
                            {
                                "name": "The Living"
                            },
                            {
                                "name": "You Owe Me"
                            },
                            {
                                "name": "Wasting on Me"
                            },
                            {
                                "name": "Belong"
                            },
                            {
                                "name": "Jackrabbit"
                            }
                        ]
                    }
                ]
            },
            "url": "https://www.setlist.fm/setlist/san-fermin/2024/racket-new-york-ny-23ab04a3.html"
        },
        {
            "id": "bb7ddf6",
            "versionId": "g4bc8ef92",
            "eventDate": "08-05-2022",
            "lastUpdated": "2022-05-09T04:18:28.877+0000",
            "artist": {
                "mbid": "b7a65497-9fba-46b5-8c4e-0311cf6943b0",
                "name": "Darlingside",
                "sortName": "Darlingside",
                "disambiguation": "",
                "url": "https://www.setlist.fm/setlists/darlingside-bdb7562.html"
            },
            "venue": {
                "id": "5bd61fdc",
                "name": "Music Hall of Williamsburg",
                "city": {
                    "id": "5110302",
                    "name": "Brooklyn",
                    "state": "New York",
                    "stateCode": "NY",
                    "coords": {
                        "lat": 40.65,
                        "long": -73.95
                    },
                    "country": {
                        "code": "US",
                        "name": "United States"
                    }
                },
                "url": "https://www.setlist.fm/venue/music-hall-of-williamsburg-brooklyn-ny-usa-5bd61fdc.html"
            },
            "sets": {
                "set": []
            },
            "url": "https://www.setlist.fm/setlist/darlingside/2022/music-hall-of-williamsburg-brooklyn-ny-bb7ddf6.html"
        },
        {
            "id": "6b884e96",
            "versionId": "g63ce06af",
            "eventDate": "24-02-2022",
            "lastUpdated": "2022-03-08T08:12:44.842+0000",
            "artist": {
                "mbid": "70c5a8f1-5c53-4e1c-a90a-461e11e799c1",
                "name": "dodie",
                "sortName": "dodie",
                "disambiguation": "English singer-songwriter, author, and YouTuber",
                "url": "https://www.setlist.fm/setlists/dodie-13c44da9.html"
            },
            "venue": {
                "id": "73d45aa1",
                "name": "Kings Theatre",
                "city": {
                    "id": "5110302",
                    "name": "Brooklyn",
                    "state": "New York",
                    "stateCode": "NY",
                    "coords": {
                        "lat": 40.65,
                        "long": -73.95
                    },
                    "country": {
                        "code": "US",
                        "name": "United States"
                    }
                },
                "url": "https://www.setlist.fm/venue/kings-theatre-brooklyn-ny-usa-73d45aa1.html"
            },
            "tour": {
                "name": "Build A Problem"
            },
            "sets": {
                "set": [
                    {
                        "song": [
                            {
                                "name": "Air So Sweet"
                            },
                            {
                                "name": "Cool Girl"
                            },
                            {
                                "name": "I Kissed Someone (It Wasn’t You)"
                            },
                            {
                                "name": "Guiltless"
                            },
                            {
                                "name": "Human"
                            },
                            {
                                "name": "Special Girl"
                            },
                            {
                                "name": "Sad Song Mashup"
                            },
                            {
                                "name": "Sick of Losing Soulmates"
                            },
                            {
                                "name": "?"
                            },
                            {
                                "name": "Four Tequilas Down"
                            },
                            {
                                "name": "."
                            },
                            {
                                "name": "Sorry"
                            },
                            {
                                "name": "When"
                            },
                            {
                                "name": "Before the Line"
                            },
                            {
                                "name": "Rainbow"
                            },
                            {
                                "name": "She"
                            },
                            {
                                "name": "If I'm Being Honest"
                            },
                            {
                                "name": "Boys Like You"
                            },
                            {
                                "name": "Monster"
                            },
                            {
                                "name": "In the Middle"
                            }
                        ]
                    },
                    {
                        "encore": 1,
                        "song": [
                            {
                                "name": "Hate Myself"
                            }
                        ]
                    }
                ]
            },
            "url": "https://www.setlist.fm/setlist/dodie/2022/kings-theatre-brooklyn-ny-6b884e96.html"
        },
        {
            "id": "23886497",
            "versionId": "g13e35d35",
            "eventDate": "18-02-2022",
            "lastUpdated": "2022-12-27T22:29:18.319+0000",
            "artist": {
                "mbid": "6e91d65a-ab21-49b7-b81d-11c53c65601a",
                "name": "Valley",
                "sortName": "Valley",
                "disambiguation": "Toronto alternative pop band",
                "url": "https://www.setlist.fm/setlists/valley-1bf6c548.html"
            },
            "venue": {
                "id": "4bd61f3e",
                "name": "Irving Plaza",
                "city": {
                    "id": "5128581",
                    "name": "New York",
                    "state": "New York",
                    "stateCode": "NY",
                    "coords": {
                        "lat": 40.7142691,
                        "long": -74.0059729
                    },
                    "country": {
                        "code": "US",
                        "name": "United States"
                    }
                },
                "url": "https://www.setlist.fm/venue/irving-plaza-new-york-ny-usa-4bd61f3e.html"
            },
            "tour": {
                "name": "The I'll Be With You Tour"
            },
            "sets": {
                "set": [
                    {
                        "song": [
                            {
                                "name": "Last Birthday"
                            },
                            {
                                "name": "nevermind"
                            },
                            {
                                "name": "Tempo"
                            },
                            {
                                "name": "Oh Shit...are we in love?"
                            },
                            {
                                "name": "Cure"
                            },
                            {
                                "name": "sucks to see you doing better"
                            },
                            {
                                "name": "A Phone Call in Amsterdam"
                            },
                            {
                                "name": "Boys and Girls of 2018 and Everything in Between"
                            },
                            {
                                "name": "Park Bench"
                            },
                            {
                                "name": "7 Stories"
                            },
                            {
                                "name": "All the Animals I Drew as a Kid / Landslide"
                            },
                            {
                                "name": "hiccup"
                            },
                            {
                                "name": "Can We Make It? (Jim Carrey)"
                            },
                            {
                                "name": "You"
                            },
                            {
                                "name": "Swim"
                            },
                            {
                                "name": "SOCIETY"
                            },
                            {
                                "name": "homebody"
                            },
                            {
                                "name": "There's Still a Light in the House"
                            },
                            {
                                "name": "Like 1999"
                            }
                        ]
                    }
                ]
            },
            "url": "https://www.setlist.fm/setlist/valley/2022/irving-plaza-new-york-ny-23886497.html"
        }
    ]
}
```
 */
interface SetlistAttended {
	itemsPerPage: number
	page: number
	total: number
	type: 'setlists'
	setlist: Concert[]
}

interface Concert {
	artist: {
		disambiguation: string
		mbid: string
		/** ie. "Andrew Bird" */
		name: string
		/** ie. "Bird, Andrew" */
		sortName: string
		url: string
	}
	/** ie. "16-08-2024" */
	eventDate: string
	id: string
	lastUpdated: string
	sets: {
		set: unknown[]
		url: string
	}
	venue: {
		city: {
			coords: unknown
			country: unknown
			id: string
			name: string
			state: string
			stateCode: string
		}
		name: string
		id: string
		url: string
	}
	url: string
}

const DEFAULT_SETTINGS: SetlistSettings = {
	username: undefined,
	apiKey: undefined,
}

async function fetchPage(username: string, page: number, apiKey: string): Promise<SetlistAttended> {
	console.debug(`https://api.setlist.fm/rest/1.0/user/${username}/attended?p=${page}`)
	const res = await requestUrl({
		url: `https://api.setlist.fm/rest/1.0/user/${username}/attended?p=${page}`,
		headers: {
			'X-Api-Key': apiKey,
			Accept: 'application/json',
			'Accept-Language': 'en',
		}
	})
	return res.json
}

export default class SetlistPlugin extends Plugin {
	settings: SetlistSettings;
	setlist: any;

	async onload() {
		this.addCommand({
			id: 'sync',
			name: 'Sync attended concerts',
			callback: async () => {
				await this.loadSettings();
				if (!this.settings.username) {
					new Notice('No username found')
					return
				}
				if (!this.settings.apiKey) {
					new Notice('No API key found')
					return
				}

				this.setlist = new Setlist({
					key: this.settings.apiKey,
				})

				const setlists: Concert[] = []
				let page = 1
				while (true) {
					const concerts = await fetchPage(this.settings.username!, page++, this.settings.apiKey!)
					setlists.push(...concerts.setlist)
					if (concerts.setlist.length < concerts.itemsPerPage) {
						break;
					}
				}
				const filename = normalizePath('/Setlist.fm Concerts Attended.md')

				const syncedContents = setlists.map(c => {
					// go from 16-08-2024 to 2024-08-16
					const ed = c.eventDate.split('-')
					const journalDate = `${ed[2]}-${ed[1]}-${ed[0]}`
					return `- Saw **${c.artist.name}** play at *${c.venue.name}* in [[${c.venue.city.name}]] on [[${journalDate}]]`
				}) 


				const diaryFile = this.app.vault.getFileByPath(filename)
				if (diaryFile === null) {
					this.app.vault.create(filename, `${syncedContents.join('\n')}`)
				} else {
					this.app.vault.process(diaryFile, (data) => {
						const diaryContentsArr = data.split('\n')
						const diaryContentsSet = new Set(diaryContentsArr)
						syncedContents.forEach((entry: string) => diaryContentsSet.add(entry))
						return `${[...diaryContentsSet].join('\n')}`
					})
				}
				new Notice('Setlist concerts synced')
			},
		})

		this.addSettingTab(new SetlistSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(settings: SetlistSettings) {
		await this.saveData(settings);
	}
}

class SetlistSettingTab extends PluginSettingTab {
	plugin: SetlistPlugin;
	settings: any

	constructor(app: App, plugin: SetlistPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
		const {containerEl} = this;
		this.settings = await this.plugin.loadData() ?? DEFAULT_SETTINGS

		containerEl.empty();

		new Setting(containerEl)
		.setName('setlist.fm API key')
		.setDesc('Client API key')
		.addText((component) => {
			component.setValue(this.settings?.apiKey)
			component.onChange(async (value) => {
				this.settings.apiKey = value
				await this.plugin.saveSettings(this.settings)
			})
		})

		new Setting(containerEl)
			.setName('setlist.fm Username')
			.addText((component) => {
				component.setValue(this.settings?.username)
				component.onChange(async (value) => {
					this.settings.username = value
					await this.plugin.saveSettings(this.settings)
				})
			})
	}
}
