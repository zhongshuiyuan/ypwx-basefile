import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { flowArray, shuiMian, testFlightData } from '../../pages/CesiumDemo/ChBuild/testData';
// import roadImage from "../../assets/image/road.jpg";
import testPoint from "../../assets/image/point5.png";
// import julei from "../../assets/image/point1.png";
import testgif from "../../assets/image/testgif.gif";
import kuang1 from "../../assets/image/box.png";
import circleGif from "../../assets/image/circle2.gif";
// import kuanggif from "../../assets/image/kuang1.gif";
// import jt from "../../assets/image/JT5.png";
import jt2 from "../../assets/image/JT2.png";
// import yr1 from "../../assets/image/yr1.png";
import moment from "moment";
import { WuShader } from './MulShader';
// import CesiumNavigation from "cesium-navigation-es6";
import ViewShedStage from "./ViewShed.js";
import CesiumVideo3d from "./CesiumVideo3D.js";
import normalMap from "../../assets/image/fabric_normal.jpg";
// import { Wind3D } from './WindMap/Cesium-3D-Wind/wind3D';
import { PolyRiver, PloyFlood, WaterControlPoint, WaterFallCord, WaterMonitorPoint, WaterControlPointValue } from './TestData/PolyRiver';
import { MultiPolyRiver } from './TestData/a';
import { riverTwoLine } from './TestData/b';
import { MultiLinePipe } from "../../pages/CesiumDemo/UgPipe/data";


window.CESIUM_BASE_URL = './cesium/';
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);// 西南东北，默认显示中国
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
const locationSZ = { lng: 114.167, lat: 22.67, height: 130000.0 };
// const locationJDY = { lng: 104.06, lat: 30.78, height: 13000.0 };
const location = locationSZ;

let rotateClock: any = null;

// 初始化地图
export const initMap = (domID: string, isAddBuilding: boolean) => {

    if (!document.getElementById(domID)) return;

    const viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: true,
        navigationHelpButton: false,
        animation: false,
        // creditContainer:"credit",
        // timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //     url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        // }),
        // 导出为图片时，需要设置
        // contextOptions: {
        //     webgl: {
        //         alpha: true,
        //         depth: true,
        //         stencil: true,
        //         antialias: true,
        //         premultipliedAlpha: true,
        //         // 通过canvas.toDataURL()实现截图需要将该项设置为true
        //         preserveDrawingBuffer: true,
        //         failIfMajorPerformanceCaveat: true
        //     }
        // },

        // 演示1：三维地形图
        // terrainProvider: Cesium.createWorldTerrain(),
        // terrainProvider: Cesium.createWorldTerrain({
        //     requestVertexNormals:true, // 坡度可视化的必须勾选
        //     // requestWaterMask:true
        // }),
        // http://localhost:9000/terrain/aad787c00b0011ecbf0d11c2c0edeb81

        // skyBox: new Cesium.SkyBox({
        //     sources: {
        //         positiveX: './Models/image/box.png',
        //         negativeX: './Models/image/box.png',
        //         positiveY: './Models/image/box.png',
        //         negativeY: './Models/image/box.png',
        //         positiveZ: './Models/image/box.png',
        //         negativeZ: './Models/image/box.png'
        //     }
        // })
    })
    // 演示1：添加免费的osm 建筑物图层
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());

    // 2021-04-20 粉刷匠 导航插件
    const isShowNavigation = false;
    if (isShowNavigation) {
        let options: any = {};
        // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
        options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        options.enableCompass = true;
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
        options.enableZoomControls = true;
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        options.enableDistanceLegend = true;
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        options.enableCompassOuterRing = true;
        // CesiumNavigation(viewer, options);
    }

    // 额外设置之显示帧速
    viewer.scene.debugShowFramesPerSecond = true;

    const isShowFxaa = false;
    if (!isShowFxaa) {
        // 关闭抗锯齿
        viewer.scene.postProcessStages.fxaa.enabled = false;

        // 调整分辨率
        // const supportsImageRenderingPixelated: any = viewer.cesiumWidget._supportsImageRenderingPixelated;
        // if (supportsImageRenderingPixelated) {
        //     var vtxf_dpr = window.devicePixelRatio;
        //     while (vtxf_dpr >= 2.0) {
        //         vtxf_dpr /= 2.0;
        //     }
        //     viewer.resolutionScale = vtxf_dpr;
        // }
    }


    // 普通款制作专题图的样式
    // tmpTileset.style = new Cesium.Cesium3DTileStyle({
    //     color: {
    //         conditions: [
    //             // eslint-disable-next-line
    //             ['${Height} >= 200', 'color("purple", 0.5)'],
    //             // eslint-disable-next-line
    //             ['${Height} >= 100', 'color("red")'],
    //             ['true', 'color("blue")']
    //         ]
    //     },        
    //     // eslint-disable-next-line
    //     show: '${Height} > 0',
    //     meta: {
    //         // eslint-disable-next-line
    //         description: '"Building id ${id} has height ${Height}."'
    //     }
    // });
    // viewer.scene.primitives.add(tmpTileset);


    // 2021-04-19 粉刷匠 添加分帘遮罩
    // 注意：打开ChBuild 中的slider  <div id="slider"></div> 
    // addFenLian(viewer);


    // 演示2：添加各类智慧城市的动效图，等等等等
    if (isAddBuilding) {

        // 添加测试蓝色的底图
        // addTestDarkImg(viewer);

        // 缩放到深圳
        setExtent(viewer);

        // 添加不同的地图底图
        // addDiffBaseMap(viewer, "arcgis");

        // 添加聚类点
        // addClusterPoint(viewer);

        // 添加billboard gif
        // addBillBoardGif(viewer);

        // 添加闪烁点
        // addFlashPoint(viewer);

        // 添加文字标签点canvas
        // addNewBeerPoint(viewer);

        // 添加div文字标签 详细参见chbuild.tsx文件夹，里面是完整的用法样例
        // addDivTxtBoard(viewer);

        // 2021-08-16 点击获取经纬度
        // clickToGetCord(viewer);

        // 添加动态效果点+动态效果墙
        // addDynamicPoint(viewer);

        // 各类点样式集合 有点意思
        // addMulTypePoint(viewer);

        // 各类线样式集合 有点意思
        // addMutTypeLine(viewer);

        // 添加倾斜摄影三维模型+ 附带贴地 + 附带普通建筑物3dTiles单体化
        // addQxsyModel(viewer);


        // 添加测试南山区建筑3dtile数据 + 附带贴地 + 附带普通建筑物3dTiles单体化
        addTestBlueBuilding(viewer);

        // 添加Geojson数据
        // addGeoJsonData(viewer);


        // 添加测试道路数据: 光晕染线 或者 发光线 我能想到最简单的办法是修改图片
        // addTestRroadGeoJsonData(viewer);

        // 添加雨、雾、雪天气渲染, 注意打开倾斜摄影模型，更加方便看到效果
        // addWeatherCondition(viewer);

        // 2021-04-20 粉刷匠 添加热力图
        // addTestHeatmap(viewer);


        // 2021-04-22 粉刷匠 添加一个旋转的地球
        // addRotateEarth(viewer);

        // 2021-04-22 粉刷匠 绕点旋转
        // addRotatePoint(viewer);

        // 2021-04-22 粉刷匠 添加视频投影 初级 : 平铺视频+视频墙
        // addVideoLevel0(viewer);

        // 2021-04-22 粉刷匠 建筑物限高分析
        // addLimiteHeight(viewer);

        // 2021-04-22 粉刷匠 淹没分析  自己画一个矩形 打开terrien
        // addFlood(viewer);

        // 2021-04-23 粉刷匠 使用平面裁剪3dtiles,关掉深圳市建筑
        // addClipTo3DTiles(viewer);

        // 2021-04-23 粉刷匠 地形挖掘
        // addClipToTerrien(viewer);

        // 2021-04-26 粉刷匠 可视域分析
        // addViewShed(viewer);

        // 2021-04-26-27 粉刷匠 添加视频投影 中级 todo:完成，不懂意思
        // addVideoLevel1(viewer);

        // 2021-04-27 粉刷匠 补充-模型旋转--未测试
        // addModelRotation(viewer); 

        // 2021-04-27 粉刷匠 补充-水面效果
        // addWaterPolygon(viewer)

        // 2021-04-27-28 粉刷匠 补充-自定义着色器
        // addDiffShader(viewer);

        // 2021-04-27 粉刷匠 补充-线管
        // addPolylineVolume(viewer);

        // 2021-04-28 粉刷匠 等高线 注意升级到cesium1.8
        // addContour(viewer);

        // 2021-04-28 粉刷匠 粒子效果
        // addParticel(viewer);

        // 2021-05-012 粉刷匠 添加一个扩散圆柱-成功
        // addExpandCylinder(viewer);

        // 2021-05-12 粉刷匠 风场图
        // addWindMap(viewer);

        // 2021-05-12 粉刷匠 添加日照光阴影 
        // addSunShadow(viewer);

        // 2021-05-12 粉刷匠 地下模式 未完成
        // addUnderground(viewer);

        // 2021-05-13 粉刷匠 试图联系echart  散点图及飞行图
        // addEchart(viewer);

        // 2021-06-09 粉刷匠 风图
        // addRsWind(viewer);

        // 2021-06-09 粉刷匠 添加通视分析
        // addAnaTongShi(viewer);

        // 添加一个glb模型
        // addTestGlbLabel(viewer);

        // 添加测试标注的椭圆图片---透明png
        // addTestBox(viewer);

        // 添加蓝色的泛光线
        // addTestBlueLine(viewer);

        // 添加带有贴图的道路
        // addRoadWithImage(viewer);

        // 添加流动的线
        // addTestFlowLine(viewer);


        // 测试---雷达圆扫描图
        // showTestCircleScan(viewer);
        // 测试---雷达圆扩散图
        // showTestCircleScan2(viewer);

        // 2021-08-16 粉刷匠 添加水坝glb
        // addShuiBa(viewer);

        // 2021-09-01 粉刷匠 添加水面
        // addJdyShuimian(viewer);



    }

    // addWmtsLayer(viewer);

    return viewer;
}

// 2021-04-09 粉刷匠 添加不同的底图
export const addDiffBaseMap = (viewer: any, type?: string) => {
    if (type === "gd") {
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: 'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            tilingScheme: new Cesium.WebMercatorTilingScheme()
        }));
    } else if (type === "tdt") {
        //影像
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373",
                layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: 'GoogleMapsCompatible',
            }),
        );
        // 注记
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=077b9a921d8b7e0fa268c3e9146eb373",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: 'GoogleMapsCompatible',
            })
        );
    } else if (type === "arcgis") {
        viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
            // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
        }))
    } else if (type === "geoserver") {
        // wms地图服务
        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
            url: 'http://localhost:8080/geoserver/fs/wms',
            layers: 'fs:county3',//图层
            parameters: {
                transparent: true,
                format: 'image/png',
                srs: 'EPSG:4490',
                styles: ''
            }
        }));
        // wmts服务
        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts/rest/topp:states/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
            layer: 'topp:states',//图层名称
            style: '',
            format: 'image/png',
            tileMatrixSetID: 'EPSG:4326',
            tileMatrixLabels: ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'],
            tilingScheme: new Cesium.GeographicTilingScheme({
                numberOfLevelZeroTilesX: 2,
                numberOfLevelZeroTilesY: 1
            })
        }))
    }
}

// 2021-04-09 粉刷匠 添加聚类点
export const addClusterPoint = (viewer: any) => {
    // viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson'));
    Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson').then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            // 普通点
            // entity.billboard = undefined;
            // entity.point = new Cesium.PointGraphics({
            //     color: Cesium.Color.RED,
            //     pixelSize: 10
            // });
            // 对单个实体进行设置
            // entity.billboard = undefined;
            entity.billboard.image = testPoint;
            entity.billboard.width = 20;
            entity.billboard.height = 20;
            // todo:添加注记,下面的报错，有时间再修改，垃圾玩意
            // entity.label = new Cesium.LabelGraphics({
            //     text: entity.properties.id._value,
            //     // font: '12px sans-serif',
            //     // pixelOffset: new Cesium.Cartesian2(0.0, 10)
            // });    
        }

        // todo:点聚类练习
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 15;
        dataSource.clustering.minimumClusterSize = 3;

        dataSource.clustering.clusterEvent.addEventListener(function (entities: any, cluster: any) {

            cluster.billboard.id = cluster.label.id;
            const simpleImg = makeClusterImg(entities.length.toLocaleString());
            // cluster.billboard.image = julei;
            cluster.billboard.image = simpleImg;
            cluster.billboard.width = 60;
            cluster.billboard.height = 60;
            cluster.billboard.show = true;

            cluster.label.show = false;
            // cluster.label.text = entities.length.toLocaleString();
            // cluster.label.pixelOffset = new Cesium.Cartesian2(-10, 10)
        });

    })
}

// 构造聚类图标
export const makeClusterImg = (number: string) => {
    const ramp = document.createElement('canvas');
    ramp.width = 200;
    ramp.height = 200;
    const ctx: any = ramp.getContext('2d');
    ctx.beginPath();

    // 惨绝人寰 画一个扩散图
    ctx.fillStyle = 'rgba(255, 160, 122,0.3)';
    const panR = 110;
    const panL = (360 - (panR * 3)) / 3;
    const panStart = (90 - panR / 2) - panL;

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 127, 80,0.5)';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 70, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 70, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 70, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 69, 0,0.8)';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 50, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 50, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 50, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = '#fff';   // 文字填充颜色
    ctx.font = '64px Adobe Ming Std';
    ctx.textAlign = 'center';
    ctx.fillText(number, 100, 120);
    ctx.stroke();



    return ramp.toDataURL();
}

// 2021-04-09 粉刷匠 添加gif  billboard
export const addBillBoardGif = (viewer: any) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    div.appendChild(img);
    img.src = testgif;

    img.onload = () => {
        const superGif = new window.SuperGif({
            gif: img
        });

        superGif.load(() => {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 1000),
                billboard: {
                    image: new Cesium.CallbackProperty(() => {
                        return superGif.get_canvas().toDataURL("image/png");
                    }, false),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1)
                }
            });
        });

    }


}

// 2021-04-09 粉刷匠 添加闪烁点
export const addFlashPoint = (viewer: any) => {
    Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson').then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;

        const data = {
            minR: 100,
            maxR: 200,
            deviationR: 20,// 差值 差值也大 速度越快
        }
        // let r1 = data.minR;
        let r2 = data.minR;

        // function changeR1() { // 这是callback，参数不能内传
        //     r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        //     if (r1 >= data.maxR) {
        //         r1 = data.minR;
        //     }
        //     return r1;
        // }

        // function changeR2() {
        //     r2 = r2 + data.deviationR;
        //     if (r2 >= data.maxR) {
        //         r2 = data.minR;
        //     }
        //     return r2;
        // }

        // const startTime = Cesium.JulianDate.now();

        // 2021-04-10 粉刷匠 暂时没有办法控制回调函数的时间频率，希望有人解答
        function changeColor() {
            r2 = r2 + 0.05;
            if (r2 >= data.maxR) {
                r2 = data.minR;
            }
            return r2 > 150 ? Cesium.Color.GREEN : Cesium.Color.GREENYELLOW;
        }


        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            // 普通点
            entity.billboard = undefined;
            entity.ellipse = new Cesium.EllipseGraphics({
                // semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
                // semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
                semiMinorAxis: 150,
                semiMajorAxis: 150,
                // height: 200,
                //颜色回调
                // material: new Cesium.ImageMaterialProperty({
                //     image: getColorCircle2("()", true),
                //     transparent: true,
                // }),
                material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(changeColor, false)),
                // rotation: new Cesium.CallbackProperty(getRotationValue, false),
                // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                outline: false, // height must be set for outline to display
                numberOfVerticalLines: 100
            });
        }

    })
}

// 2021-04-10 粉刷匠 目标是：添加一个科技感的标签
export const addNewBeerPoint = (viewer: any) => {
    Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson').then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            const simpleImg = makeBillBoardImg("23");
            entity.billboard.image = simpleImg;
            entity.billboard.width = 50;
            entity.billboard.height = 50;
        }
    })
}

// 2021-04-10 粉刷匠 目标是：添加一个科技感的标签 billboard 
export const makeBillBoardImg = (number: string) => {
    const ramp = document.createElement('canvas');
    ramp.width = 3200;
    ramp.height = 2300;
    const ctx: any = ramp.getContext('2d');
    ctx.beginPath();
    const img = new Image();
    img.src = kuang1;
    img.onload = function () {
        // 将图片画到canvas上面上去！
        ctx.drawImage(img, 400, 0, 2800, 1900);
        ctx.fillStyle = '#fff';   // 文字填充颜色
        ctx.font = '256px Adobe Ming Std';
        ctx.textAlign = 'center';
        ctx.fillText(number, 1000, 1200);

        // 画一条斜线
        // ctx.moveTo(0, 2300);
        // ctx.lineTo(400, 1900);
        // ctx.strokeStyle = 'rgb(81,162,255)';
        // ctx.lineWidth = 6;
        ctx.stroke();
    }
    return ramp;
}

// 2021-08-16 粉刷匠 点击获取经纬度
export const clickToGetCord = (viewer: any) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement: any) {

        // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
        const windowPosition = viewer.camera.getPickRay(movement.position);
        const cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
        const cartoCoordinates = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesianCoordinates);
        const latitude = (cartoCoordinates.latitude * 180 / Math.PI).toFixed(5);
        const longitude = (cartoCoordinates.longitude * 180 / Math.PI).toFixed(5);

        // 获取世界坐标 Cartesian3（pickEllipsoid参数：屏幕坐标，椭球体），二维的方法
        // WGS84经纬度坐标系（没有实际的对象）、WGS84弧度坐标系（Cartographic）、笛卡尔空间直角坐标系（Cartesian3）、平面坐标系（Cartesian2），4D笛卡尔坐标系（Cartesian4）
        // const cartesian2 = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        // const carto2 = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian2);
        // const latitude = carto2.latitude * 180 / Math.PI;
        // const longitude = carto2.longitude * 180 / Math.PI;

        // 获取场景坐标 Cartesian3 （pickPosition）
        // const cartesian = viewer.scene.pickPosition(movement.position);
        // console.log("经f纬度：", cartoCoordinates);
        console.log("经纬度：", longitude, latitude);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 2021-04-13 粉刷匠 添加一个div文字标签
export const addDivTxtBoard = (viewer: any, eventPro?: any) => {
    // 一个实体
    const entity = viewer.entities.add({
        label: {
            show: false,
            showBackground: true,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
        },
    });
    // 鼠标移动 获取当前位置坐标
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // handler.setInputAction(function (movement: any) {
    //     const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
    //     if (cartesian) {
    //         const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    //         const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
    //         const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

    //         entity.position = cartesian;
    //         entity.label.show = true;
    //         entity.label.text =
    //             "Lon: " +
    //             ("   " + longitudeString).slice(-7) +
    //             "\u00B0" +
    //             "\nLat: " +
    //             ("   " + latitudeString).slice(-7) +
    //             "\u00B0";
    //     } else {
    //         entity.label.show = false;
    //     }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标点击 获取当前坐标
    handler.setInputAction(function (movement: any) {

        // console.log("屏幕坐标:",movement.position);

        // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
        const windowPosition = viewer.camera.getPickRay(movement.position);
        const cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
        const cartoCoordinates = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesianCoordinates);
        const latitude = (cartoCoordinates.latitude * 180 / Math.PI).toFixed(2);
        const longitude = (cartoCoordinates.longitude * 180 / Math.PI).toFixed(2);

        // 获取世界坐标 Cartesian3（pickEllipsoid参数：屏幕坐标，椭球体），二维的方法
        // WGS84经纬度坐标系（没有实际的对象）、WGS84弧度坐标系（Cartographic）、笛卡尔空间直角坐标系（Cartesian3）、平面坐标系（Cartesian2），4D笛卡尔坐标系（Cartesian4）
        // const cartesian2 = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        // const carto2 = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian2);
        // const latitude = carto2.latitude * 180 / Math.PI;
        // const longitude = carto2.longitude * 180 / Math.PI;

        // 获取场景坐标 Cartesian3 （pickPosition）
        // const cartesian = viewer.scene.pickPosition(movement.position);

        if (cartoCoordinates) {
            // const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // const longitudeString = Cesium.Math.toDegrees(carto2.longitude).toFixed(2);
            // const latitudeString = Cesium.Math.toDegrees(carto2.latitude).toFixed(2);

            if (eventPro.click) {
                eventPro.click(movement.position)
            }

            entity.position = cartesianCoordinates;
            entity.label.show = true;
            entity.label.text =
                "Lon: " +
                ("   " + longitude).slice(-7) +
                "\u00B0" +
                "\nLat: " +
                ("   " + latitude).slice(-7) +
                "\u00B0";
        } else {
            entity.label.show = false;
        }

        // 每一帧都需要重新计算位置
        viewer.scene.postRender.addEventListener(function () {
            // 从经纬度坐标转化为世界坐标
            // const tmpCor1 = Cesium.Cartesian3.fromDegrees(Number(longitude), Number(latitude));
            const tmpCor1 = cartesianCoordinates;
            // 从世界坐标转化为屏幕坐标
            const tmpCor2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, tmpCor1);
            if (eventPro.update) {
                eventPro.update(tmpCor2);
            }
        })


    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    /* 滚轮事件 监听高度值 */
    handler.setInputAction(function (wheelment) {
        const height = Math.ceil(viewer.camera.positionCartographic.height);
        if (eventPro.wheel) {
            eventPro.wheel(height);
        }
    }, Cesium.ScreenSpaceEventType.WHEEL)



}

// 2021-04-14 粉刷匠 添加动态效果点+动态墙
export const addDynamicPoint = (viewer: any) => {
    // 添加动态点，是使用的gif,粉刷匠 不想使用canva去绘图
    viewer.scene.fxaa = false; // todo:去掉锯齿，并没有成功，待解决
    const div = document.createElement("div");
    const img = document.createElement("img");
    div.appendChild(img);
    img.src = circleGif;

    img.onload = () => {
        const superGif = new window.SuperGif({
            gif: img
        });

        superGif.load(() => {
            const pointArr = [[113.91, 22.52, 100], [113.92, 22.53, 100], [113.93, 22.54, 100]];
            for (let i = 0; i < pointArr.length; i++) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], pointArr[i][2]),
                    billboard: {
                        image: new Cesium.CallbackProperty(() => superGif.get_canvas().toDataURL("image/png"), false),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: new Cesium.NearFarScalar(10000, 0.4, 20001, 0.3)
                    }
                });
            }

        });

    }

    const data = {
        minR: 100,
        maxR: 1000,
        deviationR: 10,// 差值 差值也大 速度越快
    }
    let r1 = data.minR;

    function changeR1() { // 这是callback，参数不能内传
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        return [r1, r1];
    }


    // 添加动态墙
    viewer.entities.add({
        name: "test wall",
        wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                113.89, 22.50, 0.0,
                113.94, 22.50, 0.0,
            ]),
            minimumHeights: [10.0, 10.0],
            // maximumHeights: [1000.0, 1000.0],
            maximumHeights: new Cesium.CallbackProperty(changeR1, false),
            material: new Cesium.ImageMaterialProperty({
                image: getColorRamp([0, 0, 0, 0, 0, 0.54, 1.0], true),
                transparent: true
            })
            // outline: true,
        }
    })

}

// 2021-04-14 粉刷匠 添加各类点集合
export const addMulTypePoint = (viewer: any) => {
    // 1:图标点+文字 entities方法
    // viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
    //     billboard: {
    //         image: './Models/image/testPoint.png', // default: undefined
    //         show: true, // default
    //         // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
    //         // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
    //         // horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
    //         // verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
    //         scale: 0.15, // default: 1.0
    //         // color: Cesium.Color.LIME, // default: WHITE
    //         // rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
    //         // alignedAxis: Cesium.Cartesian3.ZERO, // default
    //         // width: 100, // default: undefined
    //         // height: 25, // default: undefined
    //     },
    //     label: {
    //         text: 'A label'
    //     },
    // });

    // 2：图标点+文字 primitive方法
    // const instance=new Cesium.GeometryInstance({
    //     id: "instance1",
    //     geometry: new Cesium.EllipseGeometry({
    //         center: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
    //         semiMajorAxis: 1000,
    //         semiMinorAxis: 1000
    //     })
    // })
    // viewer.scene.primitives.add(new Cesium.Primitive({
    //     geometryInstances: instance,
    //     appearance: new Cesium.EllipsoidSurfaceAppearance({
    //         material: Cesium.Material.fromType('Checkerboard')
    //     })
    // }));
    // const labels = viewer.scene.primitives.add(new Cesium.LabelCollection())
    // labels.add({
    //     position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
    //     text: 'test label',
    //     font: '12px Helvetica',
    //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //     verticalOrigin: Cesium.VerticalOrigin.CENTER,
    //     // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1000, 500000),
    //     // eyeOffset: Cesium.Cartesian3(100.0, 0.0, 0.0),
    //     // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    // })
    // const billboards = viewer.scene.primitives.add(new Cesium.BillboardCollection());
    // billboards.add({
    //     position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
    //     image: './Models/image/testPoint.png',
    //     scale: 0.15,
    //     pixelOffset: new Cesium.Cartesian2(0, -20),
    // });

    // 3:动态文本标记 同理 使用的是gif图，canvas太难了
    // const div = document.createElement("div");
    // const img = document.createElement("img");
    // div.appendChild(img);
    // img.src = kuanggif;

    // img.onload = () => {
    //     const superGif = new window.SuperGif({
    //         gif: img
    //     });

    //     superGif.load(() => {
    //         viewer.entities.add({
    //             position: Cesium.Cartesian3.fromDegrees(113.87, 22.59, 0),
    //             label: {
    //                 text: 'A label'
    //             },
    //             billboard: {
    //                 image: new Cesium.CallbackProperty(() => {
    //                     return superGif.get_canvas().toDataURL("image/png");
    //                 }, false),
    //                 verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //                 heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    //                 scaleByDistance: new Cesium.NearFarScalar(500000, 0.2, 500001, 0.0)
    //             }
    //         });
    //     });

    // }

    // 4: 竖立文字标注 用到canvas了，谢特
    const pointArr = [[113.91, 22.52, 100], [113.89, 22.50, 100], [113.95, 22.57, 100]]
    for (let i = 0; i < pointArr.length; i++) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], pointArr[i][2]),
            billboard: {
                image: makeVirticelLine(), // default: undefined  
                width: 50,
                height: 50
            },
            label: {
                // 竖直的文字
                text: '测\n试\n文\n字',
                // font: '30px sans-serif',
                // fillColor : Cesium.Color.RED,
                fillColor: new Cesium.Color(0.22, 0.89, 0.94),
                pixelOffset: new Cesium.Cartesian2(0, -30),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        });
    }

    // 5:弹跳点  粉刷匠 不想写了，应该是运用回调函数，设置高度；或者是回调函数设置背景的高度（此方法略猥琐）
    // const pointArr2 = [[113.91, 22.59, 100], [113.89, 22.60, 100], [113.95, 22.63, 100]]
    // for (let i = 0; i < pointArr2.length; i++) {
    //     viewer.entities.add({
    //         position: Cesium.Cartesian3.fromDegrees(pointArr2[i][0], pointArr2[i][1], pointArr2[i][2]),
    //         billboard: {
    //             image: makeVirticelLine(), // default: undefined  
    //             width: 50,
    //             height: 50
    //         },
    //         label: {
    //             // 竖直的文字
    //             text: '测\n试\n文\n字',
    //             // font: '30px sans-serif',
    //             // fillColor : Cesium.Color.RED,
    //             fillColor: new Cesium.Color(0.22, 0.89, 0.94),
    //             pixelOffset: new Cesium.Cartesian2(0, -30),
    //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //         },
    //     });
    // }

}

// 2021-04-14 粉刷匠 添加各类点集合 ---子函数---创建竖直线
export const makeVirticelLine = (color?: any) => {

    const tmpColor = color ? color : "#5BD5DE";

    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(50, 90, 10, 0, 2 * Math.PI);
    ctx.fillStyle = tmpColor;// 设置填充颜色
    ctx.fill();//开始填充
    ctx.strokeStyle = tmpColor;//将线条颜色设置为蓝色
    ctx.stroke();//stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。

    ctx.moveTo(50, 80);
    ctx.lineTo(50, 0);
    ctx.stroke();

    return ramp;

}

// 2021-04-14 粉刷匠 添加各类线集合
export const addMutTypeLine = (viewer: any) => {

    // 基础线
    // viewer.entities.add({
    //     name: "Red line on terrain",
    //     polyline: {
    //         positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.50, 114.39, 22.77]),
    //         width: 5,
    //         material: new Cesium.Color(0.22, 0.89, 0.94),
    //         clampToGround: true,
    //     },
    // });



    // 1: 流动箭头线
    // const data = {
    //     minR: 0,
    //     maxR: 1536,
    //     deviationR: 10,// 差值 差值也大 速度越快
    // }
    // let r1 = data.minR;
    // // let r2 = data.minR;

    // function makeJT() { // 这是callback，参数不能内传
    //     r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
    //     if (r1 >= data.maxR) {
    //         r1 = data.minR;
    //     }
    //     // return r1;
    //     const ramp = document.createElement('canvas');
    //     ramp.width = 1536;
    //     ramp.height = 293;
    //     const ctx: any = ramp.getContext('2d');
    //     ctx.beginPath();
    //     const img = new Image();
    //     img.src = jt;
    //     img.onload = function () {
    //         // 将图片画到canvas上面上去！
    //         ctx.drawImage(img, r1, 0);
    //         ctx.drawImage(img, 1536 - r1, 0, r1, 293, 0, 0, r1, 293);

    //     }
    //     return ramp;
    // }

    // viewer.entities.add({
    //     name: "Red line on terrain",
    //     polyline: {
    //         positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.50, 114.39, 22.77]),
    //         width: 7,
    //         // material: new Cesium.Color(0.22, 0.89, 0.94),
    //         clampToGround: true,
    //         // 流动纹理
    //         material: new Cesium.ImageMaterialProperty({
    //             image: new Cesium.CallbackProperty(makeJT, false),
    //             // image: './Models/image/JT1.png',
    //             repeat: new Cesium.Cartesian2(15.0, 1.0),
    //             transparent: true,
    //         })
    //     },
    // });

    // 2: 绘制弧线  动态流动线，本质上就去更换背景图片吧，拿走不谢
    const data = {
        minR: 0,
        maxR: 1660,
        deviationR: 30,// 差值 差值也大 速度越快
    }
    let r1 = data.minR;
    const imgWidth = 1660;
    const imgHeight = 257;

    function makeJT() { // 这是callback，参数不能内传  
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        const ramp = document.createElement('canvas');
        ramp.width = imgWidth;
        ramp.height = imgHeight;
        const ctx: any = ramp.getContext('2d');
        ctx.beginPath();
        const img = new Image();
        img.src = jt2;
        img.onload = function () {
            // 将图片画到canvas上面上去！
            ctx.drawImage(img, r1, 0);
            ctx.drawImage(img, imgWidth - r1, 0, r1, imgHeight, 0, 0, r1, imgHeight);
        }
        return ramp;
    }
    const allPoint = animatedParabola([113.90, 22.50, 114.39, 22.77]);
    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(allPoint),
            width: 7,
            // clampToGround: true,
            // 流动纹理
            material: new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(makeJT, false),
                // image: './Models/image/JT1.png',
                repeat: new Cesium.Cartesian2(3.0, 1.0),
                transparent: true,
            })

        },
    });

    // 3: 光晕线
    // 详细参考：addTestRroadGeoJsonData



}

// 两点之间计算抛物线 点 参数[lon1,lat1,lon2,lat2]
export const animatedParabola = (twoPoints: any) => {

    let startPoint = [twoPoints[0], twoPoints[1], 0]; // 起点的经度、纬度
    let step = 80;  // 线的数量，越多则越平滑
    let heightProportion = 0.125; // 最高点和总距离的比值(即图中H比上AB的值)
    let dLon = (twoPoints[2] - startPoint[0]) / step;  // 经度差值
    let dLat = (twoPoints[3] - startPoint[1]) / step;  // 纬度差值
    let deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1]));  // 经度差(米级)
    let deltaLat = dLat * 111000;  // 纬度差(米),1纬度相差约111000米
    let endPoint: any = [0, 0, 0];  // 定义一个端点（后面将进行startPoint和endPoint两点画线）
    let heigh = (step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion).toFixed(0);
    let x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)); // 小数点扩大10000倍，提高精确度
    let a = (Number(heigh) / (x2 * x2));  // 抛物线函数中的a
    function y(x: any, height: any) {  //  模拟抛物线函数求高度
        // 此处模拟的函数为y = H - a*x^2  (H为高度常数)
        return height - a * x * x;
    }

    let allPointArr = [twoPoints[0], twoPoints[1], 0];
    for (let i = 1; i <= step; i++) {  // 逐“帧”画线
        endPoint[0] = Number(startPoint[0]) + dLon; // 更新end点经度
        endPoint[1] = Number(startPoint[1]) + dLat; // 更新end点纬度
        let x = x2 * (2 * i / step - 1);  // 求抛物线函数x
        endPoint[2] = Number((y(x, heigh)).toFixed(0));  // 求end点高度
        allPointArr = allPointArr.concat(endPoint);

        // end点变为start点
        startPoint[0] = endPoint[0];
        startPoint[1] = endPoint[1];
        startPoint[2] = endPoint[2];
    }

    return allPointArr;



}

// 2021-04-15 粉刷匠 添加倾斜摄影模型
export const addQxsyModel = (viewer: any) => {

    // 加载的倾斜模型需要进行矩阵变换
    const translation = Cesium.Cartesian3.fromArray([0, 0, -1000]);
    const m = Cesium.Matrix4.fromTranslation(translation);

    // 加载模型
    const tileset = new Cesium.Cesium3DTileset({
        url: './Models/qxsy/dayanta/tileset.json',
        modelMatrix: m, // 转移矩阵
        // maximumScreenSpaceError: 2, // 最大屏幕空间误差
    });
    tileset.readyPromise.then(function (ttileset: any) {
        viewer.scene.primitives.add(ttileset);
        viewer.zoomTo(ttileset);
        // 设置3dTiles贴地
        set3DtilesHeight(-410, ttileset);

        // 设置倾斜模型的单体化
        // addQxsyDth(ttileset, viewer);
        // 设置倾斜模型-楼层-的单体化
        // addQxsyDthCeng(ttileset, viewer);
        // 设置倾斜模型的单体化 -- 单击，出现分层分户的效果
        // addQxsyDthFenhu(ttileset, viewer);
    })

}

// 2021-04-15 粉刷匠 倾斜摄影模型的单体化
export const addQxsyDth = (tileset: any, viewer: any) => {
    // 箱子纹理: 为了找位置
    // const boxEntity = new Cesium.Entity({
    //     id: "boxID01",
    //     name: 'Red box with black outline',
    //     position: Cesium.Cartesian3.fromDegrees(108.9594, 34.2198, 30),
    //     box: {
    //         dimensions: new Cesium.Cartesian3(50, 50, 100),
    //         // 渐变纹理
    //         material: new Cesium.ImageMaterialProperty({
    //             image: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
    //             transparent: true,
    //         }),
    //         outline: true,
    //         outlineColor: Cesium.Color.BLACK
    //     }
    // });
    // viewer.entities.add(boxEntity);

    // 首先添加primite模型    
    const center = Cesium.Cartesian3.fromDegrees(108.9594, 34.2198, 30)
    const dimensions = new Cesium.Cartesian3(50, 50, 100)// 盒子的长、宽、高
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    const hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0.0, 0.0)// 中心点水平旋转90度
    );
    const hpr = Cesium.Matrix4.fromRotationTranslation(
        hprRotation,
        new Cesium.Cartesian3(0.0, 0.0, 0.0)// 不平移
    );
    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
    viewer.scene.primitives.add(
        new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.BoxGeometry.fromDimensions({
                    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                    dimensions: dimensions
                    // maximum: Cesium.Cartesian3.fromDegrees(108.9598, 34.2202, 130),
                    // minimum: Cesium.Cartesian3.fromDegrees(108.9585, 34.2190, 30)
                }),
                modelMatrix: modelMatrix, // 提供位置与姿态参数
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        Cesium.Color.fromCssColorString("#F26419").withAlpha(0)
                    ),
                    show: new Cesium.ShowGeometryInstanceAttribute(true),
                },
                id: "dayanta",
            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        })
    );
    let currentObjectId: any = null;
    let currentPrimitive: any = null;
    let currentColor: any = null;
    let currentShow: any = null;
    let attributes: any = null;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            if (pickedObject.id === currentObjectId) {
                return;
            }

            if (Cesium.defined(currentObjectId)) {
                attributes = currentPrimitive.getGeometryInstanceAttributes(
                    currentObjectId
                );
                attributes.color = currentColor;
                attributes.show = currentShow;
                currentObjectId = undefined;
                currentPrimitive = undefined;
                currentColor = undefined;
                currentShow = undefined;
            }
        }

        if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.primitive) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)
        ) {
            currentObjectId = pickedObject.id;
            currentPrimitive = pickedObject.primitive;
            attributes = currentPrimitive.getGeometryInstanceAttributes(
                currentObjectId
            );
            currentColor = attributes.color;
            currentShow = attributes.show;
            if (!viewer.scene.invertClassification) {
                attributes.color = [255, 0, 255, 128];
            }
            attributes.show = [1];
        } else if (Cesium.defined(currentObjectId)) {
            attributes = currentPrimitive.getGeometryInstanceAttributes(
                currentObjectId
            );
            attributes.color = currentColor;
            attributes.show = currentShow;
            currentObjectId = undefined;
            currentPrimitive = undefined;
            currentColor = undefined;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


}

// 2021-04-16 粉刷匠 倾斜摄影模型楼层的单体化，初步预测是与整栋楼的单体化一致
export const addQxsyDthCeng = (tileset: any, viewer: any) => {
    // 粉刷匠的猜测非常的对
    // 首先添加primite模型    
    const heightArr: any = [40, 50, 60];
    const colorArr = ["#4AA6EC", "#54E668", "#FFBD28"];
    for (let i = 0; i < heightArr.length; i++) {

        const center = Cesium.Cartesian3.fromDegrees(108.9594, 34.2198, heightArr[i])
        const dimensions = new Cesium.Cartesian3(50, 50, 10)// 盒子的长、宽、高
        const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
        const hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0.0, 0.0)// 中心点水平旋转90度
        );
        const hpr = Cesium.Matrix4.fromRotationTranslation(
            hprRotation,
            new Cesium.Cartesian3(0.0, 0.0, 0.0)// 不平移
        );
        Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
        viewer.scene.primitives.add(
            new Cesium.ClassificationPrimitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: Cesium.BoxGeometry.fromDimensions({
                        vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                        dimensions: dimensions
                        // maximum: Cesium.Cartesian3.fromDegrees(108.9598, 34.2202, 130),
                        // minimum: Cesium.Cartesian3.fromDegrees(108.9585, 34.2190, 30)
                    }),
                    modelMatrix: modelMatrix, // 提供位置与姿态参数
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                            Cesium.Color.fromCssColorString(colorArr[i]).withAlpha(0.5)
                        ),
                        show: new Cesium.ShowGeometryInstanceAttribute(true),
                    },
                    id: "dayantaceng" + i,
                }),
                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
            })
        );
    }

    let currentObjectId: any = null;
    let currentPrimitive: any = null;
    let currentColor: any = null;
    let currentShow: any = null;
    let attributes: any = null;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            if (pickedObject.id === currentObjectId) {
                return;
            }

            if (Cesium.defined(currentObjectId)) {
                attributes = currentPrimitive.getGeometryInstanceAttributes(
                    currentObjectId
                );
                attributes.color = currentColor;
                attributes.show = currentShow;
                currentObjectId = undefined;
                currentPrimitive = undefined;
                currentColor = undefined;
                currentShow = undefined;
            }
        }

        if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.primitive) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)
        ) {
            currentObjectId = pickedObject.id;
            currentPrimitive = pickedObject.primitive;
            attributes = currentPrimitive.getGeometryInstanceAttributes(
                currentObjectId
            );
            currentColor = attributes.color;
            currentShow = attributes.show;
            if (!viewer.scene.invertClassification) {
                attributes.color = [255, 0, 255, 128];
            }
            attributes.show = [1];
        } else if (Cesium.defined(currentObjectId)) {
            attributes = currentPrimitive.getGeometryInstanceAttributes(
                currentObjectId
            );
            attributes.color = currentColor;
            attributes.show = currentShow;
            currentObjectId = undefined;
            currentPrimitive = undefined;
            currentColor = undefined;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


}

// 2021-04-16 粉刷匠 终极目标是点击一个单体化楼层，出现分层分户的效果 todo: 回调函数不能回调postition, 寻求其他办法
export const addQxsyDthFenhu = (tileset: any, viewer: any) => {
    // 首先添加primite模型    
    const center = Cesium.Cartesian3.fromDegrees(108.9594, 34.2198, 30)
    const dimensions = new Cesium.Cartesian3(50, 50, 100)// 盒子的长、宽、高
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    const hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0.0, 0.0)// 中心点水平旋转90度
    );
    const hpr = Cesium.Matrix4.fromRotationTranslation(
        hprRotation,
        new Cesium.Cartesian3(0.0, 0.0, 0.0)// 不平移
    );
    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
    viewer.scene.primitives.add(
        new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.BoxGeometry.fromDimensions({
                    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                    dimensions: dimensions
                    // maximum: Cesium.Cartesian3.fromDegrees(108.9598, 34.2202, 130),
                    // minimum: Cesium.Cartesian3.fromDegrees(108.9585, 34.2190, 30)
                }),
                modelMatrix: modelMatrix, // 提供位置与姿态参数
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        Cesium.Color.fromCssColorString("#F26419").withAlpha(0.5)
                    ),
                    show: new Cesium.ShowGeometryInstanceAttribute(true),
                },
                id: "dayanta",
            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        })
    );
    // let currentObjectId: any = null;
    // let currentPrimitive: any = null;
    // let currentColor: any = null;
    // let currentShow: any = null;
    // let attributes: any = null;

    // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // 鼠标移入的效果
    // handler.setInputAction(function (movement) {
    //     const pickedObject = viewer.scene.pick(movement.endPosition);
    //     if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
    //         if (pickedObject.id === currentObjectId) {
    //             return;
    //         }

    //         if (Cesium.defined(currentObjectId)) {
    //             attributes = currentPrimitive.getGeometryInstanceAttributes(
    //                 currentObjectId
    //             );
    //             attributes.color = currentColor;
    //             attributes.show = currentShow;
    //             currentObjectId = undefined;
    //             currentPrimitive = undefined;
    //             currentColor = undefined;
    //             currentShow = undefined;
    //         }
    //     }

    //     if (
    //         Cesium.defined(pickedObject) &&
    //         Cesium.defined(pickedObject.primitive) &&
    //         Cesium.defined(pickedObject.id) &&
    //         Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)
    //     ) {
    //         currentObjectId = pickedObject.id;
    //         currentPrimitive = pickedObject.primitive;
    //         attributes = currentPrimitive.getGeometryInstanceAttributes(
    //             currentObjectId
    //         );
    //         currentColor = attributes.color;
    //         currentShow = attributes.show;
    //         if (!viewer.scene.invertClassification) {
    //             attributes.color = [255, 0, 255, 128];
    //         }
    //         attributes.show = [1];
    //     } else if (Cesium.defined(currentObjectId)) {
    //         attributes = currentPrimitive.getGeometryInstanceAttributes(
    //             currentObjectId
    //         );
    //         attributes.color = currentColor;
    //         attributes.show = currentShow;
    //         currentObjectId = undefined;
    //         currentPrimitive = undefined;
    //         currentColor = undefined;
    //     }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // ---------------------------------------------鼠标点击的效果-------------------------------------
    let currentClickObjectId: any = null;
    const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
        // Pick a new feature
        const pickedObject = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedObject)) {
            clickHandler(movement);
            return;
        }

        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            if (pickedObject.id === currentClickObjectId) {
                return;
            } else {
                currentClickObjectId = pickedObject.id;
                yiDongSiCeng(viewer);
            }
        } else {
            // todo,清空现有的分层显示
            currentClickObjectId = null;
            clearEntity(viewer);
        }


    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


}

// 2021-04-16 粉刷匠 清除一栋四层的效果
export const clearEntity = (viewer: any) => {
    const preId = "boxCengId";
    for (let i = 0; i < 4; i++) {
        const sigId = preId + i;
        const sigEntity = viewer.entities.getById(sigId);
        if (sigEntity) viewer.entities.remove(sigEntity);
    }
}

// 2021-04-16 粉刷匠 绘制一个一栋四层的分层的效果
export const yiDongSiCeng = (viewer: any) => {


    const boxHeight = [110, 120, 130];
    const colorArr = ["#4AA6EC", "#54E668", "#FFBD28"];
    for (let i = 0; i < boxHeight.length; i++) {
        const boxEntity = new Cesium.Entity({
            id: "boxCengId" + i,
            name: 'sig-box',
            position: Cesium.Cartesian3.fromDegrees(108.9594, 34.2198, boxHeight[i]),
            box: {
                dimensions: new Cesium.Cartesian3(50, 50, 10),
                // 渐变纹理
                material: Cesium.Color.fromCssColorString(colorArr[i]).withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.BLACK
            }
        });
        viewer.entities.add(boxEntity);
    }
}

// 2021-04-16 粉刷匠 绘制函数 带有高度的绘制函数
let handlerDraw: any = null;
let entityDrawArr: any = [];
export const drawReal = (viewer: any, type: string) => {

    if (!viewer) return;

    // 鼠标点击 获取当前坐标
    const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    if (type === "Point") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;
        handler.setInputAction(function (movement: any) {

            // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
            const windowPosition = viewer.camera.getPickRay(movement.position);
            let cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
            // 获取场景坐标 Cartesian3 （pickPosition）
            const position = viewer.scene.pickPosition(movement.position);

            // 区分位置
            const pickedFeature = viewer.scene.pick(movement.position);
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);

            if (!Cesium.defined(pickedFeature) && cartesianCoordinates) {
                clickHandler(movement);
                // 添加地面点              
                const tmpEntity = viewer.entities.add({
                    id: "draw_Point" + tmpId,
                    position: cartesianCoordinates,
                    billboard: {
                        image: './Models/image/sxt.png',
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1)
                    }
                });
                entityDrawArr.push(tmpEntity);

            } else {
                // 添加建筑物上点
                const tmpEntity = viewer.entities.add({
                    id: "draw_Point" + tmpId,
                    position: position,
                    billboard: {
                        image: './Models/image/sxt.png',
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1)
                    }
                });
                entityDrawArr.push(tmpEntity);

            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    if (type === "Line") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;

        let positions: any = [];
        let poly: any = null;
        let cartesian: any = null;
        let floatingPoint: any = null;


        // 注册鼠标移动事件 
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 注册鼠标左击事件
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            floatingPoint = viewer.entities.add({
                id: "draw_Line_Point" + tmpId,
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                }
            });
            if (floatingPoint) {
                entityDrawArr.push(floatingPoint);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 注册鼠标右击--取消操作
        handler.setInputAction((movement: any) => {
            // handler && handler.destroy();
            positions.pop(); // 最后一个点无效
            positions = [];
            poly = null;
            cartesian = null;
            floatingPoint = null;
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


        const PolyLinePrimitive: any = (function () {
            function _(this: any, positions: any) {
                const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
                // console.log(tmpId);
                this.options = {
                    id: "draw_Line" + tmpId,
                    name: '直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.CHARTREUSE,
                        width: 7,
                        clampToGround: true
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };
                // 实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                const tmpEntity = viewer.entities.add(this.options);
                if (tmpEntity) {
                    entityDrawArr.push(tmpEntity);
                }
            };

            return _;
        })();

    }

    if (type === "Area") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;

        let positions: any = [];
        let tempPoints: any = [];
        let polygon: any = null;
        let polyline: any = null;
        let cartesian: any = null;
        let floatingPoint: any = []; // 浮动点

        // 注册鼠标移动事件
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length === 2) {
                if (!Cesium.defined(polyline)) {
                    polyline = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
            if (positions.length > 2) {
                if (!Cesium.defined(polygon)) {
                    polygon = new PolygonPrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 注册鼠标左击效果
        handler.setInputAction(function (movement: any) {

            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            // 在三维场景中添加点
            let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            let heightString = cartographic.height;
            tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            floatingPoint = viewer.entities.add({
                id: "draw_Area_Point" + tmpId,
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            if (floatingPoint) {
                entityDrawArr.push(floatingPoint);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 注册鼠标右击效果
        handler.setInputAction(function (movement: any) {
            // handler.destroy();
            positions.pop();
            positions = [];
            tempPoints = [];
            polygon = null;
            cartesian = null;
            floatingPoint = []; // 浮动点
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        const PolygonPrimitive: any = (function () {
            function _(this: any, positions: any) {
                const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
                this.options = {
                    id: "draw_Area" + tmpId,
                    name: '多边形',
                    polygon: {
                        hierarchy: [],
                        material: Cesium.Color.GREEN.withAlpha(0.5),
                    }
                };

                this.hierarchy = { positions };
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.hierarchy;
                };
                // 实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                const tmpEntity = viewer.entities.add(this.options);
                if (tmpEntity) {
                    entityDrawArr.push(tmpEntity);
                }
            };

            return _;
        })();

        const PolyLinePrimitive: any = (function () {
            function _(this: any, positions: any) {
                const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
                // console.log(tmpId);
                this.options = {
                    id: "draw_Area_Line" + tmpId,
                    name: '直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.CHARTREUSE,
                        width: 7,
                        clampToGround: true
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                // 当可以画矩形的时候，把线的postion设置为 undefined
                var _update = function () {
                    return _self.positions.length > 2 ? undefined : _self.positions;
                };
                // 实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                const tmpEntity = viewer.entities.add(this.options);
                if (tmpEntity) {
                    entityDrawArr.push(tmpEntity);
                }
            };

            return _;
        })();
    }

    // 2021-04-19 粉刷匠 添加文字点，todo: 添加任何你喜欢的点样式即可
    if (type === "Text") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;
        handler.setInputAction(function (movement: any) {

            // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
            const windowPosition = viewer.camera.getPickRay(movement.position);
            let cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
            // 获取场景坐标 Cartesian3 （pickPosition）
            const position = viewer.scene.pickPosition(movement.position);

            // 区分位置
            const pickedFeature = viewer.scene.pick(movement.position);
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);

            if (!Cesium.defined(pickedFeature) && cartesianCoordinates) {
                clickHandler(movement);
                // 添加地面点              
                const tmpEntity = viewer.entities.add({
                    id: "draw_Text" + tmpId,
                    position: cartesianCoordinates,
                    label: {
                        // 竖直的文字
                        text: '测\n试\n文\n字',
                        fillColor: new Cesium.Color(0.22, 0.89, 0.94),
                        pixelOffset: new Cesium.Cartesian2(0, -30),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                    },
                });
                entityDrawArr.push(tmpEntity);

            } else {
                // 添加建筑物上点
                const tmpEntity = viewer.entities.add({
                    id: "draw_Text" + tmpId,
                    position: position,
                    label: {
                        // 竖直的文字
                        text: '测\n试\n文\n字',
                        fillColor: new Cesium.Color(0.22, 0.89, 0.94),
                        pixelOffset: new Cesium.Cartesian2(0, -30),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                    },
                });
                entityDrawArr.push(tmpEntity);

            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    // 2021-04-19 粉刷匠 添加 圆
    if (type === "Circle") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;

        let positions: any = [];
        let poly: any = null;
        let cartesian: any = null;
        let floatingPoint: any = null;


        // 注册鼠标移动事件 
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyCirclePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 注册鼠标左击事件
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');

            if (positions.length === 2) {
                floatingPoint = viewer.entities.add({
                    id: "draw_Circle_Point" + tmpId,
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    }
                });
                if (floatingPoint) {
                    entityDrawArr.push(floatingPoint);
                }
            } else {
                positions = [];
                poly = null;
                cartesian = null;
                floatingPoint = null;
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);




        const PolyCirclePrimitive: any = (function () {
            function _(this: any, positions: any) {
                const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
                this.options = {
                    id: "draw_Circle" + tmpId,
                    name: '圆',
                    position: [],
                    ellipse: {
                        semiMinorAxis: 0,
                        semiMajorAxis: 0,
                        material: Cesium.Color.BLUE.withAlpha(0.5),
                        outline: true,
                    },
                };
                this.positions = positions;
                this._init();
            }

            // todo: 最短为1，请优化
            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    if (!_self.positions[0] || !_self.positions[1]) return 1;
                    const Point1 = _self.positions[0];
                    const Point2 = _self.positions[1];
                    const tmpDistance = calDistance(Point1, Point2);
                    return tmpDistance ? tmpDistance : 1;
                };
                var _update_2 = function () {
                    if (!_self.positions[0] || !_self.positions[1]) return 1;
                    const Point1 = _self.positions[0];
                    const Point2 = _self.positions[1];
                    const tmpDistance = calDistance(Point1, Point2);
                    return tmpDistance ? tmpDistance : 1;
                };
                // 实时更新polyline.positions
                this.options.position = _self.positions[0] ? _self.positions[0] : undefined;
                this.options.ellipse.semiMinorAxis = new Cesium.CallbackProperty(_update, false);
                this.options.ellipse.semiMajorAxis = new Cesium.CallbackProperty(_update_2, false);

                const tmpEntity = viewer.entities.add(this.options);
                if (tmpEntity) {
                    entityDrawArr.push(tmpEntity);
                }
            };

            return _;
        })();

    }

    // 2021-04-19 粉刷匠 添加 矩形
    if (type === "Square") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;

        let positions: any = [];
        let poly: any = null;
        let cartesian: any = null;
        let floatingPoint: any = null;


        // 注册鼠标移动事件 
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolySquarePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 注册鼠标左击事件
        handler.setInputAction((movement: any) => {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');

            if (positions.length === 2) {
                floatingPoint = viewer.entities.add({
                    id: "draw_Square_Point" + tmpId,
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    }
                });
                if (floatingPoint) {
                    entityDrawArr.push(floatingPoint);
                }
            } else {
                positions = [];
                poly = null;
                cartesian = null;
                floatingPoint = null;
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


        const PolySquarePrimitive: any = (function () {
            function _(this: any, positions: any) {
                const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
                this.options = {
                    id: "draw_Square" + tmpId,
                    name: '矩形',
                    position: [],
                    rectangle: {
                        coordinates: [],
                        material: Cesium.Color.BLACK.withAlpha(0.4),
                        outline: true,
                        classificationType: Cesium.ClassificationType.TERRAIN,
                    },
                };
                this.positions = positions;
                this._init();
            }

            // todo: 最短为1，请优化
            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    if (!_self.positions[0] || !_self.positions[1]) return [];
                    const Point1 = _self.positions[0];
                    const Point2 = _self.positions[1];
                    const Point1Cart = viewer.scene.globe.ellipsoid.cartesianToCartographic(Point1);
                    const Point2Cart = viewer.scene.globe.ellipsoid.cartesianToCartographic(Point2);
                    const rect = Cesium.Rectangle.fromCartographicArray([Point1Cart, Point2Cart]);
                    return rect ? rect : [];
                };

                // 实时更新
                this.options.rectangle.coordinates = new Cesium.CallbackProperty(_update, false);

                const tmpEntity = viewer.entities.add(this.options);
                if (tmpEntity) {
                    entityDrawArr.push(tmpEntity);
                }
            };

            return _;
        })();

    }

    // 清除
    if (type === "Clear") {
        if (handlerDraw) { handlerDraw.destroy(); }
        for (let i = 0; i < entityDrawArr.length; i++) {
            viewer.entities.remove(entityDrawArr[i]);
        }
    }

    // 保存
    if (type === "Save") {
        if (handlerDraw) { handlerDraw.destroy(); }

        // todo:需要后端的配合，从entity集合中，重新组织
        const tmpTestData: any = [];
        for (let i = 0; i < entityDrawArr.length; i++) {
            const sigEntity = entityDrawArr[i];
            tmpTestData.push({
                id: sigEntity.id,
            })
        }

        const title = "Entity" + moment().format('YYYYMMDDHHmmss') + moment().get('milliseconds');
        let tmpJson = {};
        tmpJson = {
            "type": "FeatureCollection",
            "features": tmpTestData
        }
        saveJSON(title, tmpJson).then(() => {
            console.log('保存成功')
        })
    }

    // 编辑
    if (type === "Edit") {
        if (handlerDraw) { handlerDraw.destroy(); }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerDraw = handler;
        let selEntitity: any = null;

        handler.setInputAction(function (movement: any) {
            // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
            const windowPosition = viewer.camera.getPickRay(movement.position);
            let cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
            const pickedFeature = viewer.scene.pick(movement.position);

            if (!Cesium.defined(pickedFeature) && cartesianCoordinates) {
                clickHandler(movement);
            } else {
                if (Cesium.defined(pickedFeature)) {
                    const entityId: any = pickedFeature.id._id;
                    // todo: 仅针对我画的图形
                    if (entityId.indexOf("draw") === 0) {
                        console.log(entityId);
                        if (selEntitity === pickedFeature) {
                            selEntitity = null;
                        } else {
                            selEntitity = pickedFeature;
                        }
                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // handler.setInputAction(function (movement: any) {
        //     // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
        //     const windowPosition = viewer.camera.getPickRay(movement.position);
        //     let cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
        //     // 获取场景坐标 Cartesian3 （pickPosition）
        //     const position = viewer.scene.pickPosition(movement.position);
        //     // 区分位置
        //     const pickedFeature = viewer.scene.pick(movement.position);

        //     if (!Cesium.defined(pickedFeature) && cartesianCoordinates) {
        //         clickHandler(movement);
        //         if (selEntitity) {
        //             // 针对点
        //             const entityId: any = selEntitity.id._id;
        //             if (entityId.indexOf("draw_Point") === 0) {
        //                 console.log(selEntitity);
        //             }
        //         }
        //     } else {
        //         if (Cesium.defined(pickedFeature)) {
        //             console.log(selEntitity);
        //         }
        //     }

        // }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    }

}

// 2021-04-16 粉刷匠 保存输出为json
export const isMSbrowser = () => {
    const userAgent = window.navigator.userAgent
    return userAgent.indexOf('Edge') !== -1 || userAgent.indexOf('Trident') !== -1
}

// 2021-04-16 粉刷匠 保存输出为json
export const saveJSON = (title: any, data: any) => {
    let reTitle = title + '.json';
    let dataStr = data ? JSON.stringify(data) : '';


    return isMSbrowser()
        ? new Promise((resolve: any) => { // Edge、IE11
            let blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' })
            window.navigator.msSaveBlob(blob, reTitle)
            resolve();
        })
        : new Promise((resolve: any) => { // Chrome、Firefox
            let a = document.createElement('a')
            a.href = 'data:text/json;charset=utf-8,' + dataStr
            a.download = reTitle
            a.click();
            resolve();
        })
}

// 2021-04-19 粉刷匠 计算两点之间的距离, cartesian坐标
export const calDistance = (Point1: any, Point2: any) => {

    if (!Point1 || !Point2) return 1.0;
    if (Point1.x === Point2.x && Point1.y === Point2.y && Point1.z === Point2.z) return 1.0;

    const point1Cartographic = Cesium.Cartographic.fromCartesian(Point1);
    const point2Cartographic = Cesium.Cartographic.fromCartesian(Point2);
    const geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1Cartographic, point2Cartographic);
    let s = geodesic.surfaceDistance;
    //返回两点之间的距离
    // s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    // s = Math.abs(point2cartographic.height - point1cartographic.height);
    // distance = distance + s;
    return Number(s);

    // let heightString = point1Cartographic.height;
    // const lng1 = Cesium.Math.toDegrees(point1Cartographic.longitude);
    // const lat1 = Cesium.Math.toDegrees(point1Cartographic.latitude);
    // const lng2 = Cesium.Math.toDegrees(point2Cartographic.longitude);
    // const lat2 = Cesium.Math.toDegrees(point2Cartographic.latitude);

    // const EARTH_RADIUS = 6378137.0;    //单位M
    // const PI = Math.PI;

    // function getRad(d: any) {
    //     return d * PI / 180.0;
    // }
    // const f = getRad((lat1 + lat2) / 2);
    // const g = getRad((lat1 - lat2) / 2);
    // const l = getRad((lng1 - lng2) / 2);

    // let sg = Math.sin(g);
    // let sl = Math.sin(l);
    // let sf = Math.sin(f);

    // let s, c, w, r, d, h1, h2;
    // let a = EARTH_RADIUS;
    // let fl = 1 / 298.257;

    // sg = sg * sg;
    // sl = sl * sl;
    // sf = sf * sf;

    // s = sg * (1 - sl) + (1 - sf) * sl;
    // c = (1 - sg) * (1 - sl) + sf * sl;

    // w = Math.atan(Math.sqrt(s / c));
    // r = Math.sqrt(s * c) / w;
    // d = 2 * w * a;
    // h1 = (3 * r - 1) / 2 / c;
    // h2 = (3 * r + 1) / 2 / s;

    // return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

// 2021-04-19 粉刷匠 添加分帘遮罩
export const addFenLian = (viewer: any) => {
    const layers = viewer.imageryLayers;
    const earthAtNight = layers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: 'GoogleMapsCompatible',
        }),
    );
    earthAtNight.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the slider.
    const slider: any = document.getElementById("slider");
    viewer.scene.imagerySplitPosition = slider.offsetLeft / slider.parentElement.offsetWidth;

    if (handlerDraw) { handlerDraw.destroy(); }
    const handler = new Cesium.ScreenSpaceEventHandler(slider);
    let moveActive = false;

    function move(movement: any) {
        if (!moveActive) {
            return;
        }

        var relativeOffset = movement.endPosition.x;
        var splitPosition =
            (slider.offsetLeft + relativeOffset) /
            slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + "%";
        viewer.scene.imagerySplitPosition = splitPosition;
    }

    handler.setInputAction(function () {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function () {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);

    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

    handler.setInputAction(function () {
        moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(function () {
        moveActive = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);

}

// 2021-04-19 粉刷匠 导出图片
export const exportPng = (viewer: any) => {
    const canvas = viewer.scene.canvas;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    // const strDataURI = image.substr(22, image.length);
    const blob = dataURLtoBlob(image);
    const objurl = URL.createObjectURL(blob);
    const tmpTime = moment().format('YYYYMMDDHHmmss') + moment().get("milliseconds");
    link.download = "Image" + tmpTime + ".png";
    link.href = objurl;
    link.click();

    function dataURLtoBlob(dataurl: any) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}

let weatherCondition: any = null;
// 2021-04-19 粉刷匠 添加天气效果
export const addWeatherCondition = (viewer: any) => {
    // 雾效果
    if (weatherCondition) viewer.scene.postProcessStages.remove(weatherCondition);
    const tmpCondition = new Cesium.PostProcessStage({
        name: 'weather_snow',
        fragmentShader: WuShader
    })
    viewer.scene.postProcessStages.add(tmpCondition);
    weatherCondition = tmpCondition;
}

// 2021-04-20 粉刷匠 获取当前场景经纬度范围
export const getCurrentCameraInfo = (viewer: any) => {

    // 经纬度范围
    let params: any = {};
    let extend = viewer.camera.computeViewRectangle();
    if (typeof extend === "undefined") {
        //2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
        let canvas = viewer.scene.canvas;
        let upperLeft = new Cesium.Cartesian2(0, 0);//canvas左上角坐标转2d坐标
        let lowerRight = new Cesium.Cartesian2(
            canvas.clientWidth,
            canvas.clientHeight
        );// canvas右下角坐标转2d坐标

        let ellipsoid = viewer.scene.globe.ellipsoid;
        let upperLeft3 = viewer.camera.pickEllipsoid(
            upperLeft,
            ellipsoid
        );// 2D转3D世界坐标

        let lowerRight3 = viewer.camera.pickEllipsoid(
            lowerRight,
            ellipsoid
        );// 2D转3D世界坐标

        let upperLeftCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            upperLeft3
        );// 3D世界坐标转弧度
        let lowerRightCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            lowerRight3
        );// 3D世界坐标转弧度

        let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude);//弧度转经纬度
        let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude);//弧度转经纬度

        let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude);//弧度转经纬度
        let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude);//弧度转经纬度

        // console.log("经度：" + minx + "----" + maxx);
        // console.log("纬度：" + miny + "----" + maxy);

        params.minx = minx;
        params.maxx = maxx;
        params.miny = miny;
        params.maxy = maxy;
    } else {
        //3D获取方式
        params.maxx = Cesium.Math.toDegrees(extend.east);
        params.maxy = Cesium.Math.toDegrees(extend.north);

        params.minx = Cesium.Math.toDegrees(extend.west);
        params.miny = Cesium.Math.toDegrees(extend.south);
    }

    // 相机参数
    const camera = viewer.camera;
    const heading = Cesium.Math.toDegrees(camera.heading)
    const pitch = Cesium.Math.toDegrees(camera.pitch)//Cesium.Math.toDegrees作用是把弧度转换成度数
    const roll = Cesium.Math.toDegrees(camera.roll)
    params["cameraHPR"] = {
        heading,
        pitch,
        roll
    }

    // 获取中心点坐标与相机高度
    const result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
    const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
    const lon = curPosition.longitude * 180 / Math.PI;
    const lat = curPosition.latitude * 180 / Math.PI;

    const scene = viewer.scene;
    const ellipsoid = scene.globe.ellipsoid;
    const height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    const clongitude = Number(viewer.camera.positionCartographic.longitude);
    const clatitude = Number(viewer.camera.positionCartographic.latitude);
    params["midLocation"] = {
        "lon": lon,
        "lat": lat,
    }
    params["cameraHeight"] = {
        "longitude": clongitude,
        "latitude": clatitude,
        "height": height
    }
    return params;// 返回屏幕所在经纬度范围
}

// 2021-04-20 粉刷匠 当前场景跳转, 血与泪的尝试，具体的尝试次数参考上面函数
export const goToBookMark = (viewer: any, cameraInfo: any) => {
    if (!viewer) return;

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(cameraInfo.cameraHeight.longitude, cameraInfo.cameraHeight.latitude, cameraInfo.cameraHeight.height),
        orientation: {
            heading: Cesium.Math.toRadians(cameraInfo.cameraHPR.heading),
            pitch: Cesium.Math.toRadians(cameraInfo.cameraHPR.pitch),
            roll: Cesium.Math.toRadians(cameraInfo.cameraHPR.roll)
        }
    });

}

// 2021-04-22 粉刷匠 添加一个旋转的地球
export const addRotateEarth = (viewer: any) => {

    if (rotateClock) { clearInterval(rotateClock); }
    rotateClock = setInterval(() => {
        const angle = Math.PI * 0.5 / 180.0;
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, angle);
    }, 100);


    // 点击停止
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        if (rotateClock) {
            clearInterval(rotateClock);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);


}

// 2021-04-22 粉刷匠 绕点旋转
let rotePointClock: any = null;
export const addRotatePoint = (viewer: any) => {

    const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(113.88, 22.564),
        point: {
            color: Cesium.Color.RED,
            pixelSize: 10
        }
    });

    let heading = 180; // 朝向
    rotePointClock = setInterval(() => {
        heading -= 0.05;
        if (heading < -179) {
            heading = 180;
        }
        const offset = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(heading), -Cesium.Math.toRadians(30), 1000);
        viewer.zoomTo(entity, offset)
    }, 100);

    // 点击停止
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        if (rotePointClock) {
            clearInterval(rotePointClock);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

}

// 2021-04-22 粉刷匠 添加视频投影 初级  平铺视频和视频墙
export const addVideoLevel0 = (viewer: any) => {
    // 获取视频元素
    const videoElement: any = document.getElementById("trailer");
    // 创建实体对象-- 平铺视频
    // const rectangle = viewer.entities.add({
    //     rectangle: {
    //         coordinates: Cesium.Rectangle.fromDegrees(113.92, 22.53, 114.12, 22.69),
    //         material: videoElement
    //     },
    //     // 或创建多边形
    //     // polygon: {
    //     //    hierarchy: new PolygonHierarchy(positions),
    //     //    material: videoElement
    //     // },
    // });

    // 创建实体对象-- 视频墙
    const pArray = [
        113.92,
        22.53,
        6000,
        114.12,
        22.69,
        6000,
    ];
    const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.WallGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(pArray),
            minimumHeights: [150.5, 150.5], //最低位置。单位米
        }),
    });
    //将该材质设置为视频，并给与模型
    const material = Cesium.Material.fromType("Image");
    material.uniforms.image = videoElement;

    const tileset = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.MaterialAppearance({
                closed: false,
                material: material,
            }),
        })
    );

    if (tileset) {
        // 
    }


    let synchronizer = new Cesium.VideoSynchronizer({
        clock: viewer.clock,
        element: videoElement
    })

    if (synchronizer) {
        // 
    }

    viewer.clock.shouldAnimate = true;
    // 锁定实体对象（这句可有可无）
    // viewer.trackedEntity = rectangle;

}

// 2021-04-22 粉刷匠 淹没分析
export const addFlood = (viewer: any) => {

    // 粉刷匠 添加自己的地形数据，这里注意打开cesium自带的地形文件
    // var terrainLayer = new Cesium.CesiumTerrainProvider({
    //     url: 'http://localhost:9002/api/wmts/terrain/671bf0e4425e421a8fbe701e2b4db959',
    //     requestWaterMask: true,
    //     credit: 'http://www.bjxbsj.cn',
    // });
    // // 创建容器
    // var viewer = new Cesium.Viewer('cesiumContainer', {
    //     selectionIndicator: false,
    //     infoBox: false,
    //     terrainProvider: terrainLayer
    // });

    // 创建地形图层
    const cord1 = [113.88, 22.56];
    const cord2 = [114.00, 22.63];
    const rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(cord1[0]), Cesium.Math.toRadians(cord1[1]), Cesium.Math.toRadians(cord2[0]), Cesium.Math.toRadians(cord2[1]));
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.camera.flyTo({ destination: rectangle });  // 定位到目标地形

    // ---------------------------------动态画贴底线-------------------------------------
    if (handlerDraw) { handlerDraw.destroy(); }
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let polyline: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 2) {
            if (!Cesium.defined(polyline)) {
                polyline = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
        if (positions.length > 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('This browser does not support polylines on terrain.');
            return;
        }


        // 粉刷匠 获取地形上的点
        cartesian = viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(cartesian)) {
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }


        // 在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
        floatingPoint = viewer.entities.add({
            id: "draw_Flood_Point" + tmpId,
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        if (floatingPoint) {
            entityDrawArr.push(floatingPoint);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    let isdown = false;
    handler.setInputAction(function (movement: any) {
        positions.pop();
        handler.destroy();

        if (positions && polygon) {
            // viewer.entities.remove(polygon);
            // polygon.polygon.hierarchy = undefined;
            viewer.scene.primitives.remove(polygon);
            isdown = true;
            addRealFlood(positions);
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            this.options = {
                id: "draw_Flood" + tmpId,
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                if (isdown) return undefined;
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();

    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);
            this.options = {
                id: "draw_Flood_Line" + tmpId,
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 7,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            // 当可以画矩形的时候，把线的postion设置为 undefined
            var _update = function () {
                return _self.positions.length > 2 ? undefined : _self.positions;
            };
            // 实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();

    // ------------------------------添加一个水体实体-------------------------
    const computePolygonHeightRange = (e: any) => {
        const t: any = []
        for (let i = 0; i < e.length; i++) {
            t.push(e[i].clone());
        }

        let a: any = null;
        let n: any = null;
        let r: any = null;
        let o: any = null;
        let s: any = null;
        let u: any = null;
        let l: any = null;
        let h: any = 0;
        let g: any = 9999;
        let c: any = Math.PI / Math.pow(2, 11) / 64;
        let m: any = Cesium.PolygonGeometry.fromPositions({
            positions: t,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: c
        });
        let d = Cesium.PolygonGeometry.createGeometry(m);
        if (!d) return {
            maxHeight: h,
            minHeight: g
        }
        for (let i = 0; i < d.indices.length; i += 3) {
            a = d.indices[i];
            n = d.indices[i + 1];
            r = d.indices[i + 2];
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * a], d.attributes.position.values[3 * a + 1], d.attributes.position.values[3 * a + 2]);
            (o = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = o);
            h < o && (h = o);
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * n], d.attributes.position.values[3 * n + 1], d.attributes.position.values[3 * n + 2]);
            (s = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = s);
            h < s && (h = s);
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * r], d.attributes.position.values[3 * r + 1], d.attributes.position.values[3 * r + 2]);
            (u = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = u);
            h < u && (h = u);
        }
        return {
            maxHeight: h,
            minHeight: g
        }
    }

    const addRealFlood = (polyPosition: any) => {
        const tmpAllHeight = computePolygonHeightRange(polyPosition);
        const maxHeight = tmpAllHeight.maxHeight;
        const minHeight = tmpAllHeight.minHeight;
        let tmpHeight = minHeight;
        let tmpInterv = (maxHeight - minHeight) * 0.001;

        viewer.scene.globe.depthTestAgainstTerrain = true;
        const tmpEntity = viewer.entities.add({
            name: '多边形',
            polygon: {
                hierarchy: polyPosition,
                perPositionHeight: true,
                extrudedHeight: new Cesium.CallbackProperty(() => {
                    if (tmpHeight > maxHeight) {
                        tmpHeight = minHeight;
                    } else {
                        tmpHeight += tmpInterv;
                    }
                    return tmpHeight;
                }, false),
                material: Cesium.Color.fromBytes(64, 157, 253, 150)
            }
        })

        if (tmpEntity) {
            // 
        }



    }


}

// 2021-04-22-27 粉刷匠 添加视频投影 中级 未完成
export const addVideoLevel1 = (viewer: any) => {
    // 获取视频元素
    // const c3 = Cesium.Cartesian3.fromDegrees(113.91, 22.50, 140.0)
    // new ViewShedStage(viewer, {
    //     viewPosition: c3,
    //     viewDistance: 1000
    // })
    // todo: 注意修改各项参数
    new CesiumVideo3d(Cesium, viewer, {
        url: "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm",
        position: { x: 113.94, y: 22.51, z: 140.0 },
        far: 1000,
        rotation: { x: 0, y: 0 }
    })
}

// 2021-04-22 粉刷匠 建筑物限高分析，todo；搭配弹窗 说明现有高度及超出高度
export const addLimiteHeight = (viewer: any) => {

    // 我想的解决思路是 添加一个物体，底部高度为限制高度，设置 classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    const limiteheight = 700; // 这个高度实际上是箱子的一半+实际限高  600=500+100
    const center = Cesium.Cartesian3.fromDegrees(113.94, 22.52, limiteheight);
    const dimensions = new Cesium.Cartesian3(5000, 5000, 1000)// 盒子的长、宽、高
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    const hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0.0, 0.0)// 中心点水平旋转90度
    );
    const hpr = Cesium.Matrix4.fromRotationTranslation(
        hprRotation,
        new Cesium.Cartesian3(0.0, 0.0, 0.0)// 不平移
    );
    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
    viewer.scene.primitives.add(
        new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.BoxGeometry.fromDimensions({
                    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                    dimensions: dimensions
                }),
                modelMatrix: modelMatrix, // 提供位置与姿态参数
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        // Cesium.Color.fromCssColorString("#F26419").withAlpha(0.5)
                        Cesium.Color.fromCssColorString("#E82821")
                    ),
                    show: new Cesium.ShowGeometryInstanceAttribute(true),
                },
                id: "limiteHeightPrimitive",
            }),
            // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        })
    );
}

// 2021-04-23 粉刷匠 3dtiles 平面裁剪
export const addClipTo3DTiles = (viewer: any) => {
    // 参考示例地址：https://sandcastle.cesium.com/?src=3D%20Tiles%20Clipping%20Planes.html&label=All
    // 可以使用平面裁剪的有："BIM", "Point Cloud", "Instanced", "Model"
    // 前两个没什么好说的，3：json 4：glb
    let targetY: any = 0.0;
    let planeEntities: any = [];
    let selectedPlane: any = null;
    let clippingPlanes: any = null;

    const createPlaneUpdateFunction = (plane: any) => {
        return function () {
            plane.distance = targetY;
            return plane;
        };
    }

    clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
            new Cesium.ClippingPlane(
                new Cesium.Cartesian3(0.0, 0.0, -1.0),
                0.0
            ),
        ],
        // edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0,
    });

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: "./Models/szNanshan/tileset.json",
        clippingPlanes: clippingPlanes
    })

    // tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
    tmpTileset.readyPromise.then(function (tileset: any) {

        const boundingSphere = tileset.boundingSphere;
        const radius = boundingSphere.radius;
        viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0)
        );

        if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
            // The clipping plane is initially positioned at the tileset's root transform.
            // Apply an additional matrix to center the clipping plane on the bounding sphere center.
            const transformCenter = Cesium.Matrix4.getTranslation(
                tileset.root.transform,
                new Cesium.Cartesian3()
            );
            const transformCartographic = Cesium.Cartographic.fromCartesian(
                transformCenter
            );
            const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
                tileset.boundingSphere.center
            );
            const height = boundingSphereCartographic.height - transformCartographic.height;
            clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
                new Cesium.Cartesian3(0.0, 0.0, height)
            );
        }

        for (var i = 0; i < clippingPlanes.length; ++i) {
            var plane = clippingPlanes.get(i);
            var planeEntity = viewer.entities.add({
                position: boundingSphere.center,
                plane: {
                    dimensions: new Cesium.Cartesian2(
                        radius * 2.5,
                        radius * 2.5
                    ),
                    material: Cesium.Color.WHITE.withAlpha(0.1),
                    plane: new Cesium.CallbackProperty(
                        createPlaneUpdateFunction(plane),
                        false
                    ),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                },
            });

            planeEntities.push(planeEntity);
        }

        viewer.scene.primitives.add(tileset);
        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                ]
            }
        });
        // 设置3dTiles贴地
        set3DtilesHeight(1, tileset);
    })


    // ---------------------------监听事件区---------------------------------------------
    // Select plane when mouse down
    const downHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
    );
    downHandler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
            selectedPlane = pickedObject.id.plane;
            selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
            selectedPlane.outlineColor = Cesium.Color.WHITE;
            viewer.scene.screenSpaceCameraController.enableInputs = false;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // Release plane on mouse up
    const upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    upHandler.setInputAction(function () {
        if (Cesium.defined(selectedPlane)) {
            selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
            selectedPlane.outlineColor = Cesium.Color.WHITE;
            selectedPlane = undefined;
        }

        viewer.scene.screenSpaceCameraController.enableInputs = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // Update plane on mouse move
    const moveHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
    );
    moveHandler.setInputAction(function (movement) {
        if (Cesium.defined(selectedPlane)) {
            const deltaY = movement.startPosition.y - movement.endPosition.y;
            targetY += deltaY;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

// 2021-04-23 粉刷匠 地形挖掘
export const addClipToTerrien = (viewer: any) => {

    // 方式0：逆时针序列
    let clippingPlanesEnabled = true;
    let edgeStylingEnabled = true;
    // ---------------------------------动态画贴底线-------------------------------------
    const cord1 = [113.88, 22.56];
    const cord2 = [114.00, 22.63];
    const rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(cord1[0]), Cesium.Math.toRadians(cord1[1]), Cesium.Math.toRadians(cord2[0]), Cesium.Math.toRadians(cord2[1]));
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.camera.flyTo({ destination: rectangle });  // 定位到目标地形

    if (handlerDraw) { handlerDraw.destroy(); }
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let polyline: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 2) {
            if (!Cesium.defined(polyline)) {
                polyline = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
        if (positions.length > 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('This browser does not support polylines on terrain.');
            return;
        }


        // 粉刷匠 获取地形上的点
        cartesian = viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(cartesian)) {
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }


        // 在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
        floatingPoint = viewer.entities.add({
            id: "draw_Clip_Point" + tmpId,
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        if (floatingPoint) {
            entityDrawArr.push(floatingPoint);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        positions.pop();
        handler.destroy();

        if (positions && polygon) {
            addRealClip(positions);
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            this.options = {
                id: "draw_Clip" + tmpId,
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();

    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);
            this.options = {
                id: "draw_Clip_Line" + tmpId,
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 7,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            // 当可以画矩形的时候，把线的postion设置为 undefined
            var _update = function () {
                return _self.positions.length > 2 ? undefined : _self.positions;
            };
            // 实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();


    // --------------------------------根据点坐标构建clippingPlans--------------------------
    // 构建逆时针序列
    const makeDataCCW = (pointArr: any) => {
        // 原理：可以使用鞋带法或者极值法
        const wgsData: any = [];
        for (let i = 0; i < pointArr.length; i++) {
            const cartographic = Cesium.Cartographic.fromCartesian(pointArr[i]);
            let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            wgsData.push({
                longitude: Number(longitudeString),
                latitude: Number(latitudeString)
            });
        }

        let tmpMaxLonIndex: any = 0;
        for (let i = 1; i < wgsData.length; i++) {
            tmpMaxLonIndex = wgsData[i].longitude > wgsData[tmpMaxLonIndex].longitude ? i : tmpMaxLonIndex;
        }

        const pointNum = wgsData.length;
        const prePoint = wgsData[((tmpMaxLonIndex - 1) + pointNum) % pointNum];
        const curPoint = wgsData[tmpMaxLonIndex];
        const nextPoint = wgsData[(tmpMaxLonIndex + 1) % pointNum];

        const x1 = prePoint.longitude;
        const y1 = prePoint.latitude;
        const x2 = curPoint.longitude;
        const y2 = curPoint.latitude;
        const x3 = nextPoint.longitude;
        const y3 = nextPoint.latitude;
        const dirRes = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        const isR = dirRes > 0;
        return isR;
    }

    const addRealClip = (pointArr: any) => {
        if (!pointArr) return;
        if (!pointArr.length) return;
        const pointsLength = pointArr.length;
        const clippingPlanes: any = [];

        // 计算各个点的高度，对于设置墙
        // const tmpAllHeight = computePolygonHeight(pointArr);

        // 统一修改为逆时针
        const isCCW = makeDataCCW(pointArr);
        if (isCCW) {
            // console.log("逆时针")
        } else {
            // console.log("顺时针");
            const tmpPointArr: any = [];
            for (let i = pointsLength - 1; i >= 0; i--) {
                tmpPointArr.push(pointArr[i]);
            }
            pointArr = tmpPointArr;
        }

        // 计算地面点坐标
        const tmpInterval = 10;
        const landPoint = calcLandPointInter(viewer, pointArr, tmpInterval);


        // 底部
        viewer.entities.add({
            polygon: {
                // height 距离地面的高度，todo:需要计算，场景 挖方向下 10米，可以根据当前点序列坐标的最小值-10；
                // height: 70,
                hierarchy: landPoint,
                material: new Cesium.ImageMaterialProperty({
                    image: "./Models/image/road.jpg"
                }),
                // extrudedHeight: 0,
                extrudedHeight: 0,
                closeTop: false, // 这个要设置为false
                // closeBottom: false,
                perPositionHeight: true // 这个要设置true
            }
        });

        // 逆时针序列 计算
        for (let i = 0; i < pointsLength; ++i) {
            let nextIndex = (i + 1) % pointsLength;
            let midpoint = Cesium.Cartesian3.add(pointArr[i], pointArr[nextIndex], new Cesium.Cartesian3());
            midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

            let up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
            let right = Cesium.Cartesian3.subtract(pointArr[nextIndex], midpoint, new Cesium.Cartesian3());
            right = Cesium.Cartesian3.normalize(right, right);

            let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
            normal = Cesium.Cartesian3.normalize(normal, normal);

            let originCenteredPlane = new Cesium.Plane(normal, 0.0);
            let distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

            clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
        }

        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: edgeStylingEnabled ? 1.0 : 0.0,
            edgeColor: Cesium.Color.WHITE,
            enabled: clippingPlanesEnabled,
        });
        viewer.scene.globe.backFaceCulling = true;
        viewer.scene.globe.showSkirts = true;


    }


    // ----------------------------------方式1--------------------------------------


    // const position = Cesium.Cartesian3.fromDegrees(
    //     113.91,
    //     22.50,
    //     140.0
    // );

    // const entity = viewer.entities.add({
    //     position: position,
    //     box: {
    //         dimensions: new Cesium.Cartesian3(400.0, 400.0, 800.0),
    //         material: Cesium.Color.WHITE.withAlpha(0.3),            
    //         outline: true,
    //         outlineColor: Cesium.Color.WHITE,
    //     },
    // });

    // viewer.entities.add({
    //     polygon: {
    //         hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
    //             113.91, 22.50, 140.0,
    //             113.91, 22.51, 140.0,
    //             113.92, 22.51, 140.0,
    //             113.92, 22.50, 140.0
    //         ]),
    //         material: new Cesium.ImageMaterialProperty({
    //             image: "./Models/image/dark.png"
    //         }),
    //         closeTop: false, // 这个要设置为false
    //         extrudedHeight: 0,
    //         perPositionHeight: true // 这个要设置true
    //     }
    // });

    // viewer.scene.globe.depthTestAgainstTerrain = true;
    // viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
    //     modelMatrix: entity.computeModelMatrix(Cesium.JulianDate.now()),
    //     planes: [
    //         new Cesium.ClippingPlane(
    //             new Cesium.Cartesian3(1.0, 0.0, 0.0),
    //             -200.0
    //         ),
    //         new Cesium.ClippingPlane(
    //             new Cesium.Cartesian3(-1.0, 0.0, 0.0),
    //             -200.0
    //         ),
    //         new Cesium.ClippingPlane(
    //             new Cesium.Cartesian3(0.0, 1.0, 0.0),
    //             -200.0
    //         ),
    //         new Cesium.ClippingPlane(
    //             new Cesium.Cartesian3(0.0, -1.0, 0.0),
    //             -200.0
    //         ),
    //     ],
    //     edgeWidth: edgeStylingEnabled ? 1.0 : 0.0,
    //     edgeColor: Cesium.Color.WHITE,
    //     enabled: clippingPlanesEnabled,
    // });
    // viewer.scene.globe.backFaceCulling = true;
    // viewer.scene.globe.showSkirts = true;

}

// 2021-04-25 粉刷匠 地形切割，地面点的插值 2021-04-26 粉刷匠 终于完成
const calcLandPointInter = (viewer: any, pointArr: any, tmpInterval: any) => {

    // wgs84坐标列
    const wgsData: any = [];
    for (let i = 0; i < pointArr.length; i++) {
        const cartographic = Cesium.Cartographic.fromCartesian(pointArr[i]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        wgsData.push({
            longitude: longitudeString,
            latitude: latitudeString,
        })
    }

    // 插值序列
    const interpolationArr: any = [];
    for (let i = 0; i < wgsData.length; i++) {
        const nexIndex = (i + 1) % (wgsData.length);
        const curLat = Number(wgsData[i].latitude);
        const curLon = Number(wgsData[i].longitude);
        const nextLat = Number(wgsData[nexIndex].latitude);
        const nextLon = Number(wgsData[nexIndex].longitude);

        const tmpLonInter = (nextLon - curLon) * 1.0 / tmpInterval;
        const tmpLatInter = (nextLat - curLat) * 1.0 / tmpInterval;

        interpolationArr.push(wgsData[i]);
        for (let j = 0; j < (tmpInterval - 1); j++) {
            interpolationArr.push({
                longitude: curLon + (j + 1) * tmpLonInter,
                latitude: curLat + (j + 1) * tmpLatInter,
            })
        }

    }

    // 添加高度,todo:这里的height减去XX后，就是一个地下的空隙，感觉可以做地层
    for (let i = 0; i < interpolationArr.length; i++) {
        const tmpHeight = viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(
            interpolationArr[i].longitude,
            interpolationArr[i].latitude
        ))
        interpolationArr[i]['height'] = tmpHeight;
    }

    // cart3
    const cart3Arr: any = [];
    for (let i = 0; i < interpolationArr.length; i++) {
        cart3Arr.push(Cesium.Cartesian3.fromDegrees(
            interpolationArr[i].longitude,
            interpolationArr[i].latitude,
            interpolationArr[i].height,
        ))
    }

    return cart3Arr;

}

// 2021-04-26 粉刷匠 可视域分析
export const addViewShed = (viewer: any) => {
    const c3 = Cesium.Cartesian3.fromDegrees(113.91, 22.50, 140.0)
    const tmpView = new ViewShedStage(viewer, {
        viewPosition: c3,
        viewDistance: 1000
    })
    if (tmpView) {
        // 
    }
}

// 2021-04-27 粉刷匠 模型旋转
export const addModelRotation = (viewer: any) => {
    const tileset: any = null;
    const RotateX: any = null;

    // todo:注意传参为模型以及旋转角度
    if (!tileset) return;

    var m = tileset.modelMatrix;
    //RotateX为旋转角度，转为弧度再参与运算
    var m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(RotateX));

    //矩阵计算
    Cesium.Matrix4.multiplyByMatrix3(m, m1, m);

    //赋值
    tileset.modelMatrix = m;
}

// 2021-04-27 粉刷匠 补充-水面效果
export const addWaterPolygon = (viewer: any) => {
    // eslint-disable-next-line
    const polygon = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
                    113.91, 22.50,
                    113.95, 22.50,
                    113.95, 22.55,
                    113.91, 22.55,
                ])),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        normalMap: Cesium.buildModuleUrl(normalMap),
                        frequency: 10000.0,
                        animationSpeed: 0.01,
                        amplitude: 50
                    }
                }
            })
        }),
        show: true
    }))
}


export const adddiff1 = (viewer: any) => {
    // 雷达的高度
    const length = 4000.0;
    // 地面位置(垂直地面)
    const positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(113.91, 22.50);
    // 中心位置
    // const centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length * 0.5);
    // 顶部位置(卫星位置)
    // const topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length);
    // 矩阵计算
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation( // 转换矩阵
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid), // 矩阵
        new Cesium.Cartesian3(0.0, 0.0, length * 0.5), // 要转换的笛卡尔坐标 
        new Cesium.Matrix4() // 返回新的矩阵
    );

    // 1. 构造geometry
    const cylinderGeometry = new Cesium.CylinderGeometry({
        length: length,
        topRadius: 0.0,
        bottomRadius: length * 0.5,
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
    });
    // 2. 创建GeometryInstance
    const redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry, //geomtry类型
        modelMatrix: modelMatrix, //模型矩阵 调整矩阵的位置和方向
    });

    let source =
        //传入的动态数值
        `uniform vec4 color; 
uniform float repeat; 
uniform float offset; 
uniform float thickness;

//设置图形外观材质
czm_material czm_getMaterial(czm_materialInput materialInput){
   czm_material material = czm_getDefaultMaterial(materialInput); //获取内置的默认材质
   float sp = 1.0/repeat; //重复贴图
   vec2 st = materialInput.st; //二维纹理坐标
   float dis = distance(st, vec2(0.5)); //计算距离
   float m = mod(dis + offset, sp); //间隔
   float a = step(sp*(1.0-thickness), m);//线条拼色 
   //修改材质
   material.diffuse = color.rgb;
   material.alpha = a * color.a;
   return material;
}`


    let material = new Cesium.Material({
        fabric: {
            type: 'VtxfShader1',
            uniforms: { // 动态传递参数
                color: Cesium.Color.WHITE.withAlpha(0.3),
                repeat: 30.0,
                offset: 0.0,
                thickness: 0.3,
            },
            source: source
        },
        translucent: false
    })

    let appearance = new Cesium.MaterialAppearance({
        material: material,// 自定义的材质
        faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，					从而避免法向计算后发黑等问题
        closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
    })

    // 添加Primitive
    var radar = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: appearance
        }));

    // 动态修改雷达材质中的offset变量，从而实现动态效果。
    viewer.scene.preUpdate.addEventListener(function () {
        var offset = radar.appearance.material.uniforms.offset;
        offset -= 0.001;
        if (offset > 1.0) {
            offset = 0.0;
        }
        radar.appearance.material.uniforms.offset = offset;
    })


}

export const adddiff2 = (viewer: any) => {
    // 添加椭圆实例
    const redCone = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseGeometry({
            center: Cesium.Cartesian3.fromDegrees(113.91, 22.50),
            semiMinorAxis: 1000.0,
            semiMajorAxis: 1000.0,
            // rotation: Cesium.Math.PI_OVER_FOUR,
            // vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
        })
    })

    // 自定义样式
    let source = `     
    uniform vec4 color; 
    uniform float u_time;
 
    
    //设置图形外观材质
    czm_material czm_getMaterial(czm_materialInput materialInput){
       czm_material material = czm_getDefaultMaterial(materialInput); //获取内置的默认材质

       // 修改材质1 按距离修改颜色
    //    vec2 st = materialInput.st; //二维纹理坐标
    //    float dis = distance(st, vec2(1.0,0.0));
    //    material.diffuse = color.rgb;
    //    material.alpha = dis * color.a;


       // 修改材质2 颜色变化
    //    vec2 st = materialInput.st; //二维纹理坐标
    // //    material.diffuse = vec3(distance(st, vec2(1.0,0.0)),0.0,0.0);
    //     material.diffuse = vec3(abs(sin(u_time)),0.0,0.0);
    //     material.alpha =  color.a;

    // 修改材质3 雷达扩散图
       vec2 st = materialInput.st; //二维纹理坐标
       float sdis=distance(vec2(1), vec2(0.5));
       float dis=distance(st, vec2(0.5));
       float radius=abs(u_time);

       if(dis < radius ){
            float dd= smoothstep(0.0,radius,dis);
            material.diffuse = color.rgb;
            material.alpha = dd* color.a;
       }else{
            material.alpha = 0.0* color.a;
       }


       return material;
    }
    `
    let appearance = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                // type: 'VtxfShader1',
                uniforms: { // 动态传递参数
                    color: Cesium.Color.YELLOWGREEN,
                    u_time: 0.0
                },
                source: source
            },
            translucent: false
        }),// 自定义的材质
        // material : Cesium.Material.fromType('Checkerboard'),
        faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
        closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
    })

    // 添加Primitive    
    const radar = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: appearance
        })
    );

    // 动态修改雷达材质中的offset变量，从而实现动态效果。
    viewer.scene.preUpdate.addEventListener(function () {
        var u_time = radar.appearance.material.uniforms.u_time;
        u_time += 0.01;
        if (u_time > 1.0) {
            u_time = 0.0;
        }
        radar.appearance.material.uniforms.u_time = u_time;
    })

}

export const adddiff3 = (viewer: any) => {
    // 好像是需要关闭地形监测
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const CartographicCenter = Cesium.Cartographic.fromDegrees(113.91, 22.50);
    const scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
    // addCircleScanPostStage(viewer, CartographicCenter, 1500, scanColor, 4000);
    addRadarScanPostStage(viewer, CartographicCenter, 1000, scanColor, 3000);
}

export const adddiff4 = (viewer: any) => {
    // 雷达的高度
    const length = 4000.0;
    // 地面位置(垂直地面)
    const positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(113.91, 22.50);
    // 中心位置
    // const centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length * 0.5);
    // 顶部位置(卫星位置)
    // const topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length);
    // 矩阵计算
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation( // 转换矩阵
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid), // 矩阵
        new Cesium.Cartesian3(0.0, 0.0, length * 0.5), // 要转换的笛卡尔坐标 
        new Cesium.Matrix4() // 返回新的矩阵
    );

    // 1. 构造geometry
    const cylinderGeometry = new Cesium.CylinderGeometry({
        length: length,
        topRadius: length * 0.5,
        bottomRadius: length * 0.5,
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
    });
    // 2. 创建GeometryInstance
    const redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry, //geomtry类型
        modelMatrix: modelMatrix, //模型矩阵 调整矩阵的位置和方向
    });

    let appearance = new Cesium.MaterialAppearance({
        // material: material,// 自定义的材质
        material: new Cesium.Material({
            fabric: {
                type: 'Color',
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                }
            }
        }),
        faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，					从而避免法向计算后发黑等问题
        closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
    })

    // 添加Primitive
    var radar = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: appearance
        }));

    // 动态修改雷达材质中的offset变量，从而实现动态效果。
    viewer.scene.preUpdate.addEventListener(function () {
        var offset = radar.appearance.material.uniforms.offset;
        offset -= 0.001;
        if (offset > 1.0) {
            offset = 0.0;
        }
        radar.appearance.material.uniforms.offset = offset;
    })


}

// 2021-04-27 粉刷匠 补充 图元自定义着色器
export const addDiffShader = (viewer: any) => {
    // Primitive是cesium核心api之一，与entity方式绘制方式(基于数据)不同，
    // primitive更接近渲染引擎底层。entity适合以数据绘制实体，
    // 而primitive更适合图形学对有webgl经验的更亲和。
    // primitive绘制的图形比entity添加的实体性能更好，webgl特性使primitive能绘制更多样式的图形。

    // 圆锥形雷达1
    // adddiff1(viewer);

    // 圆扩散雷达
    // adddiff2(viewer);

    // 圆扫描雷达
    // adddiff3(viewer);

    // 扩散墙-todo 未完成
    // adddiff4(viewer);

}

// 2021-04-27 粉刷匠 补充-线管
export const addPolylineVolume = (viewer: any) => {

    function computeCircle(radius: number) {
        var positions = [];
        for (var i = 0; i < 360; i += 10) {
            var radians = Cesium.Math.toRadians(i);
            positions.push(
                new Cesium.Cartesian2(
                    radius * Math.cos(radians),
                    radius * Math.sin(radians)
                )
            );
        }
        return positions;
    }

    // function starPositions(arms: any, rOuter: any, rInner: any) {
    //     var angle = Math.PI / arms;
    //     var pos = [];
    //     for (var i = 0; i < 2 * arms; i++) {
    //         var r = i % 2 === 0 ? rOuter : rInner;
    //         var p = new Cesium.Cartesian2(
    //             Math.cos(i * angle) * r,
    //             Math.sin(i * angle) * r
    //         );
    //         pos.push(p);
    //     }
    //     return pos;
    // }

    const sigLine = MultiLinePipe.features;
    for (let i = 0; i < sigLine.length; i++) {
        const coordinates = sigLine[i].geometry.coordinates;
        for (let j = 0; j < coordinates.length; j++) {
            const sigcoordinates = coordinates[j];
            const sigcoordinatesOne = sigcoordinates.reduce((a, b) => { return a.concat(b) })
            viewer.entities.add({
                polylineVolume: {
                    positions: Cesium.Cartesian3.fromDegreesArray(sigcoordinatesOne),
                    shape: computeCircle(10),
                    // outline: true,
                    // outlineColor: Cesium.Color.WHITE,
                    // outlineWidth: 1,
                    material: Cesium.Color.fromRandom({ alpha: 1.0 }),
                },
            });
        }
    }

   
}

// 2021-04-28 粉刷匠 添加等高线
export const addContour = (viewer: any) => {
    // 基础篇
    // let contourUniforms: any = {};
    // const material = Cesium.Material.fromType('ElevationContour');
    // contourUniforms = material.uniforms;
    // contourUniforms.width = 2.0; // 线宽
    // contourUniforms.spacing = 150.0; // 间距
    // contourUniforms.color = Cesium.Color.fromRandom({ alpha: 1.0 }, Cesium.Color.RED.clone()); // 颜色
    // viewer.scene.globe.material = material;

    // 高能篇
    let viewModel = {
        gradient: false,
        band1Position: 7000.0,
        band2Position: 7500.0,
        band3Position: 8000.0,
        bandThickness: 100.0,
        bandTransparency: 0.5,
        backgroundTransparency: 0.75,
    };

    let gradient = Boolean(viewModel.gradient);
    let band1Position = Number(viewModel.band1Position);
    let band2Position = Number(viewModel.band2Position);
    let band3Position = Number(viewModel.band3Position);
    let bandThickness = Number(viewModel.bandThickness);
    let bandTransparency = Number(viewModel.bandTransparency);
    let backgroundTransparency = Number(viewModel.backgroundTransparency);

    let layers: any = [];
    let backgroundLayer = {
        entries: [
            {
                height: 4200.0,
                color: new Cesium.Color(0.0, 0.0, 0.2, backgroundTransparency),
            },
            {
                height: 8000.0,
                color: new Cesium.Color(1.0, 1.0, 1.0, backgroundTransparency),
            },
            {
                height: 8500.0,
                color: new Cesium.Color(1.0, 0.0, 0.0, backgroundTransparency),
            },
        ],
        extendDownwards: true,
        extendUpwards: true,
    };
    layers.push(backgroundLayer);

    let gridStartHeight = 4200.0;
    let gridEndHeight = 8848.0;
    let gridCount = 50;

    for (let i = 0; i < gridCount; i++) {
        let lerper = i / (gridCount - 1);
        let heightBelow = Cesium.Math.lerp(
            gridStartHeight,
            gridEndHeight,
            lerper
        );
        let heightAbove = heightBelow + 10.0;
        let alpha =
            Cesium.Math.lerp(0.2, 0.4, lerper) * backgroundTransparency;
        layers.push({
            entries: [
                {
                    height: heightBelow,
                    color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
                },
                {
                    height: heightAbove,
                    color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
                },
            ],
        });
    }

    let antialias = Math.min(10.0, bandThickness * 0.1);
    if (!gradient) {
        let band1 = {
            entries: [
                {
                    height: band1Position - bandThickness * 0.5 - antialias,
                    color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
                },
                {
                    height: band1Position - bandThickness * 0.5,
                    color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
                },
                {
                    height: band1Position + bandThickness * 0.5,
                    color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
                },
                {
                    height: band1Position + bandThickness * 0.5 + antialias,
                    color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
                },
            ],
        };

        let band2 = {
            entries: [
                {
                    height: band2Position - bandThickness * 0.5 - antialias,
                    color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
                },
                {
                    height: band2Position - bandThickness * 0.5,
                    color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
                },
                {
                    height: band2Position + bandThickness * 0.5,
                    color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
                },
                {
                    height: band2Position + bandThickness * 0.5 + antialias,
                    color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
                },
            ],
        };

        let band3 = {
            entries: [
                {
                    height: band3Position - bandThickness * 0.5 - antialias,
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
                },
                {
                    height: band3Position - bandThickness * 0.5,
                    color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
                },
                {
                    height: band3Position + bandThickness * 0.5,
                    color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
                },
                {
                    height: band3Position + bandThickness * 0.5 + antialias,
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
                },
            ],
        };

        layers.push(band1);
        layers.push(band2);
        layers.push(band3);
    } else {
        let combinedBand = {
            entries: [
                {
                    height: band1Position - bandThickness * 0.5,
                    color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
                },
                {
                    height: band2Position,
                    color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
                },
                {
                    height: band3Position + bandThickness * 0.5,
                    color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
                },
            ],
        };

        layers.push(combinedBand);
    }


    // 官网是使用的例子为 Cesium.createElevationBandMaterial，而1.8版本才有,请注意升级
    let material = Cesium.createElevationBandMaterial({
        scene: viewer.scene,
        layers: layers,
    });
    viewer.scene.globe.material = material;
}

// 2021-04-28 粉刷匠 添加粒子
export const addParticelFireWork = (viewer: any, scene: any) => {
    Cesium.Math.setRandomNumberSeed(315);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(113.91, 22.50)
    )

    const emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 100);
    let particleCanvas: any = null;
    function getImage() {
        if (!Cesium.defined(particleCanvas)) {
            particleCanvas = document.createElement('canvas');
            particleCanvas.width = 20;
            particleCanvas.height = 20;
            const context2D = particleCanvas.getContext('2d');
            context2D.beginPath();
            context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true);
            context2D.closePath();
            context2D.fillStyle = 'rgb(255,255,255)';
            context2D.fill();
        }
        return particleCanvas;
    }

    const minimumExplosionSize = 30.0;
    const maximumExplosionSize = 100.0;
    const particlePixelSize = new Cesium.Cartesian2(7.0, 7.0);
    const burstSize = 400.0;
    const lifetime = 10.0;
    const numberOfFireworks = 20.0;

    let emitterModelMatrixScratch = new Cesium.Matrix4();
    function createFirework(offset: any, color: any, bursts: any) {
        let position = Cesium.Cartesian3.add(
            emitterInitialLocation,
            offset,
            new Cesium.Cartesian3()
        );
        let emitterModelMatrix = Cesium.Matrix4.fromTranslation(
            position,
            emitterModelMatrixScratch
        );
        let particleToWorld = Cesium.Matrix4.multiply(
            modelMatrix,
            emitterModelMatrix,
            new Cesium.Matrix4()
        );
        let worldToParticle = Cesium.Matrix4.inverseTransformation(
            particleToWorld,
            particleToWorld
        );
        let size = Cesium.Math.randomBetween(
            minimumExplosionSize,
            maximumExplosionSize
        );
        var particlePositionScratch = new Cesium.Cartesian3();
        var force = function (particle: any) {
            var position = Cesium.Matrix4.multiplyByPoint(
                worldToParticle,
                particle.position,
                particlePositionScratch
            );
            if (Cesium.Cartesian3.magnitudeSquared(position) >= size * size) {
                Cesium.Cartesian3.clone(
                    Cesium.Cartesian3.ZERO,
                    particle.velocity
                );
            }
        };

        var normalSize =
            (size - minimumExplosionSize) /
            (maximumExplosionSize - minimumExplosionSize);
        var minLife = 0.3;
        var maxLife = 1.0;
        var life = normalSize * (maxLife - minLife) + minLife;

        scene.primitives.add(
            new Cesium.ParticleSystem({
                image: getImage(),
                startColor: color,
                endColor: color.withAlpha(0.0),
                particleLife: life,
                speed: 100.0,
                imageSize: particlePixelSize,
                emissionRate: 0,
                emitter: new Cesium.SphereEmitter(0.1),
                bursts: bursts,
                lifetime: lifetime,
                updateCallback: force,
                modelMatrix: modelMatrix,
                emitterModelMatrix: emitterModelMatrix,
            })
        );


    }

    let xMin = -100.0;
    let xMax = 100.0;
    let yMin = -80.0;
    let yMax = 100.0;
    let zMin = -50.0;
    let zMax = 50.0;

    let colorOptions = [
        {
            minimumRed: 0.75,
            green: 0.0,
            minimumBlue: 0.8,
            alpha: 1.0,
        },
        {
            red: 0.0,
            minimumGreen: 0.75,
            minimumBlue: 0.8,
            alpha: 1.0,
        },
        {
            red: 0.0,
            green: 0.0,
            minimumBlue: 0.8,
            alpha: 1.0,
        },
        {
            minimumRed: 0.75,
            minimumGreen: 0.75,
            blue: 0.0,
            alpha: 1.0,
        },
    ];

    for (let i = 0; i < numberOfFireworks; ++i) {
        let x = Cesium.Math.randomBetween(xMin, xMax);
        let y = Cesium.Math.randomBetween(yMin, yMax);
        let z = Cesium.Math.randomBetween(zMin, zMax);
        let offset = new Cesium.Cartesian3(x, y, z);
        let color = Cesium.Color.fromRandom(
            colorOptions[i % colorOptions.length]
        );

        let bursts = [];
        for (let j = 0; j < 3; ++j) {
            bursts.push(
                new Cesium.ParticleBurst({
                    time: Cesium.Math.nextRandomNumber() * lifetime,
                    minimum: burstSize,
                    maximum: burstSize,
                })
            );
        }

        createFirework(offset, color, bursts);
    }
}

// 2021-04-28 粉刷匠 添加粒子
export const addParticelEimm = (viewer: any) => {
    const particlesOffset = new Cesium.Cartesian3(
        -8.950115473940969,
        34.852766731753945,
        -30.235411095432937
    );
    let particleCanvas: any = null;
    function getImage() {
        if (!Cesium.defined(particleCanvas)) {
            particleCanvas = document.createElement("canvas");
            particleCanvas.width = 20;
            particleCanvas.height = 20;
            const context2D = particleCanvas.getContext("2d");
            context2D.beginPath();
            context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true);
            context2D.closePath();
            context2D.fillStyle = "rgb(255, 255, 255)";
            context2D.fill();
        }
        return particleCanvas;
    }

    // creating particles model matrix
    let planePosition = Cesium.Cartesian3.fromDegrees(
        113.91, 22.50, 800.0
    );
    let translationOffset = Cesium.Matrix4.fromTranslation(
        particlesOffset,
        new Cesium.Matrix4()
    );
    let translationOfPlane = Cesium.Matrix4.fromTranslation(
        planePosition,
        new Cesium.Matrix4()
    );
    let particlesModelMatrix = Cesium.Matrix4.multiplyTransformation(
        translationOfPlane,
        translationOffset,
        new Cesium.Matrix4()
    );

    let rocketOptions = {
        numberOfSystems: 50.0,
        iterationOffset: 0.1,
        cartographicStep: 0.000001,
        baseRadius: 0.0005,

        colorOptions: [
            {
                minimumRed: 1.0,
                green: 0.5,
                minimumBlue: 0.05,
                alpha: 1.0,
            },
            {
                red: 0.9,
                minimumGreen: 0.6,
                minimumBlue: 0.01,
                alpha: 1.0,
            },
            {
                red: 0.8,
                green: 0.05,
                minimumBlue: 0.09,
                alpha: 1.0,
            },
            {
                minimumRed: 1,
                minimumGreen: 0.05,
                blue: 0.09,
                alpha: 1.0,
            },
        ],
    };

    let cometOptions = {
        numberOfSystems: 100.0,
        iterationOffset: 0.003,
        cartographicStep: 0.0000001,
        baseRadius: 0.0005,

        colorOptions: [
            {
                red: 0.6,
                green: 0.6,
                blue: 0.6,
                alpha: 1.0,
            },
            {
                red: 0.6,
                green: 0.6,
                blue: 0.9,
                alpha: 0.9,
            },
            {
                red: 0.5,
                green: 0.5,
                blue: 0.7,
                alpha: 0.5,
            },
        ],
    };

    let scratchCartesian3 = new Cesium.Cartesian3();
    let scratchCartographic = new Cesium.Cartographic();
    let forceFunction = function (options: any, iteration: any) {
        return function (particle: any, dt: any) {
            dt = Cesium.Math.clamp(dt, 0.0, 0.05);

            scratchCartesian3 = Cesium.Cartesian3.normalize(
                particle.position,
                new Cesium.Cartesian3()
            );
            scratchCartesian3 = Cesium.Cartesian3.multiplyByScalar(
                scratchCartesian3,
                -40.0 * dt,
                scratchCartesian3
            );

            scratchCartesian3 = Cesium.Cartesian3.add(
                particle.position,
                scratchCartesian3,
                scratchCartesian3
            );

            scratchCartographic = Cesium.Cartographic.fromCartesian(
                scratchCartesian3,
                Cesium.Ellipsoid.WGS84,
                scratchCartographic
            );

            var angle =
                (Cesium.Math.PI * 2.0 * iteration) / options.numberOfSystems;
            iteration += options.iterationOffset;
            scratchCartographic.longitude +=
                Math.cos(angle) * options.cartographicStep * 30.0 * dt;
            scratchCartographic.latitude +=
                Math.sin(angle) * options.cartographicStep * 30.0 * dt;

            particle.position = Cesium.Cartographic.toCartesian(
                scratchCartographic
            );
        };
    };

    let matrix4Scratch = new Cesium.Matrix4();
    let scratchAngleForOffset = 0.0;
    let scratchOffset = new Cesium.Cartesian3();
    let imageSize = new Cesium.Cartesian2(15.0, 15.0);
    function createParticleSystems(options: any, systemsArray: any) {
        let length = options.numberOfSystems;
        for (let i = 0; i < length; ++i) {
            scratchAngleForOffset =
                (Math.PI * 2.0 * i) / options.numberOfSystems;
            scratchOffset.x +=
                options.baseRadius * Math.cos(scratchAngleForOffset);
            scratchOffset.y +=
                options.baseRadius * Math.sin(scratchAngleForOffset);

            let emitterModelMatrix = Cesium.Matrix4.fromTranslation(
                scratchOffset,
                matrix4Scratch
            );
            let color = Cesium.Color.fromRandom(
                options.colorOptions[i % options.colorOptions.length]
            );
            let force = forceFunction(options, i);

            let item = viewer.scene.primitives.add(
                new Cesium.ParticleSystem({
                    image: getImage(),
                    startColor: color,
                    endColor: color.withAlpha(0.0),
                    particleLife: 3.5,
                    speed: 0.00005,
                    imageSize: imageSize,
                    emissionRate: 30.0,
                    emitter: new Cesium.CircleEmitter(0.1),
                    lifetime: 0.1,
                    updateCallback: force,
                    modelMatrix: particlesModelMatrix,
                    emitterModelMatrix: emitterModelMatrix,
                })
            );
            systemsArray.push(item);
        }
    }

    let rocketSystems: any = [];
    createParticleSystems(rocketOptions, rocketSystems);
    // let cometSystems:any = [];
    // createParticleSystems(cometOptions, cometSystems);

    if (cometOptions) {
        // 
    }



}

// 2021-04-28 粉刷匠 添加粒子
export const addParticelCar = (viewer: any, scene: any) => {
    //Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);
    //Set bounds of our simulation time
    let start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    let stop = Cesium.JulianDate.addSeconds(
        start,
        120,
        new Cesium.JulianDate()
    );

    //Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = true;

    //Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop);

    let viewModel: any = {
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.2,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        particleSize: 25.0,
    };

    let entityPosition = new Cesium.Cartesian3();
    let entityOrientation = new Cesium.Quaternion();
    let rotationMatrix = new Cesium.Matrix3();
    let modelMatrix = new Cesium.Matrix4();

    function computeModelMatrix(entity: any, time: any) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
    }

    let emitterModelMatrix = new Cesium.Matrix4();
    let translation = new Cesium.Cartesian3();
    let rotation = new Cesium.Quaternion();
    let hpr = new Cesium.HeadingPitchRoll();
    let trs = new Cesium.TranslationRotationScale();

    function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
            -4.0,
            0.0,
            1.4,
            translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

        return Cesium.Matrix4.fromTranslationRotationScale(
            trs,
            emitterModelMatrix
        );
    }

    let pos1 = Cesium.Cartesian3.fromDegrees(
        113.91, 22.50
    );
    let pos2 = Cesium.Cartesian3.fromDegrees(
        113.91, 22.55
    );
    let position = new Cesium.SampledPositionProperty();

    position.addSample(start, pos1);
    position.addSample(stop, pos2);

    let entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: start,
                stop: stop,
            }),
        ]),
        model: {
            uri: "./Models/Cesium_Air.glb",
            minimumPixelSize: 64,
        },
        viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position),
    });
    // viewer.trackedEntity = entity;

    // var scene = viewer.scene;
    let particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
            image: "./Models/image/partical.png",

            startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
            endColor: Cesium.Color.WHITE.withAlpha(0.0),

            startScale: viewModel.startScale,
            endScale: viewModel.endScale,

            minimumParticleLife: viewModel.minimumParticleLife,
            maximumParticleLife: viewModel.maximumParticleLife,

            minimumSpeed: viewModel.minimumSpeed,
            maximumSpeed: viewModel.maximumSpeed,

            imageSize: new Cesium.Cartesian2(
                viewModel.particleSize,
                viewModel.particleSize
            ),

            emissionRate: viewModel.emissionRate,

            bursts: [
                // these burst will occasionally sync to create a multicolored effect
                new Cesium.ParticleBurst({
                    time: 5.0,
                    minimum: 10,
                    maximum: 100,
                }),
                new Cesium.ParticleBurst({
                    time: 10.0,
                    minimum: 50,
                    maximum: 100,
                }),
                new Cesium.ParticleBurst({
                    time: 15.0,
                    minimum: 200,
                    maximum: 300,
                }),
            ],

            lifetime: 16.0,

            emitter: new Cesium.CircleEmitter(2.0),

            emitterModelMatrix: computeEmitterModelMatrix(),

            updateCallback: applyGravity,
        })
    );

    let gravityScratch = new Cesium.Cartesian3();

    function applyGravity(p: any, dt: any) {
        // We need to compute a local up vector for each particle in geocentric space.
        let position = p.position;

        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(
            gravityScratch,
            viewModel.gravity * dt,
            gravityScratch
        );

        p.velocity = Cesium.Cartesian3.add(
            p.velocity,
            gravityScratch,
            p.velocity
        );
    }

    viewer.scene.preUpdate.addEventListener(function (scene: any, time: any) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time);

        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();

        // Spin the emitter if enabled.
        if (viewModel.spin) {
            viewModel.heading += 1.0;
            viewModel.pitch += 1.0;
            viewModel.roll += 1.0;
        }
    });

    if (entityPosition && entityOrientation && rotationMatrix && modelMatrix) {
        // 
    }

}

// 2021-04-28 粉刷匠 添加粒子
export const addParticel = (viewer: any) => {
    viewer.clock.shouldAnimate = true;
    const scene = viewer.scene;

    // 放烟花
    // addParticelFireWork(viewer, scene);

    // 喷雾
    // addParticelEimm(viewer)

    // 汽车尾气
    addParticelCar(viewer, scene);

}

// 2021-05-07 粉刷匠 添加扩散的线及圆柱
export const addExpandCylindert = (viewer: any) => {

    const centerPoint = [113.925, 22.525];
    let sigDeep = 0.0;
    let polyline: any = null;

    let positions: any = [
        // Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] - sigDeep),
        // Cesium.Cartesian3.fromDegrees(centerPoint[0] + sigDeep, centerPoint[1] - sigDeep),
        // Cesium.Cartesian3.fromDegrees(centerPoint[0] + sigDeep, centerPoint[1] + sigDeep),
        // Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] + sigDeep),
        // Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] - sigDeep),

        centerPoint[0] - sigDeep, centerPoint[1] - sigDeep,
        centerPoint[0] + sigDeep, centerPoint[1] - sigDeep,
        centerPoint[0] + sigDeep, centerPoint[1] + sigDeep,
        centerPoint[0] - sigDeep, centerPoint[1] + sigDeep,
        centerPoint[0] - sigDeep, centerPoint[1] - sigDeep,
    ];

    setInterval(() => {
        updatePosition();
    }, 100);


    function updatePosition() {

        // sigDeep = sigDeep > 0.10 ? 0.0 : sigDeep + 0.001;
        sigDeep = sigDeep > 0.07 ? 0.0 : sigDeep + 0.0005;

        if (!Cesium.defined(polyline)) {
            // polyline = new PolyLinePrimitive(positions);
            polyline = new WallPrimitive(positions);
        } else {
            // positions[0] = Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] - sigDeep);
            // positions[1] = Cesium.Cartesian3.fromDegrees(centerPoint[0] + sigDeep, centerPoint[1] - sigDeep);
            // positions[2] = Cesium.Cartesian3.fromDegrees(centerPoint[0] + sigDeep, centerPoint[1] + sigDeep);
            // positions[3] = Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] + sigDeep);
            // positions[4] = Cesium.Cartesian3.fromDegrees(centerPoint[0] - sigDeep, centerPoint[1] - sigDeep);

            positions[0] = centerPoint[0] - sigDeep;
            positions[1] = centerPoint[1] - sigDeep;
            positions[2] = centerPoint[0] + sigDeep;
            positions[3] = centerPoint[1] - sigDeep;
            positions[4] = centerPoint[0] + sigDeep;
            positions[5] = centerPoint[1] + sigDeep;
            positions[6] = centerPoint[0] - sigDeep;
            positions[7] = centerPoint[1] + sigDeep;
            positions[8] = centerPoint[0] - sigDeep;
            positions[9] = centerPoint[1] - sigDeep;

        }

    }




    // const PolyLinePrimitive: any = (function () {
    //     function _(this: any, positions: any) {
    //         const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
    //         // console.log(tmpId);
    //         this.options = {
    //             id: "draw_Clip_Line" + tmpId,
    //             name: '直线',
    //             polyline: {
    //                 show: true,
    //                 positions: [],
    //                 material: Cesium.Color.CHARTREUSE,
    //                 width: 7,
    //                 clampToGround: true
    //             }
    //         };
    //         this.positions = positions;
    //         this._init();
    //     }

    //     _.prototype._init = function () {
    //         var _self = this;
    //         // 当可以画矩形的时候，把线的postion设置为 undefined
    //         var _update = function () {
    //             return  _self.positions;
    //         };
    //         // 实时更新polyline.positions
    //         this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
    //         const tmpEntity = viewer.entities.add(this.options);
    //         if (tmpEntity) {
    //             entityDrawArr.push(tmpEntity);
    //         }
    //     };

    //     return _;
    // })();
    const WallPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);
            this.options = {
                id: "expand_wall" + tmpId,
                name: '这是个墙',
                // polyline: {
                //     show: true,
                //     positions: [],
                //     material: Cesium.Color.CHARTREUSE,
                //     width: 7,
                //     clampToGround: true
                // }
                wall: {
                    positions: [],
                    minimumHeights: [10.0, 10.0, 10.0, 10.0, 10.0],
                    maximumHeights: [1000.0, 1000.0, 1000.0, 1000.0, 1000.0],
                    material: new Cesium.ImageMaterialProperty({
                        image: "./Models/image/wall.png",
                        transparent: true
                    })
                    // outline: true,
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            // 当可以画矩形的时候，把线的postion设置为 undefined
            var _update = function () {
                return _self.positions ? Cesium.Cartesian3.fromDegreesArray(_self.positions) : undefined;
            };
            // 实时更新polyline.positions
            this.options.wall.positions = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();




    // setInterval(() => {
    //     addNewWall();
    // }, 500);

    // let sigWall: any = null;
    // let sigDeep = 0.0;
    // function addNewWall() {
    //     if (sigWall) {
    //         viewer.entities.remove(sigWall)//删除entity
    //     }
    //     sigWall = viewer.entities.add({
    //         name: "test wall",
    //         wall: {
    //             positions: Cesium.Cartesian3.fromDegreesArrayHeights([
    //                 centerPoint[0] - sigDeep, centerPoint[1] - sigDeep, 0.0,
    //                 centerPoint[0] + sigDeep, centerPoint[1] - sigDeep, 0.0,
    //                 centerPoint[0] + sigDeep, centerPoint[1] + sigDeep, 0.0,
    //                 centerPoint[0] - sigDeep, centerPoint[1] + sigDeep, 0.0,
    //                 centerPoint[0] - sigDeep, centerPoint[1] - sigDeep, 0.0,
    //                 // 113.95, 22.50, 0.0,
    //                 // 113.95, 22.55, 0.0,
    //                 // 113.90, 22.55, 0.0,
    //                 // 113.90, 22.50, 0.0,
    //             ]),
    //             minimumHeights: [10.0, 10.0, 10.0, 10.0, 10.0],
    //             maximumHeights: [1000.0, 1000.0, 1000.0, 1000.0, 1000.0],
    //             // maximumHeights: new Cesium.CallbackProperty(changeR1, false),
    //             material: new Cesium.ImageMaterialProperty({
    //                 image: getColorRamp([0, 0, 0, 0, 0, 0.54, 1.0], true),
    //                 transparent: true
    //             })
    //             // outline: true,
    //         }
    //     })

    //     sigDeep = sigDeep > 0.25 ? 0.0 : sigDeep + 0.01;
    // }

}

// 2021-05-12 粉刷匠 添加扩散圆柱--成功
export const addExpandCylinder = (viewer: any) => {

    const centerPoint = [113.925, 22.525];
    let sigDeep = 0.0;
    let wall: any = null;

    let positions: any = [
        centerPoint[0] - sigDeep, centerPoint[1] - sigDeep,
        centerPoint[0] + sigDeep, centerPoint[1] - sigDeep,
        centerPoint[0] + sigDeep, centerPoint[1] + sigDeep,
        centerPoint[0] - sigDeep, centerPoint[1] + sigDeep,
        centerPoint[0] - sigDeep, centerPoint[1] - sigDeep,
    ];

    setInterval(() => {
        updatePosition();
    }, 100);


    function updatePosition() {

        sigDeep = sigDeep > 0.07 ? 0.0 : sigDeep + 0.0005;

        if (!Cesium.defined(wall)) {
            wall = new WallPrimitive(positions);
        } else {
            positions[0] = centerPoint[0] - sigDeep;
            positions[1] = centerPoint[1] - sigDeep;
            positions[2] = centerPoint[0] + sigDeep;
            positions[3] = centerPoint[1] - sigDeep;
            positions[4] = centerPoint[0] + sigDeep;
            positions[5] = centerPoint[1] + sigDeep;
            positions[6] = centerPoint[0] - sigDeep;
            positions[7] = centerPoint[1] + sigDeep;
            positions[8] = centerPoint[0] - sigDeep;
            positions[9] = centerPoint[1] - sigDeep;
        }

    }


    const WallPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);
            this.options = {
                id: "expand_wall" + tmpId,
                name: '这是个墙',
                wall: {
                    positions: [],
                    minimumHeights: [10.0, 10.0, 10.0, 10.0, 10.0],
                    maximumHeights: [1000.0, 1000.0, 1000.0, 1000.0, 1000.0],
                    material: new Cesium.ImageMaterialProperty({
                        image: "./Models/image/wall.png",
                        transparent: true
                    })
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions ? Cesium.Cartesian3.fromDegreesArray(_self.positions) : undefined;
            };
            // 更新positions
            this.options.wall.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();
}

// 2021-05-12 粉刷匠 添加云图
export const addWindMap = (viewer: any) => {
    // 
    // new Wind3D(viewer);
};

// 2021-05-12 粉刷匠 添加日照光阴影
export const addSunShadow = (viewer: any) => {
    viewer.scene.globe.enableLighting = true;
    viewer.shadows = true;
    // 有时候需要看一天的阴影变化，可以通过设置时间的方法，示例如下，注意北京东八区
    const utc = Cesium.JulianDate.fromDate(new Date("2021/01/01 00:00:00"));// UTC
    viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate());//北京时间=UTC+8=GMT+8
}

// 2021-05-12 粉刷匠 地下模式
export const addUnderground = (viewer: any) => {
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    viewer.scene.globe.translucency.frontFaceAlpha = 0.5;
}

// 2021-05-13 粉刷匠 试图联系echart
export const addEchart = (viewer: any) => {
    // 
    // new EchartPoint(viewer);
    // new EchartFly(viewer);
}

// 2021-06-09 粉刷匠 添加云图
export const addRsWind = (viewer: any) => {
    const cor = {
        w: -179,
        s: -60,
        e: 179,
        n: 60
    };
    // 传入的动态数值
    let source =
        `uniform vec4 color; 
       uniform float time;

       //设置图形外观材质
       czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput); //获取内置的默认材质
          vec2 st = materialInput.st;
          vec4 colorImage = texture2D(image, vec2(fract(st.s + time),fract(st.t)));
          material.alpha = colorImage.a * color.a  ;
          material.diffuse =    color.rgb  ;
          return material;
      }`

    const material = new Cesium.Material({
        fabric: {
            uniforms: {
                image: "./Models/image/cloud.png",
                // alpha: 0.7,//透明度
                time: 0.0,
                color: Cesium.Color.fromCssColorString('#E5EBFB'),
            },
            source: source
        },
        translucent: false
    });
    let appearance = new Cesium.MaterialAppearance({
        material: material,// 自定义的材质
        faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，					从而避免法向计算后发黑等问题
        closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
    })
    const rectangle = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleGeometry({
                    rectangle: Cesium.Rectangle.fromDegrees(cor.w, cor.s, cor.e, cor.n),
                    //vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    height: 300000
                }),
            }),
            appearance: appearance
            // appearance: new Cesium.EllipsoidSurfaceAppearance({
            //     aboveGround: true,
            // }),
        })
    );

    // 动态修改雷达材质中的offset变量，从而实现动态效果。
    viewer.scene.preUpdate.addEventListener(function () {
        var time = rectangle.appearance.material.uniforms.time;
        time += 0.001;
        if (time > 1.0) {
            time = 0.0;
        }
        rectangle.appearance.material.uniforms.time = time;
    })




}

// 2021-06-09 粉刷匠 添加通视分析
export const addAnaTongShi = (viewer: any) => {

    viewer.scene.globe.depthTestAgainstTerrain = true;
    if (handlerDraw) { handlerDraw.destroy(); }
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    let positions: any = [];
    let tempPoints: any = [];
    let polyline: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 2) {
            if (!Cesium.defined(polyline)) {
                polyline = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('This browser does not support polylines on terrain.');
            return;
        }

        // 粉刷匠 获取地形上的点
        cartesian = viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(cartesian)) {
            if (positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }

        // 在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
        floatingPoint = viewer.entities.add({
            id: "draw_Clip_Point" + tmpId,
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        if (floatingPoint) {
            entityDrawArr.push(floatingPoint);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        positions.pop();
        handler.destroy();

        if (positions && polyline) {
            addTongshi(positions);
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            // console.log(tmpId);
            this.options = {
                id: "draw_Tongshi_Line" + tmpId,
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 7,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            // 当可以画矩形的时候，把线的postion设置为 undefined
            var _update = function () {
                return _self.positions.length > 2 ? undefined : _self.positions;
            };
            // 实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();


    const addTongshi = (points: any) => {
        const startPoint = points[0];
        const endPoint = points[1];
        // * 计算射线的方向
        let direction = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.subtract(
                endPoint,
                startPoint,
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        );
        // 建立射线
        let ray = new Cesium.Ray(startPoint, direction);
        let result = viewer.scene.globe.pick(ray, viewer.scene); // 计算交点

        if (result !== undefined && result !== null) {
            drawLine(result, startPoint, Cesium.Color.GREEN); // 可视
            drawLine(result, endPoint, Cesium.Color.RED); // 不可视
        } else {
            drawLine(startPoint, endPoint, Cesium.Color.GREEN);
        }
    }


    function drawLine(point1: any, point2: any, color: any) {
        viewer.entities.add({
            polyline: {
                positions: [point1, point2],
                width: 1,
                material: color,
                depthFailMaterial: color
            }
        });
    }

}

// 2021-06-10 粉刷匠 添加天际线分析
export const addSkyLine = (viewer: any) => {

    // canvas左上角及右下角
    let canvas = viewer.scene.canvas;
    // 构造上下点序列对
    let maxNum = 100;
    let sigDis = Math.floor(canvas.clientWidth / maxNum);
    const upDownPair: any = [];
    for (let i = 0; i < maxNum; i++) {
        upDownPair.push({
            "up": [sigDis * i, 1],  // 本来应该是0的，为了方便计算，下移1px
            "down": [sigDis * i, canvas.clientHeight]
        })
    }

    // 初始数据检查
    const cordData: any = [];
    for (let i = 0; i < upDownPair.length; i++) {
        const pt1 = upDownPair[i]['up'];
        const pt2 = upDownPair[i]['down'];
        let pt1Able = false;
        let pt2Able = false;

        const c21 = new Cesium.Cartesian2(pt1[0], pt1[1]);
        const c22 = new Cesium.Cartesian2(pt2[0], pt2[1]);
        const pick1 = viewer.scene.globe.pick(viewer.camera.getPickRay(c21), viewer.scene);
        const pick2 = viewer.scene.globe.pick(viewer.camera.getPickRay(c22), viewer.scene);
        if (pick1 !== undefined && pick1 !== null) {
            pt1Able = true;
        }
        if (pick2 !== undefined && pick2 !== null) {
            pt2Able = true;
        }


        // 天-天 抛弃 地-地 留上 地-天 抛弃 天-地 保留
        if (!pt1Able && !pt2Able) {
            cordData.push([null, null]);
        }
        if (pt1Able && !pt2Able) {
            cordData.push([null, null]);
        }
        if (pt1Able && pt2Able) {
            cordData.push([pt1, null]);
        }
        if (!pt1Able && pt2Able) {
            cordData.push([pt1, pt2]);
        }

    }

    // 仅对天地数据处理
    const midPointArr: any = [];
    for (let i = 0; i < cordData.length; i++) {
        if (cordData[i][0] && cordData[i][1]) {
            const midPoint = calcMidPoint(cordData[i][0], cordData[i][1], viewer);
            midPointArr.push(midPoint);
        } else if (cordData[i][0]) {
            midPointArr.push(cordData[i][0]);
        }
    }

    const linePoint: any = [];
    for (let i = 0; i < midPointArr.length; i++) {
        const pt1 = midPointArr[i];
        if (!pt1) continue;
        const c21 = new Cesium.Cartesian2(pt1[0], pt1[1]);
        const pick1 = viewer.scene.globe.pick(viewer.camera.getPickRay(c21), viewer.scene);
        const pickedFeature1 = viewer.scene.pick(c21);
        // 获取场景坐标 Cartesian3 （pickPosition）
        const position = viewer.scene.pickPosition(c21);
        if (Cesium.defined(pickedFeature1) && position) {
            linePoint.push(position);
        } else if (pick1 !== undefined && pick1 !== null) {
            linePoint.push(pick1);
        }
    }

    viewer.entities.add({
        polyline: {
            positions: linePoint,
            width: 1,
            material: Cesium.Color.GREEN,
            depthFailMaterial: Cesium.Color.GREEN
        }
    });














    // let ellipsoid = viewer.scene.globe.ellipsoid;
    // let upperLeft3 = viewer.camera.pickEllipsoid(
    //     upperLeft,
    //     ellipsoid
    // );// 2D转3D世界坐标

    // let lowerRight3 = viewer.camera.pickEllipsoid(
    //     lowerRight,
    //     ellipsoid
    // );// 2D转3D世界坐标

    // let upperLeftCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
    //     upperLeft3
    // );// 3D世界坐标转弧度
    // let lowerRightCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
    //     lowerRight3
    // );// 3D世界坐标转弧度

    // let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude);//弧度转经纬度
    // let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude);//弧度转经纬度

    // let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude);//弧度转经纬度
    // let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude);//弧度转经纬度


}

// 2021-06-10 粉刷匠 二分法计算中心点
export const calcMidPoint = (point1: any, point2: any, viewer: any): any => {
    // 计算两点之间的中点
    if (Math.abs(point1[1] - point2[1]) < 5) {
        console.log('point', point2);
        return point2;
    }

    const midx = Math.floor((point1[0] + point2[0]) / 2);
    const midy = Math.floor((point1[1] + point2[1]) / 2);
    const point3 = [midx, midy];

    const c21 = new Cesium.Cartesian2(point1[0], point1[1]);
    const c22 = new Cesium.Cartesian2(point2[0], point2[1]);
    const c23 = new Cesium.Cartesian2(point3[0], point3[1]);

    const pick1 = viewer.scene.globe.pick(viewer.camera.getPickRay(c21), viewer.scene);
    const pick2 = viewer.scene.globe.pick(viewer.camera.getPickRay(c22), viewer.scene);
    const pick3 = viewer.scene.globe.pick(viewer.camera.getPickRay(c23), viewer.scene);

    const pickedFeature1 = viewer.scene.pick(c21);
    const pickedFeature2 = viewer.scene.pick(c22);
    const pickedFeature3 = viewer.scene.pick(c23);

    let pt1Able = false;
    let pt2Able = false;
    let pt3Able = false;
    if (pick1 !== undefined && pick1 !== null) {
        pt1Able = true;
    }
    if (pick2 !== undefined && pick2 !== null) {
        pt2Able = true;
    }
    if (pick3 !== undefined && pick3 !== null) {
        pt3Able = true;
    }

    if (Cesium.defined(pickedFeature1)) {
        pt1Able = true;
    }
    if (Cesium.defined(pickedFeature2)) {
        pt2Able = true;
    }
    if (Cesium.defined(pickedFeature3)) {
        pt3Able = true;
    }

    if (!pt1Able && pt2Able) {
        if (pt3Able) {
            return calcMidPoint(point1, point3, viewer);
        } else {
            return calcMidPoint(point3, point2, viewer);
        }
    } else {
        return point2;
    }
}

// 2021-06-10 粉刷匠 正统添加天际线
export const addRealSkyline = (viewer: any) => {
    //创建天际线分析
    // var skyline = new Cesium.Skyline(viewer.scene);
}

// ---------------------------------------------------------------------------------------------------------------------------------------

// 添加geoserver发布的wmts服务
export const addWmtsLayer = (viewer: any) => {
    const turl = "http://localhost:8080/geoserver/gwc/service/wmts/rest/nurc:Pk50095/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png";
    const tlayer = new Cesium.WebMapTileServiceImageryProvider({
        url: turl,
        layer: 'nurc:Pk50095',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:900913',
    });
    viewer.imageryLayers.addImageryProvider(tlayer);
}

// =================================这是示例区域========================
export const addTestDarkImg = (viewer: any) => {
    // 添加一个蓝色底图来加强图像的展示
    viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
            url: './Models/image/dark.png'
        })
    )
}

// 获取相机参数
export const getTestCameraPara = (viewer: any) => {

    console.log("参数postion", viewer.camera.position);
    console.log("参数postion", viewer.camera.heading);
    console.log("参数postion", viewer.camera.pitch);
    console.log("参数postion", viewer.camera.roll);
}

// 2020-12-25 粉刷匠 添加热力图
export const addTestHeatmap = (viewer: any) => {
    // 矩形坐标 xmin ymin xmax ymax
    // let bounds = {
    //     west: 113.779,
    //     south: 22.564,
    //     east: 114.142,
    //     north:22.774
    // };
    const points = [];
    const width = 600;
    const height = 400;
    const max = 100;

    // 热力图经纬度范围
    const latMin = 22.5;
    const latMax = 23.5;
    const lonMin = 113.5;
    const lonMax = 114.5;
    // 根据热力图图片范围，生成随机热力点和强度值
    for (let i = 0; i < 300; i++) {
        const lon = lonMin + Math.random() * (lonMax - lonMin);
        const lat = latMin + Math.random() * (latMax - latMin);
        const value = Math.floor(Math.random() * max);
        const point = {
            x: Math.floor((lat - latMin) / (latMax - latMin) * width),
            y: Math.floor((lon - lonMin) / (lonMax - lonMin) * height),
            value: value
        };
        points.push(point);
    }

    if (!window.h337) {
        console.log("lrr err");
        return;
    }

    // const tmpDiv = document.createElement('div');
    // tmpDiv.setAttribute('width', "600px");
    // tmpDiv.setAttribute('height', "400px");

    // 创建热力图
    const heatmapInstance = window.h337.create({
        container: document.querySelector('.div-heatmap')
        // container:tmpDiv
    });

    const data = {
        max: max,
        data: points
    };
    heatmapInstance.setData(data);

    // 将热力图添加到球体上(生成的热力图canvas元素类名为heatmap-canvas)
    const canvas: any = document.getElementsByClassName('heatmap-canvas');

    viewer.entities.add({
        name: 'heatmap',
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(lonMin, latMin, lonMax, latMax),
            material: new Cesium.ImageMaterialProperty({
                image: canvas[0],
                transparent: true
            })
        }
    });



    // let heatMap = CesiumHeatmap.create(
    //     viewer, // your cesium viewer
    //     bounds, // bounds for heatmap layer
    //     {
    //         // backgroundColor: "rgba(0,0,0,0)",
    //         // radius: 50,
    //         // maxOpacity: .5,
    //         // minOpacity: 0,
    //         // blur: .75
    //     }
    // );

    // // random example data
    // let data = [{ "x": 114.1383442264, "y": 22.4360048372, "value": 76 },
    //  { "x": 114.1384363011, "y": 22.4360298848, "value": 63 }, 
    //  { "x": 114.138368102, "y": 22.4358360603, "value": 1 }, 
    //  { "x": 114.1385627739, "y": 22.4358799123, "value": 21 }, 
    //  { "x": 114.1385138501, "y": 22.4359327669, "value": 28 }, 
    //  { "x": 114.1385031219, "y": 22.4359730105, "value": 41 }, 
    //  { "x": 114.1384127393, "y": 22.435928255, "value": 75 },
    //   { "x": 114.1384551136, "y": 22.4359450132, "value": 3 },
    //    { "x": 114.1384927196, "y": 22.4359158649, "value": 45 }, 
    //    { "x": 114.1384938639, "y": 22.4358498311, "value": 45 }, { "x": 114.1385183299, "y": 22.4360213794, "value": 93 }, { "x": 114.1384007925, "y": 22.4359860133, "value": 46 }, { "x": 114.1383604844, "y": 22.4358298672, "value": 54 }, { "x": 114.13851025, "y": 22.4359098303, "value": 39 }, { "x": 114.1383874733, "y": 22.4358511035, "value": 34 }, { "x": 114.1384981796, "y": 22.4359355403, "value": 81 }, { "x": 114.1384504107, "y": 22.4360332348, "value": 39 }, { "x": 114.1385582664, "y": 22.4359788335, "value": 20 }, { "x": 114.1383967364, "y": 22.4360581999, "value": 35 }, { "x": 114.1383839615, "y": 22.436016316, "value": 47 }, { "x": 114.1384082712, "y": 22.4358423338, "value": 36 }, { "x": 114.1385092651, "y": 22.4358577623, "value": 69 }, { "x": 114.138360356, "y": 22.436046789, "value": 90 }, { "x": 114.138471893, "y": 22.4359184292, "value": 88 }, { "x": 114.1385605689, "y": 22.4360271359, "value": 81 }, { "x": 114.1383585714, "y": 22.4359362476, "value": 32 }, { "x": 114.1384939114, "y": 22.4358844253, "value": 67 }, { "x": 114.138466724, "y": 22.436019121, "value": 17 }, { "x": 114.1385504355, "y": 22.4360614056, "value": 49 }, { "x": 114.1383883832, "y": 22.4358733544, "value": 82 }, { "x": 114.1385670669, "y": 22.4359650236, "value": 25 }, { "x": 114.1383416534, "y": 22.4359310876, "value": 82 }, { "x": 114.138525285, "y": 22.4359394661, "value": 66 }, { "x": 114.1385487719, "y": 22.4360137656, "value": 73 }, { "x": 114.1385496029, "y": 22.4359187277, "value": 73 }, { "x": 114.1383989222, "y": 22.4358556562, "value": 61 }, { "x": 114.1385499424, "y": 22.4359149305, "value": 67 }, { "x": 114.138404523, "y": 22.4359563326, "value": 90 }, { "x": 114.1383883675, "y": 22.4359794855, "value": 78 }, { "x": 114.1383967187, "y": 22.435891185, "value": 15 }, { "x": 114.1384610005, "y": 22.4359044797, "value": 15 }, { "x": 114.1384688489, "y": 22.4360396127, "value": 91 }, { "x": 114.1384431875, "y": 22.4360684409, "value": 8 }, { "x": 114.1385411067, "y": 22.4360645847, "value": 42 }, { "x": 114.1385237178, "y": 22.4358843181, "value": 31 }, { "x": 114.1384406464, "y": 22.4360003831, "value": 51 }, { "x": 114.1384679169, "y": 22.4359950456, "value": 96 }, { "x": 114.1384194314, "y": 22.4358419739, "value": 22 }, { "x": 114.1385049792, "y": 22.4359574813, "value": 44 }, { "x": 114.1384097378, "y": 22.4358598672, "value": 82 }, { "x": 114.1384993219, "y": 22.4360352975, "value": 84 }, { "x": 114.1383640499, "y": 22.4359839518, "value": 81 }];
    // let valueMin = 0;
    // let valueMax = 100;

    // // add data to heatmap
    // heatMap.setWGS84Data(valueMin, valueMax, data);

}

export const addImageLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 60,
            // 流动纹理
            material: new Cesium.ImageMaterialProperty({
                image: './Models/image/road.jpg'
            })
        }
    });
}

// 添加带贴图的道路
export const addRoadWithImage = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < 1; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addImageLine(viewer, tmpArr);
    }
}

export const addTestBlueLine = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < orgArr.length; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addGlowPolyLine(viewer, tmpArr);
    }
}

export const addTestFlowLine = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < orgArr.length; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addFlowLine(viewer, tmpArr);
    }
}

// 添加一个旋转的圆圈
export const addTestBox = (viewer: any) => {

    let rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
        rotation += 0.002;
        return rotation;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 1000),
        ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
            height: 2000,
            material: new Cesium.ImageMaterialProperty({
                image: './Models/image/circle.png',
                repeat: new Cesium.Cartesian2(1, 1),
                transparent: true
            }),
            rotation: new Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });

}

// 添加建筑切片3dtiles
export const addTestBlueBuilding = (viewer: any) => {

    const tmpTileset = new Cesium.Cesium3DTileset({
        // url: "./Models/szNanshan/tileset.json"
        url: "./Models/building4/tileset.json"
    })

    // 给建筑物添加shader
    tmpTileset.readyPromise.then(function (tileset: any) {
        viewer.scene.primitives.add(tmpTileset);

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                ]
            }
        });

        tileset.tileVisible.addEventListener(function (tile: any) {
            const content = tile.content;
            const featuresLength = content.featuresLength;
            for (let i = 0; i < featuresLength; i += 2) {
                let feature = content.getFeature(i)
                let model = feature.content._model

                if (model && model._sourcePrograms && model._rendererResources) {
                    Object.keys(model._sourcePrograms).forEach(key => {
                        let program = model._sourcePrograms[key]
                        let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
                        let v_position = "";
                        if (fragmentShader.indexOf(" v_positionEC;") !== -1) {
                            v_position = "v_positionEC";
                        } else if (fragmentShader.indexOf(" v_pos;") !== -1) {
                            v_position = "v_pos";
                        }
                        const color = `vec4(${feature.color.toString()})`;

                        model._rendererResources.sourceShaders[program.fragmentShader] =
                            "varying vec3 " + v_position + ";\n" +
                            "void main(void){\n" +
                            "    vec4 position = czm_inverseModelView * vec4(" + v_position + ",1);\n" +
                            "    float glowRange = 120.0;\n" +
                            "    gl_FragColor = " + color + ";\n" +
                            // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
                            "    gl_FragColor *= vec4(vec3(position.z / 80.0), 1.0);\n" +
                            "    float time = fract(czm_frameNumber / 120.0);\n" +
                            "    time = abs(time - 0.5) * 2.0;\n" +
                            "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
                            "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
                            "}\n"
                    })
                    model._shouldRegenerateShaders = true
                }
            }
        });

        // 设置3dTiles贴地
        set3DtilesHeight(500, tileset);

        // 设置hover事件
        // addHoverAction(tileset, viewer);

    })
}

// 设置建筑物贴地
export const set3DtilesHeight = (height: number, tileset: any) => {
    // const height = 10;
    const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
    );
    const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
    );
    const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
    );
    const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}

// 2021-04-15 粉刷匠 3dtiles单体化练习1, todo:可以自己搭配弹窗(粉刷匠 不想写了，谢谢，自行搭配)
export const addHoverAction = (tileset: any, viewer: any) => {

    // 创建html元素，鼠标移动以及点击模型高亮作用,todo:粉刷匠有话说，自己写
    // HTML overlay for showing feature name on mouseover
    // const nameOverlay = document.createElement("div");
    // viewer.container.appendChild(nameOverlay);
    // nameOverlay.className = "backdrop";
    // nameOverlay.style.display = "none";
    // nameOverlay.style.position = "absolute";
    // nameOverlay.style.bottom = "0";
    // nameOverlay.style.left = "0";
    // nameOverlay.style.pointerEvents = "none";
    // nameOverlay.style.padding = "4px";
    // nameOverlay.style.backgroundColor = "black";

    // 设置选中要素的样式以及创建选中模型
    // Information about the currently selected feature
    const selected: any = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };
    // An entity object which will hold info about the currently selected feature for infobox display
    const selectedEntity: any = new Cesium.Entity();

    // 鼠标响应事件交互
    // Get default left click handler for when a feature is not picked on left click
    const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    // 如果支持剪影，则鼠标上方的剪影功能为蓝色，鼠标单击的剪影功能为绿色
    // 如果不支持轮廓，请将特征颜色更改为鼠标悬停时为黄色，单击鼠标时为绿色
    // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
    // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
        // Silhouettes are supported
        const silhouetteBlue: any = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
        silhouetteBlue.uniforms.length = 0.01;
        silhouetteBlue.selected = [];

        const silhouetteGreen: any = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteGreen.uniforms.color = Cesium.Color.LIME;
        silhouetteGreen.uniforms.length = 0.01;
        silhouetteGreen.selected = [];

        viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([
            silhouetteBlue,
            silhouetteGreen,
        ]));

        // Silhouette a feature blue on hover.
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement: any) {
            // If a feature was previously highlighted, undo the highlight
            silhouetteBlue.selected = [];

            // Pick a new feature
            const pickedFeature = viewer.scene.pick(movement.endPosition);
            if (!Cesium.defined(pickedFeature)) {
                // nameOverlay.style.display = "none";
                return;
            }

            // A feature was picked, so show it's overlay content
            // nameOverlay.style.display = "block";
            // nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + "px";
            // nameOverlay.style.left = movement.endPosition.x + "px";
            // const name = pickedFeature.getProperty("BIN");
            // nameOverlay.textContent = name;

            // Highlight the feature if it's not already selected.
            if (pickedFeature !== selected.feature) {
                silhouetteBlue.selected = [pickedFeature];
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Silhouette a feature on selection and show metadata in the InfoBox.
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
            // If a feature was previously selected, undo the highlight
            silhouetteGreen.selected = [];

            // Pick a new feature
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                clickHandler(movement);
                return;
            }

            // Select the feature if it's not already selected
            if (silhouetteGreen.selected[0] === pickedFeature) {
                return;
            }

            // Save the selected feature's original color
            const highlightedFeature = silhouetteBlue.selected[0];
            if (pickedFeature === highlightedFeature) {
                silhouetteBlue.selected = [];
            }

            // Highlight newly selected feature
            silhouetteGreen.selected = [pickedFeature];

            // Set feature infobox description
            const featureName = pickedFeature.getProperty("name");
            selectedEntity.name = featureName;
            selectedEntity.description =
                'Loading <div class="cesium-infoBox-loading"></div>';
            viewer.selectedEntity = selectedEntity;
            selectedEntity.description =
                '<table class="cesium-infoBox-defaultTable"><tbody>' +
                "<tr><th>BIN</th><td>" +
                pickedFeature.getProperty("BIN") +
                "</td></tr>" +
                "<tr><th>DOITT ID</th><td>" +
                pickedFeature.getProperty("DOITT_ID") +
                "</td></tr>" +
                "<tr><th>SOURCE ID</th><td>" +
                pickedFeature.getProperty("SOURCE_ID") +
                "</td></tr>" +
                "</tbody></table>";
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
        // Silhouettes are not supported. Instead, change the feature color.

        // Information about the currently highlighted feature
        const highlighted: any = {
            feature: undefined,
            originalColor: new Cesium.Color(),
        };

        // Color a feature yellow on hover.
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement: any) {
            // If a feature was previously highlighted, undo the highlight
            if (Cesium.defined(highlighted.feature)) {
                highlighted.feature.color = highlighted.originalColor;
                highlighted.feature = undefined;
            }
            // Pick a new feature
            const pickedFeature = viewer.scene.pick(movement.endPosition);
            if (!Cesium.defined(pickedFeature)) {
                // nameOverlay.style.display = "none";
                return;
            }
            // A feature was picked, so show it's overlay content
            // nameOverlay.style.display = "block";
            // nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + "px";
            // nameOverlay.style.left = movement.endPosition.x + "px";
            let name = pickedFeature.getProperty("name");
            if (!Cesium.defined(name)) {
                name = pickedFeature.getProperty("id");
            }
            // nameOverlay.textContent = name;
            // Highlight the feature if it's not already selected.
            if (pickedFeature !== selected.feature) {
                highlighted.feature = pickedFeature;
                Cesium.Color.clone(
                    pickedFeature.color,
                    highlighted.originalColor
                );
                pickedFeature.color = Cesium.Color.YELLOW;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Color a feature on selection and show metadata in the InfoBox.
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
            // If a feature was previously selected, undo the highlight
            if (Cesium.defined(selected.feature)) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }
            // Pick a new feature
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                clickHandler(movement);
                return;
            }
            // Select the feature if it's not already selected
            if (selected.feature === pickedFeature) {
                return;
            }
            selected.feature = pickedFeature;
            // Save the selected feature's original color
            if (pickedFeature === highlighted.feature) {
                Cesium.Color.clone(
                    highlighted.originalColor,
                    selected.originalColor
                );
                highlighted.feature = undefined;
            } else {
                Cesium.Color.clone(pickedFeature.color, selected.originalColor);
            }
            // Highlight newly selected feature
            pickedFeature.color = Cesium.Color.LIME;
            // Set feature infobox description
            const featureName = pickedFeature.getProperty("name");
            selectedEntity.name = featureName;
            selectedEntity.description =
                'Loading <div class="cesium-infoBox-loading"></div>';
            viewer.selectedEntity = selectedEntity;
            selectedEntity.description =
                '<table class="cesium-infoBox-defaultTable"><tbody>' +
                "<tr><th>BIN</th><td>" +
                pickedFeature.getProperty("BIN") +
                "</td></tr>" +
                "<tr><th>DOITT ID</th><td>" +
                pickedFeature.getProperty("DOITT_ID") +
                "</td></tr>" +
                "<tr><th>SOURCE ID</th><td>" +
                pickedFeature.getProperty("SOURCE_ID") +
                "</td></tr>" +
                "<tr><th>Longitude</th><td>" +
                pickedFeature.getProperty("longitude") +
                "</td></tr>" +
                "<tr><th>Latitude</th><td>" +
                pickedFeature.getProperty("latitude") +
                "</td></tr>" +
                "<tr><th>Height</th><td>" +
                pickedFeature.getProperty("height") +
                "</td></tr>" +
                "<tr><th>Terrain Height (Ellipsoid)</th><td>" +
                pickedFeature.getProperty("TerrainHeight") +
                "</td></tr>" +
                "</tbody></table>";
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }


}

export const addTestGlbLabel = (viewer: any) => {
    const flightData = testFlightData;
    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * (flightData.length - 1);
    const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    // Speed up the playback speed 50x.
    viewer.clock.multiplier = 50;
    // Start playing the scene.
    viewer.clock.shouldAnimate = true;

    // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
    const positionProperty = new Cesium.SampledPositionProperty();

    for (let i = 0; i < flightData.length; i++) {
        const dataPoint = flightData[i];
        // Declare the time for this individual sample and store it in a new JulianDate instance.
        const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
        const position = Cesium.Cartesian3.fromDegrees(dataPoint[0], dataPoint[1], dataPoint[2]);
        // Store the position along with its timestamp.
        // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
        positionProperty.addSample(time, position);
    }

    // STEP 4 CODE (green circle entity)        
    const loadModel = async () => {
        const airplaneUrl = "./Models/Cesium_Air.glb";
        viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
            position: positionProperty,
            // path: new Cesium.PathGraphics({ width: 3 }),
            model: {
                uri: airplaneUrl,
                minimumPixelSize: 40,
                maximumScale: 20000,
            },
            orientation: new Cesium.VelocityOrientationProperty(positionProperty)
        });
    }

    loadModel();
}

// 2021-08-16 粉刷匠 添加水坝
export const addShuiBa = (viewer: any) => {
    const airplaneUrl = "./Models/shuiba0902.glb";

    // 此方法问题在于缩放的时候不能随着缩放
    // viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(110.95, 23.40, 100),
    //     model: {
    //         uri: airplaneUrl,
    //         minimumPixelSize: 128,
    //         maximumScale: 20000,
    //     },
    //     // orientation: new Cesium.VelocityOrientationProperty(positionProperty)
    // });

    // flyToPoint(viewer, { lng: 111.02660, lat: 23.42913, height: 100 });

    for (let i = 0; i < WaterControlPoint.length; i += 4) {
        // const cord = [104.04486, 30.77336, 504];
        const cord = [WaterControlPoint[i], WaterControlPoint[i + 1], WaterControlPoint[i + 2]];
        const cartesian = Cesium.Cartesian3.fromDegrees(cord[0], cord[1], cord[2]);
        const newHeading = Cesium.Math.toRadians(WaterControlPoint[i + 3]); //初始heading值赋0
        const newPitch = Cesium.Math.toRadians(0);
        const newRoll = Cesium.Math.toRadians(0);
        const headingPitchRoll = new Cesium.HeadingPitchRoll(newHeading, newPitch, newRoll);
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());
    
        const curModel = viewer.scene.primitives.add(Cesium.Model.fromGltf({
            url: airplaneUrl, // 模型地址
            modelMatrix,
        }));
    
        // todo:平移,可使用偷懒方法，修改Cesium.Cartesian3.fromDegrees(110.95, 23.40, 100); 
    
        // 放大一点
        curModel.scale = 10;
    }

  

    // 模型旋转
    // const curModelMatrix = curModel.modelMatrix; // 获取当前模型modelMatrix
    // const tcartesian = new Cesium.Cartesian3(curModelMatrix[12], curModelMatrix[13], curModelMatrix[14]);
    // const tnewHeading = Cesium.Math.toRadians(0);// 改变Heading值
    // const tnewPitch = Cesium.Math.toRadians(0);// pitch值填当前模型pitch，上文介绍过如何获取
    // const tnewRoll = Cesium.Math.toRadians(0);// 同上
    // const theadingPitchRoll = new Cesium.HeadingPitchRoll(tnewHeading, tnewPitch, tnewRoll);
    // const m = Cesium.Transforms.headingPitchRollToFixedFrame(tcartesian, theadingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());
    // curModel.modelMatrix = m; //新的modelMatrix赋给模型

    // viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(cord[0], cord[1], 100),
    //     orientation: {
    //         heading: Cesium.Math.toRadians(0),
    //         pitch: Cesium.Math.toRadians(-90),
    //         roll: 0.0
    //     }
    // });




    // 添加水库流水
    for (let i = 0; i < WaterFallCord.length; i += 7) {
        setTimeout(() => {
            const portHeight = 510;
            const startPoint = [WaterFallCord[i], WaterFallCord[i + 1], portHeight];
            const endPoint = [WaterFallCord[i + 2], WaterFallCord[i + 3], portHeight];
            const portNum = 6;
            const sigStep1 = (endPoint[0] - startPoint[0]) / (portNum - 1);
            const sigStep2 = (endPoint[1] - startPoint[1]) / (portNum - 1);
            const baArray: any = [];
            baArray.push(startPoint);
            for (let j = 1; j < portNum - 1; j++) {
                baArray.push([startPoint[0] + sigStep1 * j, startPoint[1] + sigStep2 * j, portHeight]);
            }
            baArray.push(endPoint);
            for (let j = 0; j < baArray.length; j++) {
                addQingxie(viewer, baArray[j][0], baArray[j][1], baArray[j][2], `box${i}-${j}`, WaterFallCord[i + 4], WaterFallCord[i + 5]);
            }
        }, WaterFallCord[i + 6]);
    }



}

// 2021-09-01 粉刷匠 九道堰相关
let isWaterChange: boolean = false;
let waterChangeTime: number = 0;
if(waterChangeTime){
    // 
}
export const addJdyShuimian = (viewer: any) => {

    // 添加一个地形
    let terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "http://192.168.207.155:9000/terrain/aad787c00b0011ecbf0d11c2c0edeb81"
        // url: 'http://localhost:9000/terrain/aad787c00b0011ecbf0d11c2c0edeb81'
        // url:'http://localhost:9000/terrain/73f16a300b1611ecbf0d11c2c0edeb81'
    });
    viewer.terrainProvider = terrainProvider;

    const polyRivers: any = [];
    const riverFeature = MultiPolyRiver.features;
    for (let i = 0; i < riverFeature.length; i++) {
        const sigFeature = riverFeature[i];
        const coordinates = sigFeature.geometry.coordinates;
        for (let j = 0; j < coordinates.length; j++) {
            const sigPolygon = coordinates[j];
            const sigPolyCord: any = [];
            for (let k = 0; k < sigPolygon.length; k++) {
                sigPolyCord.push(sigPolygon[k][0], sigPolygon[k][1]);
            }
            polyRivers.push(sigPolyCord);
        }
    }

    for (let i = 0; i < polyRivers.length; i++) {
        addWater(viewer, polyRivers[i]);
        addWaterBase(viewer, polyRivers[i]);
    }

    // addWater(viewer, PolyRiver);
    flyToPoint(viewer, { lng: PolyRiver[0], lat: PolyRiver[1], height: 1000 });
    // addShuiBa(viewer);   
    // addJDYFlood(viewer)
    addJDYLabel(viewer);  
    // addJDYFlowLine(viewer);
}

// 2021-09-04 粉刷匠 添加一个不断变化的多边形
export const addJDYFlowLine = (viewer: any) => {
    const waterAside = riverTwoLine.features[0].geometry.coordinates;
    const waterBside = riverTwoLine.features[1].geometry.coordinates;

    const maxPointNum = 800;
    let chooseLength = waterAside.length > waterBside.length ? waterBside.length : waterAside.length;
    chooseLength = chooseLength > maxPointNum ? maxPointNum : chooseLength;
    const chooseAside: any = [];
    const chooseBside: any = [];
    for (let i = 0; i < chooseLength; i++) {
        chooseAside.push(waterAside[waterAside.length - 1 - i]);
        chooseBside.push(waterBside[i]);
    }

    const step = 2;
    // for (let i = 0; i < chooseLength; i += step) {
    //     const 
    // }

    // viewer.entities.add({
    //     name: '多边形',
    //     polygon: {
    //         hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polydata)),
    //         // material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(8, 116, 100)),
    //         material: new Cesium.ColorMaterialProperty(Cesium.Color.RED),
    //         // material: new Cesium.ImageMaterialProperty({
    //         //     image: new Cesium.CallbackProperty(makeJT, false),
    //         //     transparent: true,
    //         // })
    //     },
    // });



   
    viewer.scene.globe.depthTestAgainstTerrain = true;

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            this.options = {
                id: "draw_Clip" + tmpId,
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    // material: Cesium.Color.GREEN.withAlpha(0.5),
                    material: Cesium.Color.RED,
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();

    let polygon: any = null;
    let positions: any = Cesium.Cartesian3.fromDegreesArray([
        chooseBside[1][0], chooseBside[1][1],
        chooseBside[0][0], chooseBside[0][1],
        chooseAside[0][0], chooseAside[0][1],
        chooseAside[1][0], chooseAside[1][1],
    ]);
    polygon = new PolygonPrimitive(positions);
    if(polygon){
        // 
    }
    let polyIndex = 0;
    let tout: any = null;

    // 2021-09-04 粉刷匠 自迭代
    // tout = setInterval(() => {
    //     if ((polyIndex + 1) * step > chooseLength) {
    //         clearInterval(tout);
    //         return;
    //     }
    //     const lineA = chooseAside.filter((t: any, index: any) => index >= (polyIndex) * step && index < (polyIndex + 1) * step);
    //     const lineB = chooseBside.filter((t: any, index: any) => index >= (polyIndex) * step && index < (polyIndex + 1) * step);
 

    //     // for (let i = 0; i < lineB.length; i++) {
    //     //     const sigPointA = lineA[i];
    //     //     const sigPointB = lineB[lineB.length - 1 - i];
    //     //     const sigPointAArr = [sigPointA[0], sigPointA[1]];
    //     //     const sigPointBArr = [sigPointB[0], sigPointB[1]];
    //     //     positions.push(Cesium.Cartesian3.fromDegreesArray(sigPointAArr)[0]);
    //     //     positions.unshift(Cesium.Cartesian3.fromDegreesArray(sigPointBArr)[0])
    //     // }   
        
    //     for (let i = 0; i < lineA.length; i++) {
    //         const sigPointA = lineA[i];          
    //         const sigPointAArr = [sigPointA[0], sigPointA[1]];           
    //         positions.push(Cesium.Cartesian3.fromDegreesArray(sigPointAArr)[0]);           
    //     }
        
    //     for (let i = 0; i < lineB.length; i++) {      
    //         const sigPointB = lineB[lineB.length - 1 - i];        
    //         const sigPointBArr = [sigPointB[0], sigPointB[1]];          
    //         positions.unshift(Cesium.Cartesian3.fromDegreesArray(sigPointBArr)[0])
    //     }   
        
    //     polyIndex = polyIndex + 1;
    // }, 500);

    tout = setInterval(() => {
        if ((polyIndex + 1) * step > chooseLength) {
            clearInterval(tout);
            return;
        }
        const lineA = chooseAside.filter((t: any, index: any) => index >= (polyIndex) * step && index <= (polyIndex + 1) * step);
        const lineB = chooseBside.filter((t: any, index: any) => index >= (polyIndex) * step && index <= (polyIndex + 1) * step);
        const allLinePoint: any = [];

        for (let i = 0; i < lineB.length; i++) {
            const sigPointB = lineB[lineB.length - 1 - i];
            allLinePoint.push(sigPointB[0]);
            allLinePoint.push(sigPointB[1]);
        }

        for (let i = 0; i < lineA.length; i++) {
            const sigPointA = lineA[i];
            allLinePoint.push(sigPointA[0]);
            allLinePoint.push(sigPointA[1]);
        }

        // 174, 128, 77
        addWater(viewer, allLinePoint, { r: 174, g: 128, b: 77, a: 150 })

        // viewer.entities.add({
        //     name: '多边形',
        //     polygon: {
        //         hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(allLinePoint)),
        //         // material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(8, 116, 100)),
        //         material: new Cesium.ColorMaterialProperty(Cesium.Color.RED),
        //         // material: new Cesium.ImageMaterialProperty({
        //         //     image: new Cesium.CallbackProperty(makeJT, false),
        //         //     transparent: true,
        //         // })
        //     },
        // });
        
        polyIndex = polyIndex + 1;

    }, 100)

}



// 2021-09-04 粉刷匠 修改label的值
let interLable: any = null;
let monitorValueTime = 0;
export const changeLable = (entityArr: any) => {
    if (interLable) {
        // 
    }
    for (let i = 0; i < entityArr.length; i++) {
        const sigEntity = entityArr[i];
        if (sigEntity) {
            const orgText = sigEntity.label._text._value;
            const orgTextIndex = +orgText.substr(3, 1);
            const newValue = WaterControlPointValue[monitorValueTime][orgTextIndex - 1];
            sigEntity.label._text._value = `JCD${orgTextIndex}水位：${newValue}`;
            sigEntity.label._fillColor._value = newValue > 2.5 ? Cesium.Color.RED : Cesium.Color.BLUE;
        }
    }
    monitorValueTime = monitorValueTime + 1 < WaterControlPointValue.length ? monitorValueTime + 1 : 0;
}

export const addJDYLabel = (viewer: any) => {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    // 水位点
    // const pointArr = [[104.19183, 30.789, 500], [104.19879, 30.79091, 520]];
    const pointArr: any = [];
    for (let i = 0; i < WaterMonitorPoint.length; i += 3) {
        pointArr.push([WaterMonitorPoint[i], WaterMonitorPoint[i + 1], 570])
    }

    const jcEntArr: any = [];
    for (let i = 0; i < pointArr.length; i++) {
        const sigEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], pointArr[i][2]),
            billboard: {
                image: makeVirticelLine(), // default: undefined  
                width: 50,
                height: 50
            },
            label: {
                // 竖直的文字
                text: `JCD${i + 1}`,
                font: '16px sans-serif',
                // fillColor : Cesium.Color.RED,
                fillColor: new Cesium.Color(0.22, 0.89, 0.94),
                pixelOffset: new Cesium.Cartesian2(0, -30),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        });
        jcEntArr.push(sigEntity);
    }

    interLable = setInterval(() => {
        changeLable(jcEntArr)
    }, 2000);

    // 洼地点
    // const wadiArr = [[104.04863, 30.76756, 530], [104.05429, 30.76585, 530]];
    // for (let i = 0; i < wadiArr.length; i++) {
    //     viewer.entities.add({
    //         position: Cesium.Cartesian3.fromDegrees(wadiArr[i][0], wadiArr[i][1], wadiArr[i][2]),
    //         billboard: {
    //             image: makeVirticelLine(), // default: undefined  
    //             width: 50,
    //             height: 50
    //         },
    //         label: {
    //             // 竖直的文字
    //             text: '洼地',
    //             // font: '30px sans-serif',
    //             fillColor: Cesium.Color.RED.withAlpha(0.7),
    //             // fillColor: new Cesium.Color(0.5, 0.89, 0.94),
    //             pixelOffset: new Cesium.Cartesian2(0, -30),
    //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //         },
    //     });
    // }

    // // 摄像头
    // const sxtArr = [[104.06273, 30.77760, 490], [104.04797, 30.76234, 490], [104.06862, 30.76404, 490]];
    // for (let i = 0; i < sxtArr.length; i++) {
    //     viewer.entities.add({
    //         position: Cesium.Cartesian3.fromDegrees(sxtArr[i][0], sxtArr[i][1], sxtArr[i][2]),
    //         billboard: {
    //             image: './Models/image/sxt.png',
    //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //             heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    //             scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
    //         }
    //     });
    // }

    // 水坝指标框
    // const indexArr = [ 104.04506, 30.77378, 600];
    // // const indexArr = [104.18799, 30.79238, 500];    
    // viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(indexArr[0], indexArr[1], indexArr[2]),
    //     billboard: {
    //         image: makeBillBoardImg(""), // default: undefined  
    //         width: 320,
    //         height: 200
    //     }, 
    //     label: {
    //         text: '指标展示：\n---------------\n---------------',
    //         fillColor: new Cesium.Color(0.5, 0.89, 0.94),
    //         pixelOffset: new Cesium.Cartesian2(0, 10),
    //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //     },       
    // });

}


// 缩放到指定点
export const flyToPoint = (viewer: any, point: { lng: number, lat: number, height: number }) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 九道堰淹没
export const addJDYFlood = (viewer: any) => {

    // const boxEntity = new Cesium.Entity({
    //     id: "boxID01",
    //     name: 'Red box with black outline',
    //     position: Cesium.Cartesian3.fromDegrees(104.19973, 30.79115, 530),
    //     box: {
    //         dimensions: new Cesium.Cartesian3(500, 500, 500),
    //         // 渐变纹理
    //         material: new Cesium.ImageMaterialProperty({
    //             image: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
    //             transparent: true,
    //         }),
    //         outline: true,
    //         outlineColor: Cesium.Color.BLACK
    //     }
    // });
    // viewer.entities.add(boxEntity);





    const addRealFlood = (polyPosition: any) => {
        const tmpAllHeight = { maxHeight: 500, minHeight: 495 };
        const maxHeight = tmpAllHeight.maxHeight;
        const minHeight = tmpAllHeight.minHeight;
        let tmpHeight = minHeight;
        let tmpInterv = (maxHeight - minHeight) * 0.001;

        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.entities.add({
            name: '多边形',
            polygon: {
                hierarchy: polyPosition,
                perPositionHeight: true,
                extrudedHeight: new Cesium.CallbackProperty(() => {
                    if (!isWaterChange) return 0;
                    if (tmpHeight > maxHeight) {
                        tmpHeight = minHeight;
                        isWaterChange = false;
                        waterChangeTime = 0;
                    } else {
                        tmpHeight += tmpInterv;
                    }
                    return tmpHeight;
                }, false),
                // material: Cesium.Color.fromBytes(180, 130, 76, 150),
                // material: Cesium.Color.fromBytes(64, 157, 253, 150),
                material: Cesium.Color.fromBytes(174, 128, 77, 150),
            }
        })
    }

    addRealFlood(Cesium.Cartesian3.fromDegreesArray(PloyFlood))


}

export const addWaterBase = (viewer: any, poly?: number[]) => {
    const polydata = poly ? poly : shuiMian;

    // const colorData = {
    //     min: 1,
    //     max: 900,
    //     deviation: 5
    // }
    // let colorI = colorData.min;
    // let maxWaterChange = 3;
    // function makeJT() { // 这是callback，参数不能内传
    //     colorI = colorI + colorData.deviation;// deviationR为每次圆增加的大小
    //     if (colorI >= colorData.max) {
    //         colorI = colorData.min;
    //         waterChangeTime++;
    //         if (waterChangeTime > maxWaterChange) {
    //             colorI = colorData.max;
    //             isWaterChange = true;
    //         }
    //     }
    //     const a = Math.floor(colorI / 10) * 0.01;
    //     // const al = a > 0.5 ? (a - 0.5) : 0;
    //     const al = a > 0.5 ? (a - 0.3) : 0;
    //     const ramp = document.createElement('canvas');
    //     ramp.width = 200;
    //     ramp.height = 200;
    //     const ctx: any = ramp.getContext('2d');
    //     ctx.beginPath();
    //     ctx.rect(0, 0, 200, 200);
    //     ctx.closePath();

    //     ctx.fillStyle = `rgba(174, 128, 77, ${al})`;
    //     ctx.fill();
    //     ctx.stroke();

    //     return ramp;
    // }

    viewer.entities.add({
        name: '多边形',
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polydata)),
            // material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(8, 116, 100)),
            material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(6, 79, 68)),
            // material: new Cesium.ImageMaterialProperty({
            //     image: new Cesium.CallbackProperty(makeJT, false),
            //     transparent: true,
            // })
        },
    });

    // viewer.entities.add({
    //     name: '多边形',
    //     polygon: {
    //         hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polydata)),
    //         // material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(changeColor, false)),
    //         material: new Cesium.ImageMaterialProperty({
    //             image: new Cesium.CallbackProperty(makeJT, false),
    //             transparent: true,
    //         })
    //     },
    // });

}

export const addWater = (viewer: any, poly?: number[], color?: any) => {

    const data = poly ? poly : shuiMian;
    // 2021-08-17 粉刷匠 第一次尝试 透明水体 原本是为了修改着色器，但是发现使用baseWaterColor即可
    let material: any = new Cesium.Material({
        fabric: {
            type: 'Water',
            uniforms: { // 动态传递参数
                baseWaterColor: Cesium.Color.WHITE.withAlpha(0.1), // 水体颜色
                blendColor: Cesium.Color.DARKBLUE, // 水陆混合处颜色
                // specularMap:"../../**/jpg", // 一张黑白图用来作为标识哪里是用水来渲染的贴图
                normalMap: Cesium.buildModuleUrl(normalMap), // 用来生成起伏效果的水体
                frequency: 100.0,
                animationSpeed: 0.01,
                amplitude: 1000
            },
            // source: source
        },
        translucent: false
    })

    if (color) {
        material =new Cesium.Material({
            fabric : {
                type : 'Color',
                uniforms : {
                    color: Cesium.Color.fromBytes(color.r, color.g, color.b, color.a)
                }
            }
        });
    }

    const primitive = new Cesium.GroundPrimitive({// 贴地的primitive
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({// 支持CircleGeometry，CorridorGeometry，EllipseGeometry，RectangleGeometry
                // polygonHierarchy: new Cesium.PolygonHierarchy([
                //     // Cesium.Cartesian3.fromDegreesArray(100，25，100，30，110，30)
                //     Cesium.Cartesian3.fromDegreesArrayHeights(shuiMian)
                // ])
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(data)),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: material
        }),
        show: true
    })
    viewer.scene.primitives.add(primitive)

}

export const addQingxie = (viewer: any, lng: number, lat: number, height: number, id: string, heading: any, pitch: any) => {
    let viewModel: any = {
        emissionRate: 40.0,
        gravity: -10.0,
        minimumParticleLife: 1.5,
        maximumParticleLife: 2.5,
        minimumSpeed: 15.0,
        maximumSpeed: 16.0,
        startScale: 3.0,
        endScale: 4.0,
        particleSize: 25.0,
    };
    // const lng = 110.9495;
    // const lat = 23.4036;
    // const height = 200;

    const boxEntity = viewer.entities.add(
        new Cesium.Entity({
            id: id,
            name: 'Red box with black outline',
            position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
            box: {
                dimensions: new Cesium.Cartesian3(30, 30, 30),
                // 颜色材质
                material: Cesium.Color.RED.withAlpha(0.0),
            }
        })
    );
    viewer.clock.shouldAnimate = true;

    let emitterModelMatrix = new Cesium.Matrix4();
    let translation = new Cesium.Cartesian3();
    let rotation = new Cesium.Quaternion();
    let hpr = new Cesium.HeadingPitchRoll();
    let trs = new Cesium.TranslationRotationScale();

    function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
            -4.0,
            0.0,
            1.4,
            translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
            trs,
            emitterModelMatrix
        );
    }

    let gravityScratch = new Cesium.Cartesian3();
    // let isShow: boolean = true;
    let tmpParticel: any = null;
    function applyGravity(p: any, dt: any) {
        // We need to compute a local up vector for each particle in geocentric space.
        let position = p.position;

        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(
            gravityScratch,
            viewModel.gravity * dt,
            gravityScratch
        );

        p.velocity = Cesium.Cartesian3.add(
            p.velocity,
            gravityScratch,
            p.velocity
        );

        const distance = Cesium.Cartesian3.distance(
            viewer.scene.camera.position,
            Cesium.Cartesian3.fromDegrees(lng, lat, height)
        );
        if (distance > 5000) {
            // isShow = false;
            if (tmpParticel) {
                // tmpParticel.show = false;
                tmpParticel.startColor = Cesium.Color.LIGHTSEAGREEN.withAlpha(0.0);
            }
        } else {
            // isShow = true;
            if (tmpParticel) {
                // tmpParticel.show = true;
                tmpParticel.startColor = Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7);
            }
        }
    }

    tmpParticel = new Cesium.ParticleSystem({
        show: true,
        image: "./Models/image/partical.png",
        startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
        endColor: Cesium.Color.WHITE.withAlpha(0.0),
        startScale: viewModel.startScale,
        endScale: viewModel.endScale,
        minimumParticleLife: viewModel.minimumParticleLife,
        maximumParticleLife: viewModel.maximumParticleLife,
        minimumSpeed: viewModel.minimumSpeed,
        maximumSpeed: viewModel.maximumSpeed,
        imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
        ),
        emissionRate: viewModel.emissionRate,
        lifetime: 16.0,
        emitter: new Cesium.CircleEmitter(0.5),
        emitterModelMatrix: computeEmitterModelMatrix(),
        updateCallback: applyGravity,
    })
    const particleSystem = viewer.scene.primitives.add(tmpParticel);

    function computeModelMatrix(entity: any, time: any) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
    }

    viewer.scene.preUpdate.addEventListener(function (scene: any, time: any) {
        particleSystem.modelMatrix = computeModelMatrix(boxEntity, time);

        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();

        // Spin the emitter if enabled.
        if (viewModel.spin) {
            viewModel.heading += 1.0;
            viewModel.pitch += 1.0;
            viewModel.roll += 1.0;
        }
    });

}

// 测试 沿指定的路径飞行
export const addTestFlightLine = (viewer: any) => {
    // const positionList = testFlightData2;

    const positionList = [
        {
            direction: { x: 0.21737389927048856, y: -0.35625827851488445, z: 0.0005457635106811409 },
            position: { x: -2391675.894952625, y: 5388787.412965841, z: 2426462.2897910792 }
        },
        {
            direction: { x: 0.29263695515353305, y: -0.40838371225120706, z: 0.0007456844237099247 },
            position: { x: -2391483.00669378, y: 5388427.905450816, z: 2427118.8780692583 }
        },
        {
            direction: { x: 0.3335510891862299, y: 0.060774701476857595, z: 0.0007774323957603357 },
            position: { x: -2391466.8883185615, y: 5388021.038587686, z: 2427348.174456691 }
        },
        {
            direction: { x: 0.32721424136304833, y: 0.10707579115246624, z: 0.0007227711996984354 },
            position: { x: -2391790.5365237165, y: 5387942.510425894, z: 2427250.5374713736 }
        }
    ]
    let count = 0;
    fly();

    function fly() {
        if (count >= positionList.length) {
            return;
        }
        var position = positionList[count];

        viewer.camera.flyTo({
            // destination: Cesium.Cartesian3.fromDegrees(
            //     position[0],
            //     position[1],
            //     200
            // ),
            destination: position.position,
            duration: 0.3,

            orientation: {
                heading: position.direction.x,
                pitch: position.direction.y,
                roll: position.direction.z
            },

            // orientation: {
            //     heading: Cesium.Math.toRadians(0.0),
            //     pitch: Cesium.Math.toRadians(-90.0),
            //     roll: Cesium.Math.toRadians(0.0)
            // },
            complete: function () {
                fly();
            }
        });
        count++;
    }


}

export const addTestRroadGeoJsonData = (viewer: any) => {
    const tmpDataSource = Cesium.GeoJsonDataSource.load('./Models/json/line.json', {
        clampToGround: true,
        stroke: Cesium.Color.CHOCOLATE,
        strokeWidth: 7,
        markerSymbol: '?',

    })

    tmpDataSource.then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);

        const entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            entities[i].polyline.classificationType = Cesium.ClassificationType.TERRAIN;
            entities[i].polyline.material = new Cesium.ImageMaterialProperty({
                image: './Models/image/yr1.png',
                // repeat: new Cesium.Cartesian2(3.0, 1.0),
                transparent: true,
            })
        }

    })

}

// 添加一个圆扫描--测试
export const showTestCircleScan = (viewer: any) => {

    let rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
        rotation += 0.01;
        // rotation += 0.0;
        return rotation;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
        ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
            // height: 200,
            //颜色回调
            material: new Cesium.ImageMaterialProperty({
                image: getColorCircle("()", 90, true),
                transparent: true,
            }),
            rotation: new Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });
}

// 添加一个圆扩散--测试
export const showTestCircleScan2 = (viewer: any) => {

    const data = {
        minR: 100,
        maxR: 1000,
        deviationR: 10,// 差值 差值也大 速度越快
    }
    let r1 = data.minR;
    let r2 = data.minR;

    function changeR1() { // 这是callback，参数不能内传
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        return r1;
    }

    function changeR2() {
        r2 = r2 + data.deviationR;
        if (r2 >= data.maxR) {
            r2 = data.minR;
        }
        return r2;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.51, 100),
        ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
            semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
            // height: 200,
            //颜色回调
            material: new Cesium.ImageMaterialProperty({
                image: getColorCircle2("()", true),
                transparent: true,
            }),
            // rotation: new Cesium.CallbackProperty(getRotationValue, false),
            // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });
}

// 获取渐变色颜色的环
const getColorCircle2 = (color: any, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    // const values = elevationRamp;
    const grd = ctx.createRadialGradient(50, 50, 50, 50, 50, 0);
    grd.addColorStop(1, 'transparent'); //black
    grd.addColorStop(0.1, 'rgba(225,255,255,0.1)'); //black
    grd.addColorStop(0, "rgba(225,255,255,0.7)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 100);
    return ramp;
}

// 获取颜色环
const getColorCircle = (color: any, deg: number, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    // const values = elevationRamp;
    const grd = ctx.createLinearGradient(55, 25, 100, 50);
    grd.addColorStop(0, 'transparent'); //black
    grd.addColorStop(0.5, 'rgba(225,255,255,0.5)'); //orange
    grd.addColorStop(1, 'rgba(225,255,255,1)'); //yellow

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.arc(50, 50, 50, -90 / 180 * Math.PI, 0 / 180 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = 'rgba(225,255,255,1)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    return ramp;
}

// showCircleScan() // 圆扩散
export const showCircleScan = (viewer: any) => {
    const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(113.9), Cesium.Math.toRadians(22.51), 1000);
    const scanColor = Cesium.Color.CYAN;
    addCircleScanPostStage(viewer, cartographicCenter, 1000, scanColor, 4000);
}

// showRadarScan() // 雷达扫描
export const showRadarScan = (viewer: any) => {
    const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(113.9), Cesium.Math.toRadians(22.49), 320);
    // const scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
    const scanColor = Cesium.Color.AQUA;
    addRadarScanPostStage(viewer, cartographicCenter, 1000, scanColor, 3000);
}

/*
    添加扩散效果扫描线
    viewer
    cartographicCenter 扫描中心
    radius  半径 米
    scanColor 扫描颜色
    duration 持续时间 毫秒
*/
function addCircleScanPostStage(viewer: any, cartographicCenter: any, maxRadius: any, scanColor: any, duration: any) {
    const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    const _CartograhpicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartograhpicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    const _time = (new Date()).getTime();

    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();


    const ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: getScanSegmentShader(),
        uniforms: {
            u_scanCenterEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                return temp;
            },
            u_scanPlaneNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);

                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                return _scratchCartesian3Normal;
            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });

    viewer.scene.postProcessStages.add(ScanPostStage);
    return ScanPostStage;
}

//扩散效果Shader
function getScanSegmentShader() {
    // eslint-disable-next-line
    const scanSegmentShader = "\n\
                uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv,in float depth)\n\
                {\n\
                            vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                            vec4 posIncamera = czm_inverseProjection * vec4(xy,depth,1.0);\n\
                            posIncamera = posIncamera/posIncamera.w;\n\
                            return posIncamera;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point)\n\
                {\n\
                            vec3 v01 = point - planeOrigin;\n\
                            float d = dot(planeNormal,v01);\n\
                            return (point-planeNormal * d);\n\
                }\n\
                float getDepth(in vec4 depth)\n\
                {\n\
                            float z_window = czm_unpackDepth(depth);\n\
                            z_window = czm_reverseLogDepth(z_window);\n\
                            float n_range = czm_depthRange.near;\n\
                            float f_range = czm_depthRange.far;\n\
                            return (2.0 * z_window - n_range - f_range)/(f_range-n_range);\n\
                } \n\
                void main()\n\
                {\n\
                            gl_FragColor = texture2D(colorTexture,v_textureCoordinates);\n\
                            float depth = getDepth(texture2D(depthTexture,v_textureCoordinates));\n\
                            vec4 viewPos = toEye(v_textureCoordinates,depth);\n\
                            vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz,u_scanCenterEC.xyz,viewPos.xyz);\n\
                            float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                            if(dis<u_radius)\n\
                            {\n\
                                float f = 1.0-abs(u_radius - dis )/ u_radius;\n\
                                f = pow(f,4.0);\n\
                                gl_FragColor = mix(gl_FragColor,u_scanColor,f);\n\
                            }\n\
                } \n ";
    return scanSegmentShader;
}

/*
    添加雷达扫描线
    viewer
    cartographicCenter 扫描中心
    radius  半径 米
    scanColor 扫描颜色
    duration 持续时间 毫秒
*/
function addRadarScanPostStage(viewer: any, cartographicCenter: any, radius: any, scanColor: any, duration: any) {
    const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    const _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
    const _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
    const _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
    const _RotateQ = new Cesium.Quaternion();
    const _RotateM = new Cesium.Matrix3();

    const _time = (new Date()).getTime();

    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian4Center2 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();
    const _scratchCartesian3Normal1 = new Cesium.Cartesian3();

    const ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: getRadarScanShader(),
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: radius,
            u_scanLineNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                const temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                _scratchCartesian3Normal1.x = temp2.x - temp.x;
                _scratchCartesian3Normal1.y = temp2.y - temp.y;
                _scratchCartesian3Normal1.z = temp2.z - temp.z;

                const tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                return _scratchCartesian3Normal1;
            },
            u_scanColor: scanColor
        }
    });
    viewer.scene.postProcessStages.add(ScanPostStage);

    return ScanPostStage;
}
// 雷达扫描线效果Shader
function getRadarScanShader() {
    const scanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform vec3 u_scanLineNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +

        "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 v01 = testPt - ptOnLine;\n" +
        "normalize(v01);\n" +
        "vec3 temp = cross(v01, lineNormal);\n" +
        "float d = dot(temp, u_scanPlaneNormalEC);\n" +
        "return d > 0.5;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "vec3 v01 = point -planeOrigin;\n" +
        "float d = dot(planeNormal, v01) ;\n" +
        "return (point - planeNormal * d);\n" +
        "}\n" +

        "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
        "return length(tempPt - ptOnLine);\n" +
        "}\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "float z_window = czm_unpackDepth(depth);\n" +
        "z_window = czm_reverseLogDepth(z_window);\n" +
        "float n_range = czm_depthRange.near;\n" +
        "float f_range = czm_depthRange.far;\n" +
        "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
        "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
        "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
        "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
        "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
        "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
        "float twou_radius = u_radius * 2.0;\n" +
        "if(dis < u_radius)\n" +
        "{\n" +
        "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
        "f0 = pow(f0, 64.0);\n" +
        "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
        "float f = 0.0;\n" +
        "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
        "{\n" +
        "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
        "f = abs(twou_radius -dis1) / twou_radius;\n" +
        "f = pow(f, 3.0);\n" +
        "}\n" +
        "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
        "}\n" +
        "}\n";
    return scanSegmentShader;
}


// --------------------------------------------------------------------

// 添加geojson数据
export const addGeoJsonData = (viewer: any) => {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/shenzhengJson.json', {
        clampToGround: true,
        stroke: Cesium.Color.BLUE,
        strokeWidth: 1,
        markerSymbol: '?'
    }));
}

// 添加修改场景参数
export const updateScenePara = (viewer: any) => {
    const viewModel = {
        show: true,
        glowOnly: false,
        contrast: 128,
        brightness: -0.3,
        delta: 1.0,
        sigma: 3.78,
        stepSize: 5.0,
    };
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = Boolean(viewModel.show);
    bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly);
    bloom.uniforms.contrast = Number(viewModel.contrast);
    bloom.uniforms.brightness = Number(viewModel.brightness);
    bloom.uniforms.delta = Number(viewModel.delta);
    bloom.uniforms.sigma = Number(viewModel.sigma);
    bloom.uniforms.stepSize = Number(viewModel.stepSize);
}

// 缩放到指定位置
export const setExtent = (viewer: any) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 添加building
export const addBuilding = (viewer: any, buildingUrl: string) => {
    let entity = viewer.entities.add({
        name: "plane",
        position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 1300.0),
        model: {
            uri: "./Models/building.glb",
        }
    });
    //设置摄像头定位到模型处
    viewer.trackedEntity = entity;
}

// 添加发光的线
export const addGlowPolyLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    // 线纹理
    const lineEntity = new Cesium.Entity({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 10,
            // 发光纹理
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                taperPower: 0.9,
                // color: Cesium.Color.BLUE,
            })
        }
    })

    viewer.entities.add(lineEntity);
}

// 添加流动的线
export const addFlowLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 6,
            // 流动纹理
            // material: new Cesium.PolylineTrailLinkMaterialProperty({
            //     // color: Cesium.Color.CRIMSON,
            //     color: Cesium.Color.WHITE,
            //     duration: 5000,
            //     d: 1
            // })
        }
    });
}


// 添加几何体
interface IPostion {
    longitude: number,
    latitude: number
    height?: number
}
function computeCircle(radius: number) {
    const positions = [];
    for (let i = 0; i < 360; i++) {
        const radians = Cesium.Math.toRadians(i);
        positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
}
export const addGeometry = (viewer: any, type: string, postion: IPostion) => {
    if (!viewer) return;

    // 箱子纹理
    const boxEntity = new Cesium.Entity({
        id: "boxID01",
        name: 'Red box with black outline',
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
        box: {
            dimensions: new Cesium.Cartesian3(40, 30, 50),
            // 颜色材质
            // material: Cesium.Color.RED.withAlpha(0.5),
            // 图像材质
            // material: new Cesium.ImageMaterialProperty({
            //     image: './Models/image/test.png',
            //     color: Cesium.Color.BLUE,
            //     repeat: new Cesium.Cartesian2(4, 4)
            // }),
            // 黑白棋盘材质
            // material: new Cesium.CheckerboardMaterialProperty({
            //     evenColor:Cesium.Color.WHITE,
            //     oddColor: Cesium.Color.BLACK,
            //     repeat: new Cesium.Cartesian2(4, 4)
            // }),
            // 条纹纹理
            // material: new Cesium.StripeMaterialProperty({
            //     evenColor: Cesium.Color.WHITE,
            //     oddColor: Cesium.Color.BLACK,
            //     repeat: 32,
            //     offset: 20,
            //     orientation: Cesium.StripeOrientation.VERTICAL
            // }),

            // 网格纹理
            // material: new Cesium.GridMaterialProperty({
            //     color: Cesium.Color.YELLOW,
            //     cellAlpha: 0.2,
            //     lineCount: new Cesium.Cartesian2(8, 8),
            //     lineThickness: new Cesium.Cartesian2(2.0, 2.0)
            // }),

            // 渐变纹理
            material: new Cesium.ImageMaterialProperty({
                image: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
                transparent: true,
            }),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });

    // 线纹理
    const lineEntity = new Cesium.Entity({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52,
                113.91, 22.53]),
            width: 5,
            // material: Cesium.Color.RED
            // 发光纹理
            // material: new Cesium.PolylineGlowMaterialProperty({
            //     glowPower : 0.2,
            //     color : Cesium.Color.BLUE
            // })
            // border纹理
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 3,
                outlineColor: Cesium.Color.BLACK
            })
        }
    })

    // 动态纹理
    const tubeEntity = new Cesium.Entity({
        name: 'Red tube with rounded corners',
        polylineVolume: {
            positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52, 113.904, 22.483]),
            shape: computeCircle(60.0),
            //颜色回调
            material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                return Cesium.Color.fromRandom({
                    minimumRed: 0.75,
                    minimumGreen: 0.75,
                    minimumBlue: 0.75,
                    alpha: 1.0
                });
            }, false))
        }
    })
    viewer.entities.add(tubeEntity);

    // 贴地线1---修改声明文件
    // const baseLine = new Cesium.Entity({
    //     corridor: {
    //         // positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52,
    //         //     113.91, 22.53]),
    //         positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52, 113.904, 22.483]),
    //         width: 5,
    //     }
    // })
    // viewer.entities.add(baseLine);

    // 贴地线2--转为json文件--不成功
    // viewer.dataSources.add(Cesium.GeoJsonDataSource.load('http://localhost:1234/lesson07/pwt1/line.json', {
    //     clampToGround: true
    // }));


    // 贴地线3---成功
    // viewer.scene.primitives.add(new Cesium.GroundPrimitive({
    //     geometryInstances: new Cesium.GeometryInstance({
    //         geometry: new Cesium.CorridorGeometry({
    //             vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
    //             positions: Cesium.Cartesian3.fromDegreesArray([
    //                 113.91, 22.52,
    //                 113.904, 22.483                  
    //             ]),
    //             width: 10
    //         }),
    //         attributes: {
    //             color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.3, 0.9, 0.5))
    //         }
    //     }),
    //     classificationType: Cesium.ClassificationType.TERRAIN
    // }));


    // 线纹理
    viewer.entities.add(boxEntity);
    viewer.entities.add(lineEntity);


}


// 2020-12-21 粉刷匠 添加画图工具中的，添加点线面
let handler: any = null;
export const addCustomGeometry = (viewer: any, type: string) => {
    if (!viewer) return;
    if (type === "Point") {
        addPoint(viewer, handler);
    } else if (type === "Polyline") {
        addPolyline(viewer, handler);
    } else if (type === "Polygon") {
        addPolygon(viewer, handler);
    }
}

// 添加点标注
const addPoint = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    let positions: any = [];
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        positions.push(cartesian);

        viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
            label: {
                text: "Point" + positions.length,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement: any) => {
        handler && handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// 添加线
const addPolyline = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let poly: any = null;
    let cartesian: any = null;
    let floatingPoint: any = null;
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件 
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击--取消操作
    handler.setInputAction((movement: any) => {
        handler && handler.destroy();
        positions.pop(); // 最后一个点无效
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 10,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

}

// 添加面
const addPolygon = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    // 鼠标事件
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        floatingPoint = viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        handler.destroy();
        positions.pop();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

}


// 添加测距 or 测量面积
export const addMeasureTool = (viewer: any, type: any) => {
    if (!viewer) return;
    if (handler) { handler && handler.destroy(); }

    if (type === "distance") {
        measureLineSpace(viewer, handler);
    } else if (type === "area") {
        measureAreaSpace(viewer, handler);
    }

}



// 测量空间直线距离
export const measureLineSpace = (viewer: any, handler: any) => {

    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let poly: any = null;
    let distance: any = 0;
    let cartesian: any = null;
    let floatingPoint: any = null;
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件 
    handler.setInputAction((movement: any) => {

        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                // cartesian.y += (1 + Math.random());
                positions.push(cartesian);
            }
            distance = getSpaceDistance(positions);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        let textDisance = distance + "米";
        floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
            label: {
                text: textDisance,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击--取消操作
    handler.setInputAction((movement: any) => {
        handler.destroy(); //关闭事件句柄
        positions.pop(); //最后一个点无效

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 10,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

    //空间两点距离计算函数
    function getSpaceDistance(positions: any) {
        let distance = 0;
        for (let i = 0; i < positions.length - 1; i++) {

            const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            const geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            let s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
    }
}

// 测量空间面积 
export const measureAreaSpace = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    // 鼠标事件
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        floatingPoint = viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        handler.destroy();
        positions.pop();
        const textArea = getArea(tempPoints) + "平方公里";
        viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            label: {
                text: textArea,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -40),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    let radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
    let degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

    // 计算多边形面积
    function getArea(points: any) {

        let res = 0;
        //拆分三角曲面

        for (let i = 0; i < points.length - 2; i++) {
            let j = (i + 1) % points.length;
            let k = (i + 2) % points.length;
            let totalAngle = Angle(points[i], points[j], points[k]);


            let dis_temp1 = distance(positions[i], positions[j]);
            let dis_temp2 = distance(positions[j], positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
            console.log(res);
        }


        return (res / 1000000.0).toFixed(4);
    }

    /* 角度 */
    function Angle(p1: any, p2: any, p3: any) {
        let bearing21 = Bearing(p2, p1);
        let bearing23 = Bearing(p2, p3);
        let angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /* 方向 */
    function Bearing(from: any, to: any) {
        let lat1 = from.lat * radiansPerDegree;
        let lon1 = from.lon * radiansPerDegree;
        let lat2 = to.lat * radiansPerDegree;
        let lon2 = to.lon * radiansPerDegree;
        let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();



    function distance(point1: any, point2: any) {
        let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /** 根据经纬度计算出距离 **/
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        let s = geodesic.surfaceDistance;
        // console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        // 返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }
}


// 获取颜色渐变条带
const getColorRamp = (elevationRamp: any, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 1;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    const values = elevationRamp;
    const grd = ctx.createLinearGradient(0, 0, 0, 100);
    // grd.addColorStop(values[0], '#000000'); //black
    // grd.addColorStop(values[1], '#2747E0'); //blue
    // grd.addColorStop(values[2], '#D33B7D'); //pink
    // grd.addColorStop(values[3], '#D33038'); //red
    // grd.addColorStop(values[4], '#FF9742'); //orange
    // grd.addColorStop(values[5], '#ffd700'); //yellow
    grd.addColorStop(values[5], 'transparent'); //yellow
    grd.addColorStop(values[6], '#ffffff'); //white

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    return ramp;
}


// 调整位置，贴地
export const makeModelBaseLand = (tileset: any) => {
    // 创建平移矩阵
    const transition = Cesium.Cartesian3.fromArray([0, 0, 60]);
    const m = Cesium.Matrix4.fromTranslation(transition);
    tileset._modelMatrix = m;
}

// 调节高度
export const changeHeight = (tileset: any, height: any) => {
    height = Number(height);
    if (isNaN(height)) {
        return;
    }
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}


// 添加webmapTileServiceImageryProvider
export const addWebMapTileService = (viewer: any, url: string) => {
    const shadedRelief1 = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
        layer: 'USGSShadedReliefOnly',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
        maximumLevel: 19,
        credit: new Cesium.Credit('U. S. Geological Survey')
    });
    viewer.imageryLayers.addImageryProvider(shadedRelief1);
}

// 移除imagelayer
export const removeImageryLayer = (viewer: any, layer: any) => {
    if (!viewer || !layer) return
    viewer.imageryLayers.remove(layer);
}


