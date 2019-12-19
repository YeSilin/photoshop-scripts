### Photoshop scripts collection
- Select all layers *（选择全部图层）*
```JavaScript
function selectAllLayers() {
    var desc29 = new ActionDescriptor();
    var ref23 = new ActionReference();
    ref23.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc29.putReference(charIDToTypeID('null'), ref23);
    executeAction(stringIDToTypeID('selectAllLayers'), desc29, DialogModes.NO);
}
```
- Set background color hex version *（设置背景颜色 hex 版）*
```JavaScript
function setBackgroundColorHex(value) {
    var color = new SolidColor();
    color.rgb.hexValue = value;
    app.backgroundColor = color;
}
```
- Set background color RGB version *（设置背景颜色 RGB 版）*
```JavaScript
function setBackgroundColorRGB(r, g, b) {
    var c = new SolidColor;
    c.rgb.red = r;
    c.rgb.green = g;
    c.rgb.blue = b;
    app.backgroundColor = c;
}
```
- Back to previous level history *（返回上一级历史）*
```JavaScript
function returnPreviousHistory() {
    var idslct = charIDToTypeID("slct");
    var idnull = charIDToTypeID("null");
    var idHstS = charIDToTypeID("HstS");
    var idOrdn = charIDToTypeID("Ordn");
    var idPrvs = charIDToTypeID("Prvs");
    var ref = new ActionReference();
    var desc = new ActionDescriptor();
    ref.putEnumerated(idHstS, idOrdn, idPrvs);
    desc.putReference(idnull, ref);
    executeAction(idslct, desc, DialogModes.NO);
}
```

