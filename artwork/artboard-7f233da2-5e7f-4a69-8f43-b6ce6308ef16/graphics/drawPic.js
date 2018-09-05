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

    _this.repaintShape = function (layer) {

        switch (layer.shape.type) {
            case "ellipse" : 
                var canvas = document.getElementById("canvas");
                var context = canvas.getContext("2d");

                var ellipse = {};

                //设置图形左上角坐标点
                ellipse.X = layer.transform.tx;
                ellipse.Y = layer.transform.ty;
                
                //根据内外边框属性设置图形宽高
                _this.setShapeDimention (ellipse, layer);

                //设置填充属性
                _this.setShapeFill (ellipse, layer);

                //设置边框属性
                _this.setShapeStroke (ellipse, layer);

                // _this.drawEllipse (context, ellipse);

                var layer1=document.createElement('canvas');
                layer1.width=375;
                layer1.height=667;
                var layer1_canvas=layer1.getContext('2d');

                var kappa = .5522848;

                ox = (ellipse.width / 2) * kappa;
                oy = (ellipse.height / 2) * kappa, 
                xe = ellipse.X + ellipse.width;           
                ye = ellipse.Y + ellipse.height;          
                xm = ellipse.X + ellipse.width / 2;      
                ym = ellipse.Y + ellipse.height / 2;       


                layer1_canvas.beginPath();
                layer1_canvas.moveTo(ellipse.X, ym);

                layer1_canvas.bezierCurveTo(ellipse.X, ym - oy, xm - ox, ellipse.Y, xm, ellipse.Y);
                layer1_canvas.bezierCurveTo(xm + ox, ellipse.Y, xe, ym - oy, xe, ym);
                layer1_canvas.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                layer1_canvas.bezierCurveTo(xm - ox, ye, ellipse.X, ym + oy, ellipse.X, ym);

                layer1_canvas.fillStyle = ellipse.fillStyle; 

                layer1_canvas.strokeStyle = ellipse.strokeStyle;

                layer1_canvas.lineWidth = "5";

                layer1_canvas.setLineDash([6, 7]);
                layer1_canvas.lineJoin = "bevel";
                layer1_canvas.lineCap = "round";

                layer1_canvas.shadowColor = "red";
                layer1_canvas.shadowOffsetX = 30;
                layer1_canvas.shadowOffsetY = 30;
                layer1_canvas.shadowBlur = 20;

                layer1_canvas.fill();
                layer1_canvas.stroke();

                var layer2 = document.createElement('canvas');
                layer2.width = 375;
                layer2.height = 667;
                var layer2_canvas = layer2.getContext('2d');

                layer2_canvas.beginPath();
                layer2_canvas.moveTo(ellipse.X, ym);

                layer2_canvas.bezierCurveTo(ellipse.X, ym - oy, xm - ox, ellipse.Y, xm, ellipse.Y);
                layer2_canvas.bezierCurveTo(xm + ox, ellipse.Y, xe, ym - oy, xe, ym);
                layer2_canvas.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                layer2_canvas.bezierCurveTo(xm - ox, ye, ellipse.X, ym + oy, ellipse.X, ym);

                layer2_canvas.fillStyle = ellipse.fillStyle; 

                layer2_canvas.strokeStyle = ellipse.strokeStyle;

                layer2_canvas.lineWidth = "5";

                layer2_canvas.setLineDash([6, 7]);
                layer2_canvas.lineJoin = "bevel";
                layer2_canvas.lineCap = "round";

                layer2_canvas.fill();
                layer2_canvas.stroke();

                context.save()//用来显示的canvas
                context.globalCompositeOperation="destination-over";//设置多个图层如何混合，这个可以百度canvas混合模式，这个和PS是相近的
                context.drawImage(layer2,0,0,375,667,0,0,375,667)
                context.drawImage(layer1,0,0,375,667,0,0,375,667)
                context.restore();

                break;
            default: break;
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

        context.lineWidth = "5";

        context.setLineDash([6, 7]);
        context.lineJoin = "bevel";
        context.lineCap = "round";

        context.shadowColor = "red";
        context.shadowOffsetX = 30;
        context.shadowOffsetY = 30;
        // context.shadowBlur = 20;

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

        for (var i in children.artboard.children) {

            uiCotroller.repaintShape(artboard.artboard.children[i]);
        }
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