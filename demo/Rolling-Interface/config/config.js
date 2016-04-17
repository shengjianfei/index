/**
 * Created by Administrator on 2016/4/11.
 */
//每天0点数据自动更新
//显示的界面(客户案例，供应商，分销商，交易订单);图片放入img文件夹
var ChangeInterfaceTime=10*1000;        //定时界面切换时间（ms）

/*以下是交易订单滚动设置*/
var SetOrderRows=20;                       //设定每天0点开始“交易订单”行数
var SetOrderTotalRows=300;                //设定每天产生“交易订单”总行数
var Orderspeedhq=30;                      //“交易订单”表格移动速度(ms)
var Timer_addOrderRow=3*1000;            // 0---10*60*1000（ms) 时间随机增加“交易订单”行数
var AddOrderRandomRow=3;                 //1次随机增加 0--3 之间“交易订单”行数
var SetMoney=500;                         //设定单笔最大交易额

/*以下是分销商滚动设置*/
var SetResellerRow=20;                   //设定每天0点开始“分销商”行数
var SetResellerTotalRows=100;          //设定每天产生“分销商”总行数
var Resellerspeedhq=30;                 //“分销商”表格移动速度(ms)
var Timer_addResellerRow=1*1000;   // 0---30*60*1000（ms) 时间随机增加“分销商”行数
var AddResellerRandomRow=3;            //1次随机增加 0--3 之间“分销商”行数

/*以下是供应商卡片设置*/
var moveSpeed=20;                        //供应商卡片移动速度（ms)
var SetSuppliersRow=32;                 //供应商卡片总数（数量不能超过以下ImgARR数组长度）

/*以下是客户案例设置*/
var SetClientCaseRow=5;                 // 客户案例总数（数量不能超过以下ImgARR数组长度）

//ImgARR数组依次为：
// 商户二维码图片，商户标题，商户旺铺名称,商户旺铺图片。
var ImgARR= [
    ['角度潮品.jpg','角度潮品','safsaf','角度潮品phone.jpg'],
    ['起帆贸易.jpg','起帆贸易','wrwerwe','起帆贸易phone.jpg'],
    ['正雅食品.jpg','正雅食品','dfgds','正雅食品phone.jpg'],
    ['温州优派日用品.jpg','温州优派日用品','yiyuiy','温州优派日用品phone.jpg'],
    ['三羊农业生态米.jpg','三羊农业生态米','gjgfhgh','三羊农业生态米phone.jpg'],
    ['新联果蔬.jpg','新联果蔬','fsdsgg','角度潮品phone.jpg'],
    ['东片生态养殖.jpg','东片生态养殖','sfsghdfh','角度潮品phone.jpg'],
    ['潮都水产.jpg','潮都水产','sfsdsdf','角度潮品phone.jpg'],
    ['万利安儿童用品.jpg','万利安儿童用品','erteet','角度潮品phone.jpg'],
    ['茶奕宝妙溶淡香茶.jpg','茶奕宝妙溶淡香茶','wrqert','角度潮品phone.jpg'],
    ['瑞贝特母婴商城.jpg','瑞贝特母婴商城','dhjhgk','角度潮品phone.jpg'],
    ['杞熙堂枸杞.jpg','杞熙堂枸杞','ljkgfj','角度潮品phone.jpg'],
    ['肖氏酒业.jpg','肖氏酒业','ghhgghj','角度潮品phone.jpg'],
    ['舟山市铭阳水产贸易有限公司.jpg','舟山市铭阳水产贸易有限公司','eterjh','角度潮品phone.jpg'],
    ['云瑾进口商品.jpg','云瑾进口商品','safsaf','角度潮品phone.jpg'],
    ['深圳沐贵人卫浴有限公司.jpg','深圳沐贵人卫浴有限公司','gjkfg','角度潮品phone.jpg'],
    ['双蒙鹿茸专销.jpg','双蒙鹿茸专销','cxbcxb','角度潮品phone.jpg'],
    ['IWALK智能平衡车.jpg','IWALK智能平衡车','bcfgjhnf','角度潮品phone.jpg'],
    ['辉煌电器.jpg','辉煌电器','safdsf','角度潮品phone.jpg'],
    ['兰中宝产品.jpg','兰中宝产品','dgdfh','角度潮品phone.jpg'],
    ['陈昌盛食品.jpg','陈昌盛食品','hgjgf','角度潮品phone.jpg'],
    ['嘉牧生态养殖.jpg','嘉牧生态养殖','ewerdg','角度潮品phone.jpg'],
    ['秦河大闸蟹.jpg','秦河大闸蟹','mjbgfh','角度潮品phone.jpg'],
    ['富裕家禽养殖场.jpg','富裕家禽养殖场','dfgsdg','角度潮品phone.jpg'],
    ['绍兴健元保健品商行.jpg','绍兴健元保健品商行','dgsdg','角度潮品phone.jpg'],
    ['福鼎东贵白领食铺.jpg','福鼎东贵白领食铺','dgsgfg','角度潮品phone.jpg'],
    ['唐林中土黄牛.jpg','唐林中土黄牛','cgbnfg','角度潮品phone.jpg'],
    ['旭日东升农副产品.jpg','旭日东升农副产品','khjhj','角度潮品phone.jpg'],
    ['锦源水产.jpg','锦源水产','vcnvb','角度潮品phone.jpg'],
    ['金鸢睿沐贸易.jpg','金鸢睿沐贸易','xvcxcz','角度潮品phone.jpg'],
    ['高根枇杷.jpg','高根枇杷','rdgds','角度潮品phone.jpg'],
    ['田和农业.jpg','田和农业','bnvcb','角度潮品phone.jpg'],
    ['澳泰食品.jpg','澳泰食品','etwreer','角度潮品phone.jpg'],
    ['广明生态园.jpg','广明生态园','hjkhj','角度潮品phone.jpg'],
    ['休闲瑜伽馆.jpg','休闲瑜伽馆','vbnvbn','角度潮品phone.jpg'],
    ['章圣科山羊.jpg','章圣科山羊','oiupoiu','角度潮品phone.jpg'],
    ['中湖果园.jpg','中湖果园','xcvzxzv','角度潮品phone.jpg'],
    ['鸭司令禽蛋.jpg','鸭司令禽蛋','nvbnvc','角度潮品phone.jpg'],
    ['宝积预混料.jpg','宝积预混料','hyter','角度潮品phone.jpg'],
    ['德源稻米.jpg','德源稻米','nfghdfk','角度潮品phone.jpg'],
    ['际恒食品.jpg','际恒食品','vcbnn','角度潮品phone.jpg'],
    ['啊文纯野味甲鱼.jpg','啊文纯野味甲鱼','mnbcv','角度潮品phone.jpg'],
    ['石宅山羊.jpg','石宅山羊','yuiyt','角度潮品phone.jpg'],
    ['生态土鸡.jpg','生态土鸡','ertwer','角度潮品phone.jpg'],
    ['以诺服饰.jpg','以诺服饰','ghfghfg','角度潮品phone.jpg'],
    ['绿谷农家.jpg','绿谷农家','vbncv','角度潮品phone.jpg'],
    ['杨光草莓.jpg','杨光草莓','cbbfg','角度潮品phone.jpg'],
    ['森野特禽.jpg','森野特禽','dsgfgdfg','角度潮品phone.jpg'],
    ['宏旺食品.jpg','宏旺食品','iopiu','角度潮品phone.jpg'],
    ['双珍堂药业.jpg','双珍堂药业','dgsg','角度潮品phone.jpg'],
    ['浩博舟山海鲜.jpg','浩博舟山海鲜','vbncv','角度潮品phone.jpg'],
    ['淮湘怪味鸭脖.jpg','淮湘怪味鸭脖','dsfgg','角度潮品phone.jpg'],
    ['竹海山圣.jpg','竹海山圣','ewewert','角度潮品phone.jpg'],
    ['恋上你的味道.jpg','恋上你的味道','dgdsgg','角度潮品phone.jpg'],
    ['盛通食用菌 灰树花之乡.jpg','盛通食用菌 灰树花之乡','cvbcvzx','角度潮品phone.jpg'],
    ['千嘉味食品.jpg','千嘉味食品','gsdasg','角度潮品phone.jpg'],
    ['太湖人家清水大闸蟹.jpg','太湖人家清水大闸蟹','xzcvx','角度潮品phone.jpg'],
    ['柳洋草酒庄.jpg','柳洋草酒庄','iouty','角度潮品phone.jpg']
];
