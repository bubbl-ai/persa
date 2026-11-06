# Character links for Reels and campaigns

Each link opens Persa with that character selected in the spotlight. Use it as the destination for a Reel, bio link, message or campaign. Visitors can then choose **Open in Muse**.

These links identify the default character preset. They do not contain or transfer browser-local saved tone changes; a returning visitor’s own saved tone settings may still apply on their device. Muse still requires Send and avatar selection.

| Character | Direct link |
| --- | --- |
| Wednesday Addams | [Open Wednesday Addams](https://persa.bubblai.com/character/wednesday) |
| Taylor Swift | [Open Taylor Swift](https://persa.bubblai.com/character/taylorswift) |
| Mark Zuckerberg | [Open Mark Zuckerberg](https://persa.bubblai.com/character/markzuckerberg) |
| Mona Lisa | [Open Mona Lisa](https://persa.bubblai.com/character/monalisa) |
| Barbie | [Open Barbie](https://persa.bubblai.com/character/barbie) |
| Harry Potter | [Open Harry Potter](https://persa.bubblai.com/character/harrypotter) |
| Charlie Chaplin | [Open Charlie Chaplin](https://persa.bubblai.com/character/charliechaplin) |
| Michael Jackson | [Open Michael Jackson](https://persa.bubblai.com/character/michaeljackson) |
| Olivia Rodrigo | [Open Olivia Rodrigo](https://persa.bubblai.com/character/oliviarodrigo) |
| Marilyn Monroe | [Open Marilyn Monroe](https://persa.bubblai.com/character/marilynmonroe) |
| Drake | [Open Drake](https://persa.bubblai.com/character/drake) |
| Lionel Messi | [Open Lionel Messi](https://persa.bubblai.com/character/lionelmessi) |
| Kylie Jenner | [Open Kylie Jenner](https://persa.bubblai.com/character/kyliejenner) |
| MrBeast | [Open MrBeast](https://persa.bubblai.com/character/mrbeast) |
| The Rock | [Open The Rock](https://persa.bubblai.com/character/therock) |
| SpongeBob | [Open SpongeBob](https://persa.bubblai.com/character/spongebob) |
| Hello Kitty | [Open Hello Kitty](https://persa.bubblai.com/character/hellokitty) |
| The Joker | [Open The Joker](https://persa.bubblai.com/character/joker) |

To track a campaign, append parameters such as `?utm_source=instagram&utm_medium=reel&utm_campaign=launch`. For example: `https://persa.bubblai.com/character/lionelmessi?utm_source=instagram&utm_medium=reel`. Character browsing preserves incoming campaign parameters and page anchors. **Share** uses the clean canonical character URL above.

Earlier links such as `/?character=lionel-messi` or `/?character=lionelmessi` still select the same character. Hyphenated paths such as `/character/lionel-messi` also work. Unknown character paths return 404 rather than opening an unrelated preset. The separate saved/full collection keeps its `collection.html?view=saved&character=<id>` routing so a detail link does not discard the collection context.
