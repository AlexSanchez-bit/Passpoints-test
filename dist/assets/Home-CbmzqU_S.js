import{B as M,o,c,m as n,r as l,a as d,b as a,s as I,h as m,_ as z,d as S,e as q,F as B,f as P,g as b,u as h,i as f,w as v,j as k,k as A,n as N,t as w}from"./index-DAV8n5IW.js";var j=function(s){var t=s.dt;return`
.p-card {
    background: `.concat(t("card.background"),`;
    color: `).concat(t("card.color"),`;
    box-shadow: `).concat(t("card.shadow"),`;
    border-radius: `).concat(t("card.border.radius"),`;
    display: flex;
    flex-direction: column;
}

.p-card-caption {
    display: flex;
    flex-direction: column;
    gap: `).concat(t("card.caption.gap"),`;
}

.p-card-body {
    padding: `).concat(t("card.body.padding"),`;
    display: flex;
    flex-direction: column;
    gap: `).concat(t("card.body.gap"),`;
}

.p-card-title {
    font-size: `).concat(t("card.title.font.size"),`;
    font-weight: `).concat(t("card.title.font.weight"),`;
}

.p-card-subtitle {
    color: `).concat(t("card.subtitle.color"),`;
}
`)},F={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},V=M.extend({name:"card",theme:j,classes:F}),L={name:"BaseCard",extends:I,style:V,provide:function(){return{$pcCard:this,$parentInstance:this}}},x={name:"Card",extends:L,inheritAttrs:!1};function D(e,s,t,i,r,y){return o(),c("div",n({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(o(),c("div",n({key:0,class:e.cx("header")},e.ptm("header")),[l(e.$slots,"header")],16)):d("",!0),a("div",n({class:e.cx("body")},e.ptm("body")),[e.$slots.title||e.$slots.subtitle?(o(),c("div",n({key:0,class:e.cx("caption")},e.ptm("caption")),[e.$slots.title?(o(),c("div",n({key:0,class:e.cx("title")},e.ptm("title")),[l(e.$slots,"title")],16)):d("",!0),e.$slots.subtitle?(o(),c("div",n({key:1,class:e.cx("subtitle")},e.ptm("subtitle")),[l(e.$slots,"subtitle")],16)):d("",!0)],16)):d("",!0),a("div",n({class:e.cx("content")},e.ptm("content")),[l(e.$slots,"content")],16),e.$slots.footer?(o(),c("div",n({key:1,class:e.cx("footer")},e.ptm("footer")),[l(e.$slots,"footer")],16)):d("",!0)],16)],16)}x.render=D;/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var u={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=({size:e,strokeWidth:s=2,absoluteStrokeWidth:t,color:i,iconNode:r,name:y,class:ee,...$},{slots:g})=>m("svg",{...u,width:e||u.width,height:e||u.height,stroke:i||u.stroke,"stroke-width":t?Number(s)*24/Number(e):s,class:["lucide",`lucide-${R(y??"icon")}`],...$},[...r.map(C=>m(...C)),...g.default?[g.default()]:[]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(e,s)=>(t,{slots:i})=>m(Z,{...t,iconNode:s,name:e},i);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=p("FingerprintIcon",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=p("LockIcon",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=p("MousePointerIcon",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=p("ShieldCheckIcon",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=p("ZapIcon",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),U={class:"min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"},_={class:"container mx-auto px-4 py-16"},G={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"},J={class:"flex items-center justify-center mb-4"},Q={class:"text-xl font-bold text-gray-800 text-center"},X={class:"text-gray-600"},Y={class:"flex flex-row gap-3 items-center justify-center"},W={__name:"Home",setup(e){const s=S([{icon:O,iconColor:"#9333ea",title:"Selección Intuitiva",description:"Su contraseña consistirá en una selección de 5 puntos de una imagen donde el ¡ORDEN IMPORTA!"},{icon:T,iconColor:"#16a34a",title:"Mayor Seguridad",description:"Passpoints tiene un espacio de contraseñas mayor, por lo que su autenticación será más segura que el método tradicional sin tener que recordar tediosas y largas contraseñas"},{icon:K,iconColor:"#ca8a04",title:"Fácil de recordar",description:"Passpoints aprovecha la capacidad humana para recordar patrones en imágenes, por lo que olvidar una contraseña una vez registrada será casi imposible"},{icon:E,iconColor:"#2563eb",title:"Utilice patrones únicos y personalizados",description:"Seleccione los puntos más sencillos de recordar para usted de la imagen que prefiera"},{icon:H,iconColor:"#dc2626",title:"Resistente a ataques",description:"Passpoints ofrece mayor resistencia a ataques comunes en contraseñas alfanuméricas, como ataques de diccionario y fuerza bruta "}]);return(t,i)=>(o(),c("div",U,[a("div",_,[i[0]||(i[0]=a("header",{class:"text-center mb-16"},[a("h1",{class:"text-4xl md:text-6xl font-bold text-white mb-4"},[q(" Implementación del sistema de autenticación gráfica "),a("b",{class:"text-purple-600"}," Passpoints ")]),a("p",{class:"text-xl text-white opacity-90"}," Seguro, Intuitivo, y Fácil de usar ")],-1)),a("div",G,[(o(!0),c(B,null,P(s.value,r=>(o(),f(h(x),{key:r.title,class:"bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 p-2 rounded-lg shadow-zinc-300 hover:scale-110"},{header:v(()=>[a("div",J,[(o(),f(A(r.icon),{class:"w-10 h-10",style:N({color:r.iconColor})},null,8,["style"]))]),a("h2",Q,w(r.title),1)]),content:v(()=>[a("p",X,w(r.description),1)]),_:2},1024))),128))]),a("div",Y,[b(h(k),{as:"a",href:"https://revistatelematica.cujae.edu.cu/index.php/tele/article/view/970",label:"Aprender más sobre esta implementación",class:"p-button-lg bg-white text-purple-600 hover:bg-purple-100"}),b(h(k),{as:"router-link",to:{name:"register"},label:"Comenzar a usar el sistema",class:"p-button-lg bg-white text-purple-600 hover:bg-purple-100"})])])]))}},ae=z(W,[["__scopeId","data-v-51377f13"]]);export{ae as default};
