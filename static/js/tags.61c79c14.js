(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tags"],{"76f0":function(e,t,c){"use strict";c("b1d6")},"8ea7":function(e,t,c){"use strict";c.r(t);c("b0c0");var n=c("7a23"),a={class:"flex flex-col"},r={class:"post-header"},s={class:"post-title text-white uppercase"},u={class:"bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl block"},b={key:2,class:"flex flex-row justify-center items-center"};function i(e,t,c,i,o,l){var j=Object(n["N"])("Breadcrumbs"),O=Object(n["N"])("TagItem"),g=Object(n["N"])("ob-skeleton"),d=Object(n["N"])("svg-icon"),f=Object(n["N"])("TagList");return Object(n["F"])(),Object(n["i"])("div",a,[Object(n["j"])("div",r,[Object(n["m"])(j,{current:e.t("menu.tags")},null,8,["current"]),Object(n["j"])("h1",s,Object(n["R"])(e.t("menu.tags")),1)]),Object(n["j"])("div",u,[Object(n["m"])(f,null,{default:Object(n["X"])((function(){return[e.tags&&e.tags.length>0?(Object(n["F"])(!0),Object(n["i"])(n["a"],{key:0},Object(n["L"])(e.tags,(function(e){return Object(n["F"])(),Object(n["g"])(O,{key:e.slug,name:e.name,slug:e.slug,count:e.count,size:"xl"},null,8,["name","slug","count"])})),128)):e.tags?(Object(n["F"])(),Object(n["g"])(g,{key:1,tag:"li",count:10,height:"20px",width:"3rem"})):(Object(n["F"])(),Object(n["i"])("div",b,[Object(n["m"])(d,{class:"stroke-ob-bright mr-2","icon-class":"warning"}),Object(n["l"])(" "+Object(n["R"])(e.t("settings.empty-tag")),1)]))]})),_:1})])])}var o=c("1da1"),l=(c("96cf"),c("b6c6")),j=c("47e2"),O=c("6141"),g=c("a899"),d=c("5701"),f=Object(n["n"])({name:"Tag",components:{Breadcrumbs:l["a"],TagList:g["b"],TagItem:g["a"]},setup:function(){var e=Object(d["a"])(),t=Object(j["b"])(),a=t.t,r=Object(O["a"])(),s=function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:r.fetchAllTags(),e.setHeaderImage("".concat(c("87d4")));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(n["z"])(s),Object(n["D"])((function(){e.resetHeaderImage()})),{tags:Object(n["e"])((function(){return r.isLoaded&&0===r.tags.length?null:r.tags})),t:a}}}),m=c("6b0d"),p=c.n(m);const h=p()(f,[["render",i]]);t["default"]=h},b1d6:function(e,t,c){},b6c6:function(e,t,c){"use strict";var n=c("7a23"),a={class:"breadcrumbs flex flex-row gap-6 text-white"};function r(e,t,c,r,s,u){return Object(n["F"])(),Object(n["i"])("ul",a,[Object(n["j"])("li",null,Object(n["R"])(e.t("menu.home")),1),Object(n["j"])("li",null,Object(n["R"])(e.current),1)])}var s=c("47e2"),u=Object(n["n"])({name:"Breadcrumb",props:{current:String},setup:function(){var e=Object(s["b"])(),t=e.t;return{t:t}}}),b=(c("76f0"),c("6b0d")),i=c.n(b);const o=i()(u,[["render",r],["__scopeId","data-v-4170130a"]]);t["a"]=o}}]);