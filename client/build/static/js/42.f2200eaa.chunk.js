(this["webpackJsonpbrace-client"]=this["webpackJsonpbrace-client"]||[]).push([[42],{1144:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return Y}));var n=a(12),r=a(1093),c=a(1077),i=a(854),o=a(1080),d=a(1091),l=a(1083),s=a(0),f=a(37),b=a(423),p=a(483),h=a(643),u=a(19),j=a(499),g=a(531),y=a(9),x=a(18),v=a(1084),O=a.n(v),m=a(1085),w=a.n(m),k=a(1086),D=a.n(k),C=a(1087),M=a.n(C),S=a(749),W=a.n(S),R=a(131),z=a.n(R),A=a(6),G=a(459),I=a(473),V=a(1165),B=a(126),F=a(104),L=a(475),T=a(484),E=a(639),J=a(69),N=a(1),P=[{value:"dayGridMonth",label:"Month",icon:M.a},{value:"timeGridWeek",label:"Week",icon:w.a},{value:"timeGridDay",label:"Day",icon:O.a},{value:"listWeek",label:"Agenda",icon:D.a}],_=Object(A.a)("div")((function(e){var t=e.theme;return Object(y.a)({display:"flex",alignItems:"center",flexDirection:"column",padding:t.spacing(3,0)},t.breakpoints.up("sm"),{flexDirection:"row",padding:t.spacing(1.75,3),justifyContent:"space-between"})}));function H(e){var t=e.date,a=e.view,n=e.onNextDate,r=e.onPrevDate,c=e.onToday,i=e.onChangeView;return Object(N.jsxs)(_,{children:[Object(N.jsx)(J.a,{width:"smDown",children:Object(N.jsx)(G.a,{direction:"row",spacing:1.5,children:P.map((function(e){return Object(N.jsx)(I.a,{title:e.label,children:Object(N.jsx)(V.a,{value:a,selected:e.value===a,onChange:function(){return i(e.value)},sx:{width:32,height:32,padding:0},children:Object(N.jsx)(x.a,{icon:e.icon,width:20,height:20})})},e.value)}))})}),Object(N.jsx)(B.a,{variant:"h5",sx:{my:{xs:1,sm:0}},children:Object(E.a)(t)}),Object(N.jsxs)(F.a,{sx:{display:"flex",alignItems:"center"},children:[Object(N.jsx)(L.a,{onClick:r,children:Object(N.jsx)(x.a,{icon:W.a,width:18,height:18})}),Object(N.jsx)(T.a,{size:"small",color:"error",variant:"contained",onClick:c,sx:{mx:.5},children:"\u4eca\u65e5"}),Object(N.jsx)(L.a,{onClick:n,children:Object(N.jsx)(x.a,{icon:z.a,width:18,height:18})})]})]})}var q=a(4),K=a(76),Q=Object(A.a)("div")((function(e){var t=e.theme;return{width:"calc(100% + 2px)",marginLeft:-1,marginBottom:-1,"& .fc":{"--fc-list-event-dot-width":"8px","--fc-border-color":t.palette.divider,"--fc-event-border-color":t.palette.info.light,"--fc-now-indicator-color":t.palette.error.main,"--fc-today-bg-color":t.palette.action.selected,"--fc-page-bg-color":t.palette.background.default,"--fc-neutral-bg-color":t.palette.background.neutral,"--fc-list-event-hover-bg-color":t.palette.action.hover,"--fc-highlight-color":Object(K.a)(t.palette.primary.main,.08)},"& .fc .fc-license-message":{display:"none"},"& .fc a":{color:t.palette.text.primary},"& .fc .fc-col-header ":{boxShadow:"inset 0 -1px 0 ".concat(t.palette.divider),"& th":{borderColor:"transparent"},"& .fc-col-header-cell-cushion":Object(q.a)(Object(q.a)({},t.typography.subtitle2),{},{padding:"13px 0"})},"& .fc .fc-event":{borderColor:"transparent",backgroundColor:"transparent"},"& .fc .fc-event .fc-event-main":{padding:"2px 4px",borderRadius:4,backgroundColor:t.palette.common.white,transition:t.transitions.create("filter"),"&:hover":{filter:"brightness(0.92)"},"&:before,&:after":{top:0,left:0,width:"100%",height:"100%",content:"''",borderRadius:4,position:"absolute",boxSizing:"border-box"},"&:before":{zIndex:8,opacity:.32,border:"solid 1px currentColor"},"&:after":{zIndex:7,opacity:.24,backgroundColor:"currentColor"}},"& .fc .fc-event .fc-event-main-frame":{fontSize:13,lineHeight:"20px",filter:"brightness(0.24)"},"& .fc .fc-daygrid-event .fc-event-title":{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},"& .fc .fc-event .fc-event-time":{padding:0,overflow:"unset",fontWeight:t.typography.fontWeightBold},"& .fc .fc-popover":{border:0,overflow:"hidden",boxShadow:t.customShadows.z20,borderRadius:t.shape.borderRadius,backgroundColor:t.palette.background.paper},"& .fc .fc-popover-header":Object(q.a)(Object(q.a)({},t.typography.subtitle2),{},{padding:t.spacing(1),backgroundColor:t.palette.grey[50012],borderBottom:"solid 1px ".concat(t.palette.divider)}),"& .fc .fc-popover-close":{opacity:.48,transition:t.transitions.create("opacity"),"&:hover":{opacity:1}},"& .fc .fc-more-popover .fc-popover-body":{padding:t.spacing(1.5)},"& .fc .fc-popover-body":{"& .fc-daygrid-event.fc-event-start, & .fc-daygrid-event.fc-event-end":{margin:"2px 0"}},"& .fc .fc-day-other .fc-daygrid-day-top":{opacity:1,"& .fc-daygrid-day-number":{color:t.palette.text.disabled}},"& .fc .fc-daygrid-day-number":Object(q.a)(Object(q.a)({},t.typography.body2),{},{padding:t.spacing(1,1,0)}),"& .fc .fc-daygrid-event":{marginTop:4},"& .fc .fc-daygrid-event.fc-event-start, & .fc .fc-daygrid-event.fc-event-end":{marginLeft:4,marginRight:4},"& .fc .fc-daygrid-more-link":Object(q.a)(Object(q.a)({},t.typography.caption),{},{color:t.palette.text.secondary}),"& .fc .fc-timegrid-axis-cushion":Object(q.a)(Object(q.a)({},t.typography.body2),{},{color:t.palette.text.secondary}),"& .fc .fc-timegrid-slot-label-cushion":Object(q.a)({},t.typography.body2),"& .fc-direction-ltr .fc-list-day-text, .fc-direction-rtl .fc-list-day-side-text, .fc-direction-ltr .fc-list-day-side-text, .fc-direction-rtl .fc-list-day-text":Object(q.a)({},t.typography.subtitle2),"& .fc .fc-list-event":Object(q.a)(Object(q.a)({},t.typography.body2),{},{"& .fc-list-event-time":{color:t.palette.text.secondary}}),"& .fc .fc-list-table":{"& th, td":{borderColor:"transparent"}}}})),U={title:"\u8ba2\u5355\u5230\u671f",description:"",textColor:"#1890FF",allDay:!1,start:new Date("2021-11-04 05:30:00"),end:new Date("2021-11-04 06:30:00")},X={title:"\u95ee\u9898\u5230\u671f",description:"",textColor:"#1890FF",allDay:!1,start:new Date("2021-11-06 05:30:00"),end:new Date("2021-11-06 06:30:00")};function Y(){var e=Object(f.a)(),t=Object(b.a)(e.breakpoints.down("sm")),a=Object(s.useRef)(null),y=Object(s.useState)(new Date),x=Object(n.a)(y,2),v=x[0],O=x[1],m=Object(s.useState)(t?"listWeek":"dayGridMonth"),w=Object(n.a)(m,2),k=w[0],D=w[1];Object(s.useEffect)((function(){var e=a.current;if(e){var n=e.getApi(),r=t?"listWeek":"dayGridMonth";n.changeView(r),D(r)}}),[t]);return Object(N.jsx)(j.a,{title:"\u65e5\u5386",children:Object(N.jsxs)(p.a,{maxWidth:"xl",children:[Object(N.jsx)(g.a,{heading:"\u65e5\u5386",links:[{name:"\u4e2a\u4eba\u4e2d\u5fc3",href:u.h.profile},{name:"\u65e5\u5386"}]}),Object(N.jsx)(h.a,{children:Object(N.jsxs)(Q,{children:[Object(N.jsx)(H,{date:v,view:k,onNextDate:function(){var e=a.current;if(e){var t=e.getApi();t.next(),O(t.getDate())}},onPrevDate:function(){var e=a.current;if(e){var t=e.getApi();t.prev(),O(t.getDate())}},onToday:function(){var e=a.current;if(e){var t=e.getApi();t.today(),O(t.getDate())}},onChangeView:function(e){var t=a.current;t&&(t.getApi().changeView(e),D(e))}}),Object(N.jsx)(r.a,{weekends:!0,events:[U,X],ref:a,rerenderDelay:10,initialDate:v,initialView:k,dayMaxEventRows:3,eventDisplay:"block",headerToolbar:!1,allDayMaintainDuration:!0,height:t?"auto":720,plugins:[c.a,i.b,d.a,o.a,l.a]})]})})]})})}},499:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var n=a(4),r=a(43),c=a(211),i=a(104),o=a(1),d=["title","children"];function l(e){var t=e.title,a=e.children,l=Object(r.a)(e,d);return Object(o.jsxs)(i.a,Object(n.a)(Object(n.a)({},l),{},{children:[Object(o.jsx)(c.a,{children:Object(o.jsx)("title",{children:t})}),a]}))}},531:function(e,t,a){"use strict";a.d(t,"a",(function(){return b}));var n=a(4),r=a(43),c=a(128),i=a(104),o=a(126),d=a(434),l=a(213),s=a(1),f=["links","action","heading","moreLink","sx"];function b(e){var t=e.links,a=e.action,b=e.heading,p=e.moreLink,h=void 0===p?[]:p,u=e.sx,j=Object(r.a)(e,f);return Object(s.jsxs)(i.a,{sx:Object(n.a)({mb:5},u),children:[Object(s.jsxs)(i.a,{sx:{display:"flex",alignItems:"center"},children:[Object(s.jsxs)(i.a,{sx:{flexGrow:1},children:[Object(s.jsx)(o.a,{variant:"h4",gutterBottom:!0,children:b}),Object(s.jsx)(l.a,Object(n.a)({links:t},j))]}),a&&Object(s.jsx)(i.a,{sx:{flexShrink:0},children:a})]}),Object(s.jsx)(i.a,{sx:{mt:2},children:Object(c.isString)(h)?Object(s.jsx)(d.a,{href:h,target:"_blank",variant:"body2",children:h}):h.map((function(e){return Object(s.jsx)(d.a,{noWrap:!0,href:e,variant:"body2",target:"_blank",sx:{display:"table"},children:e},e)}))})]})}},639:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return o})),a.d(t,"d",(function(){return d}));var n=a(1130),r=(a(1125),a(1132));function c(e){return Object(n.a)(new Date(e),"yyyy MMM dd")}function i(e){return Object(n.a)(new Date(e),"yyyy MMM dd p")}function o(e){return Object(n.a)(new Date(e),"yyyy/MM/dd hh:mm p")}function d(e){return Object(r.a)(new Date(e),{addSuffix:!0})}}}]);
//# sourceMappingURL=42.f2200eaa.chunk.js.map