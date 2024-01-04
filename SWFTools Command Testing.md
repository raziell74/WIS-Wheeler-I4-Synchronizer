# Command Testing

## SWF Dump

```cmd
.\SWFTools\swfdump.exe -t ".\test_swf\AIT\Aura\icons.swf" > ".\temp\icons-dump.txt"
```

## Isolate and Extract Icon

```cmd
.\SWFTools\swfextract.exe -f 1 -o ".\Swf Icon Extractions\icon.swf" ".\test_swf\AIT\Aura\icons.swf"
```

## Render extracted icon

```cmd
.\SWFTools\swfrender.exe -o ".\Swf Icon Extractions\icon.png" ".\temp\icon.swf"
```
