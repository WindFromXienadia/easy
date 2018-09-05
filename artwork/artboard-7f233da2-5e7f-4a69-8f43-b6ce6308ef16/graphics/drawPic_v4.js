$(document).ready(function () {
    var app = new App();

    app.init();
});

function UIController (app) {

    var _this = this;

    _this.repaintBackground = function (style) {
        
    }

    _this.repaintLayout = function (meta) {

    }

    _this.repaintShape = function (artboard) {

        var layerList = artboard.children;
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        for (var i in layerList) {

            var layer = layerList[i];

            var shape = {};

            //设置图形左上角坐标点
            _this.setVertexCoord(shape, layer);

            //根据内外边框属性设置图形宽高
            // _this.setShapeDimention (shape, layer);

            //设置填充属性
            _this.setShapeFill (shape, layer);

            //设置边框属性
            _this.setShapeStroke (shape, layer);

            switch (layer.shape.type) {
                case "ellipse" : 

                    _this.drawEllipse(context, shape);

                    console.log(shape);
                    //绘制带阴影的椭圆
                    // var layer1 = document.createElement('canvas');
                    // layer1.width = 375;
                    // layer1.height = 667;
                    
                    // var layer1_canvas=layer1.getContext('2d');

                    // _this.drawEllipse (layer1_canvas, shape);
                    
                    // // context.globalCompositeOperation="destination-over";//设置多个图层如何混合
                    // // context.drawImage(layer1, 0, 0, 375, 667, 0, 0, 375, 667);

                    break;
                default: break;
            }
        }
    }

    _this.setShapeFill = function (shape, layer) {

        var fillRGB = layer.style.fill.color.value
        var fillStyle = `rgb(${fillRGB.r}, ${fillRGB.g}, ${fillRGB.b})`;

        shape.fillStyle = fillStyle;
    }

    _this.setShapeStroke = function (shape, layer) {

        var strokeRGB = layer.style.stroke.color.value
        var strokeStyle = `rgb(${strokeRGB.r}, ${strokeRGB.g}, ${strokeRGB.b})`;

        var strokStyle = layer.style.stroke.align;//内部描边:inside 外部描边:outside 中心描边:undefined
        var lineWidth = layer.style.stroke.width;
        
        shape.lineWidth = lineWidth;
        shape.strokeStyle = strokeStyle;

        console.log(strokStyle)

        if ("outside" === strokStyle) {

            shape.paintWidth = layer.shape.cx * 2 + lineWidth;
            shape.paintHeight = layer.shape.cy * 2 + lineWidth;
            
        } else if ("inside" === strokStyle){

            shape.paintWidth = layer.shape.cx * 2 - lineWidth;
            shape.paintHeight = layer.shape.cy * 2 - lineWidth;

        } else {

            shape.paintWidth = layer.shape.cx * 2 - lineWidth / 4;
            shape.paintHeight = layer.shape.cy * 2 - lineWidth / 4;
        }

        //留意默认值
        shape.lineDash = layer.style.stroke.dash;
        shape.lineJoin = layer.style.stroke.join;
        shape.lineCap = layer.style.stroke.cap;
    }

    //设置图形外接矩形四个角定点坐标
    _this.setVertexCoord = function (shape, layer) {
        
        var width = layer.shape.cx * 2;
        var height = layer.shape.cy * 2;

        var leftTopX  = layer.transform.tx;
        var leftTopY = layer.transform.ty;
        var a = layer.transform.a;
        var b = layer.transform.b;
        var c = layer.transform.c;
        var d = layer.transform.d;

        shape.width = width;
        shape.height = height;

        //a:旋转角度余弦值
        //b:旋转角度正弦值
        shape.a = a;
        shape.b = b;
        shape.c = c;
        shape.d = d;

        shape.leftTopX = leftTopX;
        shape.leftTopY = leftTopY;

        shape.leftBottomX =  leftTopX - height * b;
        shape.leftBottomY =  leftTopY + height * a;

        shape.rightBottomX =  leftTopX + width * a - height * b;
        shape.rightBottomY =  leftTopY + width * b + height * a;

        shape.rightTopX = leftTopX + width * a;
        shape.rightTopY = leftTopY + width * b;
    }

    _this.drawEllipse = function (context, ellipse) {
        
        context.fillStyle = ellipse.fillStyle;
        context.strokeStyle = ellipse.strokeStyle;
        context.lineWidth = ellipse.lineWidth;
        
        if ("undefined" !== ellipse.lineDash) {
            context.setLineDash(ellipse.lineDash);
            context.lineJoin = ellipse.lineJoin;
            context.lineCap = ellipse.lineCap;
        }

        context.translate(ellipse.leftTopX, ellipse.leftTopY);
        context.transform(ellipse.a, ellipse.b, ellipse.c, ellipse.d, 0, 0);
        context.ellipse(ellipse.width / 2 , ellipse.height / 2, ellipse.paintWidth / 2 , ellipse.paintHeight / 2, 0, 0, 2 *  Math.PI);

        // context.shadowColor = "red";
        // context.shadowOffsetX = 30;
        // context.shadowOffsetY = 30;
        // // context.shadowBlur = 20;

        context.fill();
        context.stroke();
    }

    _this.drawShadow = function (ellipse) {


    }
}

function App () {
    var _this = this;

    var dao = new Dao();
    var uiCotroller = new UIController(_this);

    var artboard = {};

    _this.init = function () {

        dao.select(_this.selectCallback);
    }

    _this.selectCallback = function (children) {

        artboard = children;

        uiCotroller.repaintBackground(artboard.style);

        uiCotroller.repaintLayout(artboard.meta);

        uiCotroller.repaintShape(artboard.artboard);
    }
}

function Dao () {
    var _this = this;

    _this.select = function (callback) {
        $.ajax({
            type: "Post",
            url: "graphicContent.agc",
            dataType: "json",
            async: true,
            error: function(){
                
                alert("Ajax Error");
            },
            success: function(response){

                callback(response.children[0])
            }
        });
    }
}