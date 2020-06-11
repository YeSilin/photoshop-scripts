// 清除元数据的主要函数
function deleteDocumentAncestorsMetadata() {
    // 清理垃圾四步骤
    if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
    // Begone foul Document Ancestors!
    xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}


// 数组去重，双层循环，外层循环元素，内层循环时比较值。值相同则删去这个值。
function unique(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

// 打开当前选中的智能对象
function openSmartObject() {
    // 打开这个智能对象
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var actionDescriptor = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, actionDescriptor, DialogModes.NO);
}


// 为了避免重复清理打开，一次性打开全部智能对象
function openAllSmartObject(doc) {
    try {
// 如果当前文档未定义就返回
        if (doc == undefined) {
            return;
        }

        // 遍历当前文档的全部图层
        for (var i = 0; i < doc.layers.length; i++) {
            var curLayer = doc.layers[i];

            // 如果当前图层类型不是普通图层，即代表是图层组
            if (curLayer.typename != "ArtLayer") {
                // 那么继续打开
                openAllSmartObject(curLayer);
                continue;
            }

            // 如果当前图层是智能对象
            if (curLayer.kind == "LayerKind.SMARTOBJECT") {
                // 激活图层
                app.activeDocument.activeLayer = curLayer;

                // 打开之前先定义一下当前文档
                var curDoc = app.activeDocument
                // 打开智能对象
                openSmartObject()

                // 打开后追加保存到已打开的智能列表
                openDocumentList.push(app.activeDocument)

                // 那么继续打开全部智能对象
                openAllSmartObject(app.activeDocument);

                // 打开后回到之前的文档
                app.activeDocument = curDoc
            }
        }
    } catch (e) {
        // 清除失败就不弹窗了
    }
}


// 删除全部文档元数据
function deleteAllDocumentAncestorsMetadata() {
    // 先清理主文档元数据
    deleteDocumentAncestorsMetadata()

    // 打开全部智能对象
    openAllSmartObject(mainDocument)

    // 数组去重
    openDocumentList = unique(openDocumentList)

    // 开始循环清理
    for (var i = 0; i < openDocumentList.length; i++) {
        // 先激活文档
        app.activeDocument = openDocumentList[i]
        // 然后清理数据
        deleteDocumentAncestorsMetadata()
        // 最后保存并关闭
        app.activeDocument.close(SaveOptions.SAVECHANGES);
    }
}


// 生成进度条函数
function progressBar() {
    // 进度条调用清除元数据函数
    app.doForcedProgress("正在清除元数据... ", "deleteAllDocumentAncestorsMetadata()")
}


function main() {
    whatApp = String(app.name);  //String version of the app name
    if (whatApp.search("Photoshop") > 0) {  //Check for photoshop specifically, or this will cause errors

        //  函数scrubs从文件中提取文档祖先
        if (!documents.length) {
            //alert("没有打开的文档，请打开一个文档来运行此脚本！");
            return;
        }

        // 定义主文档
        mainDocument = app.activeDocument;

        // 生成历史，历史调用进度条
        app.activeDocument.suspendHistory("清除元数据", "progressBar()");  // 生成历史记录
    }
}

// 声明主文档，因为要打开很多智能对象
var mainDocument;

// 保存因为是智能对象而打开的文档列表
var openDocumentList = new Array();

// 运行此脚本
main();