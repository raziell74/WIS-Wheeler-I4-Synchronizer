# This is a project to automate synchronization of i4 icons with Wheeler

There are many different i4 icon providers out there, and recently Wheeler has had several patches to customize icons. But there are so many different configurations a person can have and the Wheeler icon packs rarely match up to what you're seeing in your game inventory which is managed by i4. The author of i4 has mentioned in the posts on nexus that he plans on implementing an API to allow other mods to query for which icon should be shown, as far as I can tell he hasn't had any time to work on his glorious creation since that time, leaving us in a sort of mismatched icon hell...

So I said to myself.. Self, I knew it was me because I said it in my voice was in my voice and I was wearing my pants, Self THERE.HAS.GOT.TO.BE.A.BETTER.WAY!
so... BEHOLD MY WIS!

`WIS - Wheeler I4 Synchronizer` is an automation tool that reads in your load order and i4 configuration files to determine the final icon and color configurations for all your items. Then for each item/spell/power configured by i4, `WIS` will extract the icon sprite from its swf file and convert it to an svg. The svg will then be saved with the correct Wheeler naming conventions to assign the icon to the item/spell/power within Wheeler.

MO2 users be sure to set `WIS` as an executable and run it through MO2, this will ensure that the correct load order is used to determine the final icon and color configurations. The new Wheeler icons will be output to the MO2 overwrite folder.

# Step 1 - i4 Configuration Mapping

This is the first step of the automation process.
The results will be cached in a json file.
The user can view the configuration in its own screen and make manual adjustments at any time.
They will also have the option to refresh this mapping by rerunning this step. Refreshing will overwrite any manual adjustments made by the user.

## Get Load Order

Approach TBD

## Get all i4 Configuration files

Approach TBD

## Sort i4 Configuration files by load order

Approach TBD

## Parse i4 configuration files and create a map of item/spell/power icon and color settings

Approach TBD

## Extrapolate a Wheeler file name that adheres to the Wheeler Naming Convention for each Mapped item/spell/power setting

Approach TBD

# Step 2 - Extract Icons from swf files and convert to svg

This step utilizes SWFTool executables to process the .swf files at the command line. It then uses (svg-png-converter)[https://www.npmjs.com/package/svg-png-converter] to convert the PNG to an SVG using a Potrace image tracer.

## Dump info on swf files strings

**_Run the Command_**

```javascript
const swfToolsPath = 'C:\\path\\to\\swftools'
const iconsSwfFile = 'C:\\example\\path\\to\\icons.swf'
const dumpCmd = `swfdump.exe -t "${iconsSwfFile}"`
const dumpData = await executeCommand(dumpCmd, swfToolsPath)
```

**_Swf Dump Output Example_**

```txt
[HEADER]        File version: 10
[HEADER]        File is zlib compressed. Ratio: 86%
[HEADER]        File size: 33484
[HEADER]        Frame rate: 24.000000
[HEADER]        Frame count: 119
[HEADER]        Movie width: 128.00
[HEADER]        Movie height: 128.00
[045]         4 FILEATTRIBUTES
[009]         3 SETBACKGROUNDCOLOR (00/00/00)
[00c]         2 DOACTION
[016]       207 DEFINESHAPE2 defines id 0001
[01a]        17 PLACEOBJECT2 places id 0001 at depth 0003
[001]         0 SHOWFRAME 1 (00:00:00,000)
[02b]        14 FRAMELABEL "potion_skooma"
[002]       165 DEFINESHAPE defines id 0002
[027]         4 DEFINESPRITE defines id 0003
[01a]         6          PLACEOBJECT2 places id 0002 at depth 0001
[001]         0          SHOWFRAME 1 (00:00:00,000)
[000]         0          END
[01a]        14 PLACEOBJECT2 places id 0003 at depth 0004
[001]         0 SHOWFRAME 2 (00:00:00,042) (label "potion_skooma")
[01c]         2 REMOVEOBJECT2 removes object from depth 0004
[02b]        12 FRAMELABEL "potion_vial"
[002]       236 DEFINESHAPE defines id 0004
[027]         4 DEFINESPRITE defines id 0005
[01a]         6          PLACEOBJECT2 places id 0004 at depth 0001
[001]         0          SHOWFRAME 1 (00:00:00,000)
[000]         0          END
[01a]        14 PLACEOBJECT2 places id 0005 at depth 0004
[001]         0 SHOWFRAME 3 (00:00:00,083) (label "potion_vial")
[01c]         2 REMOVEOBJECT2 removes object from depth 0004
[02b]        20 FRAMELABEL "misc_artifactdaedra"
[002]       578 DEFINESHAPE defines id 0006
[027]         4 DEFINESPRITE defines id 0007
[01a]         6          PLACEOBJECT2 places id 0006 at depth 0001
[001]         0          SHOWFRAME 1 (00:00:00,000)
[000]         0          END
[01a]        15 PLACEOBJECT2 places id 0007 at depth 0004
[001]         0 SHOWFRAME 4 (00:00:00,125) (label "misc_artifactdaedra")
[01c]         2 REMOVEOBJECT2 removes object from depth 0004
[000]         0          END
```

## Parse swfdump output and build map of frame labels to frame numbers

**_Code Snippet to parse the swfdump output_**

```javascript
const dumpData = await executeCommand(cmd, gamePath)

...

const iconParseRegex = /\[(\w+)\]\s+\d+\s+FRAMELABEL "(\w+)"\n\[\d+\]\s+\d+\s+DEFINESHAPE defines id (\d+)/g;
const matches = dumpData.matchAll(iconParseRegex);

const iconFrameMap = new Map();

for (const match of matches) {
    const iconName = match[2];
    const frameNumber = match[3];
    iconFrameMap.set(iconName, Number(frameNumber));
}

/** Get Icon Frame Number Example: const frameNumber = iconFrameMap.get('potion_skooma') **/
```

## Extract and isolate the icon to its own swf file

```javascript
const swfToolsPath = "C:\\path\\to\\swftools";
const iconsSwfFile = "C:\\example\\path\\to\\icons.swf";

...

const iconName = 'potion_skooma'; // hard set as an example, will be gotten from the i4 configuration setting map
const frameNumber = iconFrameMap.get(iconName);
const iconIsolationSwfPath = `C:\\Temp\\${iconName}.swf`;

const extractionCmd = `swfextract.exe -f ${frameNumber} -o "${iconIsolationSwfPath}" "${iconsSwfFile}"`;
const extractionResults = await executeCommand(extractionCmd, swfToolsPath)
```

## Render the isolated icon swf file to a png

```javascript
const swfToolsPath = "C:\\path\\to\\swftools";
const iconIsolationSwfPath = "C:\\Temp\\potion_skooma.swf";

...

const iconPngPath = "C:\\Temp\\potion_skooma.png";
const renderCmd = `swfrender.exe -o "${iconPngPath}" "${iconIsolationSwfPath}"`;
```

## Convert the png to an svg

For this will be using (svg-png-converter)[https://www.npmjs.com/package/svg-png-converter] to convert the PNG to an SVG using a Potrace image tracer.

```javascript
import { png2svg } from 'svg-png-converter'

const iconName = 'potion_skooma'; // hard set as an example, will be gotten from the i4 configuration setting map
const iconPngPath = "C:\\Temp\\potion_skooma.png";

...

const gamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Skyrim Special Edition";
const iconSvgPath = `${gamePath}\\SKSE\\Plugins\\wheeler\\resources\\icons\\${iconName}.svg`;

const result = await png2svg({
  tracer: 'imagetracer',
  optimize: true,
  input: readFileSync(iconPngPath) ,
  numberofcolors: 24,
  pathomit: 1,
});

writeFileSync(iconSvgPath, s);
```

## Apply any color changes to the png before it is converted to an svg

Operational Notes

- Depending on how `png2svg` handles the svg output I'll have to strip all svg elements of any style and fill attributes so a global fill can be applied to the svg. This will allow us to apply the color to the icon.
- Can use (svg-fill)[https://www.npmjs.com/package/svg-fill] to apply the color to the svg on every element

```javascript
const iconName = 'potion_skooma'; // hard set as an example, will be gotten from the i4 configuration setting map
const iconPngPath = "C:\\Temp\\potion_skooma.png";

...
const gamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Skyrim Special Edition";
const iconSvgPath = `${gamePath}\\SKSE\\Plugins\\wheeler\\resources\\icons\\${iconName}.svg`;

const color = '#FF0000'; // hard set as an example, will be gotten from the i4 configuration setting map

// TBD
```

## Copy the svg icon to the Wheeler custom icons folder

```javascript
const gamePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Skyrim Special Edition";
const iconSvgPath = `${gamePath}\\SKSE\\Plugins\\wheeler\\resources\\icons\\${iconName}.svg`;

...

const wheelerCustomIconName = "KWD_OCF_AlchDrug"; // Determined by the i4 configuration settings map
const wheelerCustomIconsPath = `${gamePath}\\SKSE\\Plugins\\wheeler\\resources\\icons_custom`;
const wheelerIconPath = `${wheelerCustomIconsPath}\\${wheelerCustomIconName}.svg`;

copyFileSync(iconSvgPath, wheelerIconPath);
```
