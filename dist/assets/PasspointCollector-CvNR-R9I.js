import{k as S,d as p,v as $,o as g,c as v,f as r,w as B,b as d,A as F,C as z,D as P,E as M,u as C,F as O,e as R,G as I,n as U,T as j,_ as V,H as T}from"./index-Dgwn5dXk.js";const E={class:"card flex justify-center items-center px-4 max-h-screen"},G=["onClick"],H=["src","alt"],L=S({__name:"ImageSelector",props:{image:{}},emits:["update:image","update:imageInfo"],setup(x,{emit:h}){const e=h,u=p(["disney.jpeg","cars.jpeg","japan.jpg"]),_=p([{breakpoint:"2400px",numVisible:1,numScroll:1},{breakpoint:"1400px",numVisible:1,numScroll:1},{breakpoint:"1199px",numVisible:1,numScroll:1},{breakpoint:"767px",numVisible:1,numScroll:1},{breakpoint:"575px",numVisible:1,numScroll:1}]);function s(m){const t=new Image;t.src=m,t.onload=()=>{const n=t.naturalWidth,c=t.naturalHeight;e("update:imageInfo",{width:n,height:c,name:m.split(".")[0]}),e("update:image",m)}}return(m,t)=>{const n=$("Carousel");return g(),v("div",E,[r(n,{value:u.value,numVisible:3,numScroll:1,responsiveOptions:_.value,class:"h-full"},{item:B(c=>[d("div",{class:"flex flex-row justify-center items-center cursor-pointer",onClick:b=>s(c.data)},[d("img",{src:c.data,alt:c.data,class:"object-cover w-auto h-auto max-h-96",draggable:"false"},null,8,H)],8,G)]),_:1},8,["value","responsiveOptions"])])}}}),N=["src"],A={class:"absolute ui transition-all duration-300 -bottom-2 left-1/2 -translate-x-1/2"},D=S({__name:"PasspointsSelector",props:{image:{},size:{},show:{type:Boolean},fullScreen:{type:Boolean}},emits:["update:passpoints"],setup(x,{emit:h}){const e=x,{size:u,image:_,show:s,fullScreen:m}=F(e),t=z([]),n=p(null);function c(){t.length<=0||(t.length=t.length-1,b("update:passpoints",[...t]))}const b=h;function y(a){if(t.length>=5)return;const{left:o,top:l,width:w,height:k}=n.value.getBoundingClientRect();t.push({x:(a.clientX-o)/w*100,y:(a.clientY-l)/k*100}),b("update:passpoints",[...t])}const f=p(0),i=new ResizeObserver(()=>{var l;const{width:a,height:o}=(l=n.value)==null?void 0:l.getBoundingClientRect();f.value=u.value*Math.min(a,o)});return P(async()=>{i.observe(n.value);const{width:a,height:o}=n.value.getBoundingClientRect();f.value=u.value*Math.min(a,o)}),M(()=>{i.disconnect()}),(a,o)=>{const l=$("Button");return g(),v("div",{class:"relative w-full h-full",ref_key:"imagecontainer",ref:n},[d("img",{src:C(_),class:"w-full h-full",draggable:"false",alt:"",onClick:y},null,8,N),r(j,{name:"fade",tag:"div"},{default:B(()=>[(g(!0),v(O,null,R(t,(w,k)=>(g(),v("div",{key:k,class:I(["absolute bg-red-600 border-solid border-red-100 -translate-x-1/2 -translate-y-1/2",{"opacity-80":C(s),"opacity-0":!C(s)}]),style:U({top:`${w.y}%`,left:`${w.x}%`,width:`${f.value}px`,height:`${f.value}px`})},null,6))),128))]),_:1}),d("div",A,[r(l,{raised:"",rounded:"","aria-label":"Filter",icon:"pi pi-undo",onClick:c})])],512)}}}),W=V(D,[["__scopeId","data-v-8d6b9621"]]),X={key:0},Y={key:1},q={class:"absolute image-change ui transition-all duration-300 top-3 left-2"},J={class:"absolute toggle-show ui transition-all duration-300 top-2 left-1/2 -translate-x-1/2"},K={class:"absolute toggle-fullscreen ui transition-all duration-300 bottom-3 right-2"},Q=S({__name:"PasspointCollector",props:{image:{}},emits:["update:image","update:passpoints"],setup(x,{emit:h}){const e=p(!1),u=p(!0);p([]);const _=p(),s=z({points:[],tolerance:.05,image:{width:0,height:0,name:""}}),m=x,t=h,n=p(m.image);function c(i){n.value=i,t("update:image",i)}const b=i=>{s.points=i.map(a=>{const{x:o,y:l}=a;return{x:Math.floor(o/100*s.image.width),y:Math.floor(l/100*s.image.height)}}),t("update:passpoints",{...s})};async function y(){e.value=!e.value}function f(i){s.image=i,t("update:passpoints",{...s})}return(i,a)=>{const o=$("Button");return g(),v("div",{class:I(["justify-center ui-container flex items-center p-3 box-border transition-all duration-500",{relative:!e.value,"w-full":!e.value,"h-full":!e.value,fixed:e.value,"top-0":e.value,"left-0":e.value,"w-screen":e.value,"h-screen":e.value,"z-40":e.value,"p-4":e.value,"backdrop-blur":e.value}])},[r(j,{name:"bounce",tag:"div"},{default:B(()=>[n.value!=null&&n.value!=""?(g(),v("div",X,[r(W,{"onUpdate:passpoints":b,size:s.tolerance,image:n.value,show:u.value,fullScreen:e.value,ref_key:"selector",ref:_},null,8,["size","image","show","fullScreen"])])):(g(),v("div",Y,[r(L,{class:"image-selector","onUpdate:imageInfo":f,image:n.value,"onUpdate:image":c},null,8,["image"])]))]),_:1}),r(T,{name:"bounce"}),d("div",q,[r(o,{onClick:a[0]||(a[0]=l=>n.value=null),raised:"",rounded:"","aria-label":"Filter",icon:"pi pi-window-maximize",class:""})]),a[2]||(a[2]=d("div",null,null,-1)),d("div",J,[r(o,{onClick:a[1]||(a[1]=l=>u.value=!u.value),raised:"",rounded:"","aria-label":"Filter",icon:`pi ${u.value?"pi-eye-slash":"pi-eye"}`},null,8,["icon"])]),d("div",K,[r(o,{onClick:y,raised:"",rounded:"","aria-label":"Filter",icon:`pi ${e.value?"pi-window-minimize":"pi-expand"}`},null,8,["icon"])])],2)}}}),ee=V(Q,[["__scopeId","data-v-3ffec22e"]]);export{ee as P};
