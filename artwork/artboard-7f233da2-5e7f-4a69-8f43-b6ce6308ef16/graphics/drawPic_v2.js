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
            shape.X = layer.transform.tx;
            shape.Y = layer.transform.ty;

            //根据内外边框属性设置图形宽高
            _this.setShapeDimention (shape, layer);

            //设置填充属性
            _this.setShapeFill (shape, layer);

            //设置边框属性
            _this.setShapeStroke (shape, layer);

            switch (layer.shape.type) {
                case "ellipse" : 

                    //绘制带阴影的椭圆
                    var layer1 = document.createElement('canvas');
                    layer1.width = 375;
                    layer1.height = 667;
                    
                    var layer1_canvas=layer1.getContext('2d');

                    _this.drawEllipse (layer1_canvas, shape);
                    
                    context.globalCompositeOperation="destination-over";//设置多个图层如何混合
                    context.drawImage(layer1, 0, 0, 375, 667, 0, 0, 375, 667);

                    break;
                default: break;
            }
        }
    }

    _this.setShapeDimention = function (shape, layer) {

        if ("inside" === layer.style.stroke.align) {

            shape.width = layer.shape.cx * 2;
            shape.height =  + layer.shape.cy * 2;
            
        } else if ("outside" === layer.style.stroke.align){

            shape.width = layer.shape.cx * 2 + layer.style.stroke.width;
            shape.height =  + layer.shape.cy * 2 + layer.style.stroke.width;

        } else {

            shape.width = layer.shape.cx * 2 + layer.style.stroke.width / 2;
            shape.height =  + layer.shape.cy * 2 + layer.style.stroke.width / 2;
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

        shape.strokeStyle = strokeStyle;
        shape.lineWidth = layer.style.stroke.width;

        //留意默认值
        shape.lineDash = layer.style.stroke.dash;
        shape.lineJoin = layer.style.stroke.join;
        shape.lineCap = layer.style.stroke.cap;
    }

    _this.drawEllipse = function (context, ellipse) {
        
        var kappa = .5522848;

        ox = (ellipse.width / 2) * kappa;
        oy = (ellipse.height / 2) * kappa, 
        xe = ellipse.X + ellipse.width;           
        ye = ellipse.Y + ellipse.height;          
        xm = ellipse.X + ellipse.width / 2;      
        ym = ellipse.Y + ellipse.height / 2;       


        context.beginPath();
        context.moveTo(ellipse.X, ym);

        context.bezierCurveTo(ellipse.X, ym - oy, xm - ox, ellipse.Y, xm, ellipse.Y);
        context.bezierCurveTo(xm + ox, ellipse.Y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, ellipse.X, ym + oy, ellipse.X, ym);

        context.fillStyle = ellipse.fillStyle; 

        context.strokeStyle = ellipse.strokeStyle;

        context.lineWidth = ellipse.lineWidth;



        // console.log (ellipse.lineDash)
        // if ("undefined" !== ellipse.lineDash) {
        // 	context.setLineDash(ellipse.lineDash);
	       //  context.lineJoin = ellipse.lineJoin;
	       //  context.lineCap = ellipse.lineCap;
        // }
        

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

//------------均匀压缩法绘制椭圆--------------------
//其方法是用arc方法绘制圆，结合scale进行
//横轴或纵轴方向缩放（均匀压缩）
//这种方法绘制的椭圆的边离长轴端越近越粗，长轴端点的线宽是正常值
//边离短轴越近、椭圆越扁越细，甚至产生间断，这是scale导致的结果
//这种缺点某些时候是优点，比如在表现环的立体效果（行星光环）时
//对于参数a或b为0的情况，这种方法不适用
function EvenCompEllipse (x, y, a, b) {

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.save();
    //选择a、b中的较大者作为arc方法的半径参数
    var r = (a > b) ? a : b; 
    var ratioX = a / r; //横轴缩放比率
    var ratioY = b / r; //纵轴缩放比率

    context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
    context.beginPath();

    //从椭圆的左端点开始逆时针绘制
    context.moveTo((x + a) / ratioX, y / ratioY);
    context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);

    context.closePath();
    context.stroke();
    context.restore();
};

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848;

    ox = (w / 2) * kappa;
    oy = (h / 2) * kappa, 
    xe = x + w;           
    ye = y + h;          
    xm = x + w / 2;      
    ym = y + h / 2;       

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.stroke();
}