(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,t,a){},102:function(e,t,a){},107:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),c=a(20),o=a.n(c),s=(a(57),a(13)),l=a(14),i=a(16),u=a(15),m=a(17),d=(a(59),a(110)),E=a(108),h=a(109),p=a(111),g=a(112),w=a(113),f=a(126),b=a(114),v=a(115),A=a(116),O=a(75),y=a(125),j=a(117),M=a(118),x=a(119),C=a(120),N=a(76),k=a(121),B=a(122),I=a(32),R=a(26),S=(a(65),function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(i.a)(this,Object(u.a)(t).call(this))).toggleModal=function(){e.setState({isModalLogin:!e.state.isModalLogin})},e._onUsernameChange=function(){e.setState({username:!e.state.username})},e._onPasswordChange=function(){e.setState({password:!e.state.password})},e.state={isOpen:!0,isLogin:!1,isModalLogin:!1,user_info:{username:"",password:"",isValid:!1}},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"navbar"},r.a.createElement(E.a,{fixed:"top",color:"light",light:!0,expand:"md"},r.a.createElement(h.a,null,r.a.createElement(d.a,{className:"nav-link",to:"/"},r.a.createElement("img",{alt:"cat",width:"100",height:"50",src:a(67)}))),r.a.createElement(p.a,{isOpen:this.state.isOpen,navbar:!0},r.a.createElement(g.a,null,r.a.createElement(w.a,null,r.a.createElement(d.a,{className:"nav-link",to:"/list_order"},"LIST")),r.a.createElement(w.a,null,r.a.createElement(d.a,{className:"nav-link",to:"/addprice"},"ADD PRICE")),r.a.createElement(w.a,null,r.a.createElement(d.a,{className:"nav-link",to:"/command"},"COMMAND")))),r.a.createElement(p.a,{isOpen:this.state.isLogin},r.a.createElement(g.a,null,r.a.createElement(f.a,{nav:!0,inNavbar:!0},r.a.createElement(b.a,{nav:!0,caret:!0},"NAME"),r.a.createElement(v.a,{right:!0},r.a.createElement(A.a,null,"Your Profile"),r.a.createElement(A.a,null,"Setting"),r.a.createElement(A.a,{divider:!0}),r.a.createElement(A.a,null,"Logout"))))),r.a.createElement(p.a,{isOpen:!this.state.isLogin},r.a.createElement(g.a,null,r.a.createElement(w.a,null,r.a.createElement(O.a,{onClick:this.toggleModal,outline:!0,color:"primary"},"Login")))),r.a.createElement(y.a,{toggle:this.toggleModal,isOpen:this.state.isModalLogin,backdrop:!0},r.a.createElement(j.a,{toggle:this.toggleModal},"LOGIN FORM"),r.a.createElement(M.a,null,r.a.createElement(x.a,null,r.a.createElement(C.a,{addonType:"prepend"},r.a.createElement(N.a,null,r.a.createElement(I.b,null))),r.a.createElement(k.a,{valid:this.state.user_info.isValid,onChange:this._onUsernameChange,type:"text",placeholder:"Username"})),r.a.createElement("br",null),r.a.createElement(x.a,null,r.a.createElement(C.a,{addonType:"prepend"},r.a.createElement(N.a,null,r.a.createElement(I.a,null))),r.a.createElement(k.a,{valid:this.state.user_info.isValid,onChange:this._onPasswordChange,type:"password",placeholder:"Password"}))),r.a.createElement(B.a,null,r.a.createElement(O.a,{color:"primary"},"Login"),r.a.createElement(O.a,{color:"warning",onClick:this.toggleModal},"Cancel")))))}}]),t}(n.Component)),D=Object(R.b)(function(e){return{isLogin:e.auth.isLogin}},function(e){return{onSubmitLogin:function(t){e(function(e){return{type:"USER_LOGIN",payload:e}}(t))}}})(S),L=a(10),Y=a.n(L),T=a(18),U=a(21),G=a.n(U),H="http://60418e49.ngrok.io",J=(a(98),H+"/api/v1/send/message"),Z=function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(i.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={msg:""},a._sendMessage=Object(T.a)(Y.a.mark(function e(){var t,n,r;return Y.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t={message:a.state.msg},n={headers:{"Content-Type":"application/json"}},a.setState({msg:""}),e.next=5,G.a.post(J,t,n).catch(function(e){return console.log("error: ",e)});case 5:r=e.sent,console.log(r);case 7:case"end":return e.stop()}},e,this)})),a._onChangeMessage=function(e){a.setState({msg:e.target.value})},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"sendmsg"},r.a.createElement(x.a,null,r.a.createElement(k.a,{className:"textarea-size",onChange:this._onChangeMessage,value:this.state.msg,type:"textarea",placeholder:"Enter your text..."}),r.a.createElement(C.a,{addonType:"append"},r.a.createElement(O.a,{color:"success",onClick:this._sendMessage},"Send Message"))))}}]),t}(n.Component),W=(a(100),H+"/api/v1/listorder"),F=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(i.a)(this,Object(u.a)(t).call(this))).componentDidMount=Object(T.a)(Y.a.mark(function t(){var a,n;return Y.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,G.a.get(W,{});case 2:a=t.sent,n=a.data.orders,console.log("fetch: ",n),e.setState({orders:n});case 6:case"end":return t.stop()}},t,this)})),e.state={orders:[]},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this.state.orders.map(function(e,t){return r.a.createElement("li",{key:t},e.orderName," [",e.name,"]")});return r.a.createElement(n.Fragment,null,r.a.createElement("div",{className:"order-container"},r.a.createElement("ol",{className:"list-order"},e)))}}]),t}(n.Component),X=H+"/api/v1/listorder",Q=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(i.a)(this,Object(u.a)(t).call(this))).componentDidMount=Object(T.a)(Y.a.mark(function t(){var a,n;return Y.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,G.a.get(X,{});case 2:a=t.sent,n=a.data.orders,console.log(n),e.setState({orders:n});case 6:case"end":return t.stop()}},t,this)})),e.state={orders:[]},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this.state.orders.map(function(e){return r.a.createElement("li",{key:e.id},e.orderName," [",e.name,"]")});return r.a.createElement(n.Fragment,null,r.a.createElement("div",null,r.a.createElement("ol",null,e)))}}]),t}(n.Component),z=(a(102),H+"/api/v1/summary"),V=H+"/api/v1/howto",q=function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(i.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={isDisabled:!1},a._onSummaryClick=Object(T.a)(Y.a.mark(function e(){var t;return Y.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a._setDisabledAwhile(),e.next=3,G.a.get(z,{});case 3:t=e.sent,console.log(t);case 5:case"end":return e.stop()}},e,this)})),a._onHowtoClick=Object(T.a)(Y.a.mark(function e(){var t;return Y.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a._setDisabledAwhile(),e.next=3,G.a.get(V,{});case 3:t=e.sent,console.log(t);case 5:case"end":return e.stop()}},e,this)})),a._setDisabledAwhile=Object(T.a)(Y.a.mark(function e(){return Y.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setState({isDisabled:!0});case 2:setTimeout(function(){a.setState({isDisabled:!1})},3e3);case 3:case"end":return e.stop()}},e,this)})),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"command-list"},r.a.createElement("div",null,r.a.createElement(O.a,{disabled:this.state.isDisabled,onClick:this._onHowtoClick,style:P.buttonStyles,color:"primary"},"HOW TO")),r.a.createElement("div",null,r.a.createElement(O.a,{disabled:!0,style:P.buttonStyles,color:"success"},"START ORDER")),r.a.createElement("div",null,r.a.createElement(O.a,{disabled:this.state.isDisabled,onClick:this._onSummaryClick,style:P.buttonStyles,color:"info"},"SUMMARY")),r.a.createElement("div",null,r.a.createElement(O.a,{disabled:!0,style:P.buttonStyles,color:"warning"},"END ORDER")))}}]),t}(n.Component),P={buttonStyles:{marginTop:"20px",width:"150px"}},K=q,_=a(123),$=function(e){function t(){return Object(s.a)(this,t),Object(i.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(D,null),r.a.createElement("header",{className:"App-header"},r.a.createElement(_.a,{exact:!0,path:"/",component:Z}),r.a.createElement(_.a,{exact:!0,path:"/list_order",component:F}),r.a.createElement(_.a,{exact:!0,path:"/addprice",component:Q}),r.a.createElement(_.a,{exact:!0,path:"/command",component:K})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var ee=a(124),te=a(22),ae=a(49),ne=a(51),re={isLogin:!1,username:"",password:""},ce=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:re,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"USER_LOGIN":return Object(ne.a)({},e,{username:t.payload.username,password:t.payload.password,isLogin:!0});default:return e}},oe=Object(te.combineReducers)({auth:ce}),se=a(50),le=Object(te.createStore)(oe,Object(se.composeWithDevTools)(Object(te.applyMiddleware)(ae.a))),ie=(a(105),r.a.createElement(R.a,{store:le},r.a.createElement(ee.a,null,r.a.createElement($,null))));document.title="LINE BOT MANAGER",o.a.render(ie,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},52:function(e,t,a){e.exports=a(107)},57:function(e,t,a){},59:function(e,t,a){},65:function(e,t,a){},67:function(e,t){e.exports="data:image/png;base64,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"},98:function(e,t,a){}},[[52,2,1]]]);
//# sourceMappingURL=main.8128cde0.chunk.js.map