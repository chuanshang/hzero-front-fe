module.exports = [
  /**
   * 资产组
   */
  {
    path: '/aafm/assetSet',
    models: ['aafm/assetSet'],
    // 资产组列表
    components: [
      {
        path: '/aafm/assetSet/list',
        models: ['aafm/assetSet'],
        component: 'aafm/AssetSet/',
      },
      // 资产组详情
      {
        path: '/aafm/assetSet/detail/:id',
        models: ['aafm/assetSet'],
        component: 'aafm/AssetSet/Detail',
      },
      // 资产组创建
      {
        path: '/aafm/assetSet/create',
        models: ['aafm/assetSet'],
        component: 'aafm/AssetSet/Detail',
      },
    ],
  },
  /**
   * 资产专业管理
   */
  {
    path: '/aafm/asset-specialty',
    models: ['aafm/assetSpecialty'],
    // 资产专业管理列表
    components: [
      {
        path: '/aafm/asset-specialty/list',
        models: ['aafm/assetSpecialty'],
        component: 'aafm/AssetSpecialty/List',
      },
      // 资产专业管理详情
      {
        path: '/aafm/asset-specialty/detail/:id',
        models: ['aafm/assetSpecialty'],
        component: 'aafm/AssetSpecialty/Detail',
      },
      // 资产专业管理创建
      {
        path: '/aafm/asset-specialty/create',
        models: ['aafm/assetSpecialty'],
        component: 'aafm/AssetSpecialty/Detail',
      },
    ],
  },
  /**
   * 资产状态
   */
  {
    path: '/aafm/asset-status',
    models: ['aafm/assetStatus'],
    // 资产状态列表
    components: [
      {
        path: '/aafm/asset-status',
        models: ['aafm/assetStatus'],
        component: 'aafm/AssetStatus/',
      },
    ],
  },
  /**
   * 属性组
   */
  {
    path: '/aafm/attribute-set',
    models: ['aafm/attributeSet'],
    // 属性组列表
    components: [
      {
        path: '/aafm/attribute-set/list',
        models: ['aafm/attributeSet'],
        component: 'aafm/AttributeSet/',
      },
      // 属性组详情
      {
        path: '/aafm/attribute-set/detail/:id',
        models: ['aafm/attributeSet'],
        component: 'aafm/AttributeSet/Detail',
      },
      // 属性组创建
      {
        path: '/aafm/attribute-set/create',
        models: ['aafm/attributeSet'],
        component: 'aafm/AttributeSet/Detail',
      },
    ],
  },
  /**
   * 动态字段
   */
  {
    path: '/aafm/dynamic-column',
    models: ['aafm/dynamicColumn'],
    // 动态字段列表
    components: [
      {
        path: '/aafm/dynamic-column/list',
        models: ['aafm/dynamicColumn'],
        component: 'aafm/DynamicColumn/',
      },
    ],
  },
  /**
   * 设备/资产
   */
  {
    path: '/aafm/equipment-asset',
    models: ['aafm/equipmentAsset'],
    // 设备/资产列表
    components: [
      {
        path: '/aafm/equipment-asset/list',
        models: ['aafm/equipmentAsset'],
        component: 'aafm/EquipmentAsset/',
      },
      // 设备/资产详情
      {
        path: '/aafm/equipment-asset/detail/:assetId',
        models: ['aafm/equipmentAsset'],
        component: 'aafm/EquipmentAsset/Detail',
      },
      // 设备/资产创建
      {
        path: '/aafm/equipment-asset/create',
        models: ['aafm/equipmentAsset'],
        component: 'aafm/EquipmentAsset/Detail',
      },
    ],
  },
  /**
   * 产品类别
   */
  {
    path: '/aafm/product-category',
    models: ['aafm/productCategory'],
    // 产品类别列表
    components: [
      {
        path: '/aafm/product-category/list',
        models: ['aafm/productCategory'],
        component: 'aafm/ProductCategory/',
      },
    ],
  },
  /**
   * 资产事务处理类型
   */
  {
    path: '/aafm/transaction-type',
    models: ['aafm/transactionTypes'],
    // 资产事务处理类型列表
    components: [
      {
        path: '/aafm/transaction-type/list',
        models: ['aafm/transactionTypes'],
        component: 'aafm/TransactionTypes/',
      },
      // 资产事务处理类型详情
      {
        path: '/aafm/transaction-type/detail/:id',
        models: ['aafm/transactionTypes'],
        component: 'aafm/TransactionTypes/Detail',
      },
      // 资产事务处理类型创建
      {
        path: '/aafm/transaction-type/create',
        models: ['aafm/transactionTypes'],
        component: 'aafm/TransactionTypes/Detail',
      },
    ],
  },
  /**
   * 资产移交归还单
   */
  {
    path: '/aatn/asset-handover',
    models: ['aatn/assetHandover'],
    // 资产移交归还单列表
    components: [
      {
        path: '/aatn/asset-handover/list',
        models: ['aatn/assetHandover'],
        component: 'aatn/AssetHandover/',
      },
      // 资产移交归还单详情
      {
        path: '/aatn/asset-handover/detail/:id',
        models: ['aatn/assetHandover'],
        component: 'aatn/AssetHandover/Detail',
      },
      // 资产移交归还单创建
      {
        path: '/aatn/asset-handover/create',
        models: ['aatn/assetHandover'],
        component: 'aatn/AssetHandover/Detail',
      },
    ],
  },
  /**
   * 资产移交归还单处理
   */
  {
    path: '/aatn/execute-asset-handover',
    models: ['aatn/executeAssetHandover'],
    // 资产移交归还单处理列表
    components: [
      {
        path: '/aatn/execute-asset-handover/list',
        models: ['aatn/executeAssetHandover'],
        component: 'aatn/ExecuteAssetHandover/',
      },
    ],
  },
  /**
   * 调拨转移单
   */
  {
    path: '/aatn/transfer-order',
    models: ['aatn/transferOrder'],
    // 调拨转移单列表
    components: [
      {
        path: '/aatn/transfer-order/list',
        models: ['aatn/transferOrder'],
        component: 'aatn/TransferOrder/List',
      },
      // 调拨转移单详情
      {
        path: '/aatn/transfer-order/detail/:transferHeaderId',
        models: ['aatn/transferOrder'],
        component: 'aatn/TransferOrder/Detail',
      },
      // 调拨转移单创建
      {
        path: '/aatn/transfer-order/create',
        models: ['aatn/transferOrder'],
        component: 'aatn/TransferOrder/Detail',
      },
    ],
  },
  /**
   * 调拨转移单  入口&处理
   */
  {
    path: '/aatn/transfer-order-handle',
    models: ['aatn/transferOrder'],
    // 调拨转移单处理列表
    components: [
      {
        path: '/aatn/transfer-order-handle/list',
        models: ['aatn/transferOrder'],
        component: 'aatn/TransferOrderHandle/List',
      },
    ],
  },
  /**
   * 资产处置单
   */
  {
    path: '/aatn/dispose-order',
    models: ['aatn/disposeOrder'],
    // 资产处置单列表
    components: [
      {
        path: '/aatn/dispose-order/list',
        models: ['aatn/disposeOrder'],
        component: 'aatn/DisposeOrder/List',
      },
      // 资产处置单详情
      {
        path: '/aatn/dispose-order/detail/:disposeHeaderId',
        models: ['aatn/disposeOrder'],
        component: 'aatn/DisposeOrder/Detail',
      },
      // 资产处置单创建
      {
        path: '/aatn/dispose-order/create',
        models: ['aatn/disposeOrder'],
        component: 'aatn/DisposeOrder/Detail',
      },
    ],
  },
  /**
   * 资产处置单  入口&处理
   */
  {
    path: '/aatn/dispose-order-handle',
    models: ['aatn/disposeOrder'],
    // 资产处置单处理列表
    components: [
      {
        path: '/aatn/dispose-order-handle/list',
        models: ['aatn/disposeOrder'],
        component: 'aatn/DisposeOrderHandle/List',
      },
    ],
  },
  /**
   * 资产报废单
   */
  {
    path: '/aatn/asset-scrap',
    models: ['aatn/assetScrap'],
    // 资产报废单列表
    components: [
      {
        path: '/aatn/asset-scrap/list',
        models: ['aatn/assetScrap'],
        component: 'aatn/AssetScrap/',
      },
      // 资产报废单详情
      {
        path: '/aatn/asset-scrap/detail/:id',
        models: ['aatn/assetScrap'],
        component: 'aatn/AssetScrap/Detail',
      },
      // 资产报废单创建
      {
        path: '/aatn/asset-scrap/create',
        models: ['aatn/assetScrap'],
        component: 'aatn/AssetScrap/Detail',
      },
    ],
  },
  /**
   * 资产报废单处理
   */
  {
    path: '/aatn/asset-scrap-dispose',
    models: ['aatn/assetScrapDispose'],
    // 资产报废单处理列表
    components: [
      {
        path: '/aatn/asset-scrap-dispose',
        models: ['aatn/assetScrapDispose'],
        component: 'aatn/AssetScrapDispose/',
      },
    ],
  },
  /**
   * 资产状态变更单
   */
  {
    path: '/aatn/asset-status-change',
    models: ['aatn/assetStatusChange'],
    // 资产状态变更单列表
    components: [
      {
        path: '/aatn/asset-status-change/list',
        models: ['aatn/assetStatusChange'],
        component: 'aatn/AssetStatusChange/',
      },
      // 资产状态变更单详情
      {
        path: '/aatn/asset-status-change/detail/:id',
        models: ['aatn/assetStatusChange'],
        component: 'aatn/AssetStatusChange/Detail',
      },
      // 资产状态变更单创建
      {
        path: '/aatn/asset-status-change/create',
        models: ['aatn/assetStatusChange'],
        component: 'aatn/AssetStatusChange/Detail',
      },
    ],
  },
  /**
   * 资产状态变更单处理
   */
  {
    path: '/aatn/execute-asset-status-change',
    models: ['aatn/executeAssetStatusChange'],
    // 资产状态变更单处理列表
    components: [
      {
        path: '/aatn/execute-asset-status-change/',
        models: ['aatn/executeAssetStatusChange'],
        component: 'aatn/ExecuteAssetStatusChange/',
      },
    ],
  },
  /**
   * 固定资产
   */
  {
    path: '/afam/fixed-assets',
    models: ['afam/fixedAssets'],
    // 固定资产列表
    components: [
      {
        path: '/afam/fixed-assets/list',
        models: ['afam/fixedAssets'],
        component: 'afam/FixedAssets/',
      },
      // 固定资产详情
      {
        path: '/afam/fixed-assets/detail/:fixedAssetId',
        models: ['afam/fixedAssets'],
        component: 'afam/FixedAssets/Detail',
      },
      // 固定资产创建
      {
        path: '/afam/fixed-assets/create',
        models: ['afam/fixedAssets'],
        component: 'afam/FixedAssets/Detail',
      },
    ],
  },
  /**
   * 资产状态变更单处理
   */
  {
    path: '/afam/asset-catalog',
    models: ['afam/assetCatalog'],
    // 资产状态变更单处理列表
    components: [
      {
        path: '/afam/asset-catalog/',
        models: ['afam/assetCatalog'],
        component: 'afam/AssetCatalog/',
      },
    ],
  },
  /**
   * 验收单类型
   */
  {
    path: '/arcv/acceptance-type',
    models: ['arcv/acceptanceType'],
    // 验收单类型列表
    components: [
      {
        path: '/arcv/acceptance-type/list',
        models: ['arcv/acceptanceType'],
        component: 'arcv/AcceptanceType/List',
      },
      // 验收单类型详情
      {
        path: '/arcv/acceptance-type/detail/:id',
        models: ['arcv/acceptanceType'],
        component: 'arcv/AcceptanceType/Detail',
      },
      // 验收单类型创建
      {
        path: '/arcv/acceptance-type/create',
        models: ['arcv/acceptanceType'],
        component: 'arcv/AcceptanceType/Detail',
      },
    ],
  },
  /**
   * 验收单
   */
  {
    path: '/arcv/acceptance',
    models: ['arcv/acceptance'],
    // 验收单列表
    components: [
      {
        path: '/arcv/acceptance/list',
        models: ['arcv/acceptance'],
        component: 'arcv/Acceptance/',
      },
      // 验收单详情
      {
        path: '/arcv/acceptance/detail/:id',
        models: ['arcv/acceptance'],
        component: 'arcv/Acceptance/Detail',
      },
      // 验收单创建
      {
        path: '/arcv/acceptance/create',
        models: ['arcv/acceptance'],
        component: 'arcv/Acceptance/Detail',
      },
    ],
  },
  /**
   * 交付清单行
   */
  {
    path: '/arcv/delivery-list',
    models: ['arcv/deliveryList'],
    // 交付清单行列表
    components: [
      {
        path: '/arcv/delivery-list/list',
        models: ['arcv/deliveryList'],
        component: 'arcv/DeliveryList/',
      },
      // 交付清单行详情
      {
        path: '/arcv/delivery-list/detail/:id',
        models: ['arcv/deliveryList'],
        component: 'arcv/DeliveryList/Detail',
      },
      // 交付清单行创建
      {
        path: '/arcv/delivery-list/create',
        models: ['arcv/deliveryList'],
        component: 'arcv/DeliveryList/Detail',
      },
    ],
  },
  /**
   * 服务区域
   */
  {
    path: '/amdm/maint-sites',
    models: ['amdm/maintSites'],
    components: [
      // 服务区域列表
      {
        path: '/amdm/maint-sites/list',
        models: ['amdm/maintSites'],
        component: 'amdm/MaintSites/List',
      },
      // 服务区域详情
      {
        path: '/amdm/maint-sites/detail/:maintSitesId',
        models: ['amdm/maintSites'],
        component: 'amdm/MaintSites/Detail',
      },
    ],
  },
  /**
   * 位置
   */
  {
    path: '/amdm/location',
    models: ['amdm/location'],
    components: [
      // 位置列表
      {
        path: '/amdm/location/list',
        models: ['amdm/location'],
        component: 'amdm/Location/',
      },
      // 位置创建
      {
        path: '/amdm/location/create',
        models: ['amdm/location'],
        component: 'amdm/Location/Detail',
      },
      // 位置详情
      {
        path: '/amdm/location/detail/:id',
        models: ['amdm/location'],
        component: 'amdm/Location/Detail',
      },
      {
        path: '/amdm/location/create-sub/:id',
        models: ['amdm/location'],
        component: 'amdm/Location/Detail',
      },
    ],
  },
  /**
   * 组织
   */
  {
    path: '/amdm/organization',
    models: ['amdm/organization'],
    components: [
      // 组织列表
      {
        path: '/amdm/organization/list',
        models: ['amdm/organization'],
        component: 'amdm/Organization/',
      },
      // 组织创建
      {
        path: '/amdm/organization/create',
        models: ['amdm/organization'],
        component: 'amdm/Organization/Detail',
      },
      // 组织详情
      {
        path: '/amdm/organization/detail/:id',
        models: ['amdm/organization'],
        component: 'amdm/Organization/Detail',
      },
      {
        path: '/amdm/organization/create-sub/:id',
        models: ['amdm/organization'],
        component: 'amdm/Organization/Detail',
      },
    ],
  },
  /**
   * 物料
   */
  {
    path: '/ammt/materials',
    models: ['ammt/materials'],
    components: [
      // 物料列表
      {
        path: '/ammt/materials/list',
        models: ['ammt/materials'],
        component: 'ammt/Materials/',
      },
      // 物料创建
      {
        path: '/ammt/materials/create',
        models: ['ammt/materials'],
        component: 'ammt/Materials/Detail',
      },
      // 物料详情
      {
        path: '/ammt/materials/detail/:id',
        models: ['ammt/materials'],
        component: 'ammt/Materials/Detail',
      },
    ],
  },
  /**
   * 物料类别
   */
  {
    path: '/ammt/materials-category',
    models: ['ammt/materialsCategory'],
    components: [
      // 物料类别列表
      {
        path: '/ammt/materials-category/list',
        models: ['ammt/materialsCategory'],
        component: 'ammt/MaterialsCategory/',
      },
    ],
  },
  /**
   * 物料事务类型
   */
  {
    path: '/ammt/material_ts_type',
    models: ['ammt/materialTsType'],
    components: [
      // 物料事务类型列表
      {
        path: '/ammt/material_ts_type/list',
        models: ['ammt/materialTsType'],
        component: 'ammt/MaterialTsType/',
      },
      // 物料事务类型创建
      {
        path: '/ammt/material_ts_type/create',
        models: ['ammt/materialTsType'],
        component: 'ammt/MaterialTsType/Detail',
      },
      // 物料事务类型详情
      {
        path: '/ammt/material_ts_type/detail/:id',
        models: ['ammt/materialTsType'],
        component: 'ammt/MaterialTsType/Detail',
      },
    ],
  },
  /**
   * 物料事务处理批
   */
  {
    path: '/ammt/material_ts_Multi',
    models: ['ammt/materialTsMulti'],
    components: [
      // 物料事务处理批列表
      {
        path: '/ammt/material_ts_Multi/list',
        models: ['ammt/materialTsMulti'],
        component: 'ammt/MaterialTsMulti/',
      },
      // 物料事务处理批创建
      {
        path: '/ammt/material_ts_Multi/create',
        models: ['ammt/materialTsMulti'],
        component: 'ammt/MaterialTsMulti/Detail',
      },
      // 物料事务处理批详情
      {
        path: '/ammt/material_ts_Multi/detail/:id',
        models: ['ammt/materialTsMulti'],
        component: 'ammt/MaterialTsMulti/Detail',
      },
    ],
  },
  /**
   * 工单管理
   */
  {
    path: '/amtc/work-order',
    models: ['amtc/workOrder'],
    components: [
      // 工单管理列表
      {
        path: '/amtc/work-order/list',
        models: ['amtc/workOrder'],
        component: 'amtc/WorkOrder/',
      },
      // 工单管理创建
      {
        path: '/amtc/work-order/create',
        models: ['amtc/workOrder'],
        component: 'amtc/WorkOrder/Detail',
      },
      // 工单管理详情
      {
        path: '/amtc/work-order/detail/:woId',
        models: [
          'amtc/workOrder',
          'amtc/woMalfunction',
          'amtc/woLabors',
          'amtc/woChecklists',
          'amtc/woChecklistGroups',
        ],
        component: 'amtc/WorkOrder/Detail',
      },
      {
        path: '/amtc/work-order/:woId/woop/detail/:id',
        models: ['amtc/woop'],
        component: 'amtc/Woop/Detail',
      },
      {
        path: '/amtc/work-order/:woId/woop/create',
        models: ['amtc/woop'],
        component: 'amtc/Woop/Detail',
      },
    ],
  },
  /**
   * 工作中心人员
   */
  {
    path: '/amtc/work-center-staff',
    models: ['amtc/workCenterStaff'],
    components: [
      // 工作中心人员列表
      {
        path: '/amtc/work-center-staff',
        models: ['amtc/workCenterStaff'],
        component: 'amtc/WorkCenterStaff/',
      },
    ],
  },
  /**
   * 标准作业
   */
  {
    path: '/amtc/act',
    models: ['amtc/act'],
    components: [
      // 标准作业列表
      {
        path: '/amtc/act/list',
        models: ['amtc/act'],
        component: 'amtc/Act/',
      },
      // 标准作业创建
      {
        path: '/amtc/act/create',
        models: ['amtc/act'],
        component: 'amtc/Act/Detail',
      },
      // 标准作业详情
      {
        path: '/amtc/act/detail/:id',
        models: ['amtc/act'],
        component: 'amtc/Act/Detail',
      },
    ],
  },
  /**
   * BOM结构清单
   */
  {
    path: '/amtc/bom',
    models: ['amtc/bom'],
    components: [
      // BOM结构清单列表
      {
        path: '/amtc/bom/list',
        models: ['amtc/bom'],
        component: 'amtc/Bom/List',
      },
      // BOM结构清单创建
      {
        path: '/amtc/bom/create',
        models: ['amtc/bom'],
        component: 'amtc/Bom/Detail',
      },
      // BOM结构清单详情
      {
        path: '/amtc/bom/detail/:id',
        models: ['amtc/bom'],
        component: 'amtc/Bom/Detail',
      },
      // BOM结构清单详情
      {
        path: '/amtc/bom/createChild/:parentId/:parentName',
        models: ['amtc/bom'],
        component: 'amtc/Bom/Detail',
      },
    ],
  },
  /**
   * 服务评价
   */
  {
    path: '/amtc/assess-templet',
    models: ['amtc/assessTemplet'],
    components: [
      // 服务评价列表
      {
        path: '/amtc/assess-templet/list',
        models: ['amtc/assessTemplet'],
        component: 'amtc/AssessTemplet/',
      },
      // 服务评价创建
      {
        path: '/amtc/assess-templet/create',
        models: ['amtc/assessTemplet'],
        component: 'amtc/AssessTemplet/Detail',
      },
      // 服务评价详情
      {
        path: '/amtc/assess-templet/detail/:id',
        models: ['amtc/assessTemplet'],
        component: 'amtc/AssessTemplet/Detail',
      },
      {
        path: '/amtc/assess-templet/templet-items/create/:id',
        models: ['amtc/assessTemplet'],
        component: 'amtc/AssessTemplet/TempletItemsDetail',
      },
      {
        path: '/amtc/assess-templet/templet-items/detail/:id',
        models: ['amtc/assessTemplet'],
        component: 'amtc/AssessTemplet/TempletItemsDetail',
      },
    ],
  },
  /**
   * 资产路线
   */
  {
    path: '/amtc/asset-route',
    models: ['amtc/assetRoute'],
    components: [
      // 资产路线列表
      {
        path: '/amtc/asset-route/list',
        models: ['amtc/assetRoute'],
        component: 'amtc/AssetRoute/',
      },
      // 资产路线创建
      {
        path: '/amtc/asset-route/create',
        models: ['amtc/assetRoute'],
        component: 'amtc/AssetRoute/Detail',
      },
      // 资产路线详情
      {
        path: '/amtc/asset-route/detail/:id',
        models: ['amtc/assetRoute'],
        component: 'amtc/AssetRoute/Detail',
      },
    ],
  },
  /**
   * 标准检查组
   */
  {
    path: '/amtc/inspect-group',
    models: ['amtc/inspectGroup'],
    components: [
      // 标准检查组列表
      {
        path: '/amtc/inspect-group/list',
        models: ['amtc/inspectGroup'],
        component: 'amtc/InspectGroup/List',
      },
      // 标准检查组创建
      {
        path: '/amtc/inspect-group/create',
        models: ['amtc/inspectGroup'],
        component: 'amtc/InspectGroup/Detail',
      },
      // 标准检查组详情
      {
        path: '/amtc/inspect-group/detail/:id',
        models: ['amtc/inspectGroup'],
        component: 'amtc/InspectGroup/Detail',
      },
      {
        path: '/amtc/inspect-group/:parentId/:from/detail/:id',
        models: ['amtc/inspectList'],
        component: 'amtc/InspectList/Detail',
      },
      {
        path: '/amtc/inspect-group/:parentId/:from/create',
        models: ['amtc/inspectList'],
        component: 'amtc/InspectList/Detail',
        // authorized: true,
      },
    ],
  },
  /**
   * 标准检查项
   */
  {
    path: '/amtc/inspect-list',
    models: ['amtc/inspectList'],
    components: [
      // 标准检查项创建
      {
        path: '/amtc/inspect-list/create',
        models: ['amtc/inspectList'],
        component: 'amtc/InspectList/Detail',
      },
      // 标准检查项详情
      {
        path: '/amtc/inspect-list/detail/:id',
        models: ['amtc/inspectList'],
        component: 'amtc/InspectList/Detail',
      },
    ],
  },
  /**
   * 故障缺陷评估项
   */
  {
    path: '/amtc/rc-assesment',
    models: ['amtc/rcAssesment'],
    components: [
      // 故障缺陷评估项列表
      {
        path: '/amtc/rc-assesment/list',
        models: ['amtc/rcAssesment'],
        component: 'amtc/RcAssesment',
      },
      // 故障缺陷评估项创建
      {
        path: '/amtc/rc-assesment/create',
        models: ['amtc/rcAssesment'],
        component: 'amtc/RcAssesment/Detail',
      },
      // 故障缺陷评估项详情
      {
        path: '/amtc/rc-assesment/detail/:id',
        models: ['amtc/rcAssesment'],
        component: 'amtc/RcAssesment/Detail',
      },
    ],
  },
  /**
   * 故障缺陷
   */
  {
    path: '/amtc/rc-systems',
    models: ['amtc/rcSystems'],
    components: [
      // 故障缺陷列表
      {
        path: '/amtc/rc-systems/list',
        models: ['amtc/rcSystems'],
        component: 'amtc/RcSystems',
      },
      // 故障缺陷创建
      {
        path: '/amtc/rc-systems/create',
        models: ['amtc/rcSystems'],
        component: 'amtc/RcSystems/Detail',
      },
      // 故障缺陷详情
      {
        path: '/amtc/rc-systems/detail/:id',
        models: ['amtc/rcSystems'],
        component: 'amtc/RcSystems/Detail',
      },
    ],
  },
  /**
   * 工序管理
   */
  {
    path: '/amtc/woop',
    models: ['amtc/woop'],
    components: [
      // 工序管理列表
      {
        path: '/amtc/woop/list',
        models: ['amtc/woop'],
        component: 'amtc/Woop',
      },
      // 工序管理详情
      {
        path: '/amtc/woop/detail/:id',
        models: ['amtc/woop'],
        component: 'amtc/Woop/Detail',
      },
    ],
  },
  /**
   * 工作中心
   */
  {
    path: '/amtc/work-center',
    models: ['amtc/workCenter'],
    components: [
      // 工作中心列表
      {
        path: '/amtc/work-center/list',
        models: ['amtc/workCenter'],
        component: 'amtc/WorkCenter',
      },
      // 工作中心创建
      {
        path: '/amtc/work-center/create',
        models: ['amtc/workCenter'],
        component: 'amtc/WorkCenter/Detail',
      },
      // 工作中心详情
      {
        path: '/amtc/work-center/detail/:id',
        models: ['amtc/workCenter'],
        component: 'amtc/WorkCenter/Detail',
      },
    ],
  },
  /**
   * 技能类型
   */
  {
    path: '/amtc/work-center-res',
    models: ['amtc/workCenterRes'],
    components: [
      // 技能类型列表
      {
        path: '/amtc/work-center-res/list',
        models: ['amtc/workCenterRes'],
        component: 'amtc/WorkCenterRes',
      },
      // 技能类型创建
      {
        path: '/amtc/work-center-res/create',
        models: ['amtc/workCenterRes'],
        component: 'amtc/WorkCenterRes/Detail',
      },
      // 技能类型详情
      {
        path: '/amtc/work-center-res/detail/:id',
        models: ['amtc/workCenterRes'],
        component: 'amtc/WorkCenterRes/Detail',
      },
    ],
  },
  /**
   * 工单类型
   */
  {
    path: '/amtc/wo-type',
    models: ['amtc/woType'],
    components: [
      // 工单类型列表
      {
        path: '/amtc/wo-type/list',
        models: ['amtc/woType'],
        component: 'amtc/WoType',
      },
      // 工单类型创建
      {
        path: '/amtc/wo-type/create',
        models: ['amtc/woType'],
        component: 'amtc/WoType/Detail',
      },
      // 工单类型详情
      {
        path: '/amtc/wo-type/detail/:id',
        models: ['amtc/woType'],
        component: 'amtc/WoType/Detail',
      },
      {
        path: '/amtc/wo-type/create-sub/:id',
        models: ['amtc/woType'],
        component: 'amtc/WoType/Detail',
      },
    ],
  },
  /**
   * 预算项设置
   */
  {
    path: '/appa/budget-item-setting',
    models: ['appa/budgetItemSetting'],
    components: [
      // 预算项设置列表
      {
        path: '/appa/budget-item-setting/list',
        models: ['appa/budgetItemSetting'],
        component: 'appa/BudgetItemSetting/',
      },
    ],
  },
  /**
   * 预算期间控制
   */
  {
    path: '/appa/budget-period',
    models: ['appa/budgetPeriod'],
    components: [
      // 预算期间控制列表
      {
        path: '/appa/budget-period/list',
        models: ['appa/budgetPeriod'],
        component: 'appa/BudgetPeriod/',
      },
    ],
  },
  /**
   * 预算类型设置
   */
  {
    path: '/appa/budget-type-setting',
    models: ['appa/budgetTypeSetting'],
    components: [
      // 预算类型设置列表
      {
        path: '/appa/budget-type-setting/list',
        models: ['appa/budgetTypeSetting'],
        component: 'appa/BudgetTypeSetting/',
      },
    ],
  },
  /**
   * 预算模板
   */
  {
    path: '/appa/budget-template',
    models: ['appa/budgetTemplate'],
    components: [
      // 预算模板列表
      {
        path: '/appa/budget-template/list',
        models: ['appa/budgetTemplate'],
        component: 'appa/BudgetTemplate/',
      },
      // 预算模板创建
      {
        path: '/appa/budget-template/create',
        models: ['appa/budgetTemplate'],
        component: 'appa/BudgetTemplate/Detail',
      },
      // 预算模板详情
      {
        path: '/appa/budget-template/detail/:templateCode',
        models: ['appa/budgetTemplate'],
        component: 'appa/BudgetTemplate/Detail',
      },
      {
        path: '/appa/budget-template/new-detail/:templateCode',
        models: ['appa/budgetTemplate'],
        component: 'appa/BudgetTemplate/Detail',
      },
      {
        path: '/appa/budget-template/history/:templateCode/:templateVersion',
        models: ['appa/budgetTemplate'],
        component: 'appa/BudgetTemplate/Detail',
      },
    ],
  },
  /**
   * 项目属性组
   */
  {
    path: '/appm/attribute-set',
    models: ['appm/attributeSet'],
    components: [
      // 项目属性组列表
      {
        path: '/appm/attribute-set/list',
        models: ['appm/attributeSet'],
        component: 'appm/AttributeSet/',
      },
      // 项目属性组创建
      {
        path: '/appm/attribute-set/create',
        models: ['appm/attributeSet'],
        component: 'appm/AttributeSet/Detail',
      },
      // 项目属性组详情
      {
        path: '/appm/attribute-set/detail/:id',
        models: ['appm/attributeSet'],
        component: 'appm/AttributeSet/Detail',
      },
    ],
  },
  /**
   * 项目基础信息
   */
  {
    path: '/appm/pro-basic-info',
    models: ['appm/proBasicInfo'],
    components: [
      // 项目基础信息列表
      {
        path: '/appm/pro-basic-info/list',
        models: ['appm/proBasicInfo'],
        component: 'appm/ProBasicInfo/',
      },
      // 项目基础信息创建
      {
        path: '/appm/pro-basic-info/create',
        models: ['appm/proBasicInfo'],
        component: 'appm/ProBasicInfo/Detail',
      },
      // 项目基础信息详情
      {
        path: '/appm/pro-basic-info/detail/:id',
        models: ['appm/proBasicInfo'],
        component: 'appm/ProBasicInfo/Detail',
      },
      // 项目预算
      {
        path: '/appm/pro-basic-info/budget/:projectId/:proBudgetId',
        models: ['appm/projectBudget'],
        component: 'appm/ProjectBudget',
      },
      // wbs计划维护
      {
        path: '/appm/pro-basic-info/wbs/:wbsHeaderId',
        models: ['appm/wbsPlanMaintain'],
        component: 'appm/WBSPlanMaintain',
      },
    ],
  },
  /**
   * 项目进度
   */
  {
    path: '/appm/project-schedule',
    models: ['appm/projectSchedule'],
    components: [
      // 项目进度列表
      {
        path: '/appm/project-schedule',
        models: ['appm/projectSchedule'],
        component: 'appm/ProjectSchedule/',
      },
    ],
  },
  /**
   * 项目类型
   */
  {
    path: '/appm/project-type',
    models: ['appm/projectType'],
    components: [
      // 项目类型列表
      {
        path: '/appm/project-type',
        models: ['appm/projectType'],
        component: 'appm/ProjectType/',
      },
    ],
  },
  /**
   * 项目状态
   */
  {
    path: '/appm/project-status',
    models: ['appm/projectStatus'],
    components: [
      // 项目状态列表
      {
        path: '/appm/project-status',
        models: ['appm/projectStatus'],
        component: 'appm/ProjectStatus/',
      },
    ],
  },
  /**
   * 项目角色
   */
  {
    path: '/appm/project-role',
    models: ['appm/projectRole'],
    components: [
      // 项目角色列表
      {
        path: '/appm/project-role',
        models: ['appm/projectRole'],
        component: 'appm/ProjectRole/',
      },
    ],
  },
  /**
   * 项目模板
   */
  {
    path: '/appm/project-template',
    models: ['appm/projectTemplate'],
    components: [
      // 项目模板列表
      {
        path: '/appm/project-template/list',
        models: ['appm/projectTemplate'],
        component: 'appm/ProjectTemplate/',
      },
      {
        path: '/appm/project-template/detail/:id',
        models: ['appm/projectTemplate'],
        component: 'appm/ProjectTemplate/Detail',
      },
      {
        path: '/appm/project-template/new-detail/:id',
        models: ['appm/projectTemplate'],
        component: 'appm/ProjectTemplate/Detail',
      },
      {
        path: '/appm/project-template/create',
        models: ['appm/projectTemplate'],
        component: 'appm/ProjectTemplate/Detail',
      },
      // WBS结构模板
      {
        path: '/appm/project-template/task/:proTemplateId',
        models: ['appm/taskTemplate'],
        component: 'appm/TaskTemplate',
      },
    ],
  },
];
