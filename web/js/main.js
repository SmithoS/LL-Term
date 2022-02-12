new Vue({
    el: '#app',
    data: {
        filterType: "1",
        filterSimple: "",
        filterDetail: {
            sts: {
                deadline: true,
                during: true,
                before: true,
                finished: false,
            },
            prj: {
                muji: true,
                sunshine: true,
                niji: true,
                superstar: true
            },
            tag: {
                live: true,
                archive: true,
                shop: true,
                vote: true,
                item: true,
                food: true,
                other: true
            }
        },
        terms: [],
        update: ""
    },
    created () {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData () {
            this.filter = "";
            this.update = updateTime;

            let showData = basedata;
            const DATE_FORMAT = "YYYY-MM-DDTHH:mm";
            const now = moment.utc().add(9, "hours");
            showData = showData.map((t) => {
                const startDateMoment = moment.utc(t.StartDate, DATE_FORMAT);
                const endDateMoment = moment.utc(t.EndDate, DATE_FORMAT);
                const diffEndMinutes = endDateMoment.diff(now, "minutes");
        
                let label = {};
                const borderDeadline = 48 * 60;
                if (startDateMoment.isAfter(now)) {
                    label = {
                        Cls: "before",
                        RemainingMinutes: diffEndMinutes,
                        Text: "準備中",
                        SortIdx: 3
                    };
                } else if (diffEndMinutes < 0) {
                    label = {
                        Cls: "finished",
                        RemainingMinutes: diffEndMinutes,
                        Text: "終了",
                        SortIdx: 4
                    };
                } else if (diffEndMinutes < borderDeadline) {
                    label = {
                        Cls: "deadline",
                        RemainingMinutes: diffEndMinutes,
                        Text: "終了間近",
                        SortIdx: 1
                    };
                } else {
                    label = {
                        Cls: "during",
                        RemainingMinutes: diffEndMinutes,
                        Text: "開催中",
                        SortIdx: 2
                    };
                }
                t.Label = label;


                let typeIconClass = "";
                switch (t.Type) {
                    case "term": typeIconClass = "far fa-comment"; break;
                    case "live": typeIconClass = "fas fa-microphone"; break;
                    case "shop": typeIconClass = "fas fa-store"; break;
                    case "product": typeIconClass = "fas fa-compact-disc"; break;
                }
                t.TypeIconClass = typeIconClass;

                return t;
            });

            showData.sort((a, b) => {
                const labelCompare = a.Label.SortIdx - b.Label.SortIdx;
                if (labelCompare != 0) return labelCompare;
                const endDateCompare  = a.EndDate.localeCompare(b.EndDate);
                if (endDateCompare != 0) return endDateCompare;
                const startDateCompare  = a.StartDate.localeCompare(b.StartDate);
                if (startDateCompare != 0) return startDateCompare;
                return a.Name.localeCompare(b.Name);
            });

            this.terms = showData;
        },
        isShow(t) {
            if (this.filterType == 1) {
                let tagBool = false;
                const tag = t.Tag || "";
                if (this.filterSimple == "other") {
                    tagBool = (tag == "");
                } else {
                    tagBool = (this.filterSimple == "" || tag.includes(this.filterSimple));
                }
                return tagBool && t.Label.Cls != "finished";
            } else {
                let stsBool = false;
                if (this.filterDetail.sts.deadline && t.Label.Cls == "deadline") stsBool = true;
                if (this.filterDetail.sts.during && t.Label.Cls == "during") stsBool = true;
                if (this.filterDetail.sts.before && t.Label.Cls == "before") stsBool = true;
                if (this.filterDetail.sts.finished && t.Label.Cls == "finished") stsBool = true;
                
                let prjBool = false;
                const project = t.Project || "";
                if (this.filterDetail.prj.muji && project.includes("muji") ) prjBool = true;
                if (this.filterDetail.prj.sunshine && project.includes("sunshine") ) prjBool = true;
                if (this.filterDetail.prj.niji && project.includes("niji") ) prjBool = true;
                if (this.filterDetail.prj.superstar && project.includes("superstar") ) prjBool = true;

                let tagBool = false;
                const tag = t.Tag || "";
                if (this.filterDetail.tag.live && tag.includes("live")) tagBool = true;
                if (this.filterDetail.tag.archive && tag.includes("archive")) tagBool = true;
                if (this.filterDetail.tag.shop && tag.includes("shop")) tagBool = true;
                if (this.filterDetail.tag.vote && tag.includes("vote")) tagBool = true;
                if (this.filterDetail.tag.item && tag.includes("item")) tagBool = true;
                if (this.filterDetail.tag.food && tag.includes("food")) tagBool = true;
                if (this.filterDetail.tag.other && tag == "") tagBool = true;

                return stsBool && prjBool && tagBool;
            }
        },
        getLastDayHours(t) {
            let rtn = "";
            switch (t.Label.Cls) {
                case "before":
                case "finished":
                    break;
                default:
                    const days = Math.floor(t.Label.RemainingMinutes / (24 * 60));
                    const hours = Math.floor(t.Label.RemainingMinutes / 60);
                    const minutes = t.Label.RemainingMinutes;
                    if (days > 0) {
                        rtn = "あと" + days + "日";
                    } else if (hours > 0) {
                        rtn = "あと" + hours + "時間";
                    } else {
                        rtn = "あと" + minutes + "分";
                    }
                    break;
            }
            
            return rtn;
        },
        getFormattedStartDate(t) {
            let formatDate = t.StartDate;
            return formatDate.replace("T", " ");
        },
        getFormattedEndDate(t) {
            let formatDate = t.EndDate;
            return formatDate.replace("T", " ");
        },
        geEtMsg() {
            let text = "";
            if (typeof getBDmsg == "function") {
                text = getBDmsg();
            }
            return text;
        }
    }
});