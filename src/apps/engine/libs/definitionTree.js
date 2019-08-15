/**
 * Engine Version 5.0 定义树
 * build by lijj 2019-01-02
 */
export const definitionTree = [
    {
        title: "Event",
        remark: "事件清单",
        expand: false,
        children: [
            {
                title: "OnLoad",
                key: "V5.Event.OnLoad",
                remark: "页面加载触发事件",
                props: [
                    { key: "ActionId", type: "action", remark: "指定动作" }
                ],
                children: []
            },
            {
                title: "OnInterval",
                key: "V5.Event.OnInterval",
                remark: "周期性触发事件",
                props: [
                    { key: "ActionId", type: "action", remark: "指定动作" },
                    {
                        key: "Interval",
                        type: "number",
                        remark: "执行间隔(毫秒)",
                        value: 5000
                    }
                ],
                children: []
            }
        ]
    },
    {
        title: "DataSource",
        remark: "数据源清单",
        expand: true,
        childs: [
            "V5.DataSource.Json",
            "V5.DataSource.Sql"
        ],
        children: []
    },
    {
        title: "Action",
        remark: "动作清单",
        expand: true,
        childs: [
            "V5.Action.LoadDataAction",
            "V5.Action.SubmitFormAction",
            "V5.Action.ClearFormAction",
            /*"V5.Action.OpenWindowAction",*/
            /*"V5.Action.CloseWindowAction",*/
            "V5.Action.AlertAction",
            "V5.Action.ConfirmAction",
            "V5.Action.OpenAction",
            "V5.Action.RedirectAction"
        ],
        children: []
    },
    /*
    {
        title: "Window",
        remark: "内联窗体",
        expand: true,
        childs: ["V5.View.Window"],
        children: []
    },
    */
    {
        title: "View",
        remark: "页面视图",
        expand: true,
        childs: [
            "V5.View.Form",
            "V5.View.Row",
            "V5.View.Button",
            "V5.View.Panel",
            "V5.View.NormalChart",
            "V5.View.PieChart",
            "V5.View.TableChart",
            "V5.View.Divider"
        ],
        children: []
    }
]
