/**
 * Engine Version 5.0 组件库
 * build by lijj 2019-01-02
 */
export const EngineElements = [
    /*DataSources*/
    {
        key: "V5.DataSource.Json",
        remark: "静态JSON数据源",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Content", type: "json", remark: "Json数据内容", value: "" }
        ]
    },
    {
        key: "V5.DataSource.Sql",
        remark: "tsql数据源",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            /*
            {
              key: "Type",
              type: "select",
              remark: "类型",
              options: ["SqlServer", "MySql", "Oracle"]
            },
            { key: "ConnectString", type: "textarea", remark: "连接字符串" },
            */
            { key: "Content", type: "tsql", remark: "Sql语句", value: "" },
            { key: "InitLoad", type: "checkbox", remark: "首次加载", value: true }
        ]
    },
    /*
    {
        key: "V5.DataSource.Http",
        remark: "http数据源",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Url", type: "text", remark: "请求地址" },
            {
                key: "Method",
                type: "select",
                remark: "请求方式",
                options: ["get", "post"]
            },
            { key: "Params", type: "textarea", remark: "参数" },
            { key: "InitLoad", type: "checkbox", remark: "首次加载", value: true }
        ]
    },
    */
    /*Events*/
    {
        key: "V5.Event.OnLoad",
        remark: "页面加载触发事件",
        props: [{ key: "ActionId", type: "action", remark: "指定动作" }]
    },
    {
        key: "V5.Event.OnInterval",
        remark: "周期性触发事件",
        props: [
            { key: "ActionId", type: "action", remark: "指定动作" },
            { key: "Interval", type: "number", remark: "执行间隔(毫秒)", value: 5000 }
        ]
    },
    /*Actions*/
    {
        key: "V5.Action.LoadDataAction",
        remark: "加载数据",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "DataSourceId", type: "data", remark: "数据源Id" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.SubmitFormAction",
        remark: "提交表单",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "FormId", type: "form", remark: "指定表单" },
            { key: "DataSourceId", type: "data", remark: "数据源Id" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.ClearFormAction",
        remark: "清空表单",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "FormId", type: "form", remark: "指定表单" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.OpenWindowAction",
        remark: "打开窗口",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "WindowId", type: "window", remark: "指定窗口" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.CloseWindowAction",
        remark: "关闭窗口",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "WindowId", type: "window", remark: "指定窗口" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.AlertAction",
        remark: "提示消息",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Title", type: "text", remark: "标题" },
            { key: "Message", type: "textarea", remark: "信息" },
            { key: "OnOk", type: "action", remark: "点确动作" }
        ]
    },
    {
        key: "V5.Action.ConfirmAction",
        remark: "确认消息",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            { key: "Title", type: "text", remark: "标题" },
            { key: "Message", type: "textarea", remark: "信息" },
            { key: "OnOk", type: "action", remark: "确认动作" },
            { key: "OnCancel", type: "action", remark: "取消动作" }
        ]
    },
    {
        key: "V5.Action.OpenAction",
        remark: "打开页面",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Url", type: "text", remark: "地址" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    {
        key: "V5.Action.RedirectAction",
        remark: "重定向页面",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            { key: "Url", type: "text", remark: "地址" },
            { key: "NextActionId", type: "action", remark: "下一动作" }
        ]
    },
    /*Views*/
    {
        key: "V5.View.Row",
        remark: "布局行元素",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            { key: "CssStyle", type: "textarea", remark: "Css样式" }
        ],
        childs: ["V5.View.Col"]
    },
    {
        key: "V5.View.Col",
        remark: "布局列元素",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            {
                key: "Span",
                type: "number",
                remark: "列宽1-24",
                value: 24
            },
            { key: "CssStyle", type: "textarea", remark: "Css样式" }
        ],
        childs: [
            "V5.View.Button",
            "V5.View.Panel",
            "V5.View.NormalChart",
            "V5.View.PieChart",
            "V5.View.TableChart",
            "V5.View.Form",
            "V5.View.Divider"
        ]
    },
    {
        key: "V5.View.Button",
        remark: "按钮",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            { key: "Name", type: "text", remark: "名称" },
            { key: "CssStyle", type: "textarea", remark: "Css样式" },
            { key: "Full", type: "checkbox", remark: "最大宽度" },
            {
                key: "Size",
                type: "select",
                remark: "尺寸",
                options: ["default", "small", "large"]
            },
            {
                key: "Type",
                type: "select",
                remark: "类型",
                options: [
                    "default",
                    "primary",
                    "dashed",
                    "text",
                    "info",
                    "success",
                    "warning",
                    "error"
                ]
            },
            { key: "ActionId", type: "action", remark: "点击动作" }
        ]
    },
    {
        key: "V5.View.NormalChart",
        remark: "直角坐标系图",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "DataSourceId", type: "data", remark: "数据源" },
            { key: "xAxisBind", type: "datacolumn", remark: "X坐标绑定字段" },
            { key: "boundaryGap", type: "checkbox", remark: "x坐标留白", value: true },
            { key: "ShowZoom", type: "checkbox", remark: "是否开启区间", value: false },
            { key: "ZoomStart", type: "number", remark: "显示区间开始值", value: 0 },
            { key: "ZoomEnd", type: "number", remark: "显示区间结束值", value: 100 },
            { key: "CssStyle", type: "textarea", remark: "Css样式" }
        ],
        childs: ["V5.View.NormalChart.Serial"]
    },
    {
        key: "V5.View.PieChart",
        remark: "饼图",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "DataSourceId", type: "data", remark: "数据源" },
            { key: "Bind", type: "datacolumn", remark: "绑定字段" },
            { key: "CssStyle", type: "textarea", remark: "Css样式" }
        ],
        childs: ["V5.View.PieChart.Serial"]
    },
    {
        key: "V5.View.TableChart",
        remark: "数据表格",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "DataSourceId", type: "data", remark: "数据源" },
            {
                key: "ShowRowNumber",
                type: "checkbox",
                remark: "是否显示行号"
            },
            { key: "CssStyle", type: "textarea", remark: "Css样式" }
        ],
        childs: ["V5.View.TableChart.Column"]
    },
    {
        key: "V5.View.Panel",
        remark: "面板",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Title", type: "text", remark: "主要标题" }
        ],
        childs: [
            "V5.View.Row",
            "V5.View.Button",
            "V5.View.Panel",
            "V5.View.NormalChart",
            "V5.View.PieChart",
            "V5.View.TableChart",
            "V5.View.Divider"
        ]
    },
    {
        key: "V5.View.Form",
        remark: "表单",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Inline", type: "checkbox", remark: "行内表单", value: true },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            {
                key: "LabelPosition",
                type: "select",
                remark: "标签位置",
                options: ["left", "right", "top"]
            }
        ],
        childs: [
            "V5.View.Form.Input",
            "V5.View.Form.Number",
            "V5.View.Form.TextArea",
            "V5.View.Form.Select",
            "V5.View.Form.Date",
            "V5.View.Form.Time",
            "V5.View.Form.Check",
            "V5.View.Form.Button"
        ]
    },
    /*Windows*/
    {
        key: "V5.View.Window",
        remark: "内联窗口",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Title", type: "text", remark: "标题" },
            { key: "Width", type: "number", remark: "宽度", value: 640 },
            { key: "Height", type: "number", remark: "高度", value: 480 },
            { key: "CanClose", type: "checkbox", remark: "可否关闭" }
        ],
        childs: ["V5.View.Row"]
    },
    /*Others*/
    {
        key:"V5.View.Form.Input",
        remark:"单行文本",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "Placeholder", type: "text", remark: "占位文本" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "Path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key:"V5.View.Form.Number",
        remark:"数值",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "Path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key:"V5.View.Form.Select",
        remark:"下拉框",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "Path", type: "text", remark: "参数路径" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "DataSourceId", type: "data", remark: "数据源" },
            { key: "BindName", type: "datacolumn", remark: "绑定名称" },
            { key: "BindValue", type: "datacolumn", remark: "绑定值" }
        ],
    },
    {
        key:"V5.View.Form.SelectOption",
        remark:"下拉框选项",
        props: [
            { key: "Name", type: "text", remark: "名称" },
            { key: "Value", type: "text", remark: "值" }
        ]
    },
    {
        key:"V5.View.Form.Date",
        remark:"日期选择",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "Placeholder", type: "text", remark: "占位文本" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "Path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key:"V5.View.Form.Time",
        remark:"时间选择",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "Placeholder", type: "text", remark: "占位文本" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "Path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key:"V5.View.Form.TextArea",
        remark:"多行文本",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Label", type: "text", remark: "名称" },
            { key: "Placeholder", type: "text", remark: "占位文本" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "Path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key:"V5.View.Form.Check",
        remark:"单选",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "label", type: "text", remark: "名称" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "path", type: "text", remark: "参数路径" }
        ],
    },
    {
        key: "V5.View.Form.Button",
        remark: "按钮",
        props: [
            { key: "Id", type: "key", remark: "唯一标志" },
            { key: "label", type: "text", remark: "项名称" },
            { key: "Name", type: "text", remark: "按钮名称" },
            { key: "LabelWidth", type: "number", remark: "标签宽度", value: 80 },
            { key: "CssStyle", type: "textarea", remark: "Css样式" },
            { key: "Full", type: "checkbox", remark: "最大宽度" },
            {
                key: "Size",
                type: "select",
                remark: "尺寸",
                options: ["default", "small", "large"]
            },
            {
                key: "Type",
                type: "select",
                remark: "类型",
                options: [
                    "default",
                    "primary",
                    "dashed",
                    "text",
                    "info",
                    "success",
                    "warning",
                    "error"
                ]
            },
            { key: "ActionId", type: "action", remark: "点击动作" }
        ]
    },
    {
        key:"V5.View.Divider",
        remark:"分割线",
        props: [
            { key: "Id", type: "key", remark: "唯一标识" },
            { key: "Text", type: "text", remark: "名称" },
            { key: "Dashed", type: "checkbox", remark: "是否虚线"},
            {
                key: "Type",
                type: "select",
                remark: "类型",
                options: ["horizontal", "vertical"]
            },
            {
                key: "Orientation",
                type: "select",
                remark: "标题的位置",
                options: ["left", "right","center"]
            }
        ],
    }
    ,
    {
        key: "V5.View.NormalChart.Serial",
        remark: "直角坐标系图系列",
        props: [
            { key: "Name", type: "text", remark: "名称" },
            { key: "Bind", type: "datacolumn", remark: "绑定字段" },
            {
                key: "Type",
                type: "select",
                remark: "系列类型",
                options: ["Bar", "Line", "Dot", "Area"]
            },
            { key: "Stack", type: "text", remark: "堆叠名" }
        ]
    },
    {
        key: "V5.View.PieChart.Serial",
        remark: "饼图系列",
        props: [
            { key: "Name", type: "text", remark: "名称" },
            { key: "Bind", type: "datacolumn", remark: "绑定字段" },
            { key: "InnerRadius", type: "number", remark: "内半径", value: 0 },
            { key: "OuterRadius", type: "number", remark: "外半径", value: 100 }
        ]
    },
    {
        key: "V5.View.TableChart.Column",
        remark: "数据表格列",
        props: [
            { key: "Name", type: "text", remark: "名称" },
            { key: "Bind", type: "datacolumn", remark: "绑定字段" }
        ]
    }
]
